<template>
  <div class="relative overflow-hidden" :class="wrapperClass">
    <div v-if="!isLoaded" class="w-full overflow-hidden">
      <SkeletonLoader :show-title="false" :show-image="true" :show-button="false" :image-height-class="skeletonHeightClass" />
    </div>
    <img
      :src="currentSrc"
      :alt="alt || 'image'"
      loading="lazy"
      decoding="async"
      :class="['transition-opacity duration-500', imgClass, isLoaded ? 'opacity-100' : 'opacity-0']"
      @load="handleLoad"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
import SkeletonLoader from '~/components/shared/SkeletonLoader.vue';
import { ref, watch } from 'vue';

interface Props {
  src?: string | null;
  alt?: string;
  fallbackSrc?: string;
  imgClass?: string;            // classes applied to <img>
  wrapperClass?: string;        // classes applied to wrapper
  skeletonHeightClass?: string; // height class for skeleton image area
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: 'image',
  fallbackSrc: '/img/home/home-worker-bg.webp',
  imgClass: 'w-full h-48 object-cover',
  wrapperClass: '',
  skeletonHeightClass: 'h-48',
});

const isLoaded = ref(false);
const currentSrc = ref<string>(props.src || props.fallbackSrc);

watch(
  () => props.src,
  (val) => {
    // 當來源改變時，重置為未載入並重新指向新來源
    isLoaded.value = false;
    currentSrc.value = val || props.fallbackSrc;
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


