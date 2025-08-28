# API 架構文檔

## 📋 概述
本專案使用**統一且分離**的 API 架構：
- **Company 模塊**: 使用 `useCompanyApiFetch` 直接連接後端
- **Users 模塊**: 使用 `useUserApiFetch` 直接連接後端  
- **共享基礎**: 使用 `useApiFetch` 作為底層

## 🏗️ 分層架構設計

### 📦 架構層級
```
useCompanyApiFetch (Company JWT Token)
useUserApiFetch    (User JWT Token)
        ↓
useApiFetch (共享基礎層 + baseURL)
        ↓
useFetch (Nuxt 原生)
```

## 🔧 API 模塊結構

### Users 模塊
- **檔案位置**: `composables/api/users/`
- **專用函數**: `useUserApiFetch`  
- **路徑格式**: `/api/v1/users/{endpoint}`
- **認證方式**: User JWT token 自動注入
- **Base URL**: `useRuntimeConfig().public.apiBase`

#### 範例：
```typescript
// ✅ 正確
useUserApiFetch('/api/v1/users/login', { ... })
useUserApiFetch('/api/v1/users/programs', { ... })
```

### Company 模塊
- **檔案位置**: `composables/api/company/`
- **專用函數**: `useCompanyApiFetch`
- **路徑格式**: `/api/v1/company/{endpoint}`  
- **認證方式**: Company JWT token 自動注入
- **Base URL**: `useRuntimeConfig().public.apiBase`

#### 範例：
```typescript
// ✅ 正確
useCompanyApiFetch('/api/v1/plans', { ... })
useCompanyApiFetch('/api/v1/company/programs', { ... })
```

## 🔧 調試工具

### Proxy 日誌格式
```
🔀 Proxy rewrite: /api-proxy/v1/users/login → /api/v1/users/login
📤 Sending Request: POST /api/v1/users/login → /api/v1/users/login
📥 Received Response: 200 for /api/v1/users/login
```

### API 請求日誌格式
```
🚀 useUserApiFetch - Request: { url, method, body, headers }
✅ useUserApiFetch - Response: { status, url }
❌ useUserApiFetch - Response Error: { status, url, error }
```

## ⚠️ 常見錯誤

### 1. 路徑重複 `/api`
```typescript
// ❌ 錯誤 - 會導致 /api/api/v1/users/login
'/api-proxy/api/v1/users/login'

// ✅ 正確
'/api-proxy/v1/users/login'
```

### 2. 混用 API 模塊
```typescript
// ❌ 錯誤 - 在 users 模塊使用 company 的 useApiFetch
useApiFetch('/api-proxy/v1/users/login')

// ✅ 正確 - 使用對應模塊的 API 函數
useUserApiFetch('/api-proxy/v1/users/login')
```

## 🚀 最佳實踐

1. **開發前先確認 API 路徑**
2. **使用對應模塊的 API 函數**
3. **檢查 proxy 重寫日誌**
4. **測試時先檢查 Network 標籤**
5. **保持 company 和 users 模塊邏輯分離**

## 📚 相關檔案

- `nuxt.config.ts` - Proxy 配置
- `composables/api/users/useUserApiFetch.ts` - Users API 處理
- `composables/api/shared/useApiFetch.ts` - Company API 處理
- `stores/user/useAuthStore.ts` - Users 認證狀態
- `stores/company/useAuthStore.ts` - Company 認證狀態
