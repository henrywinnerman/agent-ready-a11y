// Automated accessibility checks with axe-core.
// We focus on the rules that also decide whether an agent can act:
// names, labels, roles and structure.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const AGENT_CRITICAL_RULES = [
  'button-name',          // buttons need a name
  'label',                // form fields need labels
  'link-name',            // links need a name
  'select-name',          // selects need a name
  'aria-required-attr',   // ARIA roles have what they need
  'aria-valid-attr-value',
  'landmark-one-main',    // a main landmark exists
  'page-has-heading-one',
  'region',               // content sits inside landmarks
];

test('no agent-critical accessibility violations', async ({ page }) => {
  await page.goto('./');
  const results = await new AxeBuilder({ page }).withRules(AGENT_CRITICAL_RULES).analyze();

  // Print a readable summary when it fails.
  const summary = results.violations.map(
    (v) => `${v.id} (${v.nodes.length}): ${v.help}`
  );
  expect(summary, summary.join('\n')).toEqual([]);
});

test('full WCAG 2.2 A/AA scan has no violations', async ({ page }) => {
  await page.goto('./');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();

  const summary = results.violations.map(
    (v) => `${v.id} (${v.nodes.length}): ${v.help}`
  );
  expect(summary, summary.join('\n')).toEqual([]);
});
