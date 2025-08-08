<script setup lang="ts">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';

type DateModel = [Date, Date] | '';

interface ApplyForm {
  name: string;
  phone: string;
  email: string;
  dateRange: DateModel;
  resume: string;
  message: string;
  agree: boolean;
}

const formRef = ref<FormInstance>();
const form = ref<ApplyForm>({
  name: '',
  phone: '',
  email: '',
  dateRange: '',
  resume: '',
  message: '',
  agree: false,
});

const submitting = ref(false);

const rules: FormRules<ApplyForm> = {
  name: [{ required: true, message: '請輸入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '請輸入聯絡電話', trigger: 'blur' },
    { pattern: /^[0-9\-+()\s]{7,20}$/, message: '電話格式不正確', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '請輸入電子郵件', trigger: 'blur' },
    { type: 'email', message: 'Email 格式不正確', trigger: ['blur', 'change'] },
  ],
  dateRange: [{ required: true, message: '請選擇參加日期', trigger: 'change' }],
  resume: [{ required: true, message: '請選擇履歷', trigger: 'change' }],
  agree: [
    {
      validator: (_rule, value: boolean, callback) => {
        if (value) callback();
        else callback(new Error('請勾選同意條款'));
      },
      trigger: 'change',
    },
  ],
};

const resumeOptions = [
  { label: '履歷 A', value: 'A' },
  { label: '履歷 B', value: 'B' },
];

const emit = defineEmits<{ (e: 'submitted'): void }>();

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      submitting.value = true;
      // TODO: 串接 API 提交資料
      emit('submitted');
    } finally {
      submitting.value = false;
    }
  });
};
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-bold text-gray-900">申請體驗</h3>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="陳曉明" />
      </el-form-item>

      <el-form-item label="聯絡電話" prop="phone">
        <el-input v-model="form.phone" placeholder="0912345678" />
      </el-form-item>

      <el-form-item label="電子郵件" prop="email">
        <el-input v-model="form.email" placeholder="abc@gmail.com" />
      </el-form-item>

      <el-form-item label="參加日期" prop="dateRange">
        <el-date-picker
          v-model="form.dateRange"
          type="daterange"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
          range-separator="至"
          style="width: 100%;"
        />
      </el-form-item>

      <el-form-item label="履歷" prop="resume">
        <el-select v-model="form.resume" placeholder="請選擇履歷">
          <el-option v-for="opt in resumeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="提交訊息">
        <el-input v-model="form.message" type="textarea" :rows="5" placeholder="請輸入申請動機或補充說明" />
      </el-form-item>

      <div class="text-center text-sm text-gray-600 space-y-2 py-2">
        <el-checkbox v-model="form.agree" label="我已閱讀並同意" />
        <div>服務條款 與 隱私權政策</div>
      </div>

      <div class="flex justify-center">
        <el-button type="primary" :disabled="!form.agree" :loading="submitting" @click="handleSubmit">提交申請</el-button>
      </div>
    </el-form>
  </div>
</template>
