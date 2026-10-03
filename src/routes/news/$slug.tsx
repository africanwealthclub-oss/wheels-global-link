import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { NewsArticle } from "@/components/news";
import { PageIntro } from "@/components/marketplace";
import { localArticles } from "@/lib/news";
import { publicNews } from "@/lib/vehicle-platform";
import image from "@/assets/awa-global.jpg";

export const Route = createFileRoute("/news/$slug")({
  head: () => ({ meta: [{ title: "News Article | AWA AUTO MALL" }] }),
  component: NewsDetailPage,
});

// True when the content contains real HTML tags (our SQL articles do)
const looksLikeHtml = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value);

// Tailwind-only typography (no @tailwindcss/typography plugin needed)
const articleStyles = [
  "text-[1.05rem] leading-8 text-muted-foreground",
  "[&_p]:mb-5",
  "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:leading-tight [&_h2]:text-foreground",
  "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-foreground",
  "[&_strong]:font-bold [&_strong]:text-foreground",
  "[&_em]:italic",
  "[&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:opacity-80",
  "[&_ul]:mb-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6",
  "[&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6",
  "[&_li]:pl-1 [&_li::marker]:text-primary",
  "[&_blockquote]:my-6 [&_blockquote]:rounded-r-lg [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-muted/50 [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:italic",
  // Tables: scroll sideways on small screens instead of breaking the layout
  "[&_table]:my-8 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_table]:text-left [&_table]:text-sm",
  "[&_thead]:bg-muted",
  "[&_th]:whitespace-nowrap [&_th]:border [&_th]:border-border [&_th]:px-4 [&_th]:py-3 [&_th]:font-bold [&_th]:text-foreground",
  "[&_td]:min-w-[140px] [&_td]:border [&_td]:border-border [&_td]:px-4 [&_td]:py-3 [&_td]:align-top",
  "[&_tbody_tr:nth-child(even)]:bg-muted/40",
  "[&>*:first-child]:mt-0",
].join(" ");

function NewsDetailPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    publicNews(slug)
      .then((data) => setArticle(Array.isArray(data) ? null : data))
      .catch(() => setArticle(localArticles.find((item) => item.slug === slug) || null))
      .finally(() => setLoading(false));
  }, [slug]);

  const body = article?.content || article?.excerpt || "";
  const isHtml = looksLikeHtml(body);

  // Sanitize before rendering so database content can never inject scripts
  const safeHtml = useMemo(() => {
    if (!isHtml || typeof window === "undefined") return "";
    return DOMPurify.sanitize(body, { USE_PROFILES: { html: true } });
  }, [body, isHtml]);

  // Make internal links (/request-vehicle, /cars, /contact...) navigate
  // without a full page reload
  const handleContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (event.target as HTMLElement).closest("a");
    const href = anchor?.getAttribute("href");
    if (anchor && href && href.startsWith("/") && !href.startsWith("//")) {
      event.preventDefault();
      navigate({ to: href });
    }
  };

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

              {isHtml ? (
                <div
                  className={articleStyles}
                  onClick={handleContentClick}
                  dangerouslySetInnerHTML={{ __html: safeHtml }}
                />
              ) : (
                // Plain-text articles (e.g. localArticles) keep the old behaviour
                <div className="whitespace-pre-wrap text-lg leading-8 text-muted-foreground">
                  {body}
                </div>
              )}

              <div className="mt-14 rounded-2xl border border-border bg-muted/40 p-8 text-center">
                <h2 className="text-2xl font-extrabold uppercase">
                  Looking for a vehicle from Guangzhou?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                  Tell us what you need and we will turn it into a practical sourcing plan.
                </p>
                <Link
                  to="/request-vehicle"
                  className="mt-6 inline-flex rounded-md bg-primary px-6 py-3 font-bold text-primary-foreground"
                >
                  Request a Vehicle
                </Link>
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
