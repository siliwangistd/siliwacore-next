import type { Template } from "tinacms";

const blogListBlock: Template = {
  name: "blogList",
  label: "Blog List",
  fields: [
    {
      type: "string",
      name: "title",
      label: "Title",
      description: "e.g., 'Latest Blog Posts'",
    },
    {
      type: "rich-text",
      name: "subheadline",
      label: "Subheadline",
    },
  ],
};

export default blogListBlock;
