import { getBlogPosts } from "@/lib/blog";

import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import type { Metadata } from "next/types";
import { Suspense } from "react";
import { getNumberOfViews } from "./queries";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read my thoughts on software development and more.",
};

export default function Page() {
  return (
    <section className="space-y-4">
      <BlogPosts />
    </section>
  );
}

function BlogPosts() {
  const allBlogs = getBlogPosts();
  return (
    <>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1;
          }
          return 1;
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="mb-4 flex flex-col space-y-1"
            href={`/blog/${post.slug}`}
          >
            <div className="flex w-full flex-col">
              <p
                className="text-foreground tracking-tight"
                style={{
                  viewTransitionName: `blog-${post.slug}`,
                }}
              >
                {post.metadata.title}
              </p>
              <p className="text-muted-foreground">
                <Suspense
                  fallback={
                    <span>
                      <span className="blur-sm">100</span> views
                    </span>
                  }
                >
                  <Views slug={post.slug} />
                </Suspense>
              </p>
            </div>
          </Link>
        ))}
    </>
  );
}

async function Views({ slug }: { slug: string }) {
  noStore();
  const views = await getNumberOfViews(slug);
  return (
    <span>
      {views.toLocaleString()} view{views > 1 && "s"}
    </span>
  );
}
