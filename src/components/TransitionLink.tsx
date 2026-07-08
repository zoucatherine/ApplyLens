// src/components/TransitionLink.tsx
"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

// FIXED: Extend React.AnchorHTMLAttributes so it accepts mouse events, classNames, etc.
interface TransitionLinkProps 
  extends LinkProps, 
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
  children: ReactNode;
}

export default function TransitionLink({ href, children, ...props }: TransitionLinkProps) {
  const router = useRouter();

  const handleTransition = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (!document.startViewTransition) {
      router.push(href.toString());
      return;
    }

    document.startViewTransition(() => {
      router.push(href.toString());
    });
  };

  return (
    <Link href={href} onClick={handleTransition} {...props}>
      {children}
    </Link>
  );
}