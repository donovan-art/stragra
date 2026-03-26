# STRAGRA REPO STRUCTURE - For Claude Code Generation

**Repository:** `donovan-art/stragra`  
**PAT:** `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`

---

## 📁 Complete Directory Structure

```
stragra/
├── apps/
│   ├── web/                    # Next.js 14 frontend
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.ts
│   │   ├── next-env.d.ts
│   │   └── src/
│   │       ├── app/
│   │       │   ├── files/page.tsx
│   │       │   ├── layout.tsx
│   │       │   ├── page.tsx
│   │       │   └── providers.tsx
│   │       └── ...
│   │
│   └── backend/                # Python FastAPI backend
│       └── src/
│           ├── main.py
│           └── routers/
│               ├── __init__.py
│               └── documents.py
│
├── packages/
│   ├── core/                   # Prisma + database
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── src/
│   │       └── index.ts
│   │
│   ├── file-explorer/          # File management UI package
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── components/
│   │       │   ├── FileExplorer.tsx
│   │       │   ├── FilePreview.tsx
│   │       │   ├── ShareModal.tsx
│   │       │   └── UploadModal.tsx
│   │       ├── lib/
│   │       │   └── api.ts
│   │       ├── types/
│   │       │   └── index.ts
│   │       └── index.ts
│   │
│   ├── ui/                     # Shared UI components
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       └── index.ts
│   │
│   └── tsconfig/               # Shared TS configs
│       ├── base.json
│       ├── nextjs.json
│       └── package.json
│
├── package.json                # Root package.json
├── pnpm-workspace.yaml         # Workspace definition
├── turbo.json                  # Turbo pipeline config
└── README.md
```

---

## 📦 Package Dependencies

### Root (`stragra/package.json`)
```json
{
  "name": "stragra",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "db:generate": "turbo run db:generate",
    "db:migrate": "turbo run db:migrate",
    "format": "prettier --write \"**/*.{ts,tsx,md}\""
  },
  "devDependencies": {
    "prettier": "^3.1.1",
    "turbo": "^1.11.2"
  },
  "packageManager": "pnpm@8.9.0"
}
```

### @stragra/web (`apps/web/package.json`)
```json
{
  "name": "@stragra/web",
  "dependencies": {
    "@stragra/file-explorer": "workspace:*",
    "@stragra/core": "workspace:*",
    "@stragra/ui": "workspace:*",
    "@supabase/supabase-js": "^2.39.0",
    "@tanstack/react-query": "^5.17.0",
    "lucide-react": "^0.294.0",
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-dropzone": "^14.2.3",
    "tailwindcss": "^3.3.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.10.6",
    "@types/react": "^18.2.46",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "typescript": "^5.3.3"
  }
}
```

### @stragra/core (`packages/core/package.json`)
```json
{
  "name": "@stragra/core",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "@prisma/client": "^5.7.1"
  },
  "devDependencies": {
    "prisma": "^5.7.1",
    "typescript": "^5.3.3"
  }
}
```

### @stragra/ui (`packages/ui/package.json`)
```json
{
  "name": "@stragra/ui",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0"
  },
  "peerDependencies": {
    "react": "^18.2.0"
  }
}
```

### @stragra/file-explorer (`packages/file-explorer/package.json`)
```json
{
  "name": "@stragra/file-explorer",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "@stragra/core": "workspace:*",
    "@stragra/ui": "workspace:*",
    "@tanstack/react-query": "^5.17.0",
    "axios": "^1.6.5",
    "lucide-react": "^0.294.0",
    "react-dropzone": "^14.2.3"
  },
  "peerDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

---

## ⚙️ Workspace Configuration

### `pnpm-workspace.yaml`
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "globalEnv": ["NODE_ENV", "SUPABASE_URL", "SUPABASE_SERVICE_KEY", "APP_URL"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "db:generate": { "cache": false },
    "db:migrate": { "cache": false, "dependsOn": ["db:generate"] }
  }
}
```

---

## 🔧 Tech Stack Summary

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | Next.js | 14.0.4 |
| **Frontend** | React | ^18.2.0 |
| **Frontend** | TypeScript | ^5.3.3 |
| **Frontend** | Tailwind CSS | ^3.3.0 |
| **State** | TanStack Query | ^5.17.0 |
| **Backend** | FastAPI (Python) | latest |
| **Database** | Prisma + PostgreSQL | ^5.7.1 |
| **Auth** | Supabase | ^2.39.0 |
| **Icons** | Lucide React | ^0.294.0 |
| **Validation** | Zod | ^3.22.4 |
| **Monorepo** | Turborepo | ^1.11.2 |
| **Package Mgr** | pnpm | 8.9.0 |

---

## 🎯 Where the 17 Files Should Go

Based on the list provided:

| File | Location | Package |
|------|----------|---------|
| `client-configuration.ts` | `packages/core/src/types/` | @stragra/core |
| `business-defaults.ts` | `packages/core/src/constants/` | @stragra/core |
| `blueprint-service.ts` | `packages/core/src/services/` | @stragra/core |
| `legacy-ingestion.ts` | `packages/core/src/services/` | @stragra/core |
| `WizardContainer.tsx` | `packages/onboarding-engine/src/components/` | NEW: @stragra/onboarding-engine |
| `WizardProgress.tsx` | `packages/onboarding-engine/src/components/` | NEW: @stragra/onboarding-engine |
| `WizardNavigation.tsx` | `packages/onboarding-engine/src/components/` | NEW: @stragra/onboarding-engine |
| `WelcomeStep.tsx` | `packages/onboarding-engine/src/components/steps/` | NEW: @stragra/onboarding-engine |
| `ModuleSelectionStep.tsx` | `packages/onboarding-engine/src/components/steps/` | NEW: @stragra/onboarding-engine |
| `EntityFormationStep.tsx` | `packages/onboarding-engine/src/components/steps/` | NEW: @stragra/onboarding-engine |
| `EntityVerificationStep.tsx` | `packages/onboarding-engine/src/components/steps/` | NEW: @stragra/onboarding-engine |
| `AIComplianceStep.tsx` | `packages/onboarding-engine/src/components/steps/` | NEW: @stragra/onboarding-engine |
| `BrandingStep.tsx` | `packages/onboarding-engine/src/components/steps/` | NEW: @stragra/onboarding-engine |
| `WebsiteStep.tsx` | `packages/onboarding-engine/src/components/steps/` | NEW: @stragra/onboarding-engine |
| `BankingStep.tsx` | `packages/onboarding-engine/src/components/steps/` | NEW: @stragra/onboarding-engine |
| `TeamStep.tsx` | `packages/onboarding-engine/src/components/steps/` | NEW: @stragra/onboarding-engine |
| `LegacyMigrationStep.tsx` | `packages/onboarding-engine/src/components/steps/` | NEW: @stragra/onboarding-engine |
| `ReviewStep.tsx` | `packages/onboarding-engine/src/components/steps/` | NEW: @stragra/onboarding-engine |
| `wizard.css` | `packages/onboarding-engine/src/styles/` | NEW: @stragra/onboarding-engine |

---

## 📋 New Package to Create: @stragra/onboarding-engine

```json
{
  "name": "@stragra/onboarding-engine",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc",
    "lint": "eslint src/"
  },
  "dependencies": {
    "@stragra/core": "workspace:*",
    "@stragra/ui": "workspace:*",
    "@tanstack/react-query": "^5.17.0",
    "lucide-react": "^0.294.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.4",
    "zod-to-json-schema": "^3.22.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.46",
    "@types/react-dom": "^18.2.18",
    "typescript": "^5.3.3"
  },
  "peerDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

---

## ⚠️ CRITICAL: Avoid These Conflicts

1. **DON'T** add new dependencies without checking existing versions
2. **DON'T** create duplicate types - use @stragra/core
3. **DON'T** use different React versions - must be ^18.2.0
4. **DON'T** use different TypeScript versions - must be ^5.3.3
5. **DON'T** use different Zod versions - must be ^3.22.4
6. **ALWAYS** use `workspace:*` for internal package references
7. **ALWAYS** use `lucide-react` version ^0.294.0 (not latest)
8. **ALWAYS** use `@tanstack/react-query` version ^5.17.0

---

## 🔗 Integration Point

The wizard should be imported in `apps/web/src/app/page.tsx` or a new route like `apps/web/src/app/onboarding/page.tsx`:

```tsx
import { WizardContainer } from '@stragra/onboarding-engine';

export default function OnboardingPage() {
  return <WizardContainer clientId="001-stragra" />;
}
```

---

## 🎨 UI Components Available

From `@stragra/ui`:
- class-variance-authority (cva)
- clsx
- tailwind-merge

The wizard should use these for consistent styling across the monorepo.
