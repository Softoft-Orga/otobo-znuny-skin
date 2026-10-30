---
name: Skin tactic
id: otobo-znuny-skin-tactic
internal_docs_path: /en/docs/internal/otobo-znuny-skin/tactic/
created_at: "2026-10-29"
updated_at: "2026-10-29"
description: Style one OTOBO or Znuny screen at a time, on individual elements, and check it with a screenshot and computed styles.
tags:
  - otobo
  - znuny
  - skin
  - css
project_name: OTOBO and Znuny skins
related_linear_issues:
  - OPE-1406
title: Skin tactic
---

# Skin tactic

A skin here is a set of screens. Work on one screen until its test passes,
then open the next screen. The CSS is longer on purpose. A rule that only
names one element cannot restyle a widget on another screen.

## One screen

1. Open that screen in the running OTOBO at http://127.0.0.1:8111/otobo/ and no other.
2. Add a CSS file whose name is the screen module, next to the other files in
   `skins/otobo/<skin>/Agent/<skin>/css/`. The dashboard file is
   `Core.Agent.Dashboard.css`. OTOBO loads it with the dashboard module only.
   A screen that has no CSS file of its own, such as AgentTicketPhone, needs a
   `Loader::Module::<Action>###100-lab` entry in `otobo/SkinLab.xml`, then
   `scripts/register-skin.ps1`, or the file never reaches the page.
3. Leave `Core.Default.css` empty. That file loads on every agent screen.

## One element

Each rule names one element: an id when OTOBO gives it one, otherwise a
selector you have checked matches a single node on that screen.

Set every property that element needs in that rule. If the title and the
count both need the same color, write the color on both elements. Do not
paint the children from a parent rule, and do not target a shared class
(`.WidgetSimple`, `.Content`, `a`, `button`, `input`).

```css
#Dashboard0120-TicketQueueOverview {
  background-color: #ffffff;
  color: #1a1a1a;
  padding: 16px;
}
```

## One test

Add `tests/e2e/screens/<screen>.spec.ts`. It opens that screen, calls
`captureScreen`, and pins the computed style of each element the CSS names
with `expectStyle`.

`captureScreen` writes two files under `tests/e2e/screenshots/`:

- `<screen>.png` — the page
- `<screen>.styles.json` — computed `color`, `background-color`, `font-size`,
  `padding`, `width`, and the other keys in `support/screen.ts`

A failure names the screen and the element. Fix that rule. Do not add a
selector that also matches a different screen to make the test green.

The dashboard test is `tests/e2e/screens/agent-dashboard.spec.ts`. It logs in
and records `#Header`, `#ToolBar`, and `#Navigation`. When a CSS rule sets
one of those, pass the returned styles to `expectStyle` with the computed
value, for example `background-color: rgb(255, 255, 255)`.
