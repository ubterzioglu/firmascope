import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { ADMIN_GUIDES } from "@/lib/admin/guides";

export default function AdminGuides() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ADMIN_GUIDES;
    return ADMIN_GUIDES.filter((g) =>
      g.title.toLowerCase().includes(q) || g.purpose.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <>
      <div className="mb-4 text-sm text-muted-foreground">
        Admin panelindeki her bölümün ne işe yaradığını ve nasıl kullanıldığını anlatan kılavuzlar.
        Bir bölüme tıklayarak ayrıntıları açabilirsiniz.
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Bölüm ara..."
          className="pl-9"
          aria-label="Kılavuzlarda ara"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">Eşleşen kılavuz yok.</p>
      ) : (
        <Accordion type="multiple" className="space-y-2">
          {filtered.map((guide) => {
            const Icon = guide.icon;
            return (
              <AccordionItem
                key={guide.to}
                value={guide.to}
                className="card-elevated overflow-hidden border-none px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <Icon className="h-5 w-5 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <div className="font-medium text-foreground">{guide.title}</div>
                      <div className="text-xs text-muted-foreground font-normal">{guide.purpose}</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pb-2">
                    <div>
                      <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Ne işe yarar
                      </h4>
                      <p className="text-sm text-foreground">{guide.purpose}</p>
                    </div>

                    <div>
                      <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Nasıl kullanılır
                      </h4>
                      <ol className="list-decimal space-y-1 pl-5 text-sm text-foreground">
                        {guide.howTo.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    {guide.notes && guide.notes.length > 0 && (
                      <div>
                        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Notlar
                        </h4>
                        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                          {guide.notes.map((note, i) => (
                            <li key={i}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <NavLink
                      to={guide.to}
                      end={guide.to === "/admin"}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      Bölüme git <ArrowRight className="h-4 w-4" />
                    </NavLink>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </>
  );
}
