import { Collection } from "tinacms";

import heroBlock from "@/tina/schema/blocks/hero.block";
import featureBlock from "@/tina/schema/blocks/feature.block";
import seoFields from "@/tina/schema/fields/seo.field";
import { slugify } from "@/lib/slugify";

const caseStudySchema: Collection = {
  name: "caseStudy",
  label: "Case Studies",
  path: "src/content/case-studies",
  format: "mdx",
  ui: {
    router: (props) => {
      const locale = props.document._sys.breadcrumbs[0];

      const pathPrefix: Record<string, string> = {
        en: "case-studies",
        id: "studi-kasus",
      };
      const prefix = pathPrefix[locale] || "case-studies";

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
      label: "Case Study Title",
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
      name: "client",
      label: "Client Name",
    },
    {
      type: "string",
      name: "industry",
      label: "Industry",
    },
    {
      type: "string",
      name: "excerpt",
      label: "Excerpt (for card)",
      ui: { component: "textarea" },
      description:
        "A short summary shown on the case studies archive page.",
    },
    // --- Fields for the Case Study Page itself ---
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

export default caseStudySchema;
