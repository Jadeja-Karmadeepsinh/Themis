# Themis: Automated AI Code Reviewer

<p align="center">
  <strong>Intelligent, Context-Aware Pull Request Reviews Powered by LLMs & Vector Search</strong>
</p>

---

## 📖 Overview

**Themis** is an automated code review platform that integrates directly with GitHub to provide deep, actionable pull request reviews in seconds. Named after the Greek titaness of divine order and justice, Themis helps engineering teams catch bugs, enforce security best practices, and improve maintainability before code reaches production.

Unlike generic linters or superficial AI reviewers, Themis uses **semantic code search** via **Pinecone** to retrieve surrounding codebase context, giving the AI model a true architectural understanding of your project.

---

## 🌟 Key Features

- ⚡ **Instant PR Webhooks**: Automatically triggers AI reviews when pull requests are opened, synchronized (new commits pushed), or reopened.
- 🧠 **Context-Aware Semantic Search**: Embeds and indexes PR diffs alongside full codebase chunks in **Pinecone**, preventing out-of-context hallucinations.
- 🔄 **On-Demand Repository Sync**: Syncs entire repositories into vector embeddings so the AI can reference related files across your codebase.
- 📊 **Developer Dashboard**: Clean, responsive UI built with Next.js App Router and Shadcn UI to monitor connected repositories, view PR logs, and manage settings.
- 🔒 **GitHub App Security**: Connects securely via GitHub App permissions without requiring personal access tokens.
- ⚙️ **Event-Driven Resilience**: Step-based asynchronous execution powered by **Inngest** for reliable retries, rate-limiting, and error tolerance.
- 💳 **Usage Tiers & Billing**: Built-in free plan (5 reviews/mo) and Pro plan (unlimited reviews) managed with **Razorpay** and Better Auth.

---

## 🛠 Tech Stack

| Layer               | Technology                                          |
| ------------------- | --------------------------------------------------- |
| **Framework**       | Next.js 16 (App Router, Server Actions, React 19)   |
| **Language**        | TypeScript                                          |
| **Styling & UI**    | Tailwind CSS v4, Shadcn UI, Phosphor Icons          |
| **Database**        | PostgreSQL with Prisma ORM 7 (`@prisma/adapter-pg`) |
| **Vector DB**       | Pinecone                                            |
| **AI / LLM**        | OpenRouter (configurable model via Vercel AI SDK)   |
| **Background Jobs** | Inngest                                             |
| **Authentication**  | Better Auth (GitHub OAuth provider)                 |
| **Payments**        | Razorpay (Subscriptions & Webhooks)                 |

---

## 🚀 Getting Started

Follow these step-by-step instructions to get Themis running locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.18+ or v20+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for local PostgreSQL)
- A [GitHub](https://github.com/) account
- An [OpenRouter](https://openrouter.ai/) account (free / pay-as-you-go)
- A [Pinecone](https://www.pinecone.io/) account (free tier available)
- [Inngest CLI](https://www.inngest.com/docs/local-development) (`npx inngest-cli@latest dev`)

---

### Step 1: Clone the Repository & Install Dependencies

```powershell
git clone https://github.com/Jadeja-Karmadeepsinh/Themis.git
cd Themis
npm install
```

---

### Step 2: Set Up Environment Variables

Copy `.env.example` to `.env`:

```powershell
cp .env.example .env
```

Open `.env` and fill in your values (detailed guide below):

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5438/myApp?schema=public"

# Better Auth
BETTER_AUTH_SECRET="your_32_character_secret_key"
BETTER_AUTH_URL="http://localhost:3000"

# GitHub OAuth (User Login)
GITHUB_CLIENT_ID="your_oauth_client_id"
GITHUB_CLIENT_SECRET="your_oauth_client_secret"

# GitHub App (PR Reviews)
GITHUB_APP_ID="your_app_id"
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET="your_app_webhook_secret"
NEXT_PUBLIC_GITHUB_APP_SLUG="themis-pr-review"

# AI & Embeddings
OPENROUTER_API_KEY="your_openrouter_api_key"
PINECONE_API_KEY="your_pinecone_api_key"
PINECONE_INDEX="themis-reviews"

# Inngest Background Jobs
INNGEST_EVENT_KEY="local_dev"
INNGEST_SIGNING_KEY="local_dev"

# Razorpay (Billing)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_your_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
RAZORPAY_WEBHOOK_SECRET="your_razorpay_webhook_secret"
RAZORPAY_PLAN_ID="plan_your_plan_id"
```

---

### Step 3: Setting Up Required Services

#### 1. PostgreSQL Database

You can spin up the local PostgreSQL container defined in `docker-compose.yml`:

```powershell
docker-compose up -d
```

Then run the Prisma migrations to set up the schema:

```powershell
npx prisma migrate dev
```

#### 2. GitHub OAuth App (For User Login)

1. Go to **GitHub Settings** -> **Developer Settings** -> **OAuth Apps** -> **New OAuth App**.
2. Set **Application Name**: `Themis Sign-in`
3. Set **Homepage URL**: `http://localhost:3000`
4. Set **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
5. Copy the **Client ID** and generate a **Client Secret** into your `.env`.

#### 3. GitHub App (For PR Reviews)

1. Go to **GitHub Settings** -> **Developer Settings** -> **GitHub Apps** -> **New GitHub App**.
2. **GitHub App name**: e.g. `themis-pr-review-<your-name>` (set this as `NEXT_PUBLIC_GITHUB_APP_SLUG`).
3. **Homepage URL**: `http://localhost:3000`
4. **Webhook URL**: For local testing, use a tunneling service like [smee.io](https://smee.io) or ngrok:
   - Example: `https://smee.io/your-unique-channel` -> forwards to `http://localhost:3000/api/github/webhook`
5. **Webhook secret**: Enter a secure random string (matches `GITHUB_WEBHOOK_SECRET`).
6. **Repository Permissions**:
   - **Pull requests**: Read & write
   - **Issues**: Read & write
   - **Contents**: Read-only
   - **Metadata**: Read-only
7. **Subscribe to events**:
   - Check `Pull request`
8. After creating the app:
   - Note the **App ID** -> `GITHUB_APP_ID`.
   - Scroll to **Private keys** -> click **Generate a private key**. Save the `.pem` file and copy its content into `GITHUB_APP_PRIVATE_KEY` (formatted with `\n` linebreaks).

#### 4. Pinecone Vector Index

1. Log in to [Pinecone Console](https://app.pinecone.io/).
2. Create a new Serverless index named `themis-reviews`.
3. Set **Dimensions**: `1536` (matching OpenAI embedding standard).
4. Set **Metric**: `cosine`.
5. Copy your **API Key** into `PINECONE_API_KEY`.

#### 5. OpenRouter API

1. Create an account at [OpenRouter](https://openrouter.ai/).
2. Generate an API Key and place it in `OPENROUTER_API_KEY`.

---

### Step 4: Run the Development Environment

Start all required services:

```powershell
# 1. Start Inngest local development server (in a separate terminal)
npx inngest-cli@latest dev

# 2. Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:

- Sign in with your GitHub account.
- Navigate to **GitHub App** in the dashboard and install the app on your personal or test repositories.
- Create a Pull Request on any connected repository to watch Themis analyze the code and post an automated review comment!

---

## 📁 Project Structure

```
├── app/                        # Next.js App Router pages & API endpoints
│   ├── (auth)/sign-in/         # GitHub authentication page
│   ├── (protected)/dashboard/  # Overview, Repositories, PRs & Settings
│   ├── api/auth/               # Better Auth route handlers
│   ├── api/github/             # GitHub app callbacks & webhook listener
│   ├── api/inngest/            # Inngest webhook route & registered functions
│   └── api/razorpay/           # Razorpay subscription webhook handler
├── components/                 # Reusable UI primitives (Shadcn UI)
├── features/
│   ├── ai/                     # OpenRouter & Vercel AI SDK client
│   ├── auth/                   # Session helpers, sign-in buttons & user menu
│   ├── billing/                # Razorpay checkout, subscription management
│   ├── dashboard/              # Sidebar, navigation, repo lists & stats
│   ├── github/                 # Octokit App authentication & installation sync
│   ├── inngest/                # Inngest client definition
│   ├── pinecone/               # Pinecone vector store connection
│   ├── repo-sync/              # Full repository indexing & embeddings
│   ├── reviews/                # Diff chunking, prompt generation & PR comments
│   └── settings/               # Profile & plan management
├── lib/                        # Core utilities, Prisma client & auth configs
├── prisma/                     # Database schema & migrations
└── public/                     # Static icons & SVGs
```

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
