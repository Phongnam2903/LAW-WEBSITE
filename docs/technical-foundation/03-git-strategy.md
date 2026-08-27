# 03 — Git Strategy

Status: Complete

## Branching Model

A trunk-based-with-develop model, sized for a small fullstack team (matches the existing `main` / `feature/phase2` / `feature/phase3` pattern already in use — this formalizes it rather than replacing it).

```text
main        # always deployable; production-representative
develop     # integration branch for in-progress feature work
feature/*   # one branch per feature or task, branched from develop
fix/*       # bug fixes, branched from develop (or from main for hotfixes)
docs/*      # documentation-only changes
```

| Branch | Responsibility |
|---|---|
| `main` | Stable, always releasable. Protected. Only receives merges via PR from `develop` (or an approved `fix/*` hotfix). |
| `develop` | Integration branch. Feature/fix/docs branches merge here first. Protected — no direct pushes. |
| `feature/*` | New functionality or foundation work, e.g. `feature/phase3`, `feature/lead-management`. Branched from `develop`, merged back via PR. |
| `fix/*` | Bug fixes. Branched from `develop`; branched from `main` only for an urgent production hotfix, then back-merged into `develop`. |
| `docs/*` | Documentation-only changes that don't touch application code. |

This repository currently has `main` and `feature/phase2`/`feature/phase3` branching directly off `main` (no `develop` yet, per Task 01 audit). PROPOSED: introduce `develop` starting with the first post-Phase-3 feature branch, once Phase 3 merges to `main`. Continuing to branch Phase 3 itself directly from `main` is acceptable and is not changed retroactively.

## Pull Request Flow

1. Branch from `develop` (or `main` for a hotfix).
2. Commit using Conventional Commits (below).
3. Open a PR targeting `develop` (or `main` for a hotfix).
4. PR must include: what changed, why, and how it was validated (commands run, screenshots for UI).
5. At least one review pass before merge (self-review acceptable for a solo/small team, but the PR description must still state validation performed).
6. Squash-merge preferred, to keep `develop`/`main` history linear and readable; the squash commit message follows Conventional Commits.
7. Delete the branch after merge.

## Merge Rules

- No direct pushes to `main` or `develop` — always via PR.
- `main` only receives merges from `develop` or an approved hotfix `fix/*` branch.
- CI (Task 11) must pass before merge is allowed.
- No merging with unresolved review comments.

## Commit Conventions

[Conventional Commits](https://www.conventionalcommits.org/):

```text
feat:     new feature
fix:      bug fix
docs:     documentation only
refactor: code change that neither fixes a bug nor adds a feature
test:     adding or correcting tests
chore:    tooling, dependency bumps, config that isn't CI or build
ci:       CI/CD pipeline changes
build:    build system or packaging changes
```

Format: `<type>(optional scope): <short summary>`. Example: `feat(backend): add JPA entity for Lead`.

## Release / Tagging Approach

- No formal release/versioning cadence is required during Phase 3 (no production deployment yet — see Strict Scope Boundary in the master prompt).
- PROPOSED for later phases: tag `main` at each production release using semantic versioning (`vX.Y.Z`), once a deployment target exists. This is intentionally left open — see `TF-OQ-009` in `assumptions-open-questions.md`.

## Protected Branch Recommendations

- `main`: require PR, require passing CI status checks, require up-to-date branch before merge, no force-push, no deletion.
- `develop`: same as `main` minus any production-deploy-gating checks.

## Scope Note

Per the master prompt: **no commits or pushes are made as part of Phase 3 execution unless the user explicitly requests them.** This document defines the convention; it does not itself trigger any git operations. GitHub branch-protection rules (which require repo admin access via the GitHub UI/API) are documented here as a recommendation, not applied automatically.
