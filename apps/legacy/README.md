# Stragra

A modular multi-tenant workspace platform with file explorer capabilities.

## Architecture

```
stragra/
├── apps/
│   ├── web/          # Next.js frontend
│   └── backend/      # FastAPI backend
├── packages/
│   ├── core/         # Database & Prisma client
│   ├── file-explorer/# File explorer module
│   ├── ui/           # Shared UI components
│   └── tsconfig/     # Shared TypeScript configs
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8.9.0
- Python 3.9+ (for backend)
- PostgreSQL (for database)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/backend/.env.example apps/backend/.env

# Generate Prisma client
pnpm run db:generate
```

### Development

```bash
# Start all services
pnpm run dev

# Or start individually
cd apps/web && pnpm dev
cd apps/backend && uvicorn src.main:app --reload
```

### Build

```bash
pnpm run build
```

## Features

- **Multi-tenant isolation**: All queries filter by tenant_id
- **File management**: Upload, download, preview, share files
- **Folder structure**: Create folders, navigate with breadcrumbs
- **Soft delete**: Restore deleted files within retention period
- **Sharing**: Generate time-limited shareable links
- **PDF Preview**: Built-in PDF viewer support
