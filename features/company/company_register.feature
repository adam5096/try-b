# language: en
@company-register
Feature: 公司註冊流程
  為了讓公司能夠使用我們的平台，我們需要提供一個簡單明瞭的註冊流程。

  Background:
    Given 我在企業註冊頁面

  @wip
  Scenario: 使用有效的資料成功完成註冊 (快樂路徑)
    When 我在"帳號"欄位填寫一個隨機的有效帳號
    And 我在"Email"欄位填寫一個隨機的有效Email
    And 我在"密碼"欄位填寫 "Password!123"
    And 我在"確認密碼"欄位填寫 "Password!123"
    And 我在"企業名稱"欄位填寫 "testcompany"
    And 我在"企業地址"欄位填寫 "台灣台北市信義區市府路45號"
    And 我點擊 "下一步" 按鈕
    Then 我應該會看到"聯絡人資料"的標題
    When 我在"聯絡人姓名"欄位填寫 "陳大文"
    And 我在"職稱"欄位填寫 "專案經理"
    And 我在"電子郵件"欄位填寫 "david.chen@example.com"
    And 我在"聯絡電話"欄位填寫 "0912345678"
    And 我點擊 "註冊" 按鈕
    Then 我應該會看到"恭喜您，註冊成功！"的標題
    When 我點擊 "前往登入頁面" 按鈕
    Then 我應該會看到"歡迎回來"的標題

  Scenario: 在第二步點擊上一步應該能無條件返回第一步
    # --- 先走完第一步 ---
    When 我在"帳號"欄位填寫一個隨機的有效帳號
    And 我在"Email"欄位填寫一個隨機的有效Email
    And 我在"密碼"欄位填寫 "Password!123"
    And 我在"確認密碼"欄位填寫 "Password!123"
    And 我在"企業名稱"欄位填寫 "testcompany"
    And 我在"企業地址"欄位填寫 "台灣台北市信義區市府路45號"
    And 我點擊 "下一步" 按鈕
    Then 我應該會看到"聯絡人資料"的標題
    # --- 在第二步操作 ---
    When 我在"聯絡人姓名"欄位填寫 "隨便填寫"
    And 我點擊 "上一步" 按鈕
    # --- 驗證結果 ---
    Then 我應該會看到"企業資料"的標題
