import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { UserRegisterData } from '../../types/users/user'

// 模擬 $fetch
const mockFetch = vi.fn()

// 設定全域 $fetch 模擬
Object.defineProperty(global, '$fetch', {
	value: mockFetch,
	writable: true
})

describe('useUserRegister', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('register 函數', () => {
		// 測試資料
		const validRegisterData: UserRegisterData = {
			name: 'monday66',
			account: 'monday66',
			email: 'monday66@gmail.com',
			password: '1qaz2wsx'
		}

		const expectedResponse = {
			status: 201,
			message: '註冊成功',
			id: 42,
			Role: 'Participant',
			Account: 'monday66',
			Email: 'monday66@gmail.com',
			CreatedAt: '2025-09-16T18:24:09.540355+08:00',
			UpdatedAt: '2025-09-16T18:24:09.540355+08:00'
		}

		it('應該成功註冊用戶並返回正確的響應格式', async () => {
			// 模擬成功的 API 響應
			mockFetch.mockResolvedValue(expectedResponse)

			// 動態導入 composable
			const { useUserRegister } = await import('../../composables/api/users/useUserRegister')
			const { register } = useUserRegister()

			const result = await register(validRegisterData)

			// 驗證 API 呼叫
			expect(mockFetch).toHaveBeenCalledWith('/api/v1/users/register', {
				method: 'POST',
				body: validRegisterData
			})

			// 驗證回應格式
			expect(result).toEqual(expectedResponse)
			expect(result.status).toBe(201)
			expect(result.message).toBe('註冊成功')
			expect(result.id).toBe(42)
			expect(result.Role).toBe('Participant')
			expect(result.Account).toBe('monday66')
			expect(result.Email).toBe('monday66@gmail.com')
			expect(result.CreatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
			expect(result.UpdatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
		})

		it('應該正確傳遞所有必要的註冊資料', async () => {
			mockFetch.mockResolvedValue(expectedResponse)

			const { useUserRegister } = await import('../../composables/api/users/useUserRegister')
			const { register } = useUserRegister()

			await register(validRegisterData)

			expect(mockFetch).toHaveBeenCalledWith('/api/v1/users/register', {
				method: 'POST',
				body: {
					name: 'monday66',
					account: 'monday66',
					email: 'monday66@gmail.com',
					password: '1qaz2wsx'
				}
			})
		})

		it('應該處理 400 錯誤（無效的請求資料）', async () => {
			const errorResponse = {
				status: 400,
				message: '請求資料格式錯誤'
			}
			
			mockFetch.mockRejectedValue({
				status: 400,
				data: errorResponse
			})

			const { useUserRegister } = await import('../../composables/api/users/useUserRegister')
			const { register } = useUserRegister()

			await expect(register(validRegisterData)).rejects.toMatchObject({
				status: 400,
				data: errorResponse
			})
		})

		it('應該處理 409 錯誤（帳號已存在）', async () => {
			const errorResponse = {
				status: 409,
				message: '帳號已存在'
			}
			
			mockFetch.mockRejectedValue({
				status: 409,
				data: errorResponse
			})

			const { useUserRegister } = await import('../../composables/api/users/useUserRegister')
			const { register } = useUserRegister()

			await expect(register(validRegisterData)).rejects.toMatchObject({
				status: 409,
				data: errorResponse
			})
		})

		it('應該處理 500 錯誤（伺服器內部錯誤）', async () => {
			const errorResponse = {
				status: 500,
				message: '伺服器內部錯誤'
			}
			
			mockFetch.mockRejectedValue({
				status: 500,
				data: errorResponse
			})

			const { useUserRegister } = await import('../../composables/api/users/useUserRegister')
			const { register } = useUserRegister()

			await expect(register(validRegisterData)).rejects.toMatchObject({
				status: 500,
				data: errorResponse
			})
		})

		it('應該處理網路錯誤', async () => {
			mockFetch.mockRejectedValue(new Error('網路連線失敗'))

			const { useUserRegister } = await import('../../composables/api/users/useUserRegister')
			const { register } = useUserRegister()

			await expect(register(validRegisterData)).rejects.toThrow('網路連線失敗')
		})

		it('應該處理空值輸入', async () => {
			const emptyData: UserRegisterData = {
				name: '',
				account: '',
				email: '',
				password: ''
			}

			mockFetch.mockResolvedValue(expectedResponse)

			const { useUserRegister } = await import('../../composables/api/users/useUserRegister')
			const { register } = useUserRegister()

			await register(emptyData)

			expect(mockFetch).toHaveBeenCalledWith('/api/v1/users/register', {
				method: 'POST',
				body: emptyData
			})
		})

		it('應該處理特殊字元輸入', async () => {
			const specialCharData: UserRegisterData = {
				name: '測試用戶@#$%',
				account: 'test_user_123',
				email: 'test+tag@example.com',
				password: 'P@ssw0rd!'
			}

			mockFetch.mockResolvedValue(expectedResponse)

			const { useUserRegister } = await import('../../composables/api/users/useUserRegister')
			const { register } = useUserRegister()

			await register(specialCharData)

			expect(mockFetch).toHaveBeenCalledWith('/api/v1/users/register', {
				method: 'POST',
				body: specialCharData
			})
		})

		it('應該處理長字串輸入', async () => {
			const longStringData: UserRegisterData = {
				name: 'A'.repeat(100),
				account: 'B'.repeat(50),
				email: 'C'.repeat(30) + '@example.com',
				password: 'D'.repeat(20)
			}

			mockFetch.mockResolvedValue(expectedResponse)

			const { useUserRegister } = await import('../../composables/api/users/useUserRegister')
			const { register } = useUserRegister()

			await register(longStringData)

			expect(mockFetch).toHaveBeenCalledWith('/api/v1/users/register', {
				method: 'POST',
				body: longStringData
			})
		})
	})

	describe('回應格式驗證', () => {
		it('應該驗證回應包含所有必要欄位', async () => {
			const validResponse = {
				status: 201,
				message: '註冊成功',
				id: 42,
				Role: 'Participant',
				Account: 'monday66',
				Email: 'monday66@gmail.com',
				CreatedAt: '2025-09-16T18:24:09.540355+08:00',
				UpdatedAt: '2025-09-16T18:24:09.540355+08:00'
			}

			mockFetch.mockResolvedValue(validResponse)

			const { useUserRegister } = await import('../../composables/api/users/useUserRegister')
			const { register } = useUserRegister()

			const result = await register({
				name: 'test',
				account: 'test',
				email: 'test@example.com',
				password: 'password'
			})

			// 驗證所有必要欄位都存在
			expect(result).toHaveProperty('status')
			expect(result).toHaveProperty('message')
			expect(result).toHaveProperty('id')
			expect(result).toHaveProperty('Role')
			expect(result).toHaveProperty('Account')
			expect(result).toHaveProperty('Email')
			expect(result).toHaveProperty('CreatedAt')
			expect(result).toHaveProperty('UpdatedAt')

			// 驗證資料類型
			expect(typeof result.status).toBe('number')
			expect(typeof result.message).toBe('string')
			expect(typeof result.id).toBe('number')
			expect(typeof result.Role).toBe('string')
			expect(typeof result.Account).toBe('string')
			expect(typeof result.Email).toBe('string')
			expect(typeof result.CreatedAt).toBe('string')
			expect(typeof result.UpdatedAt).toBe('string')
		})
	})
})