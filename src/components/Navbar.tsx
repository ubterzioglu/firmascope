import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, User, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="font-display text-lg font-bold text-foreground">
          firmascope
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 md:flex">
          <Link to="/sirketler" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Şirketler
          </Link>
          {user && (
            <Link to="/sirket-oner" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Şirket Öner
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profil" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <User className="h-3.5 w-3.5" />
                <span className="max-w-[120px] truncate">{user.email}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button size="sm" asChild>
              <Link to="/giris">Giriş Yap</Link>
            </Button>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-2">
            <Link to="/sirketler" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-foreground py-1">
              Şirketler
            </Link>
            {user && (
              <Link to="/sirket-oner" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-foreground py-1">
                Şirket Öner
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-foreground py-1 flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" /> Admin
              </Link>
            )}
            {user ? (
              <>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                <Button variant="ghost" size="sm" onClick={() => { signOut(); setMobileOpen(false); }} className="justify-start text-muted-foreground px-0">
                  <LogOut className="h-4 w-4 mr-1" /> Çıkış Yap
                </Button>
              </>
            ) : (
              <Button size="sm" asChild className="w-fit">
                <Link to="/giris" onClick={() => setMobileOpen(false)}>Giriş Yap</Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
