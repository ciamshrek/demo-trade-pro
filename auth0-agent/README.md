# Auth0 Helper Scripts

Run all commands from `auth0/`.

| Script | Purpose |
|--------|---------|
| `scripts/generate-auth-management-client.sh` | • Creates a **M2M** application with full Management-API scopes.<br>• Writes `terraform/terraform.tfvars` containing the new client credentials and default project URLs.<br>• **Requires:** Auth0 CLI already set up with proper scopes. |
| `scripts/generate-web-env.sh` | • Reads Terraform outputs.<br>• Generates `apps/web/.env.local` with `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_AUDIENCE`, etc. |
| `scripts/generate-api-env.sh` | • Reads Terraform outputs.<br>• Generates `apps/api-server/.env` with Auth0 verification settings plus local DB & port. |

## Quick usage

```bash
# 1. Setup Auth0 CLI (run once)
# TODO: ./scripts/setup-auth0.sh  # Future script

# 2. Generate Terraform management client
./scripts/generate-auth-management-client.sh

# 3. Provision Auth0 resources  
cd terraform && terraform init && terraform apply

# 4. Generate application env files
../scripts/generate-web-env.sh
../scripts/generate-api-env.sh
``` & Environment Setup (Stock Trading Workshop)

This directory contains all infrastructure-as-code (Terraform) and helper scripts required to bootstrap **Auth0** for the Stock Trading workshop.

---

## Directory Layout

```
auth0/
├── terraform/               # Auth0 Terraform config
│   ├── api__stock_trading.tf
│   ├── clients__stock_trading_web.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── …
└── scripts/                 # Helper scripts
    ├── auth0-generate-env.sh        # Bootstrap Auth0 & generate terraform.tfvars
    ├── generate-web-env.sh          # Create .env.local for apps/web
    └── generate-api-env.sh          # Create .env for apps/api-server
```

## Prerequisites

* Auth0 CLI (`brew install auth0/tap/auth0`)
* Terraform ≥ 1.5
* `jq`, `openssl`, `uuidgen`
* Node (LTS) managed with `nvm` & **pnpm** (per user preference)

---

## 1. Bootstrap Auth0 & Generate `terraform.tfvars`

```bash
cd auth0
./scripts/auth0-generate-env.sh
# ➜ Creates a M2M app for Terraform and writes terraform/terraform.tfvars
```
The script prompts no input; it uses the active tenant selected via `auth0 tenants use <domain>`.

### Generated variables include
* `auth0_domain`, `auth0_client_id`, `auth0_client_secret`
* `project_name = "StockTrade"`
* Web URLs (localhost:3000) & API URLs (localhost:3001)
* `api_identifier = "https://api.stocktrade.local"`

---

## 2. Provision Auth0 Resources with Terraform

```bash
cd auth0/terraform
terraform init
terraform plan   # review
terraform apply  # create resources (API + Web Client)
```
Resources created:
1. **Resource Server** (Custom API) with scopes:
   * `trade:read`, `trade:write`, `portfolio:read`
2. **Web Client** (Next.js) with client grant for the above scopes.

Outputs available after apply:
* `web_client_id`, `web_client_secret`
* `api_audience`
* `auth0_domain`, `auth0_issuer_base_url`

---

## 3. Generate Application Environment Files

### Web App (`apps/web`)
```bash
cd auth0
./scripts/generate-web-env.sh
# ➜ writes apps/web/.env.local
```
Contents include `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_AUDIENCE`, etc.

### API Server (`apps/api-server`)
```bash
cd auth0
./scripts/generate-api-env.sh
# ➜ writes apps/api-server/.env
```
Contains JWT validation settings plus local Postgres connection string.

---

## 4. Run the Workshop Locally

```bash
# Set correct Node version
nvm use --lts

# Install dependencies (monorepo root)
pnpm install

# Start API server (port 3001)
pnpm --filter "apps/api-server" dev

# In new terminal, start Web app (port 3000)
pnpm --filter "apps/web" dev
```

You should now be able to sign-in via Auth0 on `http://localhost:3000`, obtain a JWT, and call the API on `http://localhost:3001` with scopes enforced.

---

## Troubleshooting

* **`auth0 tenants use <domain>`** – ensure correct tenant selected before running scripts.
* **Missing CLI tools** – install with Homebrew (`auth0`, `jq`, etc.).
* **Terraform state** – state is stored locally in `auth0/terraform/terraform.tfstate`; commit state only if necessary.

---

Happy trading! 🚀
