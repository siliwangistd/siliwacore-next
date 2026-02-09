import { Collection } from "tinacms";

import { slugify } from "@/src/lib/slugify";
import heroBlock from "@/tina/schema/blocks/hero.block";
import featureBlock from "@/tina/schema/blocks/feature.block";
import seoFields from "@/tina/schema/fields/seo.field";
import serviceListBlock from "@/tina/schema/blocks/service.block";
import notFoundBlock from "@/tina/schema/blocks/notFound.block";

const pageSchema: Collection = {
  name: "page",
  label: "Pages",
  path: "src/content/pages",
  format: "mdx",
  ui: {
    router: (props) => {
      const locale = props.document._sys.breadcrumbs[0];

      // Handle the homepage, which has a slug of "home".
      if (props.document._sys.filename === "_index") {
        return `/${locale}`;
      }

      return `/${props.document._sys.breadcrumbs[0]}/${props.document._sys.filename}`;
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
      label: "Title",
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
      name: "blocks",
      label: "Page Sections",
      type: "object",
      list: true,
      templates: [
        // Add all your available blocks here
        heroBlock,
        featureBlock,
        serviceListBlock,
        notFoundBlock,
      ],
    },
  ],
};

export default pageSchema;
