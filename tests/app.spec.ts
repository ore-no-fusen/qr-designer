import { test, expect } from '@playwright/test';

test.describe('俺のQR 総合テスト', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('GEN: URLを入力するとリアルタイムでQRが生成され、デザインが固定される', async ({ page }) => {
    const input = page.getByPlaceholder('URLを入力してください');
    await input.fill('https://example.com');
    
    // QR生成完了を待つ
    await expect(page.getByText(/生成時間: \d\.\d{4}s/)).toBeVisible();

    // 紙吹雪アニメーションが終わるまで待機（スクリーンショットの差分を防ぐため）
    await page.waitForTimeout(3500);

    // プレビューエリアのスクリーンショットを撮り、デザインが崩れていないか確認する
    const previewArea = page.locator('.sticky-note-container').locator('..');
    await expect(previewArea).toHaveScreenshot('qr-preview-with-logo.png', { maxDiffPixelRatio: 0.05 });
  });
});
