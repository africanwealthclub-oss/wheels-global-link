import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { NewsArticle } from "@/components/news";
import { PageIntro } from "@/components/marketplace";
import { localArticles } from "@/lib/news";
import { publicNews } from "@/lib/vehicle-platform";
import image from "@/assets/awa-global.jpg";

export const Route = createFileRoute("/news/$slug")({
  head: () => ({ meta: [{ title: "News Article | AWA AUTO MALL" }] }),
  component: NewsDetailPage,
});

function NewsDetailPage() {
  const { slug } = Route.useParams();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    publicNews(slug)
      .then((data) => setArticle(Array.isArray(data) ? null : data))
      .catch(() => setArticle(localArticles.find((item) => item.slug === slug) || null))
      .finally(() => setLoading(false));
  }, [slug]);
  return (
    <>
      {article ? (
        <>
          <PageIntro
            eyebrow="AWA updates"
            title={article.title}
            copy={article.excerpt}
            image={article.cover_image || image}
          />
          <article className="section-pad">
            <div className="container-shell max-w-3xl">
              <Link
                to="/news"
                className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to news
              </Link>
              <div className="whitespace-pre-wrap text-lg leading-8 text-muted-foreground">
                {article.content || article.excerpt}
              </div>
            </div>
          </article>
        </>
      ) : (
        <section className="section-pad">
          <div className="container-shell py-20 text-center">
            <h1 className="text-4xl font-extrabold uppercase">
              {loading ? "Loading article..." : "Article unavailable"}
            </h1>
            <p className="mt-4 text-muted-foreground">
              {loading ? "" : "This news article could not be found."}
            </p>
            <Link to="/news" className="mt-8 inline-flex font-bold text-primary">
              Back to news
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
