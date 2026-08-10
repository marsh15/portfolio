import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  a: ({ href = "", children, ...props }) => {
    const external = href.startsWith("http");
    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} {...props}>
        {children}{external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </a>
    );
  },
};
