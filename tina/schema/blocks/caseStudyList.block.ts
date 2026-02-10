import type { Template } from "tinacms";

const caseStudyListBlock: Template = {
  name: "caseStudyList",
  label: "Case Study List",
  fields: [
    {
      type: "string",
      name: "title",
      label: "Title",
      description: "e.g., 'Our Case Studies'",
    },
    {
      type: "rich-text",
      name: "subheadline",
      label: "Subheadline",
    },
  ],
};

export default caseStudyListBlock;
