import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { cancelScrapeJob, getScrapeJob, listJobLogs, type ScrapeJobLog } from "@/lib/scrapeApi";

const levelColors: Record<string, string> = {
  debug: "text-muted-foreground",
  info: "text-foreground",
  warn: "text-amber-foreground",
  error: "text-destructive",
};

export default function AdminScrapeJobDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isActive = (status?: string) => status === "queued" || status === "running";

  const { data: job, isLoading } = useQuery({
    queryKey: ["scrape_job", id],
    queryFn: () => getScrapeJob(id as string),
    enabled: !!id,
    refetchInterval: (query) => (isActive(query.state.data?.status) ? 4000 : false),
  });

  const { data: logs = [] } = useQuery({
    queryKey: ["scrape_job_logs", id],
    queryFn: () => listJobLogs(id as string),
    enabled: !!id,
    refetchInterval: isActive(job?.status) ? 4000 : false,
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelScrapeJob(id as string),
    onSuccess: () => {
      toast({ title: "İptal istendi", description: "Worker bir sonraki kontrolde duracak." });
      queryClient.invalidateQueries({ queryKey: ["scrape_job", id] });
    },
    onError: (e: unknown) => {
      toast({ title: "Hata", description: e instanceof Error ? e.message : "Bilinmeyen hata", variant: "destructive" });
    },
  });

  if (isLoading) {
    return <p className="text-muted-foreground py-8 text-center">Yükleniyor...</p>;
  }

  if (!job) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        İş bulunamadı. <Link to="/admin/scrape" className="text-primary underline">Listeye dön</Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin/scrape"><ArrowLeft className="h-4 w-4 mr-1" /> Listeye dön</Link>
        </Button>
        {isActive(job.status) && (
          <Button variant="outline" size="sm" disabled={cancelMutation.isPending} onClick={() => cancelMutation.mutate()}>
            {cancelMutation.isPending ? "İptal ediliyor..." : "İşi İptal Et"}
          </Button>
        )}
      </div>

      <div className="card-elevated p-4 mb-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-xs text-muted-foreground">Kaynak</div>
            <div className="font-semibold text-foreground">{job.source}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Durum</div>
            <Badge variant="outline">{job.status}</Badge>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Başladı</div>
            <div className="text-sm text-foreground">{job.started_at ? new Date(job.started_at).toLocaleString("tr-TR") : "-"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Bitti</div>
            <div className="text-sm text-foreground">{job.finished_at ? new Date(job.finished_at).toLocaleString("tr-TR") : "-"}</div>
          </div>
        </div>
        {Object.keys(job.stats ?? {}).length > 0 && (
          <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted/40 p-3 text-xs text-foreground">
            {JSON.stringify(job.stats, null, 2)}
          </pre>
        )}
      </div>

      <h3 className="mb-2 text-sm font-semibold text-foreground">Loglar</h3>
      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Seviye</TableHead>
              <TableHead>Mesaj</TableHead>
              <TableHead className="w-[180px]">Zaman</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">Henüz log yok.</TableCell></TableRow>
            ) : logs.map((log: ScrapeJobLog) => (
              <TableRow key={log.id}>
                <TableCell className={`text-xs font-medium uppercase ${levelColors[log.level] || ""}`}>{log.level}</TableCell>
                <TableCell className="text-sm">{log.message}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{new Date(log.created_at).toLocaleString("tr-TR")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
