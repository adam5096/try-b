<script setup lang="ts">
defineProps<{
  formData: any
}>()

const emit = defineEmits(['next', 'previous'])
</script>

<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold text-gray-800">聯絡人資料</h1>

    <el-form
      :model="formData"
      label-position="top"
      class="grid grid-cols-2 gap-x-6"
      size="large"
    >
      <el-form-item label="聯絡人姓名 *" prop="CompanyContact.name" class="col-span-2 md:col-span-1">
        <el-input v-model="formData.CompanyContact.name" placeholder="請輸入聯絡人姓名" />
      </el-form-item>

      <el-form-item label="職稱 *" prop="CompanyContact.job_title" class="col-span-2 md:col-span-1">
        <el-input v-model="formData.CompanyContact.job_title" placeholder="請輸入聯絡人職稱" />
      </el-form-item>

      <el-form-item label="電子郵件 *" prop="CompanyContact.email" class="col-span-2">
        <el-input v-model="formData.CompanyContact.email" placeholder="請輸入聯絡人電子郵件" />
      </el-form-item>

      <el-form-item label="聯絡電話 *" prop="CompanyContact.phone" class="col-span-2">
        <el-input v-model="formData.CompanyContact.phone" placeholder="請輸入聯絡人電話" />
      </el-form-item>

      <div class="col-span-2 mt-8 flex justify-between">
        <el-button size="large" class="px-8 py-6 text-base font-bold" @click="emit('previous')">
          上一步
        </el-button>
        <el-button
          type="primary"
          size="large"
          class="bg-gray-800 px-8 py-6 text-base font-bold text-white hover:bg-gray-700"
          @click="emit('next')"
        >
          註冊
        </el-button>
      </div>
    </el-form>
  </div>
</template> 