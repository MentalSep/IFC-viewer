export const SUPPORTED_3D_EXTENSIONS = [
  "ifc",
  "rvt",
  "glb",
  "gltf",
  "obj",
  "stl",
  "fbx",
  "ply",
] as const;

export const PREVIEWABLE_3D_EXTENSIONS = [
  "ifc",
  "glb",
  "gltf",
  "obj",
  "stl",
  "fbx",
  "ply",
] as const;

export type Supported3DExtension = (typeof SUPPORTED_3D_EXTENSIONS)[number];
export type Previewable3DExtension = (typeof PREVIEWABLE_3D_EXTENSIONS)[number];

export function getFileExtension(fileName: string) {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

export function isSupported3DFileName(fileName: string) {
  return SUPPORTED_3D_EXTENSIONS.includes(getFileExtension(fileName) as Supported3DExtension);
}

export function isPreviewable3DFileName(fileName: string) {
  return PREVIEWABLE_3D_EXTENSIONS.includes(
    getFileExtension(fileName) as Previewable3DExtension,
  );
}

export function getSupported3DAccept() {
  return SUPPORTED_3D_EXTENSIONS.map((ext) => `.${ext}`).join(",");
}

export function getPreviewable3DAccept() {
  return PREVIEWABLE_3D_EXTENSIONS.map((ext) => `.${ext}`).join(",");
}
