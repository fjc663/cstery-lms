<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 轮播图图片
const carouselImages = ref([
    'https://cstery-sky.oss-cn-beijing.aliyuncs.com/student/avatar/8cb6b543-2ca6-419b-92b0-883d818812aa.png',
    'http://127.0.0.1:8080/imgs/default_homework.png',
    'http://127.0.0.1:8080/imgs/default_homework2.png',
    'https://cstery-sky.oss-cn-beijing.aliyuncs.com/student/avatar/8cb6b543-2ca6-419b-92b0-883d818812aa.png',
]);

// 快捷操作导航
const quickAccess = ref([
    { title: '管理班级', desc: '查看和管理您的班级', icon: 'Class', route: '/class' },
    { title: '布置作业', desc: '快速创建新的作业', icon: 'Homework', route: '/task' },
    { title: '查看成绩', desc: '查看学生的成绩和进度', icon: 'Grade', route: '/grade' },
    { title: '个人中心', desc: '查看和完善个人信息', icon: 'Personal', route: '/personal' },
]);

// 数据概览
const overviewData = ref([
    { title: '班级数量', value: '5', desc: '您管理的班级数量' },
    { title: '学生人数', value: '200+', desc: '所有班级的学生总数' },
    { title: '待批改作业', value: '12', desc: '未批改的作业总数' },
    { title: '平台活跃度', value: '87%', desc: '学生的平均作业提交率' },
]);

// 最新通知与动态
const notifications = ref([
    { title: '新的班级公告', content: '请在2024年10月10日之前提交本学期的教学计划。' },
    { title: '即将到期的作业', content: '数学作业将于2024年10月8日截止提交。' },
    { title: '新的提交提醒', content: '3名学生刚刚提交了英语作业。' },
]);

// 导航到指定路由
const navigateTo = (route: string) => {
    router.push(route);
};
</script>

<template>
    <div class="teacher-home">
        <!-- 轮播图 -->
        <el-carousel height="400px" :interval="5000" arrow="always" type="card">
            <el-carousel-item v-for="(img, index) in carouselImages" :key="index">
                <img :src="img" class="carousel-image" alt="轮播图" />
            </el-carousel-item>
        </el-carousel>

        <!-- 快捷导航卡片 -->
        <div class="quick-access">
            <h2>快捷操作</h2>
            <el-row :gutter="20">
                <el-col :span="6" v-for="(item, index) in quickAccess" :key="index">
                    <el-card shadow="hover" class="quick-access-card" @click="navigateTo(item.route)">
                        <el-icon :size="40">{{ item.icon }}</el-icon>
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.desc }}</p>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <!-- 数据概览 -->
        <div class="data-overview">
            <h2>数据概览</h2>
            <el-row :gutter="20">
                <el-col :span="6" v-for="(data, index) in overviewData" :key="index">
                    <el-card shadow="hover" class="overview-card">
                        <h3>{{ data.title }}</h3>
                        <p>{{ data.value }}</p>
                        <p class="overview-desc">{{ data.desc }}</p>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <!-- 最新通知与动态 -->
        <div class="latest-notifications">
            <h2>最新通知与动态</h2>
            <el-card v-for="(notification, index) in notifications" :key="index" class="notification-card"
                shadow="hover">
                <h3>{{ notification.title }}</h3>
                <p>{{ notification.content }}</p>
            </el-card>
        </div>
    </div>
</template>

<style scoped>
.teacher-home {
    padding: 20px;
    background-color: #f5f7fa;
}

.carousel-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 8px;
}

.quick-access,
.data-overview,
.latest-notifications {
    margin-top: 40px;
}

.quick-access-card,
.overview-card,
.notification-card {
    margin: 10px 0;
    padding: 20px;
    text-align: center;
    transition: transform 0.2s ease;
}

.quick-access-card {
    cursor: pointer;
}

.quick-access-card:hover,
.overview-card:hover,
.notification-card:hover {
    transform: translateY(-5px);
}

.quick-access-card h3,
.overview-card h3 {
    margin-top: 10px;
    font-size: 1.2em;
}

.overview-card p {
    font-size: 2em;
    color: #409EFF;
    margin: 10px 0;
}

.overview-desc,
.notification-card p {
    color: #666;
}

.notification-card h3 {
    font-weight: bold;
    font-size: 1.1em;
}
</style>
