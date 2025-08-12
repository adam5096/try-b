<template>
  <section class="container mx-auto py-10">
    <!-- 標題與副標 -->
    <header class="mb-8">
      <h1 class="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-3">
        熱門體驗管理
      </h1>
      <p class="text-gray-600 text-base md:text-lg leading-relaxed">
        在此頁面，您可以管理平台上顯示的熱門體驗排序、添加或移除體驗。
      </p>
    </header>

    <!-- 搜尋與篩選列 -->
    <div class="flex flex-col gap-4">
      <div class="flex flex-col md:flex-row md:items-center md:gap-4">
        <div class="text-gray-800 font-semibold mb-2 md:mb-0 md:mr-4">
          當前熱門體驗 (8)
        </div>

        <!-- 搜尋框 -->
        <div class="relative w-full md:max-w-xl">
          <el-input
            v-model="searchQuery"
            placeholder="搜尋體驗…"
            clearable
            size="large"
          >
            <template #suffix>
              <el-icon class="text-gray-400">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>

        <!-- 篩選群組 -->
        <div class="mt-2 md:mt-0 flex flex-wrap items-center gap-2 md:gap-3">
          <el-button type="default" class="filter-chip" @click="toggle('industry')">
            <span>產業類別</span>
            <el-icon class="ml-1 text-gray-500"><ArrowDown /></el-icon>
          </el-button>
          <el-button type="default" class="filter-chip" @click="toggle('job')">
            <span>職業類別</span>
            <el-icon class="ml-1 text-gray-500"><ArrowDown /></el-icon>
          </el-button>
          <el-button type="default" class="filter-chip" @click="toggle('region')">
            <span>地區</span>
            <el-icon class="ml-1 text-gray-500"><ArrowDown /></el-icon>
          </el-button>
          <el-button type="default" class="filter-chip" @click="toggle('sort')">
            <span>排序</span>
            <el-icon class="ml-1 text-gray-500"><ArrowDown /></el-icon>
          </el-button>
        </div>
      </div>

      <!-- 分隔線 -->
      <el-divider />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { ElInput, ElButton, ElDivider, ElIcon } from 'element-plus'
import { ArrowDown, Search } from '@element-plus/icons-vue'

definePageMeta({
  name: 'admin-trends',
  layout: 'admin',
});

const searchQuery = ref('')

function toggle(_key) {
  // 先保留交互掛勾，之後接上實際下拉內容
}

// 保留函式以便之後掛接互動行為，不使用 JSX
</script>

<style scoped>
.filter-chip {
  @apply inline-flex items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-blue;
}
</style>