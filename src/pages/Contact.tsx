import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto max-w-2xl px-4">
          <h1 className="font-display text-4xl font-bold text-foreground">İletişim</h1>
          <p className="mt-3 text-muted-foreground">
            Soru, öneri veya geri bildirimleriniz için bize ulaşın.
          </p>

          <div className="mt-10 rounded-2xl border border-border bg-card p-8">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Konu</label>
                <select className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
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
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Mesajınız</label>
                <textarea
                  rows={5}
                  placeholder="Mesajınızı buraya yazın..."
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
              <Button className="w-full rounded-full font-semibold">
                Gönder
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            destek@firmascope.com
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
