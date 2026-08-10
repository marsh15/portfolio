import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx-components";
import { getNote } from "@/lib/notes";
import { notes } from "@/lib/portfolio";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};
  return {
    title: note.metadata.title,
    description: note.metadata.description,
    alternates: { canonical: `/notes/${slug}` },
    openGraph: { title: note.metadata.title, description: note.metadata.description, type: "article", publishedTime: note.metadata.publishedAt, url: `/notes/${slug}` },
  };
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  return (
    <main id="main-content">
      <article>
        <header className="article-header page-shell">
          <div className="article-meta">
            <span>{note.metadata.project}</span>
            <time dateTime={note.metadata.publishedAt}>August 7, 2026</time>
            <span>{note.metadata.readingTime}</span>
          </div>
          <h1>{note.metadata.title}</h1>
          <p className="article-description">{note.metadata.description}</p>
        </header>
        <div className="prose"><MDXRemote source={note.content} components={mdxComponents} /></div>
      </article>
      <div className="article-back page-shell"><Link className="text-link" href="/notes">← All engineering notes</Link></div>
    </main>
  );
}
