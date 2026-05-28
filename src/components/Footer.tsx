import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="font-display text-sm font-bold text-foreground">
            firmascope
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://www.spindorai.com/seo/istanbul-seo"
              target="_blank"
              rel="noreferrer"
              className="font-display text-sm font-bold text-foreground transition-colors hover:text-foreground/80"
            >
              İstanbul Seo Ajansı
            </a>
            <Link to="/yasal" className="font-display text-sm font-bold text-foreground hover:text-foreground/80 transition-colors">
              yasal bilgiler
            </Link>
          </div>
        </div>
        <div className="mt-4 border-t border-border pt-4 text-center">
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} firmascope. tüm hakları saklıdır.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
