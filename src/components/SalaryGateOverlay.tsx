import { Lock, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

interface SalaryGateOverlayProps {
  onSubmitSalary: () => void;
}

const SalaryGateOverlay = ({ onSubmitSalary }: SalaryGateOverlayProps) => {
  const { user } = useAuth();

  return (
    <div className="relative">
      {/* Blurred preview placeholders */}
      <div className="space-y-3 blur-md select-none pointer-events-none" aria-hidden>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-elevated p-5">
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-5 w-24 rounded bg-muted" />
            </div>
            <div className="mt-3 flex gap-3">
              <div className="h-3 w-20 rounded bg-muted" />
              <div className="h-3 w-16 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>

      {/* Gate overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="card-elevated p-8 text-center max-w-sm mx-auto shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-alm-orange/15">
            <Lock className="h-7 w-7 text-alm-orange" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            Maaş verilerini görmek için paylaş
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Maaş bilgilerini görebilmek için önce kendi maaş bilgini anonim olarak paylaşman gerekiyor.
          </p>
          {user ? (
            <Button
              className="mt-5 w-full rounded-xl font-semibold text-sm h-11 bg-alm-orange text-primary-foreground hover:bg-alm-orange/90"
              onClick={onSubmitSalary}
            >
              <Banknote className="mr-2 h-4 w-4" />
              Maaş Bilgisi Paylaş
            </Button>
          ) : (
            <Button asChild className="mt-5 w-full rounded-xl font-semibold text-sm h-11">
              <Link to="/giris">Giriş Yap</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryGateOverlay;
