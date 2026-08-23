---
description: Pair a phone running Build Remote Agent to this OpenCode session (gbr/1 spectator). Run in the session that should be watched.
---

# Build Remote Agent pairing

You are tasked with attaching **Build Remote Agent** as a pairing device for this OpenCode / Agentic session.

Protocol `gbr/1`. One adapter. No fourth pair protocol. Independent product by Linespotting AB. Not affiliated with xAI or SpaceX.

Phone is spectator + veto, not orchestrator. Agentic commands (`/research`, `/plan`, `/execute`, …) stay in charge.

## Steps

1. **Diagnose** whether `gbr-agent` is installed and new enough:

```bash
gbr-agent version    # need v0.6.0+
```

If missing:

```bash
curl -fsSL https://grokbuildremote.com/install.sh | bash
```

Windows: `irm https://grokbuildremote.com/install.ps1 | iex`

2. **Pair** (if this PC is not already paired):

```bash
gbr-agent pair
```

This prints an 8-char code and opens a browser QR. Phone: [Build Remote Agent](https://grokbuildremote.com/) → scan QR **or** type the code. Unpair on the phone before a new mailbox. Force-close is not enough.

3. **Run** the agent and leave it running:

```bash
gbr-agent run
```

4. **Attach** only these loopback surfaces:

| How | Where |
|-----|--------|
| Bot API | `http://127.0.0.1:8788` |
| MCP | `gbr-mcp` stdio |

```bash
curl -sS http://127.0.0.1:8788/health
curl -sS http://127.0.0.1:8788/v1/sessions
```

MCP (optional, OpenCode `opencode.json`):

```bash
git clone https://github.com/LinespottingOrg/GrokBuildRemote-Agents.git
cd GrokBuildRemote-Agents/mcp/gbr-mcp && npm install
node bin/gbr-mcp.js --diagnose
```

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "gbr": {
      "type": "local",
      "command": ["node", "GrokBuildRemote-Agents/mcp/gbr-mcp/bin/gbr-mcp.js"],
      "enabled": true
    }
  }
}
```

5. **Loop** (same JSON as Grok bot / Claude Cowork):

diagnose → open/attach → lock → inject → wait idle → harvest excerpt → iterate or close

Never commit mailbox keys. Phone **Settings → Bot API** is the only place the relay key is copied.

Docs: https://github.com/LinespottingOrg/GrokBuildRemote-Agents/blob/main/docs/BOT-API.md
