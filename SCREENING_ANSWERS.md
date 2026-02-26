# Screening Answers — legis-deploy

---

**Q1: Which hosting platform you'd recommend for this use case and why**

Railway — your repo already includes railway.toml and runs as a single Express process with SQLite, which maps cleanly to Railway's single-service model with a persistent volume for DATABASE_PATH. Render is a solid fallback. Demo showing the verification workflow: https://legis-deploy.vercel.app.

---

**Q2: A recent Node.js deployment you've done**

Most recently deployed a Node.js app with Anthropic Claude API integration — similar env var config (API keys, session secrets, DB paths). Also deployed a monitoring tool with webhook integrations and persistent storage.

---

**Q3: Your availability to start**

Available immediately. Given the scope — deploy, verify, document — everything can be live within 24 hours of receiving repo access.

---

**Q4: Confirmation willing to sign NDA and non-compete**

Yes, fully willing to sign both NDA and non-compete before receiving any access. I understand the proprietary nature of the legislative document generation platform and will delete all local copies upon completion as specified.
