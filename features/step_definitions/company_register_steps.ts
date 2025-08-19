import { Given, When, Then } from '@cucumber/cucumber'
import type { ICustomWorld } from '../support/world.js'
import { expect } from '@playwright/test'

Given('我在企業註冊頁面', async function (this: ICustomWorld) {
  const page = this.page!
  await page.goto('http://localhost:3000/company/register')
  await expect(page.locator('h1', { hasText: '企業資料' })).toBeVisible()
})

When('我在{string}欄位填寫 {string}', async function (this: ICustomWorld, label: string, value: string) {
  const page = this.page!
  const labelRegex = new RegExp(`^${label}( \\*)?$`)
  const locator = page
    .locator('.el-form-item', { has: page.locator('label', { hasText: labelRegex }) })
    .locator('input, textarea')

  await locator.fill('')
  if (value) {
    await locator.fill(value)
  }
})

When('我在{string}選擇 {string}', async function (this: ICustomWorld, label: string, optionText: string) {
  const page = this.page!
  const labelRegex = new RegExp(`^${label}( \\*)?$`)
  await page
    .locator('.el-form-item', { has: page.locator('label', { hasText: labelRegex }) })
    .locator('.el-select')
    .click()
  await page.getByRole('option', { name: optionText }).click()
})

When('我點擊 {string} 按鈕', async function (this: ICustomWorld, buttonText: string) {
  const page = this.page!
  await page.getByRole('button', { name: buttonText }).click()
})

Then('我應該會看到{string}的標題', async function (this: ICustomWorld, title: string) {
  const page = this.page!
  await expect(page.getByRole('heading', { name: title })).toBeVisible()
})