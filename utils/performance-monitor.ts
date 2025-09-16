/**
 * 效能監控工具
 * 用於監控和報告應用效能指標
 */

export interface PerformanceBudget {
	metric: string;
	budget: number;
	actual: number;
	status: 'pass' | 'fail';
}

export interface ResourceBudget {
	resourceType: string;
	budget: number;
	actual: number;
	status: 'pass' | 'fail';
}

export class PerformanceMonitor {
	private budgets: PerformanceBudget[] = [];
	private resourceBudgets: ResourceBudget[] = [];

	/**
   * 檢查 Core Web Vitals 是否在預算範圍內
   */
	checkWebVitals(vitals: Record<string, number>): PerformanceBudget[] {
		const budgets = [
			{ metric: 'LCP', budget: 2500 },
			{ metric: 'FID', budget: 100 },
			{ metric: 'CLS', budget: 0.1 },
			{ metric: 'FCP', budget: 2000 },
			{ metric: 'TTFB', budget: 800 },
		]

		return budgets.map(({ metric, budget }) => {
			const actual = vitals[metric] || 0;
			const status: 'pass' | 'fail' = actual <= budget ? 'pass' : 'fail';

			const result = { metric, budget, actual, status };
			this.budgets.push(result);

			return result;
		})
	}

	/**
   * 檢查資源大小是否在預算範圍內
   */
	checkResourceSizes(): ResourceBudget[] {
		const budgets = [
			{ resourceType: 'script', budget: 500000 }, // 500KB
			{ resourceType: 'stylesheet', budget: 100000 }, // 100KB
			{ resourceType: 'image', budget: 1000000 }, // 1MB
			{ resourceType: 'font', budget: 100000 }, // 100KB
			{ resourceType: 'total', budget: 2000000 }, // 2MB
		]

		return budgets.map(({ resourceType, budget }) => {
			const actual = this.getResourceSize(resourceType);
			const status: 'pass' | 'fail' = actual <= budget ? 'pass' : 'fail';

			const result = { resourceType, budget, actual, status };
			this.resourceBudgets.push(result);

			return result;
		})
	}

	/**
   * 獲取特定類型資源的大小
   */
	private getResourceSize(resourceType: string): number {
		if (!import.meta.client) return 0;

		const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
		let totalSize = 0;

		resources.forEach((resource) => {
			if (resourceType === 'total') {
				totalSize += resource.transferSize || 0;
			}
			else {
				const url = resource.name.toLowerCase();
				if (
					(resourceType === 'script' && url.includes('.js'))
					|| (resourceType === 'stylesheet' && url.includes('.css'))
					|| (resourceType === 'image' && /\.(jpg|jpeg|png|gif|webp|svg)$/.test(url))
					|| (resourceType === 'font' && /\.(woff|woff2|ttf|otf)$/.test(url))
				) {
					totalSize += resource.transferSize || 0;
				}
			}
		});

		return totalSize;
	}

	/**
   * 生成效能報告
   */
	generateReport(): {
		webVitals: PerformanceBudget[];
		resources: ResourceBudget[];
		summary: {
			totalChecks: number;
			passedChecks: number;
			failedChecks: number;
			overallScore: number;
		};
	} {
		const allBudgets = [...this.budgets, ...this.resourceBudgets];
		const passedChecks = allBudgets.filter(b => b.status === 'pass').length;
		const failedChecks = allBudgets.filter(b => b.status === 'fail').length;
		const overallScore = Math.round((passedChecks / allBudgets.length) * 100);

		return {
			webVitals: this.budgets,
			resources: this.resourceBudgets,
			summary: {
				totalChecks: allBudgets.length,
				passedChecks,
				failedChecks,
				overallScore,
			},
		}
	}

	/**
   * 發送效能報告到監控服務
   */
	async sendReport(report: ReturnType<PerformanceMonitor['generateReport']>): Promise<void> {
		if (process.env.NODE_ENV !== 'production') {
			console.log('Performance Report:', report);
			return;
		}

		try {
			// 發送到 Google Analytics
			if (typeof (window as any).gtag !== 'undefined') {
				(window as any).gtag('event', 'performance_report', {
					event_category: 'Performance',
					event_label: `Score: ${report.summary.overallScore}%`,
					value: report.summary.overallScore,
				});
			}

			// 發送到自建監控系統
			// await fetch('/api/analytics/performance', {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify(report),
			// });
		}
		catch (error) {
			console.error('Failed to send performance report:', error);
		}
	}
}

// 導出單例實例
export const performanceMonitor = new PerformanceMonitor();
