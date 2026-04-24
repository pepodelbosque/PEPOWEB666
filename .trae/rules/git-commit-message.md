---
alwaysApply: true
scene: git_message
---

Write commit messages using Conventional Commits.

Rules:
- Format: `<type>(<scope>): <short summary>`
- Use lowercase for `type` and `scope`
- Keep the summary short, clear, and imperative
- Prefer summaries under 72 characters
- Focus on the main user-visible change or the main technical fix
- If the change is mostly UI/layout, prefer scopes like `ui`, `layout`, `hero`, `projects`, `menu`, `contact`
- If the change fixes spacing, overlap, responsiveness, or visual regressions, prefer `fix`
- If the change adds a new capability, prefer `feat`
- If the change is maintenance or tooling-only, prefer `chore`
- Avoid vague messages like `update stuff`, `changes`, or `fixes`

Examples:
- `fix(hero): increase desktop spacing before skills section`
- `fix(projects): move carousels below title and delay contact entry`
- `feat(menu): restyle dropdown actions with filled purple text`
- `chore(git): refine automatic commit message rules`
