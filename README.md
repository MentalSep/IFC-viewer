# IFC Viewer

A modern web application to load and explore IFC (Industry Foundation Classes) building models in an interactive 3D viewer.

## Features

- 📁 **Drag & Drop / File Upload**: Load your own IFC files
- 🏗️ **Sample Model**: Quickly try the viewer with the included sample file
- 🌐 **Interactive 3D**: Rotate, pan, zoom, and select elements
- 🎨 **Modern UI**: Clean dark-themed interface

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser at [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Controls

| Action      | Control            |
| ----------- | ------------------ |
| Rotate      | Left-click + drag  |
| Pan         | Right-click + drag |
| Zoom        | Scroll wheel       |
| Select part | Click on element   |

## Tech Stack

- **React** + **TypeScript** via Vite
- **Three.js** for 3D rendering
- **web-ifc-three** (IFCLoader) for IFC parsing

## License

MIT
