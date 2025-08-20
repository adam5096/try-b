<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import {
  Bell,
  Briefcase,
  Document,
  Menu as IconMenu,
  Plus,
  Search,
  Setting,
  Star,
  SwitchButton,
} from '@element-plus/icons-vue';
import { companyRoutes as r } from '~/utils/companyRoutes';

const authStore = useCompanyAuthStore();
const router = useRouter();
const isSidebarOpen = ref(false);

const programsPath = router.resolve(r.landing()).path;  // 計畫列表
const newProgramPath = router.resolve(r.newProgram()).path; // 新增體驗
const purchasePath = router.resolve(r.purchase()).path; // 方案
const commentsPath = router.resolve(r.comments()).path; // 評價管理
const settingsPath = router.resolve(r.settings()).path; // 帳戶設定

async function handleLogout() {
  try {
    await ElMessageBox.confirm(
      '您確定要登出嗎？',
      '登出確認',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    );

    await authStore.logout();
    router.push('/company/login');
  } catch (error) {
    // 使用者點擊 "取消" 或關閉對話框
    // 'cancel' 字串會被 ElMessageBox.confirm 的 Promise a catch 到
  }
}
</script>

<template>
  <el-container class="h-screen">
    <!-- Header -->
    <el-header class="fixed top-0 left-0 right-0 z-20 flex items-center justify-between bg-white border-b px-6">
      <div class="flex items-center gap-2">
        
        <h1 class="text-xl font-bold">
          TRY ß 職業體驗平台
        </h1>
      </div>
      <div class="flex items-center">
        <div class=" items-center gap-6 flex">
          <el-badge :value="1" class="item" type="primary">
            <el-button :icon="Bell" circle />
          </el-badge>
          <div class="flex items-center gap-2">
            <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <div>
              <div class="text-sm font-medium">
                企業管理員
              </div>
              <div class="text-xs text-gray-500">
                陳曉明
              </div>
            </div>
          </div>
        </div>
        <button class="p-2 md:hidden" @click="isSidebarOpen = !isSidebarOpen" aria-label="切換選單">
          <el-icon :size="24"><IconMenu /></el-icon>
        </button>
      </div>
    </el-header>

    <!-- Main Container -->
    <div class="flex flex-col pt-[60px] md:flex-row">
      <!-- Sidebar -->
      <el-aside
        width="auto"
        class="w-full overflow-y-hidden bg-white transition-[max-height] duration-500 ease-in-out md:static md:h-auto md:max-h-full md:!w-[200px] md:border-r md:transition-none"
        :class="isSidebarOpen ? 'max-h-screen' : 'max-h-0 md:max-h-full'"
      >
        <el-menu :default-active="$route.path" router class="!border-r-0">
          <el-menu-item :index="programsPath">
            <el-icon><icon-menu /></el-icon>
            <span>計畫列表</span>
          </el-menu-item>
          <el-menu-item :index="newProgramPath">
            <el-icon><Plus /></el-icon>
            <span>新增體驗</span>
          </el-menu-item>
          <el-menu-item :index="commentsPath">
            <el-icon><Star /></el-icon>
            <span>評價管理</span>
          </el-menu-item>
          <el-menu-item :index="settingsPath">
            <el-icon><Setting /></el-icon>
            <span>帳戶設定</span>
          </el-menu-item>
          <div class="hidden grow md:block" />
          <el-menu-item :index="purchasePath">
            <el-icon><Briefcase /></el-icon>
            <span>方案</span>
          </el-menu-item>
          <el-menu-item @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
            <span>登出</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- Page Content -->
      <el-main class="bg-gray-50 overflow-y-auto">
        <slot />
      </el-main>
    </div>
  </el-container>
</template>

<style>
.el-menu-item {
  height: 48px;
}
</style>
