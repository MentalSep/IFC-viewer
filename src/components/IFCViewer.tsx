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
import * as WebIFC from "web-ifc";

interface IFCViewerProps {
  file: File | null;
  onLoad: () => void;
  onError: (err: string) => void;
}

export interface IFCViewerRef {
  fitCamera: () => void;
  resetCamera: () => void;
}

const IFCViewer = forwardRef<IFCViewerRef, IFCViewerProps>(
  ({ file, onLoad, onError }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const ifcApiRef = useRef<WebIFC.IfcAPI | null>(null);
    const modelRef = useRef<THREE.Group | null>(null);
    const animationIdRef = useRef<number | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState<string | null>(null);
    const needsRenderRef = useRef(true);

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

      // Initialize web-ifc
      const ifcApi = new WebIFC.IfcAPI();
      ifcApi.SetWasmPath("/");
      await ifcApi.Init();
      ifcApiRef.current = ifcApi;

      // Animation loop with on-demand rendering for better performance
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate);
        controls.update();

        // Only render when needed (camera moved or model changed)
        if (needsRenderRef.current) {
          renderer.render(scene, camera);
          needsRenderRef.current = false;
        }
      };
      animate();

      // Initial render
      needsRenderRef.current = true;

      // Resize handler
      const handleResize = () => {
        if (!containerRef.current) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

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
          setSelectedInfo(`Selected element`);
        } else {
          setSelectedInfo(null);
        }
      };
      containerRef.current.addEventListener("click", handleClick);

      setIsReady(true);

      // Cleanup function
      return () => {
        window.removeEventListener("resize", handleResize);
        containerRef.current?.removeEventListener("click", handleClick);
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
        renderer.dispose();
        controls.dispose();
      };
    }, []);

    // Convert IFC geometry to Three.js mesh - individual meshes for selection
    const createMeshFromIFC = useCallback(
      (ifcApi: WebIFC.IfcAPI, modelID: number): THREE.Group => {
        const group = new THREE.Group();

        // Get all meshes from the IFC model
        ifcApi.StreamAllMeshes(modelID, (mesh) => {
          const placedGeometries = mesh.geometries;

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

        return group;
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

          // Load IFC data
          const modelID = ifcApi.OpenModel(data);

          // Create meshes (with geometry merging for performance)
          const model = createMeshFromIFC(ifcApi, modelID);

          // Center the model at the origin so it appears on the grid
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          model.position.y += box.getSize(new THREE.Vector3()).y / 2; // Place on grid

          modelRef.current = model;
          scene.add(model);

          // Close model to free memory (geometry is now in Three.js)
          ifcApi.CloseModel(modelID);

          // Trigger render
          needsRenderRef.current = true;

          onLoad();
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          onError(`Failed to load IFC: ${message}`);
        } finally {
          setIsLoading(false);
        }
      },
      [createMeshFromIFC, onLoad, onError],
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

    useImperativeHandle(ref, () => ({
      fitCamera,
      resetCamera,
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

    // Load file when it changes
    useEffect(() => {
      if (file && isReady) {
        loadIFCFromFile(file).then(() => {
          setTimeout(fitCamera, 100);
        });
      }
    }, [file, isReady, loadIFCFromFile, fitCamera]);

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
