import { useAppLanguage } from "./AppLanguage";
import "../styles/components/footer.css";

export function AppFooter() {
  const { copy } = useAppLanguage();
  return (
    <footer className="app-footer">
      <span>{copy.footer.product}</span>
      <span>{copy.footer.rights}</span>
    </footer>
  );
}

