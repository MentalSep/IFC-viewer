export type AppLocale = "en" | "fr" | "de" | "es" | "it" | "ar";

export const APP_LOCALES: AppLocale[] = ["en", "fr", "de", "es", "it", "ar"];

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
    fitCamera: string;
    toggleGrid: string;
    toggleWireframe: string;
    toggleTransparency: string;
    toggleMeasure: string;
    clearMeasurements: string;
    screenshot: string;
    deselectElement: string;
    showShortcuts: string;
    focusSearch: string;
    zoomIn: string;
    zoomOut: string;
    viewAngles: string;
    isometricView: string;
    cycleThemes: string;
  };
  workspace: {
    floorGroundFloor: string;
    floorLevel1: string;
    floorLevel2: string;
    floorRoof: string;
    phaseMobilization: string;
    phaseStructure: string;
    phaseEnvelope: string;
    phaseMep: string;
    phaseCloseout: string;
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
  localeNames: { en: "English", fr: "French", de: "German", es: "Spanish", it: "Italian", ar: "Arabic" },
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
    fitCamera: "Fit camera to model",
    toggleGrid: "Toggle grid",
    toggleWireframe: "Toggle wireframe",
    toggleTransparency: "Toggle transparency (X-ray)",
    toggleMeasure: "Toggle measurement tool",
    clearMeasurements: "Clear measurements",
    screenshot: "Take screenshot",
    deselectElement: "Deselect element",
    showShortcuts: "Show shortcuts",
    focusSearch: "Focus search",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    viewAngles: "View angles (Top/Front/Right/Back/Left/Bottom)",
    isometricView: "Isometric view",
    cycleThemes: "Cycle themes",
  },
  workspace: {
    floorGroundFloor: "Ground Floor",
    floorLevel1: "Level 1",
    floorLevel2: "Level 2",
    floorRoof: "Roof",
    phaseMobilization: "Mobilization",
    phaseStructure: "Structure",
    phaseEnvelope: "Envelope",
    phaseMep: "MEP",
    phaseCloseout: "Closeout",
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
  localeNames: { en: "Anglais", fr: "Français", de: "Allemand", es: "Espagnol", it: "Italien", ar: "Arabe" },
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
    fitCamera: "Adapter la caméra au modèle",
    toggleGrid: "Activer/Désactiver la grille",
    toggleWireframe: "Activer/Désactiver le fil de fer",
    toggleTransparency: "Activer/Désactiver la transparence (rayons X)",
    toggleMeasure: "Activer/Désactiver l'outil de mesure",
    clearMeasurements: "Effacer les mesures",
    screenshot: "Prendre une capture d'écran",
    deselectElement: "Désélectionner l'élément",
    showShortcuts: "Afficher les raccourcis",
    focusSearch: "Centrer la recherche",
    zoomIn: "Zoom avant",
    zoomOut: "Zoom arrière",
    viewAngles: "Angles de vue (Haut/Avant/Droite/Arrière/Gauche/Bas)",
    isometricView: "Vue isométrique",
    cycleThemes: "Changer les thèmes",
  },
  workspace: {
    floorGroundFloor: "Rez-de-chaussée",
    floorLevel1: "Niveau 1",
    floorLevel2: "Niveau 2",
    floorRoof: "Toit",
    phaseMobilization: "Mobilisation",
    phaseStructure: "Structure",
    phaseEnvelope: "Enveloppe",
    phaseMep: "MEP",
    phaseCloseout: "Clôture",
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
  localeNames: { en: "Englisch", fr: "Französisch", de: "Deutsch", es: "Spanisch", it: "Italienisch", ar: "Arabisch" },
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
    fitCamera: "Kamera an Modell anpassen",
    toggleGrid: "Gitter umschalten",
    toggleWireframe: "Drahtgitteransicht umschalten",
    toggleTransparency: "Transparenz umschalten (Röntgen)",
    toggleMeasure: "Messwerkzeug umschalten",
    clearMeasurements: "Messungen löschen",
    screenshot: "Screenshot machen",
    deselectElement: "Element abwählen",
    showShortcuts: "Tastenkürzel anzeigen",
    focusSearch: "Suche fokussieren",
    zoomIn: "Vergrößern",
    zoomOut: "Verkleinern",
    viewAngles: "Ansichtswinkel (Oben/Vorne/Rechts/Hinten/Links/Unten)",
    isometricView: "Isometrische Ansicht",
    cycleThemes: "Designs durchlaufen",
  },
  workspace: {
    floorGroundFloor: "Erdgeschoss",
    floorLevel1: "Ebene 1",
    floorLevel2: "Ebene 2",
    floorRoof: "Dach",
    phaseMobilization: "Mobilisierung",
    phaseStructure: "Struktur",
    phaseEnvelope: "Hülle",
    phaseMep: "MEP",
    phaseCloseout: "Abschluss",
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
  localeNames: { en: "الإنجليزية", fr: "الفرنسية", de: "الألمانية", es: "الإسبانية", it: "الإيطالية", ar: "العربية" },
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
    fitCamera: "تناسب الكاميرا مع النموذج",
    toggleGrid: "تبديل الشبكة",
    toggleWireframe: "تبديل وضع السلك",
    toggleTransparency: "تبديل الشفافية (الأشعة السينية)",
    toggleMeasure: "تبديل أداة القياس",
    clearMeasurements: "مسح القياسات",
    screenshot: "التقاط لقطة شاشة",
    deselectElement: "إلغاء تحديد العنصر",
    showShortcuts: "إظهار الاختصارات",
    focusSearch: "التركيز على البحث",
    zoomIn: "تكبير",
    zoomOut: "تصغير",
    viewAngles: "زوايا المنظور (الأعلى/الأمام/اليمين/الخلف/اليسار/الأسفل)",
    isometricView: "منظور متساوي القياس",
    cycleThemes: "دوران المواضيع",
  },
  workspace: {
    floorGroundFloor: "الطابق الأرضي",
    floorLevel1: "المستوى 1",
    floorLevel2: "المستوى 2",
    floorRoof: "السقف",
    phaseMobilization: "الحشد",
    phaseStructure: "الهيكل",
    phaseEnvelope: "الغلاف",
    phaseMep: "MEP",
    phaseCloseout: "الإغلاق",
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

const ES: AppCopy = {
  ...EN,
  localeLabel: "Idioma",
  localeNames: { en: "Inglés", fr: "Francés", de: "Alemán", es: "Español", it: "Italiano", ar: "Árabe" },
  app: { restoringSession: "Restaurando tu sesión..." },
  navbar: {
    ...EN.navbar,
    homeTagline: "Entorno común de datos ISO 19650",
    workspaceTagline: "Espacio de colaboración del proyecto",
    home: "Inicio",
    dashboard: "Panel",
    workspaceDashboard: "Panel del espacio de trabajo",
    signIn: "Iniciar sesión",
    getStarted: "Comenzar",
    register: "Registrarse",
    logout: "Cerrar sesión",
    switchLanguage: "Cambiar idioma",
  },
  home: {
    ...EN.home,
    heroTitle: "Sesiones, invitaciones y colaboración 3D.",
    heroSubtitle:
      "Genera un código de sesión, copia la invitación o compártela al instante por WhatsApp.",
    openWorkspace: "Abrir espacio",
    createWorkspace: "Crear espacio",
    switchAccount: "Cambiar de cuenta",
    signIn: "Iniciar sesión",
    inviteLabel: "Invitar personas a una sesión",
    inviteTitle: "Comparte un código o envía la invitación por WhatsApp.",
    sessionCode: "Código de sesión",
    normalizeCode: "Normalizar código",
    copyInvite: "Copiar invitación",
    whatsapp: "WhatsApp",
    roleLabel: "Rol de invitación",
    inviteCopied: "Invitación copiada.",
    inviteCopyFailed: "Error al copiar.",
    inviteLink: "Enlace de invitación",
    sharedSession: "Sesión compartida",
    whatsappShare: "Compartir por WhatsApp",
    review3d: "Revisión 3D",
    inviteMessageWithCode:
      "CoBIM Cloud — sesión {{code}}\nAbrir: {{url}}\nIntroduce el código de sesión para unirte.",
    inviteMessageWithoutCode:
      "CoBIM Cloud — abre el panel para unirte a una sesión: {{url}}",
  },
  dashboard: {
    ...EN.dashboard,
    title: "Tus proyectos",
    subtitle: "Gestiona y abre tus proyectos BIM",
    resumeLastSession: "Reanudar última sesión",
    newProject: "Nuevo proyecto",
    searchPlaceholder: "Buscar proyectos por nombre o descripción...",
    searchLabel: "Buscar proyectos",
    joinTitle: "Unirse a una sesión de colaboración",
    joinSubtitle:
      "Introduce un código de sesión del proyecto para unirte a un espacio compartido.",
    joinPlaceholder: "p. ej. K3P8N6Q2",
    joining: "Uniéndose...",
    joinSession: "Unirse",
    createTitle: "Crear nuevo proyecto",
    projectName: "Nombre del proyecto",
    projectNamePlaceholder: "p. ej., Edificio de oficinas en el centro",
    projectDesc: "Descripción (opcional)",
    projectDescPlaceholder: "Detalles del proyecto, ubicación, etc.",
    creating: "Creando...",
    createProject: "Crear proyecto",
    cancel: "Cancelar",
    loadingProjects: "Cargando tus proyectos...",
    noProjects: "Todavía no hay proyectos",
    noProjectsSubtitle: "Crea tu primer proyecto para empezar con CoBIM Cloud",
    createFirstProject: "Crear primer proyecto",
    noMatches: "No hay proyectos coincidentes",
    noMatchesSubtitle: "Prueba con otro término de búsqueda.",
    noDescription: "Sin descripción",
    openProject: "Abrir proyecto",
    sessionPrefix: "Sesión",
    yourRolePrefix: "Tu rol",
    sessionNotGenerated: "Aún no generado",
    inviteRoleLabel: "Rol de invitación",
    whatsappInvite: "Invitación por WhatsApp",
    whatsappInviteText: "Únete a esta sesión de CoBIM Cloud",
    deleteSession: "Eliminar sesión",
    deleteConfirm: "¿Eliminar esta sesión? Esto no se puede deshacer.",
    deleteFailed: "No se puede eliminar la sesión",
    documentsOne: "documento",
    documentsMany: "documentos",
    collaboratorOne: "colaborador",
    collaboratorMany: "colaboradores",
    requiredProjectName: "El nombre del proyecto es obligatorio",
    requiredSessionCode: "El código de sesión es obligatorio",
    joinFailed: "No se pudo unir a la sesión",
    errorPrefix: "Error",
  },
  auth: {
    ...EN.auth,
    loginSubtitle: "Entra en tu espacio de trabajo y sigue construyendo",
    registerSubtitle: "Lanza tu espacio de colaboración BIM",
    fullName: "Nombre completo",
    email: "Correo electrónico",
    password: "Contraseña",
    passwordPlaceholder: "Al menos 6 caracteres",
    confirmPassword: "Confirmar contraseña",
    confirmPasswordPlaceholder: "Repite tu contraseña",
    signIn: "Iniciar sesión",
    signingIn: "Iniciando sesión...",
    createAccount: "Crear cuenta",
    creatingAccount: "Creando cuenta...",
    newToPlatform: "¿Nuevo en CoBIM Cloud?",
    createAccountLink: "Crear una cuenta",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    signInHere: "Inicia sesión aquí",
    backHome: "Volver al inicio",
    passwordsMismatch: "Las contraseñas no coinciden",
    passwordTooShort: "La contraseña debe tener al menos 6 caracteres",
    errorPrefix: "Error",
  },
  chat: {
    ...EN.chat,
    title: "Chat del equipo",
    projectChannel: "Canal del proyecto",
    yourName: "Tu nombre",
    yourRole: "Tu rol",
    namePlaceholder: "Escribe tu nombre...",
    join: "Unirse al chat",
    noMessages: "Aún no hay mensajes. Hablen de",
    messageAs: "Mensaje como",
  },
  comments: {
    ...EN.comments,
    title: "Comentarios",
    tabElement: "Elemento",
    tabAll: "Todos",
    selectElementPrompt: "Selecciona un elemento para ver o añadir comentarios.",
    noCommentsOnElement: "Todavía no hay comentarios en este elemento.",
    info: "Info",
    warning: "Aviso",
    critical: "Crítico",
    commentAs: "Comentar como",
  },
  properties: {
    close: "Cerrar",
    expressId: "ID Express",
    noProperties: "No hay propiedades disponibles",
    dimensions: "Dimensiones",
    center: "Centro",
    triangles: "Triángulos",
    propertiesCount: "Propiedades",
    search: "Buscar propiedades...",
    copyJson: "Copiar JSON",
  },
  shortcuts: {
    title: "Atajos de teclado",
    closeHint: "Pulsa ? para alternar | Esc para cerrar",
    fitCamera: "Ajustar cámara al modelo",
    toggleGrid: "Alternar cuadrícula",
    toggleWireframe: "Alternar vista de alambre",
    toggleTransparency: "Alternar transparencia (Rayos X)",
    toggleMeasure: "Alternar herramienta de medición",
    clearMeasurements: "Limpiar mediciones",
    screenshot: "Captura de pantalla",
    deselectElement: "Deseleccionar elemento",
    showShortcuts: "Mostrar atajos",
    focusSearch: "Centrar búsqueda",
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    viewAngles: "Ángulos de vista (Superior/Frontal/Derecha/Posterior/Izquierda/Inferior)",
    isometricView: "Vista isométrica",
    cycleThemes: "Cambiar temas",
  },
  workspace: {
    floorGroundFloor: "Planta Baja",
    floorLevel1: "Nivel 1",
    floorLevel2: "Nivel 2",
    floorRoof: "Techo",
    phaseMobilization: "Movilización",
    phaseStructure: "Estructura",
    phaseEnvelope: "Envolvente",
    phaseMep: "MEP",
    phaseCloseout: "Cierre",
  },
  viewcube: {
    label: "Vistas",
    top: "Arriba",
    front: "Frente",
    right: "Derecha",
    back: "Atrás",
    left: "Izquierda",
    bottom: "Abajo",
    iso: "Isométrica",
  },
};

const IT: AppCopy = {
  ...EN,
  localeLabel: "Lingua",
  localeNames: { en: "Inglese", fr: "Francese", de: "Tedesco", es: "Spagnolo", it: "Italiano", ar: "Arabo" },
  app: { restoringSession: "Ripristino della sessione..." },
  navbar: {
    ...EN.navbar,
    homeTagline: "Common Data Environment ISO 19650",
    workspaceTagline: "Area di collaborazione progetto",
    home: "Home",
    dashboard: "Dashboard",
    workspaceDashboard: "Dashboard area di lavoro",
    signIn: "Accedi",
    getStarted: "Inizia",
    register: "Registrati",
    logout: "Esci",
    switchLanguage: "Cambia lingua",
  },
  home: {
    ...EN.home,
    heroTitle: "Sessioni, inviti e collaborazione 3D.",
    heroSubtitle:
      "Genera un codice sessione, copia l’invito o condividilo subito su WhatsApp.",
    openWorkspace: "Apri area di lavoro",
    createWorkspace: "Crea area di lavoro",
    switchAccount: "Cambia account",
    signIn: "Accedi",
    inviteLabel: "Invita persone a una sessione",
    inviteTitle: "Condividi un codice o invia l’invito via WhatsApp.",
    sessionCode: "Codice sessione",
    normalizeCode: "Normalizza codice",
    copyInvite: "Copia invito",
    whatsapp: "WhatsApp",
    roleLabel: "Ruolo invito",
    inviteCopied: "Invito copiato.",
    inviteCopyFailed: "Copia non riuscita.",
    inviteLink: "Link invito",
    sharedSession: "Sessione condivisa",
    whatsappShare: "Condivisione WhatsApp",
    review3d: "Revisione 3D",
    inviteMessageWithCode:
      "CoBIM Cloud — sessione {{code}}\nApri: {{url}}\nInserisci il codice sessione per unirti.",
    inviteMessageWithoutCode:
      "CoBIM Cloud — apri la dashboard per unirti a una sessione: {{url}}",
  },
  dashboard: {
    ...EN.dashboard,
    title: "I tuoi progetti",
    subtitle: "Gestisci e apri i tuoi progetti BIM",
    resumeLastSession: "Riprendi ultima sessione",
    newProject: "Nuovo progetto",
    searchPlaceholder: "Cerca progetti per nome o descrizione...",
    searchLabel: "Cerca progetti",
    joinTitle: "Unisciti a una sessione di collaborazione",
    joinSubtitle:
      "Inserisci un codice sessione progetto per entrare in uno spazio condiviso.",
    joinPlaceholder: "es. K3P8N6Q2",
    joining: "Ingresso in corso...",
    joinSession: "Unisciti",
    createTitle: "Crea nuovo progetto",
    projectName: "Nome progetto",
    projectNamePlaceholder: "es. edificio uffici in centro",
    projectDesc: "Descrizione (opzionale)",
    projectDescPlaceholder: "Dettagli progetto, posizione, ecc.",
    creating: "Creazione in corso...",
    createProject: "Crea progetto",
    cancel: "Annulla",
    loadingProjects: "Caricamento dei tuoi progetti...",
    noProjects: "Nessun progetto ancora",
    noProjectsSubtitle: "Crea il tuo primo progetto per iniziare con CoBIM Cloud",
    createFirstProject: "Crea il primo progetto",
    noMatches: "Nessun progetto corrispondente",
    noMatchesSubtitle: "Prova un altro termine di ricerca.",
    noDescription: "Nessuna descrizione",
    openProject: "Apri progetto",
    sessionPrefix: "Sessione",
    yourRolePrefix: "Il tuo ruolo",
    sessionNotGenerated: "Non ancora generato",
    inviteRoleLabel: "Ruolo invito",
    whatsappInvite: "Invito WhatsApp",
    whatsappInviteText: "Unisciti a questa sessione CoBIM Cloud",
    deleteSession: "Elimina sessione",
    deleteConfirm: "Eliminare questa sessione? Operazione non reversibile.",
    deleteFailed: "Impossibile eliminare la sessione",
    documentsOne: "documento",
    documentsMany: "documenti",
    collaboratorOne: "collaboratore",
    collaboratorMany: "collaboratori",
    requiredProjectName: "Il nome del progetto è obbligatorio",
    requiredSessionCode: "Il codice sessione è obbligatorio",
    joinFailed: "Impossibile unirsi alla sessione",
    errorPrefix: "Errore",
  },
  auth: {
    ...EN.auth,
    loginSubtitle: "Entra nel tuo spazio di lavoro e continua a costruire",
    registerSubtitle: "Avvia il tuo spazio di collaborazione BIM",
    fullName: "Nome completo",
    email: "Email",
    password: "Password",
    passwordPlaceholder: "Almeno 6 caratteri",
    confirmPassword: "Conferma password",
    confirmPasswordPlaceholder: "Ripeti la password",
    signIn: "Accedi",
    signingIn: "Accesso in corso...",
    createAccount: "Crea account",
    creatingAccount: "Creazione account...",
    newToPlatform: "Nuovo su CoBIM Cloud?",
    createAccountLink: "Crea un account",
    alreadyHaveAccount: "Hai già un account?",
    signInHere: "Accedi qui",
    backHome: "Torna alla home",
    passwordsMismatch: "Le password non corrispondono",
    passwordTooShort: "La password deve contenere almeno 6 caratteri",
    errorPrefix: "Errore",
  },
  chat: {
    ...EN.chat,
    title: "Chat del team",
    projectChannel: "Canale progetto",
    yourName: "Il tuo nome",
    yourRole: "Il tuo ruolo",
    namePlaceholder: "Inserisci il tuo nome...",
    join: "Entra nella chat",
    noMessages: "Nessun messaggio ancora. Parlate di",
    messageAs: "Messaggio come",
  },
  comments: {
    ...EN.comments,
    title: "Commenti",
    tabElement: "Elemento",
    tabAll: "Tutti",
    selectElementPrompt: "Seleziona un elemento per vedere o aggiungere commenti.",
    noCommentsOnElement: "Nessun commento ancora su questo elemento.",
    info: "Info",
    warning: "Avviso",
    critical: "Critico",
    commentAs: "Commenta come",
  },
  properties: {
    close: "Chiudi",
    expressId: "ID Express",
    noProperties: "Nessuna proprietà disponibile",
    dimensions: "Dimensioni",
    center: "Centro",
    triangles: "Triangoli",
    propertiesCount: "Proprietà",
    search: "Cerca proprietà...",
    copyJson: "Copia JSON",
  },
  shortcuts: {
    title: "Scorciatoie da tastiera",
    closeHint: "Premi ? per alternare | Esc per chiudere",
    fitCamera: "Adatta la fotocamera al modello",
    toggleGrid: "Attiva/disattiva griglia",
    toggleWireframe: "Attiva/disattiva modalità filo",
    toggleTransparency: "Attiva/disattiva trasparenza (Raggi X)",
    toggleMeasure: "Attiva/disattiva strumento di misurazione",
    clearMeasurements: "Cancella misurazioni",
    screenshot: "Cattura schermata",
    deselectElement: "Deseleziona elemento",
    showShortcuts: "Mostra scorciatoie",
    focusSearch: "Metti a fuoco la ricerca",
    zoomIn: "Ingrandisci",
    zoomOut: "Riduci",
    viewAngles: "Angoli di visualizzazione (Alto/Fronte/Destra/Dietro/Sinistra/Basso)",
    isometricView: "Vista isometrica",
    cycleThemes: "Ciclo temi",
  },
  workspace: {
    floorGroundFloor: "Piano Terra",
    floorLevel1: "Livello 1",
    floorLevel2: "Livello 2",
    floorRoof: "Tetto",
    phaseMobilization: "Mobilizzazione",
    phaseStructure: "Struttura",
    phaseEnvelope: "Involucro",
    phaseMep: "MEP",
    phaseCloseout: "Chiusura",
  },
  viewcube: {
    label: "Viste",
    top: "Alto",
    front: "Frente",
    right: "Destra",
    back: "Dietro",
    left: "Sinistra",
    bottom: "Basso",
    iso: "Isometrica",
  },
};

export function getAppCopy(locale: AppLocale): AppCopy {
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
