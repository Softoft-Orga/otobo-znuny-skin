---
name: OTOBO and Znuny skins
id: otobo-znuny-skin
internal_docs_path: /en/docs/internal/otobo-znuny-skin/
created_at: "2026-10-29"
updated_at: "2026-10-30"
description: Local OTOBO 11.1 lab for customer skins. One screen, one element, one CSS rule, checked with screenshots.
tags:
  - otobo
  - znuny
  - skin
project_name: OTOBO and Znuny skins
related_linear_issues:
  - OPE-1406
title: OTOBO and Znuny skins
---

# OTOBO and Znuny skins

Skins for OTOBO and Znuny live here. The first stack is **OTOBO 11.1.1**.
Znuny uses the same screen tactic once this lab is the way we work.
The rules are in [`docs/tactic.md`](docs/tactic.md). Tracked as [OPE-1406](https://linear.app/openticketai/issue/OPE-1406).

## Start OTOBO 11.1.1

From this directory:

```powershell
Copy-Item env.example .env
.\scripts\install.ps1
```

That starts MariaDB and Elasticsearch, copies OTOBO into the volume, runs
`bin/docker/quick_setup.pl`, selects skin `lab`, and starts the daemon.
A second run leaves an existing installation in place.

Open http://127.0.0.1:8111/otobo/index.pl

|          |                  |
| -------- | ---------------- |
| Agent    | `root@localhost` |
| Password | `root`           |

`.\scripts\register-skin.ps1` alone is enough after the install. It selects
skin `lab` and turns off the CSS bundle, so a browser refresh shows an edit
under `skins/otobo/lab/Agent/lab/css/`.

`lab` keeps the OTOBO navy tokens. Four accent options reuse that layout
and replace only `Core.Default.css`:

| Preference name | Accent |
| --------------- | ------ |
| Modern UI Blue | `#24548a` |
| Modern UI Green | `#2a6249` |
| Modern UI Gray | `#4e5666` |
| Modern UI Red | `#8a3d3d` |

An agent picks one under personal preferences. The files are
`skins/accents/*.css`, mounted over the shared screen CSS. The next skin is
another directory beside `lab`, plus its own `Loader::Agent::Skin` block in
`otobo/SkinLab.xml`.

Queue view, status view, and escalation view share
`skins/otobo/lab/Agent/lab/css/Core.Agent.TicketOverview.css`. The same file
also loads on the locked, responsible, watch, and service lists.

## Check a screen

```powershell
cd tests\e2e
npm install
npx playwright install chromium
$env:OTOBO_AGENT_USER = "root@localhost"
$env:OTOBO_AGENT_PASSWORD = "root"
npm test
```

`agent-entry` runs as soon as the web container is up. `agent-dashboard`
logs in and writes `screenshots/agent-dashboard.png` plus
`screenshots/agent-dashboard.styles.json`. `agent-ticket-zoom` also opens
Priority and checks the dialog (`screenshots/agent-ticket-priority.png`).
