import { describe, it, expect } from "vitest";
import { formatMoney } from "./currency";

describe("formatMoney", () => {
  it("formats SEK in sv locale", () => {
    expect(formatMoney(19900, "SEK", "sv")).toMatch(/199/);
  });
  it("formats USD in en locale", () => {
    const s = formatMoney(12900, "USD", "en");
    expect(s).toMatch(/\$?129/);
  });
});
