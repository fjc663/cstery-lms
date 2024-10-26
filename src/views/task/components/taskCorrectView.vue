<script lang="ts" setup>
import type { icorrect } from '@/composables/interfaceType/taskInterface';
import useTask from '@/composables/useTask';
import useUtils from '@/composables/useUtils';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';


// 工具方法
const { formattedDateTime, goBack } = useUtils();

// 作业相关处理逻辑
const { answer, getAnswer, correctAnswer } = useTask();

// 从路由获得学生ID和作业ID
const route = useRoute();
const studentId: number = Number(route.params.studentId);
const taskId: number = Number(route.query.taskId);

// 分数和反馈
const correct = ref<icorrect>({
    student_id: studentId,
    task_id: taskId,
    score: null,
    feedback: ''
})


// 提交评分
const submitScore = () => {
    if (correct.value.score === null) {
        ElMessage.error('请为作业评分');
        return
    }

    correctAnswer(correct.value);
};

// 初始化页面数据
onMounted(() => {getAnswer(studentId, taskId)})
</script>

<template>
    <div class="student-answer-page">
        <el-page-header @back="goBack" content="学生作答详情" />

        <!-- 学生信息与作业详情 -->
        <el-card class="student-info-card">
            <h2>{{ answer.student_name }} - {{ answer.student_number }}</h2>
            <p><strong>作业分数：</strong>{{ answer.score ? answer.score : '无' }}</p>
            <p><strong>教师评价：</strong>{{ (answer.feedback && answer.feedback.length > 0) ? answer.feedback : '无' }}</p>
            <p><strong>提交时间：</strong>{{ answer.created_at ? formattedDateTime(answer.created_at) : '无' }}</p>
            <p><strong>作业标题：</strong>{{ answer.title }}</p>
            <div v-if="answer.desc" class="answer-content">{{ answer.desc }}</div>

            <!-- 展示已提交的作业图片 -->
            <div v-if="answer.images && Array.isArray(answer.images)" class="image-gallery">
                <el-image v-for="(image, index) in answer.images" :key="index" :src="image" alt="作业图片" fit="cover"
                    :zoom-rate="1.2" :preview-src-list="answer.images" :initial-index="index" class="task-image" />
            </div>
        </el-card>

        <!-- 评分区域 -->
        <el-card class="grading-section">
            <h3>为作业打分</h3>

            <!-- 滑块和输入框结合使用，百分制评分 -->
            <div class="score-input">
                <el-slider v-model="correct.score" :min="0" :max="100" :step="1" show-tooltip style="flex: 1;"></el-slider>
            </div>
            <el-input-number v-model="correct.score" :min="0" :max="100" :step="1" class="input-number"></el-input-number>
            <p>分数: {{ correct.score }}</p>

            <el-input type="textarea" v-model="correct.feedback" placeholder="输入反馈" rows="4" class="feedback-input"></el-input>
            <el-button type="primary" @click="submitScore">提交成绩</el-button>
        </el-card>

    </div>
</template>

<style scoped>
.student-answer-page {
    padding: 20px;
}

.student-info-card {
    margin-bottom: 20px;
    padding: 20px;
    background-color: #f5f7fa;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.answer-content {
    margin-top: 10px;
    padding: 10px;
    background-color: #ffffff;
    border-radius: 5px;
    border: 1px solid #e0e6ed;
}

.image-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    /* 增加图片之间的间距 */
    margin-top: 15px;
}

.task-image {
    width: 100%;
    /* 确保图片适应容器宽度 */
    max-width: 200px;
    height: auto;
    border-radius: 8px;
    /* 增加圆角 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    /* 增加阴影效果 */
    cursor: pointer;
    transition: transform 0.2s ease;
}

.grading-section {
    margin-top: 20px;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.score-input {
    display: flex;
    align-items: center;
    gap: 10px;
}

.input-number {
    width: 120px;
}

.feedback-input {
    margin-top: 10px;
}
</style>
