const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log('[browser console]', msg.type(), msg.text());
  });
  page.on('pageerror', err => {
    console.error('[page error]', err);
  });

  await page.goto('http://localhost:4173/game/index.html');
  await page.waitForSelector('#ship-grid .ship-card');
  const pickleCard = page.locator('.ship-card', { hasText: 'Pickle' });
  await pickleCard.click();
  await page.click('#overlay-start');
  await page.waitForTimeout(1500);
  await page.click('#game');
  await page.waitForTimeout(300);
  await page.keyboard.down('Shift');
  await page.waitForTimeout(200);
  await page.keyboard.up('Shift');
  await page.waitForTimeout(4000);
  await browser.close();
})();
