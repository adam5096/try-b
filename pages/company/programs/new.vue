<script lang="ts" setup>
import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';

definePageMeta({
  layout: 'company',
  name: 'company-programs-new',
});

const form = ref({
  title: '',
  industry: '',
  jobCategory: '',
  location: '',
  contactPerson: '',
  contactPhone: '',
  description: [
    { title: '體驗介紹', content: '' },
    { title: '行程安排', content: '' },
    { title: '收穫', content: '' },
  ],
  customItems: [{ content: '這邊是預計給使用者自訂項目的編輯器\n- 說明1\n- 說明2\n- 說明3' }],
  attendees: '1-5人',
  startDate: '',
  duration: '',
  images: [],
  agree: false,
});

function addDescriptionField() {
  if (form.value.description.length < 5) {
    form.value.description.push({ title: '自定義項目', content: '' });
  }
}
</script>

<template>
  <div class="p-6 bg-white rounded-lg shadow-sm">
    

    <div class="mb-6 flex justify-between items-center" role="alert">
      <div class="text-sm text-red-500">
        目前的方案 <span class="font-medium">已過期</span> 體驗人數 <span class="font-medium">已達上限</span>
      </div>
      <el-button class="btn-brand-yellow">
        購買方案
      </el-button>
    </div>
    <h2 class="text-2xl font-bold mb-6">
      新增體驗計畫
    </h2>
    <el-form :model="form" label-position="top">
      <el-form-item label="體驗名稱 (最多10個字)">
        <el-input v-model="form.title" placeholder="計劃輸入匡" />
      </el-form-item>
      <el-form-item label="體驗名稱 (最多10個字)">
        <div class="p-4 border rounded-md bg-gray-50 w-full">
          <p>您可以描述</p>
          <ul class="list-decimal list-inside text-gray-500">
            <li>體驗計畫的內容與目標</li>
            <li>師資陣容與經歷</li>
            <li>行前須知和注意事項</li>
            <li>參加體驗的門檻或限制</li>
          </ul>
        </div>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="產業類別">
            <el-select v-model="form.industry" placeholder="搜尋計劃名稱" class="w-full">
              <!-- options here -->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="職務類別">
            <el-select v-model="form.jobCategory" placeholder="請選擇職務類別" class="w-full">
              <!-- options here -->
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="體驗地址">
        <el-input v-model="form.location" placeholder="請輸入體驗地點的完整地址" />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="聯絡人">
            <el-input v-model="form.contactPerson" placeholder="請輸入聯絡人姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="電話">
            <el-input v-model="form.contactPhone" placeholder="請輸入聯絡電話" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="計畫詳細說明 (計劃說明最多可新增至五個階段)">
        <div v-for="(item, index) in form.description" :key="index" class="w-full mb-4">
          <label class="font-medium">階段 {{ index + 1 }}: {{ item.title }}</label>
          <el-input v-model="item.content" type="textarea" :rows="3" placeholder="描述此階段的內容、時間與目標" />
          <div v-if="index > 2" class="text-right mt-1">
            <el-button text size="small">
              編輯
            </el-button>
          </div>
        </div>
        <div v-for="(item, index) in form.customItems" :key="index" class="w-full mb-4">
          <label class="font-medium">階段 {{ form.description.length + index + 1 }}: 請輸入自定義項目</label>
          <div class="border rounded-md p-4">
            <!-- Simplified editor view -->
            <div class="prose" v-html="item.content.replace(/\n/g, '<br>')"></div>
          </div>
        </div>

        <el-button :icon="Plus" @click="addDescriptionField" :disabled="form.description.length >= 5">
          新增階段
        </el-button>
      </el-form-item>

      <el-form-item label="計畫日期與照片">
        <el-row :gutter="20" class="w-full">
          <el-col :span="12">
            <el-form-item label="體驗人數">
              <el-select v-model="form.attendees" class="w-full">
                <el-option label="1-5 人" value="1-5人" />
              </el-select>
            </el-form-item>
            <el-form-item label="體驗刊登開始日期">
              <el-date-picker v-model="form.startDate" type="date" placeholder="請選擇開始日期" class="w-full" />
            </el-form-item>
            <el-form-item label="刊登期間">
              <el-select v-model="form.duration" placeholder="請選擇刊登期間" class="w-full">
                <!-- options here -->
              </el-select>
              <p class="text-sm text-gray-500">
                結束日期 2025/9/10
              </p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="體驗照片 (最多四張)">
              <el-upload
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                multiple
                :limit="4"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <el-checkbox v-model="form.agree">
          我已閱讀並同意 <el-link type="primary">服務條款</el-link> 與 <el-link type="primary">隱私權政策</el-link>
        </el-checkbox>
      </el-form-item>

      <el-form-item>
        <el-button>預覽</el-button>
        <el-button type="primary">
          送出
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template> 