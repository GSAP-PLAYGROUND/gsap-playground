"use client";

import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { use } from "react";
import { animations } from "@/data/components";

// Cache dynamic components at module level to avoid creating them during render
const dynamicComponentCache = new Map<string, ReturnType<typeof dynamic>>();

function getDynamicComponent(slug: string) {
  if (!dynamicComponentCache.has(slug)) {
    dynamicComponentCache.set(
      slug,
      dynamic(
        () => import(`@/app/(main)/components/${slug}/page`),
        { ssr: false }
      )
    );
  }
  return dynamicComponentCache.get(slug)!;
}

// Separate component that renders the dynamic import — declared at module level
// so `Component` is not flagged as "created during render" of PreviewPage.
function DynamicRenderer({ slug }: { slug: string }) {
  // eslint-disable-next-line react-hooks/static-components -- Component is cached at module level via Map, not recreated each render
  const Component = getDynamicComponent(slug);
  return <Component />;
}

export default function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  // Validate slug exists in the components registry
  const component = animations.find((a) => a.componentName === slug);
  if (!component) {
    notFound();
  }

  return <DynamicRenderer slug={slug} />;
}
