// src/components/TransitionLink.tsx
"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface TransitionLinkProps extends LinkProps {
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export default function TransitionLink({ href, children, ...props }: TransitionLinkProps) {
  const router = useRouter();

  const handleTransition = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Check if the browser supports native view transitions
    if (!document.startViewTransition) {
      router.push(href.toString());
      return;
    }

    // Trigger a native document view transition freeze frame
    document.startViewTransition(() => {
      router.push(href.toString());
    });
  };

  return (
    /* FIXED: Wrapped props in curly braces {...props} */
    <Link href={href} onClick={handleTransition} {...props}>
      {children}
    </Link>
  );
}