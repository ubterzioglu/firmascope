import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle } from "lucide-react";

const Contact = () => {
  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto max-w-2xl px-4">
          <h1 className="font-display text-4xl font-bold text-foreground">İletişim</h1>
          <p className="mt-3 text-muted-foreground">
            Soru, öneri veya geri bildirimleriniz için bize ulaşın.
          </p>

          <div className="mt-10 rounded-xl border border-border bg-card p-8">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Konu</label>
                <select className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20">
                  <option>Genel Soru</option>
                  <option>Şirket Profili Talebi</option>
                  <option>İçerik Şikayeti</option>
                  <option>Teknik Destek</option>
                  <option>Diğer</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">E-posta</label>
                <input
                  type="email"
                  placeholder="ornek@email.com"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Mesajınız</label>
                <textarea
                  rows={5}
                  placeholder="Mesajınızı buraya yazın..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                />
              </div>
              <Button variant="hero" className="w-full">
                Gönder
              </Button>
            </form>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent" /> destek@firmascope.com
            </span>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
