// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Omikuji App', () => {
  test.beforeEach(async ({ page }) => {
    const path = require('path');
    const filePath = path.resolve(__dirname, '../index.html');
    await page.goto(`file://${filePath}`);
  });

  test('should display initial state correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle('おみくじアプリ');

    // Check main heading
    await expect(page.locator('h1')).toHaveText('🎋 おみくじ 🎋');

    // Check footer message
    await expect(page.locator('footer p')).toHaveText('今日の運勢を占ってみましょう！');

    // Check initial button state
    await expect(page.locator('#drawButton')).toBeVisible();
    await expect(page.locator('#drawButton')).toHaveText('おみくじを引く');

    // Check that result and reset button are hidden
    await expect(page.locator('#result')).toHaveClass(/hidden/);
    await expect(page.locator('#resetButton')).toHaveClass(/hidden/);
  });

  test('should show loading state when drawing fortune', async ({ page }) => {
    const drawButton = page.locator('#drawButton');

    // Click the draw button
    await drawButton.click();

    // Check loading state
    await expect(drawButton).toHaveText('おみくじを引いています...');

    // Verify button is disabled during loading
    await expect(drawButton).toHaveCSS('pointer-events', 'none');
  });

  test('should display fortune result after loading', async ({ page }) => {
    const drawButton = page.locator('#drawButton');
    const result = page.locator('#result');
    const resetButton = page.locator('#resetButton');
    const fortuneLevel = page.locator('.fortune-level');
    const fortuneMessage = page.locator('.fortune-message');

    // Click draw button
    await drawButton.click();

    // Wait for loading to complete (1.5 seconds + some buffer)
    await page.waitForTimeout(2000);

    // Check that result is now visible
    await expect(result).not.toHaveClass(/hidden/);
    await expect(drawButton).toHaveClass(/hidden/);
    await expect(resetButton).not.toHaveClass(/hidden/);

    // Check that fortune level is one of the expected values
    const fortuneLevelText = await fortuneLevel.textContent();
    const expectedFortunes = ['大吉', '吉', '中吉', '小吉', '凶', '大凶'];
    expect(expectedFortunes).toContain(fortuneLevelText);

    // Check that fortune message is not empty
    await expect(fortuneMessage).not.toBeEmpty();

    // Check that fortune level has appropriate CSS class
    const fortuneClass = await fortuneLevel.getAttribute('class');
    expect(fortuneClass).toMatch(/fortune-level (daikichi|kichi|chukichi|shokichi|kyo|daikyo)/);

    // Check reset button text
    await expect(resetButton).toHaveText('もう一度引く');
  });

  test('should reset to initial state when reset button is clicked', async ({ page }) => {
    const drawButton = page.locator('#drawButton');
    const result = page.locator('#result');
    const resetButton = page.locator('#resetButton');
    const fortuneLevel = page.locator('.fortune-level');
    const fortuneMessage = page.locator('.fortune-message');

    // Draw fortune first
    await drawButton.click();
    await page.waitForTimeout(2000);

    // Verify result is shown
    await expect(result).not.toHaveClass(/hidden/);

    // Click reset button
    await resetButton.click();

    // Check that state is reset to initial
    await expect(result).toHaveClass(/hidden/);
    await expect(drawButton).not.toHaveClass(/hidden/);
    await expect(drawButton).toHaveText('おみくじを引く');
    await expect(resetButton).toHaveClass(/hidden/);

    // Check that fortune content is cleared
    await expect(fortuneLevel).toBeEmpty();
    await expect(fortuneMessage).toBeEmpty();
    await expect(fortuneLevel).toHaveClass('fortune-level');
  });

  test('should be able to draw fortune multiple times', async ({ page }) => {
    const drawButton = page.locator('#drawButton');
    const resetButton = page.locator('#resetButton');
    const fortuneLevel = page.locator('.fortune-level');

    const drawnFortunes = [];

    // Draw fortune multiple times to test randomness
    for (let i = 0; i < 3; i++) {
      // Draw fortune
      await drawButton.click();
      await page.waitForTimeout(2000);

      // Record the fortune
      const fortune = await fortuneLevel.textContent();
      drawnFortunes.push(fortune);

      // Reset for next iteration
      if (i < 2) { // Don't reset on the last iteration
        await resetButton.click();
      }
    }

    // Verify all fortunes are valid
    const expectedFortunes = ['大吉', '吉', '中吉', '小吉', '凶', '大凶'];
    drawnFortunes.forEach(fortune => {
      expect(expectedFortunes).toContain(fortune);
    });

    console.log('Drawn fortunes:', drawnFortunes);
  });

  test('should have proper CSS styling applied', async ({ page }) => {
    const container = page.locator('.container');
    const drawButton = page.locator('#drawButton');

    // Check container styling
    await expect(container).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(container).toHaveCSS('border-radius', '20px');

    // Check button styling
    await expect(drawButton).toHaveCSS('cursor', 'pointer');
    await expect(drawButton).toHaveCSS('border-radius', '50px');

    // Check responsive behavior
    const viewportSize = await page.viewportSize();
    expect(viewportSize.width).toBeGreaterThan(0);
  });

  test('should handle rapid clicks gracefully', async ({ page }) => {
    const drawButton = page.locator('#drawButton');

    // Click once, then try to click rapidly while disabled
    await drawButton.click();

    // Should show loading state
    await expect(drawButton).toHaveText('おみくじを引いています...');

    // Try to click multiple times during loading (should be ignored)
    // Use force: true to bypass actionability checks since the button is disabled
    await drawButton.click({ force: true });
    await drawButton.click({ force: true });

    // Should still show loading state (not affected by rapid clicks)
    await expect(drawButton).toHaveText('おみくじを引いています...');

    // Wait for completion
    await page.waitForTimeout(2000);

    // Should show result normally
    await expect(page.locator('#result')).not.toHaveClass(/hidden/);
  });

  test('should display correct fortune messages', async ({ page }) => {
    const drawButton = page.locator('#drawButton');
    const fortuneMessage = page.locator('.fortune-message');

    // Draw fortune
    await drawButton.click();
    await page.waitForTimeout(2000);

    // Get the message text
    const messageText = await fortuneMessage.textContent();

    // Check that message contains expected patterns (since messages are long)
    expect(messageText.length).toBeGreaterThan(10);
    expect(messageText).toMatch(/[。！]/); // Should contain Japanese punctuation
  });

  test('should maintain accessibility standards', async ({ page }) => {
    // Check that buttons are keyboard accessible
    await page.keyboard.press('Tab');
    await expect(page.locator('#drawButton')).toBeFocused();

    // Check that pressing Enter activates the button
    await page.keyboard.press('Enter');
    await expect(page.locator('#drawButton')).toHaveText('おみくじを引いています...');

    // Wait for completion and check reset button accessibility
    await page.waitForTimeout(2000);
    await page.keyboard.press('Tab');
    await expect(page.locator('#resetButton')).toBeFocused();
  });

  test('should work correctly with different viewport sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const drawButton = page.locator('#drawButton');
    await expect(drawButton).toBeVisible();

    // Draw fortune on mobile
    await drawButton.click();
    await page.waitForTimeout(2000);

    // Should still work on mobile
    await expect(page.locator('#result')).not.toHaveClass(/hidden/);

    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('#result')).not.toHaveClass(/hidden/);
  });
});