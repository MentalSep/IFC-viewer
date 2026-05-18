export type ViewerLocale = "en" | "fr" | "de" | "ar";
export type ViewerTheme = "dark" | "light" | "aurora";

export const VIEWER_THEMES: ViewerTheme[] = ["dark", "light", "aurora"];

export interface ViewerCopy {
  localeLabel: string;
  localeNames: Record<ViewerLocale, string>;
  themeLabel: string;
  themeNames: Record<ViewerTheme, string>;
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
  localeNames: { en: "English", fr: "French", de: "German", ar: "Arabic" },
  themeLabel: "Theme",
  themeNames: { dark: "Dark", light: "Light", aurora: "Aurora" },
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
    subtitle: "Load IFC, RVT, GLB, GLTF, OBJ, STL, FBX, or PLY files.",
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
  localeNames: { en: "Anglais", fr: "Français", de: "Allemand", ar: "Arabe" },
  themeLabel: "Thème",
  themeNames: { dark: "Sombre", light: "Clair", aurora: "Aurore" },
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
    subtitle: "Chargez des fichiers IFC, RVT, GLB, GLTF, OBJ, STL, FBX ou PLY.",
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
  localeNames: { en: "Englisch", fr: "Französisch", de: "Deutsch", ar: "Arabisch" },
  themeLabel: "Design",
  themeNames: { dark: "Dunkel", light: "Hell", aurora: "Aurora" },
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
    subtitle: "Lade IFC-, RVT-, GLB-, GLTF-, OBJ-, STL-, FBX- oder PLY-Dateien.",
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
  },
};

const AR: ViewerCopy = {
  ...EN,
  localeLabel: "اللغة",
  localeNames: { en: "الإنجليزية", fr: "الفرنسية", de: "الألمانية", ar: "العربية" },
  themeLabel: "السمة",
  themeNames: { dark: "داكن", light: "فاتح", aurora: "أورورا" },
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
    subtitle: "حمّل ملفات IFC وRVT وGLB وGLTF وOBJ وSTL وFBX وPLY.",
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
  },
};

export function getViewerCopy(locale: ViewerLocale) {
  switch (locale) {
    case "fr":
      return FR;
    case "de":
      return DE;
    case "ar":
      return AR;
    default:
      return EN;
  }
}
