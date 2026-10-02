import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AWA AUTO MALL | Cars from China" },
      {
        name: "description",
        content: "Source quality cars globally with AWA AUTO MALL in Guangzhou, China.",
      },
      { property: "og:title", content: "AWA AUTO MALL | Cars from China" },
      {
        property: "og:description",
        content: "Quality vehicles sourced in China and supplied globally.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});
