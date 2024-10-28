<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const goHome = () => {
    router.push('/');
};
</script>

<template>
    <div class="not-found-page">
        <img src="../assets/svg/404.svg" alt="404 Not Found" class="not-found-image" />
        <h1>Oops! 404</h1>
        <p>我们找不到你要访问的页面。</p>
        <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
</template>


<style scoped>
.not-found-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
}

.not-found-image {
    width: 300px;
    margin-bottom: 20px;
}

h1 {
    font-size: 60px;
    color: #f56c6c;
}

p {
    font-size: 20px;
    color: #606266;
    margin-bottom: 30px;
}

.el-button {
    font-size: 18px;
    padding: 10px 20px;
}
</style>