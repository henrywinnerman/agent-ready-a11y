# Agent-Ready Accessibility Tests

Companion repo for the Smashing Magazine article *What AI Agents See: Testing Your Accessibility Tree With Playwright*.

AI browser agents and screen readers read the same thing: the **accessibility tree** (roles, names, states). This repo shows how to test that tree with Playwright and axe-core. It uses a small checkout page in two versions:

- `site/broken/` has common real-world failures: a `<div>` "button", a `<div>` dropdown, placeholder-only fields, unlabelled icon buttons, no landmarks, and a status message that isn't announced.
- `site/fixed/` is the same page built with semantic HTML, plus optional WebMCP annotations.

## Quick start

Requires Node 20+.

```bash
npm install
npx playwright install chromium
npm test                 # tests the fixed page: 5 passed
npm run test:broken      # tests the broken page: 5 failed
npx playwright show-report
```

To see what an agent "sees":

```bash
npm start                # in one terminal
npm run snapshot         # in another
```

## What the agent sees

**Broken page.** "Place order" and the delivery dropdown are plain text, so an agent has nothing to click:

```yaml
- text: Checkout Blue Ceramic Mug — £12
- button:
  - img
- text: "1"
- button:
  - img
- textbox "Email"
- textbox "Full name"
- text: Standard delivery Place order
```

**Fixed page.** Every control has a role and a name:

```yaml
- main:
  - heading "Checkout" [level=1]
  - region "Blue Ceramic Mug — £12":
    - heading "Blue Ceramic Mug — £12" [level=2]
    - button "Decrease quantity"
    - status "Quantity": "1"
    - button "Increase quantity"
  - textbox "Email"
  - textbox "Full name"
  - combobox "Delivery":
    - option "Standard delivery" [selected]
    - option "Express delivery"
  - button "Place order"
  - status
```

## Why you need both test types

On the broken page, axe-core reports `button-name`, `landmark-one-main`, `page-has-heading-one` and `region`. It does **not** flag the `<div>` "Place order" button or the `<div>` dropdown, because a div with a click handler isn't a rule violation it can detect. Those are exactly the controls an agent needs most.

The accessibility-tree tests (`tests/agent-view.spec.js`) catch them, because they assert that the controls exist with the right role and name.

| Test file | What it checks |
| --- | --- |
| `tests/agent-view.spec.js` | `toMatchAriaSnapshot()` on the critical path, plus a full checkout using only `getByRole()` lookups, the way a tree-reading agent would |
| `tests/axe.spec.js` | axe-core rules that matter for agents (names, labels, landmarks), then a full WCAG 2.2 A/AA scan |

## WebMCP (optional, experimental)

`site/fixed/index.html` adds two WebMCP enhancements:

1. **Declarative.** `toolname`, `tooldescription` and `toolparamdescription` attributes on the checkout form.
2. **Imperative.** A feature-detected `set-quantity` tool registered with `registerTool()`.

WebMCP is a W3C Community Group draft, not a standard. The API has moved from `navigator.modelContext` to `document.modelContext`, so the code checks both. Browsers without WebMCP ignore all of it. Check the current spec before relying on attribute or method names.

## CI

`.github/workflows/a11y.yml` runs the suite on every push and pull request and uploads the HTML report.

## What this doesn't replace

Passing these tests means the tree is usable. It does not prove the page is accessible. Test with a keyboard, with a screen reader (NVDA, VoiceOver), and with disabled users.

## License

MIT
