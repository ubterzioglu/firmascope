import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

interface AdminPost {
  id: string;
  content: string | null;
  post_type: string | null;
  company_name: string | null;
  author_display_name: string | null;
  created_at: string | null;
}

const postTypeLabels: Record<string, string> = {
  text: "Düz Mesaj",
  job_offer: "İş İlanı",
  job_search: "İş Arıyorum",
};

const AdminPosts = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("posts_public")
      .select("id,content,post_type,company_name,author_display_name,created_at")
      .order("created_at", { ascending: false });
    setPosts((data as unknown as AdminPost[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Silindi", description: "Gönderi kaldırıldı." });
      fetchPosts();
    }
  };

  if (loading) {
    return <p className="text-center text-muted-foreground py-8">Yükleniyor...</p>;
  }

  return (
    <div className="card-elevated overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kullanıcı</TableHead>
            <TableHead>İçerik</TableHead>
            <TableHead>Tip</TableHead>
            <TableHead>Şirket</TableHead>
            <TableHead>Tarih</TableHead>
            <TableHead className="text-right">İşlem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Henüz gönderi yok.</TableCell></TableRow>
          ) : posts.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.author_display_name || "Anonim"}</TableCell>
              <TableCell className="max-w-[280px] truncate">{p.content}</TableCell>
              <TableCell><Badge variant="outline">{postTypeLabels[p.post_type || ""] || p.post_type || "-"}</Badge></TableCell>
              <TableCell>{p.company_name || "-"}</TableCell>
              <TableCell className="text-muted-foreground text-xs">{p.created_at ? new Date(p.created_at).toLocaleDateString("tr-TR") : "-"}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminPosts;
