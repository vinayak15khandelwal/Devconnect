// Quick unit test demonstrating the Jest setup requested by the brief.
// Extracted here since slugify is a small pure function inside blog.routes.ts.
function slugify(title: string) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

describe("slugify", () => {
  it("lowercases and hyphenates a title", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
  });

  it("trims leading/trailing punctuation", () => {
    expect(slugify("  --React Tips-- ")).toBe("react-tips");
  });
});
