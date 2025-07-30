<script lang="ts" setup>
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

const router = useRouter();
const programsPath = router.resolve(r.landing()).path;  // 計畫列表
const newProgramPath = router.resolve(r.newProgram()).path; // 新增體驗
const purchasePath = router.resolve(r.purchase()).path; // 方案
const commentsPath = router.resolve(r.comments()).path; // 評價管理
const settingsPath = router.resolve(r.settings()).path; // 帳戶設定
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
      <div class="flex items-center gap-6">
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
    </el-header>

    <!-- Main Container -->
    <el-container class="pt-[60px]">
      <!-- Sidebar -->
      <el-aside width="240px" class="fixed top-[60px] left-0 bottom-0 bg-white border-r z-10">
        <el-menu :default-active="$route.path" router class="h-full !border-r-0">
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
          <div class="grow" />
          <el-menu-item :index="purchasePath">
            <el-icon><Briefcase /></el-icon>
            <span>方案</span>
          </el-menu-item>
          <el-menu-item index="#">
            <el-icon><SwitchButton /></el-icon>
            <span>登出</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- Page Content -->
      <el-main class="bg-zinc-100 ml-[240px] overflow-y-auto">
        <div class="mx-auto max-w-7xl">
          <slot />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.el-menu-item {
  height: 48px;
}
</style> 