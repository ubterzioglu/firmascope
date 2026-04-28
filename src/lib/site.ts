export const SITE_NAME = "firmascope";
export const SITE_URL = "https://firmascope.com";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/firmascope_og.png`;
export const DEFAULT_LOCALE = "tr_TR";

export const INDEXABLE_STATIC_ROUTES = ["/", "/sirketler"] as const;
export const NOINDEX_STATIC_ROUTES = [
  "/admin",
  "/giris",
  "/sirket-yonetimi",
  "/yasal",
  "/sirket-oner",
] as const;

const TURKISH_CHAR_MAP: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  İ: "i",
  ö: "o",
  ş: "s",
  ü: "u",
  Ç: "c",
  Ğ: "g",
  Ö: "o",
  Ş: "s",
  Ü: "u",
};

export const slugifyTaxonomyValue = (value: string) => {
  const normalized = value
    .trim()
    .split("")
    .map((char) => TURKISH_CHAR_MAP[char] ?? char)
    .join("")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "genel";
};

export const normalizeRoutePath = (path: string) => {
  if (!path || path === "/") {
    return "/";
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized.replace(/\/+$/, "") || "/";
};

export const toAbsoluteUrl = (path: string) => {
  const normalizedPath = normalizeRoutePath(path);
  return normalizedPath === "/" ? `${SITE_URL}/` : `${SITE_URL}${normalizedPath}`;
};

export const isIndexableRoute = (path: string) =>
  !NOINDEX_STATIC_ROUTES.some((route) => path === route || path.startsWith(`${route}/`));
