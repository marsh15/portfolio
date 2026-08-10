import { describe, expect, it } from "vitest";
import { caseStudies, links, notes, projects } from "@/lib/portfolio";
import { getNote } from "@/lib/notes";

describe("portfolio content", () => {
  it("has unique project and note slugs", () => {
    expect(new Set(projects.map((project) => project.slug)).size).toBe(projects.length);
    expect(new Set(notes.map((note) => note.slug)).size).toBe(notes.length);
  });

  it("maps every case study to a featured project", () => {
    for (const study of caseStudies) {
      expect(projects.find((project) => project.slug === study.slug)?.caseStudy).toBe(true);
    }
  });

  it("loads an MDX body for every note", () => {
    for (const note of notes) expect(getNote(note.slug)?.content.length).toBeGreaterThan(300);
  });

  it("uses explicit external URLs", () => {
    for (const link of links) expect(link.href).toMatch(/^(https:\/\/|mailto:)/);
  });
});
