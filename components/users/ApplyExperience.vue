<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  name: 'user-programs-programId',
  layout: 'user',
});

const router = useRouter();
const isFavorited = ref(false);
const showApply = ref(false); // 新增

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value;
};

const goBack = () => {
  router.push({ name: 'user-landing' });
};

const form = ref({
  availability: '',
  note: '',
});

const emit = defineEmits<{ (e: 'submitted'): void }>();

const onSubmit = () => {
  emit('submitted');
};
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-bold text-primary-blue-dark">申請體驗</h3>
    <el-form label-position="top">
      <el-form-item label="可參加時段">
        <el-input v-model="form.availability" placeholder="例如：10/15 全天、10/16 下午" />
      </el-form-item>
      <el-form-item label="備註">
        <el-input v-model="form.note" type="textarea" rows="3" placeholder="想補充的內容（選填）" />
      </el-form-item>
      <div class="flex justify-end">
        <el-button type="primary" @click="onSubmit">送出申請</el-button>
      </div>
    </el-form>
  </div>
</template>
