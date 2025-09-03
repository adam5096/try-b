<template>
  <div>
    <h1>企業計畫列表</h1>
    <div v-if="programStore.programs.length > 0">
      <div v-for="program in programStore.programs" :key="program.Id" class="program-card">
        <!-- 封面圖片 -->
        <div v-if="program.CoverImage" class="program-cover">
          <NuxtImg 
            :src="program.CoverImage" 
            :alt="program.Name"
            class="cover-image"
            @error="handleImageError"
          />
        </div>
        <div v-else class="program-cover no-image">
          <div class="no-image-placeholder">
            <font-awesome-icon :icon="['fas', 'image']" class="placeholder-icon" />
            <span>無封面圖片</span>
          </div>
        </div>
        
        <!-- 計畫資訊 -->
        <div class="program-info">
          <h2>{{ program.Name }}</h2>
          <p class="intro">{{ program.Intro }}</p>
          <div class="program-details">
            <p><strong>產業:</strong> {{ program.Industry.Title }}</p>
            <p><strong>職位:</strong> {{ program.JobTitle.Title }}</p>
            <p><strong>發佈時間:</strong> {{ program.PublishStartDate }} - {{ program.PublishEndDate }}</p>
            <p><strong>計畫時間:</strong> {{ program.ProgramStartDate }} - {{ program.ProgramEndDate }}</p>
            <p><strong>申請人數:</strong> {{ program.AppliedCount || 0 }} 人</p>
          </div>
        </div>
      </div>
      <el-pagination
        :current-page="programStore.page"
        :page-size="programStore.limit"
        :total="programStore.total"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
    <div v-else>
      <p>目前沒有任何計畫。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'company',
});

const programStore = useCompanyProgramStore();

onMounted(() => {
  programStore.fetchPrograms();
});

const handlePageChange = (newPage: number) => {
  programStore.setPage(newPage);
};

// 處理圖片載入錯誤
const handleImageError = (payload: string | Event) => {
  if (typeof payload === 'string') return;
  
  const e = payload as Event;
  const img = e.target as HTMLImageElement;
  if (img) {
    img.style.display = 'none';
  }
};
</script>

<style scoped>
.program-card {
  border: 1px solid #ccc;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.program-cover {
  width: 200px;
  height: 150px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border: 2px dashed #ccc;
}

.no-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #666;
}

.placeholder-icon {
  font-size: 24px;
  color: #999;
}

.program-info {
  flex: 1;
  min-width: 0;
}

.program-info h2 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 18px;
}

.intro {
  margin: 0 0 12px 0;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.program-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.program-details p {
  margin: 0;
  font-size: 14px;
  color: #555;
}

.program-details strong {
  color: #333;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .program-card {
    flex-direction: column;
  }
  
  .program-cover {
    width: 100%;
    height: 200px;
  }
}
</style>
