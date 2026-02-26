# Domain Knowledge Brief — Node.js/Express Legislative Platform Deployment (Railway PaaS / DevOps)

## Sub-Domain Classification

**Dual-domain application**: DevOps/PaaS deployment operations dashboard for a legislative document generation platform. The primary persona is a developer or technical operations person deploying and monitoring a Node.js/Express backend on Railway (or comparable PaaS: Render, Fly.io). The secondary domain is the legislative technology (GovTech) content being served — bills, resolutions, amendments, policy briefs — which provides the realistic "what is this service doing" context for document data.

The demo app should feel like the Railway or Vercel project dashboard crossed with an observability layer. Think: a developer who just shipped a legislative document generation API to production and now monitors its health, deployments, and environment configuration.

---

## Job Analyst Vocabulary — Confirmed and Extended

The job is about deploying an existing Node.js/Express platform to Railway (or similar PaaS). The client is technical — they understand Docker, environment variables, and health checks. The vocabulary must reflect that fluency. Generic terms like "items," "tasks," or "settings" will signal immediately that the developer is not a DevOps practitioner.

### Confirmed Primary Entity Names

- Primary record type: **deployment** (not "job", not "build", not "release")
- Service unit: **service** (not "app", not "container", not "instance")
- Configuration: **variable** or **environment variable** (never "setting" or "config item")
- Compute: **replica** (when multiple instances run; not "instance", not "server")
- Storage: **volume** (persistent), **ephemeral storage** (temporary)
- Log source: **build log** vs. **deploy log** (these are two distinct log streams in Railway — different tabs)
- Recovery action: **rollback** (not "undo", not "revert")
- Rerun: **redeploy** (not "restart", not "rerun")
- Lifecycle check: **health check** or **healthcheck** (one word in Railway's own docs)
- Scope: **project** contains multiple **services** across multiple **environments**
- Source: **Railpack** (Railway's automated buildpack), **Dockerfile**, or **Docker Image**

### People Roles in This Domain
- **Developer** — the person doing the deployment
- **DevOps engineer** — the person owning the pipeline
- **Platform engineer** — the person who configured Railway, volumes, and environment variable scoping
- **Technical lead** — who approves production deployments
- No non-technical roles in this domain — all users are engineering staff

### Secondary Entities (Legislative Content Layer)
- **Document** — the output artifact (not "file", not "record")
- **Template** — the source structure for document generation
- **Bill** — a specific legislative document type
- **Resolution** — another document type (simpler than a bill)
- **Amendment** — a modification document
- **Policy Brief** — advocacy-oriented summary document
- **Session** — the legislative period (e.g., "118th Congress", "2025 Regular Session")

---

### Expanded KPI Vocabulary

| KPI Name | What It Measures | Typical Format |
|---|---|---|
| Uptime % | Percentage of time the service responded successfully over a period | % (e.g., 99.87%) |
| p50 Response Time | Median HTTP response latency across all requests | ms (e.g., 84ms) |
| p95 Response Time | 95th percentile response latency — captures "slow tail" | ms (e.g., 247ms) |
| p99 Response Time | 99th percentile — worst-case user experience | ms (e.g., 612ms) |
| Error Rate | Percentage of requests returning 4xx or 5xx status codes | % (e.g., 0.3%) |
| Deployment Frequency | How often new deployments are triggered (DORA metric) | deploys/day or deploys/week |
| Lead Time for Changes | Commit-to-production time (DORA metric) | minutes or hours |
| Change Failure Rate | Percentage of deployments causing failures or rollbacks (DORA metric) | % |
| MTTR | Mean Time to Recovery — how fast service is restored after incident | minutes |
| CPU Usage | Service CPU utilization as a percentage of allocated vCPU | % |
| Memory Usage | RAM consumed vs. allocated limit | MB or % |
| Network Egress | Outbound data transferred from the service | MB/GB |
| Build Duration | Time from build trigger to deployment-ready image | seconds |
| Cold Start Time | First-request latency after idle period (relevant to free/sleeping tiers) | seconds |
| Documents Generated | Volume of documents the API produced in a period | count |
| Active Deployments | Number of deployments currently in "Active" state | count |
| Replica Count | Number of running replicas for horizontal scaling | count |

---

### Status Label Vocabulary

These are the exact status strings used in Railway deployments. Use these verbatim in UI badges, tables, and filter dropdowns.

**Deployment States (Railway's exact labels):**
- Active states: `Initializing`, `Building`, `Deploying`
- Healthy terminal: `Active`
- Problem states: `Failed`, `Crashed`
- Completed states: `Completed` (process exited with code 0)
- Removal states: `Removing`, `Removed`

**Service Health States:**
- `Healthy` — health check passing, service responding
- `Degraded` — health check inconsistent, intermittent failures
- `Unhealthy` — health check failing, service not responding
- `Starting` — service coming online after cold start
- `Sleeping` — free-tier service suspended (Render-specific; Railway's paid tier does not sleep)

**Environment States:**
- `Production` — live traffic environment (always present, created by default)
- `Staging` — pre-production testing environment
- `PR Environment` — temporary environment created from a pull request, auto-deleted on merge
- `Development` — local or isolated dev environment (typically not on Railway itself)

**Variable States:**
- `Active` — variable is set and used
- `Inherited` — variable sourced from shared scope
- `Overridden` — service-level value overrides shared value
- `Missing` — referenced variable not yet set (causes deployment failure)

**Log Severity Levels (Railway's exact labels):**
- `debug`, `info`, `warn`, `error` (all lowercase — Railway normalizes these)

---

### Workflow and Action Vocabulary

**Primary actions:**
- `deploy` — trigger a new deployment
- `redeploy` — re-run a previous deployment from stored image
- `rollback` — revert to a prior active deployment
- `scale` — adjust replica count or resource limits
- `restart` — restart a crashed or unhealthy service
- `promote` — promote staging deployment to production

**Secondary actions:**
- `fork` (deprecated in Railway, replaced by `sync`) — copy an environment
- `sync` — import services from one environment to another
- `pin` — lock a service to a specific deployment (prevent auto-deploy)
- `tail` — stream live logs from a running service
- `exec` — run a shell command inside a running container (Railway shell feature)

**Build actions:**
- `build` — compile and package source into a container image
- `push` — push a Docker image to Railway's registry
- `invalidate cache` — force a full rebuild without cached layers

---

### Sidebar Navigation Candidates

For the demo app's sidebar, use these domain-appropriate labels instead of generic "Dashboard / Analytics / Settings":

1. **Overview** — top-level deployment health (this is the correct Railway term; they call it "Project Overview")
2. **Deployments** — deployment history table with status, build time, triggered by
3. **Services** — service list with health badges (the Railway canvas equivalent)
4. **Logs** — live and historical log viewer with severity filters
5. **Environment Variables** — variable table scoped by service and environment
6. **Metrics** — CPU, memory, network charts (Railway calls this section "Metrics")
7. **Documents** — (legislative content layer) generated document list

Note: "Settings" is acceptable as a secondary nav item in DevOps tools — it is standard. But it should be deprioritized relative to the operational views above.

---

## Design Context — Visual Language of This Industry

### What "Premium" Looks Like in This Domain

Developers who use Railway, Vercel, Render, or Fly.io have strong opinions about UI quality. They have seen bad deployment dashboards (the old Heroku UI, AWS Elastic Beanstalk) and good ones (Railway's project canvas, Vercel's deployment timeline). The visual conventions they have internalized come from four tools they use every day: their terminal, GitHub, their CI/CD pipeline, and their monitoring tool.

The aesthetic they expect is best described as "dark, functional, precise." Railway itself uses a near-black background with purple/violet accent colors. Vercel uses pure black with white text. Both share these characteristics: monospace fonts for values and log output, subdued borders, status colors that pop clearly against dark backgrounds (green for active/healthy, red for failed/crashed, amber for building/pending), and zero decorative elements. Every pixel earns its place by communicating system state.

Critically, this domain's users are comfortable with high information density. They are accustomed to reading Grafana dashboards with 12 panels, terminal output with 40 lines scrolling, and log tables with 8 columns. A spacious layout with large cards and generous whitespace reads as "built for marketing, not for operators." Compact spacing with monospace data values signals that the developer understands the power-user context.

The log viewer is a defining UI element in this domain. Even if it shows mock data, it must feel like a real terminal output: monospace text, timestamp-prefixed lines, severity-colored rows (red for error, amber for warn, muted for info, dimmed for debug), line wrapping at a fixed column width. Nothing else signals "I know deployment tooling" as quickly as a well-executed log panel.

### Real-World Apps Clients Would Recognize as "Premium"

1. **Railway Dashboard** — The gold standard for this specific job. Railway uses a dark project canvas where services appear as cards connected by dependency lines. Deployments have a timeline with color-coded status badges. Logs are split between Build Logs and Deploy Logs tabs. Metrics show CPU, memory, and network as separate time-series panels with deployment markers (dotted vertical lines showing when each deploy occurred). A client deploying to Railway will immediately evaluate the demo against this visual reference.

2. **Vercel Deployment Dashboard** — The adjacent reference. Vercel's deployment list shows commit SHA, branch name, deployment URL, duration, and status in a compact table. Each deployment links to a preview URL and a full build log. The design is white/light mode by default but the vocabulary is identical. Clients who know Vercel will recognize "Build Logs", "Function Logs", "Deployment Status", and "Environment Variables" as standard concepts.

3. **Grafana** — The monitoring reference. When a developer says "I want to see metrics," they picture Grafana: time-series panels in a dark grid layout, colored lines for different metrics, threshold lines, and deployment annotation markers. Even if the demo does not replicate Grafana exactly, the chart layout should evoke this density and precision — multiple metrics panels, not just one chart.

### Aesthetic Validation

- **Recommended aesthetic**: Data-Dense (primary) with Dark Premium influence
- **Domain validation**: DevOps/monitoring practitioners live in tools like Railway, Grafana, and terminal emulators all day. The Data-Dense aesthetic — compact, dark, status-badge-heavy, monospace values — is exactly what they consider "the real thing." Dark Premium adds the visual polish that distinguishes a well-funded platform (like Railway or Vercel) from a generic ops tool.
- **One adjustment**: The primary color for this domain should lean toward violet/indigo rather than blue. Railway uses a distinctive purple accent; Vercel uses pure white on black. Either direction is credible. Avoid bright green as a primary accent — in this domain, green is reserved exclusively for "healthy/active" status signals and should not be the UI's identity color.
- **Color direction**: Deep violet `oklch(0.55 0.20 290)` on near-black `oklch(0.09 0.02 270)` background. This directly references Railway's own color identity.

### Density and Layout Expectations

**High density** — this domain's practitioners are power users who expect to see maximum information per screen. A standard SaaS spacious layout (generous padding, large cards, one metric per card) would read as amateur. Target the Data-Dense setting: compact padding (`--content-padding: 1rem`), narrow sidebar (`14rem`), and tables that show 10-15 rows without scrolling.

The layout should be **table-heavy and panel-heavy**, not card-heavy. Deployment history belongs in a table (not a card grid). Log output belongs in a terminal-style panel. Metrics belong in multi-panel chart layouts, not individual large charts.

The one place card-style layout is appropriate is the service/health overview — showing each service as a status card with a health indicator, replica count, and last deployment. This mirrors Railway's canvas approach.

---

## Entity Names (10+ realistic names)

### Services / Application Names
Real Node.js legislative platform services would be named in kebab-case, following DevOps naming conventions:
- `legis-api` — the primary Express API service
- `legis-worker` — background document generation worker
- `document-renderer` — PDF/DOCX rendering microservice
- `template-engine` — legislative template management service
- `postgres` — Railway automatically names managed databases this way
- `redis-cache` — session and queue cache
- `bill-generator` — specific document type handler
- `amendment-processor` — tracks and applies amendments
- `advocacy-api` — public-facing advocacy document endpoint
- `admin-dashboard` — internal ops frontend

### Environment Names
- `production` (always lowercase in Railway)
- `staging`
- `pr-142` — PR environment (auto-named by Railway as `pr-{number}`)
- `pr-139` — another PR environment
- `demo` — sales demo environment

### People / Developers (role-appropriate names for a GovTech startup)
- Marcus Webb — Lead DevOps Engineer
- Sarah Okonkwo — Platform Engineer
- James Thornton — Backend Developer
- Priya Nair — Technical Lead
- Daniel Hoffmann — Full-Stack Developer
- Amara Diallo — DevOps Engineer
- Kevin Park — Backend Developer
- Lena Voronova — Infrastructure Engineer

### Document Types and Templates
Legislative documents generated by the platform:
- `HB-2847` — House Bill (state legislature naming format)
- `SB-1193` — Senate Bill
- `HJR-44` — House Joint Resolution
- `SCR-112` — Senate Concurrent Resolution
- `AM-2847-01` — Amendment to House Bill 2847
- `PB-ENV-2025-03` — Policy Brief (environmental, March 2025)
- `WP-HED-2025-01` — White Paper (higher education)
- `TA-BUDGET-Q1` — Testimony / Advocacy document
- `FAR-2847` — Fiscal Analysis Report
- `COM-REPORT-117` — Committee Report

### Git Commit Messages (for deployment trigger context)
- `feat: add PDF export for bill documents`
- `fix: resolve healthcheck timeout on cold start`
- `chore: update railway.toml with memory limits`
- `feat: support amendment stacking in template engine`
- `fix: correct env var reference for DATABASE_URL`
- `perf: reduce document render time by 40%`

---

## Realistic Metric Ranges

| Metric | Low | Typical | High | Notes |
|--------|-----|---------|------|-------|
| Uptime % | 97.2% | 99.7% | 99.98% | SLA target is usually 99.9%; below 99% is a problem |
| p50 Response Time | 38ms | 84ms | 210ms | Express.js on Railway; document endpoints slower |
| p95 Response Time | 120ms | 247ms | 680ms | PDF generation pushes this up significantly |
| p99 Response Time | 280ms | 612ms | 2,100ms | Outliers often caused by cold starts or DB queries |
| Error Rate | 0.02% | 0.3% | 2.8% | Above 1% warrants investigation; above 5% is critical |
| CPU Usage (idle) | 0.8% | 4.2% | 12% | Node.js is efficient at rest |
| CPU Usage (peak) | 18% | 34% | 87% | PDF/DOCX generation is CPU-intensive |
| Memory Usage | 128 MB | 312 MB | 892 MB | Node.js base + document templates + in-memory cache |
| Build Duration | 42s | 87s | 4m 12s | Varies by npm dependency count; Railway average ~90s |
| Deployment Frequency | 1/week | 3–5/week | Multiple/day | Elite DevOps teams deploy multiple times per day |
| Lead Time for Changes | 45 min | 2.3 hrs | 4 days | Commit to production; elite is under 1 hour |
| Change Failure Rate | 0% | 4.7% | 22% | Elite is <5%; medium performers ~15% |
| MTTR | 4 min | 18 min | 3.5 hrs | Elite recover in under 1 hour |
| Cold Start Time | 3.2s | 12s | 58s | Railway paid tiers don't sleep; free-tier Render can hit 60s |
| Documents Generated/Day | 12 | 147 | 1,840 | Depends on client volume; state agency could be high |
| Network Egress/Month | 0.8 GB | 4.2 GB | 22 GB | Document downloads (PDF/DOCX) drive egress |
| Replica Count | 1 | 2–3 | 8 | Horizontal scaling for document generation burst |

---

## Industry Terminology Glossary (15+ terms)

| Term | Definition | Usage Context |
|------|-----------|---------------|
| Railpack | Railway's automated buildpack system that detects language/framework and builds a container without a Dockerfile | Shown in build logs; alternative to Dockerfile |
| Healthcheck | An HTTP endpoint Railway polls to verify a deployment is ready to serve traffic; typically `/health` returning 200 | Deployment configuration; failure causes deployment to be marked "Failed" |
| Rollback | Redeploying a previously active deployment from stored container images without rebuilding | Recovery action after a bad deployment |
| Replica | A single running instance of a service; multiple replicas provide horizontal scaling | Shown in service metrics; "2 replicas running" |
| Zero-downtime deployment | Railway's default behavior: new deployment is made active only after healthcheck passes before removing old deployment | Why healthcheck configuration matters |
| Ephemeral storage | Temporary disk storage tied to a specific deployment, lost when the deployment is removed | Warning context; use Volumes for persistence |
| Volume | Persistent storage that survives deployments; mounted to a specific path in the container | Data persistence for databases or uploaded files |
| Environment variable | Key-value configuration injected into the runtime environment; never hardcoded in source | `DATABASE_URL`, `RAILWAY_PUBLIC_DOMAIN`, API keys |
| Shared variable | A variable defined at the project level, accessible to all services | Cross-service configuration |
| RAILWAY_PUBLIC_DOMAIN | System-injected variable containing the public URL of a service | Used in health check URLs and CORS configuration |
| PR Environment | A temporary Railway environment automatically created when a GitHub pull request is opened | Preview deployments for code review |
| Build log | Output from the container build phase (npm install, compilation, etc.) | Separate from deploy log; shown in "Build Logs" tab |
| Deploy log | stdout/stderr from the running application after container start | Runtime errors, application logs, HTTP request logs |
| Event loop lag | Node.js-specific metric measuring how long callbacks wait before execution; high lag indicates blocking code | Performance monitoring; above 100ms is concerning |
| DORA metrics | Four key DevOps performance metrics: Deployment Frequency, Lead Time for Changes, Change Failure Rate, MTTR | Engineering performance benchmarking |
| AkN / Akoma Ntoso | XML standard for legislative documents, used by US House and international parliaments | Document format context for the legislative platform |
| Fiscal note | An assessment of the financial impact of proposed legislation; often a required attachment to a bill | Legislative document metadata |
| Engrossed | A bill that has passed one chamber and is now formatted for transmission to the second chamber | Status label for legislative documents |
| Enrolled | A bill that has passed both chambers and is being prepared for executive signature | Final stage of bill lifecycle |

---

## Common Workflows

### Workflow 1: Deploying a Code Change to Production

1. Developer pushes a commit to the `main` branch on GitHub
2. Railway detects the push via webhook and triggers a new deployment
3. Deployment status changes from `Initializing` to `Building`
4. Railpack (or Dockerfile) runs: dependency installation, build compilation, image creation
5. Status changes to `Deploying`; Railway starts the container and polls the `/health` endpoint
6. If healthcheck returns HTTP 200 within 300 seconds: status changes to `Active`; prior deployment status changes to `Removing` then `Removed`
7. If healthcheck fails: status becomes `Failed`; prior Active deployment remains live
8. Developer reviews build logs and deploy logs to diagnose any failure
9. If failed: developer triggers a rollback to the last known-good deployment

### Workflow 2: Environment Variable Update Without Code Change

1. Developer navigates to the service's Variables tab in Railway
2. Adds or modifies an environment variable (e.g., updating `TEMPLATE_CACHE_TTL`)
3. Railway requires a redeploy for the variable to take effect
4. Developer triggers a redeploy (without a new build — uses the existing image)
5. New deployment spins up with updated env vars; healthcheck is verified
6. Old deployment is removed after new one is active

### Workflow 3: Legislative Document Generation Request (API Workflow)

1. Client system sends a POST request to `/api/documents/generate` with payload including document type (e.g., `"bill"`), template ID, and field values
2. Express API validates the request and retrieves the specified template
3. Template engine populates the bill structure with provided field values (title, sponsors, sections, fiscal note)
4. Document renderer generates the output in requested format (PDF, DOCX, or XML/AkN)
5. Generated document is stored in a Volume (persistent) or returned directly in the response
6. API logs the generation event with document ID, type, template used, and duration
7. If generation fails (missing required fields, invalid template): API returns structured error with field-level validation messages

---

## Common Edge Cases

1. **Health check timeout** — Deployment stuck in "Deploying" state for >300 seconds because the `/health` endpoint is not implemented or is behind an authentication middleware that blocks Railway's health check probe
2. **OOM Killed** — Service crashes with `Crashed` status immediately after becoming Active; memory limit exceeded during PDF generation for large documents; Memory usage chart shows spike to 100% before crash
3. **Missing environment variable** — Deployment succeeds but service crashes on first request because `DATABASE_URL` or similar required variable is not set for the environment; logs show `Error: getaddrinfo ENOTFOUND undefined`
4. **Failed rollback** — Previous deployment image has been purged (past the image retention policy for the current plan); rollback action fails with "Image not found"
5. **PR environment drift** — A PR environment has diverged significantly from production; variables are missing; the PR environment deployment is Active but behaves differently from production
6. **Cold start timeout** — First request to a sleeping service (Render free tier) times out at the client before the service finishes its 30-60 second startup; client experiences a 504 Gateway Timeout
7. **Build cache invalidation storm** — A change to `package.json` forces Railway to reinstall all npm dependencies, extending build time from 45 seconds to 8+ minutes; multiple parallel PRs all trigger full rebuilds simultaneously
8. **CPU spike during document batch** — A burst of concurrent document generation requests saturates CPU (85%+) and causes p99 latency to spike to 3,000ms+; horizontal scaling (adding replicas) is the correct response

---

## What Would Impress a Domain Expert

1. **Deployment markers on metric charts** — In Railway's own UI, CPU and memory charts show a dotted vertical line at the timestamp of each deployment. This correlation between "when did we deploy" and "when did memory spike" is a core DevOps diagnostic tool. Including this in the demo's chart visualization signals deep familiarity with how Railway and Grafana display deployment-correlated metrics.

2. **Exact Railway status lifecycle** — Using `Initializing → Building → Deploying → Active` (not "Pending → Running → Complete") and `Crashed` as a distinct state from `Failed` (Failed = error during build/deploy; Crashed = was Active, then died unexpectedly) demonstrates that the developer has actually used Railway, not just read about it.

3. **Build Log vs. Deploy Log separation** — These are two distinct log streams. Build logs contain `npm install`, Railpack detection, and image creation output. Deploy logs contain the running application's stdout/stderr. A demo that shows these as separate tabs or panels — with different content — signals hands-on Railway experience.

4. **Environment-scoped variable display** — Variables in Railway are scoped to service + environment. Showing that the same variable key has different values in `production` vs. `staging` (e.g., `LOG_LEVEL=error` in production, `LOG_LEVEL=debug` in staging) is an insider detail that generic deployment demos never include.

5. **Legislative document terminology correctness** — Using `HB-2847` (House Bill numbering convention), `engrossed` and `enrolled` as bill status labels, and `fiscal note` as a document attachment type signals domain knowledge of state legislative workflows. A client who works in GovTech will notice these terms immediately. The combination of correct DevOps vocabulary AND correct legislative vocabulary in a single demo is a powerful dual signal.

---

## Common Systems and Tools Used

| Tool | Category | Context |
|---|---|---|
| Railway | PaaS hosting | The primary deployment target for this job |
| Render | PaaS hosting | Secondary option; common comparison point; has more severe cold start issues |
| Fly.io | PaaS hosting | Alternative; Docker-native; favored for global edge deployments |
| Docker | Containerization | Dockerfile used when Railpack's auto-detection is insufficient |
| Railpack | Build system | Railway's automated buildpack; replaces Heroku buildpacks |
| GitHub Actions | CI/CD | Automated testing before Railway deployment trigger |
| Prometheus | Metrics collection | Often used alongside Railway's built-in metrics for custom app metrics |
| Grafana | Metrics visualization | Standard for teams that outgrow Railway's built-in metrics |
| Datadog | APM / monitoring | Enterprise teams; unified logs, metrics, traces |
| Sentry | Error tracking | Node.js exception capture; common companion to Railway deployments |
| PgAdmin / TablePlus | Database management | For PostgreSQL on Railway (Railway provides managed Postgres) |
| Railway CLI (`railway`) | Command-line tool | `railway up`, `railway logs`, `railway run` — developers use this daily |
| LegisPro (Xcential) | Legislative drafting | Professional legislative document authoring software; validates terminology |
| NCSL Bill Drafting Systems | Reference | National Conference of State Legislatures' standards for bill drafting |

---

## Geographic / Cultural Considerations

The legislative document context is US-centric based on the job posting:
- Document numbering follows US state legislative conventions: `HB-XXXX` (House Bill), `SB-XXXX` (Senate Bill), `HJR-XX` (House Joint Resolution), `SCR-XX` (Senate Concurrent Resolution)
- Sessions are named in US format: "118th Congress", "2025 Regular Session", "Special Session I"
- Fiscal years follow US government conventions: October 1 to September 30 (federal), or July 1 to June 30 (most states)
- Time zones: show timestamps in UTC (standard for DevOps logs) with user-local time offset in parentheses
- Railway's infrastructure is US-based by default (US West and US East regions); deployment URLs use `.up.railway.app` suffix
- Currency: USD for Railway plan costs and billing

---

## Data Architect Notes

**Entity names to use:**
- Primary record type for the deployment table: `Deployment` with fields: `deploymentId` (format: `dep-{7hexchars}`, e.g., `dep-a3f29c1`), `serviceId`, `status`, `triggeredBy` (git commit SHA short form + author), `buildDuration`, `deployedAt`, `environment`
- Service record: `Service` with fields: `serviceId`, `name` (kebab-case, e.g., `legis-api`), `healthStatus`, `replicaCount`, `lastDeployment`, `environment`
- Log entry: `LogEntry` with fields: `timestamp` (ISO 8601), `severity` (debug/info/warn/error), `message`, `serviceId`, `deploymentId`
- Environment variable: `EnvVar` with fields: `key`, `value` (mask secrets with `••••••`), `scope` (shared/service), `environment`, `lastUpdated`
- Document record: `LegislativeDocument` with fields: `documentId` (format: `HB-2847`, `SB-1193`, etc.), `type`, `title`, `status`, `generatedAt`, `templateId`, `format`

**Metric field values to use:**
- Uptime: 98.2% to 99.94% range across services; production should be highest
- p50 response time: 62ms to 118ms for standard endpoints; 280ms to 890ms for document generation endpoints
- CPU: 2-8% baseline; spikes to 45-78% during document generation bursts
- Memory: 180 MB to 450 MB typical; 820 MB peak during large batch

**Status labels to use (exact strings):**
- Deployments: `Initializing`, `Building`, `Deploying`, `Active`, `Failed`, `Crashed`, `Completed`, `Removing`, `Removed`
- Service health: `Healthy`, `Degraded`, `Unhealthy`, `Starting`
- Environments: `production`, `staging`, `pr-142`, `pr-138`
- Log severity: `info`, `warn`, `error`, `debug`
- Legislative documents: `Draft`, `Introduced`, `In Committee`, `Engrossed`, `Enrolled`, `Signed`, `Vetoed`, `Failed`

**Edge cases to include as specific records:**
- One `Crashed` deployment for `legis-worker` service with an OOM error in the logs
- One `Failed` deployment for `legis-api` with "Healthcheck timeout after 300s" as the failure reason
- One deployment with unusually long build time (7m 34s) due to full cache rebuild
- One env var with `Missing` status that caused a recent failure
- One `Degraded` service with p99 latency of 2,847ms (outlier)
- One `PR Environment` (`pr-142`) with a deployment in `Active` state

**Date patterns:**
- Deployments: relative timestamps within the last 30 days, with production deployments clustering at similar times of day (11am–2pm local time, typical developer work hours)
- Log entries: should span a 24-hour rolling window with denser activity during business hours
- Include a deployment on a Friday at 4:47 PM (edge case: risky deployment timing — a real insider joke/concern in DevOps culture)

---

## Layout Builder Notes

**Density:** Compact (`--content-padding: 1rem`, `--card-padding: 1rem`). This is a DevOps ops dashboard, not a consumer product. Practitioners in this space use Railway, Grafana, and terminals all day — compact is professional.

**Sidebar width:** 14rem (slim). DevOps tool sidebars are narrow; the main content area needs maximum width for tables and metric panels.

**Background:** Near-black, not pure white. `oklch(0.09 0.02 270)` or similar. This domain's reference tools (Railway, Grafana, terminal emulators) are dark-mode by default. A light-mode DevOps dashboard reads as unfamiliar to practitioners.

**Typography:** Geist Mono for all data values, timestamps, deployment IDs, log output, and metric numbers. Geist Sans for labels and headings. Mixing proportional and monospace text in the same table — label in sans, value in mono — is a visual convention practitioners recognize from Grafana and Railway.

**Color conventions that practitioners will verify:**
- `Active`/`Healthy` badges: green (`--success` token)
- `Failed`/`Crashed`/`Unhealthy` badges: red (a distinct red, not `--warning`)
- `Building`/`Deploying`/`Starting` badges: amber (`--warning` token) — indicates in-progress, not error
- `Removed`/`Completed` badges: muted gray (terminal state, not active)
- Log severity: error = red text, warn = amber text, info = default text, debug = dimmed/muted text

**Border treatment:** Full borders (`border-border`) on tables and panels — the Data-Dense aesthetic. No hairline borders or faded borders. DevOps dashboards have crisp grid lines.

**One domain-specific visual pattern critical to include:** The log viewer panel. Even if it shows mock data, it must render as a monospace, scrollable, severity-colored terminal-style view. Nothing else in the demo will signal domain familiarity as quickly as a realistic-looking log panel.

---

## Dashboard Builder Notes

**The single most important metric** (largest stat card): **Uptime %** for the primary production service (`legis-api`). This is the number every developer checks first and the one their client cares about most. Show it prominently with a trend indicator.

**Supporting stat cards:**
- Total Active Deployments (count, all services, all environments)
- p95 Response Time (ms, last 24 hours, with trend arrow)
- Error Rate % (last 24 hours, green if <1%, amber if 1-3%, red if >3%)
- Documents Generated (count, last 30 days — connects the DevOps layer to the business layer)

**Primary chart type:** Line chart with multiple series showing CPU and Memory over the last 24 hours, with deployment markers (vertical reference lines at each deployment timestamp). This is the most recognizable DevOps monitoring pattern — it directly mirrors Railway's own Metrics tab and Grafana's deployment annotation feature.

**Secondary chart:** Bar chart showing deployment frequency over the last 30 days (one bar per day, colored by success/failure ratio). This visualizes the DORA "Deployment Frequency" metric.

**One domain-specific panel that would impress a practitioner:** A live deployment activity feed showing the last 8-10 deployment events in reverse chronological order, each row showing: service name, git commit message (short), triggered-by user, duration, and status badge. This mirrors Railway's own Deployments list and is the first thing a developer looks at when they open the dashboard.

**Chart Y-axis calibration:**
- Response time charts: Y-axis 0ms to 1,000ms; alert threshold line at 500ms
- CPU chart: Y-axis 0% to 100%; warning threshold line at 70%
- Memory chart: Y-axis 0 MB to 512 MB (or the service's allocated limit); warning line at 80% of limit
- Deployment frequency: Y-axis 0 to 8 deploys/day (realistic for an active development team)
