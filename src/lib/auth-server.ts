import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

export const {
  handler,
  preloadAuthQuery,
  isAuthenticated,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction,
} = convexBetterAuthNextJs({
  convexUrl:
    process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder.convex.cloud",
  convexSiteUrl:
    process.env.NEXT_PUBLIC_CONVEX_SITE_URL ||
    "https://placeholder.convex.site",
});
