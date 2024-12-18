<script lang="ts" setup>
import router from '@/router';
import { useUserInfoStore } from '@/stores/useUserInfoStore';
import { ref } from 'vue';
import useUser from '@/composables/useUser';

// 判断是否显示登录注册按钮
const useUserInfo = useUserInfoStore();
const isLogin = ref<boolean>(false);
if (useUserInfo.token.length != 0) {
    isLogin.value = true;
}

// 退出登录
const { logout } = useUser();

// 点击登录按钮触发
const toLogin = () => {
    router.push({ path: '/login', query: { isLogin: 1 } });
}

// 点击注册按钮触发
const toRegister = () => {
    router.push({ path: '/login', query: { isLogin: 0 } });
}

const goToProfile = () => {
    router.push('/personal')
}


</script>

<template>

    <el-container>
        <el-row class="nav-bar">
            <!-- 左边 Logo -->
            <el-col :span="6">
                <div class="logo">
                </div>
            </el-col>

            <!-- 中间 菜单和搜索 -->
            <el-col :span="12" class="center-content">
                <!-- 菜单栏 -->
                <el-menu mode="vertical" class="main-menu" :default-active="router.currentRoute.value.path"
                    background-color="transparent" active-text-color="#f56c6c" router>
                    <el-menu-item index="/">首页</el-menu-item>
                    <el-menu-item index="/class">班级管理</el-menu-item>
                    <el-menu-item index="/task">作业管理</el-menu-item>
                    <el-menu-item index="/grade">成绩管理</el-menu-item>
                    <el-menu-item index="/personal">个人中心</el-menu-item>
                </el-menu>
            </el-col>

            <!-- 右边 登录/用户信息 -->
            <el-col :span="6" class="nav-right">
                <div v-if="!isLogin" class="auth-buttons">
                    <el-button type="primary" @click="toLogin" link>登录</el-button>
                    <el-button type="success" @click="toRegister" link>注册</el-button>
                </div>

                <div v-else class="user-info">
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            <el-avatar :src="useUserInfo.avatar" />
                            <span>{{ useUserInfo.teachername }}</span>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="goToProfile">个人中心</el-dropdown-item>
                                <el-dropdown-item @click="logout" divided>退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </el-col>
        </el-row>
    </el-container>
</template>

<style scoped>
.nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    /* 设置为纯白色 */
    padding: 10px 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    /* 添加轻微的阴影，以提升层次感 */
}

.logo {
    width: 100%;
    height: 60px;
    background-image: url('@/assets/images/logo.png');
    /* 替换为你的 Logo 图片路径 */
    background-size: contain;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    /* 垂直居中对齐 */
    justify-content: center;
    /* 水平居中对齐 */
}

.center-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
}

.main-menu {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 500;
    color: #333;
    /* 设置深色文字以增强可读性 */
}

.nav-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 30px;
}

.auth-buttons>.el-button {
    margin-left: 10px;
}

.user-info {
    display: flex;
    align-items: center;
}

.user-info .el-avatar {
    margin-right: 10px;
}

.el-menu-item {
    color: #333;
    /* 设置菜单项颜色 */
}

.el-menu-item:hover,
.el-menu-item.is-active {
    background-color: rgba(255, 0, 0, 0.1);
    /* 悬停和选中状态的背景色 */
    color: #f56c6c;
    /* 高亮文字颜色 */
}

.el-dropdown-link {
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #333;
    /* 下拉菜单链接颜色 */
}

.el-dropdown,
.el-dropdown * {
    outline: none;
}

.el-dropdown-menu {
    background-color: #f5f7fa;
    color: #333;
}
</style>