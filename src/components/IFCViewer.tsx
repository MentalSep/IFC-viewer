import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useState,
} from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { PLYLoader } from "three/addons/loaders/PLYLoader.js";
import * as WebIFC from "web-ifc";
import type { ElementTypeInfo } from "./ModelTree";
import type { SelectedElementData, ElementProperty } from "./PropertiesPanel";
import { getFileExtension } from "../utils/modelFormats";
import type { ViewerTheme } from "../utils/viewerI18n";

export type HeatmapMode = "none" | "cost" | "progress" | "status" | "planning";

interface IFCViewerProps {
  file: File | null;
  onLoad: () => void;
  onError: (err: string) => void;
  onElementTypesReady: (types: ElementTypeInfo[]) => void;
  onElementSelected: (data: SelectedElementData | null) => void;
  theme?: ViewerTheme;
  visualMode?: HeatmapMode;
}

export interface ElementQuantityData {
  expressId: number;
  type: string;
  count: number;
  area: number;
  volume: number;
  length: number;
  perimeter: number;
}

export interface IFCViewerRef {
  fitCamera: () => void;
  resetCamera: () => void;
  toggleWireframe: () => boolean;
  toggleGrid: () => boolean;
  toggleTransparency: () => boolean;
  screenshot: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setViewAngle: (direction: string) => void;
  toggleMeasure: () => boolean;
  clearMeasurements: () => void;
  toggleClipping: () => boolean;
  setClipHeight: (ratio: number) => void;
  focusSelected: () => boolean;
  hideSelected: () => boolean;
  showAllElements: () => void;
  isolateElementType: (type: string) => number;
  clearTypeIsolation: () => void;
  clearModel: () => void;
  setElementProgress: (expressId: number, progress: number) => boolean;
  getQuantitySummary: () => ElementQuantityData[];
  getElementQuantity: (expressId: number) => ElementQuantityData | null;
  getLoadedFileName: () => string | null;
  resize: () => void;
}

// Helper: extract properties from an IFC element
function getElementProperties(
  ifcApi: WebIFC.IfcAPI,
  modelID: number,
  expressID: number,
): ElementProperty[] {
  const props: ElementProperty[] = [];
  try {
    const line = ifcApi.GetLine(modelID, expressID);
    if (!line) return props;

    // Extract common properties
    const entries = Object.entries(line);
    for (const [key, val] of entries) {
      if (
        key === "expressID" ||
        key === "type" ||
        val === null ||
        val === undefined
      )
        continue;

      let displayVal: string;
      if (typeof val === "object" && val !== null && "value" in val) {
        displayVal = String(val.value);
      } else if (typeof val === "object" && val !== null) {
        continue; // skip complex nested objects
      } else {
        displayVal = String(val);
      }

      if (displayVal && displayVal !== "undefined" && displayVal !== "null") {
        // Make the key more readable
        const label = key.replace(/([a-z])([A-Z])/g, "$1 $2");
        props.push({
          name: label.charAt(0).toUpperCase() + label.slice(1),
          value: displayVal,
        });
      }
    }
  } catch {
    // Property extraction failed — return what we have
  }
  return props;
}

function disposeObject3D(object: THREE.Object3D) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
}

function getAllMeshes(root: THREE.Object3D | null): THREE.Mesh[] {
  if (!root) return [];
  const meshes: THREE.Mesh[] = [];
  root.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      meshes.push(child);
    }
  });
  return meshes;
}

function hashString(source: string) {
  let hash = 0;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash << 5) - hash + source.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function heatColor(value: number, mode: HeatmapMode) {
  const stops: Record<HeatmapMode, [number, number, number]> = {
    none: [0x38, 0xbd, 0xf8],
    cost: [0x22, 0xc5, 0x5e],
    progress: [0x0e, 0xa5, 0xe9],
    status: [0xf9, 0x73, 0x16],
    planning: [0xa8, 0x55, 0xf7],
  };
  const [r, g, b] = stops[mode];
  const mix = new THREE.Color(r / 255, g / 255, b / 255);
  return mix.offsetHSL(((value % 100) / 100) * 0.18, 0.15, 0.02);
}

function estimateSelectionMetrics(mesh: THREE.Mesh) {
  const box = new THREE.Box3().setFromObject(mesh);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const geometry = mesh.geometry;
  const position = geometry.getAttribute("position");
  const index = geometry.getIndex();
  let triangles = 0;

  if (index) {
    triangles = Math.floor(index.count / 3);
  } else if (position) {
    triangles = Math.floor(position.count / 3);
  }

  return {
    dimensions: {
      x: Number(size.x.toFixed(3)),
      y: Number(size.y.toFixed(3)),
      z: Number(size.z.toFixed(3)),
    },
    center: {
      x: Number(center.x.toFixed(3)),
      y: Number(center.y.toFixed(3)),
      z: Number(center.z.toFixed(3)),
    },
    triangles,
  };
}

function extractNumericValues(source: unknown): number[] {
  if (source === null || source === undefined) return [];
  if (typeof source === "number" && Number.isFinite(source)) return [source];
  if (typeof source === "string") {
    const parsed = Number(source);
    return Number.isFinite(parsed) ? [parsed] : [];
  }
  if (typeof source === "object") {
    const values: number[] = [];
    Object.values(source as Record<string, unknown>).forEach((value) => {
      values.push(...extractNumericValues(value));
    });
    return values;
  }
  return [];
}

function extractQuantitiesFromIfcLine(line: Record<string, unknown>) {
  let area = 0;
  let volume = 0;
  let length = 0;
  let perimeter = 0;
  Object.entries(line).forEach(([key, value]) => {
    const upper = key.toUpperCase();
    const nums = extractNumericValues(value);
    if (nums.length === 0) return;
    const sum = nums.reduce((acc, curr) => acc + curr, 0);
    if (upper.includes("AREA")) area += sum;
    else if (upper.includes("VOLUME")) volume += sum;
    else if (upper.includes("LENGTH")) length += sum;
    else if (upper.includes("PERIMETER")) perimeter += sum;
  });
  return { area, volume, length, perimeter };
}

const IFCViewer = forwardRef<IFCViewerRef, IFCViewerProps>(
  (
    { file, onLoad, onError, onElementTypesReady, onElementSelected, theme, visualMode = "none" },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const needsRenderRef = useRef(true);
    const resizeRenderer = useCallback(() => {
      const container = containerRef.current;
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      if (!container || !camera || !renderer) return;

      const w = container.clientWidth;
      const h = container.clientHeight;

      // Update camera aspect ratio
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      // Update renderer size (this sets internal resolution)
      renderer.setSize(w, h, false); // false = don't set CSS size, let CSS handle it

      // Also ensure canvas element respects container size
      const canvas = renderer.domElement;
      if (canvas) {
        canvas.style.width = "100%";
        canvas.style.height = "100%";
      }

      needsRenderRef.current = true;
    }, []);
    const controlsRef = useRef<OrbitControls | null>(null);
    const ifcApiRef = useRef<WebIFC.IfcAPI | null>(null);
    const modelRef = useRef<THREE.Group | null>(null);
    const animationIdRef = useRef<number | null>(null);
    const gridRef = useRef<THREE.GridHelper | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState<string | null>(null);
    const wireframeRef = useRef(false);
    const transparencyRef = useRef(false);
    const originalMaterialsRef = useRef<
      Map<THREE.Mesh, THREE.Material | THREE.Material[]>
    >(new Map());
    const progressValuesRef = useRef<Map<number, number>>(new Map());
    // Store element type info per expressID for property lookup
    const elementDataRef = useRef<
      Map<number, ElementQuantityData>
    >(new Map());
    const elementMeshesRef = useRef<Map<number, THREE.Mesh[]>>(new Map());
    const loadedFileNameRef = useRef<string | null>(null);
    // Store model ID for property queries
    const currentModelIdRef = useRef<number | null>(null);
    // Measurement state
    const measureModeRef = useRef(false);
    const measurePointsRef = useRef<THREE.Vector3[]>([]);
    const measureLinesRef = useRef<THREE.Group>(new THREE.Group());
    const measureLabelsRef = useRef<HTMLDivElement[]>([]);
    // Clipping plane state
    const clipPlaneRef = useRef<THREE.Plane>(
      new THREE.Plane(new THREE.Vector3(0, -1, 0), 100),
    );
    const clippingEnabledRef = useRef(false);
    const modelBoundsRef = useRef<{ minY: number; maxY: number }>({
      minY: 0,
      maxY: 100,
    });
    const selectedMeshRef = useRef<THREE.Mesh | null>(null);
    const selectedOriginalMaterialRef = useRef<
      THREE.Material | THREE.Material[] | null
    >(null);
    const hiddenMeshesRef = useRef<Set<THREE.Mesh>>(new Set());
    const isolatedTypeRef = useRef<string | null>(null);

    const clearSelectionHighlight = useCallback(() => {
      if (selectedMeshRef.current && selectedOriginalMaterialRef.current) {
        selectedMeshRef.current.material = selectedOriginalMaterialRef.current;
      }
      selectedMeshRef.current = null;
      selectedOriginalMaterialRef.current = null;
    }, []);

    // Fit camera to model
    const fitCamera = useCallback(() => {
      const model = modelRef.current;
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      if (!model || !camera || !controls) return;

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const distance = maxDim * 1.5;

      camera.position.set(
        center.x + distance,
        center.y + distance * 0.7,
        center.z + distance,
      );
      controls.target.copy(center);
      controls.update();
      needsRenderRef.current = true;
    }, []);

    // Initialize the 3D viewer
    const initViewer = useCallback(async () => {
      if (!containerRef.current) return;

      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0f1a);
      sceneRef.current = scene;

      // Camera - increased far plane for large models
      const camera = new THREE.PerspectiveCamera(
        50,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        10000,
      );
      camera.position.set(20, 20, 20);
      cameraRef.current = camera;

      // Renderer - optimized settings for performance
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight,
      );
      // Limit pixel ratio for performance on high-DPI displays
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = false; // Disable shadows for performance
      renderer.localClippingEnabled = true; // Enable clipping planes
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 1;
      controls.maxDistance = 5000; // Increased for large models
      controlsRef.current = controls;

      // Request render when controls change
      controls.addEventListener("change", () => {
        needsRenderRef.current = true;
      });

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(50, 80, 40);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
      fillLight.position.set(-40, 60, -30);
      scene.add(fillLight);

      // Grid
      const gridHelper = new THREE.GridHelper(100, 50, 0x1f2937, 0x1f2937);
      scene.add(gridHelper);
      gridRef.current = gridHelper;

      // Measurement overlay group
      scene.add(measureLinesRef.current);

      // Initialize web-ifc
      const ifcApi = new WebIFC.IfcAPI();
      ifcApi.SetWasmPath("/");
      await ifcApi.Init();
      ifcApiRef.current = ifcApi;

      // Animation loop - render continuously for smooth damping interaction
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate);
        controls.update();

        // Always render to show damped camera movement smoothly
        renderer.render(scene, camera);
      };
      animate();

      // Initial render
      needsRenderRef.current = true;

      // Use shared resizeRenderer to handle window and container size changes
      window.addEventListener("resize", resizeRenderer);

      // Observe container size changes (e.g. when sidebars collapse)
      const resizeObserver = new ResizeObserver(() => {
        resizeRenderer();
      });
      if (containerRef.current) {
        try {
          resizeObserver.observe(containerRef.current as Element);
        } catch (e) {
          // ignore - observe may fail in some environments
        }
      }

      // Click handler for selection
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const handleClick = (event: MouseEvent) => {
        if (!containerRef.current || !modelRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(
          modelRef.current.children,
          true,
        );

        // ── Measurement mode ──
        if (measureModeRef.current && intersects.length > 0) {
          const point = intersects[0].point.clone();
          measurePointsRef.current.push(point);

          // Add a small sphere marker
          const markerGeo = new THREE.SphereGeometry(0.15, 12, 12);
          const markerMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
          const marker = new THREE.Mesh(markerGeo, markerMat);
          marker.position.copy(point);
          measureLinesRef.current.add(marker);

          // If we have a pair, draw the line + distance label
          if (measurePointsRef.current.length === 2) {
            const [a, b] = measurePointsRef.current;
            const lineGeo = new THREE.BufferGeometry().setFromPoints([a, b]);
            const lineMat = new THREE.LineBasicMaterial({
              color: 0xfacc15,
              linewidth: 2,
            });
            const line = new THREE.Line(lineGeo, lineMat);
            measureLinesRef.current.add(line);

            const dist = a.distanceTo(b);
            // Create a floating HTML label
            const div = document.createElement("div");
            div.className = "measure-label";
            div.textContent = `${dist.toFixed(2)} m`;
            containerRef.current?.appendChild(div);

            // Position the label at the midpoint (we'll update in the render loop)
            const mid = a.clone().add(b).multiplyScalar(0.5);
            const projected = mid.clone().project(camera);
            const hw = (containerRef.current?.clientWidth ?? 0) / 2;
            const hh = (containerRef.current?.clientHeight ?? 0) / 2;
            div.style.left = `${projected.x * hw + hw}px`;
            div.style.top = `${-projected.y * hh + hh}px`;
            measureLabelsRef.current.push(div);

            // Reset for next pair
            measurePointsRef.current = [];
          }
          needsRenderRef.current = true;
          return; // Don't do selection in measure mode
        }

        // Reset previous highlight
        clearSelectionHighlight();

        if (intersects.length > 0) {
          const mesh = intersects[0].object as THREE.Mesh;
          selectedOriginalMaterialRef.current = mesh.material;
          selectedMeshRef.current = mesh;
          mesh.material = new THREE.MeshStandardMaterial({
            color: 0x00d8a4,
            emissive: 0x00d8a4,
            emissiveIntensity: 0.3,
          });

          // Look up element data from expressID stored on mesh
          const expressId = (mesh.userData as { expressId?: number }).expressId;
          const elData = expressId
            ? elementDataRef.current.get(expressId)
            : undefined;

          if (
            elData &&
            ifcApiRef.current &&
            currentModelIdRef.current !== null
          ) {
            // Try to extract properties
            const props = getElementProperties(
              ifcApiRef.current,
              currentModelIdRef.current,
              elData.expressId,
            );
            setSelectedInfo(`${elData.type} #${elData.expressId}`);
            onElementSelected({
              expressId: elData.expressId,
              type: elData.type,
              properties: props,
              metrics: estimateSelectionMetrics(mesh),
            });
          } else {
            const fallbackType =
              (mesh.userData as { ifcType?: string }).ifcType ??
              mesh.name ??
              "Mesh";
            setSelectedInfo(`${fallbackType}`);
            onElementSelected({
              expressId: -1,
              type: fallbackType,
              properties: [
                { name: "Object Name", value: mesh.name || "N/A" },
                { name: "Geometry Type", value: mesh.geometry.type },
              ],
              metrics: estimateSelectionMetrics(mesh),
            });
          }
          needsRenderRef.current = true;
        } else {
          setSelectedInfo(null);
          clearSelectionHighlight();
          onElementSelected(null);
        }
      };
      if (containerRef.current) {
        containerRef.current.addEventListener("click", handleClick);
      }

      setIsReady(true);

      // Cleanup function
      return () => {
        window.removeEventListener("resize", resizeRenderer);
        try {
          resizeObserver.disconnect();
        } catch {}
        if (containerRef.current) {
          containerRef.current.removeEventListener("click", handleClick);
        }
        clearSelectionHighlight();
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
        renderer.dispose();
        controls.dispose();
      };
    }, [clearSelectionHighlight, resizeRenderer]);

    // Convert IFC geometry to Three.js mesh - individual meshes for selection
    const createMeshFromIFC = useCallback(
      (
        ifcApi: WebIFC.IfcAPI,
        modelID: number,
      ): { group: THREE.Group; typeCounts: Map<string, number> } => {
        const group = new THREE.Group();
        const typeCounts = new Map<string, number>();

        // Get all meshes from the IFC model
        ifcApi.StreamAllMeshes(modelID, (mesh) => {
          const expressID = mesh.expressID;
          const placedGeometries = mesh.geometries;

          // Try to determine the IFC type for this element
          let ifcType = "Unknown";
          let quantities = { area: 0, volume: 0, length: 0, perimeter: 0 };
          try {
            const lineData = ifcApi.GetLine(modelID, expressID);
            if (lineData && lineData.constructor && lineData.constructor.name) {
              ifcType = lineData.constructor.name;
            }
            if (lineData && typeof lineData === "object") {
              quantities = extractQuantitiesFromIfcLine(
                lineData as Record<string, unknown>,
              );
            }
          } catch {
            // fallback – type stays Unknown
          }

          // Track element type counts
          typeCounts.set(ifcType, (typeCounts.get(ifcType) ?? 0) + 1);

          // Store element data for property lookup
          elementDataRef.current.set(expressID, {
            type: ifcType,
            expressId: expressID,
            count: 1,
            area: quantities.area,
            volume: quantities.volume,
            length: quantities.length,
            perimeter: quantities.perimeter,
          });

          for (let i = 0; i < placedGeometries.size(); i++) {
            const placedGeometry = placedGeometries.get(i);
            const geometry = ifcApi.GetGeometry(
              modelID,
              placedGeometry.geometryExpressID,
            );

            const vertices = ifcApi.GetVertexArray(
              geometry.GetVertexData(),
              geometry.GetVertexDataSize(),
            );
            const indices = ifcApi.GetIndexArray(
              geometry.GetIndexData(),
              geometry.GetIndexDataSize(),
            );

            if (vertices.length === 0 || indices.length === 0) {
              geometry.delete();
              continue;
            }

            // Create Three.js geometry
            const bufferGeometry = new THREE.BufferGeometry();

            // Vertices are interleaved: x, y, z, nx, ny, nz
            const positions = new Float32Array(vertices.length / 2);
            const normals = new Float32Array(vertices.length / 2);

            for (let j = 0; j < vertices.length; j += 6) {
              const idx = j / 2;
              positions[idx] = vertices[j];
              positions[idx + 1] = vertices[j + 1];
              positions[idx + 2] = vertices[j + 2];
              normals[idx] = vertices[j + 3];
              normals[idx + 1] = vertices[j + 4];
              normals[idx + 2] = vertices[j + 5];
            }

            bufferGeometry.setAttribute(
              "position",
              new THREE.BufferAttribute(positions, 3),
            );
            bufferGeometry.setAttribute(
              "normal",
              new THREE.BufferAttribute(normals, 3),
            );
            bufferGeometry.setIndex(Array.from(indices));

            // Get color from IFC
            const ifcColor = placedGeometry.color;
            const color = new THREE.Color(ifcColor.x, ifcColor.y, ifcColor.z);
            const opacity = ifcColor.w;

            // Create material with MeshStandardMaterial for better visuals
            const material = new THREE.MeshStandardMaterial({
              color: color,
              opacity: opacity,
              transparent: opacity < 1,
              side: THREE.DoubleSide,
              roughness: 0.7,
              metalness: 0.1,
            });

            const threeJsMesh = new THREE.Mesh(bufferGeometry, material);
            threeJsMesh.userData = {
              expressId: expressID,
              ifcType,
              baseColor: color.clone(),
              baseOpacity: opacity,
            };

            const meshList = elementMeshesRef.current.get(expressID) ?? [];
            meshList.push(threeJsMesh);
            elementMeshesRef.current.set(expressID, meshList);

            // Apply transformation matrix
            const matrix = new THREE.Matrix4();
            matrix.fromArray(placedGeometry.flatTransformation);
            threeJsMesh.applyMatrix4(matrix);

            // Enable frustum culling for performance
            threeJsMesh.frustumCulled = true;

            group.add(threeJsMesh);

            geometry.delete();
          }
        });

        return { group, typeCounts };
      },
      [],
    );

    // Load IFC from ArrayBuffer
    const loadIFCData = useCallback(
      async (data: Uint8Array) => {
        const ifcApi = ifcApiRef.current;
        const scene = sceneRef.current;
        if (!ifcApi || !scene) return;

        setIsLoading(true);
        elementDataRef.current.clear();
        elementMeshesRef.current.clear();
        originalMaterialsRef.current.clear();
        hiddenMeshesRef.current.clear();
        isolatedTypeRef.current = null;
        clearSelectionHighlight();
        setSelectedInfo(null);
        onElementSelected(null);

        try {
          // Remove existing model and dispose its resources
          if (modelRef.current) {
            modelRef.current.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                if (Array.isArray(child.material)) {
                  child.material.forEach((m) => m.dispose());
                } else {
                  child.material.dispose();
                }
              }
            });
            scene.remove(modelRef.current);
            modelRef.current = null;
          }

          // Close previous model if open
          if (currentModelIdRef.current !== null) {
            try {
              ifcApi.CloseModel(currentModelIdRef.current);
            } catch {
              // ignore
            }
            currentModelIdRef.current = null;
          }

          // Load IFC data
          const modelID = ifcApi.OpenModel(data);
          currentModelIdRef.current = modelID;

          // Create meshes and collect element types
          const { group: model, typeCounts } = createMeshFromIFC(
            ifcApi,
            modelID,
          );

          // Report element types to parent
          const elementTypes: ElementTypeInfo[] = [];
          typeCounts.forEach((count, type) => {
            elementTypes.push({ type, count });
          });
          onElementTypesReady(elementTypes);

          // Center the model at the origin so it appears on the grid
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          model.position.y += box.getSize(new THREE.Vector3()).y / 2; // Place on grid

          modelRef.current = model;
          scene.add(model);

          // NOTE: we keep the model open so we can query properties on click
          // It will be closed when a new model is loaded or on unmount.

          // Trigger render
          needsRenderRef.current = true;

          onLoad();
          fitCamera();
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          onError(`Failed to load IFC: ${message}`);
        } finally {
          setIsLoading(false);
        }
      },
      [
        clearSelectionHighlight,
        createMeshFromIFC,
        fitCamera,
        onElementSelected,
        onLoad,
        onError,
        onElementTypesReady,
      ],
    );

    // Load from File
    const loadIFCFromFile = useCallback(
      async (file: File) => {
        try {
          loadedFileNameRef.current = file.name;
          const buffer = await file.arrayBuffer();
          await loadIFCData(new Uint8Array(buffer));
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          onError(`Failed to read file: ${message}`);
        }
      },
      [loadIFCData, onError],
    );

    const loadThreeModel = useCallback(
      async (file: File) => {
        const scene = sceneRef.current;
        if (!scene) return;

        loadedFileNameRef.current = file.name;
        setIsLoading(true);
        elementDataRef.current.clear();
        elementMeshesRef.current.clear();
        originalMaterialsRef.current.clear();
        hiddenMeshesRef.current.clear();
        isolatedTypeRef.current = null;
        clearSelectionHighlight();
        setSelectedInfo(null);
        onElementTypesReady([]);
        onElementSelected(null);

        if (modelRef.current) {
          disposeObject3D(modelRef.current);
          scene.remove(modelRef.current);
          modelRef.current = null;
        }

        if (currentModelIdRef.current !== null && ifcApiRef.current) {
          try {
            ifcApiRef.current.CloseModel(currentModelIdRef.current);
          } catch {
            // ignore
          }
          currentModelIdRef.current = null;
        }

        try {
          const extension = getFileExtension(file.name);
          const buffer = await file.arrayBuffer();
          let model: THREE.Object3D | null = null;

          if (extension === "glb" || extension === "gltf") {
            const loader = new GLTFLoader();
            model = await new Promise<THREE.Object3D>((resolve, reject) => {
              loader.parse(
                buffer,
                "",
                (gltf) => resolve(gltf.scene),
                (error) => reject(error),
              );
            });
          } else if (extension === "obj") {
            const loader = new OBJLoader();
            const text = new TextDecoder().decode(buffer);
            model = loader.parse(text);
          } else if (extension === "stl") {
            const loader = new STLLoader();
            const geometry = loader.parse(buffer);
            model = new THREE.Mesh(
              geometry,
              new THREE.MeshStandardMaterial({
                color: 0x8ab4ff,
                roughness: 0.7,
                metalness: 0.1,
                side: THREE.DoubleSide,
              }),
            );
          } else if (extension === "fbx") {
            const loader = new FBXLoader();
            model = loader.parse(buffer, "");
          } else if (extension === "ply") {
            const loader = new PLYLoader();
            const geometry = loader.parse(buffer);
            geometry.computeVertexNormals();
            model = new THREE.Mesh(
              geometry,
              new THREE.MeshStandardMaterial({
                color: 0x9ae6b4,
                roughness: 0.75,
                metalness: 0.05,
                side: THREE.DoubleSide,
              }),
            );
          } else if (extension === "dwg") {
            throw new Error(
              "DWG files are not previewable in-browser yet. Convert them to IFC, GLB, GLTF, OBJ, STL, FBX, or PLY first.",
            );
          } else {
            throw new Error(
              "Unsupported 3D format. Use IFC, DWG, GLB, GLTF, OBJ, STL, FBX, or PLY.",
            );
          }

          const group = new THREE.Group();
          if (model) {
            group.add(model);
          }

          const box = new THREE.Box3().setFromObject(group);
          const size = box.getSize(new THREE.Vector3());
          if (size.lengthSq() === 0) {
            throw new Error("The selected file did not contain renderable geometry");
          }

          const center = box.getCenter(new THREE.Vector3());
        group.position.sub(center);
        group.position.y += size.y / 2;

        group.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const mat = child.material;
            if (mat instanceof THREE.MeshStandardMaterial) {
              (child.userData as { baseColor?: THREE.Color; baseOpacity?: number }).baseColor =
                mat.color.clone();
              (child.userData as { baseColor?: THREE.Color; baseOpacity?: number }).baseOpacity =
                mat.opacity;
            }
          }
        });

        modelRef.current = group;
        scene.add(group);
          const meshes = getAllMeshes(group);
          const byType: ElementQuantityData = {
            expressId: -1,
            type: "GENERIC_MESH",
            count: meshes.length,
            area: 0,
            volume: 0,
            length: 0,
            perimeter: 0,
          };
          elementDataRef.current.set(-1, byType);

          needsRenderRef.current = true;
          onLoad();
          fitCamera();
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          onError(`Failed to load 3D model: ${message}`);
        } finally {
          setIsLoading(false);
        }
      },
      [
        clearSelectionHighlight,
        fitCamera,
        onElementSelected,
        onElementTypesReady,
        onLoad,
        onError,
      ],
    );

    // Reset camera
    const resetCamera = useCallback(() => {
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      if (!camera || !controls) return;

      camera.position.set(20, 20, 20);
      controls.target.set(0, 0, 0);
      controls.update();
      needsRenderRef.current = true;
    }, []);

    // Toggle wireframe on all model meshes
    const toggleWireframe = useCallback((): boolean => {
      const model = modelRef.current;
      if (!model) return wireframeRef.current;

      wireframeRef.current = !wireframeRef.current;
      const wf = wireframeRef.current;

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material;
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.wireframe = wf;
          }
        }
      });
      needsRenderRef.current = true;
      return wf;
    }, []);

    // Toggle grid visibility
    const toggleGrid = useCallback((): boolean => {
      const grid = gridRef.current;
      if (!grid) return true;
      grid.visible = !grid.visible;
      needsRenderRef.current = true;
      return grid.visible;
    }, []);

    // Toggle transparency (x-ray mode)
    const toggleTransparency = useCallback((): boolean => {
      const model = modelRef.current;
      if (!model) return transparencyRef.current;

      transparencyRef.current = !transparencyRef.current;
      const xray = transparencyRef.current;

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material;
          if (mat instanceof THREE.MeshStandardMaterial) {
            if (xray) {
              // Store original opacity
              if (!originalMaterialsRef.current.has(child)) {
                originalMaterialsRef.current.set(child, mat.clone());
              }
              mat.transparent = true;
              mat.opacity = 0.25;
              mat.depthWrite = false;
            } else {
              const orig = originalMaterialsRef.current.get(child);
              if (orig && orig instanceof THREE.MeshStandardMaterial) {
                mat.transparent = orig.transparent;
                mat.opacity = orig.opacity;
                mat.depthWrite = true;
              }
            }
          }
        }
      });
      needsRenderRef.current = true;
      return xray;
    }, []);

    // Take a screenshot
    const screenshot = useCallback(() => {
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      if (!renderer || !scene || !camera) return;

      // Force a render to get the current frame
      renderer.render(scene, camera);
      const dataUrl = renderer.domElement.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "ifc-screenshot.png";
      link.href = dataUrl;
      link.click();
    }, []);

    // Zoom in/out
    const zoomIn = useCallback(() => {
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      if (!camera || !controls) return;

      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      camera.position.addScaledVector(dir, 5);
      controls.update();
      needsRenderRef.current = true;
    }, []);

    const zoomOut = useCallback(() => {
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      if (!camera || !controls) return;

      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      camera.position.addScaledVector(dir, -5);
      controls.update();
      needsRenderRef.current = true;
    }, []);

    // Set camera to a preset view angle
    const setViewAngle = useCallback((direction: string) => {
      const model = modelRef.current;
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      if (!camera || !controls) return;

      let target = new THREE.Vector3(0, 0, 0);
      let dist = 40;

      if (model) {
        const box = new THREE.Box3().setFromObject(model);
        target = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        dist = Math.max(size.x, size.y, size.z) * 1.6;
      }

      const pos = target.clone();
      switch (direction) {
        case "top":
          pos.set(target.x, target.y + dist, target.z);
          break;
        case "bottom":
          pos.set(target.x, target.y - dist, target.z);
          break;
        case "front":
          pos.set(target.x, target.y, target.z + dist);
          break;
        case "back":
          pos.set(target.x, target.y, target.z - dist);
          break;
        case "right":
          pos.set(target.x + dist, target.y, target.z);
          break;
        case "left":
          pos.set(target.x - dist, target.y, target.z);
          break;
        case "iso":
        default:
          pos.set(
            target.x + dist * 0.6,
            target.y + dist * 0.6,
            target.z + dist * 0.6,
          );
          break;
      }

      camera.position.copy(pos);
      controls.target.copy(target);
      controls.update();
      needsRenderRef.current = true;
    }, []);

    // Toggle measurement mode
    const toggleMeasure = useCallback((): boolean => {
      measureModeRef.current = !measureModeRef.current;
      measurePointsRef.current = [];
      // Change cursor style
      if (containerRef.current) {
        containerRef.current.style.cursor = measureModeRef.current
          ? "crosshair"
          : "";
      }
      return measureModeRef.current;
    }, []);

    // Clear all measurement lines and labels
    const clearMeasurements = useCallback(() => {
      // Remove 3D objects
      while (measureLinesRef.current.children.length > 0) {
        const child = measureLinesRef.current.children[0];
        measureLinesRef.current.remove(child);
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
        if (child instanceof THREE.Line) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      }
      // Remove HTML labels
      measureLabelsRef.current.forEach((el) => el.remove());
      measureLabelsRef.current = [];
      measurePointsRef.current = [];
      needsRenderRef.current = true;
    }, []);

    // Toggle clipping plane
    const toggleClipping = useCallback((): boolean => {
      const model = modelRef.current;
      clippingEnabledRef.current = !clippingEnabledRef.current;
      const enabled = clippingEnabledRef.current;

      if (model) {
        const box = new THREE.Box3().setFromObject(model);
        modelBoundsRef.current = { minY: box.min.y, maxY: box.max.y };

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const mat = child.material;
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.clippingPlanes = enabled ? [clipPlaneRef.current] : [];
              mat.clipShadows = true;
              mat.needsUpdate = true;
            }
          }
        });
      }
      needsRenderRef.current = true;
      return enabled;
    }, []);

    // Set clipping height (0 = bottom, 1 = top)
    const setClipHeight = useCallback((ratio: number) => {
      const { minY, maxY } = modelBoundsRef.current;
      const height = minY + (maxY - minY) * ratio;
      clipPlaneRef.current.constant = height;
      needsRenderRef.current = true;
    }, []);

    const focusSelected = useCallback((): boolean => {
      const mesh = selectedMeshRef.current;
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      if (!mesh || !camera || !controls) return false;
      const box = new THREE.Box3().setFromObject(mesh);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const distance = Math.max(size.x, size.y, size.z) * 2 || 10;
      camera.position.set(center.x + distance, center.y + distance * 0.7, center.z + distance);
      controls.target.copy(center);
      controls.update();
      needsRenderRef.current = true;
      return true;
    }, []);

    const hideSelected = useCallback((): boolean => {
      const mesh = selectedMeshRef.current;
      if (!mesh) return false;
      mesh.visible = false;
      hiddenMeshesRef.current.add(mesh);
      clearSelectionHighlight();
      setSelectedInfo(null);
      onElementSelected(null);
      needsRenderRef.current = true;
      return true;
    }, [clearSelectionHighlight, onElementSelected]);

    const showAllElements = useCallback(() => {
      getAllMeshes(modelRef.current).forEach((mesh) => {
        mesh.visible = true;
      });
      hiddenMeshesRef.current.clear();
      isolatedTypeRef.current = null;
      needsRenderRef.current = true;
    }, []);

    const isolateElementType = useCallback((type: string): number => {
      const targetType = type.toUpperCase();
      let visibleCount = 0;
      getAllMeshes(modelRef.current).forEach((mesh) => {
        const meshType = ((mesh.userData as { ifcType?: string }).ifcType ?? "").toUpperCase();
        const shouldShow = meshType === targetType;
        mesh.visible = shouldShow;
        if (shouldShow) visibleCount += 1;
      });
      isolatedTypeRef.current = targetType;
      hiddenMeshesRef.current.clear();
      needsRenderRef.current = true;
      return visibleCount;
    }, []);

    const clearTypeIsolation = useCallback(() => {
      if (!isolatedTypeRef.current) return;
      getAllMeshes(modelRef.current).forEach((mesh) => {
        mesh.visible = true;
      });
      isolatedTypeRef.current = null;
      hiddenMeshesRef.current.clear();
      needsRenderRef.current = true;
    }, []);

    const clearModel = useCallback(() => {
      const scene = sceneRef.current;
      if (!scene) return;
      clearSelectionHighlight();
      clearMeasurements();
      setSelectedInfo(null);
      onElementSelected(null);
      onElementTypesReady([]);
      elementDataRef.current.clear();
      elementMeshesRef.current.clear();
      originalMaterialsRef.current.clear();
      hiddenMeshesRef.current.clear();
      isolatedTypeRef.current = null;
      loadedFileNameRef.current = null;

      if (modelRef.current) {
        disposeObject3D(modelRef.current);
        scene.remove(modelRef.current);
        modelRef.current = null;
      }
      if (currentModelIdRef.current !== null && ifcApiRef.current) {
        try {
          ifcApiRef.current.CloseModel(currentModelIdRef.current);
        } catch {
          // ignore close model failures
        }
        currentModelIdRef.current = null;
      }
      needsRenderRef.current = true;
    }, [clearMeasurements, clearSelectionHighlight, onElementSelected, onElementTypesReady]);

    const setElementProgress = useCallback((expressId: number, progress: number): boolean => {
      const meshes = elementMeshesRef.current.get(expressId);
      if (!meshes || meshes.length === 0) return false;
      const clamped = Math.max(0, Math.min(100, progress));
      const t = clamped / 100;
      progressValuesRef.current.set(expressId, clamped);
      const tint = new THREE.Color(0xef4444).lerp(new THREE.Color(0x22c55e), t);
      meshes.forEach((mesh) => {
        const mat = mesh.material;
        if (mat instanceof THREE.MeshStandardMaterial) {
          const base =
            (mesh.userData as { progressBaseColor?: THREE.Color }).progressBaseColor ??
            mat.color.clone();
          if (!(mesh.userData as { progressBaseColor?: THREE.Color }).progressBaseColor) {
            (mesh.userData as { progressBaseColor?: THREE.Color }).progressBaseColor = base;
          }
          mat.color.copy(base).lerp(tint, 0.65);
          mat.emissive.copy(tint).multiplyScalar(0.15);
          mat.needsUpdate = true;
        }
      });
      needsRenderRef.current = true;
      return true;
    }, []);

    const getQuantitySummary = useCallback((): ElementQuantityData[] => {
      const grouped = new Map<string, ElementQuantityData>();
      Array.from(elementDataRef.current.values()).forEach((item) => {
        const existing = grouped.get(item.type);
        if (!existing) {
          grouped.set(item.type, { ...item });
          return;
        }
        existing.count += item.count;
        existing.area += item.area;
        existing.volume += item.volume;
        existing.length += item.length;
        existing.perimeter += item.perimeter;
      });
      return Array.from(grouped.values()).sort((a, b) => b.count - a.count);
    }, []);

    const getElementQuantity = useCallback(
      (expressId: number): ElementQuantityData | null =>
        elementDataRef.current.get(expressId) ?? null,
      [],
    );

    useImperativeHandle(ref, () => ({
      fitCamera,
      resetCamera,
      toggleWireframe,
      toggleGrid,
      toggleTransparency,
      screenshot,
      zoomIn,
      zoomOut,
      setViewAngle,
      toggleMeasure,
      clearMeasurements,
      toggleClipping,
      setClipHeight,
      focusSelected,
      hideSelected,
      showAllElements,
      isolateElementType,
      clearTypeIsolation,
      clearModel,
      setElementProgress,
      getQuantitySummary,
      getElementQuantity,
      getLoadedFileName: () => loadedFileNameRef.current,
      resize: resizeRenderer,
    }));

    // Initialize viewer on mount
    useEffect(() => {
      let cleanup: (() => void) | undefined;

      initViewer().then((cleanupFn) => {
        cleanup = cleanupFn;
      });

      return () => {
        cleanup?.();
      };
    }, [initViewer]);

    // Update scene background when theme changes
    useEffect(() => {
      const scene = sceneRef.current;
      const grid = gridRef.current;
      if (!scene) return;
      if (theme === "light") {
        scene.background = new THREE.Color(0xe2e8f0);
        if (grid) {
          grid.material = new THREE.LineBasicMaterial({
            color: 0xc0c8d4,
          }) as never;
        }
      } else if (theme === "aurora") {
        scene.background = new THREE.Color(0x101827);
        if (grid) {
          grid.material = new THREE.LineBasicMaterial({
            color: 0x334155,
          }) as never;
        }
      } else {
        scene.background = new THREE.Color(0x0a0f1a);
        if (grid) {
          grid.material = new THREE.LineBasicMaterial({
            color: 0x1f2937,
          }) as never;
        }
      }
      needsRenderRef.current = true;
    }, [theme]);

    useEffect(() => {
      const model = modelRef.current;
      if (!model) return;

      const meshes = getAllMeshes(model);
      meshes.forEach((mesh, index) => {
        const mat = mesh.material;
        if (!(mat instanceof THREE.MeshStandardMaterial)) return;

        const baseColor =
          (mesh.userData as { baseColor?: THREE.Color }).baseColor ?? mat.color.clone();
        const baseOpacity =
          (mesh.userData as { baseOpacity?: number }).baseOpacity ?? 1;

        if (visualMode === "none") {
          mat.color.copy(baseColor);
          mat.emissive.setHex(0x000000);
          mat.opacity = baseOpacity;
          mat.transparent = baseOpacity < 1;
          mat.needsUpdate = true;
          return;
        }

        const progressValue =
          progressValuesRef.current.get(Number((mesh.userData as { expressId?: number }).expressId)) ??
          ((index * 17) % 100);
        const typeKey =
          (mesh.userData as { ifcType?: string }).ifcType ??
          mesh.name ??
          `mesh-${index}`;
        const hash = hashString(typeKey);

        let value = progressValue;
        if (visualMode === "cost") value = hash % 100;
        if (visualMode === "status") value = ((hash >> 3) % 100 + progressValue) / 2;
        if (visualMode === "planning") value = (index * 13 + progressValue) % 100;

        const tint = heatColor(value, visualMode);
        mat.color.copy(baseColor).lerp(tint, 0.72);
        mat.emissive.copy(tint).multiplyScalar(0.12);
        mat.transparent = true;
        mat.opacity = Math.min(1, baseOpacity * 0.92);
        mat.needsUpdate = true;
      });

      needsRenderRef.current = true;
    }, [visualMode]);

    // Load file when it changes - with minimal stable dependencies
    useEffect(() => {
      if (!file || !isReady || !ifcApiRef.current || !sceneRef.current) return;

      const loadFile = async () => {
        try {
          const extension = getFileExtension(file.name);
          if (extension === "ifc") {
            await loadIFCFromFile(file);
          } else {
            await loadThreeModel(file);
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          onError(`Failed to load model: ${message}`);
        }
      };

      loadFile();
    }, [file, isReady, loadIFCFromFile, loadThreeModel, onError]);

    return (
      <div className="canvas-wrapper" ref={containerRef}>
        <div className="top-bar">
          <span className="badge">Interactive</span>
          <span className="badge">3D</span>
        </div>
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <span>Loading model...</span>
          </div>
        )}
        {selectedInfo && <div className="selection-info">{selectedInfo}</div>}
        <div className="legend">
          LMB: Rotate &nbsp;|&nbsp; RMB: Pan &nbsp;|&nbsp; Scroll: Zoom
          &nbsp;|&nbsp; Click: Select
        </div>
      </div>
    );
  },
);

IFCViewer.displayName = "IFCViewer";

export default IFCViewer;
