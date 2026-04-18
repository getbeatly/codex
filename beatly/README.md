# Beatly Codex plugin

**A procedurally generated soundtrack, composed live while your Codex agent works.**

Not a playlist. Every note is synthesized in real time by a local SuperCollider engine and scored to what the agent is doing right now — tool calls, diffs, tests going green, blockers, breakthroughs.

Built from the main Beatly repo. Install with a Codex marketplace entry that points to this plugin directory.

Hard dependency:

- SuperCollider installed system-wide
- `scsynth` on `PATH`
- `sclang` on `PATH`
