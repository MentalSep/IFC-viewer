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

interface IFCViewerProps {
  file: File | null;
  onLoad: () => void;
  onError: (err: string) => void;
  onElementTypesReady: (types: ElementTypeInfo[]) => void;
  onElementSelected: (data: SelectedElementData | null) => void;
  theme?: ViewerTheme;
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

const IFCViewer = forwardRef<IFCViewerRef, IFCViewerProps>(
  (
    { file, onLoad, onError, onElementTypesReady, onElementSelected, theme },
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
    // Store element type info per expressID for property lookup
    const elementDataRef = useRef<
      Map<number, { type: string; expressId: number }>
    >(new Map());
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
      let highlightedMesh: THREE.Mesh | null = null;
      let originalMaterial: THREE.Material | THREE.Material[] | null = null;

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
        if (highlightedMesh && originalMaterial) {
          highlightedMesh.material = originalMaterial;
          highlightedMesh = null;
          originalMaterial = null;
        }

        if (intersects.length > 0) {
          const mesh = intersects[0].object as THREE.Mesh;
          originalMaterial = mesh.material;
          highlightedMesh = mesh;
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
            });
          } else {
            setSelectedInfo("Selected element");
            onElementSelected(null);
          }
          needsRenderRef.current = true;
        } else {
          setSelectedInfo(null);
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
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
        renderer.dispose();
        controls.dispose();
      };
    }, [resizeRenderer]);

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
          try {
            const lineData = ifcApi.GetLine(modelID, expressID);
            if (lineData && lineData.constructor && lineData.constructor.name) {
              ifcType = lineData.constructor.name;
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

            // Store express ID for property lookup on click
            threeJsMesh.userData = { expressId: expressID };

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
        originalMaterialsRef.current.clear();

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
      [createMeshFromIFC, fitCamera, onLoad, onError, onElementTypesReady],
    );

    // Load from File
    const loadIFCFromFile = useCallback(
      async (file: File) => {
        try {
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

        setIsLoading(true);
        elementDataRef.current.clear();
        originalMaterialsRef.current.clear();
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
          } else {
            throw new Error(
              "Unsupported 3D format. Use IFC, GLB, GLTF, OBJ, STL, FBX, or PLY.",
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

          modelRef.current = group;
          scene.add(group);

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
      [fitCamera, onElementSelected, onElementTypesReady, onLoad, onError],
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
