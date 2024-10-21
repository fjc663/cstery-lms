<script lang="ts" setup>
import router from '@/router';
import { useUserInfoStore } from '@/stores/useUserInfoStore';
import { ref } from 'vue';
import useUser from '@/composables/userUser';

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
    router.push('/userInfo')
}


</script>

<template>

    <el-container>
        <el-row class="nav-bar">
            <!-- 左边 Logo -->
            <el-col :span="4">
                <div class="logo">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-yuanzi"></use>
                    </svg>
                    CsteryLms-教师端
                </div>
            </el-col>

            <!-- 中间 菜单和搜索 -->
            <el-col :span="12" class="center-content">
                <!-- 菜单栏 -->
                <el-menu mode="vertical" class="main-menu" :default-active="router.currentRoute.value.path"
                    background-color="transparent" active-text-color="#f56c6c" router>
                    <el-menu-item index="/">首页</el-menu-item>
                    <el-menu-item index="/class">班级管理</el-menu-item>
                    <el-menu-item index="/homework">作业管理</el-menu-item>
                    <el-menu-item index="/score">成绩管理</el-menu-item>
                    <el-menu-item index="/talk">讨论区</el-menu-item>
                    <el-menu-item index="/resource">资源共享</el-menu-item>
                </el-menu>
            </el-col>

            <!-- 右边 登录/用户信息 -->
            <el-col :span="4" class="nav-right">
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
    /* 固定顶栏在页面顶部 */
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    /* 确保顶栏在最前面 */
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #333;
    /* 适当设置背景颜色 */
    padding: 10px 20px;
}

.logo {
    font-size: 26px;
    font-weight: bold;
    color: #ce23ce;
}

.center-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    /* 菜单和搜索框之间的间距 */
}

.main-menu {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 500;
}

.nav-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
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
    color: #fff;
}

.el-menu-item:hover,
.el-menu-item.is-active {
    background-color: transparent;
    border-bottom: 2px solid #f56c6c;
    /* 高亮选中的菜单项 */
    color: #f56c6c;
    /* 高亮文字颜色 */
}

.el-dropdown-link {
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #fff;
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