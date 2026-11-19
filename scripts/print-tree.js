// Print the accessibility tree of the broken and fixed pages side by side,
// so you can see exactly what an agent gets in each case.
// Usage: npm run snapshot   (start the server first with: npm start)
import { chromium } from '@playwright/test';

const base = process.env.BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch();
const page = await browser.newPage();

for (const site of ['broken', 'fixed']) {
  await page.goto(`${base}/${site}/`);
  const tree = await page.locator('body').ariaSnapshot();
  console.log(`\n===== ${site.toUpperCase()} =====\n${tree}`);
}

await browser.close();
