import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/portfolio";

export function ProjectProof({ project, index }: { project: Project; index: number }) {
  return (
    <article className="project-proof page-shell" data-reveal>
      <div className="project-copy">
        <p className="kicker">0{index} / {project.eyebrow}</p>
        <h3>{project.name}</h3>
        <p className="project-lede">{project.shortDescription}</p>
        <ul className="proof-list" aria-label={`${project.name} engineering highlights`}>
          {project.proof.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <p className="project-stack">{project.stack.join(" · ")}</p>
        <div className="project-actions">
          {project.caseStudy && <Link className="chip-link" href={`/work/${project.slug}`}>Case study <span aria-hidden="true">→</span></Link>}
          <a className={project.caseStudy ? "text-link" : "chip-link"} href={project.live} target="_blank" rel="noreferrer">Live <span aria-hidden="true">↗</span></a>
          <a className="text-link" href={project.github} target="_blank" rel="noreferrer">Source <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <figure className={`project-frame project-frame-${project.theme}`}>
        <Image src={project.image} alt={project.imageAlt} width={1440} height={960} sizes="(max-width: 820px) 100vw, 52rem" />
        <figcaption><span>{project.name} · product capture</span><span>0{index} / 03</span></figcaption>
      </figure>
    </article>
  );
}
