import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { NewsCard, NewsGrid, type NewsArticle } from "@/components/news";
import { PageIntro, SectionHeading } from "@/components/marketplace";
import { localArticles } from "@/lib/news";
import { publicNews } from "@/lib/vehicle-platform";
import image from "@/assets/awa-global.jpg";

export const Route = createFileRoute("/news/")({
  head: () => ({
    meta: [
      { title: "News | AWA AUTO MALL" },
      {
        name: "description",
        content: "Read the latest vehicle sourcing and export updates from AWA AUTO MALL.",
      },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    publicNews()
      .then((data) => {
        const incoming = Array.isArray(data) ? data : [];
        setArticles(incoming.length || !import.meta.env.DEV ? incoming : localArticles);
      })
      .catch(() => setArticles(import.meta.env.DEV ? localArticles : []))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      <PageIntro
        eyebrow="AWA updates"
        title="News From The Road"
        copy="Vehicle sourcing, export guidance, and updates from our work in Guangzhou."
        image={image}
      />
      <section className="section-pad">
        <div className="container-shell">
          <SectionHeading eyebrow="Latest news" title="What We Are Learning" />
          {loading ? (
            <p className="py-16 text-center text-muted-foreground">Loading latest news...</p>
          ) : articles.length ? (
            <div>
              <div className="grid gap-10 lg:grid-cols-[1.5fr_.8fr]">
                <NewsCard article={articles[0]} />
                <aside className="border-t-2 border-primary pt-5">
                  <p className="text-xs font-bold uppercase text-primary">AWA desk</p>
                  <h2 className="mt-3 text-3xl font-extrabold uppercase">Recent Dispatches</h2>
                  <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
                    Practical notes from the sourcing, inspection, and export conversations behind
                    every vehicle search.
                  </p>
                  <div className="mt-6 grid gap-5">
                    {articles.slice(0, 5).map((article) => (
                      <Link
                        key={article.slug}
                        to="/news/$slug"
                        params={{ slug: article.slug }}
                        className="border-b border-border pb-4 transition-colors hover:text-primary"
                      >
                        <span className="text-xs text-muted-foreground">
                          {article.published_at
                            ? new Date(article.published_at).toLocaleDateString()
                            : "AWA AUTO MALL"}
                        </span>
                        <strong className="mt-1 block font-display text-xl uppercase">
                          {article.title}
                        </strong>
                      </Link>
                    ))}
                  </div>
                </aside>
              </div>
              {articles.length > 1 && (
                <div className="mt-16">
                  <SectionHeading
                    eyebrow="More from the desk"
                    title="Explore The Latest Articles"
                    copy="Useful context for making a vehicle sourcing and export decision with more confidence."
                  />
                  <NewsGrid articles={articles.slice(1)} />
                </div>
              )}
            </div>
          ) : (
            <p className="border border-border bg-secondary p-8 text-center text-muted-foreground">
              News articles will appear here soon.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
