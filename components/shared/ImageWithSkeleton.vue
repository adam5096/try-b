<template>
  <div class="relative overflow-hidden" :class="wrapperClass">
    <el-skeleton :loading="!isLoaded" animated :throttle="{ leading: 400, trailing: 300, initVal: true }">
      <template #template>
        <el-skeleton-item variant="image" :style="skeletonStyle" />
      </template>
      <template #default>
        <NuxtImg
          :src="currentSrc"
          :alt="alt || 'image'"
          loading="lazy"
          decoding="async"
          :class="['transition-opacity duration-500', imgClass, isLoaded ? 'opacity-100' : 'opacity-0']"
          :fit="fit"
          @load="handleLoad"
          @error="handleError"
        />
      </template>
    </el-skeleton>
  </div>
  
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

interface Props {
  src?: string | null;
  alt?: string;
  fallbackSrc?: string;
  imgClass?: string;            // classes applied to <img>
  wrapperClass?: string;        // classes applied to wrapper
  skeletonHeightClass?: string; // height class for skeleton image area
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: 'image',
  fallbackSrc: '/img/home/home-worker-bg.webp',
  imgClass: 'w-full h-48 object-cover',
  wrapperClass: '',
  skeletonHeightClass: 'h-48',
  fit: 'cover',
});

const isLoaded = ref(false);
const toHttps = (u?: string | null) => (u ? u.replace(/^http:\/\//i, 'https://') : u);
const currentSrc = ref<string>(toHttps(props.src) || props.fallbackSrc);

const skeletonStyle = computed(() => {
  // 將傳入的高度類別轉為對應的 style（骨架用 inline style 更穩定）
  // 只處理常見的 h-48 / h-full；其餘交給外層控制
  if (props.skeletonHeightClass === 'h-full') {
    return 'width: 100%; height: 100%';
  }
  return 'width: 100%; height: 12rem'; // h-48 約 12rem
});

watch(
  () => props.src,
  (val) => {
    // 當來源改變時，重置為未載入並重新指向新來源
    isLoaded.value = false;
    currentSrc.value = toHttps(val) || props.fallbackSrc;
  },
);

const handleLoad = () => {
  isLoaded.value = true;
};

const handleError = () => {
  // 若原圖失敗，嘗試切換到 fallback，再等待 onload 觸發
  if (currentSrc.value !== props.fallbackSrc) {
    currentSrc.value = props.fallbackSrc;
  } else {
    // fallback 也失敗時，直接顯示占位並結束 loading
    isLoaded.value = true;
  }
};
</script>


