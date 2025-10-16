import { Collection } from "tinacms";
import { heroBlock } from "@/tina/schema/blocks/hero.block";
import { featureBlock } from "@/tina/schema/blocks/feature.block";

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
  },
  fields: [
    {
      name: "title",
      label: "Title",
      type: "string",
      isTitle: true,
      required: true,
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
      ],
    },
  ],
};

export default pageSchema;
