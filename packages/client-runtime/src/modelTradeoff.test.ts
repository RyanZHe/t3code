import { expect, it } from "vite-plus/test";
import { chooseModelForTradeoff } from "./modelTradeoff";

it("chooses the latest available family for each tradeoff", () => {
  const models = [
    { slug: "claude-opus-4-6" },
    { slug: "claude-haiku-5-5" },
    { slug: "claude-sonnet-5-5" },
    { slug: "claude-opus-5-5" },
    { slug: "claude-opus-6", isUnavailable: true },
    { slug: "claude-opus-7", isLegacy: true },
  ];
  expect(chooseModelForTradeoff(models, 0)?.slug).toBe("claude-haiku-5-5");
  expect(chooseModelForTradeoff(models, 1)?.slug).toBe("claude-sonnet-5-5");
  expect(chooseModelForTradeoff(models, 2)?.slug).toBe("claude-opus-5-5");
});

it("supports namespaced models and falls back to the nearest available tier", () => {
  const models = [{ slug: "openai/gpt-6-luna" }, { slug: "openai/gpt-6-astra" }];
  expect(chooseModelForTradeoff(models, 0)).toBe(models[0]);
  expect(chooseModelForTradeoff(models, 1)).toBe(models[0]);
  expect(chooseModelForTradeoff(models, 2)).toBe(models[1]);
  expect(chooseModelForTradeoff([{ slug: "custom-opus-pro" }, { slug: "default" }], 2)).toBeNull();
  expect(chooseModelForTradeoff([], 0)).toBeNull();
});
