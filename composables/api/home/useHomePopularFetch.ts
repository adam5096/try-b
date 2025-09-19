import { computed } from 'vue';
import dayjs from 'dayjs';
import { extractIntroSummaryForCard } from '~/utils/introParser';

type PopularProgram = {
	id: number
	company_name: string
	name: string
	intro: string
	address: string | null
	program_start_date: string | null
	program_end_date: string | null
	days_left: number | null
	applied_count: number | null
	img_path: string | null
};

type HomePageResponse = {
	PopularPrograms?: PopularProgram[]
};

export type HomeHighScoreCard = {
	id: number | null
	title: string
	description: string
	meta: string // 公司名稱
	dateText: string // YYYY/MM/DD - YYYY/MM/DD
	location: string
	appliedCount: string
	daysLeft: string
	coverUrl: string | null
};

function formatDateToYmd(dateStr: string): string {
	// 使用全域擴充後的 dayjs；若失敗回退簡易格式
	try {
		return dayjs(dateStr).utc().format('YYYY/MM/DD');
	}
	catch {}
	return (dateStr || '').slice(0, 10).replaceAll('-', '/');
}

export function useHomePopularFetch() {
	const { data, pending, error, refresh } = useAsyncData<HomePageResponse>(
		'home-popular',
		async (): Promise<HomePageResponse> => {
			try {
				const result = await $fetch<HomePageResponse>('/api/v1/home/popular');
				return result;
			} catch (err: any) {
				// 資安考量：統一錯誤處理，不洩露 API endpoint 詳情
				if (err.status >= 500) {
					throw createError({
						statusCode: 500,
						statusMessage: '服務暫時無法使用，請稍後再試',
					});
				}
				throw err;
			}
		},
		{
			server: true,
			lazy: false,
			// 添加快取策略，提升效能
			default: () => ({ PopularPrograms: [] }),
			// 確保 SSR 和客戶端一致性
			getCachedData: (key) => {
				const nuxtApp = useNuxtApp();
				return (nuxtApp.ssrContext?.cache as any)?.[key] ?? (nuxtApp.payload.data as any)[key];
			},
			transform: (data: HomePageResponse) => {
				// 確保資料格式正確，防止 hydration mismatch
				if (!data || typeof data !== 'object') {
					return { PopularPrograms: [] };
				}
				return {
					PopularPrograms: Array.isArray(data.PopularPrograms)
						? data.PopularPrograms
						: [],
				};
			},
		},
	);

	const cards = computed<HomeHighScoreCard[]>(() => {
		const source = (data.value as HomePageResponse)?.PopularPrograms ?? [];
		const mapped = source.slice(0, 3).map((x: PopularProgram) => ({
			id: x.id ?? null,
			title: x.name ?? '—',
			description: extractIntroSummaryForCard(x.intro || ''),
			meta: x.company_name ?? '—',
			dateText: [x.program_start_date, x.program_end_date]
				.filter(Boolean)
				.map(d => formatDateToYmd(String(d)))
				.join(' - ') || '—',
			location: x.address || '—',
			appliedCount: typeof x.applied_count === 'number' ? String(x.applied_count) : '—',
			daysLeft: typeof x.days_left === 'number' ? String(x.days_left) : '—',
			coverUrl: (() => {
				const raw = (x.img_path || '').toString().trim();
				if (!raw) { return null; } // 空值→用預設圖
				const isHttp = /^https?:\/\//i.test(raw);
				const isLocal = raw.startsWith('/');
				return (isHttp || isLocal) ? raw : null; // 非 http/本地路徑（如 "~/Images"）→ 視為無效
			})(),
		}));

		// 少於 3 筆時補空卡
		const placeholders: HomeHighScoreCard[] = Array.from({ length: Math.max(0, 3 - mapped.length) }).map(() => ({
			id: null,
			title: '—',
			description: '—',
			meta: '—',
			dateText: '—',
			location: '—',
			appliedCount: '—',
			daysLeft: '—',
			coverUrl: null,
		}));

		return [...mapped, ...placeholders].slice(0, 3);
	});

	return {
		data,
		cards,
		pending,
		error,
		refresh,
	};
}
