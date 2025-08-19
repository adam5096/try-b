<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const props = defineProps<{
  formData: any
  industryOptions: { value: number; label: string }[]
  scaleOptions: { value: number; label: string }[]
}>()

const emit = defineEmits(['next'])

const formRef = ref<FormInstance>()

const createRequiredValidator = (message: string) => {
  return (rule: any, value: any, callback: (error?: Error) => void) => {
    if (!value && value !== 0) {
      callback(new Error(message))
    } else {
      callback()
    }
  }
}

const validateEmail = (rule: any, value: any, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('Email為必填'))
    return
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    callback(new Error('請輸入有效的 Email 格式'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule: any, value: any, callback: (error?: Error) => void) => {
  if (value === '') {
    callback(new Error('確認密碼為必填'))
  } else if (value !== props.formData.password) {
    callback(new Error('兩次輸入的密碼不一致'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  name: [{ validator: createRequiredValidator('企業名稱為必填'), trigger: 'blur' }],
  account: [{ validator: createRequiredValidator('帳號為必填'), trigger: 'blur' }],
  email: [{ validator: validateEmail, trigger: ['blur', 'change'] }],
  password: [{ validator: createRequiredValidator('密碼為必填'), trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
  // industry_id: [{ validator: createRequiredValidator('產業類別為必填'), trigger: 'change' }],
  // scale_id: [{ validator: createRequiredValidator('企業規模為必填'), trigger: 'change' }],
  address: [{ validator: createRequiredValidator('企業地址為必填'), trigger: 'blur' }]
})

const handleNextClick = async () => {
  const formEl = formRef.value
  if (!formEl) return

  try {
    await formEl.validate()
    emit('next')
  } catch (fields) {
    console.log('Validation failed on fields:', fields)
    // 驗證失敗後，Element Plus 會更新其內部狀態以顯示錯誤。
    // 這個更新不是同步的。我們必須使用 nextTick 等待下一個 DOM 更新週期，
    // 以確保當 Playwright 進行下一步斷言時，錯誤訊息的 DOM 元素已經被渲染出來。
    await nextTick()
  }
}
</script>

<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold text-gray-800">企業資料</h1>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-position="top"
      class="grid grid-cols-2 gap-x-6"
      size="large"
    >
      <el-form-item label="帳號" prop="account" class="col-span-2 md:col-span-1">
        <el-input v-model="formData.account" placeholder="請輸入帳號" />
      </el-form-item>

      <el-form-item label="Email" prop="email" class="col-span-2 md:col-span-1">
        <el-input v-model="formData.email" placeholder="請輸入Email" />
      </el-form-item>

      <el-form-item label="密碼" prop="password" class="col-span-2 md:col-span-1">
        <el-input v-model="formData.password" type="password" placeholder="請輸入密碼" show-password />
      </el-form-item>

      <el-form-item label="確認密碼" prop="confirmPassword" class="col-span-2 md:col-span-1">
        <el-input
          v-model="formData.confirmPassword"
          type="password"
          placeholder="再次輸入密碼"
          show-password
        />
      </el-form-item>

      <el-form-item label="企業名稱" prop="name" class="col-span-2 md:col-span-1">
        <el-input v-model="formData.name" placeholder="請輸入企業的名稱" />
      </el-form-item>

      <el-form-item label="統一編號" class="col-span-2 md:col-span-1">
        <el-input v-model="formData.tax_id_num" placeholder="請輸入有效的統一編號（個人工作室可不填）" />
      </el-form-item>

      <el-form-item label="產業類別" class="col-span-2 md:col-span-1">
        <el-select v-model="formData.industry_id" placeholder="請選擇企業的產業類別" class="w-full">
          <el-option
            v-for="item in industryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="企業規模" class="col-span-2 md:col-span-1">
        <el-select v-model="formData.scale_id" placeholder="請選擇企業的規模" class="w-full">
          <el-option
            v-for="item in scaleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="企業地址" prop="address" class="col-span-2">
        <el-input v-model="formData.address" placeholder="請輸入完整地址" />
      </el-form-item>

      <el-form-item label="企業網站" class="col-span-2">
        <el-input v-model="formData.website" placeholder="請輸入有效的網址" />
      </el-form-item>

      <el-form-item label="企業簡介" class="col-span-2">
        <el-input
          v-model="formData.intro"
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
          @click="handleNextClick"
        >
          下一步
        </el-button>
      </div>
    </el-form>
  </div>
</template>