export const slugify = (str: string) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes
};
