<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import useUtils from '@/composables/useUtils';
import useReport from '@/composables/useReport';
import { useRoute } from 'vue-router';

const completionChart = ref(null);
const scoreDistributionChart = ref(null);
const averageScoreChart = ref(null);

// 工具函数
const { goBack } = useUtils();

// 成绩报告处理逻辑
const { taskReport, getTaskReport } = useReport();

// 从路由获得作业ID
const route = useRoute();
const taskId = Number(route.params.id);

onMounted(async () => {
    await getTaskReport(taskId);

    // 完成情况环形图
    const completionChartInstance = echarts.init(completionChart.value);
    completionChartInstance.setOption({
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [
            {
                name: '完成情况',
                type: 'pie',
                radius: ['40%', '60%'],
                avoidLabelOverlap: false,
                itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
                label: { show: true, position: 'outside', formatter: '{b}: {d}%' },
                data: [
                    { value: taskReport.value.completed_count, name: '已完成', itemStyle: { color: '#67C23A' } },
                    { value: taskReport.value.not_completed_count, name: '未完成', itemStyle: { color: '#F56C6C' } },
                ],
            },
        ],
    });

    // 得分分布圆角柱状图
    const scoreDistributionChartInstance = echarts.init(scoreDistributionChart.value);
    scoreDistributionChartInstance.setOption({
        xAxis: { type: 'category', data: ['0-59', '60-69', '70-79', '80-89', '90-100'] },
        yAxis: { type: 'value' },
        series: [
            {
                data: taskReport.value.score_list,
                type: 'bar',
                barWidth: '60%',
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#67C23A' },
                        { offset: 1, color: '#409EFF' },
                    ]),
                    borderRadius: [5, 5, 0, 0],
                },
            },
        ],
    });

    // 平均分与及格率仪表盘
    const averageScoreChartInstance = echarts.init(averageScoreChart.value);
    averageScoreChartInstance.setOption({
        tooltip: { formatter: '{a} <br/>{b} : {c}' },
        series: [
            {
                name: '及格率',
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                radius: '70%', // 半径
                center: ['30%', '50%'], // 左侧位置
                axisLine: {
                    lineStyle: {
                        width: 15,
                        color: [
                            [0.6, '#F56C6C'],
                            [0.8, '#E6A23C'],
                            [1, '#67C23A'],
                        ],
                    },
                },
                pointer: { width: 8 },
                detail: {
                    fontSize: 18,
                    formatter: '{value}%',
                    color: '#333',
                },
                data: [{ value: (taskReport.value.pass_rate * 100).toFixed(2), name: '及格率' }],
            },
            {
                name: '平均分',
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                radius: '70%', // 半径
                center: ['70%', '50%'], // 右侧位置
                axisLine: {
                    lineStyle: {
                        width: 15,
                        color: [
                            [0.5, '#FF8C00'],
                            [0.75, '#FFD700'],
                            [1, '#32CD32'],
                        ],
                    },
                },
                pointer: { width: 6 },
                detail: {
                    fontSize: 18,
                    formatter: '{value}分',
                    color: '#333',
                },
                data: [{ value: (taskReport.value.average_score).toFixed(2), name: '平均分' }],
            },
        ],
    });

});
</script>

<template>
    <div class="assignment-detail">
        <el-page-header @back="goBack" />

        <h1>作业成绩分析</h1>
        <h3>{{ taskReport.title }}</h3>

        <!-- 完成情况环形图 -->
        <div class="chart-container">
            <h2>作业完成情况</h2>
            <div ref="completionChart" class="chart"></div>
        </div>

        <!-- 得分分布圆角柱状图 -->
        <div class="chart-container">
            <h2>得分分布</h2>
            <div ref="scoreDistributionChart" class="chart"></div>
        </div>

        <!-- 平均分与及格率仪表盘 -->
        <div class="chart-container">
            <h2>班级平均分与及格率</h2>
            <div ref="averageScoreChart" class="chart"></div>
        </div>
    </div>
</template>

<style scoped>
.assignment-detail {
    padding: 20px;
    background-color: #f5f7fa;
    min-height: 100vh;
}

h1 {
    font-size: 1.8em;
    text-align: center;
    margin-bottom: 20px;
    color: #333;
}

.chart-container {
    margin-top: 30px;
    padding: 20px;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
}

.chart-container h2 {
    font-size: 1.2em;
    color: #666;
    text-align: center;
    margin-bottom: 15px;
}

.chart {
    width: 100%;
    height: 300px;
}
</style>
