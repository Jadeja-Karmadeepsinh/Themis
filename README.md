# Themis — Automated AI Code Reviewer

Themis is an intelligent, automated AI-powered pull request reviewer built for modern engineering teams. Powered by semantic code search and advanced LLMs, Themis delivers instant, context-aware code reviews directly on your GitHub pull requests.

---

## 🌟 Features

- **Automated Pull Request Reviews**: Integrates directly with GitHub webhooks to analyze PR diffs as soon as they are opened or updated.
- **Context-Aware Semantic Analysis**: Uses **Pinecone** vector database to index and retrieve relevant codebase snippets, ensuring reviews understand project architecture and dependencies.
- **On-Demand Codebase Sync**: Indexes full repositories into Pinecone namespaces to ground AI feedback in your actual project context.
- **Developer-Friendly Dashboard**: Built with Next.js App Router and Shadcn UI, providing repository management, installation tracking, and real-time review logs.
- **GitHub App Integration**: Secure authentication and granular repository permissions via GitHub App.
- **Background Event Architecture**: Powered by **Inngest** for resilient, asynchronous job processing and step-based review workflows.
- **Pro Tier & Usage Limits**: Built-in subscription and usage limits powered by **Razorpay** and Better Auth.

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Vector Database**: [Pinecone](https://www.pinecone.io/)
- **AI / LLM Provider**: [Vercel AI SDK](https://sdk.vercel.ai/) & [OpenRouter](https://openrouter.ai/)
- **Background Jobs**: [Inngest](https://www.inngest.com/)
- **Authentication**: [Better Auth](https://www.better-auth.com/) with GitHub OAuth
- **Payments**: [Razorpay](https://razorpay.com/)
- **UI & Styling**: Tailwind CSS, Shadcn UI, Phosphor Icons

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker (for local PostgreSQL instance) or hosted Postgres (e.g. Supabase / Neon)
- GitHub App credentials
- Inngest CLI / Account
- Pinecone API Key
- OpenRouter API Key

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Jadeja-Karmadeepsinh/Themis.git
cd Themis
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5438/myApp?schema=public"

# Auth
BETTER_AUTH_SECRET="your_better_auth_secret"
BETTER_AUTH_URL="http://localhost:3000"

# GitHub App & OAuth
GITHUB_CLIENT_ID="your_github_oauth_client_id"
GITHUB_CLIENT_SECRET="your_github_oauth_client_secret"
GITHUB_APP_ID="your_github_app_id"
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET="your_github_webhook_secret"
NEXT_PUBLIC_GITHUB_APP_SLUG="themis-pr-review"

# AI & Embeddings
OPENROUTER_API_KEY="your_openrouter_api_key"
PINECONE_API_KEY="your_pinecone_api_key"
PINECONE_INDEX_NAME="themis-reviews"

# Inngest
INNGEST_EVENT_KEY="your_inngest_event_key"
INNGEST_SIGNING_KEY="your_inngest_signing_key"

# Razorpay (Billing)
NEXT_PUBLIC_RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
RAZORPAY_WEBHOOK_SECRET="your_razorpay_webhook_secret"
RAZORPAY_PRO_PLAN_ID="your_razorpay_plan_id"
```

### 3. Start Database & Run Migrations

```bash
# Start local Postgres via docker compose
docker-compose up -d

# Run Prisma migrations
npx prisma migrate dev
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
