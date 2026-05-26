# AGENT.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

---

## Part A. Coding Principles

### A-1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### A-2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### A-3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### A-4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```text
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## Part B. AI Agent Workflow Instructions

The following sections define the sequential workflow. Always follow the order **B-1 → B-2 → B-3 → B-4 → B-5 → B-6** unless the user explicitly instructs otherwise.

### General Rules

- **Git Branch Rule (Single Source of Truth):** Always create a new Git branch before making any code modifications. For feature work use `feature/...`, for vulnerability fixes use `fix/vulnerability-...`. This rule applies to all code changes — do NOT create duplicate branches at each sub-step.
- **Git Push Rule (User Approval Required):** Never push to remote (`git push`) without explicit user approval. After committing locally, report the changes and wait for the user's permission before pushing. This applies to all branches including feature and fix branches.
- **Markdown Reporting Rule:** After creating or updating any Markdown (`.md`) file, you MUST stop proceeding with further tasks and report to the user immediately. **Exception:** If the user explicitly instructs you to proceed through multiple steps or to "complete everything and report," follow that instruction without stopping at each `.md` update.

### B-1. Source Code Analysis (RESEARCH)

- When asked to read or analyze source code, always record the following in `Agent/AI/RESEARCH.md`:
  - **When:** Date / Time
  - **Title**
  - **Why:** Purpose of the analysis
  - **Source code analysis results**
- Never delete existing content. Organize the contents in descending chronological order (newest entries at the top).

### B-2. Planning (PLAN)

- When asked to create a plan, write it in `Agent/AI/PLAN.md` covering the following:
  - **When:** Date / Time
  - **What:** What will be implemented
  - **How:** Technical approach
  - **In what order:** Sequenced steps
  - **Why:** Purpose and rationale
- When asked to re-plan or modify a plan, review the existing notes and contents in `Agent/AI/PLAN.md` before making updates.

### B-3. Task Management (TODO)

- When asked to create a TODO list, write it sequentially in `Agent/AI/TODO.md`.
- **Prerequisite:** `Agent/AI/PLAN.md` must exist and be approved before creating the TODO. If no PLAN exists, notify the user and suggest creating one first.
- Do not deviate from the scope and intent of the plan established in `Agent/AI/PLAN.md`.

### B-4. Implementation & Execution

- Never modify or add code unless the user explicitly requests code writing.
- Create a Git branch (per the General Rule above) and write the code according to the workflow specified in `Agent/AI/TODO.md`.

### B-5. Source Code Vulnerability (SCV)

- When requested to patch a vulnerability, accessibility issue, or lint error, first verify the exact location and context of the issue.
- **Document the vulnerability in `Agent/AI/SCV.md`**. You must record the following details in `SCV.md` for tracking:
  - **Branch:** The dedicated Git branch used for the fix
  - **When:** Date and Time
  - **Where:** The specific file(s) where the vulnerability was found
  - **What:** What the exact vulnerability is
  - **Why:** Why the vulnerability occurred (root cause)
  - **Plan:** How you plan to resolve it
  - **Resolution:** How it was actually resolved
- Apply **strictly surgical patches** (per Part A, §A-3). Fix ONLY the targeted vulnerability without refactoring adjacent code, altering UI design, or changing existing functional logic.
- After patching, thoroughly verify the integrity of the code using compiler checks or linters (e.g., `npx tsc -b` or `npm run lint`) to ensure no breaking changes were introduced.
- **Limit iteration to 3 times:** One iteration = the full cycle of (analyze → patch → verify). If a new vulnerability is discovered on the 4th iteration, **rollback the changes, stop the work immediately, and notify the user.**
- SCV patches are also considered code implementations; therefore, **`Agent/Project/REPORT.md` must also be updated** after the fix is complete (see B-6).

### B-6. Reporting & Git Commit

This is the final step for any code implementation or vulnerability fix.

1. **Report:** Record the following details in `Agent/Project/REPORT.md`:
   - When
   - Why (purpose of the implementation)
   - Where
   - What
   - How
2. **Git Commit:** Stage and commit all changes using Git. Ensure the commit message is clear, descriptive, and accurately summarizes what was implemented and why.
3. **Request Evaluation:** Once the report is written and committed, request an evaluation from the user.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
