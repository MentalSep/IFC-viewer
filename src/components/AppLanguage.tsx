import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  APP_LOCALES,
  getAppCopy,
  type AppCopy,
  type AppLocale,
} from "../utils/appI18n";

const STORAGE_KEY = "ifc_app_locale";

interface AppLanguageContextValue {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  cycleLocale: () => void;
  copy: AppCopy;
}

const AppLanguageContext = createContext<AppLanguageContextValue | null>(null);

function detectInitialLocale(): AppLocale {
  const stored = localStorage.getItem(STORAGE_KEY);
   if (stored === "en" || stored === "fr" || stored === "de" || stored === "es" || stored === "it" || stored === "ar") {
    return stored;
  }

  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith("fr")) return "fr";
  if (browserLang.startsWith("de")) return "de";
  if (browserLang.startsWith("es")) return "es";
  if (browserLang.startsWith("it")) return "it";
  if (browserLang.startsWith("ar")) return "ar";
  return "en";
}

export function AppLanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<AppLocale>(() => detectInitialLocale());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const cycleLocale = () => {
    setLocale((current) => {
      const index = APP_LOCALES.indexOf(current);
      return APP_LOCALES[(index + 1) % APP_LOCALES.length];
    });
  };

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      cycleLocale,
      copy: getAppCopy(locale),
    }),
    [locale],
  );

  return <AppLanguageContext.Provider value={value}>{children}</AppLanguageContext.Provider>;
}

export function useAppLanguage() {
  const ctx = useContext(AppLanguageContext);
  if (!ctx) {
    throw new Error("useAppLanguage must be used within AppLanguageProvider");
  }
  return ctx;
}
