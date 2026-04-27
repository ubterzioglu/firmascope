import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { homepageFaqItems } from "@/lib/homepage-faq";

const WhyFirmascope = () => {
  return (
    <section id="faq" className="relative z-10 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-lg md:p-10">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-foreground md:text-3xl">
            Sık Sorulan Sorular
          </h2>

          <Accordion type="single" collapsible className="w-full">
            {homepageFaqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border">
                <AccordionTrigger
                  className={`font-display text-sm font-semibold ${item.color} hover:no-underline md:text-base`}
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                  {(index === 0 || index === 3) && (
                    <>
                      {" "}
                      Daha fazla bilgi için <Link to="/sirketler" className="font-semibold text-primary hover:underline">Şirketler</Link> sayfasına bakabilirsiniz.
                    </>
                  )}
                  {index === 7 && (
                    <>
                      {" "}
                      Yeni şirket eklemek için <Link to="/sirket-oner" className="font-semibold text-primary hover:underline">Şirket Öner</Link> sayfasını kullanabilirsiniz.
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default WhyFirmascope;
