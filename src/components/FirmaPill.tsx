import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Search, Lightbulb, Star, Users, DollarSign, UserPlus, LogOut, Shield, Home } from "lucide-react";

const menuItems = [
  { label: "Ana Sayfa", icon: Home, color: "bg-alm-blue", href: "/" },
  { label: "Şirket Ara", icon: Search, color: "bg-alm-green", href: "/sirketler" },
  { label: "Şirket Öner", icon: Lightbulb, color: "bg-alm-orange", href: "/sirket-oner" },
  { label: "Değerlendirme Ekle", icon: Star, color: "bg-alm-yellow", href: "/sirketler" },
  { label: "Mülakat Bilgisi", icon: Users, color: "bg-alm-blue", href: "/sirketler" },
  { label: "Maaş Bilgisi", icon: DollarSign, color: "bg-alm-green", href: "/sirketler" },
];

const FirmaPill = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div ref={ref} className="fixed top-4 right-4 z-50">
      {/* Pill button */}
      <button
        onClick={() => setOpen(!open)}
        className="font-display text-sm font-bold text-alm-orange bg-white rounded-full px-4 py-2 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 border border-border"
      >
        firmascope
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute top-full right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-2xl">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted group opacity-0"
                style={{
                  animation: `fadeSlideUp 0.3s ease-out ${index * 0.05}s forwards`,
                }}
              >
                <span className={`${item.color} flex h-8 w-8 items-center justify-center rounded-lg text-white transition-transform group-hover:scale-110`}>
                  <item.icon className="h-4 w-4" />
                </span>
                {item.label}
              </Link>
            ))}

            {/* Divider */}
            <div className="my-1 h-px bg-border" />

            {/* Auth items */}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted group opacity-0"
                style={{
                  animation: `fadeSlideUp 0.3s ease-out ${menuItems.length * 0.05}s forwards`,
                }}
              >
                <span className="bg-alm-orange flex h-8 w-8 items-center justify-center rounded-lg text-white transition-transform group-hover:scale-110">
                  <Shield className="h-4 w-4" />
                </span>
                Admin
              </Link>
            )}

            {user ? (
              <button
                onClick={() => { signOut(); setOpen(false); }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted group opacity-0"
                style={{
                  animation: `fadeSlideUp 0.3s ease-out ${(menuItems.length + 1) * 0.05}s forwards`,
                }}
              >
                <span className="bg-destructive flex h-8 w-8 items-center justify-center rounded-lg text-white transition-transform group-hover:scale-110">
                  <LogOut className="h-4 w-4" />
                </span>
                Çıkış Yap
              </button>
            ) : (
              <Link
                to="/giris"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted group opacity-0"
                style={{
                  animation: `fadeSlideUp 0.3s ease-out ${(menuItems.length + 1) * 0.05}s forwards`,
                }}
              >
                <span className="bg-alm-yellow flex h-8 w-8 items-center justify-center rounded-lg text-white transition-transform group-hover:scale-110">
                  <UserPlus className="h-4 w-4" />
                </span>
                Üye Ol / Giriş Yap
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FirmaPill;
