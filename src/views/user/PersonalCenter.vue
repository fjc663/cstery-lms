<script lang="ts" setup>
import router from '@/router';

</script>

<template>
    <el-container class="personal-center">
        <!-- 左侧：侧边栏导航 -->
        <el-aside width="240px" class="sidebar">
            <el-menu :default-active="router.currentRoute.value.path" class="menu" router>
                <el-menu-item index="/personal">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-yonghu"></use>
                    </svg>
                    <span>个人信息</span>
                </el-menu-item>         
                <el-menu-item index="/personal/editPassword">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-xiugaimima"></use>
                    </svg>
                    <span>修改密码</span>
                </el-menu-item>
            </el-menu>
        </el-aside>

        <!-- 右侧：个人信息和功能操作 -->
        <el-main class="main-content">
            <RouterView />
        </el-main>
    </el-container>
</template>

<style scoped>
.personal-center {
    min-height: 100vh;
    display: flex;
    background-color: #f5f5f5;
    padding: 30px;
}

.sidebar {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.menu {
    padding-top: 20px;
}

.main-content {
    flex: 1;
    padding: 0 30px;
}
</style>