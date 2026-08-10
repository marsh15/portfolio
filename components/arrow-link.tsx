import Link from "next/link";

export function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link className="text-link" href={href}>
      {children} <span aria-hidden="true">→</span>
    </Link>
  );
}
