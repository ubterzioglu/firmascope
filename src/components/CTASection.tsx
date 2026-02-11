import { Button } from "@/components/ui/button";

const CTASection = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Deneyimini paylaş, başkalarına yol göster
        </h2>
        <div className="mt-8">
          <Button size="lg" className="rounded-full px-10 font-semibold text-base" onClick={scrollToTop}>
            Başla!
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
