# IFC Viewer

A modern web application to load and explore IFC (Industry Foundation Classes) building models in an interactive 3D viewer.

## Features

- 📁 **Drag & Drop / File Upload**: Load your own IFC, `.dwg`, and other supported 3D model files
- 🏗️ **Sample Model**: Quickly try the viewer with the included sample file
- 🌐 **Interactive 3D**: Rotate, pan, zoom, and select elements
- 🎨 **Modern UI**: Clean dark-themed interface
- 🌈 **Theme Cycling**: Switch across multiple visual themes
- 💰 **Market Estimates**: Auto-estimate missing prices from public market data

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

### Firebase Setup (Frontend-only)

Create a `.env` file in the project root:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

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
