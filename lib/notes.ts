import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { notes, type NoteMetadata } from "@/lib/portfolio";

const notesDirectory = path.join(process.cwd(), "content", "notes");

export function getNote(slug: string): { metadata: NoteMetadata; content: string } | undefined {
  const knownMetadata = notes.find((note) => note.slug === slug);
  if (!knownMetadata) return undefined;

  const filePath = path.join(notesDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  const file = matter(fs.readFileSync(filePath, "utf8"));
  return { metadata: knownMetadata, content: file.content };
}
