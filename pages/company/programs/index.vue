<template>
  <div>
    <h1>企業計畫列表</h1>
    <div v-if="programStore.programs.length > 0">
      <div v-for="program in programStore.programs" :key="program.Id" class="program-card">
        <h2>{{ program.Name }}</h2>
        <p>{{ program.Intro }}</p>
        <p>產業: {{ program.Industry.Title }}</p>
        <p>職位: {{ program.JobTitle.Title }}</p>
        <p>發佈時間: {{ program.PublishStartDate }} - {{ program.PublishEndDate }}</p>
        <p>計畫時間: {{ program.ProgramStartDate }} - {{ program.ProgramEndDate }}</p>
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
</script>

<style scoped>
.program-card {
  border: 1px solid #ccc;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
}
</style>
