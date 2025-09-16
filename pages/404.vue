<script setup lang="ts">
import { ref } from 'vue';
import { routes } from '~/utils/routes';

definePageMeta({
	name: 'not-found',
	layout: 'main',
});

useSeoMeta({
	title: '找不到頁面｜TRY β',
	description: '很抱歉，您造訪的頁面不存在。回到首頁或探索更多內容。',
	ogTitle: '找不到頁面｜TRY β',
	ogDescription: '很抱歉，您造訪的頁面不存在。回到首頁或探索更多內容。',
	ogImage: '/img/home/home-worker-bg.webp',
});

const quickLinks = ref([
	{ name: '回到首頁', to: routes.home() },
	{ name: '體驗者入口', to: routes.user.landing() },
	{ name: '熱門體驗活動', to: routes.homeFeaturedPrograms() },
	{ name: '企業方案', to: routes.plan() },
]);

const articles = ref([
	{
		title: '什麼是公益 404？把錯誤化為社會善意',
		excerpt:
      '當用戶抵達 404 頁面時，引導他們看見值得支持的公益行動，將一次迷路化為一次看見社會議題的契機。',
		href: 'https://www.google.com/search?q=%E5%85%AC%E7%9B%8A404',
	},
	{
		title: 'TRY β 招募、合作與體驗者招募說明',
		excerpt:
      '了解我們如何以低成本試錯機制協助企業與探索者。一起參與、支持或成為體驗者。',
		href: '/roles',
	},
	{
		title: '先 β 再決定：把轉職從博弈變成科學',
		excerpt:
      '在投入正式職缺前，先透過短期職場體驗快速驗證與學習，降低錯聘風險與轉職成本。',
		href: '/users',
	},
]);
</script>

<template>
	<main>
		<!-- Hero Section (延續首頁圖層語彙) -->
		<section class="relative h-hero-section text-white">
			<!-- Layer 1: 背景圖 -->
			<div class="absolute inset-0 z-10 mask-fade-from-center-to-left">
				<NuxtImg
					src="/img/home/home-worker-bg.webp"
					alt="TRY β background"
					class="h-full w-full object-cover"
					width="1920"
					height="1280"
					preload
				/>
			</div>

			<!-- Layer 2: 藍色漸層圖形 -->
			<div class="absolute inset-0 z-20 mask-gradient-to-right">
				<img
					src="/img/home/hero-bg.webp"
					alt="Decorative shape"
					class="h-full w-full object-cover lg:object-fill"
					loading="lazy"
				>
			</div>

			<!-- Layer 3: 前景內容 -->
			<div class="absolute inset-0 z-30">
				<div class="mx-auto h-full w-full max-w-container-main px-6 md:px-12">
					<div class="flex h-full flex-col justify-center items-center 2xl:items-start text-center 2xl:text-left">
						<h1 class="text-2xl font-bold sm:text-3xl lg:text-4xl xl:text-5xl">
							404 找不到頁面
						</h1>
						<p class="mt-4 max-w-xl text-sm sm:text-base lg:text-lg">
							很抱歉，您造訪的頁面不存在或已被移除。我們整理了幾個常用連結與推薦內容，協助您繼續探索。
						</p>
						<div class="mt-12 flex flex-wrap items-center gap-3">
							<NuxtLink
								:to="routes.home()"
								class="inline-block rounded-md bg-btn-yellow px-8 py-3 font-bold text-black transition-transform hover:scale-105 hover:bg-primary-blue-dark hover:text-white"
							>
								回到首頁
							</NuxtLink>
							<NuxtLink
								:to="routes.user.landing()"
								class="inline-block rounded-md border border-white/60 px-8 py-3 font-bold text-white transition-colors hover:bg-white hover:text-primary-blue-dark"
							>
								體驗者入口
							</NuxtLink>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 公益 404 Callout / 招生導覽 -->
		<section class="py-section-padding bg-brand-gray">
			<div class="mx-auto h-full w-full max-w-container-main px-6 md:px-12">
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch">
					<!-- 左側：公益 404 說明 -->
					<div class="bg-white rounded-lg shadow-lg p-8 flex flex-col">
						<h2 class="text-primary-blue-light text-2xl sm:text-3xl font-bold mb-4">
							把 404 變成一次看見
						</h2>
						<p class="text-gray-700 leading-relaxed">
							公益 404 的理念是：當大家因為連結失效而迷路時，不妨讓這次迷路帶來一些社會的善意。您可以選擇關注、分享或支持值得被看見的議題與行動。
						</p>
						<a
							href="https://www.google.com/search?q=%E5%85%AC%E7%9B%8A404"
							target="_blank"
							rel="noopener noreferrer"
							class="mt-6 inline-flex items-center justify-center self-start rounded-md bg-btn-yellow px-6 py-3 font-bold text-black transition-transform hover:scale-105 hover:bg-primary-blue-dark hover:text-white"
						>
							了解公益 404
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 ml-2"
								viewBox="0 0 20 20"
								fill="currentColor"
							><path
								fill-rule="evenodd"
								d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/></svg>
						</a>
					</div>

					<!-- 右側：推薦文章卡片 -->
					<div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
						<article
							v-for="(a, idx) in articles"
							:key="idx"
							class="relative bg-white rounded-lg shadow-lg p-8 flex flex-col gap-4 overflow-hidden"
						>
							<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
								<SharedBetaIcon class="w-full h-full object-contain" />
							</div>
							<div class="relative z-10">
								<h3 class="font-bold text-lg">
									{{ a.title }}
								</h3>
								<p class="mt-2 text-gray-700">
									{{ a.excerpt }}
								</p>
								<NuxtLink
									:to="a.href"
									target="_self"
									class="mt-6 inline-flex items-center justify-center rounded-md bg-btn-yellow px-6 py-3 font-bold text-black transition-transform hover:scale-105 hover:bg-primary-blue-dark hover:text-white w-fit"
								>
									瞭解更多
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 ml-2"
										viewBox="0 0 20 20"
										fill="currentColor"
									><path
										fill-rule="evenodd"
										d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
										clip-rule="evenodd"
									/></svg>
								</NuxtLink>
							</div>
						</article>
					</div>
				</div>
			</div>
		</section>

		<!-- 快速連結區 -->
		<section class="py-section-padding bg-brand-gray">
			<div class="mx-auto h-full w-full max-w-container-main px-6 md:px-12 text-center">
				<h2 class="text-primary-blue-light text-3xl sm:text-4xl font-bold">
					也許你想找
				</h2>
				<div class="mx-auto mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<NuxtLink
						v-for="(link, i) in quickLinks"
						:key="i"
						:to="link.to"
						class="rounded-lg bg-white p-6 shadow transition-transform hover:-translate-y-1"
					>
						<span class="font-semibold text-gray-900">{{ link.name }}</span>
					</NuxtLink>
				</div>
			</div>
		</section>
	</main>
</template>
