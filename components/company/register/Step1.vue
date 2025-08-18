<script setup lang="ts">
defineProps<{
  formData: any
  industryOptions: { value: string; label: string }[]
  scaleOptions: { value: string; label: string }[]
}>()

const emit = defineEmits(['next'])
</script>

<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold text-gray-800">企業資料</h1>

    <el-form
      :model="formData"
      label-position="top"
      class="grid grid-cols-2 gap-x-6"
      size="large"
    >
      <el-form-item label="帳號 *" prop="account" class="col-span-2 md:col-span-1">
        <el-input v-model="formData.account" placeholder="請輸入帳號" />
      </el-form-item>

      <el-form-item label="Email *" prop="email" class="col-span-2 md:col-span-1">
        <el-input v-model="formData.email" placeholder="請輸入Email" />
      </el-form-item>

      <el-form-item label="密碼 *" prop="password" class="col-span-2 md:col-span-1">
        <el-input v-model="formData.password" type="password" placeholder="請輸入密碼" show-password />
      </el-form-item>

      <el-form-item label="確認密碼 *" prop="confirmPassword" class="col-span-2 md:col-span-1">
        <el-input
          v-model="formData.confirmPassword"
          type="password"
          placeholder="再次輸入密碼"
          show-password
        />
      </el-form-item>

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
          @click="emit('next')"
        >
          下一步
        </el-button>
      </div>
    </el-form>
  </div>
</template> 