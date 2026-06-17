import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Star, Banknote, UserCheck, MessageSquare, Globe, Linkedin, Pencil } from "lucide-react";
import { generateMeta } from "@/lib/seo";
import SeoHead from "@/components/SeoHead";
import Breadcrumb from "@/components/Breadcrumb";

interface ProfileRow {
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  linkedin_url: string | null;
  website_url: string | null;
}

interface Counts {
  reviews: number;
  salaries: number;
  interviews: number;
  posts: number;
}

const emptyProfile: ProfileRow = {
  display_name: "",
  avatar_url: "",
  bio: "",
  linkedin_url: "",
  website_url: "",
};

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [counts, setCounts] = useState<Counts>({ reviews: 0, salaries: 0, interviews: 0, posts: 0 });
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<ProfileRow>(emptyProfile);
  const [saving, setSaving] = useState(false);

  const meta = generateMeta({
    title: "Profilim",
    description: "firmascope kullanıcı profili.",
    path: "/profil",
    robots: "noindex,nofollow",
  });

  useEffect(() => {
    if (!user) {
      navigate("/giris", { replace: true });
    }
  }, [navigate, user]);

  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    const [profRes, revRes, salRes, intRes, postRes] = await Promise.all([
      supabase.from("profiles").select("display_name,avatar_url,bio,linkedin_url,website_url").eq("user_id", user.id).maybeSingle(),
      supabase.from("reviews").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("salaries").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("interviews").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("posts").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    ]);
    const prof = (profRes.data as ProfileRow | null) || { ...emptyProfile };
    setProfile(prof);
    setCounts({
      reviews: revRes.count || 0,
      salaries: salRes.count || 0,
      interviews: intRes.count || 0,
      posts: postRes.count || 0,
    });
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const openEdit = () => {
    setForm({
      display_name: profile?.display_name || "",
      avatar_url: profile?.avatar_url || "",
      bio: profile?.bio || "",
      linkedin_url: profile?.linkedin_url || "",
      website_url: profile?.website_url || "",
    });
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      display_name: form.display_name?.trim() || null,
      avatar_url: form.avatar_url?.trim() || null,
      bio: form.bio?.trim() || null,
      linkedin_url: form.linkedin_url?.trim() || null,
      website_url: form.website_url?.trim() || null,
    }).eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Kaydedildi", description: "Profiliniz güncellendi." });
      setEditOpen(false);
      fetchProfile();
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </Layout>
    );
  }

  const displayName = profile?.display_name || user.email || "Kullanıcı";
  const initials = displayName.slice(0, 2).toUpperCase();

  const statItems = [
    { label: "Yorum", value: counts.reviews, icon: Star, color: "text-alm-yellow" },
    { label: "Maaş", value: counts.salaries, icon: Banknote, color: "text-alm-green" },
    { label: "Mülakat", value: counts.interviews, icon: UserCheck, color: "text-alm-orange" },
    { label: "Gönderi", value: counts.posts, icon: MessageSquare, color: "text-alm-blue" },
  ];

  return (
    <Layout>
      <SeoHead meta={meta} path="/profil" />
      <section className="py-10">
        <div className="container mx-auto max-w-2xl px-4">
          <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: "Profilim" }]} />

          <div className="card-elevated p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={displayName} />}
                  <AvatarFallback className="bg-alm-yellow text-lg font-bold text-primary-foreground">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">{displayName}</h1>
                  {profile?.bio && <p className="mt-1 text-sm text-muted-foreground">{profile.bio}</p>}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profile?.website_url && (
                      <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <Globe className="h-3.5 w-3.5" /> Web Sitesi
                      </a>
                    )}
                    {profile?.linkedin_url && (
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={openEdit}>
                <Pencil className="h-3.5 w-3.5 mr-1" /> Düzenle
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {statItems.map((item) => (
                <div key={item.label} className="rounded-xl border border-border/70 p-4 text-center">
                  <item.icon className={`mx-auto mb-1 h-5 w-5 ${item.color}`} />
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 card-elevated p-6">
            <h2 className="font-display text-lg font-bold text-foreground">Katkılarım</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Toplam {counts.reviews} yorum, {counts.salaries} maaş, {counts.interviews} mülakat ve {counts.posts} gönderi paylaştınız.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/sirketler"><Button variant="outline" size="sm">Şirketlere göz at</Button></Link>
              <Link to="/akis"><Button variant="outline" size="sm">Akışa git</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Profili Düzenle</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div><Label>Görünen Ad</Label><Input value={form.display_name || ""} onChange={(e) => setForm({ ...form, display_name: e.target.value })} /></div>
            <div><Label>Biyografi</Label><Textarea value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} maxLength={500} /></div>
            <div><Label>Avatar URL</Label><Input value={form.avatar_url || ""} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} placeholder="https://..." /></div>
            <div><Label>LinkedIn</Label><Input value={form.linkedin_url || ""} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/..." /></div>
            <div><Label>Web Sitesi</Label><Input value={form.website_url || ""} onChange={(e) => setForm({ ...form, website_url: e.target.value })} placeholder="https://..." /></div>
            <Button onClick={handleSave} className="w-full" disabled={saving}>
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Profile;
