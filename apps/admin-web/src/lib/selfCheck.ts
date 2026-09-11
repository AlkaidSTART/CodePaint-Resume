function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

// Self-check for applicant filtering & sorting logic
export interface Candidate {
  id: string;
  name: string;
  roleSlug: string;
  score: number;
}

export function filterCandidates(
  candidates: Candidate[],
  search: string,
  roleFilter: string,
  sortBy: "score" | "date"
): Candidate[] {
  const filtered = candidates.filter((c) => {
    const matchesSearch = !search || c.name.includes(search);
    const matchesRole = roleFilter === "all" || c.roleSlug === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (sortBy === "score") {
    filtered.sort((a, b) => b.score - a.score);
  }
  return filtered;
}

const testCandidates: Candidate[] = [
  { id: "1", name: "张三", roleSlug: "frontend", score: 80 },
  { id: "2", name: "李四", roleSlug: "ui-ux", score: 95 },
  { id: "3", name: "王五", roleSlug: "frontend", score: 90 },
];

// Test 1: Role filter
const frontendOnly = filterCandidates(testCandidates, "", "frontend", "score");
assert(frontendOnly.length === 2, "frontendOnly length should be 2");
assert(frontendOnly[0].name === "王五", "first candidate should be highest score");

// Test 2: Search filter
const searchResult = filterCandidates(testCandidates, "李四", "all", "score");
assert(searchResult.length === 1, "searchResult length should be 1");
assert(searchResult[0].name === "李四", "searchResult should be 李四");

console.log("Candidate logic assertions passed successfully.");
