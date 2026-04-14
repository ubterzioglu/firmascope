import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Search, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <section className="flex flex-1 items-center justify-center py-20">
        <div className="container mx-auto px-4 text-center">
          {/* Big 404 */}
          <div className="relative inline-block">
            <span className="select-none font-display text-[10rem] font-extrabold leading-none tracking-tighter text-alm-orange md:text-[14rem]">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-16 w-16 text-foreground/10 md:h-24 md:w-24" />
            </div>
          </div>

          <h1 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
            Sayfa Bulunamadı
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground leading-relaxed">
            Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
            <br />
            firmascope bu sayfayı bulamadı
            <br />
            seni ana sayfaya alalım :)
          </p>

          <div className="mx-auto mt-8 flex items-center justify-center">
            <Button asChild className="h-11 rounded-lg px-6 text-sm font-semibold">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Ana Sayfa
              </Link>
            </Button>
          </div>

          <div className="mx-auto mt-12 flex max-w-full flex-nowrap items-center justify-center gap-2 overflow-x-auto px-2">
            {["Değerlendirmeler", "Maaşlar", "Mülakatlar", "Şirketler"].map((label, i) => {
              const colors = [
                "bg-[#4285F4]/15 text-[#4285F4]",
                "bg-[#EA4335]/15 text-[#EA4335]",
                "bg-[#FBBC05]/15 text-[#C58B00]",
                "bg-[#34A853]/15 text-[#34A853]",
              ];
              return (
                <span
                  key={label}
                  className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium ${colors[i]} animate-pulse`}
                  style={{ animationDelay: `${i * 0.2}s`, animationDuration: "3s" }}
                >
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
