import { useTranslation } from "react-i18next";
import { useState, useRef, type ReactNode } from "react";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { ApiKeySection } from "./shared";
import {
  fetchModelsForConfig,
  showFetchModelsError,
} from "@/lib/api/model-fetch";
import { ompApiOptions, type OmpModelEntry } from "@/config/ompProviderPresets";
import type { ProviderCategory } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";

interface OmpFormFieldsProps {
  baseUrl: string;
  onBaseUrlChange: (value: string) => void;
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  category?: ProviderCategory;
  shouldShowApiKeyLink: boolean;
  websiteUrl: string;
  isPartner?: boolean;
  partnerPromotionKey?: string;
  api: string;
  onApiChange: (value: string) => void;
  authHeader: boolean;
  onAuthHeaderChange: (value: boolean) => void;
  models: OmpModelEntry[];
  onModelsChange: (models: OmpModelEntry[]) => void;
}

interface AdvancedSectionProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  labelKey: string;
  children: ReactNode;
}

function AdvancedSection({
  open,
  onOpenChange,
  labelKey,
  children,
}: AdvancedSectionProps) {
  const { t } = useTranslation();
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          {open ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
          {t(labelKey)}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pt-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function OmpFormFields({
  baseUrl,
  onBaseUrlChange,
  apiKey,
  onApiKeyChange,
  category,
  shouldShowApiKeyLink,
  websiteUrl,
  isPartner,
  partnerPromotionKey,
  api,
  onApiChange,
  authHeader,
  onAuthHeaderChange,
  models,
  onModelsChange,
}: OmpFormFieldsProps) {
  const { t } = useTranslation();
  const [expandedModels, setExpandedModels] = useState<Record<number, boolean>>(
    {},
  );
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [providerAdvancedOpen, setProviderAdvancedOpen] = useState(false);

  const modelKeysRef = useRef<string[]>([]);
  while (modelKeysRef.current.length < models.length) {
    modelKeysRef.current.push(crypto.randomUUID());
  }
  if (modelKeysRef.current.length > models.length) {
    modelKeysRef.current.length = models.length;
  }
  const modelKeys = modelKeysRef.current;

  const toggleModelAdvanced = (index: number) => {
    setExpandedModels((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAddModel = () => {
    modelKeysRef.current.push(crypto.randomUUID());
    onModelsChange([
      ...models,
      { id: "", name: "", contextWindow: undefined, maxTokens: undefined, input: ["text"] },
    ]);
  };

  const handleFetchModels = () => {
    if (!baseUrl || !apiKey) {
      showFetchModelsError(null, t, {
        hasApiKey: !!apiKey,
        hasBaseUrl: !!baseUrl,
      });
      return;
    }
    setIsFetchingModels(true);
    fetchModelsForConfig(baseUrl, apiKey)
      .then((fetched) => {
        if (fetched.length === 0) {
          toast.info(t("providerForm.fetchModelsEmpty"));
        } else {
          toast.success(
            t("providerForm.fetchModelsSuccess", { count: fetched.length }),
          );
        }
      })
      .catch((err) => {
        console.warn("[ModelFetch] Failed:", err);
        showFetchModelsError(err, t);
      })
      .finally(() => setIsFetchingModels(false));
  };

  const handleRemoveModel = (index: number) => {
    modelKeysRef.current.splice(index, 1);
    const next = [...models];
    next.splice(index, 1);
    onModelsChange(next);
    setExpandedModels((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  const handleModelChange = (
    index: number,
    field: keyof OmpModelEntry,
    value: unknown,
  ) => {
    const next = [...models];
    next[index] = { ...next[index], [field]: value };
    onModelsChange(next);
  };

  return (
    <>
      <div className="space-y-2">
        <FormLabel htmlFor="omp-api-mode">
          {t("omp.form.apiMode")}
        </FormLabel>
        <Select value={api} onValueChange={onApiChange}>
          <SelectTrigger id="omp-api-mode" className="w-full">
            <SelectValue
              placeholder={t("omp.form.selectApi")}
            />
          </SelectTrigger>
          <SelectContent>
            {ompApiOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="omp-base-url">
          {t("omp.form.baseUrl")}
        </FormLabel>
        <Input
          id="omp-base-url"
          value={baseUrl}
          onChange={(e) => onBaseUrlChange(e.target.value)}
          placeholder={t("omp.form.baseUrlPlaceholder")}
        />
      </div>

      <ApiKeySection
        label={t("omp.form.apiKey")}
        value={apiKey}
        onChange={onApiKeyChange}
        category={category}
        shouldShowLink={shouldShowApiKeyLink}
        websiteUrl={websiteUrl}
        isPartner={isPartner}
        partnerPromotionKey={partnerPromotionKey}
      />

      <AdvancedSection
        open={providerAdvancedOpen}
        onOpenChange={setProviderAdvancedOpen}
        labelKey="omp.form.providerAdvanced"
      >
        <div className="flex items-center gap-2">
          <Checkbox
            id="omp-auth-header"
            checked={authHeader}
            onCheckedChange={(checked) =>
              onAuthHeaderChange(checked === true)
            }
          />
          <FormLabel htmlFor="omp-auth-header" className="cursor-pointer">
            {t("omp.form.authHeader")}
          </FormLabel>
        </div>
      </AdvancedSection>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <FormLabel>
            {t("omp.form.models")}
          </FormLabel>
          <div className="flex gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFetchModels}
              disabled={isFetchingModels}
            >
              {isFetchingModels ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : null}
              {t("omp.form.fetchModels")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddModel}
            >
              <Plus className="mr-1 h-3 w-3" />
              {t("omp.form.addModel")}
            </Button>
          </div>
        </div>

        {models.length === 0 && (
          <p className="text-xs text-muted-foreground py-2">
            {t("omp.form.noModels")}
          </p>
        )}

        {models.map((model, index) => (
          <Collapsible
            key={modelKeys[index] ?? index}
            open={expandedModels[index] ?? false}
            onOpenChange={() => toggleModelAdvanced(index)}
          >
            <div className="flex items-center gap-2 rounded-md border p-2">
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0"
                >
                  {expandedModels[index] ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <Input
                className="h-7 flex-1 text-xs"
                placeholder={t("omp.form.modelIdPlaceholder")}
                value={model.id}
                onChange={(e) =>
                  handleModelChange(index, "id", e.target.value)
                }
              />
              <Input
                className="h-7 w-1/3 text-xs"
                placeholder={t("omp.form.modelNamePlaceholder")}
                value={model.name ?? ""}
                onChange={(e) =>
                  handleModelChange(index, "name", e.target.value || undefined)
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                onClick={() => handleRemoveModel(index)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <CollapsibleContent className="space-y-2 pt-2 pl-7">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <FormLabel className="text-xs">
                    {t("omp.form.contextWindow")}
                  </FormLabel>
                  <Input
                    className="h-7 text-xs"
                    type="number"
                    placeholder="128000"
                    value={model.contextWindow ?? ""}
                    onChange={(e) =>
                      handleModelChange(
                        index,
                        "contextWindow",
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                  />
                </div>
                <div>
                  <FormLabel className="text-xs">
                    {t("omp.form.maxTokens")}
                  </FormLabel>
                  <Input
                    className="h-7 text-xs"
                    type="number"
                    placeholder="16384"
                    value={model.maxTokens ?? ""}
                    onChange={(e) =>
                      handleModelChange(
                        index,
                        "maxTokens",
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </>
  );
}
