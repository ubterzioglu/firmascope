import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface PostFormProps {
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

type PostType = "text" | "job_offer" | "job_search";

const POST_TYPES: { value: PostType; label: string }[] = [
  { value: "text", label: "Düz Mesaj" },
  { value: "job_offer", label: "İş İlanı" },
  { value: "job_search", label: "İş Arıyorum" },
];

interface CompanyOption {
  id: string;
  name: string;
}

const PostForm = ({ userId, onSuccess, onCancel }: PostFormProps) => {
  const { toast } = useToast();
  const [postType, setPostType] = useState<PostType>("text");
  const [content, setContent] = useState("");
  const [position, setPosition] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [loading, setLoading] = useState(false);

  const needsCompany = postType === "job_offer";
  const needsPosition = postType === "job_offer" || postType === "job_search";

  useEffect(() => {
    supabase.from("companies").select("id,name").eq("status", "Aktif").order("name").limit(500)
      .then(({ data }) => setCompanies((data as CompanyOption[]) || []));
  }, []);

  const uploadImage = async (file: File): Promise<string> => {
    const ext = (file.name.split(".").pop() || "png").toLowerCase();
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("post-images")
      .upload(path, file, { upsert: false, contentType: file.type || "application/octet-stream" });
    if (error) throw error;
    const { data } = supabase.storage.from("post-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({ title: "Eksik alan", description: "Gönderi içeriği boş olamaz.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { error } = await supabase.from("posts").insert({
        user_id: userId,
        content: content.trim(),
        image_url: imageUrl,
        post_type: postType,
        company_id: needsCompany && companyId ? companyId : null,
        position: needsPosition && position.trim() ? position.trim() : null,
      });

      if (error) {
        if (error.message.includes("5 gönderi")) {
          toast({ title: "Limit aşıldı", description: "Saatte en fazla 5 gönderi paylaşabilirsiniz.", variant: "destructive" });
        } else {
          throw error;
        }
      } else {
        toast({ title: "Paylaşıldı!", description: "Gönderiniz akışa eklendi." });
        onSuccess();
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Gönderi paylaşılamadı.";
      toast({ title: "Hata", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-elevated p-6">
      <h3 className="font-display text-lg font-bold text-foreground">Yeni Gönderi</h3>

      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label>Gönderi Tipi</Label>
          <div className="flex flex-wrap gap-2">
            {POST_TYPES.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPostType(opt.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  postType === opt.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>İçerik *</Label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} maxLength={2000} placeholder="Ne paylaşmak istersiniz?" />
        </div>

        {needsCompany && (
          <div className="space-y-2">
            <Label>Şirket</Label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger><SelectValue placeholder="Şirket seçiniz" /></SelectTrigger>
              <SelectContent>
                {companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        {needsPosition && (
          <div className="space-y-2">
            <Label>Pozisyon</Label>
            <Input value={position} onChange={(e) => setPosition(e.target.value)} maxLength={120} placeholder="Örn: Senior QA Engineer" />
          </div>
        )}

        <div className="space-y-2">
          <Label>Görsel (opsiyonel)</Label>
          <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={loading} className="flex-1">
            {loading ? "Paylaşılıyor..." : "Paylaş"}
          </Button>
          <Button variant="ghost" onClick={onCancel}>İptal</Button>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
