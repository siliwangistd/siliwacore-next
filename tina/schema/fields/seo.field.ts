import type { TinaField } from "tinacms";

const seoFields: TinaField[] = [
  {
    type: "string",
    name: "metaTitle",
    label: "Meta Title",
    description:
      "The title that appears in the browser tab and search engine results. Keep it under 60 characters.",
  },
  {
    type: "string",
    name: "metaDescription",
    label: "Meta Description",
    ui: {
      component: "textarea",
    },
    description:
      "The short description that appears in search engine results. Keep it between 50-160 characters.",
  },
  {
    name: "keywords",
    label: "SEO Keywords",
    type: "string",
    list: true,
    description: "Relevant keywords to improve search engine visibility.",
  },
  {
    name: "canonical",
    label: "Canonical URL",
    type: "string",
    description:
      "The preferred URL for this page to prevent duplicate content issues.",
  },
  {
    name: "noindex",
    label: "Noindex",
    type: "boolean",
  },
  {
    type: "image",
    name: "ogImage",
    label: "Social Media Image (Open Graph)",
    description:
      "The image displayed when the page is shared on social media. Recommended size: 1200x630 pixels.",
  },
];

export default seoFields;
