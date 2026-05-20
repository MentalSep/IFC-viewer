import { useMemo } from "react";
import PropertiesPanel from "../../components/PropertiesPanel";
import ElementComments, { type ProfessionalRole } from "../../components/ElementComments";
import DocumentBrowser from "../../components/DocumentBrowser";
import Planning4DPanel, { type PlanningTask } from "../../components/Planning4DPanel";
import Cost5DPanel from "../../components/Cost5DPanel";
import { BimSearchPanel, type BimSearchResult } from "../../components/workspace/BimSearchPanel";
import { HeatmapLegend, type HeatmapMode } from "../../components/workspace/HeatmapLegend";
import { WorkspaceTimeline } from "../../components/workspace/WorkspaceTimeline";
import { WorkspaceActivityFeed, type WorkspaceActivityItem } from "../../components/workspace/WorkspaceActivityFeed";
import type { SelectedElementData } from "../../components/PropertiesPanel";

export type UIMode = "VIEW" | "SELECT" | "ANALYSIS" | "SIMULATION";

interface InspectorProps {
  mode: UIMode;
  selection: SelectedElementData | null;
  projectId?: string | null;
  comments: any[];
  activityItems: WorkspaceActivityItem[];
  searchQuery: string;
  searchResults: BimSearchResult[];
  searchChips: string[];
  heatmapMode: HeatmapMode;
  timeline: {
    phases: PlanningTask[];
    currentPhaseIndex: number;
    progress: number;
    speed: number;
    playing: boolean;
  };
  copy: any;
  onSearchChange: (value: string) => void;
  onChipClick: (value: string) => void;
  onResultClick: (id: string) => void;
  onModeChange: (mode: UIMode) => void;
  onHeatmapModeChange: (mode: HeatmapMode) => void;
  onTimelineProgressChange: (progress: number) => void;
  onTimelineSpeedChange: (speed: number) => void;
  onTimelineTogglePlay: () => void;
  getViewerCanvas: () => HTMLCanvasElement | null;
  onSelectDocument: (file: File) => void;
  onUploadClick: () => void;
  userName: string;
  userRole: ProfessionalRole;
  onAddComment: (comment: any) => void;
  onStepChange: (task: PlanningTask, index: number) => void;
  getQuantitySummary: () => unknown[];
  getElementQuantity: (expressId: number) => unknown;
  setElementProgress: (expressId: number, progress: number) => boolean;
}

export function ContextInspector(props: InspectorProps) {
  const {
    mode,
    selection,
    projectId,
    comments,
    activityItems,
    searchQuery,
    searchResults,
    searchChips,
    heatmapMode,
    timeline,
    copy,
  } = props;
  const workspaceCopy = copy.workspace;
  const documentsCopy = copy.documents;
  const costingCopy = copy.costing;
  const planningCopy = copy.planning;
  const timelinePhases = useMemo(
    () => timeline.phases.map((phase) => ({ id: phase.id, label: phase.name, description: phase.source })),
    [timeline.phases],
  );

  return (
    <aside className="panel context-inspector">
      <div className="panel-header">
        <div>
          <p className="panel-subtitle">Context</p>
          <h3>{mode}</h3>
        </div>
        <span className="panel-pill">{selection ? "Selection" : "Overview"}</span>
      </div>

      <div className="panel-tab-row" style={{ marginTop: 12 }}>
        <button type="button" className={`panel-pill ${mode === "VIEW" ? "active" : ""}`} onClick={() => props.onModeChange("VIEW")}>
          Overview
        </button>
        <button type="button" className={`panel-pill ${mode === "SELECT" ? "active" : ""}`} onClick={() => props.onModeChange("SELECT")}>
          Comments
        </button>
        <button type="button" className={`panel-pill ${mode === "ANALYSIS" ? "active" : ""}`} onClick={() => props.onModeChange("ANALYSIS")}>
          Heatmap / 5D
        </button>
        <button type="button" className={`panel-pill ${mode === "SIMULATION" ? "active" : ""}`} onClick={() => props.onModeChange("SIMULATION")}>
          4D Timeline
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        {mode === "ANALYSIS" ? (
          <div className="panel-grid">
            <HeatmapLegend mode={heatmapMode} onModeChange={props.onHeatmapModeChange} copy={workspaceCopy} />
            <Cost5DPanel
              projectId={projectId ?? ""}
              selectedElement={selection}
              copy={costingCopy}
              getQuantitySummary={props.getQuantitySummary}
              getElementQuantity={props.getElementQuantity}
              setElementProgress={props.setElementProgress}
            />
          </div>
        ) : mode === "SIMULATION" ? (
          <div className="panel-grid">
            <WorkspaceTimeline
              phases={timelinePhases}
              currentPhaseIndex={timeline.currentPhaseIndex}
              progress={timeline.progress}
              speed={timeline.speed}
              playing={timeline.playing}
              onTogglePlay={props.onTimelineTogglePlay}
              onProgressChange={props.onTimelineProgressChange}
              onSpeedChange={props.onTimelineSpeedChange}
              copy={workspaceCopy}
            />
            {projectId ? (
              <Planning4DPanel
                projectId={projectId}
                selectedElement={selection}
                copy={planningCopy}
                onStepChange={props.onStepChange}
                getViewerCanvas={props.getViewerCanvas}
              />
            ) : null}
          </div>
        ) : selection ? (
          <div className="panel-grid">
            <PropertiesPanel data={selection} onClose={() => props.onModeChange("SELECT")} />
            <ElementComments
              selectedExpressId={selection.expressId > 0 ? selection.expressId : null}
              selectedElementType={selection.type ?? null}
              comments={comments}
              onAddComment={props.onAddComment}
              userName={props.userName}
              userRole={props.userRole}
            />
          </div>
        ) : (
          <div className="panel-grid">
            <div className="panel-list-item">
              <div className="panel-item-title">Quick search</div>
              <BimSearchPanel
                value={searchQuery}
                onChange={props.onSearchChange}
                results={searchResults}
                chips={searchChips}
                onChipClick={props.onChipClick}
                copy={workspaceCopy}
                onResultClick={props.onResultClick}
              />
            </div>
            {projectId ? (
              <div className="panel-list-item">
                <div className="panel-item-title">Documents</div>
                <DocumentBrowser projectId={projectId} onSelectDocument={props.onSelectDocument} copy={documentsCopy} />
              </div>
            ) : null}
            <div className="panel-list-item">
              <div className="panel-item-title">Comments</div>
              <ElementComments
                selectedExpressId={null}
                selectedElementType={null}
                comments={comments}
                onAddComment={props.onAddComment}
                userName={props.userName}
                userRole={props.userRole}
              />
            </div>
            <WorkspaceActivityFeed items={activityItems} copy={workspaceCopy} />
          </div>
        )}
      </div>
    </aside>
  );
}
