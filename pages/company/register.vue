<script setup lang="ts">
import { reactive } from 'vue';

definePageMeta({
  layout: 'main',
});

const formData = reactive({
  name: '',
  taxId: '',
  industry: '',
  scale: '',
  address: '',
  website: '',
  description: '',
  logo: null,
  cover: null,
});

const industryOptions = [
  { value: 'information_technology', label: '資訊科技' },
  { value: 'finance_insurance', label: '金融保險' },
  { value: 'education', label: '教育' },
  { value: 'healthcare', label: '醫療保健' },
  { value: 'retail', label: '零售' },
  { value: 'manufacturing', label: '製造' },
];

const scaleOptions = [
  { value: '1-10', label: '1-10人' },
  { value: '11-50', label: '11-50人' },
  { value: '51-200', label: '51-200人' },
  { value: '201-500', label: '201-500人' },
  { value: '501+', label: '501人以上' },
];
</script>

<template>
  <div class="bg-gray-50 py-12 lg:py-16">
    <div class="mx-auto w-full max-w-4xl rounded-lg bg-white p-8 shadow-sm lg:p-16">
      <!-- Stepper -->
      <div class="mb-10 flex items-center">
        <div class="flex flex-col items-center text-center">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-sm font-bold text-white"
          >
            1
          </div>
          <span class="mt-2 w-20 text-sm font-bold text-gray-800">企業資料</span>
        </div>
        <div class="mx-4 h-px flex-1 bg-gray-300"></div>
        <div class="flex flex-col items-center text-center">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 text-sm font-bold text-gray-400"
          >
            2
          </div>
          <span class="mt-2 w-20 text-sm text-gray-400">聯絡人資料</span>
        </div>
        <div class="mx-4 h-px flex-1 bg-gray-300"></div>
        <div class="flex flex-col items-center text-center">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 text-sm font-bold text-gray-400"
          >
            3
          </div>
          <span class="mt-2 w-20 text-sm text-gray-400">完成註冊</span>
        </div>
      </div>

      <h1 class="mb-6 text-2xl font-bold text-gray-800">企業資料</h1>

      <el-form
        :model="formData"
        label-position="top"
        class="grid grid-cols-2 gap-x-6"
        size="large"
      >
        <el-form-item label="企業名稱 *" prop="name" class="col-span-2 md:col-span-1">
          <el-input v-model="formData.name" placeholder="請輸入企業的名稱" />
        </el-form-item>

        <el-form-item label="統一編號" prop="taxId" class="col-span-2 md:col-span-1">
          <el-input v-model="formData.taxId" placeholder="請輸入有效的統一編號（個人工作室可不填）" />
        </el-form-item>

        <el-form-item label="產業類別 *" prop="industry" class="col-span-2 md:col-span-1">
          <el-select v-model="formData.industry" placeholder="請選擇企業的產業類別" class="w-full">
            <el-option
              v-for="item in industryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="企業規模 *" prop="scale" class="col-span-2 md:col-span-1">
          <el-select v-model="formData.scale" placeholder="請選擇企業的規模" class="w-full">
            <el-option
              v-for="item in scaleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="企業地址 *" prop="address" class="col-span-2">
          <el-input v-model="formData.address" placeholder="請輸入完整地址" />
        </el-form-item>

        <el-form-item label="企業網站" prop="website" class="col-span-2">
          <el-input v-model="formData.website" placeholder="請輸入有效的網址" />
        </el-form-item>

        <el-form-item label="企業簡介" prop="description" class="col-span-2">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="請輸入企業完整的介紹與描述"
          />
        </el-form-item>

        <div class="col-span-2 mt-2 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-900">企業標誌</label>
            <div
              class="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4"
            >
              <div
                class="flex h-36 w-36 items-center justify-center rounded-full bg-gray-200 text-gray-400"
              >
                <!-- Placeholder for logo -->
              </div>
              <el-button>更換標誌</el-button>
            </div>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-900">企業封面</label>
            <div
              class="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4"
            >
              <div class="aspect-[16/9] w-full rounded-md bg-gray-200">
                <!-- Placeholder for cover image -->
              </div>
              <el-button>更換封面</el-button>
            </div>
          </div>
        </div>

        <div class="col-span-2 mt-8 flex justify-end">
          <el-button
            type="primary"
            size="large"
            class="bg-gray-800 px-8 py-6 text-base font-bold text-white hover:bg-gray-700"
          >
            下一步
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
