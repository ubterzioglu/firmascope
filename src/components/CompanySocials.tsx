import { Globe, Linkedin, Twitter, Instagram, Facebook } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CompanySocialsProps {
  websiteUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
}

interface SocialLink {
  url: string;
  label: string;
  icon: LucideIcon;
  colorClass: string;
}

const CompanySocials = ({
  websiteUrl,
  linkedinUrl,
  twitterUrl,
  instagramUrl,
  facebookUrl,
}: CompanySocialsProps) => {
  const links: SocialLink[] = [
    { url: websiteUrl, label: "Web Sitesi", icon: Globe, colorClass: "text-alm-blue" },
    { url: linkedinUrl, label: "LinkedIn", icon: Linkedin, colorClass: "text-[#0a66c2]" },
    { url: twitterUrl, label: "Twitter / X", icon: Twitter, colorClass: "text-foreground" },
    { url: instagramUrl, label: "Instagram", icon: Instagram, colorClass: "text-[#e1306c]" },
    { url: facebookUrl, label: "Facebook", icon: Facebook, colorClass: "text-[#1877f2]" },
  ].filter((link): link is SocialLink => Boolean(link.url && link.url.trim()));

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="card-elevated p-6">
      <h2 className="font-display text-lg font-bold text-foreground">İletişim ve Sosyal Medya</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-border/70 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/5"
          >
            <link.icon className={`h-4 w-4 ${link.colorClass}`} />
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default CompanySocials;
