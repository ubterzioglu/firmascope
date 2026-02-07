import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <Shield className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="font-display text-lg font-bold">
                firma<span className="text-accent">scope</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-primary-foreground/60">
              Türkiye'nin en güvenilir anonim şirket değerlendirme platformu.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-primary-foreground/40">
              Platform
            </h4>
            <ul className="space-y-2">
              <li><Link to="/sirketler" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">Şirketler</Link></li>
              <li><Link to="/hakkinda" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">Hakkında</Link></li>
              <li><Link to="/sss" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">SSS</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-primary-foreground/40">
              Yasal
            </h4>
            <ul className="space-y-2">
              <li><Link to="/gizlilik" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">Gizlilik Politikası</Link></li>
              <li><Link to="/kullanim-sartlari" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">Kullanım Şartları</Link></li>
              <li><Link to="/iletisim" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">İletişim</Link></li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-primary-foreground/40">
              Katkıda Bulun
            </h4>
            <p className="text-sm text-primary-foreground/60">
              Deneyimlerini anonim olarak paylaş, diğer çalışanlara yardımcı ol.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/40">
          © {new Date().getFullYear()} Firmascope. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
