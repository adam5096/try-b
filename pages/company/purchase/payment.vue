<!-- ep10-1 付款頁面 -->
<script setup lang="ts">
import { ref } from 'vue'
import {
  Check,
} from '@element-plus/icons-vue'


definePageMeta({
  layout: 'company',
  name: 'company-purchase-payment',
})

const router = useRouter()

const paymentMethod = ref('creditCard')

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="p-8 bg-white">
    <!-- Current Plan Static Info -->
    <div class="p-4 bg-gray-50 rounded-lg shadow-sm mb-6">
      <p class="text-sm text-gray-500">
        目前的方案 日期：2025/7/1 - 2025/8/1 10:10AM 體驗人數上限 10 人 剩餘體驗人數 5 人
      </p>
    </div>

    <div>
      <!-- Header -->
      <h2 class="text-xl font-bold mb-6 text-center">
        方案總覽
      </h2>
      <el-steps :active="1" finish-status="success" align-center class="mb-10">
        <el-step title="選擇方案" />
        <el-step title="付款方式" />
        <el-step title="完成付款" />
      </el-steps>

      <!-- Plan Summary -->
      <div class="border border-gray-200 rounded-lg p-6 mb-8">
        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium text-gray-800">
              方案
            </p>
            <p class="text-gray-600">
              您選擇的方案：60天 體驗人數上限 30 人
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">
              方案費用
            </p>
            <p class="text-2xl font-semibold text-gray-800">
              NT$ 2,700
            </p>
          </div>
        </div>
      </div>

      <!-- Payment Method Selection -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">
          選擇付款方式
        </h3>
        <el-radio-group v-model="paymentMethod" class="space-y-4 w-full">
          <el-radio value="creditCard" size="large" border class="w-full !mr-0 h-auto items-start pt-4 pb-4">
            <div class="flex justify-between items-center w-full">
              <div>
                <p>信用卡付款</p>
                <p class="text-sm text-gray-500">
                  支援 VISA、MasterCard、JCB
                </p>
              </div>
              <div class="flex items-center gap-2 text-3xl text-gray-400">
                <font-awesome-icon :icon="['fab', 'cc-visa']" />
                <font-awesome-icon :icon="['fab', 'cc-mastercard']" />
                <font-awesome-icon :icon="['fab', 'cc-jcb']" />
              </div>
            </div>
          </el-radio>
          <el-radio value="cvs" size="large" border class="w-full !mr-0 h-auto items-start pt-4 pb-4">
            <div class="flex justify-between items-center w-full">
              <div>
                <p>超商代碼繳費</p>
                <p class="text-sm text-gray-500">
                  支援 7-11、全家、萊爾富、OK超商
                </p>
              </div>
              <div class="text-2xl">
                🏪
              </div>
            </div>
          </el-radio>
          <el-radio value="atm" size="large" border class="w-full !mr-0 h-auto items-start pt-4 pb-4">
            <div class="flex justify-between items-center w-full">
              <div>
                <p>ATM 虛擬帳號轉帳</p>
                <p class="text-sm text-gray-500">
                  適合企業匯款或大額交易
                </p>
              </div>
              <div class="text-2xl">
                🏛️
              </div>
            </div>
          </el-radio>
          <el-radio value="subscription" size="large" border class="w-full !mr-0 h-auto items-start pt-4 pb-4">
            <div class="flex justify-between items-center w-full">
              <div>
                <p>訂閱制自動扣款</p>
                <p class="text-sm text-gray-500">
                  每月自動扣款 NT$ 380 x 10 期
                </p>
              </div>
              <div class="text-2xl">
                🔄
              </div>
            </div>
          </el-radio>
        </el-radio-group>
      </div>

      <!-- Credit Card Form -->
      <div v-if="paymentMethod === 'creditCard'" class="mb-8">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">
          信用卡資訊
        </h3>
        <div class="border border-gray-200 rounded-lg p-6">
          <div class="grid grid-cols-2 gap-x-4 gap-y-6">
            <div class="col-span-2">
              <label for="cardNumber" class="block text-sm font-medium text-gray-700 mb-1">卡號</label>
              <el-input id="cardNumber" placeholder="1234 5678 9012 3456" size="large" />
            </div>
            <div>
              <label for="expiryDate" class="block text-sm font-medium text-gray-700 mb-1">有效期限</label>
              <el-input id="expiryDate" placeholder="MM / YY" size="large" />
            </div>
            <div>
              <label for="cvc" class="block text-sm font-medium text-gray-700 mb-1">安全碼</label>
              <el-input id="cvc" placeholder="123" size="large" />
            </div>
            <div class="col-span-2">
              <label for="cardName" class="block text-sm font-medium text-gray-700 mb-1">持卡人姓名</label>
              <el-input id="cardName" placeholder="請輸入與信用卡上相同的姓名" size="large" />
            </div>
          </div>
          <div class="mt-6">
            <el-checkbox label="儲存此卡片資訊，下次可快速結帳" size="large" />
          </div>
        </div>
      </div>

      <!-- Totals -->
      <div class="bg-gray-50 rounded-lg p-6 mb-8">
        <div class="flex justify-between items-center text-gray-800 mb-2">
          <p>方案費用</p>
          <p>NT$ 2,700</p>
        </div>
        <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
          <p>手續費</p>
          <p>NT$ 0</p>
        </div>
        <div class="border-t border-gray-200 my-4" />
        <div class="flex justify-between items-center font-semibold text-lg text-gray-800">
          <p>總計金額</p>
          <p>NT$ 2,700</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-between">
        <el-button size="large" @click="goBack">
          上一步
        </el-button>
        <el-button type="primary" size="large">
          確認付款
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for el-steps */
:deep(.el-step__title.is-process) {
  @apply font-bold;
}

:deep(.el-step.is-simple .el-step__title) {
  @apply whitespace-nowrap;
}

/* Custom styles for el-radio */
:deep(.el-radio.is-bordered) {
  @apply border-gray-200;
}
:deep(.el-radio.is-bordered.is-checked) {
  @apply border-green-500 bg-green-50;
}
:deep(.el-radio__input.is-checked .el-radio__inner) {
  @apply border-green-500 bg-green-500;
}
:deep(.el-radio__label) {
  @apply w-full;
}

/* Custom styles for el-button */
:deep(.el-button--primary) {
    @apply bg-gray-800 border-gray-800;
}
:deep(.el-button--primary:hover) {
    @apply bg-gray-700 border-gray-700;
}

</style>