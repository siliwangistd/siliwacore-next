import type { Template } from "tinacms";

const heroBlock: Template = {
  name: "hero",
  label: "Hero",
  fields: [
    { name: "headline", label: "Headline", type: "string", required: true },
    { name: "subheadline", label: "Subheadline", type: "rich-text" },
    { name: "image", label: "Image", type: "image" },
  ],
};

export default heroBlock;
