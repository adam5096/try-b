<template>
  <div class="animate-pulse">
    <!-- 標題骨架 -->
    <div v-if="showTitle" class="mb-4">
      <div class="h-8 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
    
    <!-- 內容骨架 -->
    <div class="space-y-4">
      <!-- 圖片骨架 -->
      <div v-if="showImage" class="h-48 bg-gray-200 rounded-lg"></div>
      
      <!-- 文字行骨架 -->
      <div v-for="i in lines" :key="i" class="space-y-2">
        <div 
          class="h-4 bg-gray-200 rounded"
          :class="getLineWidth(i)"
        ></div>
      </div>
      
      <!-- 按鈕骨架 -->
      <div v-if="showButton" class="pt-2">
        <div class="h-10 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showTitle?: boolean;    // 是否顯示標題骨架
  showImage?: boolean;    // 是否顯示圖片骨架
  showButton?: boolean;   // 是否顯示按鈕骨架
  lines?: number;         // 文字行數
}

withDefaults(defineProps<Props>(), {
  showTitle: true,
  showImage: true,
  showButton: false,
  lines: 3,
});

// 根據行數決定寬度變化，讓骨架看起來更自然
const getLineWidth = (lineIndex: number) => {
  const widths = ['w-full', 'w-5/6', 'w-4/5', 'w-3/4', 'w-2/3'];
  return widths[lineIndex % widths.length] || 'w-full';
};
</script>
