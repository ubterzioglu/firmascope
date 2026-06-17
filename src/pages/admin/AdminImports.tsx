import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";
import {
  approveImport, rejectImport, listPendingImports, type CompanyImportStaging,
} from "@/lib/scrapeApi";

export default function AdminImports() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: imports = [], isLoading } = useQuery({
    queryKey: ["company_import_staging", "pending"],
    queryFn: listPendingImports,
    refetchInterval: 10000,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["company_import_staging", "pending"] });

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveImport(id),
    onSuccess: (result) => {
      if (result.status === "matches_existing") {
        toast({ title: "Zaten mevcut", description: "Bu slug ile bir şirket var; kayıt eşleştirildi, yeni şirket oluşturulmadı." });
      } else {
        toast({ title: "Onaylandı", description: "Şirket oluşturuldu." });
      }
      refresh();
    },
    onError: (e: unknown) => {
      toast({ title: "Hata", description: e instanceof Error ? e.message : "Bilinmeyen hata", variant: "destructive" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => rejectImport(id),
    onSuccess: () => { toast({ title: "Reddedildi" }); refresh(); },
    onError: (e: unknown) => {
      toast({ title: "Hata", description: e instanceof Error ? e.message : "Bilinmeyen hata", variant: "destructive" });
    },
  });

  const pending = (id: string) => approveMutation.isPending && approveMutation.variables === id;

  return (
    <>
      <div className="mb-4 text-sm text-muted-foreground">
        Scrape sonucu gelen şirket adayları. Onaylanan kayıtlar canonical `companies` tablosuna eklenir; reddedilenler atlanır.
        Hiçbir kayıt onay olmadan yayına geçmez.
      </div>
      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Sektör</TableHead>
              <TableHead>Şehir</TableHead>
              <TableHead>Kaynak</TableHead>
              <TableHead>Dedupe</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Yükleniyor...</TableCell></TableRow>
            ) : imports.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Bekleyen içe aktarım yok.</TableCell></TableRow>
            ) : imports.map((row: CompanyImportStaging) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{row.slug}</TableCell>
                <TableCell>{row.sector || "-"}</TableCell>
                <TableCell>{row.city || "-"}</TableCell>
                <TableCell className="max-w-[200px] truncate text-xs">
                  {row.source_url ? (
                    <a href={row.source_url} target="_blank" rel="noreferrer" className="text-primary underline">
                      {row.source_url}
                    </a>
                  ) : "-"}
                </TableCell>
                <TableCell>
                  {row.dedupe_status === "matches_existing" ? (
                    <Badge variant="outline" className="border-amber/30 bg-amber/20 text-amber-foreground">Mevcut</Badge>
                  ) : (
                    <Badge variant="outline">Yeni</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-alm-green hover:text-alm-green"
                      disabled={pending(row.id) || rejectMutation.isPending}
                      onClick={() => approveMutation.mutate(row.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      onClick={() => rejectMutation.mutate(row.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
