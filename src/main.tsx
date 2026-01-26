import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";

// Note: StrictMode is disabled because the 3D viewer library (web-ifc/three.js)
// doesn't handle double-mount/unmount cycles well during development
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />,
);
