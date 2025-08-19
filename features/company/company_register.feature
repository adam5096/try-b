# language: en
Feature: 企業帳號註冊

  Scenario: 步驟一 - 使用有效的企業資料成功進入下一步
    Given 我在企業註冊頁面
    When 我在"帳號"欄位填寫 "testuser"
    And 我在"Email"欄位填寫 "test@example.com"
    And 我在"密碼"欄位填寫 "Password123"
    And 我在"確認密碼"欄位填寫 "Password123"
    And 我在"企業名稱"欄位填寫 "火星科技股份有限公司"
    And 我在"統一編號"欄位填寫 "12345678"
    And 我在"產業類別"選擇 "資訊科技"
    And 我在"企業規模"選擇 "11-50人"
    And 我在"企業地址"欄位填寫 "台灣台北市信義區市府路45號"
    And 我點擊 "下一步" 按鈕
    Then 我應該會看到"聯絡人資料"的標題

  Scenario: 步驟一 - 未填寫所有必填欄位無法進入下一步
    Given 我在企業註冊頁面
    When 我點擊 "下一步" 按鈕
    Then 我應該仍然停留在"企業資料"的步驟
