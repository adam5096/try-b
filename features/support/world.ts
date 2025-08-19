import { After, Before, setWorldConstructor, World, setDefaultTimeout, AfterStep } from '@cucumber/cucumber';
import type { IWorldOptions, ITestCaseHookParameter } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';

setDefaultTimeout(60 * 1000); // Set timeout to 60 seconds

export interface ICustomWorld extends World {
  browser?: Browser;
  page?: Page;
}

class CustomWorld extends World implements ICustomWorld {
  browser?: Browser;
  page?: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);

Before(async function (this: ICustomWorld) {
  this.browser = await chromium.launch({ headless: false });
  this.page = await this.browser.newPage();

  // Inject CSS to disable animations and transitions
  const disableAnimationsStyle = `
    *,
    *::before,
    *::after {
      transition-property: none !important;
      transform: none !important;
      animation: none !important;
    }
  `;
  await this.page.addStyleTag({ content: disableAnimationsStyle });
});

After(async function (this: ICustomWorld) {
  await this.browser?.close();
});

// 新增：在每個步驟執行後運行的鉤子
AfterStep(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
  // 只有在步驟失敗時才執行
  if (result?.status === 'FAILED') {
    const page = this.page;
    if (page) {
      // 根據時間戳建立一個獨一無二的檔案名稱
      const screenshotName = `screenshot-${Date.now()}.png`;
      // 儲存截圖到專案根目錄
      await page.screenshot({ path: screenshotName, fullPage: true });
      this.attach(`Screenshot taken on failure: ${screenshotName}`);
    }
  }
});
