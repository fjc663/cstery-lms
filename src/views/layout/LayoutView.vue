<script lang="ts" setup>
import HeaderView from '@/views/layout/components/HeaderView.vue'

</script>

<template>
  <div class="ecommerce-homepage">
    <el-container>

      <!-- 顶部导航栏 -->
      <el-header class="nav-container">
        <HeaderView />
      </el-header>

      <el-main class="main-container">
        <RouterView />
      </el-main>

      <!-- 页脚 -->
      <el-footer height="60px" class="footer">
        <span>© 2024 CsteryLms. 保留所有权利。</span>
      </el-footer>

    </el-container>
  </div>
</template>

<style scoped>
/* 导航容器整体样式 */
.nav-container {
  background-color: #1f2d3d;
  padding: 0 20px;
  color: #fff;
  height: 80px;
}

/* 主体样式 */
.main-container {
  min-height: 100vh;
}

/* Footer整体布局和样式 */
.footer {
  text-align: center;
  background-color: #6c6e70;
  color: white;
  padding-top: 20px;
}
</style>