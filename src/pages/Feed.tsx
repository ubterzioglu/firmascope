import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import VoteButtons from "@/components/VoteButtons";
import ReportButton from "@/components/ReportButton";
import PostForm from "@/components/PostForm";
import { useToast } from "@/hooks/use-toast";
import { Rss, Plus } from "lucide-react";
import { generateMeta } from "@/lib/seo";
import SeoHead from "@/components/SeoHead";
import Breadcrumb from "@/components/Breadcrumb";

interface PostPublic {
  id: string;
  content: string;
  image_url: string | null;
  post_type: string;
  company_id: string | null;
  position: string | null;
  created_at: string;
  author_display_name: string | null;
  author_avatar_url: string | null;
  company_name: string | null;
  company_slug: string | null;
}

const postTypeLabels: Record<string, string> = {
  text: "Düz Mesaj",
  job_offer: "İş İlanı",
  job_search: "İş Arıyorum",
};

const postTypeColors: Record<string, string> = {
  text: "bg-alm-blue/15 text-primary border-primary/20",
  job_offer: "bg-alm-green/15 text-foreground border-alm-green/30",
  job_search: "bg-alm-orange/15 text-foreground border-alm-orange/30",
};

const Feed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<PostPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const meta = generateMeta({
    title: "Akış",
    description: "firmascope topluluk akışı: iş ilanları, iş arayanlar ve genel paylaşımlar.",
    path: "/akis",
  });

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("posts_public")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    setPosts((data as unknown as PostPublic[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleNewPost = () => {
    if (!user) {
      toast({ title: "Giriş gerekli", description: "Gönderi paylaşmak için giriş yapın.", variant: "destructive" });
      navigate("/giris");
      return;
    }
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    fetchPosts();
  };

  return (
    <Layout>
      <SeoHead meta={meta} path="/akis" />
      <section className="py-10">
        <div className="container mx-auto max-w-2xl px-4">
          <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: "Akış" }]} />

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Rss className="h-6 w-6 text-alm-teal" />
              <h1 className="font-display text-2xl font-bold text-foreground">Akış</h1>
            </div>
            {!showForm && (
              <Button size="sm" onClick={handleNewPost}>
                <Plus className="h-4 w-4 mr-1" /> Yeni Gönderi
              </Button>
            )}
          </div>

          <div className="mt-6 space-y-4">
            {showForm && user && (
              <PostForm userId={user.id} onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />
            )}

            {loading ? (
              <p className="text-center text-muted-foreground py-10">Yükleniyor...</p>
            ) : posts.length === 0 ? (
              <Card className="p-10 text-center">
                <Rss className="mx-auto h-10 w-10 text-muted-foreground/40" />
                <h3 className="mt-4 font-display text-base font-bold text-foreground">Henüz gönderi yok</h3>
                <p className="mt-2 text-sm text-muted-foreground">İlk gönderiyi sen paylaş.</p>
              </Card>
            ) : (
              posts.map((post) => {
                const authorName = post.author_display_name || "Anonim";
                const initials = authorName.slice(0, 2).toUpperCase();
                return (
                  <Card key={post.id} className="p-5">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        {post.author_avatar_url && <AvatarImage src={post.author_avatar_url} alt={authorName} />}
                        <AvatarFallback className="bg-alm-yellow text-xs font-bold text-primary-foreground">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{authorName}</span>
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${postTypeColors[post.post_type] || ""}`}>
                            {postTypeLabels[post.post_type] || post.post_type}
                          </span>
                          <span className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString("tr-TR")}</span>
                        </div>

                        {(post.position || post.company_name) && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {post.position}
                            {post.position && post.company_name ? " · " : ""}
                            {post.company_name && post.company_slug ? (
                              <Link to={`/sirket/${post.company_slug}`} className="text-primary hover:underline">{post.company_name}</Link>
                            ) : post.company_name}
                          </p>
                        )}

                        <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{post.content}</p>

                        {post.image_url && (
                          <img src={post.image_url} alt="Gönderi görseli" className="mt-3 max-h-80 w-full rounded-xl object-cover" />
                        )}

                        <div className="mt-3 flex items-center gap-1">
                          <VoteButtons targetId={post.id} targetType="post" />
                          <ReportButton targetId={post.id} targetType="post" />
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Feed;
