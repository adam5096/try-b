<script setup lang="ts">
import { ref } from 'vue';
import { userRoutes } from '~/utils/userRoutes';

definePageMeta({
  name: 'user-landing',
  layout: 'user',
});

const popularPrograms = ref([
  { id: 1, title: '軟體工程師體驗營', company: '科技公司 A', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop' },
  { id: 2, title: '咖啡師職人體驗', company: '文青咖啡館', image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1974&auto=format&fit=crop' },
  { id: 3, title: '數位行銷實戰體驗', company: '電商平台 B', image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop' },
  { id: 4, title: '永續農業見習', company: '有機農場 C', image: 'https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=1974&auto=format&fit=crop' },
]);

const generalPrograms = ref([
    {
    id: 5,
    title: '投資理財顧問體驗',
    company: '金融公司 D',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1911&auto=format&fit=crop',
    description: '跟隨資深理財顧問了解金融市場分析、學習投資組合規劃，體驗為客戶制定理財策略的專業服務流程。',
    location: '台北市大安區',
    date: '2025/09/10 - 2025/11/20',
    applicants: 0,
    deadline: 40,
    status: '體驗進行中'
  },
  {
    id: 6,
    title: 'UI/UX設計師工作坊',
    company: '設計工作室 E',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop',
    description: '深入設計思維流程，從用戶研究到原型製作，體驗數位產品設計的完整過程，了解設計師的創作思路。',
    location: '金門縣烈嶼鄉',
    date: '2025/10/01 - 2025/12/20',
    applicants: 0,
    deadline: 10,
    status: ''
  },
  {
    id: 7,
    title: '新創企業營運體驗',
    company: '新創公司 F',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop',
    description: '加入新創團隊實際參與產品開發、市場策略制定，體驗創業家的決策焦慮，了解新創生態的運作模式。',
    location: '屏東縣恆春鎮',
    date: '2025/07/01 - 2025/10/31',
    applicants: 0,
    deadline: 10,
    status: ''
  },
    {
    id: 8,
    title: '投資理財顧問體驗',
    company: '金融公司 D',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1911&auto=format&fit=crop',
    description: '跟隨資深理財顧問了解金融市場分析、學習投資組合規劃，體驗為客戶制定理財策略的專業服務流程。',
    location: '台北市大安區',
    date: '2025/09/10 - 2025/11/20',
    applicants: 0,
    deadline: 40,
    status: '體驗進行中'
  },
  {
    id: 9,
    title: 'UI/UX設計師工作坊',
    company: '設計工作室 E',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop',
    description: '深入設計思維流程，從用戶研究到原型製作，體驗數位產品設計的完整過程，了解設計師的創作思路。',
    location: '金門縣烈嶼鄉',
    date: '2025/10/01 - 2025/12/20',
    applicants: 0,
    deadline: 10,
    status: ''
  },
  {
    id: 10,
    title: '新創企業營運體驗',
    company: '新創公司 F',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop',
    description: '加入新創團隊實際參與產品開發、市場策略制定，體驗創業家的決策焦慮，了解新創生態的運作模式。',
    location: '屏東縣恆春鎮',
    date: '2025/07/01 - 2025/10/31',
    applicants: 0,
    deadline: 10,
    status: ''
  },
]);

const searchKeyword = ref('');
const industry = ref('');
const jobType = ref('');
const location = ref('');
const sort = ref('');
const currentPage = ref(1);

const industries = ref([
  { value: 'tech', label: '科技業' },
  { value: 'finance', label: '金融業' },
  { value: 'retail', label: '零售業' },
  { value: 'catering', label: '餐飲業' },
]);

const jobTypes = ref([
  { value: 'engineering', label: '工程師' },
  { value: 'designer', label: '設計師' },
  { value: 'marketing', label: '行銷' },
  { value: 'pm', label: '產品經理' },
]);

const locations = ref([
  { value: 'taipei', label: '台北市' },
  { value: 'hsinchu', label: '新竹市' },
  { value: 'kaohsiung', label: '高雄市' },
]);

const sortOptions = ref([
  { value: 'latest', label: '最新發布' },
  { value: 'popular', label: '熱門程度' },
  { value: 'deadline', label: '截止日期' },
]);

</script>

<template>
  <main class="bg-gray-100">
    <div class="py-12">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <!-- Hot Programs Section -->
        <section class="mb-16">
          <h2 class="text-2xl font-bold mb-2">熱門體驗計畫總覽</h2>
          <p class="text-gray-500 mb-8">在這裡探索最受歡迎的體驗計畫，看看大家都喜歡哪些活動！</p>
          <el-carousel :interval="4000" type="card" height="300px">
            <el-carousel-item v-for="program in popularPrograms" :key="program.id">
              <el-card :body-style="{ padding: '0px' }" class="h-full">
                <img :src="program.image" class="w-full h-2/3 object-cover" />
                <div class="p-4">
                  <h3 class="text-lg font-bold">{{ program.title }}</h3>
                  <p class="text-sm text-gray-500">{{ program.company }}</p>
                </div>
              </el-card>
            </el-carousel-item>
          </el-carousel>
        </section>

        <!-- General Programs Section -->
        <section>
          <h2 class="text-2xl font-bold mb-2">一般體驗計畫總覽</h2>
          <p class="text-gray-500 mb-8">管理您已申請的體驗計畫，並在這裡快速申請新計畫。</p>

          <!-- Filters -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 p-4 bg-white rounded-lg shadow">
            <el-input v-model="searchKeyword" placeholder="關鍵字搜尋" clearable class="w-full md:max-w-form-search" />
            <el-select v-model="industry" placeholder="產業類別" clearable class="w-full min-w-form-control md:max-w-form-select">
              <el-option v-for="item in industries" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="jobType" placeholder="職業類別" clearable class="w-full min-w-form-control md:max-w-form-select">
              <el-option v-for="item in jobTypes" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="location" placeholder="地區" clearable class="w-full min-w-form-control md:max-w-form-select">
              <el-option v-for="item in locations" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="sort" placeholder="排序" clearable class="w-full min-w-form-control md:max-w-form-select">
              <el-option v-for="item in sortOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>

          <!-- Program Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <el-card v-for="program in generalPrograms" :key="program.id" class="shadow-lg hover:shadow-xl transition-shadow">
              <template #header>
                <div class="flex justify-between items-center">
                  <span class="font-bold text-lg">{{ program.title }}</span>
                  <el-button text>
                    <font-awesome-icon :icon="['fas', 'heart']" />
                  </el-button>
                </div>
              </template>
              <div class="text-sm text-gray-600">
                <p class="min-h-[4.5rem]">{{ program.description }}</p>
                <div class="mt-4 space-y-2">
                  <div class="flex items-center gap-2">
                    <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
                    <span>{{ program.location }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <font-awesome-icon :icon="['fas', 'calendar-alt']" />
                    <span>{{ program.date }}</span>
                  </div>
                </div>
                <div class="mt-4 flex justify-between text-xs text-gray-500 border-t pt-2">
                  <span>已申請人數：{{ program.applicants }} 人</span>
                  <span>申請截止還有 {{ program.deadline }} 天</span>
                </div>
                 <div class="mt-2 text-right text-blue-500 font-bold min-h-5">
                   <span v-if="program.status">{{ program.status }}</span>
                 </div>
              </div>
              <template #footer>
                <NuxtLink :to="userRoutes.programDetail(program.id)">
                  <el-button type="primary" class="w-full">查看詳情</el-button>
                </NuxtLink>
              </template>
            </el-card>
          </div>
          
          <!-- Pagination -->
          <div class="mt-12 flex justify-center">
            <el-pagination
              v-model:current-page="currentPage"
              :page-size="6"
              layout="prev, pager, next"
              :total="generalPrograms.length"
            />
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<style>
.el-carousel__arrow {
  background-color: rgba(31, 41, 55, 0.5);
  color: white;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.el-carousel__arrow:hover {
  background-color: rgba(31, 41, 55, 0.8);
}
</style>