export type ViewerLocale = "en" | "fr" | "de" | "es" | "it" | "ar";
export type ViewerTheme =
  | "dark"
  | "light"
  | "aurora"
  | "midnight"
  | "forest"
  | "dark-bim"
  | "blueprint"
  | "construction-orange"
  | "technical-neon";

export const VIEWER_THEMES: ViewerTheme[] = [
  "dark",
  "light",
  "aurora",
  "midnight",
  "forest",
  "dark-bim",
  "blueprint",
  "construction-orange",
  "technical-neon",
];

export interface ViewerCopy {
  localeLabel: string;
  localeNames: Record<ViewerLocale, string>;
  themeLabel: string;
  themeNames: Record<ViewerTheme, string>;
  workspace: {
    commandPaletteTitle: string;
    commandPaletteSubtitle: string;
    expand: string;
    collapse: string;
    groupTitles: {
      navigation: string;
      visibility: string;
      measurements: string;
      actions: string;
    };
    searchTitle: string;
    searchSubtitle: string;
    searchPlaceholder: string;
    searchCategory: string;
    searchChipPrefix: string;
    heatmapTitle: string;
    heatmapSubtitle: string;
    heatmapModes: Record<"none" | "cost" | "progress" | "status" | "planning", string>;
    presenceTitle: string;
    presenceSubtitle: string;
    presenceActive: string;
    presenceStatuses: {
      online: string;
      away: string;
      typing: string;
    };
    activityTitle: string;
    activitySubtitle: string;
    activityKinds: {
      upload: string;
      comment: string;
      planning: string;
      action: string;
    };
    minimapTitle: string;
    minimapSubtitle: string;
    minimapFit: string;
    timelineTitle: string;
    timelineSubtitle: string;
    timelinePlay: string;
    timelinePause: string;
    timelineSpeed: string;
    metricsModelTypes: string;
    metricsComments: string;
    metricsFeedItems: string;
  };
  shell: {
    title: string;
    subtitle: string;
    statusReady: string;
    statusLoading: string;
    statusLoaded: string;
    errorPrefix: string;
  };
  layout: {
    collapseSidebar: string;
    openSidebar: string;
    openPanel: string;
    collapsePanel: string;
    tabProperties: string;
    tabComments: string;
    tabDocuments: string;
    tabPlanning: string;
    tabCosting: string;
    selectElement: string;
    projectUnavailable: string;
  };
  sidebar: {
    title: string;
    subtitle: string;
    uploadTitle: string;
    uploadHint: string;
    fitView: string;
    reset: string;
    clear: string;
    searchPlaceholder: string;
    modelInfo: string;
    elements: string;
    types: string;
    size: string;
    loadTime: string;
    noElements: string;
  };
  toolbar: {
    wire: string;
    grid: string;
    xray: string;
    measure: string;
    clear: string;
    clip: string;
    zoomIn: string;
    zoomOut: string;
    screenshot: string;
    shortcuts: string;
    focus: string;
    hide: string;
    showAll: string;
  };
  documents: {
    title: string;
    upload: string;
    uploading: string;
    loading: string;
    empty: string;
    versions: string;
    download: string;
    openViewer: string;
    previewUnavailable: string;
    activate: string;
    uploadError: string;
    downloadError: string;
    previewError: string;
  };
  planning: {
    importTitle: string;
    importSubtitle: string;
    importButton: string;
    importFailed: string;
    importFirst: string;
    tasksImported: string;
    noTasksFound: string;
    linkingTitle: string;
    linkingSubtitle: string;
    selectTask: string;
    linkButton: string;
    unlinkButton: string;
    selectedElement: string;
    noElementSelected: string;
    noLinks: string;
    playerTitle: string;
    playerSubtitle: string;
    play: string;
    pause: string;
    exportMp4: string;
    exporting: string;
    exportReadyMp4: string;
    exportReadyWebm: string;
    viewerUnavailable: string;
    recorderUnavailable: string;
    stepDuration: string;
    currentTask: string;
    predictiveTitle: string;
    predictiveSubtitle: string;
    noIssues: string;
    issueMissingDates: string;
    issueInvalidRange: string;
    issueUnknownPredecessor: string;
    issueUnlinkedTask: string;
    issueOverlap: string;
  };
  costing: {
    title: string;
    subtitle: string;
    importBpu: string;
    importLandXml: string;
    marketPricingTitle: string;
    marketPricingSubtitle: string;
    marketPricingSource: string;
    marketPricingRefresh: string;
    marketPricingLatest: string;
    marketPricingEstimate: string;
    importFailed: string;
    libraries: string;
    noLibraries: string;
    baseCurrency: string;
    threshold: string;
    quantityAuto: string;
    noQuantities: string;
    linkBpu: string;
    noLink: string;
    budgetEstimated: string;
    budgetModel: string;
    variance: string;
    varianceAlert: string;
    liveDashboard: string;
    progressTitle: string;
    selectedPiece: string;
    noSelection: string;
    progress: string;
    applyProgress: string;
    validate: string;
    generatePdf: string;
    generateXls: string;
    generated: string;
    disciplineTitle: string;
    building: string;
    structure: string;
    infra: string;
    art: string;
    landXmlMetrics: string;
    cutVolume: string;
    fillVolume: string;
    networkLength: string;
    roadArea: string;
    quantityCount: string;
    quantityArea: string;
    quantityVolume: string;
    quantityLength: string;
    quantityPerimeter: string;
  };
}

const EN: ViewerCopy = {
  localeLabel: "Language",
  localeNames: { en: "English", fr: "French", de: "German", es: "Spanish", it: "Italian", ar: "Arabic" },
  themeLabel: "Theme",
  themeNames: { dark: "Dark", light: "Light", aurora: "Aurora", midnight: "Midnight", forest: "Forest", "dark-bim": "Dark BIM", "blueprint": "Blueprint", "construction-orange": "Construction Orange", "technical-neon": "Technical Neon" },
  workspace: {
    commandPaletteTitle: "Command palette",
    commandPaletteSubtitle: "Smart BIM tools",
    expand: "Expand",
    collapse: "Collapse",
    groupTitles: {
      navigation: "Navigation",
      visibility: "Visibility",
      measurements: "Measurements",
      actions: "Actions",
    },
    searchTitle: "Object search",
    searchSubtitle: "Find model elements",
    searchPlaceholder: "Search by type, label, or category",
    searchCategory: "Model type",
    searchChipPrefix: "#",
    heatmapTitle: "Heatmaps",
    heatmapSubtitle: "Visualization modes",
    heatmapModes: {
      none: "Standard",
      cost: "Cost",
      progress: "Progress",
      status: "Status",
      planning: "Planning",
    },
    presenceTitle: "Live presence",
    presenceSubtitle: "Collaborators online",
    presenceActive: "active",
    presenceStatuses: {
      online: "online",
      away: "away",
      typing: "typing",
    },
    activityTitle: "Activity",
    activitySubtitle: "Real-time feed",
    activityKinds: {
      upload: "upload",
      comment: "comment",
      planning: "planning",
      action: "action",
    },
    minimapTitle: "Navigator",
    minimapSubtitle: "Floor minimap",
    minimapFit: "Fit",
    timelineTitle: "4D timeline",
    timelineSubtitle: "Construction flow",
    timelinePlay: "Play",
    timelinePause: "Pause",
    timelineSpeed: "Speed",
    metricsModelTypes: "Model types",
    metricsComments: "Comments",
    metricsFeedItems: "Feed items",
  },
  shell: {
    title: "Project Viewer",
    subtitle: "3D model, documents, comments, and chat in one workspace.",
    statusReady: "Ready to load a model",
    statusLoading: "Loading model...",
    statusLoaded: "Model loaded successfully",
    errorPrefix: "Error",
  },
  layout: {
    collapseSidebar: "Collapse sidebar",
    openSidebar: "Open sidebar",
    openPanel: "Open panel",
    collapsePanel: "Collapse panel",
    tabProperties: "Properties",
    tabComments: "Comments",
    tabDocuments: "Documents",
    tabPlanning: "4D Planning",
    tabCosting: "5D Costs",
    selectElement: "Select an element to view properties",
    projectUnavailable: "Project is not available.",
  },
  sidebar: {
    title: "File viewer",
    subtitle: "Load IFC, DWG, RVT, GLB, GLTF, OBJ, STL, FBX, or PLY files.",
    uploadTitle: "Upload 3D file",
    uploadHint: "Drag and drop or click to browse",
    fitView: "Fit view",
    reset: "Reset",
    clear: "Clear",
    searchPlaceholder: "Search element types...",
    modelInfo: "Model info",
    elements: "Elements",
    types: "Types",
    size: "Size",
    loadTime: "Load time",
    noElements: "No element types yet",
  },
  toolbar: {
    wire: "Wire",
    grid: "Grid",
    xray: "X-Ray",
    measure: "Meas",
    clear: "Clear",
    clip: "Clip",
    zoomIn: "In",
    zoomOut: "Out",
    screenshot: "Snap",
    shortcuts: "Keys",
    focus: "Focus",
    hide: "Hide",
    showAll: "Show",
  },
  documents: {
    title: "Documents",
    upload: "Upload",
    uploading: "Uploading...",
    loading: "Loading documents...",
    empty: "No documents uploaded yet",
    versions: "View versions",
    download: "Download",
    openViewer: "Open in 3D viewer",
    previewUnavailable: "Preview unavailable for this file type",
    activate: "Activate",
    uploadError: "Upload failed",
    downloadError: "Download failed",
    previewError: "This file type cannot be previewed in 3D.",
  },
  planning: {
    importTitle: "Import Planning",
    importSubtitle: "Compatible XML imports: MS Project, Primavera P6, Asta Powerproject.",
    importButton: "Import XML",
    importFailed: "Import failed",
    importFirst: "Import a planning file first",
    tasksImported: "tasks imported",
    noTasksFound: "No tasks found in this XML file",
    linkingTitle: "Object-Task Linking",
    linkingSubtitle: "Link selected 3D elements to planning tasks.",
    selectTask: "Select a task",
    linkButton: "Link selected element",
    unlinkButton: "Unlink",
    selectedElement: "Selected element",
    noElementSelected: "No element selected in 3D viewer",
    noLinks: "No links created yet",
    playerTitle: "4D Player",
    playerSubtitle: "Run phasing simulation and export a client-ready video.",
    play: "Play",
    pause: "Pause",
    exportMp4: "Export .mp4",
    exporting: "Exporting...",
    exportReadyMp4: "4D video exported as .mp4",
    exportReadyWebm: "Browser fallback exported as .webm (MP4 unsupported)",
    viewerUnavailable: "Viewer canvas is not available",
    recorderUnavailable: "Video recording is not supported in this browser",
    stepDuration: "Step duration",
    currentTask: "Current phase",
    predictiveTitle: "Predictive Analysis",
    predictiveSubtitle: "Automatic sequencing consistency checks.",
    noIssues: "No sequencing issues detected.",
    issueMissingDates: "Missing or invalid dates",
    issueInvalidRange: "Task end date is before start date",
    issueUnknownPredecessor: "Unknown predecessor reference",
    issueUnlinkedTask: "No linked 3D object",
    issueOverlap: "Potential overlap without dependency",
  },
  costing: {
    title: "5D Estimation & Cost Control",
    subtitle: "Price libraries, automated quantities, live financial dashboard.",
    importBpu: "Import Excel BPU",
    importLandXml: "Import LandXML",
    marketPricingTitle: "Market price estimates",
    marketPricingSubtitle: "Use a public building-materials index to adjust missing or imported unit prices.",
    marketPricingSource: "Source: FRED / Building Material and Supplies Dealers index",
    marketPricingRefresh: "Refresh market index",
    marketPricingLatest: "Latest index",
    marketPricingEstimate: "Estimated from market",
    importFailed: "Import failed",
    libraries: "Price libraries",
    noLibraries: "No BPU library imported yet",
    baseCurrency: "Base currency",
    threshold: "Alert threshold %",
    quantityAuto: "Automated quantities",
    noQuantities: "No BIM quantities available",
    linkBpu: "BPU link",
    noLink: "No linked item",
    budgetEstimated: "Estimated budget",
    budgetModel: "Model budget",
    variance: "Variance",
    varianceAlert: "Threshold exceeded",
    liveDashboard: "Live financial dashboard",
    progressTitle: "Digital attachment",
    selectedPiece: "Selected piece",
    noSelection: "Select a piece in the 3D viewer",
    progress: "Progress %",
    applyProgress: "Apply progress",
    validate: "Validate",
    generatePdf: "Generate PDF",
    generateXls: "Generate XLS",
    generated: "Situation generated",
    disciplineTitle: "Native multi-discipline support",
    building: "Building",
    structure: "Structure / MEP",
    infra: "Infra / VRD",
    art: "Civil structure",
    landXmlMetrics: "LandXML metrics",
    cutVolume: "Cut volume",
    fillVolume: "Fill volume",
    networkLength: "Network length",
    roadArea: "Road area",
    quantityCount: "Count",
    quantityArea: "Area",
    quantityVolume: "Volume",
    quantityLength: "Length",
    quantityPerimeter: "Perimeter",
  },
};

const FR: ViewerCopy = {
  ...EN,
  localeLabel: "Langue",
  localeNames: { en: "Anglais", fr: "Français", de: "Allemand", es: "Espagnol", it: "Italien", ar: "Arabe" },
  themeLabel: "Thème",
    themeNames: { dark: "Sombre", light: "Clair", aurora: "Aurore", midnight: "Minuit", forest: "Forêt", "dark-bim": "Dark BIM", "blueprint": "Blueprint", "construction-orange": "Construction Orange", "technical-neon": "Technical Neon" },
  workspace: {
    ...EN.workspace,
    commandPaletteTitle: "Palette de commandes",
    commandPaletteSubtitle: "Outils BIM intelligents",
    expand: "Développer",
    collapse: "Réduire",
    groupTitles: {
      navigation: "Navigation",
      visibility: "Visibilité",
      measurements: "Mesures",
      actions: "Actions",
    },
    searchTitle: "Recherche d’objets",
    searchSubtitle: "Trouver des éléments du modèle",
    searchPlaceholder: "Rechercher par type, libellé ou catégorie",
    searchCategory: "Type de modèle",
    searchChipPrefix: "#",
    heatmapTitle: "Cartes thermiques",
    heatmapSubtitle: "Modes de visualisation",
    heatmapModes: {
      none: "Standard",
      cost: "Coût",
      progress: "Avancement",
      status: "Statut",
      planning: "Planning",
    },
    presenceTitle: "Présence en direct",
    presenceSubtitle: "Collaborateurs connectés",
    presenceActive: "actifs",
    presenceStatuses: {
      online: "en ligne",
      away: "absent",
      typing: "en train d’écrire",
    },
    activityTitle: "Activité",
    activitySubtitle: "Flux en temps réel",
    activityKinds: {
      upload: "import",
      comment: "commentaire",
      planning: "planning",
      action: "action",
    },
    minimapTitle: "Navigateur",
    minimapSubtitle: "Mini-plan des niveaux",
    minimapFit: "Ajuster",
    timelineTitle: "Chronologie 4D",
    timelineSubtitle: "Flux de construction",
    timelinePlay: "Lire",
    timelinePause: "Pause",
    timelineSpeed: "Vitesse",
    metricsModelTypes: "Types de modèle",
    metricsComments: "Commentaires",
    metricsFeedItems: "Éléments du flux",
  },
  shell: {
    title: "Visionneuse projet",
    subtitle: "Maquette 3D, documents, commentaires et chat dans un seul espace.",
    statusReady: "Prêt à charger un modèle",
    statusLoading: "Chargement du modèle...",
    statusLoaded: "Modèle chargé avec succès",
    errorPrefix: "Erreur",
  },
  layout: {
    collapseSidebar: "Réduire la barre latérale",
    openSidebar: "Ouvrir la barre latérale",
    openPanel: "Ouvrir le panneau",
    collapsePanel: "Réduire le panneau",
    tabProperties: "Propriétés",
    tabComments: "Commentaires",
    tabDocuments: "Documents",
    tabPlanning: "Planning 4D",
    tabCosting: "Coûts 5D",
    selectElement: "Sélectionnez un élément pour voir ses propriétés",
    projectUnavailable: "Le projet est indisponible.",
  },
  sidebar: {
    title: "Visionneuse de fichier",
    subtitle: "Chargez des fichiers IFC, DWG, RVT, GLB, GLTF, OBJ, STL, FBX ou PLY.",
    uploadTitle: "Importer un fichier 3D",
    uploadHint: "Glissez-déposez ou cliquez pour parcourir",
    fitView: "Ajuster",
    reset: "Réinitialiser",
    clear: "Effacer",
    searchPlaceholder: "Rechercher les types d'éléments...",
    modelInfo: "Infos modèle",
    elements: "Éléments",
    types: "Types",
    size: "Taille",
    loadTime: "Temps de chargement",
    noElements: "Aucun type d'élément",
  },
  toolbar: {
    wire: "Fil",
    grid: "Grille",
    xray: "Rayons X",
    measure: "Mesure",
    clear: "Vider",
    clip: "Coupe",
    zoomIn: "Plus",
    zoomOut: "Moins",
    screenshot: "Capt.",
    shortcuts: "Touches",
    focus: "Focus",
    hide: "Masquer",
    showAll: "Tout",
  },
  documents: {
    title: "Documents",
    upload: "Importer",
    uploading: "Import...",
    loading: "Chargement des documents...",
    empty: "Aucun document importé",
    versions: "Voir les versions",
    download: "Télécharger",
    openViewer: "Ouvrir dans la visionneuse 3D",
    previewUnavailable: "Aperçu indisponible pour ce type de fichier",
    activate: "Activer",
    uploadError: "Échec de l'import",
    downloadError: "Échec du téléchargement",
    previewError: "Ce type de fichier ne peut pas être prévisualisé en 3D.",
  },
  planning: {
    ...EN.planning,
    importTitle: "Import planning",
    importSubtitle: "Import XML compatible MS Project, Primavera P6, Asta Powerproject.",
    importButton: "Importer XML",
    importFailed: "Échec de l'import",
    importFirst: "Importez d'abord un planning",
    tasksImported: "tâches importées",
    noTasksFound: "Aucune tâche trouvée dans ce fichier XML",
    linkingTitle: "Liaison Objet-Tâche",
    linkingSubtitle: "Liez l'élément 3D sélectionné à une tâche du planning.",
    selectTask: "Sélectionner une tâche",
    linkButton: "Lier l'élément sélectionné",
    unlinkButton: "Délier",
    selectedElement: "Élément sélectionné",
    noElementSelected: "Aucun élément sélectionné dans la vue 3D",
    noLinks: "Aucune liaison créée",
    playerTitle: "Player 4D",
    playerSubtitle: "Simulez le phasage chantier et exportez la vidéo client.",
    play: "Lire",
    pause: "Pause",
    exportMp4: "Exporter .mp4",
    exporting: "Export...",
    exportReadyMp4: "Vidéo 4D exportée en .mp4",
    exportReadyWebm: "Export fallback en .webm (MP4 non supporté)",
    viewerUnavailable: "Canvas 3D indisponible",
    recorderUnavailable: "L'enregistrement vidéo n'est pas supporté ici",
    stepDuration: "Durée d'étape",
    currentTask: "Phase en cours",
    predictiveTitle: "Analyse prédictive",
    predictiveSubtitle: "Détection automatique des incohérences de séquencement.",
    noIssues: "Aucune incohérence détectée.",
    issueMissingDates: "Dates manquantes ou invalides",
    issueInvalidRange: "Date de fin antérieure à la date de début",
    issueUnknownPredecessor: "Référence de prédécesseur inconnue",
    issueUnlinkedTask: "Aucun objet 3D lié",
    issueOverlap: "Chevauchement potentiel sans dépendance",
  },
  costing: {
    ...EN.costing,
    title: "Estimation 5D & Contrôle des coûts",
    subtitle: "Bibliothèques BPU, quantités automatisées, dashboard financier live.",
    importBpu: "Importer BPU Excel",
    importLandXml: "Importer LandXML",
    marketPricingTitle: "Estimations de prix marché",
    marketPricingSubtitle: "Utilise un indice public des matériaux pour ajuster les prix unitaires manquants ou importés.",
    marketPricingSource: "Source : FRED / indice Building Material and Supplies Dealers",
    marketPricingRefresh: "Actualiser l'indice",
    marketPricingLatest: "Indice le plus récent",
    marketPricingEstimate: "Estimé depuis le marché",
    importFailed: "Échec de l'import",
    libraries: "Bibliothèques de prix",
    noLibraries: "Aucune bibliothèque BPU importée",
    baseCurrency: "Devise de base",
    threshold: "Seuil d'alerte %",
    quantityAuto: "Quantitatif automatisé",
    noQuantities: "Aucune quantité BIM disponible",
    linkBpu: "Liaison BPU",
    noLink: "Aucun article lié",
    budgetEstimated: "Budget estimé",
    budgetModel: "Budget maquette",
    variance: "Écart",
    varianceAlert: "Seuil dépassé",
    liveDashboard: "Dashboard financier live",
    progressTitle: "Attachement digital",
    selectedPiece: "Pièce sélectionnée",
    noSelection: "Sélectionnez une pièce dans la maquette 3D",
    progress: "Avancement %",
    applyProgress: "Appliquer l'avancement",
    validate: "Valider",
    generatePdf: "Générer PDF",
    generateXls: "Générer XLS",
    generated: "Situation générée",
    disciplineTitle: "Support multi-métiers natif",
    building: "Bâtiment",
    structure: "Structure / MEP",
    infra: "Infra / VRD",
    art: "Ouvrage d'art",
    landXmlMetrics: "Métriques LandXML",
    cutVolume: "Volume déblais",
    fillVolume: "Volume remblais",
    networkLength: "Linéaire réseau",
    roadArea: "Surface chaussée",
    quantityCount: "Nombre",
    quantityArea: "Surface",
    quantityVolume: "Volume",
    quantityLength: "Longueur",
    quantityPerimeter: "Périmètre",
  },
};

const DE: ViewerCopy = {
  ...EN,
  localeLabel: "Sprache",
  localeNames: { en: "Englisch", fr: "Französisch", de: "Deutsch", es: "Spanisch", it: "Italienisch", ar: "Arabisch" },
  themeLabel: "Design",
    themeNames: { dark: "Dunkel", light: "Hell", aurora: "Aurora", midnight: "Mitternacht", forest: "Wald", "dark-bim": "Dark BIM", "blueprint": "Blueprint", "construction-orange": "Construction Orange", "technical-neon": "Technical Neon" },
  workspace: {
    ...EN.workspace,
    commandPaletteTitle: "Befehlsleiste",
    commandPaletteSubtitle: "Intelligente BIM-Tools",
    expand: "Erweitern",
    collapse: "Einklappen",
    groupTitles: {
      navigation: "Navigation",
      visibility: "Sichtbarkeit",
      measurements: "Messungen",
      actions: "Aktionen",
    },
    searchTitle: "Objektsuche",
    searchSubtitle: "Modellelemente finden",
    searchPlaceholder: "Nach Typ, Bezeichnung oder Kategorie suchen",
    searchCategory: "Modelltyp",
    searchChipPrefix: "#",
    heatmapTitle: "Heatmaps",
    heatmapSubtitle: "Visualisierungsmodi",
    heatmapModes: {
      none: "Standard",
      cost: "Kosten",
      progress: "Fortschritt",
      status: "Status",
      planning: "Planung",
    },
    presenceTitle: "Live-Präsenz",
    presenceSubtitle: "Kollaboratoren online",
    presenceActive: "aktiv",
    presenceStatuses: {
      online: "online",
      away: "abwesend",
      typing: "tippt",
    },
    activityTitle: "Aktivität",
    activitySubtitle: "Echtzeit-Feed",
    activityKinds: {
      upload: "Upload",
      comment: "Kommentar",
      planning: "Planung",
      action: "Aktion",
    },
    minimapTitle: "Navigator",
    minimapSubtitle: "Mini-Grundriss",
    minimapFit: "Anpassen",
    timelineTitle: "4D-Zeitleiste",
    timelineSubtitle: "Bauablauf",
    timelinePlay: "Start",
    timelinePause: "Pause",
    timelineSpeed: "Geschwindigkeit",
    metricsModelTypes: "Modelltypen",
    metricsComments: "Kommentare",
    metricsFeedItems: "Feed-Elemente",
  },
  shell: {
    title: "Projekt-Viewer",
    subtitle: "3D-Modell, Dokumente, Kommentare und Chat in einem Arbeitsbereich.",
    statusReady: "Bereit zum Laden eines Modells",
    statusLoading: "Modell wird geladen...",
    statusLoaded: "Modell erfolgreich geladen",
    errorPrefix: "Fehler",
  },
  layout: {
    collapseSidebar: "Seitenleiste einklappen",
    openSidebar: "Seitenleiste öffnen",
    openPanel: "Panel öffnen",
    collapsePanel: "Panel einklappen",
    tabProperties: "Eigenschaften",
    tabComments: "Kommentare",
    tabDocuments: "Dokumente",
    tabPlanning: "4D-Planung",
    tabCosting: "5D-Kosten",
    selectElement: "Wähle ein Element, um Eigenschaften anzuzeigen",
    projectUnavailable: "Projekt ist nicht verfügbar.",
  },
  sidebar: {
    title: "Datei-Viewer",
    subtitle: "Lade IFC-, DWG-, RVT-, GLB-, GLTF-, OBJ-, STL-, FBX- oder PLY-Dateien.",
    uploadTitle: "3D-Datei hochladen",
    uploadHint: "Per Drag-and-drop oder Klick auswählen",
    fitView: "Ansicht anpassen",
    reset: "Zurücksetzen",
    clear: "Leeren",
    searchPlaceholder: "Elementtypen suchen...",
    modelInfo: "Modellinfo",
    elements: "Elemente",
    types: "Typen",
    size: "Größe",
    loadTime: "Ladezeit",
    noElements: "Noch keine Elementtypen",
  },
  toolbar: {
    wire: "Draht",
    grid: "Raster",
    xray: "Röntgen",
    measure: "Messen",
    clear: "Leeren",
    clip: "Schnitt",
    zoomIn: "Rein",
    zoomOut: "Raus",
    screenshot: "Bild",
    shortcuts: "Tasten",
    focus: "Fokus",
    hide: "Ausbl.",
    showAll: "Alle",
  },
  documents: {
    title: "Dokumente",
    upload: "Hochladen",
    uploading: "Wird hochgeladen...",
    loading: "Dokumente werden geladen...",
    empty: "Noch keine Dokumente hochgeladen",
    versions: "Versionen anzeigen",
    download: "Herunterladen",
    openViewer: "Im 3D-Viewer öffnen",
    previewUnavailable: "Vorschau für diesen Dateityp nicht verfügbar",
    activate: "Aktivieren",
    uploadError: "Upload fehlgeschlagen",
    downloadError: "Download fehlgeschlagen",
    previewError: "Dieser Dateityp kann nicht in 3D angezeigt werden.",
  },
  costing: {
    ...EN.costing,
    title: "5D Kostensteuerung",
    subtitle: "Preislisten, automatische Mengen, Live-Finanzdashboard.",
    importBpu: "Excel BPU importieren",
    importLandXml: "LandXML importieren",
    marketPricingTitle: "Marktpreis-Schätzungen",
    marketPricingSubtitle: "Verwendet einen öffentlichen Baustoff-Index, um fehlende oder importierte Einheitspreise anzupassen.",
    marketPricingSource: "Quelle: FRED / Building Material and Supplies Dealers Index",
    marketPricingRefresh: "Marktindex aktualisieren",
    marketPricingLatest: "Aktueller Index",
    marketPricingEstimate: "Vom Markt geschätzt",
  },
};

const AR: ViewerCopy = {
  ...EN,
  localeLabel: "اللغة",
  localeNames: { en: "الإنجليزية", fr: "الفرنسية", de: "الألمانية", es: "الإسبانية", it: "الإيطالية", ar: "العربية" },
  themeLabel: "السمة",
    themeNames: { dark: "داكن", light: "فاتح", aurora: "أورورا", midnight: "منتصف الليل", forest: "غابة", "dark-bim": "Dark BIM", "blueprint": "Blueprint", "construction-orange": "Construction Orange", "technical-neon": "Technical Neon" },
  workspace: {
    ...EN.workspace,
    commandPaletteTitle: "لوحة الأوامر",
    commandPaletteSubtitle: "أدوات BIM ذكية",
    expand: "توسيع",
    collapse: "طي",
    groupTitles: {
      navigation: "التنقل",
      visibility: "الظهور",
      measurements: "القياسات",
      actions: "الإجراءات",
    },
    searchTitle: "بحث العناصر",
    searchSubtitle: "اعثر على عناصر النموذج",
    searchPlaceholder: "ابحث حسب النوع أو الاسم أو الفئة",
    searchCategory: "نوع النموذج",
    searchChipPrefix: "#",
    heatmapTitle: "خرائط حرارية",
    heatmapSubtitle: "أوضاع العرض",
    heatmapModes: {
      none: "عادي",
      cost: "التكلفة",
      progress: "التقدم",
      status: "الحالة",
      planning: "التخطيط",
    },
    presenceTitle: "الحضور المباشر",
    presenceSubtitle: "المتعاونون المتصلون",
    presenceActive: "نشط",
    presenceStatuses: {
      online: "متصل",
      away: "بعيد",
      typing: "يكتب",
    },
    activityTitle: "النشاط",
    activitySubtitle: "موجز مباشر",
    activityKinds: {
      upload: "رفع",
      comment: "تعليق",
      planning: "تخطيط",
      action: "إجراء",
    },
    minimapTitle: "المنظّم",
    minimapSubtitle: "خريطة الطوابق المصغرة",
    minimapFit: "ملاءمة",
    timelineTitle: "الخط الزمني 4D",
    timelineSubtitle: "تدفق البناء",
    timelinePlay: "تشغيل",
    timelinePause: "إيقاف",
    timelineSpeed: "السرعة",
    metricsModelTypes: "أنواع النموذج",
    metricsComments: "التعليقات",
    metricsFeedItems: "عناصر الموجز",
  },
  shell: {
    title: "عارض المشروع",
    subtitle: "نموذج 3D ووثائق وتعليقات ودردشة في مساحة واحدة.",
    statusReady: "جاهز لتحميل نموذج",
    statusLoading: "جارٍ تحميل النموذج...",
    statusLoaded: "تم تحميل النموذج بنجاح",
    errorPrefix: "خطأ",
  },
  layout: {
    collapseSidebar: "طي الشريط الجانبي",
    openSidebar: "فتح الشريط الجانبي",
    openPanel: "فتح اللوحة",
    collapsePanel: "طي اللوحة",
    tabProperties: "الخصائص",
    tabComments: "التعليقات",
    tabDocuments: "الوثائق",
    tabPlanning: "تخطيط 4D",
    tabCosting: "تكاليف 5D",
    selectElement: "حدّد عنصرًا لعرض الخصائص",
    projectUnavailable: "المشروع غير متاح.",
  },
  sidebar: {
    title: "عارض الملفات",
    subtitle: "حمّل ملفات IFC وDWG وRVT وGLB وGLTF وOBJ وSTL وFBX وPLY.",
    uploadTitle: "رفع ملف 3D",
    uploadHint: "اسحب وأفلت أو انقر للتصفح",
    fitView: "ضبط العرض",
    reset: "إعادة تعيين",
    clear: "مسح",
    searchPlaceholder: "ابحث في أنواع العناصر...",
    modelInfo: "معلومات النموذج",
    elements: "العناصر",
    types: "الأنواع",
    size: "الحجم",
    loadTime: "وقت التحميل",
    noElements: "لا توجد أنواع عناصر بعد",
  },
  toolbar: {
    wire: "سلكي",
    grid: "شبكة",
    xray: "أشعة",
    measure: "قياس",
    clear: "مسح",
    clip: "قص",
    zoomIn: "تكبير",
    zoomOut: "تصغير",
    screenshot: "لقطة",
    shortcuts: "اختصارات",
    focus: "تركيز",
    hide: "إخفاء",
    showAll: "إظهار",
  },
  documents: {
    title: "الوثائق",
    upload: "رفع",
    uploading: "جارٍ الرفع...",
    loading: "جارٍ تحميل الوثائق...",
    empty: "لا توجد وثائق مرفوعة بعد",
    versions: "عرض الإصدارات",
    download: "تنزيل",
    openViewer: "فتح في عارض 3D",
    previewUnavailable: "المعاينة غير متاحة لهذا النوع",
    activate: "تفعيل",
    uploadError: "فشل الرفع",
    downloadError: "فشل التنزيل",
    previewError: "لا يمكن معاينة هذا النوع من الملفات ثلاثي الأبعاد.",
  },
  costing: {
    ...EN.costing,
    title: "تقدير 5D والتحكم بالتكلفة",
    subtitle: "مكتبات الأسعار والكميات الآلية ولوحة مالية مباشرة.",
    importBpu: "استيراد BPU Excel",
    importLandXml: "استيراد LandXML",
    marketPricingTitle: "تقديرات أسعار السوق",
    marketPricingSubtitle: "يستخدم مؤشرًا عامًا لمواد البناء لتعديل الأسعار الوحدوية المفقودة أو المستوردة.",
    marketPricingSource: "المصدر: FRED / مؤشر Building Material and Supplies Dealers",
    marketPricingRefresh: "تحديث مؤشر السوق",
    marketPricingLatest: "آخر مؤشر",
    marketPricingEstimate: "مقدّر من السوق",
  },
};

const ES: ViewerCopy = {
  ...EN,
  localeLabel: "Idioma",
  localeNames: { en: "Inglés", fr: "Francés", de: "Alemán", es: "Español", it: "Italiano", ar: "Árabe" },
  themeLabel: "Tema",
  themeNames: { dark: "Oscuro", light: "Claro", aurora: "Aurora", midnight: "Medianoche", forest: "Bosque", "dark-bim": "Dark BIM", "blueprint": "Blueprint", "construction-orange": "Construction Orange", "technical-neon": "Technical Neon" },
  shell: {
    title: "Visor de proyecto",
    subtitle: "Modelo 3D, documentos, comentarios y chat en un solo espacio de trabajo.",
    statusReady: "Listo para cargar un modelo",
    statusLoading: "Cargando modelo...",
    statusLoaded: "Modelo cargado correctamente",
    errorPrefix: "Error",
  },
  layout: {
    collapseSidebar: "Contraer barra lateral",
    openSidebar: "Abrir barra lateral",
    openPanel: "Abrir panel",
    collapsePanel: "Contraer panel",
    tabProperties: "Propiedades",
    tabComments: "Comentarios",
    tabDocuments: "Documentos",
    tabPlanning: "Planificación 4D",
    tabCosting: "Costes 5D",
    selectElement: "Selecciona un elemento para ver sus propiedades",
    projectUnavailable: "El proyecto no está disponible.",
  },
  sidebar: {
    title: "Visor de archivos",
    subtitle: "Carga archivos IFC, DWG, RVT, GLB, GLTF, OBJ, STL, FBX o PLY.",
    uploadTitle: "Subir archivo 3D",
    uploadHint: "Arrastra y suelta o haz clic para buscar",
    fitView: "Ajustar vista",
    reset: "Restablecer",
    clear: "Borrar",
    searchPlaceholder: "Buscar tipos de elementos...",
    modelInfo: "Información del modelo",
    elements: "Elementos",
    types: "Tipos",
    size: "Tamaño",
    loadTime: "Tiempo de carga",
    noElements: "Aún no hay tipos de elementos",
  },
  toolbar: {
    wire: "Malla",
    grid: "Cuadrícula",
    xray: "Rayos X",
    measure: "Medir",
    clear: "Borrar",
    clip: "Corte",
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    screenshot: "Captura",
    shortcuts: "Teclas",
    focus: "Enfocar",
    hide: "Ocultar",
    showAll: "Mostrar",
  },
  documents: {
    title: "Documentos",
    upload: "Subir",
    uploading: "Subiendo...",
    loading: "Cargando documentos...",
    empty: "Todavía no hay documentos subidos",
    versions: "Ver versiones",
    download: "Descargar",
    openViewer: "Abrir en el visor 3D",
    previewUnavailable: "Vista previa no disponible para este tipo de archivo",
    activate: "Activar",
    uploadError: "Error de subida",
    downloadError: "Error de descarga",
    previewError: "Este tipo de archivo no se puede previsualizar en 3D.",
  },
  planning: {
    ...EN.planning,
    importTitle: "Importar planificación",
    importSubtitle: "Importación XML compatible con MS Project, Primavera P6 y Asta Powerproject.",
    importButton: "Importar XML",
    importFailed: "Error de importación",
    importFirst: "Importa primero un archivo de planificación",
    tasksImported: "tareas importadas",
    noTasksFound: "No se encontraron tareas en este archivo XML",
    linkingTitle: "Vinculación objeto-tarea",
    linkingSubtitle: "Vincula elementos 3D seleccionados a tareas de planificación.",
    selectTask: "Selecciona una tarea",
    linkButton: "Vincular elemento seleccionado",
    unlinkButton: "Desvincular",
    selectedElement: "Elemento seleccionado",
    noElementSelected: "No hay ningún elemento seleccionado en el visor 3D",
    noLinks: "Aún no hay vínculos creados",
    playerTitle: "Reproductor 4D",
    playerSubtitle: "Ejecuta la simulación de fases y exporta un vídeo para cliente.",
    play: "Reproducir",
    pause: "Pausar",
    exportMp4: "Exportar .mp4",
    exporting: "Exportando...",
    exportReadyMp4: "Vídeo 4D exportado como .mp4",
    exportReadyWebm: "Exportación alternativa en .webm (MP4 no compatible)",
    viewerUnavailable: "El lienzo 3D no está disponible",
    recorderUnavailable: "La grabación de vídeo no es compatible en este navegador",
    stepDuration: "Duración del paso",
    currentTask: "Fase actual",
    predictiveTitle: "Análisis predictivo",
    predictiveSubtitle: "Comprobaciones automáticas de coherencia de secuencias.",
    noIssues: "No se detectaron problemas de secuencia.",
    issueMissingDates: "Fechas faltantes o inválidas",
    issueInvalidRange: "La fecha de fin es anterior a la de inicio",
    issueUnknownPredecessor: "Referencia de predecesor desconocida",
    issueUnlinkedTask: "Sin objeto 3D vinculado",
    issueOverlap: "Posible solapamiento sin dependencia",
  },
  costing: {
    ...EN.costing,
    title: "Estimación 5D y control de costes",
    subtitle: "Bibliotecas de precios, cantidades automáticas y panel financiero en vivo.",
    importBpu: "Importar BPU Excel",
    importLandXml: "Importar LandXML",
    marketPricingTitle: "Estimaciones de precios de mercado",
    marketPricingSubtitle:
      "Usa un índice público de materiales de construcción para ajustar precios unitarios faltantes o importados.",
    marketPricingSource: "Fuente: FRED / índice Building Material and Supplies Dealers",
    marketPricingRefresh: "Actualizar índice de mercado",
    marketPricingLatest: "Índice más reciente",
    marketPricingEstimate: "Estimado desde el mercado",
    importFailed: "Error de importación",
    libraries: "Bibliotecas de precios",
    noLibraries: "Aún no hay ninguna biblioteca BPU importada",
    baseCurrency: "Moneda base",
    threshold: "Umbral de alerta %",
    quantityAuto: "Cantidades automáticas",
    noQuantities: "No hay cantidades BIM disponibles",
    linkBpu: "Vínculo BPU",
    noLink: "Ningún elemento vinculado",
    budgetEstimated: "Presupuesto estimado",
    budgetModel: "Presupuesto del modelo",
    variance: "Variación",
    varianceAlert: "Umbral superado",
    liveDashboard: "Panel financiero en vivo",
    progressTitle: "Adjunto digital",
    selectedPiece: "Pieza seleccionada",
    noSelection: "Selecciona una pieza en el visor 3D",
    progress: "Progreso %",
    applyProgress: "Aplicar progreso",
    validate: "Validar",
    generatePdf: "Generar PDF",
    generateXls: "Generar XLS",
    generated: "Situación generada",
    disciplineTitle: "Soporte multi-disciplina nativo",
    building: "Edificio",
    structure: "Estructura / MEP",
    infra: "Infra / VRD",
    art: "Obra civil",
    landXmlMetrics: "Métricas LandXML",
    cutVolume: "Volumen de desmonte",
    fillVolume: "Volumen de relleno",
    networkLength: "Longitud de red",
    roadArea: "Área de calzada",
    quantityCount: "Cantidad",
    quantityArea: "Área",
    quantityVolume: "Volumen",
    quantityLength: "Longitud",
    quantityPerimeter: "Perímetro",
  },
};

const IT: ViewerCopy = {
  ...EN,
  localeLabel: "Lingua",
  localeNames: { en: "Inglese", fr: "Francese", de: "Tedesco", es: "Spagnolo", it: "Italiano", ar: "Arabo" },
  themeLabel: "Tema",
  themeNames: { dark: "Scuro", light: "Chiaro", aurora: "Aurora", midnight: "Mezzanotte", forest: "Foresta", "dark-bim": "Dark BIM", "blueprint": "Blueprint", "construction-orange": "Construction Orange", "technical-neon": "Technical Neon" },
  shell: {
    title: "Visualizzatore progetto",
    subtitle: "Modello 3D, documenti, commenti e chat in un unico spazio di lavoro.",
    statusReady: "Pronto per caricare un modello",
    statusLoading: "Caricamento del modello...",
    statusLoaded: "Modello caricato correttamente",
    errorPrefix: "Errore",
  },
  layout: {
    collapseSidebar: "Comprimi barra laterale",
    openSidebar: "Apri barra laterale",
    openPanel: "Apri pannello",
    collapsePanel: "Comprimi pannello",
    tabProperties: "Proprietà",
    tabComments: "Commenti",
    tabDocuments: "Documenti",
    tabPlanning: "Pianificazione 4D",
    tabCosting: "Costi 5D",
    selectElement: "Seleziona un elemento per vedere le proprietà",
    projectUnavailable: "Il progetto non è disponibile.",
  },
  sidebar: {
    title: "Visualizzatore file",
    subtitle: "Carica file IFC, DWG, RVT, GLB, GLTF, OBJ, STL, FBX o PLY.",
    uploadTitle: "Carica file 3D",
    uploadHint: "Trascina e rilascia oppure fai clic per sfogliare",
    fitView: "Adatta vista",
    reset: "Ripristina",
    clear: "Cancella",
    searchPlaceholder: "Cerca tipi di elemento...",
    modelInfo: "Info modello",
    elements: "Elementi",
    types: "Tipi",
    size: "Dimensione",
    loadTime: "Tempo di caricamento",
    noElements: "Nessun tipo di elemento ancora",
  },
  toolbar: {
    wire: "Wireframe",
    grid: "Griglia",
    xray: "Raggi X",
    measure: "Misura",
    clear: "Cancella",
    clip: "Sezione",
    zoomIn: "Zoom +",
    zoomOut: "Zoom -",
    screenshot: "Screenshot",
    shortcuts: "Tasti",
    focus: "Focus",
    hide: "Nascondi",
    showAll: "Mostra",
  },
  documents: {
    title: "Documenti",
    upload: "Carica",
    uploading: "Caricamento...",
    loading: "Caricamento documenti...",
    empty: "Nessun documento caricato ancora",
    versions: "Vedi versioni",
    download: "Scarica",
    openViewer: "Apri nel visualizzatore 3D",
    previewUnavailable: "Anteprima non disponibile per questo tipo di file",
    activate: "Attiva",
    uploadError: "Caricamento non riuscito",
    downloadError: "Download non riuscito",
    previewError: "Questo tipo di file non può essere visualizzato in 3D.",
  },
  planning: {
    ...EN.planning,
    importTitle: "Importa pianificazione",
    importSubtitle: "Import XML compatibile con MS Project, Primavera P6 e Asta Powerproject.",
    importButton: "Importa XML",
    importFailed: "Importazione non riuscita",
    importFirst: "Importa prima un file di pianificazione",
    tasksImported: "attività importate",
    noTasksFound: "Nessuna attività trovata in questo file XML",
    linkingTitle: "Collegamento oggetto-attività",
    linkingSubtitle: "Collega gli elementi 3D selezionati alle attività di pianificazione.",
    selectTask: "Seleziona un'attività",
    linkButton: "Collega elemento selezionato",
    unlinkButton: "Scollega",
    selectedElement: "Elemento selezionato",
    noElementSelected: "Nessun elemento selezionato nel visualizzatore 3D",
    noLinks: "Nessun collegamento creato",
    playerTitle: "Player 4D",
    playerSubtitle: "Esegui la simulazione delle fasi ed esporta un video per il cliente.",
    play: "Riproduci",
    pause: "Pausa",
    exportMp4: "Esporta .mp4",
    exporting: "Esportazione...",
    exportReadyMp4: "Video 4D esportato in .mp4",
    exportReadyWebm: "Esportazione alternativa in .webm (MP4 non supportato)",
    viewerUnavailable: "Il canvas 3D non è disponibile",
    recorderUnavailable: "La registrazione video non è supportata in questo browser",
    stepDuration: "Durata del passo",
    currentTask: "Fase corrente",
    predictiveTitle: "Analisi predittiva",
    predictiveSubtitle: "Controlli automatici di coerenza delle sequenze.",
    noIssues: "Nessun problema di sequenza rilevato.",
    issueMissingDates: "Date mancanti o non valide",
    issueInvalidRange: "La data di fine precede la data di inizio",
    issueUnknownPredecessor: "Riferimento predecessore sconosciuto",
    issueUnlinkedTask: "Nessun oggetto 3D collegato",
    issueOverlap: "Possibile sovrapposizione senza dipendenza",
  },
  costing: {
    ...EN.costing,
    title: "Stima 5D e controllo costi",
    subtitle: "Librerie prezzi, quantità automatiche e dashboard finanziaria live.",
    importBpu: "Importa BPU Excel",
    importLandXml: "Importa LandXML",
    marketPricingTitle: "Stime prezzi di mercato",
    marketPricingSubtitle:
      "Usa un indice pubblico dei materiali da costruzione per adeguare i prezzi unitari mancanti o importati.",
    marketPricingSource: "Fonte: FRED / indice Building Material and Supplies Dealers",
    marketPricingRefresh: "Aggiorna indice di mercato",
    marketPricingLatest: "Indice più recente",
    marketPricingEstimate: "Stimato dal mercato",
    importFailed: "Importazione non riuscita",
    libraries: "Librerie prezzi",
    noLibraries: "Nessuna libreria BPU importata ancora",
    baseCurrency: "Valuta base",
    threshold: "Soglia di allerta %",
    quantityAuto: "Quantità automatiche",
    noQuantities: "Nessuna quantità BIM disponibile",
    linkBpu: "Collegamento BPU",
    noLink: "Nessun elemento collegato",
    budgetEstimated: "Budget stimato",
    budgetModel: "Budget modello",
    variance: "Varianza",
    varianceAlert: "Soglia superata",
    liveDashboard: "Dashboard finanziaria live",
    progressTitle: "Allegato digitale",
    selectedPiece: "Elemento selezionato",
    noSelection: "Seleziona un elemento nel visualizzatore 3D",
    progress: "Progresso %",
    applyProgress: "Applica progresso",
    validate: "Valida",
    generatePdf: "Genera PDF",
    generateXls: "Genera XLS",
    generated: "Situazione generata",
    disciplineTitle: "Supporto multi-disciplina nativo",
    building: "Edificio",
    structure: "Struttura / MEP",
    infra: "Infra / VRD",
    art: "Opera civile",
    landXmlMetrics: "Metriche LandXML",
    cutVolume: "Volume scavo",
    fillVolume: "Volume riempimento",
    networkLength: "Lunghezza rete",
    roadArea: "Area strada",
    quantityCount: "Conteggio",
    quantityArea: "Area",
    quantityVolume: "Volume",
    quantityLength: "Lunghezza",
    quantityPerimeter: "Perimetro",
  },
};

export function getViewerCopy(locale: ViewerLocale) {
  switch (locale) {
    case "fr":
      return FR;
    case "de":
      return DE;
    case "es":
      return ES;
    case "it":
      return IT;
    case "ar":
      return AR;
    default:
      return EN;
  }
}
