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
