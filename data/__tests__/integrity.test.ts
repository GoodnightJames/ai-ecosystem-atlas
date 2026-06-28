import { describe, it, expect } from "vitest";
import {
  ecosystem,
  getModel,
  labs,
  models,
  timeline,
} from "@/data";
import {
  CONFIDENCES,
  KINDS,
  LAB_IDS,
  MODALITIES,
  STATUSES,
  TIERS,
  EVENT_KINDS,
} from "@/data/types";

const SNAPSHOT = "2026-06-28"; // catalogue date; nothing should be "verified" after this

describe("ids", () => {
  it("model ids are unique", () => {
    const ids = models.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("ecosystem ids are unique", () => {
    const ids = ecosystem.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("timeline ids are unique", () => {
    const ids = timeline.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("ids do not collide across models and ecosystem", () => {
    const all = [...models.map((m) => m.id), ...ecosystem.map((e) => e.id)];
    expect(new Set(all).size).toBe(all.length);
  });
});

describe("enum membership", () => {
  it("models use valid enum values", () => {
    for (const m of models) {
      expect(LAB_IDS).toContain(m.labId);
      expect(STATUSES).toContain(m.status);
      expect(TIERS).toContain(m.tier);
      expect(KINDS).toContain(m.kind);
      for (const mod of m.modalities) expect(MODALITIES).toContain(mod);
      expect(CONFIDENCES).toContain(m.provenance.confidence);
    }
  });
  it("labs use valid ids", () => {
    for (const l of labs) expect(LAB_IDS).toContain(l.id);
  });
  it("timeline events use valid kinds", () => {
    for (const e of timeline) expect(EVENT_KINDS).toContain(e.kind);
  });
});

describe("required fields", () => {
  it("every model has the core fields populated", () => {
    for (const m of models) {
      expect(m.name.length).toBeGreaterThan(0);
      expect(m.summary.length).toBeGreaterThan(0);
      expect(m.highlights.length).toBeGreaterThan(0);
      expect(m.releaseDate.length).toBeGreaterThan(0);
      expect(m.provenance.sourceUrl).toMatch(/^https?:\/\//);
      expect(m.provenance.lastVerified.length).toBe(10);
    }
  });
});

describe("date sanity", () => {
  const isISO = (d: string) => /^\d{4}(-\d{2}){0,2}$/.test(d);
  it("release dates parse and lastVerified isn't in the future", () => {
    for (const m of models) {
      expect(isISO(m.releaseDate)).toBe(true);
      expect(m.provenance.lastVerified <= SNAPSHOT).toBe(true);
      if (m.retiredDate) expect(isISO(m.retiredDate)).toBe(true);
    }
  });
  it("timeline dates are full ISO and parseable", () => {
    for (const e of timeline) {
      expect(/^\d{4}-\d{2}-\d{2}$/.test(e.date)).toBe(true);
      expect(Number.isNaN(Date.parse(e.date))).toBe(false);
    }
  });
});

describe("referential integrity", () => {
  it("supersedes / routesTo point at real models", () => {
    for (const m of models) {
      if (m.supersedes) expect(getModel(m.supersedes)).toBeDefined();
      if (m.routesTo) expect(getModel(m.routesTo)).toBeDefined();
    }
  });
  it("timeline relatedModelIds resolve to a model or ecosystem entry", () => {
    const known = new Set([
      ...models.map((m) => m.id),
      ...ecosystem.map((e) => e.id),
    ]);
    for (const e of timeline) {
      for (const id of e.relatedModelIds) {
        expect(known.has(id), `${e.id} → ${id}`).toBe(true);
      }
    }
  });
});

describe("pricing", () => {
  it("any published price is non-negative", () => {
    for (const m of models) {
      const p = m.pricing;
      if (!p) continue;
      if (p.inputPerMTok != null) expect(p.inputPerMTok).toBeGreaterThanOrEqual(0);
      if (p.outputPerMTok != null) expect(p.outputPerMTok).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("coverage smell test", () => {
  it("every lab has at least one model", () => {
    for (const id of LAB_IDS) {
      expect(models.some((m) => m.labId === id)).toBe(true);
    }
  });
  it("the June 2026 restriction story is encoded", () => {
    expect(getModel("anthropic-fable-5")?.status).toBe("suspended");
    expect(getModel("anthropic-mythos-5")?.status).toBe("suspended");
    expect(getModel("openai-gpt-5-6-sol")?.status).toBe("restricted");
    expect(getModel("openai-gpt-5-6-terra")?.status).toBe("restricted");
    expect(getModel("openai-gpt-5-6-luna")?.status).toBe("restricted");
  });
  it("each lab has exactly one flagship", () => {
    for (const id of LAB_IDS) {
      const flagships = models.filter((m) => m.labId === id && m.flagship);
      expect(flagships.length, `${id} flagship count`).toBe(1);
    }
  });
});
