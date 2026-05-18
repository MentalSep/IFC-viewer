import React, { useEffect, useMemo, useRef, useState } from "react";
import type { SelectedElementData } from "./PropertiesPanel";
import type { ViewerCopy } from "../utils/viewerI18n";

interface Planning4DPanelProps {
  projectId: string;
  selectedElement: SelectedElementData | null;
  copy: ViewerCopy["planning"];
  getViewerCanvas: () => HTMLCanvasElement | null;
  onStepChange: (task: PlanningTask, index: number) => void;
}

export interface PlanningTask {
  id: string;
  name: string;
  start: string | null;
  end: string | null;
  predecessors: string[];
  source: "MS Project" | "Primavera P6" | "Asta Powerproject" | "Generic XML";
}

interface ObjectTaskLink {
  taskId: string;
  expressId: number;
  elementType: string;
}

interface SequencingIssue {
  severity: "warning" | "error";
  message: string;
}

interface StoredPlanningState {
  tasks: PlanningTask[];
  links: ObjectTaskLink[];
}

const PLAY_DIRECTIONS = ["iso", "front", "right", "top", "left", "back", "bottom"] as const;

function detectSource(doc: XMLDocument): PlanningTask["source"] {
  const root = doc.documentElement?.tagName.toLowerCase() ?? "";
  const xmlText = new XMLSerializer().serializeToString(doc).toLowerCase();

  if (root.includes("project") && xmlText.includes("predecessorlink")) {
    return "MS Project";
  }
  if (xmlText.includes("primavera") || xmlText.includes("activity")) {
    return "Primavera P6";
  }
  if (xmlText.includes("powerproject") || xmlText.includes("asta")) {
    return "Asta Powerproject";
  }
  return "Generic XML";
}

function parseDate(value: string | null): number | null {
  if (!value) return null;
  const t = Date.parse(value);
  return Number.isNaN(t) ? null : t;
}

function normalizePredecessors(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(/[;, ]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.replace(/[^A-Za-z0-9_-]/g, ""));
}

function mapElementFields(node: Element): Map<string, string> {
  const fields = new Map<string, string>();
  const descendants = Array.from(node.getElementsByTagName("*"));
  descendants.forEach((el) => {
    const key = el.localName.toLowerCase();
    if (!fields.has(key)) {
      const value = el.textContent?.trim() ?? "";
      if (value) {
        fields.set(key, value);
      }
    }
  });
  return fields;
}

function pick(fields: Map<string, string>, names: string[]): string | null {
  for (const name of names) {
    const value = fields.get(name.toLowerCase());
    if (value) return value;
  }
  return null;
}

function parsePlanningXml(xmlText: string): PlanningTask[] {
  const doc = new DOMParser().parseFromString(xmlText, "application/xml");
  const parserError = doc.querySelector("parsererror");
  if (parserError) {
    throw new Error("Invalid XML file");
  }

  const source = detectSource(doc);
  const taskNodes = [
    ...Array.from(doc.getElementsByTagName("Task")),
    ...Array.from(doc.getElementsByTagName("task")),
    ...Array.from(doc.getElementsByTagName("Activity")),
    ...Array.from(doc.getElementsByTagName("activity")),
    ...Array.from(doc.getElementsByTagName("Bar")),
    ...Array.from(doc.getElementsByTagName("bar")),
  ];

  const tasks: PlanningTask[] = [];
  taskNodes.forEach((node, index) => {
    const fields = mapElementFields(node);
    const id =
      pick(fields, ["uid", "id", "taskuid", "activityid", "code", "wbs"]) ??
      `task-${index + 1}`;
    const name =
      pick(fields, ["name", "taskname", "activityname", "title"]) ??
      `Task ${index + 1}`;
    const start = pick(fields, [
      "start",
      "startdate",
      "plannedstart",
      "plannedstartdate",
      "earlystart",
    ]);
    const end = pick(fields, [
      "finish",
      "end",
      "finishdate",
      "plannedfinish",
      "plannedfinishdate",
      "earlyfinish",
    ]);
    const predecessors = normalizePredecessors(
      pick(fields, ["predecessoruid", "predecessorid", "predecessors", "predecessor"]),
    );

    tasks.push({ id, name, start, end, predecessors, source });
  });

  const unique = new Map<string, PlanningTask>();
  tasks.forEach((task) => {
    if (!unique.has(task.id)) {
      unique.set(task.id, task);
    }
  });
  return Array.from(unique.values());
}

function analyzeSequencing(
  tasks: PlanningTask[],
  links: ObjectTaskLink[],
  copy: ViewerCopy["planning"],
): SequencingIssue[] {
  const issues: SequencingIssue[] = [];
  const linkedTaskIds = new Set(links.map((link) => link.taskId));
  const taskById = new Map(tasks.map((task) => [task.id, task]));

  tasks.forEach((task) => {
    const start = parseDate(task.start);
    const end = parseDate(task.end);
    if (start === null || end === null) {
      issues.push({
        severity: "warning",
        message: `${copy.issueMissingDates}: ${task.name}`,
      });
      return;
    }
    if (end < start) {
      issues.push({
        severity: "error",
        message: `${copy.issueInvalidRange}: ${task.name}`,
      });
    }
    task.predecessors.forEach((pred) => {
      if (!taskById.has(pred)) {
        issues.push({
          severity: "warning",
          message: `${copy.issueUnknownPredecessor}: ${task.name} -> ${pred}`,
        });
      }
    });
    if (!linkedTaskIds.has(task.id)) {
      issues.push({
        severity: "warning",
        message: `${copy.issueUnlinkedTask}: ${task.name}`,
      });
    }
  });

  const scheduled = tasks
    .map((task) => ({ task, start: parseDate(task.start), end: parseDate(task.end) }))
    .filter((item) => item.start !== null && item.end !== null)
    .sort((a, b) => (a.start as number) - (b.start as number));

  for (let i = 1; i < scheduled.length; i += 1) {
    const prev = scheduled[i - 1];
    const current = scheduled[i];
    if ((current.start as number) < (prev.end as number)) {
      const hasDependency = current.task.predecessors.includes(prev.task.id);
      if (!hasDependency) {
        issues.push({
          severity: "warning",
          message: `${copy.issueOverlap}: ${prev.task.name} / ${current.task.name}`,
        });
      }
    }
  }

  return issues;
}

function storageKey(projectId: string) {
  return `ifc_planning_4d_${projectId}`;
}

export default function Planning4DPanel({
  projectId,
  selectedElement,
  copy,
  getViewerCanvas,
  onStepChange,
}: Planning4DPanelProps) {
  const [tasks, setTasks] = useState<PlanningTask[]>([]);
  const [links, setLinks] = useState<ObjectTaskLink[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [stepDurationMs, setStepDurationMs] = useState(1200);
  const [exporting, setExporting] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey(projectId));
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as StoredPlanningState;
      setTasks(parsed.tasks ?? []);
      setLinks(parsed.links ?? []);
      setImportStatus("");
    } catch {
      localStorage.removeItem(storageKey(projectId));
    }
  }, [projectId]);

  useEffect(() => {
    const payload: StoredPlanningState = { tasks, links };
    localStorage.setItem(storageKey(projectId), JSON.stringify(payload));
  }, [projectId, tasks, links]);

  useEffect(() => {
    if (!playing || tasks.length === 0) return;
    timerRef.current = window.setTimeout(() => {
      setActiveIndex((prev) => {
        const next = prev + 1 >= tasks.length ? 0 : prev + 1;
        return next;
      });
    }, stepDurationMs);
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [playing, tasks, activeIndex, stepDurationMs]);

  useEffect(() => {
    if (tasks.length === 0) return;
    const task = tasks[Math.min(activeIndex, tasks.length - 1)];
    onStepChange(task, activeIndex);
  }, [activeIndex, onStepChange, tasks]);

  const issues = useMemo(() => analyzeSequencing(tasks, links, copy), [copy, links, tasks]);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const xml = await file.text();
      const parsed = parsePlanningXml(xml);
      setTasks(parsed);
      setLinks([]);
      setActiveIndex(0);
      if (parsed.length > 0) {
        setSelectedTaskId(parsed[0].id);
        setImportStatus(`${parsed[0].source} · ${parsed.length} ${copy.tasksImported}`);
      } else {
        setSelectedTaskId("");
        setImportStatus(copy.noTasksFound);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : copy.importFailed;
      setImportStatus(`${copy.importFailed}: ${message}`);
    } finally {
      event.target.value = "";
    }
  };

  const linkSelectedElement = () => {
    if (!selectedElement || selectedElement.expressId <= 0 || !selectedTaskId) return;
    setLinks((prev) => {
      const filtered = prev.filter((item) => item.expressId !== selectedElement.expressId);
      return [
        ...filtered,
        {
          taskId: selectedTaskId,
          expressId: selectedElement.expressId,
          elementType: selectedElement.type,
        },
      ];
    });
  };

  const removeLink = (expressId: number) => {
    setLinks((prev) => prev.filter((link) => link.expressId !== expressId));
  };

  const exportVideo = async () => {
    if (tasks.length === 0) {
      setImportStatus(copy.importFirst);
      return;
    }
    const canvas = getViewerCanvas();
    if (!canvas) {
      setImportStatus(copy.viewerUnavailable);
      return;
    }
    if (typeof MediaRecorder === "undefined") {
      setImportStatus(copy.recorderUnavailable);
      return;
    }

    const mp4Type = "video/mp4;codecs=h264";
    const webmType = "video/webm;codecs=vp9";
    const mimeType = MediaRecorder.isTypeSupported(mp4Type)
      ? mp4Type
      : MediaRecorder.isTypeSupported(webmType)
        ? webmType
        : "";
    if (!mimeType) {
      setImportStatus(copy.recorderUnavailable);
      return;
    }

    const stream = canvas.captureStream(25);
    const chunks: BlobPart[] = [];
    const recorder = new MediaRecorder(stream, { mimeType });
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    const blobPromise = new Promise<Blob>((resolve) => {
      recorder.onstop = () => {
        resolve(new Blob(chunks, { type: mimeType }));
      };
    });

    setExporting(true);
    setPlaying(true);
    setActiveIndex(0);
    recorder.start();

    const totalDuration = Math.max(tasks.length * stepDurationMs, 2200);
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        recorder.stop();
        resolve();
      }, totalDuration);
    });

    const blob = await blobPromise;
    stream.getTracks().forEach((track) => track.stop());

    setPlaying(false);
    setExporting(false);

    const extension = mimeType.includes("mp4") ? "mp4" : "webm";
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `4d-simulation.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
    if (extension === "mp4") {
      setImportStatus(copy.exportReadyMp4);
    } else {
      setImportStatus(copy.exportReadyWebm);
    }
  };

  const activeTask = tasks[Math.min(activeIndex, Math.max(tasks.length - 1, 0))] ?? null;

  return (
    <div className="planning4d-panel">
      <section className="planning4d-section">
        <h3>{copy.importTitle}</h3>
        <p>{copy.importSubtitle}</p>
        <label className="planning4d-upload">
          <input type="file" accept=".xml,text/xml,application/xml" onChange={handleImport} />
          <span>{copy.importButton}</span>
        </label>
        {importStatus && <p className="planning4d-status">{importStatus}</p>}
      </section>

      <section className="planning4d-section">
        <h3>{copy.linkingTitle}</h3>
        <p>{copy.linkingSubtitle}</p>
        <div className="planning4d-link-form">
          <select
            value={selectedTaskId}
            onChange={(event) => setSelectedTaskId(event.target.value)}
            disabled={tasks.length === 0}
          >
            <option value="">{copy.selectTask}</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="planning4d-btn"
            onClick={linkSelectedElement}
            disabled={!selectedElement || selectedElement.expressId <= 0 || !selectedTaskId}
          >
            {copy.linkButton}
          </button>
        </div>
        <p className="planning4d-selection">
          {selectedElement
            ? `${copy.selectedElement}: ${selectedElement.type} #${selectedElement.expressId}`
            : copy.noElementSelected}
        </p>
        <div className="planning4d-links">
          {links.length === 0 ? (
            <p className="planning4d-empty">{copy.noLinks}</p>
          ) : (
            links.map((link) => {
              const linkedTask = tasks.find((task) => task.id === link.taskId);
              return (
                <div key={link.expressId} className="planning4d-link-item">
                  <div>
                    <strong>{linkedTask?.name ?? link.taskId}</strong>
                    <span>
                      {link.elementType} #{link.expressId}
                    </span>
                  </div>
                  <button type="button" onClick={() => removeLink(link.expressId)}>
                    {copy.unlinkButton}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="planning4d-section">
        <h3>{copy.playerTitle}</h3>
        <p>{copy.playerSubtitle}</p>
        <div className="planning4d-player-row">
          <button type="button" className="planning4d-btn" onClick={() => setPlaying((v) => !v)}>
            {playing ? copy.pause : copy.play}
          </button>
          <button type="button" className="planning4d-btn" onClick={exportVideo} disabled={exporting}>
            {exporting ? copy.exporting : copy.exportMp4}
          </button>
        </div>
        <label className="planning4d-speed">
          {copy.stepDuration}
          <input
            type="range"
            min={600}
            max={2800}
            step={100}
            value={stepDurationMs}
            onChange={(event) => setStepDurationMs(Number(event.target.value))}
          />
        </label>
        <p className="planning4d-status">
          {activeTask ? `${copy.currentTask}: ${activeTask.name}` : copy.noTasksFound}
        </p>
      </section>

      <section className="planning4d-section">
        <h3>{copy.predictiveTitle}</h3>
        <p>{copy.predictiveSubtitle}</p>
        {issues.length === 0 ? (
          <p className="planning4d-ok">{copy.noIssues}</p>
        ) : (
          <div className="planning4d-issues">
            {issues.map((issue, index) => (
              <div key={`${issue.message}-${index}`} className={`planning4d-issue ${issue.severity}`}>
                {issue.message}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export { PLAY_DIRECTIONS };
