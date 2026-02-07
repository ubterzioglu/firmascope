import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-display text-sm font-bold text-foreground">
            firmascope
          </Link>
          <Link to="/yasal" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Yasal Bilgiler
          </Link>
        </div>
        <div className="mt-4 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} firmascope. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
