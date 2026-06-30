import type { ProviderCategory } from "../types";
import type { PresetTheme, TemplateValueConfig } from "./claudeProviderPresets";

/**
 * omp provider model entry
 */
export interface OmpModelEntry {
  id: string;
  name?: string;
  contextWindow?: number;
  maxTokens?: number;
  input?: string[];
  reasoning?: boolean;
}

/**
 * omp provider settings config stored in settings_config
 * Written to ~/.omp/agent/models.yml providers: mapping
 */
export interface OmpProviderSettings {
  name?: string;
  baseUrl: string;
  apiKey: string;
  api: string;
  headers?: Record<string, string>;
  authHeader?: boolean;
  auth?: string;
  disableStrictTools?: boolean;
  models: OmpModelEntry[];
}

export interface OmpProviderPreset {
  name: string;
  nameKey?: string;
  websiteUrl: string;
  apiKeyUrl?: string;
  settingsConfig: OmpProviderSettings;
  isOfficial?: boolean;
  isPartner?: boolean;
  partnerPromotionKey?: string;
  category?: ProviderCategory;
  templateValues?: Record<string, TemplateValueConfig>;
  theme?: PresetTheme;
  icon?: string;
  iconColor?: string;
}

/**
 * omp API protocol options (matching omp's models.yml api values)
 */
export const ompApiOptions = [
  { value: "openai-completions", label: "OpenAI Completions" },
  { value: "openai-responses", label: "OpenAI Responses" },
  { value: "openai-codex-responses", label: "OpenAI Codex Responses" },
  { value: "anthropic-messages", label: "Anthropic Messages" },
  { value: "google-generative-ai", label: "Google Generative AI" },
] as const;

export const ompProviderPresets: OmpProviderPreset[] = [
  {
    name: "OpenRouter",
    websiteUrl: "https://openrouter.ai",
    apiKeyUrl: "https://openrouter.ai/keys",
    settingsConfig: {
      baseUrl: "https://openrouter.ai/api/v1",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      headers: {
        "HTTP-Referer": "https://cc-switch.app",
        "X-Title": "CC Switch Next",
      },
      models: [
        {
          id: "anthropic/claude-sonnet-4-6",
          name: "Claude Sonnet 4.6",
          contextWindow: 200000,
          maxTokens: 16384,
          input: ["text", "image"],
        },
        {
          id: "anthropic/claude-opus-4-8",
          name: "Claude Opus 4.8",
          contextWindow: 1000000,
          maxTokens: 128000,
          input: ["text", "image"],
        },
      ],
    },
    category: "aggregator",
    icon: "openrouter",
    iconColor: "#6566F1",
    templateValues: {
      apiKey: {
        label: "API Key",
        placeholder: "sk-or-...",
        editorValue: "",
      },
    },
  },
  {
    name: "Anthropic",
    websiteUrl: "https://www.anthropic.com",
    apiKeyUrl: "https://console.anthropic.com/settings/keys",
    settingsConfig: {
      baseUrl: "https://api.anthropic.com/v1",
      apiKey: "",
      api: "anthropic-messages",
      authHeader: true,
      models: [
        {
          id: "claude-sonnet-4-6",
          name: "Claude Sonnet 4.6",
          contextWindow: 200000,
          maxTokens: 64000,
          input: ["text", "image"],
        },
        {
          id: "claude-opus-4-8",
          name: "Claude Opus 4.8",
          contextWindow: 1000000,
          maxTokens: 128000,
          input: ["text", "image"],
        },
      ],
    },
    category: "official",
    icon: "anthropic",
    iconColor: "#D97757",
    templateValues: {
      apiKey: {
        label: "API Key",
        placeholder: "sk-ant-...",
        editorValue: "",
      },
    },
  },
  {
    name: "OpenAI",
    websiteUrl: "https://platform.openai.com",
    apiKeyUrl: "https://platform.openai.com/api-keys",
    settingsConfig: {
      baseUrl: "https://api.openai.com/v1",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "gpt-5.5",
          name: "GPT-5.5",
          contextWindow: 400000,
          maxTokens: 128000,
          input: ["text", "image"],
        },
        {
          id: "gpt-5.4",
          name: "GPT-5.4",
          contextWindow: 270000,
          maxTokens: 27000,
          input: ["text", "image"],
        },
      ],
    },
    category: "official",
    icon: "openai",
    iconColor: "#000000",
    templateValues: {
      apiKey: {
        label: "API Key",
        placeholder: "sk-...",
        editorValue: "",
      },
    },
  },
  {
    name: "DeepSeek",
    websiteUrl: "https://platform.deepseek.com",
    apiKeyUrl: "https://platform.deepseek.com/api_keys",
    settingsConfig: {
      baseUrl: "https://api.deepseek.com/v1",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "deepseek-v4-pro",
          name: "DeepSeek V4 Pro",
          contextWindow: 262144,
          maxTokens: 32768,
          input: ["text"],
        },
        {
          id: "deepseek-v4-flash",
          name: "DeepSeek V4 Flash",
          contextWindow: 262144,
          maxTokens: 32768,
          input: ["text"],
        },
      ],
    },
    category: "cn_official",
    icon: "deepseek",
    iconColor: "#1E88E5",
    templateValues: {
      apiKey: {
        label: "API Key",
        placeholder: "sk-...",
        editorValue: "",
      },
    },
  },
  {
    name: "Gemini",
    websiteUrl: "https://aistudio.google.com",
    apiKeyUrl: "https://aistudio.google.com/apikey",
    settingsConfig: {
      baseUrl: "https://generativelanguage.googleapis.com/v1beta",
      apiKey: "",
      api: "google-generative-ai",
      authHeader: false,
      models: [
        {
          id: "gemini-3.5-flash",
          name: "Gemini 3.5 Flash",
          contextWindow: 1048576,
          maxTokens: 65536,
          input: ["text", "image", "video", "audio"],
        },
        {
          id: "gemini-2.5-flash-lite",
          name: "Gemini 2.5 Flash Lite",
          contextWindow: 1048576,
          maxTokens: 65536,
          input: ["text", "image", "video", "audio"],
        },
      ],
    },
    category: "official",
    icon: "gemini",
    iconColor: "#3186FF",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "AIza...", editorValue: "" },
    },
  },
  {
    name: "Kimi",
    websiteUrl: "https://platform.kimi.com",
    apiKeyUrl: "https://platform.kimi.com/console/api-keys",
    settingsConfig: {
      baseUrl: "https://api.moonshot.cn/v1",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "kimi-k2.7-code",
          name: "Kimi K2.7 Code",
          contextWindow: 262144,
          maxTokens: 131072,
          input: ["text"],
        },
      ],
    },
    category: "cn_official",
    icon: "kimi",
    iconColor: "#6366F1",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "sk-...", editorValue: "" },
    },
  },
  {
    name: "Zhipu GLM",
    websiteUrl: "https://open.bigmodel.cn",
    apiKeyUrl: "https://www.bigmodel.cn/claude-code?ic=RRVJPB5SII",
    settingsConfig: {
      baseUrl: "https://open.bigmodel.cn/api/coding/paas/v4",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "glm-5.1",
          name: "GLM-5.1",
          contextWindow: 204800,
          maxTokens: 131072,
          input: ["text"],
        },
      ],
    },
    category: "cn_official",
    icon: "zhipu",
    iconColor: "#0F62FE",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "", editorValue: "" },
    },
  },
  {
    name: "MiniMax",
    websiteUrl: "https://platform.minimaxi.com",
    apiKeyUrl: "https://platform.minimaxi.com/subscribe/coding-plan",
    settingsConfig: {
      baseUrl: "https://api.minimaxi.com/v1",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "MiniMax-M2.7",
          name: "MiniMax M2.7",
          contextWindow: 204800,
          maxTokens: 131072,
          input: ["text"],
        },
      ],
    },
    category: "cn_official",
    icon: "minimax",
    iconColor: "#FF6B6B",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "", editorValue: "" },
    },
  },
  {
    name: "SiliconFlow",
    websiteUrl: "https://siliconflow.cn",
    apiKeyUrl: "https://cloud.siliconflow.cn/account/ak",
    settingsConfig: {
      baseUrl: "https://api.siliconflow.cn/v1",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "MiniMax-01",
          name: "MiniMax-01",
          contextWindow: 262144,
          maxTokens: 131072,
          input: ["text"],
        },
        {
          id: "Qwen/Qwen3-Coder-480B",
          name: "Qwen3 Coder 480B",
          contextWindow: 262144,
          maxTokens: 131072,
          input: ["text"],
        },
      ],
    },
    category: "aggregator",
    icon: "siliconflow",
    iconColor: "#6366F1",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "sk-...", editorValue: "" },
    },
  },
  {
    name: "NVIDIA",
    websiteUrl: "https://build.nvidia.com",
    apiKeyUrl: "https://build.nvidia.com/settings/api-keys",
    settingsConfig: {
      baseUrl: "https://integrate.api.nvidia.com/v1",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "moonshotai/kimi-k2.5",
          name: "Kimi K2.5",
          contextWindow: 131072,
          maxTokens: 32768,
          input: ["text"],
        },
      ],
    },
    category: "aggregator",
    icon: "nvidia",
    iconColor: "#000000",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "", editorValue: "" },
    },
  },
  {
    name: "Xiaomi MiMo",
    websiteUrl: "https://platform.xiaomimimo.com",
    apiKeyUrl: "https://platform.xiaomimimo.com/#/console/api-keys",
    settingsConfig: {
      baseUrl: "https://api.xiaomimimo.com/v1",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "mimo-v2.5-pro",
          name: "MiMo V2.5 Pro",
          contextWindow: 1048576,
          maxTokens: 131072,
          input: ["text"],
        },
        {
          id: "mimo-v2.5",
          name: "MiMo V2.5",
          contextWindow: 1048576,
          maxTokens: 131072,
          input: ["text", "image"],
        },
      ],
    },
    category: "cn_official",
    icon: "xiaomimimo",
    iconColor: "#000000",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "", editorValue: "" },
    },
  },
  {
    name: "StepFun",
    websiteUrl: "https://platform.stepfun.com",
    apiKeyUrl: "https://platform.stepfun.com/interface-key",
    settingsConfig: {
      baseUrl: "https://api.stepfun.com/step_plan/v1",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "step-3.5-flash",
          name: "Step 3.5 Flash",
          contextWindow: 262144,
          maxTokens: 131072,
          input: ["text"],
        },
      ],
    },
    category: "cn_official",
    icon: "stepfun",
    iconColor: "#16D6D2",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "step-...", editorValue: "" },
    },
  },
  {
    name: "Ollama",
    websiteUrl: "https://ollama.com",
    settingsConfig: {
      baseUrl: "http://127.0.0.1:11434/v1",
      apiKey: "",
      api: "openai-completions",
      auth: "none",
      models: [],
    },
    category: "custom",
    icon: "ollama",
    iconColor: "#000000",
    templateValues: {
      baseUrl: {
        label: "Base URL",
        placeholder: "http://127.0.0.1:11434/v1",
        editorValue: "http://127.0.0.1:11434/v1",
      },
    },
  },
  {
    name: "火山 Agent Plan",
    websiteUrl: "https://www.volcengine.com/product/ark",
    apiKeyUrl:
      "https://www.volcengine.com/activity/codingplan?ac=MMAP8JTTCAQ2&rc=6J6FV5N2&utm_campaign=hw&utm_content=ccswitch&utm_medium=devrel_tool_web&utm_source=OWO&utm_term=ccswitch",
    settingsConfig: {
      baseUrl: "https://ark.cn-beijing.volces.com/api/coding/v3",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "ark-code-latest",
          name: "Ark Code Latest",
          contextWindow: 256000,
          maxTokens: 131072,
          input: ["text"],
        },
      ],
    },
    category: "cn_official",
    isPartner: true,
    partnerPromotionKey: "volcengine_agentplan",
    icon: "huoshan",
    iconColor: "#3370FF",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "", editorValue: "" },
    },
  },
  {
    name: "BytePlus",
    websiteUrl: "https://www.byteplus.com/en/product/modelark",
    apiKeyUrl:
      "https://www.byteplus.com/en/product/modelark?utm_campaign=hw&utm_content=ccswitch&utm_medium=devrel_tool_web&utm_source=OWO&utm_term=ccswitch",
    settingsConfig: {
      baseUrl: "https://ark.ap-southeast.bytepluses.com/api/coding/v3",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "ark-code-latest",
          name: "Ark Code Latest",
          contextWindow: 256000,
          maxTokens: 131072,
          input: ["text"],
        },
      ],
    },
    category: "cn_official",
    isPartner: true,
    partnerPromotionKey: "byteplus",
    icon: "byteplus",
    iconColor: "#3370FF",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "", editorValue: "" },
    },
  },
  {
    name: "DouBaoSeed",
    websiteUrl: "https://www.volcengine.com/product/doubao",
    apiKeyUrl:
      "https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey?apikey=%7B%7D&utm_campaign=hw&utm_content=ccswitch&utm_medium=devrel_tool_web&utm_source=OWO&utm_term=ccswitch",
    settingsConfig: {
      baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "doubao-seed-2-1-pro-260628",
          name: "Doubao Seed 2.1 Pro",
          contextWindow: 262144,
          maxTokens: 131072,
          input: ["text"],
        },
      ],
    },
    category: "cn_official",
    isPartner: true,
    partnerPromotionKey: "doubaoseed",
    icon: "doubao",
    iconColor: "#3370FF",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "", editorValue: "" },
    },
  },
  {
    name: "Qiniu",
    nameKey: "providerForm.presets.qiniu",
    websiteUrl: "https://s.qiniu.com/nMvAvy",
    apiKeyUrl: "https://s.qiniu.com/nMvAvy",
    settingsConfig: {
      baseUrl: "https://api.qnaigc.com/bypass/openai/v1",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        { id: "gpt-5.5", name: "GPT-5.5", maxTokens: 131072, input: ["text"] },
      ],
    },
    category: "aggregator",
    isPartner: true,
    partnerPromotionKey: "qiniu",
    icon: "qiniu",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "", editorValue: "" },
    },
  },
  {
    name: "Azure OpenAI",
    websiteUrl:
      "https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/codex",
    settingsConfig: {
      baseUrl: "https://YOUR_RESOURCE_NAME.openai.azure.com/openai",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [],
    },
    category: "third_party",
    icon: "azure",
    iconColor: "#0078D4",
    templateValues: {
      baseUrl: {
        label: "Endpoint",
        placeholder: "https://YOUR_RESOURCE_NAME.openai.azure.com/openai",
        editorValue: "",
      },
      apiKey: { label: "API Key", placeholder: "", editorValue: "" },
    },
  },
  {
    name: "Zhipu GLM en",
    websiteUrl: "https://z.ai",
    apiKeyUrl: "https://z.ai/subscribe?ic=8JVLJQFSKB",
    settingsConfig: {
      baseUrl: "https://api.z.ai/api/coding/paas/v4",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "glm-5.2",
          name: "GLM-5.2",
          contextWindow: 200000,
          maxTokens: 131072,
          input: ["text"],
        },
      ],
    },
    category: "cn_official",
    icon: "zhipu",
    iconColor: "#0F62FE",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "", editorValue: "" },
    },
  },
  {
    name: "Baidu Qianfan Coding Plan",
    websiteUrl: "https://cloud.baidu.com/product/qianfan_modelbuilder",
    apiKeyUrl:
      "https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application",
    settingsConfig: {
      baseUrl: "https://qianfan.baidubce.com/v2/coding",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "qianfan-code-latest",
          name: "Qianfan Code Latest",
          contextWindow: 131072,
          maxTokens: 131072,
          input: ["text"],
        },
      ],
    },
    category: "cn_official",
    icon: "baidu",
    iconColor: "#2932E1",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "", editorValue: "" },
    },
  },
  {
    name: "Bailian",
    websiteUrl: "https://bailian.console.aliyun.com",
    apiKeyUrl: "https://bailian.console.aliyun.com/#/api-key",
    settingsConfig: {
      baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "qwen3-coder-plus",
          name: "Qwen3 Coder Plus",
          contextWindow: 1048576,
          maxTokens: 131072,
          input: ["text"],
        },
      ],
    },
    category: "cn_official",
    icon: "bailian",
    iconColor: "#624AFF",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "", editorValue: "" },
    },
  },
  {
    name: "Kimi For Coding",
    websiteUrl: "https://www.kimi.com/code/?aff=cc-switch",
    apiKeyUrl: "https://www.kimi.com/code/?aff=cc-switch",
    settingsConfig: {
      baseUrl: "https://api.kimi.com/coding/v1",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "kimi-for-coding",
          name: "Kimi For Coding",
          contextWindow: 262144,
          maxTokens: 131072,
          input: ["text"],
        },
      ],
    },
    category: "cn_official",
    partnerPromotionKey: "kimi_coding",
    icon: "kimi",
    iconColor: "#6366F1",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "", editorValue: "" },
    },
  },
  {
    name: "StepFun en",
    websiteUrl: "https://platform.stepfun.ai/step-plan",
    apiKeyUrl: "https://platform.stepfun.ai/interface-key",
    settingsConfig: {
      baseUrl: "https://api.stepfun.ai/step_plan/v1",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "step-3.5-flash",
          name: "Step 3.5 Flash",
          contextWindow: 262144,
          maxTokens: 131072,
          input: ["text"],
        },
      ],
    },
    category: "cn_official",
    icon: "stepfun",
    iconColor: "#16D6D2",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "step-...", editorValue: "" },
    },
  },
  {
    name: "ModelScope",
    websiteUrl: "https://modelscope.cn",
    apiKeyUrl: "https://modelscope.cn/my/myaccesstoken",
    settingsConfig: {
      baseUrl: "https://api-inference.modelscope.cn/v1",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "ZhipuAI/GLM-5.1",
          name: "GLM-5.1",
          contextWindow: 200000,
          maxTokens: 131072,
          input: ["text"],
        },
      ],
    },
    category: "aggregator",
    icon: "modelscope",
    iconColor: "#624AFF",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "", editorValue: "" },
    },
  },
  {
    name: "MiniMax en",
    websiteUrl: "https://platform.minimax.io",
    apiKeyUrl: "https://platform.minimax.io/subscribe/coding-plan",
    settingsConfig: {
      baseUrl: "https://api.minimax.io/v1",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "MiniMax-M3",
          name: "MiniMax-M3",
          contextWindow: 1000000,
          maxTokens: 131072,
          input: ["text"],
        },
      ],
    },
    category: "cn_official",
    partnerPromotionKey: "minimax_en",
    icon: "minimax",
    iconColor: "#FF6B6B",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "", editorValue: "" },
    },
  },
  {
    name: "BaiLing",
    websiteUrl: "https://alipaytbox.yuque.com/sxs0ba/ling/get_started",
    apiKeyUrl: "https://ling.tbox.cn/open",
    settingsConfig: {
      baseUrl: "https://api.tbox.cn/api/llm/v1",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "Ling-2.6-1T",
          name: "Ling-2.6-1T",
          contextWindow: 262144,
          maxTokens: 131072,
          input: ["text"],
        },
      ],
    },
    category: "cn_official",
    icon: "generic",
    iconColor: "#624AFF",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "", editorValue: "" },
    },
  },
  {
    name: "Xiaomi MiMo Token Plan (China)",
    websiteUrl: "https://platform.xiaomimimo.com/#/token-plan",
    apiKeyUrl: "https://platform.xiaomimimo.com/#/console/plan-manage",
    settingsConfig: {
      baseUrl: "https://token-plan-cn.xiaomimimo.com/v1",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "mimo-v2.5-pro",
          name: "MiMo V2.5 Pro",
          contextWindow: 1048576,
          maxTokens: 131072,
          input: ["text"],
        },
      ],
    },
    category: "cn_official",
    icon: "xiaomimimo",
    iconColor: "#000000",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "", editorValue: "" },
    },
  },
  {
    name: "SiliconFlow en",
    websiteUrl: "https://siliconflow.com",
    apiKeyUrl: "https://cloud.siliconflow.cn/i/YflgU2Ve",
    settingsConfig: {
      baseUrl: "https://api.siliconflow.com/v1",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "MiniMaxAI/MiniMax-M2.7",
          name: "MiniMax M2.7",
          contextWindow: 200000,
          maxTokens: 131072,
          input: ["text"],
        },
      ],
    },
    category: "aggregator",
    isPartner: true,
    partnerPromotionKey: "siliconflow",
    icon: "siliconflow",
    iconColor: "#000000",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "", editorValue: "" },
    },
  },
  {
    name: "OpenCode Go",
    websiteUrl: "https://opencode.ai/go",
    apiKeyUrl: "https://opencode.ai/go?ref=2YTRG2NGTX",
    settingsConfig: {
      baseUrl: "https://opencode.ai/zen/go/v1",
      apiKey: "",
      api: "openai-completions",
      authHeader: true,
      models: [
        {
          id: "glm-5.2",
          name: "GLM 5.2",
          contextWindow: 204800,
          maxTokens: 131072,
          input: ["text"],
        },
        {
          id: "kimi-k2.7-code",
          name: "Kimi K2.7 Code",
          contextWindow: 262144,
          maxTokens: 131072,
          input: ["text"],
        },
        {
          id: "deepseek-v4-pro",
          name: "DeepSeek V4 Pro",
          maxTokens: 131072,
          input: ["text"],
        },
      ],
    },
    category: "third_party",
    partnerPromotionKey: "opencode_go",
    icon: "opencode",
    iconColor: "#211E1E",
    templateValues: {
      apiKey: { label: "API Key", placeholder: "", editorValue: "" },
    },
  },
];

export const OMP_DEFAULT_PROVIDER_SETTINGS: OmpProviderSettings = {
  baseUrl: "",
  apiKey: "",
  api: "openai-completions",
  authHeader: false,
  models: [],
};

export const OMP_DEFAULT_CONFIG = JSON.stringify(
  OMP_DEFAULT_PROVIDER_SETTINGS,
  null,
  2,
);
