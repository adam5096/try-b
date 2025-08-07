<script setup lang="ts">
import { reactive } from 'vue';
import UserIcon from '~/components/UserIcon.vue';
import { UploadFilled } from '@element-plus/icons-vue';

definePageMeta({
  name: 'user-settings',
  layout: 'user',
});

// Form data model
const personalInfo = reactive({
  avatar: [],
  name: '',
  birthDate: '2000-01-01',
  gender: '男/女',
  status: 'pending',
  email: 'linweichen@gmail.com',
  phone: '0912345678',
  address: {
    city: 'taipei',
    district: 'xinyi',
    street: '中山路一段100號',
  },
});

// Options for select components
const statusOptions = [
  { label: '待業中', value: 'pending' },
  { label: '在職中', value: 'employed' },
  { label: '學生', value: 'student' },
];
const cityOptions = [
  { label: '台北市', value: 'taipei' },
  { label: '新北市', value: 'new-taipei' },
  { label: '桃園市', value: 'taoyuan' },
  { label: '台中市', value: 'taichung' },
  { label: '台南市', value: 'tainan' },
  { label: '高雄市', value: 'kaohsiung' },
];
const districtOptions = reactive({
  taipei: [
    { label: '中正區', value: 'zhongzheng' },
    { label: '大同區', value: 'datong' },
    { label: '中山區', value: 'zhongshan' },
    { label: '松山區', value: 'songshan' },
    { label: '大安區', value: 'daan' },
    { label: '萬華區', value: 'wanhua' },
    { label: '信義區', value: 'xinyi' },
  ],
  // Add other cities' districts as needed
});
</script>

<template>
  <main class="min-h-screen bg-brand-gray">
    <div class="mx-auto max-w-container-users px-6 py-12 md:px-12">
      <!-- User Info Header -->
      <div class="mb-8 flex items-center gap-6">
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
          <UserIcon class="h-12 w-12 text-gray-500" />
        </div>
        <div>
          <p class="text-xl font-bold text-primary-blue-dark">
            林威辰
          </p>
          <p class="text-sm text-gray-500">
            台灣體驗管理員
          </p>
        </div>
      </div>

      <!-- Personal Info Settings Form -->
      <div class="rounded-lg bg-white p-8 shadow-sm">
        <h2 class="mb-6 text-xl font-bold text-primary-blue-dark">個人資料設定</h2>

        <el-form :model="personalInfo" label-position="top">
          <div class="grid grid-cols-1 gap-x-12 gap-y-2 md:grid-cols-2">
            <!-- Left Column -->
            <div class="flex flex-col">
              <el-form-item>
                <template #label>
                  <span class="font-bold">大頭照</span>
                  <span class="ml-2 text-sm text-gray-400">請上傳 jpg、jpeg、png 格式照片</span>
                </template>
                <el-upload
                  class="w-full"
                  drag
                  action="#"
                  :auto-upload="false"
                >
                  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                  <div class="el-upload__text">
                    點擊或拖曳照片至此處上傳
                  </div>
                </el-upload>
              </el-form-item>

              <el-form-item label="性別" class="mt-2">
                <el-input v-model="personalInfo.gender" />
              </el-form-item>

              <el-form-item label="電子郵件" required>
                <el-input v-model="personalInfo.email" disabled />
              </el-form-item>

              <el-form-item label="通訊地址" required>
                <div class="grid w-full grid-cols-2 gap-4">
                  <el-select v-model="personalInfo.address.city" placeholder="縣市">
                    <el-option v-for="item in cityOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                  <el-select v-model="personalInfo.address.district" placeholder="鄉鎮市區">
                    <el-option v-for="item in districtOptions[personalInfo.address.city]" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </div>
                <el-input v-model="personalInfo.address.street" class="mt-4 w-full" />
              </el-form-item>
            </div>

            <!-- Right Column -->
            <div class="flex flex-col">
              <el-form-item required>
                <template #label>
                  <div class="flex w-full justify-between">
                    <span class="font-bold">姓名</span>
                    <span class="text-sm text-gray-400">必須為2-20個字元，不可包含特殊符號</span>
                  </div>
                </template>
                <el-input v-model="personalInfo.name" placeholder="姓名" />
              </el-form-item>

              <el-form-item label="生日" required>
                <el-date-picker
                  v-model="personalInfo.birthDate"
                  type="date"
                  placeholder="選擇日期"
                  class="w-full"
                  format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>

              <el-form-item label="身分">
                <el-select v-model="personalInfo.status" placeholder="請選擇" class="w-full">
                  <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>

              <el-form-item label="手機號碼" required>
                <el-input v-model="personalInfo.phone" />
              </el-form-item>
            </div>
          </div>

          <div class="mt-8 flex justify-end">
            <el-button type="primary" size="large" class="!bg-gray-400 !border-gray-400">儲存變更</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </main>
</template>

