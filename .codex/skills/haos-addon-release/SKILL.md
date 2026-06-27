---
name: haos-addon-release
description: Use this skill when a user asks to bump the Home Assistant add-on version, update tasks_todo_app/config.yaml, create or push a git tag, or prepare a release for this repository. Always check the latest existing git tag before choosing the next version.
---

# HAOS Add-on Release

Use this workflow for releases of the Home Assistant add-on in `tasks_todo_app/`.

## Files

- `tasks_todo_app/config.yaml`: update the `version` field

## Required workflow

1. Check the current add-on version in `tasks_todo_app/config.yaml`.
2. Check existing git tags before changing anything.
   - Use a version-aware sort such as:
   - `git tag --list 'v*' --sort=version:refname`
3. Choose the next version from the latest existing git tag unless the user explicitly asks for a different valid version.
4. Update `tasks_todo_app/config.yaml` to that version.
5. Stage only the release files intended for that release.
6. Commit with `Release vX.Y.Z` unless the user asks for a different commit message.
7. Create the matching git tag `vX.Y.Z`.
8. If the user asks to publish, push `main` and push the new tag explicitly.
   - Do not rely only on `--follow-tags` for lightweight tags.
9. Verify the result:
   - `tasks_todo_app/config.yaml` shows the new version
   - `git tag --list 'vX.Y.Z'` returns the tag
   - if pushed, confirm the branch and tag both reached `origin`

## Guardrails

- Never assume the next version from memory; always inspect git tags first.
- If the repo state is already ahead of what the user expects, tell them the exact current version and tag before changing anything.
- Keep unrelated worktree changes out of the release commit unless the user explicitly wants them included.
- If the user wants multiple logical changes released, prefer separate version bumps and separate tags.

## Useful commands

```bash
sed -n '1,40p' tasks_todo_app/config.yaml
git tag --list 'v*' --sort=version:refname
git status --short
git add tasks_todo_app/config.yaml
git commit -m "Release vX.Y.Z"
git tag vX.Y.Z
git push origin main
git push origin vX.Y.Z
```
