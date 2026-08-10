import type { MetadataRoute } from "next";
import { caseStudies, notes } from "@/lib/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return [
    { url: base, lastModified: new Date("2026-08-09"), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/notes`, lastModified: new Date("2026-08-07"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/privacy`, lastModified: new Date("2026-08-09"), changeFrequency: "yearly", priority: 0.3 },
    ...caseStudies.map((study) => ({ url: `${base}/work/${study.slug}`, lastModified: new Date("2026-08-07"), changeFrequency: "monthly" as const, priority: 0.9 })),
    ...notes.map((note) => ({ url: `${base}/notes/${note.slug}`, lastModified: new Date(note.publishedAt), changeFrequency: "yearly" as const, priority: 0.7 })),
  ];
}
