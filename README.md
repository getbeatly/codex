# Beatly Codex marketplace

**A procedurally generated soundtrack, composed live while your Codex agent works.**

Not a playlist. Every note is synthesized in real time and scored to what the agent is doing right now — tool calls, diffs, tests, blockers, breakthroughs. The music _is_ the agent's run.

Published automatically from https://github.com/getbeatly/beatly.

## Install

```bash
codex marketplace add https://github.com/getbeatly/codex
codex --enable plugins
```

Then, inside the Codex TUI, run `/plugins` and install **beatly** from the **Beatly Plugins** marketplace.

Requires SuperCollider (`scsynth` + `sclang`) on `PATH`.
