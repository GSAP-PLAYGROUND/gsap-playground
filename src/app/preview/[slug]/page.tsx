"use client";

import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { use, useMemo } from "react";
import { animations } from "@/data/components";

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

  // Dynamically import the component page based on slug from registry
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const Component = useMemo(
    () =>
      dynamic(
        () => import(`@/app/(main)/components/${slug}/page`),
        { ssr: false }
      ),
    [slug]
  );

  return <Component />;
}
