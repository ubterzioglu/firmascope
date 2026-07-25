import { Fragment } from "react";
import { Link } from "react-router-dom";
import { FOOTER_PAGES } from "@/lib/footer-pages";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="font-display text-sm font-bold text-foreground">
            firmascope
          </Link>
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            {FOOTER_PAGES.map((page, index) => (
              <Fragment key={page.path}>
                {index > 0 && (
                  <span aria-hidden="true" className="text-border">
                    |
                  </span>
                )}
                <Link
                  to={page.path}
                  className="transition-colors hover:text-foreground"
                >
                  {page.label}
                </Link>
              </Fragment>
            ))}
          </nav>
        </div>
        <div className="mt-4 border-t border-border pt-4 text-center">
          <span className="text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} firmascope. tüm hakları saklıdır.
          </span>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
            <span><a href="https://ufuksoynakliyat.com.tr/kartal-evden-eve-nakliyat" rel="dofollow" className="transition-colors hover:text-foreground/80">Kartal Evden Eve Nakliyat</a> Firması Ufuksoy Nakliyat A.Ş</span>
            <span><a href="https://tekhurdametal.com/istanbul-hurdaci/" rel="dofollow" className="transition-colors hover:text-foreground/80">İstanbul Hurdacı</a> Firması Tek Hurda Metal A.Ş</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
