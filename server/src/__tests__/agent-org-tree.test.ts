import { describe, expect, it } from "vitest";
import { buildOrgTree } from "../services/agents.ts";

describe("buildOrgTree", () => {
  it("treats agents with missing managers as roots", () => {
    const tree = buildOrgTree([
      {
        id: "alice",
        name: "Alice Astor",
        role: "general",
        status: "idle",
        reportsTo: "missing-ceo",
      },
    ]);

    expect(tree).toHaveLength(1);
    expect(tree[0]).toMatchObject({
      id: "alice",
      reportsTo: "missing-ceo",
      reports: [],
    });
  });

  it("keeps valid reporting chains under their manager", () => {
    const tree = buildOrgTree([
      {
        id: "ceo",
        name: "CEO",
        role: "ceo",
        status: "idle",
        reportsTo: null,
      },
      {
        id: "alice",
        name: "Alice Astor",
        role: "general",
        status: "idle",
        reportsTo: "ceo",
      },
    ]);

    expect(tree).toMatchObject([
      {
        id: "ceo",
        reports: [{ id: "alice", reports: [] }],
      },
    ]);
  });

  it("surfaces otherwise unreachable cycles as extra roots", () => {
    const tree = buildOrgTree([
      {
        id: "alice",
        name: "Alice Astor",
        role: "general",
        status: "idle",
        reportsTo: "bob",
      },
      {
        id: "bob",
        name: "Bob Builder",
        role: "general",
        status: "idle",
        reportsTo: "alice",
      },
    ]);

    expect(tree).toHaveLength(1);
    expect(tree[0]).toMatchObject({
      id: "alice",
      reports: [{ id: "bob", reports: [] }],
    });
  });
});
