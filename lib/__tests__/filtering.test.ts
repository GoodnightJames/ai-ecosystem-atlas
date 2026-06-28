import { describe, it, expect } from "vitest";
import { models } from "@/data";
import {
  applyFilters,
  EMPTY_FILTERS,
  matchesFilters,
  searchModels,
  sortModels,
} from "@/lib/filtering";

describe("matchesFilters", () => {
  const sol = models.find((m) => m.id === "openai-gpt-5-6-sol")!;

  it("empty filters match everything", () => {
    expect(matchesFilters(sol, EMPTY_FILTERS)).toBe(true);
  });
  it("lab filter narrows correctly", () => {
    expect(matchesFilters(sol, { ...EMPTY_FILTERS, labs: ["openai"] })).toBe(true);
    expect(matchesFilters(sol, { ...EMPTY_FILTERS, labs: ["google"] })).toBe(false);
  });
  it("status filter narrows correctly", () => {
    expect(matchesFilters(sol, { ...EMPTY_FILTERS, statuses: ["restricted"] })).toBe(true);
    expect(matchesFilters(sol, { ...EMPTY_FILTERS, statuses: ["ga"] })).toBe(false);
  });
});

describe("searchModels", () => {
  it("finds by name fragment", () => {
    expect(searchModels(models, "opus").length).toBeGreaterThan(0);
  });
  it("finds by highlight/summary content", () => {
    expect(searchModels(models, "Rosalind Franklin").length).toBeGreaterThan(0);
  });
  it("empty query returns all", () => {
    expect(searchModels(models, "  ").length).toBe(models.length);
  });
});

describe("sortModels", () => {
  it("price-low puts the cheapest published price first", () => {
    const priced = sortModels(
      models.filter((m) => m.pricing?.inputPerMTok != null),
      "price-low",
    );
    const prices = priced.map((m) => m.pricing!.inputPerMTok!);
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });
  it("release-newest is descending by date", () => {
    const out = sortModels(models, "release-newest");
    for (let i = 1; i < out.length; i++) {
      expect(out[i - 1].releaseDate >= out[i].releaseDate).toBe(true);
    }
  });
});

describe("applyFilters composition", () => {
  it("filters, searches, and sorts together", () => {
    const out = applyFilters(
      models,
      { ...EMPTY_FILTERS, labs: ["openai"], query: "GPT-5.6" },
      "name",
    );
    expect(out.length).toBe(3); // Sol, Terra, Luna
    expect(out.every((m) => m.labId === "openai")).toBe(true);
  });
});
