import { Given, When, Then } from '@cucumber/cucumber'
import type { ICustomWorld } from '../support/world.js'
import { expect } from '@playwright/test'

Given('我在企業註冊頁面', async function (this: ICustomWorld) {
  const page = this.page!
  await page.goto('http://localhost:3000/company/register')
  await expect(page.locator('span', { hasText: '企業資料' })).toBeVisible()
})

When('我在{string}欄位填寫 {string}', async function (this: ICustomWorld, label: string, value: string) {
  const page = this.page!
  // Use a precise regex to find the label, ensuring an exact match to avoid ambiguity with similar labels (e.g., '密碼' vs '確認密碼').
  const labelRegex = new RegExp(`^${label}( \\*)?$`)
  await page
    .locator('.el-form-item', { has: page.locator('label', { hasText: labelRegex }) })
    .locator('input, textarea')
    .fill(value)
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

Then('我應該看到 {string} 的錯誤訊息', async function (this: ICustomWorld, message: string) {
  const page = this.page!

  // CRITICAL FIX: After an action that triggers validation, the UI might be in a transitional state.
  // We must first wait for a stable element on the current step (like its heading) to be visible again.
  // This ensures the component has finished its update/transition cycle before we look for the error message.
  await expect(page.getByRole('heading', { name: '企業資料' })).toBeVisible()

  // Now that the component is stable, we can reliably locate the error message.
  const fieldLabel = message.replace('為必填', '').trim()
  const placeholderMap: { [key: string]: string } = {
    帳號: '請輸入帳號',
    Email: '請輸入Email',
    密碼: '請輸入密碼',
    確認密碼: '再次輸入密碼',
    企業名稱: '請輸入企業的名稱',
    產業類別: '請選擇企業的產業類別',
    企業規模: '請選擇企業的規模',
    企業地址: '請輸入完整地址'
  }
  const placeholder = placeholderMap[fieldLabel]

  const formItemLocator = page.locator('.el-form-item', {
    has: page.getByPlaceholder(placeholder)
  })

  const errorLocator = formItemLocator.locator('.el-form-item__error')
  await expect(errorLocator).toHaveText(message)
  await expect(errorLocator).toBeVisible()
})

Then('我應該仍然停留在{string}的步驟', async function (this: ICustomWorld, stepTitle: string) {
  const page = this.page!
  await expect(page.getByRole('heading', { name: stepTitle })).toBeVisible()
})