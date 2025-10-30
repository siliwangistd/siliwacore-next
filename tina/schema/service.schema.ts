import { Collection } from "tinacms";

import heroBlock from "@/tina/schema/blocks/hero.block";
import featureBlock from "@/tina/schema/blocks/feature.block";
import seoFields from "@/tina/schema/fields/seo.field";
import { slugify } from "@/lib/slugify";

const serviceSchema: Collection = {
  name: "service",
  label: "Services",
  path: "src/content/services",
  format: "mdx",
  ui: {
    router: (props) => {
      const locale = props.document._sys.breadcrumbs[0];

      const pathPrefix: Record<string, string> = {
        en: "services",
        id: "layanan",
      };
      const prefix = pathPrefix[locale] || "services";

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
      label: "Service Title",
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
      name: "icon",
      label: "Icon (for card)",
    },
    {
      type: "string",
      name: "excerpt",
      label: "Excerpt (for card)",
      ui: { component: "textarea" },
      description:
        "A short summary shown on the homepage and services archive page.",
    },
    // --- Fields for the Service Page itself ---
    {
      type: "object",
      name: "blocks",
      label: "Page Sections",
      list: true,
      templates: [
        // Add any blocks you want to use on a service page
        heroBlock,
        featureBlock,
      ],
    },
  ],
};

export default serviceSchema;
