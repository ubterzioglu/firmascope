/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { SUPER_ADMIN_EMAIL } from "@/lib/admin/constants";

type AdminUser = {
  id: string;
  user_id: string;
  display_name: string | null;
  created_at: string;
  is_admin?: boolean;
  is_company_admin?: boolean;
};

export default function AdminUsers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isSuperAdmin = user?.email?.toLowerCase() === SUPER_ADMIN_EMAIL;

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleMutationUserId, setRoleMutationUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const [userRes, roleRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const roles = roleRes.data || [];
    const adminIds = new Set(roles.filter((role: any) => role.role === "admin").map((role: any) => role.user_id));
    const companyAdminIds = new Set(roles.filter((role: any) => role.role === "company_admin").map((role: any) => role.user_id));
    const userRows = (userRes.data || []).map((profile: any) => ({
      ...profile,
      is_admin: adminIds.has(profile.user_id),
      is_company_admin: companyAdminIds.has(profile.user_id),
    }));
    setUsers(userRows);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSetAdminRole = async (targetUserId: string, enabled: boolean) => {
    if (!isSuperAdmin) {
      toast({
        title: "Yetki yok",
        description: "Admin ekleme ve cikarma sadece super admin hesabinda acik.",
        variant: "destructive",
      });
      return;
    }

    setRoleMutationUserId(targetUserId);
    const { error } = await supabase.rpc("set_user_role_admin", {
      _target_user_id: targetUserId,
      _enabled: enabled,
    });
    setRoleMutationUserId(null);

    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
      return;
    }

    toast({
      title: "Basarili",
      description: enabled ? "Kullanici admin yapildi." : "Admin rolu kaldirildi.",
    });
    fetchUsers();
  };

  if (loading) {
    return <p className="text-muted-foreground py-8 text-center">Yükleniyor...</p>;
  }

  return (
    <>
      <div className="mb-4 rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
        Yeni birini admin yapmak icin once kullanicinin kayit olmus olmasi gerekir. Aksi halde `user_roles` kaydi baglanamaz.
      </div>
      <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
        Admin ekleme ve cikarma yetkisi sadece super admin hesabinda acik:
        {" "}
        <span className="font-medium text-foreground">{SUPER_ADMIN_EMAIL}</span>
      </div>
      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>İsim</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Kullanıcı ID</TableHead>
              <TableHead>Kayıt Tarihi</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.display_name || "-"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {u.is_admin && <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">admin</Badge>}
                    {u.is_company_admin && <Badge variant="outline">company_admin</Badge>}
                    {!u.is_admin && !u.is_company_admin && <Badge variant="outline">user</Badge>}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{u.user_id}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{new Date(u.created_at).toLocaleDateString("tr-TR")}</TableCell>
                <TableCell className="text-right">
                  {isSuperAdmin ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={roleMutationUserId === u.user_id}
                      onClick={() => handleSetAdminRole(u.user_id, !u.is_admin)}
                    >
                      {roleMutationUserId === u.user_id
                        ? "Kaydediliyor..."
                        : u.is_admin
                          ? "Admin Kaldir"
                          : "Admin Yap"}
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sadece super admin</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
