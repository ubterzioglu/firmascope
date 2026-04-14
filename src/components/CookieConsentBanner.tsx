import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { persistClarityConsent, readClarityConsent, type ClarityConsentState } from "@/lib/clarity";

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = readClarityConsent();
    setIsVisible(!consent);
  }, []);

  const handleDecision = (state: ClarityConsentState) => {
    persistClarityConsent(state);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="container mx-auto flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-foreground">Deneyimi iyileştirmek ve kullanım akışını anlamak için analiz çerezleri kullanabiliriz.</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Ayrıntılar için <Link to="/yasal" className="font-medium text-foreground underline underline-offset-2">yasal bilgiler</Link>.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" variant="outline" className="rounded-md" onClick={() => handleDecision("denied")}>
            Reddet
          </Button>
          <Button type="button" className="rounded-md" onClick={() => handleDecision("granted")}>
            Kabul Et
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
