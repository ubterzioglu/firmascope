import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-display text-sm font-bold text-foreground">
            firmascope
          </Link>
          <Link to="/yasal" className="font-display text-sm font-bold text-foreground hover:text-foreground/80 transition-colors">
            yasal bilgiler
          </Link>
        </div>
        <div className="mt-4 border-t border-border pt-4 text-center">
          <span className="font-display text-sm font-bold text-foreground">
            © {new Date().getFullYear()} firmascope. tüm hakları saklıdır.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
