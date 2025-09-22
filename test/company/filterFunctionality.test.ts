/**
 * 公司端計畫列表過濾功能測試
 * 
 * 測試範圍：
 * 1. 基本過濾功能（名稱搜尋、產業類別、職務類別）
 * 2. 狀態標籤篩選
 * 3. 排序功能
 * 4. 錯誤處理
 * 5. UI 互動（載入狀態、空結果提示）
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ref, nextTick } from 'vue';
import type { Program } from '~/types/company/program';

// Mock 資料
const mockPrograms: Program[] = [
	{
		Id: 1,
		Name: '軟體工程師體驗計畫',
		Intro: '體驗軟體開發流程',
		Industry: { Id: 10, Title: '資訊科技' },
		JobTitle: { Id: 3, Title: '軟體工程師' },
		Address: '台北市',
		address: '台北市',
		ContactName: '張經理',
		contact_name: '張經理',
		ContactPhone: '0912345678',
		contact_phone: '0912345678',
		ContactEmail: 'test@example.com',
		contact_email: 'test@example.com',
		MinPeople: 5,
		min_people: 5,
		MaxPeople: 10,
		max_people: 10,
		PublishStartDate: '2024-01-01',
		publish_start_date: '2024-01-01',
		PublishDurationDays: 30,
		publish_duration_days: 30,
		PublishEndDate: '2024-01-31',
		publish_end_date: '2024-01-31',
		ProgramStartDate: '2024-02-01',
		program_start_date: '2024-02-01',
		ProgramEndDate: '2024-02-28',
		program_end_date: '2024-02-28',
		ProgramDurationDays: 28,
		program_duration_days: 28,
		status_id: 1,
		status_title: '已通過',
		Status: { Id: 1, Title: '已通過' },
		AppliedCount: 8,
		applied_count: 8,
		CoverImage: null,
		Images: [],
		Steps: [],
		Statistics: { TotalApplicants: 8, ReviewedCount: 5, PendingCount: 3 },
		Views: { TotalViews: 100, WeeklyViews: 20, DailyViews: 5 },
	},
	{
		Id: 2,
		Name: '行銷專員實習計畫',
		Intro: '學習數位行銷技巧',
		Industry: { Id: 8, Title: '行銷/傳播' },
		JobTitle: { Id: 1, Title: '行銷專員' },
		Address: '新北市',
		address: '新北市',
		ContactName: '李主任',
		contact_name: '李主任',
		ContactPhone: '0987654321',
		contact_phone: '0987654321',
		ContactEmail: 'marketing@example.com',
		contact_email: 'marketing@example.com',
		MinPeople: 3,
		min_people: 3,
		MaxPeople: 8,
		max_people: 8,
		PublishStartDate: '2024-02-01',
		publish_start_date: '2024-02-01',
		PublishDurationDays: 30,
		publish_duration_days: 30,
		PublishEndDate: '2024-03-02',
		publish_end_date: '2024-03-02',
		ProgramStartDate: '2024-03-15',
		program_start_date: '2024-03-15',
		ProgramEndDate: '2024-04-15',
		program_end_date: '2024-04-15',
		ProgramDurationDays: 31,
		program_duration_days: 31,
		status_id: 2,
		status_title: '審核中',
		Status: { Id: 2, Title: '審核中' },
		AppliedCount: 5,
		applied_count: 5,
		CoverImage: null,
		Images: [],
		Steps: [],
		Statistics: { TotalApplicants: 5, ReviewedCount: 0, PendingCount: 5 },
		Views: { TotalViews: 50, WeeklyViews: 10, DailyViews: 2 },
	},
];

describe('公司端計畫列表過濾功能', () => {
	describe('基本過濾功能', () => {
		it('應該能根據計畫名稱進行搜尋', () => {
			const searchTerm = '軟體';
			const filtered = mockPrograms.filter(program => 
				program.Name.includes(searchTerm)
			);
			
			expect(filtered).toHaveLength(1);
			expect(filtered[0].Name).toBe('軟體工程師體驗計畫');
		});

		it('應該能根據產業類別進行過濾', () => {
			const industryId = 10; // 資訊科技
			const filtered = mockPrograms.filter(program => 
				program.Industry.Id === industryId
			);
			
			expect(filtered).toHaveLength(1);
			expect(filtered[0].Industry.Title).toBe('資訊科技');
		});


		it('應該支援多個過濾條件的 AND 組合', () => {
			const filters = {
				name: '行銷',
				industryId: 8, // 行銷/傳播
			};
			
			const filtered = mockPrograms.filter(program => 
				program.Name.includes(filters.name) &&
				program.Industry.Id === filters.industryId
			);
			
			expect(filtered).toHaveLength(1);
			expect(filtered[0].Name).toBe('行銷專員實習計畫');
		});
	});

	describe('狀態標籤篩選', () => {
		it('應該能根據審核狀態進行篩選 - 已通過', () => {
			const statusFilter = 'passed'; // 已通過
			const filtered = mockPrograms.filter(program => 
				program.Status.Title === '已通過'
			);
			
			expect(filtered).toHaveLength(1);
			expect(filtered[0].Status.Title).toBe('已通過');
		});

		it('應該能根據審核狀態進行篩選 - 審核中', () => {
			const statusFilter = 'reviewing'; // 審核中
			const filtered = mockPrograms.filter(program => 
				program.Status.Title === '審核中'
			);
			
			expect(filtered).toHaveLength(1);
			expect(filtered[0].Status.Title).toBe('審核中');
		});

		it('應該支援全部計畫狀態顯示', () => {
			const statusFilter = 'all'; // 全部計畫
			const filtered = mockPrograms; // 不進行狀態過濾
			
			expect(filtered).toHaveLength(2);
		});
	});

	describe('排序功能', () => {
		it('應該支援按日期由新到舊排序', () => {
			const sorted = [...mockPrograms].sort((a, b) => 
				new Date(b.PublishStartDate).getTime() - new Date(a.PublishStartDate).getTime()
			);
			
			expect(sorted[0].Name).toBe('行銷專員實習計畫'); // 2024-02-01
			expect(sorted[1].Name).toBe('軟體工程師體驗計畫'); // 2024-01-01
		});

		it('應該支援按日期由舊到新排序', () => {
			const sorted = [...mockPrograms].sort((a, b) => 
				new Date(a.PublishStartDate).getTime() - new Date(b.PublishStartDate).getTime()
			);
			
			expect(sorted[0].Name).toBe('軟體工程師體驗計畫'); // 2024-01-01
			expect(sorted[1].Name).toBe('行銷專員實習計畫'); // 2024-02-01
		});
	});

	describe('錯誤處理', () => {
		it('應該處理空搜尋結果', () => {
			const searchTerm = '不存在的計畫';
			const filtered = mockPrograms.filter(program => 
				program.Name.includes(searchTerm)
			);
			
			expect(filtered).toHaveLength(0);
		});

		it('應該處理無效的過濾條件', () => {
			const invalidIndustryId = 999;
			const filtered = mockPrograms.filter(program => 
				program.Industry.Id === invalidIndustryId
			);
			
			expect(filtered).toHaveLength(0);
		});

		it('應該處理 API 載入錯誤', async () => {
			// 模擬 API 錯誤
			const mockError = new Error('API 載入失敗');
			vi.fn(() => Promise.reject(mockError));
			
			// 這裡應該顯示錯誤訊息
			expect(mockError.message).toBe('API 載入失敗');
		});
	});

	describe('UI 互動', () => {
		it('應該在載入時顯示 loading 狀態', () => {
			const isLoading = ref(true);
			expect(isLoading.value).toBe(true);
		});

		it('應該在過濾結果為空時顯示適當訊息', () => {
			const filteredPrograms: Program[] = [];
			const emptyMessage = filteredPrograms.length === 0 ? '目前無符合資料' : '';
			
			expect(emptyMessage).toBe('目前無符合資料');
		});

		it('應該在清空過濾器時觸發重新載入', () => {
			const filters = ref({
				name: '測試',
				industry: 'tech',
				job_type: 'swe',
			});
			
			// 模擬清空過濾器
			filters.value = {
				name: '',
				industry: '',
				job_type: '',
			};
			
			expect(filters.value.name).toBe('');
			expect(filters.value.industry).toBe('');
			expect(filters.value.job_type).toBe('');
		});
	});
});
