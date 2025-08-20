import { Given, When, Then } from '@cucumber/cucumber'
import type { ICustomWorld } from '../support/world.js'
import { expect } from '@playwright/test'

// ##################
// # CUCUMBER STEPS #
// ##################

Given('我在企業註冊頁面', async function (this: ICustomWorld) {
  const page = this.page!
  await page.goto('http://localhost:3000/company/register')
  await expect(page.getByRole('heading', { name: '企業資料' })).toBeVisible()
})

When('我在{string}欄位填寫 {string}', async function (this: ICustomWorld, label: string, value: string) {
  const page = this.page!
  const cleanLabel = label.replace(/"/g, '')
  const cleanValue = value.replace(/"/g, '')
  // 使用 getByLabel 找到 Element Plus 的 form-item 容器，再用 locator('input') 找到裡面的輸入框
  // 加上 RegExp 來處理 "標籤 *" 這種情況
  await page.getByLabel(new RegExp(`^${cleanLabel}`)).locator('input').fill(cleanValue)
})

When('我在{string}選擇 {string}', async function (this: ICustomWorld, label: string, value: string) {
  const page = this.page!
  const cleanLabel = label.replace(/"/g, '')
  const cleanValue = value.replace(/"/g, '')

  // 1. 點擊觸發器以展開下拉選單
  // 這裡使用 getByLabel 來找到整個 form-item，再找到裡面的 combobox 觸發器，這部分是正確的。
  await page.getByLabel(new RegExp(`^${cleanLabel}`)).click()

  // 2. 直接點擊目標選項 (Option)
  // 這是最關鍵的改動。我們使用 getByRole('option', { name: ... }) 來定位。
  // Playwright 的 .click() 會自動等待元素出現並變得可點擊（可見、穩定、未被遮擋），
  // 因此無需再手動寫 expect(...).toBeVisible()。
  await page.getByRole('option', { name: cleanValue, exact: true }).click()
})

When('我點擊 {string} 按鈕', async function (this: ICustomWorld, buttonText: string) {
  const page = this.page!
  const cleanButtonText = buttonText.replace(/"/g, '')
  await page.getByRole('button', { name: cleanButtonText }).click()
})

Then('我應該會看到{string}的標題', async function (this: ICustomWorld, title: string) {
  const page = this.page!
  const cleanTitle = title.replace(/"/g, '')
  await expect(page.getByRole('heading', { name: cleanTitle, exact: true })).toBeVisible({ timeout: 10000 })
})

// --- 動態資料步驟 ---
When('我在"帳號"欄位填寫一個隨機的有效帳號', async function (this: ICustomWorld) {
  const page = this.page!
  const timestamp = Date.now()
  const account = `testuser${timestamp}`
  // 這裡我們知道確切的 label，但同樣需要 .locator('input')
  await page.getByLabel('帳號 *').locator('input').fill(account)
})

When('我在"Email"欄位填寫一個隨機的有效Email', async function (this: ICustomWorld) {
  const page = this.page!
  const timestamp = Date.now()
  const email = `test${timestamp}@example.com`
  await page.getByLabel('Email *').locator('input').fill(email)
})