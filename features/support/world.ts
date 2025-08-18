import { After, Before, setWorldConstructor, World, setDefaultTimeout } from '@cucumber/cucumber';
import type { IWorldOptions } from '@cucumber/cucumber';
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
});

After(async function (this: ICustomWorld) {
  await this.browser?.close();
});
