import type {
  PageBlocksBlogList,
  BlogConnection,
} from "@/tina/__generated__/types";
import Image from "next/image";
import { Link } from "@/src/i18n/navigation";
import { TinaMarkdown } from "tinacms/dist/rich-text";

type BlogListBlockProps = {
  blogs?: { data: BlogConnection | null };
  activeTag?: string;
} & PageBlocksBlogList;

const BlogListBlock = (props: BlogListBlockProps) => {
  const { title, subheadline, blogs, activeTag } = props;
  const data = blogs?.data;

  // Collect all unique tags from blog posts
  const allTags: string[] = [];
  data?.edges?.forEach((edge) => {
    edge?.node?.tags?.forEach((tag) => {
      if (tag && !allTags.includes(tag)) {
        allTags.push(tag);
      }
    });
  });

  // Filter posts by active tag if present
  const filteredEdges = activeTag
    ? data?.edges?.filter((edge) =>
        edge?.node?.tags?.includes(activeTag)
      )
    : data?.edges;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        {title && (
          <h2 className="text-3xl font-bold mb-4 text-gray-900">{title}</h2>
        )}
        {subheadline && (
          <div className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            <TinaMarkdown content={subheadline} />
          </div>
        )}

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !activeTag
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </Link>
            {allTags.map((tag) => (
              <Link
                key={tag}
                href={{
                  pathname: "/blog/tag/[tag]",
                  params: { tag },
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTag === tag
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!filteredEdges || filteredEdges.length === 0 ? (
            <p className="text-gray-500">No blog posts found.</p>
          ) : (
            filteredEdges.map((edge) => {
              if (!edge?.node) {
                return null;
              }

              const blog = edge.node;
              const slug = blog._sys.filename;
              const locale = blog._sys.breadcrumbs[0];

              return (
                <Link
                  key={blog.id}
                  href={{
                    pathname: "/blog/[slug]",
                    params: { slug },
                  }}
                  className="block p-6 bg-white rounded-lg shadow-lg text-left hover:shadow-xl transition-shadow duration-300"
                  locale={locale}
                >
                  {blog.coverImage && (
                    <Image
                      src={blog.coverImage}
                      alt={`${blog.title} cover`}
                      width={400}
                      height={225}
                      className="mb-4 rounded-md w-full h-48 object-cover"
                    />
                  )}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {blog.tags.map((tag) =>
                        tag ? (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ) : null
                      )}
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {blog.title}
                  </h3>
                  {blog.publishedAt && (
                    <p className="text-sm text-gray-400 mb-1">
                      {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                  {blog.author && (
                    <p className="text-sm text-gray-500 mb-2">
                      By {blog.author}
                    </p>
                  )}
                  <p className="text-gray-600">{blog.excerpt}</p>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogListBlock;
