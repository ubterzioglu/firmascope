import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  description: string | null;
  link_url: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
}

const AdminAnnouncements = () => {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [active, setActive] = useState(true);

  const fetchAnnouncements = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("sort_order", { ascending: true });
    setAnnouncements(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLinkUrl("");
    setSortOrder(0);
    setActive(true);
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setSortOrder(announcements.length);
    setDialogOpen(true);
  };

  const openEdit = (a: Announcement) => {
    setEditingId(a.id);
    setTitle(a.title);
    setDescription(a.description || "");
    setLinkUrl(a.link_url || "");
    setSortOrder(a.sort_order);
    setActive(a.active);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      toast({ title: "Hata", description: "Başlık zorunludur.", variant: "destructive" });
      return;
    }
    if (trimmedTitle.length > 200) {
      toast({ title: "Hata", description: "Başlık 200 karakterden kısa olmalı.", variant: "destructive" });
      return;
    }

    const payload = {
      title: trimmedTitle,
      description: description.trim() || null,
      link_url: linkUrl.trim() || null,
      sort_order: sortOrder,
      active,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("announcements").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("announcements").insert(payload));
    }

    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Başarılı", description: editingId ? "Duyuru güncellendi." : "Duyuru eklendi." });
      setDialogOpen(false);
      resetForm();
      fetchAnnouncements();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Silindi", description: "Duyuru silindi." });
      fetchAnnouncements();
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    const { error } = await supabase.from("announcements").update({ active: !currentActive }).eq("id", id);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      fetchAnnouncements();
    }
  };

  if (loading) {
    return <p className="text-muted-foreground text-center py-8">Yükleniyor...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{announcements.length} duyuru</p>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-1" /> Yeni Duyuru
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Duyuru Düzenle" : "Yeni Duyuru"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label htmlFor="ann-title">Başlık *</Label>
                <Input
                  id="ann-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Duyuru başlığı"
                  maxLength={200}
                />
              </div>
              <div>
                <Label htmlFor="ann-desc">Açıklama</Label>
                <Textarea
                  id="ann-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kısa açıklama"
                  maxLength={500}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="ann-link">Link URL</Label>
                <Input
                  id="ann-link"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="/sayfa veya https://..."
                  maxLength={500}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="ann-order">Sıra</Label>
                  <Input
                    id="ann-order"
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                  />
                </div>
                <div className="flex items-end gap-2 pb-1">
                  <Switch checked={active} onCheckedChange={setActive} id="ann-active" />
                  <Label htmlFor="ann-active">Aktif</Label>
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">
                {editingId ? "Güncelle" : "Ekle"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Sıra</TableHead>
              <TableHead>Başlık</TableHead>
              <TableHead>Açıklama</TableHead>
              <TableHead className="w-[80px]">Aktif</TableHead>
              <TableHead className="text-right w-[100px]">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Henüz duyuru yok. Yeni bir duyuru ekleyin.
                </TableCell>
              </TableRow>
            ) : (
              announcements.map((a) => (
                <TableRow key={a.id} className={!a.active ? "opacity-50" : ""}>
                  <TableCell className="text-muted-foreground">{a.sort_order}</TableCell>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell className="text-muted-foreground text-xs max-w-[200px] truncate">
                    {a.description || "–"}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={a.active}
                      onCheckedChange={() => toggleActive(a.id, a.active)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(a)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(a.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAnnouncements;
