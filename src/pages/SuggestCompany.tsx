import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, Send } from "lucide-react";

const sectors = ["Teknoloji", "Finans", "Sağlık", "Enerji", "Lojistik", "Otomotiv", "Medya", "İnşaat", "Eğitim", "Diğer"];
const cities = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya", "Diğer"];

const SuggestCompany = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    description: "",
    sector: "",
    city: "",
    website_url: "",
  });

  if (!user) {
    navigate("/giris");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company_name.trim()) {
      toast({ title: "Hata", description: "Şirket adı zorunludur.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("company_suggestions").insert({
      user_id: user.id,
      company_name: form.company_name.trim(),
      description: form.description.trim() || null,
      sector: form.sector || null,
      city: form.city || null,
      website_url: form.website_url.trim() || null,
    });

    setLoading(false);

    if (error) {
      toast({ title: "Hata", description: "Öneri gönderilemedi. Tekrar deneyin.", variant: "destructive" });
    } else {
      toast({ title: "Başarılı!", description: "Şirket öneriniz incelemeye gönderildi." });
      navigate("/sirketler");
    }
  };

  return (
    <Layout>
      <section className="py-10">
        <div className="container mx-auto max-w-lg px-4">
          <div className="card-elevated p-8">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="font-display text-2xl font-bold text-foreground">Şirket Öner</h1>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Listede olmayan bir şirket mi var? Önerin, biz ekleyelim.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Şirket Adı *</Label>
                <Input
                  id="company_name"
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  placeholder="Örn: TechNova Yazılım A.Ş."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Sektör</Label>
                <select
                  id="sector"
                  value={form.sector}
                  onChange={(e) => setForm({ ...form, sector: e.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Seçiniz</option>
                  {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Şehir</Label>
                <select
                  id="city"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Seçiniz</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website_url">Web Sitesi</Label>
                <Input
                  id="website_url"
                  value={form.website_url}
                  onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Şirket hakkında kısa bilgi..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                <Send className="h-4 w-4 mr-2" />
                {loading ? "Gönderiliyor..." : "Öneriyi Gönder"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SuggestCompany;
