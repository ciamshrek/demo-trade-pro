# Agent Prompts

This directory will contain reusable prompt templates and prompt utilities for DemoTradePro agents.

## Future Structure:

```
prompts/
├── templates/
│   ├── trading-system.ts      # Trading system prompt templates
│   ├── risk-assessment.ts     # Risk assessment prompts
│   └── market-analysis.ts     # Market analysis prompts
├── utils/
│   ├── prompt-builder.ts      # Utility for building dynamic prompts
│   └── context-injection.ts   # Context injection helpers
└── constants/
    ├── personalities.ts       # Agent personality presets
    └── disclaimers.ts        # Legal/safety disclaimers
```

## Usage Examples:

```typescript
import { TradingSystemPrompt } from '@workspace/agent-utils/prompts/templates/trading-system'
import { buildPrompt } from '@workspace/agent-utils/prompts/utils/prompt-builder'

const systemPrompt = buildPrompt(TradingSystemPrompt, {
  userLevel: 'beginner',
  riskTolerance: 'conservative'
})
```
