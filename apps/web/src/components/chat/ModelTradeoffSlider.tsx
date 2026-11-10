import { useState } from "react";
import {
  chooseModelForTradeoff,
  getModelTradeoff,
  type ModelTradeoff,
} from "@t3tools/client-runtime/model-tradeoff";
import type { ProviderInstanceId } from "@t3tools/contracts";
import { Button } from "../ui/button";

const LABELS = ["Faster", "Balanced", "Higher quality"] as const;

export function ModelTradeoffSlider(props: {
  models: ReadonlyArray<{
    slug: string;
    name: string;
    instanceId: ProviderInstanceId;
    isLegacy?: boolean | undefined;
    isUnavailable?: boolean | undefined;
  }>;
  activeModel: string;
  onSelect: (instanceId: ProviderInstanceId, model: string) => void;
}) {
  const [tradeoff, setTradeoff] = useState<ModelTradeoff>(
    () => getModelTradeoff(props.activeModel) ?? 1,
  );
  const model = chooseModelForTradeoff(props.models, tradeoff);
  return (
    <div className="flex min-h-48 flex-1 flex-col justify-center gap-4 p-4">
      <div className="text-center">
        <p className="text-sm font-medium">{LABELS[tradeoff]}</p>
        <p className="mt-1 text-xs text-muted-foreground" aria-live="polite">
          {model?.name ?? "Choose a model manually for this provider"}
        </p>
      </div>
      <div>
        <input
          type="range"
          min={0}
          max={2}
          step={1}
          value={tradeoff}
          aria-label="Model speed and quality"
          aria-valuetext={`${LABELS[tradeoff]}${model ? `: ${model.name}` : ""}`}
          disabled={!model}
          className="h-8 w-full cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-default disabled:opacity-50"
          onKeyDown={(event) => {
            if (
              ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)
            ) {
              event.stopPropagation();
            }
          }}
          onChange={(event) => {
            const value = Number(event.currentTarget.value);
            if (value === 0 || value === 1 || value === 2) setTradeoff(value);
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
          <span>Speed</span>
          <span>Quality</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Suggested by model family. Actual speed and quality vary.
      </p>
      <Button
        size="sm"
        disabled={!model}
        onClick={() => {
          if (model) props.onSelect(model.instanceId, model.slug);
        }}
      >
        Use model
      </Button>
    </div>
  );
}
