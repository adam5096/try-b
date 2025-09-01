<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { ReviewItem, ReviewStatus, CommentsQueryParams, SubmitEvaluationPayload } from '~/types/users/comment';
import { useUserComments } from '~/composables/api/users/useUserComments';
import { useUserEvaluation } from '~/composables/api/users/useUserEvaluation';

definePageMeta({
  name: 'user-comments',
  layout: 'user',
  middleware: 'user-auth',
});

// API 相關
const { fetchComments } = useUserComments();
const { submitEvaluation } = useUserEvaluation();
const commentsData = ref<any>(null);
const loading = ref(false);
const error = ref<any>(null);

// 篩選器狀態
const statusOptions = ['審核中', '系統已通過', '系統已拒絕', '人工已通過', '人工已拒絕', '待處理', '已發布', '全部通過', '全部拒絕', '未評價'];
const selectedStatuses = ref<string[]>([]);

const dateSortOptions = [
  { label: '新到舊', value: 'newest' },
  { label: '舊到新', value: 'oldest' },
] as const;
const selectedDateSort = ref<'newest' | 'oldest'>('newest');

// 分頁狀態
const currentPage = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [10, 20, 30, 50];

// 篩選面板可見性
const filterVisible = ref(false);

// 評價輸入狀態
const editingEvaluation = ref<{ [key: string]: { score: number; comment: string } }>({});

// 計算屬性
const totalReviews = computed(() => commentsData.value?.length || 0);
const visibleReviews = computed(() => commentsData.value || []);

// 狀態 ID 對應
const statusIdToText = (statusId: number): ReviewStatus => {
  const statusMap: { [key: number]: ReviewStatus } = {
    1: '審核中',
    2: '系統已通過',
    3: '系統已拒絕',
    4: '人工已通過',
    5: '人工已拒絕',
    6: '待處理',
    7: '已發布',
    15: '全部通過',
    16: '全部拒絕',
    17: '未評價',
  };
  return statusMap[statusId] || '未評價';
};

// 載入評價數據
const loadComments = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const params: CommentsQueryParams = {
      page: currentPage.value,
      limit: pageSize.value,
      status: selectedStatuses.value.length > 0 ? selectedStatuses.value as ReviewStatus[] : undefined,
      sort: selectedDateSort.value,
    };
    
    const result = await fetchComments(params);
    commentsData.value = result.data.value;
  } catch (err) {
    error.value = err;
    console.error('載入評價列表失敗:', err);
  } finally {
    loading.value = false;
  }
};

// 篩選相關函數
function onClearFilters() {
  selectedStatuses.value = [];
  selectedDateSort.value = 'newest';
  currentPage.value = 1;
  loadComments();
}

function onApplyFilters() {
  currentPage.value = 1;
  filterVisible.value = false;
  loadComments();
}

// 狀態標籤類型
function tagTypeForStatus(status: ReviewStatus): 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case '系統已通過':
    case '人工已通過':
    case '全部通過':
      return 'success';
    case '審核中':
    case '待處理':
      return 'warning';
    case '系統已拒絕':
    case '人工已拒絕':
    case '全部拒絕':
      return 'danger';
    default:
      return 'info';
  }
}

// 開始編輯評價
function startEditEvaluation(item: ReviewItem) {
  editingEvaluation.value[item.serial_num] = {
    score: item.score || 0,
    comment: item.comment || ''
  };
}

// 提交評價
async function submitEvaluationForItem(item: ReviewItem) {
  const evaluationData = editingEvaluation.value[item.serial_num];
  if (!evaluationData) return;

  try {
    // 顯示確認訊息
    await ElMessageBox.confirm(
      '確定要提交此評價嗎？',
      '確認提交',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    const payload: SubmitEvaluationPayload = {
      score: evaluationData.score,
      comment: evaluationData.comment
    };

    const result = await submitEvaluation(item.serial_num, payload);
    
    if (result.error.value) {
      throw result.error.value;
    }

    // 成功後更新本地數據
    const itemIndex = visibleReviews.value.findIndex((review: ReviewItem) => review.serial_num === item.serial_num);
    if (itemIndex !== -1) {
      visibleReviews.value[itemIndex].score = evaluationData.score;
      visibleReviews.value[itemIndex].comment = evaluationData.comment;
      visibleReviews.value[itemIndex].status_id = 2; // 假設提交後變為已通過狀態
    }

    // 清除編輯狀態
    delete editingEvaluation.value[item.serial_num];

    ElMessage.success('評價提交成功！');
  } catch (error: any) {
    if (error === 'cancel') return;
    
    console.error('提交評價失敗:', error);
    
    // 錯誤處理
    let errorMessage = '提交失敗，請稍後重試';
    
    // 處理後端錯誤回應
    if (error.data?.Message) {
      errorMessage = error.data.Message;
      
      // 特殊處理「體驗尚未結束」錯誤
      if (errorMessage === '體驗尚未結束') {
        ElMessage.warning('體驗尚未結束');
        // 退出編輯模式，收合多行輸入框
        delete editingEvaluation.value[item.serial_num];
        return;
      }
    } else if (error.message) {
      if (error.message.includes('網路')) {
        errorMessage = '網路連線異常，請檢查網路後重試';
      } else if (error.message.includes('認證') || error.message.includes('登入')) {
        errorMessage = '登入已過期，請重新登入';
      } else if (error.message.includes('維護')) {
        errorMessage = '服務暫時維護中，請稍後再試';
      } else {
        errorMessage = error.message;
      }
    }
    
    ElMessage.error(errorMessage);
  }
}

// 取消編輯
function cancelEditEvaluation(item: ReviewItem) {
  delete editingEvaluation.value[item.serial_num];
}

// 監聽分頁變化
watch([currentPage, pageSize], () => {
  loadComments();
});

// 初始化載入
onMounted(() => {
  loadComments();
});
</script>

<template>
  <section class="mx-auto max-w-container-users px-6 md:px-12 py-8 md:py-10">
    <!-- Header: 標題與總數 -->
    <div class="flex items-end justify-between">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-800">評價列表</h2>
      <div class="text-gray-500 text-base md:text-lg">共 {{ totalReviews }} 則評價</div>
    </div>

    <!-- Controls: 篩選按鈕 -->
    <div class="mt-6 flex flex-wrap items-center gap-4 md:gap-6">
      <!-- 篩選 Popover -->
      <el-popover v-model:visible="filterVisible" placement="bottom-start" trigger="click" :width="440">
        <template #reference>
          <el-button>篩選</el-button>
        </template>

        <div class="p-3">
          <div class="flex flex-col gap-6">
            <!-- 審核狀態群組 -->
            <div>
              <el-tag effect="plain" type="info">審核狀態</el-tag>
              <div class="mt-3">
                <el-checkbox-group v-model="selectedStatuses">
                  <el-checkbox-button v-for="opt in statusOptions" :key="opt" :value="opt">{{ opt }}</el-checkbox-button>
                </el-checkbox-group>
              </div>
            </div>

            <!-- 日期排序群組 -->
            <div>
              <el-tag effect="plain" type="info">日期</el-tag>
              <div class="mt-3">
                <el-radio-group v-model="selectedDateSort">
                  <el-radio-button v-for="opt in dateSortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </div>

          <div class="mt-5 flex justify-end gap-2">
            <el-button text @click="onClearFilters">清除</el-button>
            <el-button type="primary" @click="onApplyFilters">套用</el-button>
          </div>
        </div>
      </el-popover>
    </div>

    <!-- 分隔線 -->
    <el-divider/>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <el-loading />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <el-alert
        title="載入失敗"
        :description="error.message || '載入評價列表時發生錯誤'"
        type="error"
        show-icon
      />
      <el-button @click="loadComments" class="mt-4">重新載入</el-button>
    </div>

    <!-- List: 公司評價卡片 -->
    <div v-else>
      <div v-for="item in visibleReviews" :key="item.serial_num" class="py-4">
        <div class="flex items-center justify-between">
          <!-- Left: Logo + 公司名稱 + 體驗標籤 + 狀態 -->
          <div class="flex items-center gap-4">
            <el-avatar :size="48" :src="item.company_logo">{{ item.company_name.charAt(0) }}</el-avatar>
            <div class="flex items-center flex-wrap gap-x-3 gap-y-2">
              <div class="text-lg font-semibold text-gray-800">{{ item.company_name }}</div>
              <el-tag effect="plain" round>{{ item.program_name }}</el-tag>
              <el-tag :type="tagTypeForStatus(statusIdToText(item.status_id))" size="small" effect="plain">
                {{ statusIdToText(item.status_id) }}
              </el-tag>
            </div>
          </div>

          <!-- Right: 撰寫評價（僅未評價） -->
          <div v-if="item.status_id === 17 && !editingEvaluation[item.serial_num]">
            <el-button size="small" round @click="startEditEvaluation(item)">撰寫評價</el-button>
          </div>
        </div>

        <!-- 評分/日期/狀態列（已送出狀態） -->
        <div v-if="item.status_id !== 17" class="mt-3 flex items-center gap-4 text-gray-600">
          <el-rate :model-value="item.score || 0" disabled />
          <span class="font-semibold">{{ (item.score || 0).toFixed(1) }}</span>
          <span class="text-gray-400">{{ new Date(item.evaluation_date).toLocaleDateString() }}</span>
          <el-tag :type="tagTypeForStatus(statusIdToText(item.status_id))" size="small" effect="plain">
            {{ statusIdToText(item.status_id) }}
          </el-tag>
        </div>

        <!-- 內文 -->
        <p v-if="item.comment" class="mt-2 text-gray-700 leading-relaxed">{{ item.comment }}</p>

        <!-- 評價輸入區域（未評價狀態） -->
        <div v-if="item.status_id === 17 && editingEvaluation[item.serial_num]" class="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">評分</label>
              <el-rate v-model="editingEvaluation[item.serial_num].score" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">評價內容</label>
              <el-input
                v-model="editingEvaluation[item.serial_num].comment"
                type="textarea"
                :rows="4"
                placeholder="請輸入您的評價..."
                maxlength="500"
                show-word-limit
              />
            </div>
            <div class="flex justify-end gap-2">
              <el-button @click="cancelEditEvaluation(item)">取消</el-button>
              <el-button type="primary" @click="submitEvaluationForItem(item)">提交評價</el-button>
            </div>
          </div>
        </div>

        <!-- item divider -->
        <el-divider />
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && !error" class="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <!-- 每頁顯示 -->
      <div class="flex items-center gap-3">
        <span class="text-gray-600">每頁顯示：</span>
        <el-select v-model="pageSize" class="w-full min-w-form-control md:max-w-form-select">
          <el-option v-for="size in pageSizeOptions" :key="size" :label="`${size} 筆`" :value="size" />
        </el-select>
      </div>

      <!-- 分頁器 -->
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="totalReviews"
        :pager-count="7"
        layout="prev, pager, next"
        background
      />
    </div>
  </section>
</template>