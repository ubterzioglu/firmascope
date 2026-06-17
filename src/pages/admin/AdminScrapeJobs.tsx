import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { createScrapeJob, listScrapeJobs, type ScrapeJob } from "@/lib/scrapeApi";

const statusColors: Record<string, string> = {
  queued: "bg-muted text-muted-foreground border-border",
  running: "bg-alm-blue/15 text-primary border-primary/20",
  done: "bg-alm-green/15 text-foreground border-alm-green/30",
  failed: "bg-destructive/20 text-destructive border-destructive/30",
  cancelled: "bg-amber/20 text-amber-foreground border-amber/30",
};

export default function AdminScrapeJobs() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [source, setSource] = useState("");
  const [seedUrlsText, setSeedUrlsText] = useState("");

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["scrape_jobs"],
    queryFn: listScrapeJobs,
    // Poll while jobs may still be progressing; the worker updates these rows.
    refetchInterval: 5000,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createScrapeJob({
        source: source.trim(),
        seedUrls: seedUrlsText
          .split(/\r?\n/)
          .map((u) => u.trim())
          .filter(Boolean),
      }),
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Scrape işi kuyruğa eklendi." });
      setDialogOpen(false);
      setSource("");
      setSeedUrlsText("");
      queryClient.invalidateQueries({ queryKey: ["scrape_jobs"] });
    },
    onError: (e: unknown) => {
      toast({ title: "Hata", description: e instanceof Error ? e.message : "Bilinmeyen hata", variant: "destructive" });
    },
  });

  const canSubmit = source.trim().length > 0 && seedUrlsText.trim().length > 0 && !createMutation.isPending;

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Scrape işleri harici worker tarafından çalıştırılır. Sonuçlar onaya kadar `İçe Aktarımlar` kuyruğunda bekler.
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Yeni İş</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Yeni Scrape İşi</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <div>
                <Label>Kaynak</Label>
                <Input value={source} onChange={(e) => setSource(e.target.value)} placeholder="ornek-dizin" />
              </div>
              <div>
                <Label>Seed URL'ler (her satıra bir tane)</Label>
                <Textarea
                  value={seedUrlsText}
                  onChange={(e) => setSeedUrlsText(e.target.value)}
                  rows={5}
                  placeholder={"https://ornek.com/sirketler\nhttps://ornek.com/sirketler?page=2"}
                />
              </div>
              <Button className="w-full" disabled={!canSubmit} onClick={() => createMutation.mutate()}>
                {createMutation.isPending ? "Ekleniyor..." : "Kuyruğa Ekle"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kaynak</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Seed</TableHead>
              <TableHead>Oluşturulma</TableHead>
              <TableHead className="text-right">Detay</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Yükleniyor...</TableCell></TableRow>
            ) : jobs.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Henüz scrape işi yok.</TableCell></TableRow>
            ) : jobs.map((job: ScrapeJob) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.source}</TableCell>
                <TableCell><Badge className={statusColors[job.status] || ""} variant="outline">{job.status}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{job.seed_urls.length} URL</TableCell>
                <TableCell className="text-muted-foreground text-xs">{new Date(job.created_at).toLocaleString("tr-TR")}</TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm" variant="ghost">
                    <Link to={`/admin/scrape/${job.id}`}>Detay</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
