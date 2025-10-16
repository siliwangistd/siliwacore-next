import type { Template } from "tinacms";

export const featureBlock: Template = {
  name: "featureList",
  label: "Feature List",
  fields: [
    { name: "title", label: "Title", type: "string" },
    {
      name: "features",
      label: "Features",
      type: "object",
      list: true,
      fields: [
        { name: "icon", label: "Icon", type: "image" },
        { name: "title", label: "Feature Title", type: "string" },
        { name: "description", label: "Description", type: "string" },
      ],
    },
  ],
};
