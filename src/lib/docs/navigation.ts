export function translationSlug(slug: string, available: ReadonlySet<string>): string {
  if (available.has(slug)) return slug;

  const parts = slug.split("/");
  parts.pop();
  while (parts.length) {
    const section = parts.join("/");
    for (const index of ["index", parts.at(-1)]) {
      const candidate = `${section}/${index}`;
      if (available.has(candidate)) return candidate;
    }
    parts.pop();
  }
  if (available.has("")) return "";
  throw new Error("Documentation translation has no root page");
}
