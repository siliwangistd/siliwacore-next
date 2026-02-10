import { Collection } from "tinacms";

import heroBlock from "@/tina/schema/blocks/hero.block";
import featureBlock from "@/tina/schema/blocks/feature.block";
import seoFields from "@/tina/schema/fields/seo.field";
import { slugify } from "@/lib/slugify";

const blogSchema: Collection = {
  name: "blog",
  label: "Blog Posts",
  path: "src/content/blog",
  format: "mdx",
  ui: {
    router: (props) => {
      const locale = props.document._sys.breadcrumbs[0];

      const pathPrefix: Record<string, string> = {
        en: "blog",
        id: "blog",
      };
      const prefix = pathPrefix[locale] || "blog";

      return `/${locale}/${prefix}/${props.document._sys.filename}`;
    },
    filename: {
      readonly: true,
      slugify: (values) => {
        return slugify(values.title || "");
      },
    },
  },
  fields: [
    {
      name: "draft",
      label: "Draft Mode",
      type: "boolean",
      description:
        "Enable draft mode for this page to preview unpublished changes.",
    },
    {
      name: "title",
      label: "Blog Post Title",
      type: "string",
      isTitle: true,
      required: true,
    },
    {
      type: "string",
      name: "locale",
      label: "Locale",
      required: true,
      description: "This field specifies the language for this page.",
      options: [
        { label: "English", value: "en" },
        { label: "Bahasa Indonesia", value: "id" },
      ],
    },
    {
      type: "string",
      name: "translationKey",
      label: "Translation Key",
      required: true,
    },
    {
      type: "object",
      name: "seo",
      label: "SEO Settings",
      fields: seoFields,
    },
    {
      type: "image",
      name: "coverImage",
      label: "Cover Image",
    },
    {
      type: "string",
      name: "author",
      label: "Author",
    },
    {
      type: "datetime",
      name: "publishedAt",
      label: "Published Date",
      ui: {
        dateFormat: "MMMM DD, YYYY",
      },
    },
    {
      type: "string",
      name: "tags",
      label: "Tags",
      list: true,
      description:
        "Add tags to categorize this blog post. Users can filter posts by tag.",
    },
    {
      type: "string",
      name: "excerpt",
      label: "Excerpt (for card)",
      ui: { component: "textarea" },
      description:
        "A short summary shown on the blog archive page.",
    },
    // --- Fields for the Blog Post Page itself ---
    {
      type: "object",
      name: "blocks",
      label: "Page Sections",
      list: true,
      templates: [
        heroBlock,
        featureBlock,
      ],
    },
  ],
};

export default blogSchema;
