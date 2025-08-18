import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../support/world';
import { expect } from '@playwright/test';

Given('我在企業註冊頁面', async function (this: ICustomWorld) {
  const page = this.page!;
  await page.goto('http://localhost:3000/company/register');
  await expect(page.locator('h1')).toContainText('企業註冊');
});

When('我在「{string}」欄位填寫 "{string}"', function (this: ICustomWorld, label: string, value: string) {
  // TODO: Implement filling a text field
});

When('我在「{string}」選擇 "{string}"', function (this: ICustomWorld, label: string, option: string) {
  // TODO: Implement selecting an option
});

When('我點擊 "{string}" 按鈕', async function (this: ICustomWorld, buttonText: string) {
  const page = this.page!;
  await page.getByRole('button', { name: buttonText }).click();
});

Then('我應該會看到「{string}」的標題', function (this: ICustomWorld, title: string) {
  // TODO: Implement title visibility check
});

Then('我應該看到 "{string}" 的錯誤訊息', function (this: ICustomWorld, message: string) {
  // TODO: Implement error message visibility check
});

Then('我應該仍然停留在「{string}」的步驟', function (this: ICustomWorld, stepTitle: string) {
  // TODO: Implement step visibility check
});
