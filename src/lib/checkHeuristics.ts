export const checkHeuristics = (query: string, keywords: string[]) => {
  const q = query.toLowerCase();
  const words = q.split(/\s+/);
  return keywords.some((kw) => {
    if (kw.includes(" ")) {
      return q.includes(kw);
    } else return words.includes(kw);
  });
};
