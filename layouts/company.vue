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
const programsPath = router.resolve(r.landing()).path;
</script>

<template>
  <el-container class="h-screen">
    <el-aside width="240px" class="bg-white border-r">
      <div class="flex items-center justify-center h-16 border-b">
        <div class="flex items-center gap-2">
          <!-- <BetaIcon /> -->
          <h1 class="text-xl font-bold">
            TRY ß 職業體驗平台
          </h1>
        </div>
      </div>
      <el-menu :default-active="$route.path" router>
        <el-menu-item :index="programsPath">
          <el-icon><icon-menu /></el-icon>
          <span>計畫列表</span>
        </el-menu-item>
        <el-menu-item index="#">
          <el-icon><Plus /></el-icon>
          <span>新增體驗</span>
        </el-menu-item>
        <el-menu-item index="#">
          <el-icon><Star /></el-icon>
          <span>評價管理</span>
        </el-menu-item>
        <el-menu-item index="#">
          <el-icon><Setting /></el-icon>
          <span>帳戶設定</span>
        </el-menu-item>
        <div class="grow" />
        <el-menu-item index="#">
          <el-icon><Briefcase /></el-icon>
          <span>方案</span>
        </el-menu-item>
        <el-menu-item index="#">
          <el-icon><SwitchButton /></el-icon>
          <span>登出</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="flex items-center justify-between bg-white border-b px-6">
        <div>
          <el-input
            placeholder="搜尋計畫、申請者或通知..."
            :prefix-icon="Search"
            class="w-96"
          />
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
      <el-main class="bg-gray-50">
        <slot />
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.el-menu {
  height: calc(100vh - 64px); /* 100vh - header height */
  border-right: none !important;
}
.el-menu-item {
  height: 48px;
}
</style> 