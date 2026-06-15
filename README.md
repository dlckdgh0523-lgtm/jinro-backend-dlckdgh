CLAUDE.md — 진로나침반 백엔드 (jinro-back)
This is the single source of truth for how Claude works in this repository. It merges the
project's collaboration governance with the one-time greenfield build, separated by a
two-phase model so the two never contradict each other.

Convention: "you" = the coding agent (Claude). "I" / "the maintainer" = 이창호.
Wording: Must / never = mandatory. Should / prefer = strong default. May = optional.


Project Context (binding technical constraints, not background)
진로나침반 is an AI career-guidance web service built on the CareerNet Open API (public, v4.1).
The backend has exactly three responsibilities:

CareerNet proxy — hide the apiKey server-side, normalize, cache.
AI guidance — Claude (Haiku for cheap/routing, Sonnet for final synthesis) with RAG, streamed over SSE.
PDF report — generate the diagnostic report as a Korean, chart-bearing PDF.

These contracts are mandatory wherever the relevant area is touched:

CareerNet integration

apiKey lives in server env only. Never client-exposed. HTTPS always.
Two response families: JSON (/cnet/front/openapi/*, /inspct/openapi/v2/*) and EUC-KR XML (/cnet/openapi/getOpenApi?svcCode=SCHOOL/MAJOR/COUNSEL/COSE). The XML family must be read as bytes and decoded euc-kr→utf-8 via iconv-lite before parsing — never res.text().
Sanitize dirty data: "null" string → null; strip <br> / &lt;/br&gt;; collapse \r\n and repeated whitespace; trim; always normalize "maybe-array" fields to arrays.
Validate external responses defensively (zod), tolerate missing/mistyped fields, log anomalies.
Resilience: timeout + p-retry exponential backoff + opossum circuit breaker. Runtime must not depend directly on CareerNet — feed a cron ingestion job into our own Postgres.
Cache: Redis + single-flight (stampede protection), per-domain TTL.


Architecture role separation (do not blur these)

SSE = server→client streaming (AI tokens, job progress). Not a queue.
BullMQ = durable jobs (PDF, ingestion, embedding). Retries, backoff, DLQ, idempotency keys.
Redis Pub/Sub = multi-instance SSE fan-out.
Redis Streams = do not use directly; BullMQ already runs on it. Reach for raw Streams only if an Outbox/replay event bus is genuinely required.


PDF rules

Never generate PDF inline in a request handler — always a dedicated BullMQ worker.
One reused browser + one BrowserContext per job. Korean fonts (Pretendard / Noto Sans KR) installed in the image and declared via CSS @font-face — never rely on system fonts. Wait for chart-render completion signal. Concurrency 1–2, memory ≥ 1.5 GB, restart the browser every N jobs. Output to S3, return a presigned URL.


Error contract

Shape: { "error": { "code": "DOMAIN_REASON", "message": "user-safe", "traceId": "..." } }.
Per-domain code enums (CAREERNET_*, AI_*, PDF_*, VALIDATION_*). Never leak internal stack. pino structured logs + traceId (AsyncLocalStorage) + Sentry (no-op if unkeyed).




How We Build Together
I bring domain knowledge and architectural vision; you bring speed, pattern recognition, and exploration. Refine ideas collaboratively: critique thoughtfully, suggest improvements, and explore trade-offs until I say "let's build this" — except during an explicitly authorized greenfield build (see Operating Phases).
These guidelines bias toward caution over speed. For trivial tasks, use judgment.
Interpretation notes:

Trivial task: a small, local change with clear intent, low risk, reversible by discarding the change without cascading consequences.
Minor or contained ambiguity: uncertainty that does not affect external behavior, interfaces, stored data, safety, or reversibility.
Harmful pattern: an existing pattern that materially reduces clarity, correctness, maintainability, or safe implementation.
Working code: code that currently satisfies its observable purpose, even if imperfect internally.


Operating Phases  ★ (the reconciliation)
This repo has two phases. The active phase decides which defaults apply. Section 5 hard stops apply in both phases, always.
Phase A — Greenfield Build (one-time, explicitly authorized)
Active only while executing the autonomous master prompt (jinro-backend-autonomous-prompt.md). Handing you that prompt is the explicit authorization — it stands in for "let's build this" for the duration of the build.
What changes in Phase A:

default mode / ambiguity mode are relaxed. Do not stop to ask. Proceed with the most reasonable assumption and record it in docs/OPEN_QUESTIONS.md and docs/DECISIONS.md. Keep going end-to-end.
Missing credentials → mock / no-op, recorded. Never stop on a missing key.
The documented shared-state exceptions (Section 5) are permitted.

What does not change in Phase A:

All Section 5 hard stops remain in force (no destructive commands, no commit/push, no .env edits, no silent signature/contract changes, no suppressed exceptions, no unlabeled stubs).
Simplicity First (Section 2) still applies — autonomy is not license to over-build.
Every mock, stub, and assumption must be enumerated in docs/REPORT.md (this is how unlabeled-stub avoidance and autonomy coexist).

Phase B — Steady-State Iteration (default for everything after the build)
Once the backend exists, the full governance below applies as written: default mode, ambiguity mode (stop and ask), surgical changes, and the "let's build this" gate are all back in force. This is the law for growing jinro-back alongside jinro-front.
Phase rule deltas
RulePhase A (build)Phase B (iteration)Ambiguity that affects behaviorAssume + record, keep goingStop and ask"let's build this" gateWaived (the prompt is the authorization)In forceSection 5 hard stopsIn forceIn forceSimplicity FirstIn forceIn forceSurgical ChangesN/A (greenfield) — but match any convention jinro-front impliesIn forceStubs / mocksAllowed iff enumerated in REPORT.mdLabeled in task report

0. Order of Precedence
When rules pull in different directions:

Active phase selects the operating defaults (above).
Section 5 hard stops override everything unless explicitly authorized.
Explicit instruction overrides defaults.
Correctness, safety, and existing behavior before elegance or speed.
Prefer smaller diffs and style matching when they do not conflict with the above.

Operating Modes (Phase B; Phase A overrides per above)

Default mode: make the smallest correct change that satisfies the request.
Ambiguity mode: if uncertainty affects behavior, interfaces, data, safety, or irreversible work, stop and ask.
Cleanup mode: if the request explicitly asks for cleanup, broader simplification and deletion are allowed within the requested scope.


1. Think Before Coding
Don't assume. Don't hide confusion. Surface tradeoffs.
Before implementing:

State assumptions explicitly. If uncertain — in Phase B, ask; in Phase A, record and proceed.
If multiple interpretations exist, present them — don't pick silently (Phase B). In Phase A, pick the most reasonable and log the alternatives.
If a simpler approach exists, say so. Push back when warranted.
On resuming a multi-step task after interruption, restate active assumptions.

Before multi-step or ambiguous tasks, state briefly: what you think the request means, your assumptions, what needs clarification, what you plan to change, how you'll verify success.

2. Simplicity First
Minimum code that solves the problem. Nothing speculative.

No features beyond what was asked.
No abstractions for single-use code.
No "flexibility" or "configurability" that wasn't requested.
No error handling for logically impossible scenarios; always handle hardware, I/O, and external failures.
If you write substantially more code than the problem requires, simplify before delivery. (Concretely: if it's 200 lines and could be 50, rewrite it.)


Project resolution — EmbeddingProvider. The earlier plan proposed an EmbeddingProvider interface. Per this section, ship a single concrete embedding implementation. Introduce the interface only when a second provider is actually needed (YAGNI). The pluggability stays a documented intention in MEMORY.md, not code.

Industry patterns (SOLID, GoF) guide thinking but are never forced. Clear over clever in new code. Layered/event-driven patterns shape thinking; stay open to what the domain reveals.

3. Surgical Changes (Phase B law)
Touch only what you must. Clean up only your own mess (unless in cleanup mode).
When existing patterns are harmful, flag it — don't silently match or silently fix. Do not use simplicity as a reason to expand scope in existing code.
When editing existing code:

Don't "improve" adjacent code, comments, or formatting.
Don't refactor things that aren't broken.
Match existing style; if a pattern is harmful, flag rather than copy or fix.
If you notice unrelated dead code, mention it — don't delete it.
Never rename or move files/symbols without explicit instruction.

Safe without asking: fix typos in names/comments you're already editing; remove imports/vars/functions your change made unused; format code you're already modifying.
Ask before (unless explicitly requested): adding dependencies; changing schemas/migrations/stored formats; changing public APIs/shared interfaces/external behavior; renaming or moving beyond the local task; deleting code not made unused by your change.
Prefer modification over rewrite. Never rewrite what currently works without being asked.
The test: every changed line should trace directly to my request.

4. Goal-Driven Execution
Define success criteria. Loop until verified. (Applies in both phases — it is how Phase A stays trustworthy and Phase B stays scoped.)
Transform tasks into verifiable goals — prefer an automated test as the verification wherever one is feasible:

"Add input validation" → write tests for the invalid inputs, then make them pass.
"Fix the bug" → write a test that reproduces it, then make it pass.
"Refactor X" → ensure tests pass before and after; behavior identical.

Verification by task type:

Bug fixes: reproduce with a minimal failing case first, then make it pass.
New features: verify the public interface, not implementation details.
Refactors: verify observable behavior before and after; don't add verification unless behavior changes.

If baseline is broken: say so before changing code; define success relative to the current baseline; don't claim full verification if unrelated failures remain.
After any non-trivial task, report briefly: what changed, what you verified, what remains unverified, problems noticed but intentionally left untouched. If a task can't be fully completed, deliver what's safe, label the incomplete part, state the blocker before stopping.

5. Never Do — hard stops (both phases) unless explicitly authorized

Never run destructive CLI commands (drop, truncate, rm -rf, find -delete, git clean, disk formatting, wipe, or similar).
Never commit or push to version control.
Never modify environment configuration files (.env, secrets, credentials). (Reinforces the core security fix: the CareerNet apiKey must never be committed or client-exposed.)
Never silently change a function's signature, return type, or error contract.
Never catch and suppress an exception or error (no empty catch blocks, no swallowed return codes). (This is the backbone of the "catch everything but leak nothing" error strategy — catching to translate into the standard error shape is required; swallowing is forbidden.)
Never introduce global or shared mutable state.
Never deliver incomplete or stub implementations without labeling them in the task report (Phase A: enumerate in REPORT.md).

When a hard stop applies, say so explicitly, state which rule triggers, and do not proceed until I authorize an exception.

Project resolution — authorized shared-state exceptions. Two encapsulated singletons are explicitly authorized here, satisfying the rule's own "unless explicitly authorized" clause:

The PDF worker's reused Chromium browser — owned by the worker module, lifecycle-managed (restart every N jobs), accessed single-threaded within the worker. Not a free module-global; a managed resource behind a small interface.
The SSE client registry (in-memory connection map per API instance) — owned by realtime/, cleaned up on disconnect, never mutated from outside the module; cross-instance coordination goes through Redis Pub/Sub.

No other shared mutable state is permitted. Anything beyond these two requires a fresh explicit authorization.


6. Documentation
Write docs when complexity demands explanation.

Comment the why, not the what.
Update docs when the behavior they describe changes.
Public APIs and shared interfaces need usage examples.

Don't write docs when the code already says it clearly, you're restating the function name, or the comment will rot faster than the code.
Phase-A build outputs (mandatory): docs/REPORT.md (5-min summary: what was built, tests passed with numbers, load results, open questions), docs/PROGRESS.md, docs/OPEN_QUESTIONS.md, docs/DECISIONS.md, docs/RUNBOOK.md, plus PRD.md / MEMORY.md. Every mock and stub introduced during the build must appear in REPORT.md — this is the contract that lets autonomous building coexist with the no-unlabeled-stubs hard stop.

These guidelines are working if: fewer unnecessary changes in diffs, fewer rewrites from overcomplication, clarifying questions come before implementation (Phase B) rather than after mistakes, and the one-time build leaves a complete, honestly-labeled trail.