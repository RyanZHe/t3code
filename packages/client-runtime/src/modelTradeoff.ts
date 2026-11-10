export type ModelTradeoff = 0 | 1 | 2;

type TradeoffModel = {
  readonly slug: string;
  readonly isLegacy?: boolean | undefined;
  readonly isUnavailable?: boolean | undefined;
};

// Catalogs have no performance scores; only recognized model families participate.
export function getModelTradeoff(slug: string): ModelTradeoff | null {
  const id = slug.toLowerCase().split("/").at(-1) ?? "";
  if (/^claude-haiku-|^gpt-.*-(luna|mini|nano|spark)(-|$)|^gemini-.*flash/.test(id)) return 0;
  if (/^claude-sonnet-|^gpt-.*-(sol|terra)(-|$)/.test(id)) return 1;
  if (/^claude-opus-|^gpt-.*-astra(-|$)|^gemini-.*pro/.test(id)) return 2;
  return null;
}

export function chooseModelForTradeoff<T extends TradeoffModel>(
  models: ReadonlyArray<T>,
  tradeoff: ModelTradeoff,
): T | null {
  const ranked = models.flatMap((model) => {
    const tier = getModelTradeoff(model.slug);
    return tier === null || model.isLegacy || model.isUnavailable ? [] : [{ model, tier }];
  });
  ranked.sort(
    (a, b) =>
      Math.abs(a.tier - tradeoff) - Math.abs(b.tier - tradeoff) ||
      a.tier - b.tier ||
      b.model.slug.localeCompare(a.model.slug, "en", { numeric: true }),
  );
  return ranked[0]?.model ?? null;
}
