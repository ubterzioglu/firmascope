import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Deneyimini paylaş, başkalarına yol göster
        </h2>
        <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
          Kimliğin tamamen gizli kalır. Şirket kültürü, maaş ve mülakat deneyimlerini anonim olarak paylaş.
        </p>
        <div className="mt-8">
          <Button size="lg" asChild className="rounded-full px-10 font-semibold text-base">
            <Link to="/kayit">Hemen Başla</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
