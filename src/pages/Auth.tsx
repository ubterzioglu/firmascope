import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, RefreshCw } from "lucide-react";

const emailSchema = z.string().email("Geçerli bir e-posta adresi girin");
const passwordSchema = z.string().min(6, "Şifre en az 6 karakter olmalıdır");

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup" | "resend">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      toast({ title: "Hata", description: emailResult.error.errors[0].message, variant: "destructive" });
      return;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      toast({ title: "Hata", description: passwordResult.error.errors[0].message, variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes("Invalid login")) {
            toast({ title: "Giriş başarısız", description: "E-posta veya şifre hatalı.", variant: "destructive" });
          } else if (error.message.includes("Email not confirmed")) {
            toast({ 
              title: "E-posta onaylanmadı", 
              description: "Lütfen e-postanızı kontrol edin ve onaylayın. Onay e-postasını tekrar göndermek için aşağıdaki linke tıklayın.", 
              variant: "destructive" 
            });
            setMode("resend");
          } else {
            toast({ title: "Hata", description: error.message, variant: "destructive" });
          }
        }
      } else {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectUrl },
        });
        if (error) {
          if (error.message.includes("already registered")) {
            toast({ title: "Kayıt başarısız", description: "Bu e-posta adresi zaten kayıtlı.", variant: "destructive" });
          } else {
            toast({ title: "Hata", description: error.message, variant: "destructive" });
          }
        } else {
          toast({ title: "Kayıt başarılı!", description: "E-postanızı kontrol edin ve hesabınızı onaylayın." });
          setMode("login");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      toast({ title: "Hata", description: emailResult.error.errors[0].message, variant: "destructive" });
      return;
    }

    setResendLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });

      if (error) {
        toast({ title: "Hata", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "E-posta gönderildi!", description: "Onay e-postası tekrar gönderildi. Lütfen gelen kutunuzu kontrol edin." });
        setMode("login");
      }
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        toast({ title: "Google ile giriş başarısız", description: error.message, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="relative z-10 flex min-h-[calc(100vh-200px)] items-center justify-center py-12">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="card-elevated p-8">
            <h1 className="font-display text-2xl font-bold text-foreground text-center mb-2">
              {mode === "login" ? "Giriş Yap" : mode === "signup" ? "Kayıt Ol" : "E-posta Onayı"}
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
              {mode === "login"
                ? "Hesabınıza giriş yapın"
                : mode === "signup"
                ? "Yeni bir hesap oluşturun"
                : "Onay e-postasını tekrar gönderin"}
            </p>

            {/* Resend verification mode */}
            {mode === "resend" ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-amber/10 border border-amber/30 text-sm text-foreground">
                  <p className="font-medium mb-1">E-postanız onaylanmadı</p>
                  <p className="text-muted-foreground">Onay e-postasını tekrar almak için aşağıdaki butona tıklayın.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resend-email">E-posta</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="resend-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@email.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleResendVerification} 
                  className="w-full h-11" 
                  disabled={resendLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${resendLoading ? "animate-spin" : ""}`} />
                  {resendLoading ? "Gönderiliyor..." : "Onay E-postasını Tekrar Gönder"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  <button onClick={() => setMode("login")} className="text-primary hover:underline font-medium">
                    Giriş sayfasına dön
                  </button>
                </p>
              </div>
            ) : (
              <>

            {/* Google button */}
            <Button
              variant="outline"
              className="w-full mb-4 h-11"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google ile devam et
            </Button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">veya</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? "Yükleniyor..." : mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <>
                  Hesabınız yok mu?{" "}
                  <button onClick={() => setMode("signup")} className="text-primary hover:underline font-medium">
                    Kayıt Ol
                  </button>
                </>
              ) : (
                <>
                  Zaten hesabınız var mı?{" "}
                  <button onClick={() => setMode("login")} className="text-primary hover:underline font-medium">
                    Giriş Yap
                  </button>
                </>
              )}
            </p>
            </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
