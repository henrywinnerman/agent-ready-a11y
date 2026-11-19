// What an AI agent (or a screen reader) "sees" on the checkout page.
// Playwright's ariaSnapshot reads the accessibility tree: roles, names, states.
// If a control has no role or no name, it won't appear here, and agents
// that rely on the tree can't find or use it.
import { test, expect } from '@playwright/test';

test.describe('Checkout: the accessibility tree an agent reads', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('page has a main landmark and a real heading', async ({ page }) => {
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - main:
        - heading "Checkout" [level=1]
    `);
  });

  test('every control in the critical path has a role and a name', async ({ page }) => {
    // Partial match: nodes not listed are ignored, but nesting and order
    // must match the real tree.
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - main:
        - region "Blue Ceramic Mug — £12":
          - button "Decrease quantity"
          - button "Increase quantity"
        - textbox "Email"
        - textbox "Full name"
        - combobox "Delivery"
        - button "Place order"
    `);
  });

  test('an agent can complete checkout using roles and names only', async ({ page }) => {
    // These are the same kinds of lookups a tree-reading agent makes.
    await page.getByRole('button', { name: 'Increase quantity' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('ada@example.com');
    await page.getByRole('textbox', { name: 'Full name' }).fill('Ada Lovelace');
    await page.getByRole('combobox', { name: 'Delivery' }).selectOption('express');
    await page.getByRole('button', { name: 'Place order' }).click();

    // Two live "status" regions exist (quantity and order status), so filter.
    await expect(page.getByRole('status').filter({ hasText: 'Order placed' })).toHaveText(/Order placed for 2 mug\(s\), express delivery/);
  });
});
