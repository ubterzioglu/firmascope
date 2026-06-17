// Shared constants and helpers for the admin pages.
// Extracted from the former monolithic src/pages/Admin.tsx so each admin page can reuse them.

export const SUPER_ADMIN_EMAIL = "ubterzioglu@gmail.com";

/** ASCII-only slug for stable URLs. */
export const slugify = (input: string): string => {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const statusColors: Record<string, string> = {
  pending: "bg-amber/20 text-amber-foreground border-amber/30",
  approved: "bg-alm-green/20 text-foreground border-alm-green/30",
  rejected: "bg-destructive/20 text-destructive border-destructive/30",
};

export const statusLabels: Record<string, string> = {
  pending: "Bekliyor",
  approved: "Onaylandi",
  rejected: "Reddedildi",
};

export const provenanceLabels: Record<string, string> = {
  before: "Before",
  admin_manual: "Admin",
  suggestion_approval: "Oneri",
  scrape_import: "Scrape",
};

export const provenanceColors: Record<string, string> = {
  before: "bg-muted text-muted-foreground border-border",
  admin_manual: "bg-alm-blue/15 text-primary border-primary/20",
  suggestion_approval: "bg-alm-green/15 text-foreground border-alm-green/30",
  scrape_import: "bg-amber/15 text-amber-foreground border-amber/30",
};

export const createdViaLabels: Record<string, string> = {
  legacy_import: "Legacy Import",
  admin_panel: "Admin Panel",
  suggestion_approval: "Oneri Onayi",
  sql_upload: "SQL Upload",
  scrape_worker: "Scrape Worker",
};
