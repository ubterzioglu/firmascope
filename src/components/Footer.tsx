import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-6">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="font-display text-sm font-bold text-foreground">
          firmascope
        </Link>
        <Link to="/yasal" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Yasal Bilgiler
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
