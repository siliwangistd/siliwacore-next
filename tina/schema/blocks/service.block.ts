import type { Template } from "tinacms";

const serviceListBlock: Template = {
  name: "serviceList",
  label: "Service List",
  fields: [
    {
      type: "string",
      name: "title",
      label: "Title",
      description: "e.g., 'Our Services'",
    },
    {
      type: "rich-text",
      name: "subheadline",
      label: "Subheadline",
    },
  ],
};

export default serviceListBlock;
