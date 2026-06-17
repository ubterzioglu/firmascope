import { Navigate, NavLink, Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Shield, Megaphone, Lightbulb, FileCheck, Building2, Star, Banknote,
  UserCheck, Users, MessageSquare, Flag, Bot, Inbox,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import {
  Sheet, SheetContent, SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { generateMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Shield;
  /** `end` makes the index link only active on the exact `/admin` path. */
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/admin", label: "Duyurular", icon: Megaphone, end: true },
  { to: "/admin/suggestions", label: "Öneriler", icon: Lightbulb },
  { to: "/admin/claims", label: "Talepler", icon: FileCheck },
  { to: "/admin/companies", label: "Şirketler", icon: Building2 },
  { to: "/admin/reviews", label: "Yorumlar", icon: Star },
  { to: "/admin/salaries", label: "Maaşlar", icon: Banknote },
  { to: "/admin/interviews", label: "Mülakatlar", icon: UserCheck },
  { to: "/admin/users", label: "Kullanıcılar", icon: Users },
  { to: "/admin/posts", label: "Gönderiler", icon: MessageSquare },
  { to: "/admin/reports", label: "Raporlar", icon: Flag },
  { to: "/admin/scrape", label: "Scrape İşleri", icon: Bot },
  { to: "/admin/imports", label: "İçe Aktarımlar", icon: Inbox },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

const meta = generateMeta({
  title: "Yönetim paneli",
  description: "firmascope admin paneli.",
  path: "/admin",
  robots: "noindex,nofollow",
});

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </Layout>
    );
  }

  if (!user) return <Navigate to="/giris" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <Layout>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="robots" content={meta.robots} />
        <link rel="canonical" href={meta.canonical} />
      </Helmet>

      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="font-display text-2xl font-bold text-foreground">Yönetim Paneli</h1>

            {/* Mobile nav trigger */}
            <div className="ml-auto lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">Menü</Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <div className="mt-6">
                    <NavLinks />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-20">
                <NavLinks />
              </div>
            </aside>
            <main className="min-w-0">
              <Outlet />
            </main>
          </div>
        </div>
      </section>
    </Layout>
  );
}
