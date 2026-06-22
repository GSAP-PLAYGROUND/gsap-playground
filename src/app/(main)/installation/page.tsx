import type { Metadata } from "next";
import InstallationPageClient from "./InstallationPageClient";

export const metadata: Metadata = {
  title: "Installation & Setup | TweenLabs",
  description:
    "Get TweenLabs running locally in under 5 minutes. Clone the repo, install dependencies with pnpm, and start copying GSAP animations into your Next.js project.",
};

export default function InstallationPage() {
  return <InstallationPageClient />;
}
