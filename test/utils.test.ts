import { describe, it, expect } from 'vitest';

// 範例工具函數
function add(a: number, b: number): number {
	return a + b;
}

function formatCurrency(amount: number): string {
	return `TWD ${amount.toLocaleString()}`;
}

function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

// 測試套件
describe('工具函數測試', () => {
	describe('add 函數', () => {
		it('應該正確相加兩個正數', () => {
			expect(add(2, 3)).toBe(5);
		});

		it('應該處理負數', () => {
			expect(add(-1, 1)).toBe(0);
		});

		it('應該處理小數', () => {
			expect(add(1.5, 2.5)).toBe(4);
		});
	});

	describe('formatCurrency 函數', () => {
		it('應該格式化正數金額', () => {
			expect(formatCurrency(1000)).toBe('TWD 1,000');
		});

		it('應該格式化零', () => {
			expect(formatCurrency(0)).toBe('TWD 0');
		});

		it('應該格式化大數', () => {
			expect(formatCurrency(1234567)).toBe('TWD 1,234,567');
		});
	});

	describe('validateEmail 函數', () => {
		it('應該驗證有效的電子郵件', () => {
			expect(validateEmail('test@example.com')).toBe(true);
		});

		it('應該拒絕無效的電子郵件', () => {
			expect(validateEmail('invalid-email')).toBe(false);
		});

		it('應該拒絕空字串', () => {
			expect(validateEmail('')).toBe(false);
		});
	});
});
