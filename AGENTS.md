# Repo Instructions

## Approval-Gated Push Flow

When you make or modify code in this repository:

1. Finish the requested code changes first.
2. Summarize the changes and ask the user whether to push them.
3. Do not run `git push` unless the user explicitly approves in the current conversation.
4. If the user approves, stage the relevant changes, create a commit, and push the current branch to `origin`.
5. If no branch exists on `origin`, push with upstream tracking.
6. If the working tree contains unrelated user changes, do not include them unless the user explicitly approves that scope.

## Commit Rules

- Prefer a short, descriptive commit message based on the change you just made.
- Do not amend existing commits unless the user explicitly asks.
- If there is nothing to commit, report that clearly instead of pushing.
