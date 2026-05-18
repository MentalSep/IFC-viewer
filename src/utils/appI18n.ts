export type AppLocale = "en" | "fr" | "de" | "ar";

export const APP_LOCALES: AppLocale[] = ["en", "fr", "de", "ar"];

export interface AppCopy {
  localeLabel: string;
  localeNames: Record<AppLocale, string>;
  app: {
    restoringSession: string;
  };
  navbar: {
    homeTagline: string;
    workspaceTagline: string;
    home: string;
    dashboard: string;
    workspaceDashboard: string;
    signIn: string;
    getStarted: string;
    register: string;
    logout: string;
    switchLanguage: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    openWorkspace: string;
    createWorkspace: string;
    switchAccount: string;
    signIn: string;
    inviteLabel: string;
    inviteTitle: string;
    sessionCode: string;
    sessionCodePlaceholder: string;
    normalizeCode: string;
    copyInvite: string;
    whatsapp: string;
    roleLabel: string;
    inviteCopied: string;
    inviteCopyFailed: string;
    inviteLink: string;
    sharedSession: string;
    whatsappShare: string;
    review3d: string;
    inviteMessageWithCode: string;
    inviteMessageWithoutCode: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    resumeLastSession: string;
    newProject: string;
    searchPlaceholder: string;
    searchLabel: string;
    joinTitle: string;
    joinSubtitle: string;
    joinPlaceholder: string;
    roleLabel: string;
    joining: string;
    joinSession: string;
    createTitle: string;
    projectName: string;
    projectNamePlaceholder: string;
    projectDesc: string;
    projectDescPlaceholder: string;
    creating: string;
    createProject: string;
    cancel: string;
    loadingProjects: string;
    noProjects: string;
    noProjectsSubtitle: string;
    createFirstProject: string;
    noMatches: string;
    noMatchesSubtitle: string;
    noDescription: string;
    openProject: string;
    sessionPrefix: string;
    yourRolePrefix: string;
    sessionNotGenerated: string;
    inviteRoleLabel: string;
    whatsappInvite: string;
    whatsappInviteText: string;
    deleteSession: string;
    deleteConfirm: string;
    deleteFailed: string;
    documentsOne: string;
    documentsMany: string;
    collaboratorOne: string;
    collaboratorMany: string;
    requiredProjectName: string;
    requiredSessionCode: string;
    joinFailed: string;
    errorPrefix: string;
  };
  auth: {
    loginSubtitle: string;
    registerSubtitle: string;
    fullName: string;
    fullNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    signIn: string;
    signingIn: string;
    createAccount: string;
    creatingAccount: string;
    newToPlatform: string;
    createAccountLink: string;
    alreadyHaveAccount: string;
    signInHere: string;
    backHome: string;
    passwordsMismatch: string;
    passwordTooShort: string;
    errorPrefix: string;
  };
  chat: {
    title: string;
    projectChannel: string;
    yourName: string;
    yourRole: string;
    namePlaceholder: string;
    join: string;
    noMessages: string;
    messageAs: string;
  };
  comments: {
    title: string;
    tabElement: string;
    tabAll: string;
    selectElementPrompt: string;
    noCommentsOnElement: string;
    info: string;
    warning: string;
    critical: string;
    commentAs: string;
  };
  properties: {
    close: string;
    expressId: string;
    noProperties: string;
    dimensions: string;
    center: string;
    triangles: string;
    propertiesCount: string;
    search: string;
    copyJson: string;
  };
  shortcuts: {
    title: string;
    closeHint: string;
  };
  viewcube: {
    label: string;
    top: string;
    front: string;
    right: string;
    back: string;
    left: string;
    bottom: string;
    iso: string;
  };
  footer: {
    product: string;
    rights: string;
  };
}

const EN: AppCopy = {
  localeLabel: "Language",
  localeNames: { en: "English", fr: "French", de: "German", ar: "Arabic" },
  app: { restoringSession: "Restoring your session..." },
  navbar: {
    homeTagline: "Common Data Environment ISO 19650",
    workspaceTagline: "Project collaboration workspace",
    home: "Home",
    dashboard: "Dashboard",
    workspaceDashboard: "Workspace dashboard",
    signIn: "Sign In",
    getStarted: "Get Started",
    register: "Register",
    logout: "Logout",
    switchLanguage: "Switch language",
  },
  home: {
    heroTitle: "Sessions, invites, and 3D collaboration.",
    heroSubtitle:
      "Generate a session code, copy the invite, or share it instantly on WhatsApp.",
    openWorkspace: "Open workspace",
    createWorkspace: "Create workspace",
    switchAccount: "Switch account",
    signIn: "Sign in",
    inviteLabel: "Invite people into a session",
    inviteTitle: "Share a code or send the invite by WhatsApp.",
    sessionCode: "Session code",
    sessionCodePlaceholder: "e.g. K3P8N6Q2",
    normalizeCode: "Normalize code",
    copyInvite: "Copy invite",
    whatsapp: "WhatsApp",
    roleLabel: "Invite role",
    inviteCopied: "Invite copied.",
    inviteCopyFailed: "Copy failed.",
    inviteLink: "Invite link",
    sharedSession: "Shared session",
    whatsappShare: "WhatsApp share",
    review3d: "3D review",
    inviteMessageWithCode:
      "CoBIM Cloud — session {{code}}\nOpen: {{url}}\nEnter the session code to join.",
    inviteMessageWithoutCode:
      "CoBIM Cloud — open the dashboard to join a session: {{url}}",
  },
  dashboard: {
    title: "Your Projects",
    subtitle: "Manage and open your BIM projects",
    resumeLastSession: "Resume Last Session",
    newProject: "New Project",
    searchPlaceholder: "Search projects by name or description...",
    searchLabel: "Search projects",
    joinTitle: "Join Collaboration Session",
    joinSubtitle: "Enter a project session code to join a shared group workspace.",
    joinPlaceholder: "e.g. K3P8N6Q2",
    roleLabel: "Role",
    joining: "Joining...",
    joinSession: "Join Session",
    createTitle: "Create New Project",
    projectName: "Project Name",
    projectNamePlaceholder: "e.g., Downtown Office Building",
    projectDesc: "Description (optional)",
    projectDescPlaceholder: "Project details, location, etc.",
    creating: "Creating...",
    createProject: "Create Project",
    cancel: "Cancel",
    loadingProjects: "Loading your projects...",
    noProjects: "No projects yet",
    noProjectsSubtitle: "Create your first project to get started with CoBIM Cloud",
    createFirstProject: "Create First Project",
    noMatches: "No matching projects",
    noMatchesSubtitle: "Try a different search term.",
    noDescription: "No description",
    openProject: "Open Project",
    sessionPrefix: "Session",
    yourRolePrefix: "Your role",
    sessionNotGenerated: "Not generated yet",
    inviteRoleLabel: "Invite role",
    whatsappInvite: "WhatsApp invite",
    whatsappInviteText: "Join this CoBIM Cloud session",
    deleteSession: "Delete Session",
    deleteConfirm: "Delete this session? This cannot be undone.",
    deleteFailed: "Unable to delete session",
    documentsOne: "document",
    documentsMany: "documents",
    collaboratorOne: "collaborator",
    collaboratorMany: "collaborators",
    requiredProjectName: "Project name is required",
    requiredSessionCode: "Session code is required",
    joinFailed: "Unable to join session",
    errorPrefix: "Error",
  },
  auth: {
    loginSubtitle: "Enter your workspace and keep building",
    registerSubtitle: "Launch your BIM collaboration space",
    fullName: "Full Name",
    fullNamePlaceholder: "John Doe",
    email: "Email Address",
    emailPlaceholder: "you@example.com",
    password: "Password",
    passwordPlaceholder: "At least 6 characters",
    confirmPassword: "Confirm Password",
    confirmPasswordPlaceholder: "Repeat your password",
    signIn: "Sign In",
    signingIn: "Signing in...",
    createAccount: "Create Account",
    creatingAccount: "Creating account...",
    newToPlatform: "New to CoBIM Cloud?",
    createAccountLink: "Create an account",
    alreadyHaveAccount: "Already have an account?",
    signInHere: "Sign in here",
    backHome: "Back to home",
    passwordsMismatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 6 characters long",
    errorPrefix: "Error",
  },
  chat: {
    title: "Team Chat",
    projectChannel: "Project channel",
    yourName: "Your name",
    yourRole: "Your role",
    namePlaceholder: "Enter your name...",
    join: "Join Chat",
    noMessages: "No messages yet. Discuss",
    messageAs: "Message as",
  },
  comments: {
    title: "Comments",
    tabElement: "Element",
    tabAll: "All",
    selectElementPrompt: "Select an element to view or add comments.",
    noCommentsOnElement: "No comments yet on this element.",
    info: "Info",
    warning: "Warning",
    critical: "Critical",
    commentAs: "Comment as",
  },
  properties: {
    close: "Close",
    expressId: "Express ID",
    noProperties: "No properties available",
    dimensions: "Dimensions",
    center: "Center",
    triangles: "Triangles",
    propertiesCount: "Properties",
    search: "Search properties...",
    copyJson: "Copy JSON",
  },
  shortcuts: {
    title: "Keyboard Shortcuts",
    closeHint: "Press ? to toggle this panel | Esc to close",
  },
  viewcube: {
    label: "Views",
    top: "Top",
    front: "Front",
    right: "Right",
    back: "Back",
    left: "Left",
    bottom: "Bottom",
    iso: "Isometric",
  },
  footer: {
    product: "CoBIM Cloud · BIM Collaboration",
    rights: "All rights reserved.",
  },
};

const FR: AppCopy = {
  ...EN,
  localeLabel: "Langue",
  localeNames: { en: "Anglais", fr: "Français", de: "Allemand", ar: "Arabe" },
  app: { restoringSession: "Restauration de votre session..." },
  navbar: {
    ...EN.navbar,
    homeTagline: "Environnement de Données Commun ISO 19650",
    workspaceTagline: "Espace de collaboration projet",
    home: "Accueil",
    dashboard: "Tableau de bord",
    workspaceDashboard: "Tableau de bord",
    signIn: "Connexion",
    getStarted: "Commencer",
    register: "Inscription",
    logout: "Déconnexion",
    switchLanguage: "Changer de langue",
  },
  home: {
    ...EN.home,
    heroTitle: "Sessions, invitations et collaboration 3D.",
    heroSubtitle:
      "Générez un code de session, copiez l’invitation ou partagez-la sur WhatsApp.",
    openWorkspace: "Ouvrir l’espace",
    createWorkspace: "Créer un espace",
    switchAccount: "Changer de compte",
    signIn: "Se connecter",
    inviteLabel: "Inviter des personnes dans une session",
    inviteTitle: "Partagez un code ou envoyez l’invitation par WhatsApp.",
    sessionCode: "Code de session",
    normalizeCode: "Normaliser le code",
    copyInvite: "Copier l’invitation",
    inviteCopied: "Invitation copiée.",
    inviteCopyFailed: "Échec de la copie.",
    inviteLink: "Lien d’invitation",
    sharedSession: "Session partagée",
    whatsappShare: "Partage WhatsApp",
    review3d: "Revue 3D",
    inviteMessageWithCode:
      "CoBIM Cloud — session {{code}}\nOuvrir: {{url}}\nEntrez le code de session pour rejoindre.",
    inviteMessageWithoutCode:
      "CoBIM Cloud — ouvrez le tableau de bord pour rejoindre une session: {{url}}",
  },
  dashboard: {
    ...EN.dashboard,
    title: "Vos projets",
    subtitle: "Gérez et ouvrez vos projets BIM",
    resumeLastSession: "Reprendre la dernière session",
    newProject: "Nouveau projet",
    searchPlaceholder: "Rechercher un projet par nom ou description...",
    searchLabel: "Rechercher des projets",
    joinTitle: "Rejoindre une session de collaboration",
    joinSubtitle:
      "Entrez un code de session projet pour rejoindre un espace collaboratif.",
    joining: "Connexion...",
    joinSession: "Rejoindre",
    createTitle: "Créer un nouveau projet",
    projectName: "Nom du projet",
    projectDesc: "Description (optionnelle)",
    projectDescPlaceholder: "Détails du projet, lieu, etc.",
    creating: "Création...",
    createProject: "Créer le projet",
    cancel: "Annuler",
    loadingProjects: "Chargement de vos projets...",
    noProjects: "Aucun projet pour le moment",
    noProjectsSubtitle: "Créez votre premier projet pour commencer avec CoBIM Cloud",
    createFirstProject: "Créer le premier projet",
    noMatches: "Aucun projet correspondant",
    noMatchesSubtitle: "Essayez un autre terme de recherche.",
    noDescription: "Aucune description",
    openProject: "Ouvrir le projet",
    sessionPrefix: "Session",
    sessionNotGenerated: "Pas encore généré",
    documentsOne: "document",
    documentsMany: "documents",
    collaboratorOne: "collaborateur",
    collaboratorMany: "collaborateurs",
    requiredProjectName: "Le nom du projet est requis",
    requiredSessionCode: "Le code de session est requis",
    joinFailed: "Impossible de rejoindre la session",
    errorPrefix: "Erreur",
  },
  auth: {
    ...EN.auth,
    loginSubtitle: "Entrez dans votre espace et continuez à construire",
    registerSubtitle: "Lancez votre espace de collaboration BIM",
    fullName: "Nom complet",
    email: "Adresse e-mail",
    password: "Mot de passe",
    passwordPlaceholder: "Au moins 6 caractères",
    confirmPassword: "Confirmer le mot de passe",
    confirmPasswordPlaceholder: "Répétez votre mot de passe",
    signIn: "Connexion",
    signingIn: "Connexion...",
    createAccount: "Créer un compte",
    creatingAccount: "Création du compte...",
    newToPlatform: "Nouveau sur CoBIM Cloud ?",
    createAccountLink: "Créer un compte",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    signInHere: "Connectez-vous ici",
    backHome: "Retour à l’accueil",
    passwordsMismatch: "Les mots de passe ne correspondent pas",
    passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères",
    errorPrefix: "Erreur",
  },
  chat: {
    ...EN.chat,
    title: "Chat d’équipe",
    projectChannel: "Canal projet",
    yourName: "Votre nom",
    yourRole: "Votre rôle",
    namePlaceholder: "Entrez votre nom...",
    join: "Rejoindre le chat",
    noMessages: "Aucun message. Discutez de",
    messageAs: "Message en tant que",
  },
  comments: {
    ...EN.comments,
    title: "Commentaires",
    tabElement: "Élément",
    tabAll: "Tous",
    selectElementPrompt: "Sélectionnez un élément pour voir ou ajouter des commentaires.",
    noCommentsOnElement: "Aucun commentaire sur cet élément.",
    info: "Info",
    warning: "Avertissement",
    critical: "Critique",
    commentAs: "Commenter en tant que",
  },
  properties: {
    close: "Fermer",
    expressId: "ID Express",
    noProperties: "Aucune propriété disponible",
    dimensions: "Dimensions",
    center: "Centre",
    triangles: "Triangles",
    propertiesCount: "Propriétés",
    search: "Rechercher des propriétés...",
    copyJson: "Copier JSON",
  },
  shortcuts: {
    title: "Raccourcis clavier",
    closeHint: "Appuyez sur ? pour basculer ce panneau | Esc pour fermer",
  },
  viewcube: {
    label: "Vues",
    top: "Haut",
    front: "Avant",
    right: "Droite",
    back: "Arrière",
    left: "Gauche",
    bottom: "Bas",
    iso: "Isométrique",
  },
};

const DE: AppCopy = {
  ...EN,
  localeLabel: "Sprache",
  localeNames: { en: "Englisch", fr: "Französisch", de: "Deutsch", ar: "Arabisch" },
  app: { restoringSession: "Sitzung wird wiederhergestellt..." },
  navbar: {
    ...EN.navbar,
    homeTagline: "Common Data Environment ISO 19650",
    workspaceTagline: "Projekt-Kollaborationsbereich",
    home: "Startseite",
    dashboard: "Dashboard",
    workspaceDashboard: "Arbeitsbereich",
    signIn: "Anmelden",
    getStarted: "Loslegen",
    register: "Registrieren",
    logout: "Abmelden",
    switchLanguage: "Sprache wechseln",
  },
  home: {
    ...EN.home,
    heroTitle: "Sitzungen, Einladungen und 3D-Kollaboration.",
    heroSubtitle:
      "Erstelle einen Sitzungscode, kopiere die Einladung oder teile sie per WhatsApp.",
    openWorkspace: "Arbeitsbereich öffnen",
    createWorkspace: "Arbeitsbereich erstellen",
    switchAccount: "Konto wechseln",
    signIn: "Anmelden",
    inviteLabel: "Personen zu einer Sitzung einladen",
    inviteTitle: "Code teilen oder Einladung per WhatsApp senden.",
    sessionCode: "Sitzungscode",
    normalizeCode: "Code normalisieren",
    copyInvite: "Einladung kopieren",
    inviteCopied: "Einladung kopiert.",
    inviteCopyFailed: "Kopieren fehlgeschlagen.",
    inviteLink: "Einladungslink",
    sharedSession: "Geteilte Sitzung",
    whatsappShare: "WhatsApp teilen",
    review3d: "3D-Prüfung",
    inviteMessageWithCode:
      "CoBIM Cloud — Sitzung {{code}}\nÖffnen: {{url}}\nGib den Sitzungscode zum Beitreten ein.",
    inviteMessageWithoutCode:
      "CoBIM Cloud — öffne das Dashboard, um einer Sitzung beizutreten: {{url}}",
  },
  dashboard: {
    ...EN.dashboard,
    title: "Deine Projekte",
    subtitle: "Verwalte und öffne deine BIM-Projekte",
    resumeLastSession: "Letzte Sitzung fortsetzen",
    newProject: "Neues Projekt",
    searchPlaceholder: "Projekte nach Name oder Beschreibung suchen...",
    searchLabel: "Projekte suchen",
    joinTitle: "Kollaborationssitzung beitreten",
    joinSubtitle:
      "Gib einen Projekt-Sitzungscode ein, um einem gemeinsamen Arbeitsbereich beizutreten.",
    joining: "Beitreten...",
    joinSession: "Beitreten",
    createTitle: "Neues Projekt erstellen",
    projectName: "Projektname",
    projectDesc: "Beschreibung (optional)",
    projectDescPlaceholder: "Projektdetails, Standort usw.",
    creating: "Wird erstellt...",
    createProject: "Projekt erstellen",
    cancel: "Abbrechen",
    loadingProjects: "Deine Projekte werden geladen...",
    noProjects: "Noch keine Projekte",
    noProjectsSubtitle:
      "Erstelle dein erstes Projekt, um mit CoBIM Cloud zu starten",
    createFirstProject: "Erstes Projekt erstellen",
    noMatches: "Keine passenden Projekte",
    noMatchesSubtitle: "Versuche einen anderen Suchbegriff.",
    noDescription: "Keine Beschreibung",
    openProject: "Projekt öffnen",
    sessionPrefix: "Sitzung",
    sessionNotGenerated: "Noch nicht generiert",
    documentsOne: "Dokument",
    documentsMany: "Dokumente",
    collaboratorOne: "Mitarbeiter",
    collaboratorMany: "Mitarbeiter",
    requiredProjectName: "Projektname ist erforderlich",
    requiredSessionCode: "Sitzungscode ist erforderlich",
    joinFailed: "Sitzung konnte nicht beigetreten werden",
    errorPrefix: "Fehler",
  },
  auth: {
    ...EN.auth,
    loginSubtitle: "Öffne deinen Arbeitsbereich und arbeite weiter",
    registerSubtitle: "Starte deinen BIM-Kollaborationsbereich",
    fullName: "Vollständiger Name",
    email: "E-Mail-Adresse",
    password: "Passwort",
    passwordPlaceholder: "Mindestens 6 Zeichen",
    confirmPassword: "Passwort bestätigen",
    confirmPasswordPlaceholder: "Passwort wiederholen",
    signIn: "Anmelden",
    signingIn: "Anmeldung läuft...",
    createAccount: "Konto erstellen",
    creatingAccount: "Konto wird erstellt...",
    newToPlatform: "Neu bei CoBIM Cloud?",
    createAccountLink: "Konto erstellen",
    alreadyHaveAccount: "Du hast bereits ein Konto?",
    signInHere: "Hier anmelden",
    backHome: "Zurück zur Startseite",
    passwordsMismatch: "Passwörter stimmen nicht überein",
    passwordTooShort: "Passwort muss mindestens 6 Zeichen lang sein",
    errorPrefix: "Fehler",
  },
  chat: {
    ...EN.chat,
    title: "Team-Chat",
    projectChannel: "Projektkanal",
    yourName: "Dein Name",
    yourRole: "Deine Rolle",
    namePlaceholder: "Gib deinen Namen ein...",
    join: "Chat beitreten",
    noMessages: "Noch keine Nachrichten. Besprecht",
    messageAs: "Nachricht als",
  },
  comments: {
    ...EN.comments,
    title: "Kommentare",
    tabElement: "Element",
    tabAll: "Alle",
    selectElementPrompt: "Wähle ein Element, um Kommentare anzuzeigen oder hinzuzufügen.",
    noCommentsOnElement: "Noch keine Kommentare zu diesem Element.",
    info: "Info",
    warning: "Warnung",
    critical: "Kritisch",
    commentAs: "Kommentieren als",
  },
  properties: {
    close: "Schließen",
    expressId: "Express-ID",
    noProperties: "Keine Eigenschaften verfügbar",
    dimensions: "Abmessungen",
    center: "Zentrum",
    triangles: "Dreiecke",
    propertiesCount: "Eigenschaften",
    search: "Eigenschaften suchen...",
    copyJson: "JSON kopieren",
  },
  shortcuts: {
    title: "Tastenkürzel",
    closeHint: "Drücke ? zum Umschalten | Esc zum Schließen",
  },
  viewcube: {
    label: "Ansichten",
    top: "Oben",
    front: "Vorne",
    right: "Rechts",
    back: "Hinten",
    left: "Links",
    bottom: "Unten",
    iso: "Isometrisch",
  },
};

const AR: AppCopy = {
  ...EN,
  localeLabel: "اللغة",
  localeNames: { en: "الإنجليزية", fr: "الفرنسية", de: "الألمانية", ar: "العربية" },
  app: { restoringSession: "جارٍ استعادة جلستك..." },
  navbar: {
    ...EN.navbar,
    homeTagline: "بيئة بيانات مشتركة ISO 19650",
    workspaceTagline: "مساحة تعاون المشروع",
    home: "الرئيسية",
    dashboard: "لوحة التحكم",
    workspaceDashboard: "لوحة مساحة العمل",
    signIn: "تسجيل الدخول",
    getStarted: "ابدأ الآن",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    switchLanguage: "تغيير اللغة",
  },
  home: {
    ...EN.home,
    heroTitle: "جلسات ودعوات وتعاون ثلاثي الأبعاد.",
    heroSubtitle: "أنشئ رمز جلسة، انسخ الدعوة، أو شاركها مباشرة عبر واتساب.",
    openWorkspace: "فتح مساحة العمل",
    createWorkspace: "إنشاء مساحة عمل",
    switchAccount: "تبديل الحساب",
    signIn: "تسجيل الدخول",
    inviteLabel: "دعوة أشخاص إلى جلسة",
    inviteTitle: "شارك الرمز أو أرسل الدعوة عبر واتساب.",
    sessionCode: "رمز الجلسة",
    normalizeCode: "توحيد الرمز",
    copyInvite: "نسخ الدعوة",
    inviteCopied: "تم نسخ الدعوة.",
    inviteCopyFailed: "فشل النسخ.",
    inviteLink: "رابط الدعوة",
    sharedSession: "جلسة مشتركة",
    whatsappShare: "مشاركة واتساب",
    review3d: "مراجعة 3D",
    inviteMessageWithCode:
      "CoBIM Cloud — الجلسة {{code}}\nافتح: {{url}}\nأدخل رمز الجلسة للانضمام.",
    inviteMessageWithoutCode:
      "CoBIM Cloud — افتح لوحة التحكم للانضمام إلى جلسة: {{url}}",
  },
  dashboard: {
    ...EN.dashboard,
    title: "مشاريعك",
    subtitle: "إدارة وفتح مشاريع BIM الخاصة بك",
    resumeLastSession: "استئناف آخر جلسة",
    newProject: "مشروع جديد",
    searchPlaceholder: "ابحث عن المشاريع بالاسم أو الوصف...",
    searchLabel: "بحث المشاريع",
    joinTitle: "الانضمام إلى جلسة تعاون",
    joinSubtitle: "أدخل رمز جلسة المشروع للانضمام إلى مساحة عمل مشتركة.",
    joining: "جارٍ الانضمام...",
    joinSession: "انضمام",
    createTitle: "إنشاء مشروع جديد",
    projectName: "اسم المشروع",
    projectDesc: "الوصف (اختياري)",
    projectDescPlaceholder: "تفاصيل المشروع، الموقع، إلخ.",
    creating: "جارٍ الإنشاء...",
    createProject: "إنشاء المشروع",
    cancel: "إلغاء",
    loadingProjects: "جارٍ تحميل مشاريعك...",
    noProjects: "لا توجد مشاريع بعد",
    noProjectsSubtitle: "أنشئ مشروعك الأول للبدء باستخدام CoBIM Cloud",
    createFirstProject: "إنشاء أول مشروع",
    noMatches: "لا توجد مشاريع مطابقة",
    noMatchesSubtitle: "جرّب عبارة بحث مختلفة.",
    noDescription: "لا يوجد وصف",
    openProject: "فتح المشروع",
    sessionPrefix: "الجلسة",
    sessionNotGenerated: "لم يتم إنشاؤه بعد",
    documentsOne: "مستند",
    documentsMany: "مستندات",
    collaboratorOne: "متعاون",
    collaboratorMany: "متعاونون",
    requiredProjectName: "اسم المشروع مطلوب",
    requiredSessionCode: "رمز الجلسة مطلوب",
    joinFailed: "تعذر الانضمام إلى الجلسة",
    errorPrefix: "خطأ",
  },
  auth: {
    ...EN.auth,
    loginSubtitle: "ادخل مساحة العمل وواصل البناء",
    registerSubtitle: "أطلق مساحة تعاون BIM الخاصة بك",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    passwordPlaceholder: "6 أحرف على الأقل",
    confirmPassword: "تأكيد كلمة المرور",
    confirmPasswordPlaceholder: "أعد كتابة كلمة المرور",
    signIn: "تسجيل الدخول",
    signingIn: "جارٍ تسجيل الدخول...",
    createAccount: "إنشاء حساب",
    creatingAccount: "جارٍ إنشاء الحساب...",
    newToPlatform: "جديد على CoBIM Cloud؟",
    createAccountLink: "إنشاء حساب",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    signInHere: "سجّل الدخول هنا",
    backHome: "العودة للرئيسية",
    passwordsMismatch: "كلمتا المرور غير متطابقتين",
    passwordTooShort: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
    errorPrefix: "خطأ",
  },
  chat: {
    ...EN.chat,
    title: "دردشة الفريق",
    projectChannel: "قناة المشروع",
    yourName: "اسمك",
    yourRole: "دورك",
    namePlaceholder: "أدخل اسمك...",
    join: "انضم إلى الدردشة",
    noMessages: "لا توجد رسائل بعد. ناقش",
    messageAs: "رسالة بصفتك",
  },
  comments: {
    ...EN.comments,
    title: "التعليقات",
    tabElement: "العنصر",
    tabAll: "الكل",
    selectElementPrompt: "اختر عنصرًا لعرض أو إضافة التعليقات.",
    noCommentsOnElement: "لا توجد تعليقات على هذا العنصر بعد.",
    info: "معلومة",
    warning: "تحذير",
    critical: "حرج",
    commentAs: "التعليق بصفتك",
  },
  properties: {
    close: "إغلاق",
    expressId: "معرّف Express",
    noProperties: "لا توجد خصائص متاحة",
    dimensions: "الأبعاد",
    center: "المركز",
    triangles: "المثلثات",
    propertiesCount: "الخصائص",
    search: "ابحث في الخصائص...",
    copyJson: "نسخ JSON",
  },
  shortcuts: {
    title: "اختصارات لوحة المفاتيح",
    closeHint: "اضغط ? للتبديل | Esc للإغلاق",
  },
  viewcube: {
    label: "المناظير",
    top: "أعلى",
    front: "أمام",
    right: "يمين",
    back: "خلف",
    left: "يسار",
    bottom: "أسفل",
    iso: "منظور متساوي القياس",
  },
};

export function getAppCopy(locale: AppLocale): AppCopy {
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
