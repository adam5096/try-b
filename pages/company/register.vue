<script setup lang="ts">
import { ref, reactive } from 'vue';
import Step1 from '~/components/company/register/Step1.vue';
import Step2 from '~/components/company/register/Step2.vue';
import Step3 from '~/components/company/register/Step3.vue';

definePageMeta({
  layout: 'main',
});

const currentStep = ref(1);

const formData = reactive({
  // Step 1 data
  account: '',
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  taxId: '',
  industry: '',
  scale: '',
  address: '',
  website: '',
  description: '',
  logo: null,
  cover: null,

  // Step 2 data
  contactName: '',
  contactTitle: '',
  contactEmail: '',
  contactPhone: '',
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

function nextStep() {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
}

function previousStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}
</script>

<template>
  <div class="bg-gray-50 py-12 lg:py-16">
    <div class="mx-auto w-full max-w-4xl rounded-lg bg-white p-8 shadow-sm lg:p-16">
      <!-- Dynamic Stepper -->
      <div class="mb-10 flex items-center">
        <!-- Step 1 -->
        <div class="flex flex-col items-center text-center">
          <div
            :class="[
              'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
              currentStep >= 1 ? 'bg-gray-800 text-white' : 'border-2 border-gray-300 text-gray-400',
            ]"
          >
            1
          </div>
          <span :class="['mt-2 w-20 text-sm', currentStep >= 1 ? 'font-bold text-gray-800' : 'text-gray-400']">
            企業資料
          </span>
        </div>
        <div :class="['mx-4 h-px flex-1', currentStep > 1 ? 'bg-gray-800' : 'bg-gray-300']" />
        <!-- Step 2 -->
        <div class="flex flex-col items-center text-center">
          <div
            :class="[
              'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
              currentStep >= 2 ? 'bg-gray-800 text-white' : 'border-2 border-gray-300 text-gray-400',
            ]"
          >
            2
          </div>
          <span :class="['mt-2 w-20 text-sm', currentStep >= 2 ? 'font-bold text-gray-800' : 'text-gray-400']">
            聯絡人資料
          </span>
        </div>
        <div :class="['mx-4 h-px flex-1', currentStep > 2 ? 'bg-gray-800' : 'bg-gray-300']" />
        <!-- Step 3 -->
        <div class="flex flex-col items-center text-center">
          <div
            :class="[
              'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
              currentStep >= 3 ? 'bg-gray-800 text-white' : 'border-2 border-gray-300 text-gray-400',
            ]"
          >
            3
          </div>
          <span :class="['mt-2 w-20 text-sm', currentStep >= 3 ? 'font-bold text-gray-800' : 'text-gray-400']">
            完成註冊
          </span>
        </div>
      </div>

      <!-- Step Components -->
      <Step1
        v-if="currentStep === 1"
        :form-data="formData"
        :industry-options="industryOptions"
        :scale-options="scaleOptions"
        @next="nextStep"
      />
      <Step2
        v-if="currentStep === 2"
        :form-data="formData"
        @previous="previousStep"
        @next="nextStep"
      />
      <Step3 v-if="currentStep === 3" />
    </div>
  </div>
</template>
