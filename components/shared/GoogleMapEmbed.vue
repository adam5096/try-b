<template>
  <client-only>
    <div
      class="w-full rounded-md border overflow-hidden bg-white relative"
      :class="heightClass"
      v-loading="isMapLoading"
      element-loading-text="地圖載入中…"
      element-loading-background="rgba(255,255,255,.6)"
    >
      <template v-if="safeSrc">
        <iframe
          :src="safeSrc"
          width="100%"
          height="100%"
          style="border:0; display:block;"
          loading="lazy"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          @load="handleLoad"
        />
      </template>
      <template v-else>
        <div class="w-full h-full flex items-center justify-center text-zinc-500 text-sm px-4">
          {{ emptyText }}
        </div>
      </template>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  src?: string | null;
  heightClass?: string; // Tailwind 高度：如 h-64 md:h-96
  emptyText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  heightClass: 'h-64 md:h-96',
  emptyText: '地圖資訊暫缺',
});

const isMapLoading = ref(true);

const allowPrefixes = [
  'https://www.google.com/maps',
  'https://maps.google.com/maps',
];

// 將需要 API key 的 embed/v1 轉成不需 key 的 share 版嵌入：/maps?q=...&output=embed
const buildKeylessUrl = (sourceUrl: string): string => {
  try {
    const u = new URL(sourceUrl);
    if (u.pathname.startsWith('/maps/embed/v1/')) {
      const q = u.searchParams.get('q');
      if (q) {
        return `https://www.google.com/maps?q=${q}&output=embed`;
      }
    }
  } catch {
    // ignore
  }
  return '';
};

const safeSrc = computed(() => {
  const val = props.src?.toString() ?? '';
  if (!val) return '';

  // 若是需要 key 的 v1 形式，優先改為 keyless 形式（避免本機/未授權網域報錯）
  if (val.includes('/maps/embed/v1/')) {
    const keyless = buildKeylessUrl(val);
    if (keyless) return keyless;
  }

  // 允許的 Google Maps 網域
  return allowPrefixes.some(p => val.startsWith(p)) ? val : '';
});

const handleLoad = () => {
  isMapLoading.value = false;
};

// 防止某些環境下 iframe @load 不觸發，增加超時備援
if (import.meta.client) {
  setTimeout(() => {
    isMapLoading.value = false;
  }, 2000);
}
</script>

<style scoped>
/* 確保容器尺寸穩定，iframe 不會撐破父層 */
:host {
  display: block;
}
</style>


