<script lang="ts" setup>
definePageMeta({
  layout: 'company',
  name: 'company-settings'
})

const companyInfo = ref({
  name: '台灣科技創新有限公司',
  taxId: '12345678',
  industry: '科技業',
  scale: '100-200人',
  address: '台北市信義區信義路五段7號',
  website: 'https://www.techinnov.com.tw',
  description: '台灣科技創新有限公司成立於2010年,專注於軟體開發與人工智能解決方案,致力於為企業提供創新的技術服務。我們的使命是透過科技提升企業效率,創造更美好的未來。',
  logo: '',
  cover: ''
})

const passwordInfo = ref({
  current: '',
  new: '',
  confirm: ''
})

const contactInfo = ref({
  name: '陳企業管理員',
  title: '人資經理',
  email: 'hr@techinnov.com.tw',
  phone: '02-2345-6789'
})

const industryOptions = ['科技業', '金融業', '製造業', '服務業']
const scaleOptions = ['1-50人', '51-100人', '100-200人', '201-500人', '500人以上']
</script>

<template>
  <div class="space-y-6 p-6">
    <div class="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">
      目前的方案 日期：2025/7/1 - 2025/8/1 10:10AM 體驗人數上限 10 人 剩餘體驗人數 5 人
    </div>

    <div>
      <h2 class="text-2xl font-bold">
        帳戶設定
      </h2>
      <p class="text-gray-500">
        管理您的企業資料、密碼和使用權限
      </p>
    </div>

    <!-- 企業資料 -->
    <el-card>
      <template #header>
        <h3 class="text-lg font-semibold">
          企業資料
        </h3>
      </template>
      <el-form :model="companyInfo" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企業名稱*">
              <el-input v-model="companyInfo.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="統一編號(個人工作室可不填)">
              <el-input v-model="companyInfo.taxId" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="產業類別*">
              <el-select v-model="companyInfo.industry" class="w-full min-w-form-control md:max-w-form-select">
                <el-option v-for="item in industryOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企業規模*">
              <el-select v-model="companyInfo.scale" class="w-full min-w-form-control md:max-w-form-select">
                <el-option v-for="item in scaleOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企業地址*">
              <el-input v-model="companyInfo.address" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企業網站">
              <el-input v-model="companyInfo.website" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="企業簡介">
          <el-input v-model="companyInfo.description" type="textarea" :rows="5" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企業標誌">
              <div class="flex items-center gap-4">
                <el-avatar :size="80" src="https://via.placeholder.com/80" />
                <el-button>
                  更換標誌
                </el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企業封面">
              <div class="flex items-center gap-4">
                <div class="h-20 w-40 rounded-lg bg-gray-200" />
                <el-button>
                  更換封面
                </el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="flex justify-end">
        <el-button type="primary">
          儲存企業資料
        </el-button>
      </div>
    </el-card>

    <!-- 變更密碼 -->
    <el-card>
      <template #header>
        <h3 class="text-lg font-semibold">
          變更密碼
        </h3>
      </template>
      <el-form :model="passwordInfo" label-position="top">
        <el-form-item label="目前密碼*">
          <el-input v-model="passwordInfo.current" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密碼*">
          <el-input v-model="passwordInfo.new" type="password" show-password />
          <p class="text-xs text-gray-400">
            密碼必須包含至少8個字符,包括大小寫字母、數字和特殊符號
          </p>
        </el-form-item>
        <el-form-item label="確認新密碼*">
          <el-input v-model="passwordInfo.confirm" type="password" show-password />
        </el-form-item>
      </el-form>
      <div class="flex justify-end">
        <el-button type="primary">
          更新密碼
        </el-button>
      </div>
    </el-card>

    <!-- 聯絡人資料 -->
    <el-card>
      <template #header>
        <h3 class="text-lg font-semibold">
          聯絡人資料
        </h3>
      </template>
      <el-form :model="contactInfo" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="聯絡人姓名*">
              <el-input v-model="contactInfo.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="職稱*">
              <el-input v-model="contactInfo.title" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="電子郵件*">
              <el-input v-model="contactInfo.email" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="聯絡電話*">
              <el-input v-model="contactInfo.phone" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="flex justify-end">
        <el-button type="primary">
          儲存聯絡人資料
        </el-button>
      </div>
    </el-card>

    <!-- 危險操作區 -->
    <el-card>
      <template #header>
        <h3 class="text-lg font-semibold text-red-600">
          危險操作區
        </h3>
      </template>
      <div>
        <h4 class="font-bold">
          刪除帳戶
        </h4>
        <p class="text-sm text-gray-500">
          永久刪除您的企業帳戶及所有相關資料,此操作無法復原
        </p>
      </div>
      <div class="mt-4 flex justify-end">
        <el-button type="danger">
          刪除帳戶
        </el-button>
      </div>
    </el-card>
  </div>
</template>