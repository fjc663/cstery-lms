<script lang="ts" setup>
import useReport from '@/composables/useReport';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';
import useClass from '@/composables/useClass';
import useUtils from '@/composables/useUtils';


const router = useRouter();

// 成绩报告处理逻辑
const { pageQueryTask, getAllTask, totaltask, taskScores } = useReport();

// 班级信息处理逻辑
const { classes, getClass } = useClass();

// 工具方法
const { isDueDateLaterThanNow } = useUtils();

const page = ref<number>(1); // 当前页
const pageSize = ref<number>(10); // 每页条数

// 每页大小改变时触发
const handleSizeChange = (pageSize: number) => {
    pageQueryTask.value.pageSize = pageSize;

    getAllTask();
};

// 页码改变时触发
const handleCurrentChange = (page: number) => {
    pageQueryTask.value.page = page;

    getAllTask();
};

// 搜索和过滤条件
const filters = ref({
    task_title: '',
    class_name: '',
    is_cut_off: null
});

// 分页条件查询
const searchTask = () => {
    pageQueryTask.value.task_title = filters.value.task_title;
    pageQueryTask.value.class_name = filters.value.class_name;
    pageQueryTask.value.is_cut_off = filters.value.is_cut_off;

    getAllTask();
}

// 查看详情跳转方法
const viewDetails = (taskId: number) => {
    router.push({ path: `/grade/${taskId}` });
};

// 初始化页面数据
onMounted(() => {
    pageQueryTask.value.page = page.value;
    pageQueryTask.value.pageSize = pageSize.value;
    getAllTask();

    getClass();
})
</script>

<template>
    <div class="grades-management">
        <h1>成绩管理</h1>

        <div class="search-controls">
            
            <!-- 班级名称选择框-->
            <el-select v-model="filters.class_name" @change="searchTask" placeholder="选择班级名称" clearable
                class="status-select">
                <el-option v-for="clas in classes" :key="clas.id" :label="clas.class_name"
                    :value="clas.class_name"></el-option>
            </el-select>

            <!-- 性别选择框 -->
            <el-select v-model="filters.is_cut_off" @change="searchTask" placeholder="是否截止" clearable
                class="status-select">
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
            </el-select>

            <!-- 作业标题输入框 -->
            <el-input v-model="filters.task_title" placeholder="请输入作业标题" clearable class="search-input">
                <template #append>
                    <el-button @click="searchTask" :icon="Search" />
                </template>
            </el-input>
        </div>

        <!-- 数据表格展示所有班级的作业信息 -->
        <el-table :data="taskScores" border stripe style="width: 100%"
            :header-cell-style="{ 'text-align': 'center', 'background-color': '#f7f8fa', 'font-weight': 'bold' }"
            :cell-style="{ 'text-align': 'center' }">
            <!-- 序号 -->
            <el-table-column type="index" width="60" label="序号"></el-table-column>

            <!-- 作业标题 -->
            <el-table-column prop="title" label="作业标题"></el-table-column>

            <!-- 所属班级 -->
            <el-table-column prop="class_name" label="所属班级"></el-table-column>

            <!-- 是否截止 -->
            <el-table-column prop="is_cut_off" label="是否截止" width="100">
                <template #default="scope">
                    <el-tag :type="isDueDateLaterThanNow(scope.row.due_date) ? 'success' : 'danger'">
                        {{ isDueDateLaterThanNow(scope.row.due_date) ? '未截止' : '已截止' }}
                    </el-tag>
                </template>
            </el-table-column>

            <!-- 完成人数 -->
            <el-table-column prop="completed_count" label="完成人数" width="100"></el-table-column>

            <!-- 未完成人数 -->
            <el-table-column prop="not_completed_count" label="未完成人数" width="120"></el-table-column>

            <!-- 完成率 -->
            <el-table-column prop="completion_rate" label="完成率" width="120">
                <template #default="scope">
                    <el-tooltip placement="top" effect="light" popper-class="custom-tooltip">
                        <template #content>
                            <div>{{ (scope.row.completion_rate * 100).toFixed(2) }} %</div>
                        </template>
                        <el-progress :percentage="scope.row.completion_rate * 100"
                            :status="scope.row.completion_rate * 100 < 50 ? 'exception' : 'success'"
                            width="100%"></el-progress>
                    </el-tooltip>
                </template>
            </el-table-column>

            <!-- 平均分数 -->
            <el-table-column prop="average_score" label="平均分数" width="120">
                <template #default="scope">
                    {{ scope.row.average_score.toFixed(2) }}
                </template>
            </el-table-column>

            <!-- 操作 -->
            <el-table-column label="操作" width="150">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="viewDetails(scope.row.id)" link>查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="class-pagination-block">
            <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper" :total="totaltask" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<style scoped>
.grades-management {
    padding: 20px;
    background-color: #f9fafc;
    min-height: 100vh;
    font-family: Arial, sans-serif;
}

/* 标题样式 */
h1 {
    font-size: 1.8em;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
    text-align: center;
}

/* 搜索控件的容器样式 */
.search-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    justify-content: flex-end;
}

/* 输入框和选择框样式 */
.search-input,
.status-select {
    width: 220px;
}

.search-input {
    display: flex;
    border-radius: 6px;
    transition: box-shadow 0.3s ease;
}

.search-input:hover {
    box-shadow: 0 0 8px rgba(64, 158, 255, 0.2);
}

.status-select {
    width: 180px;
    border-radius: 6px;
}

/* 表格样式 */
.el-table {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    overflow: hidden;
    margin-top: 20px;
}

.el-table-column--index {
    color: #666;
}

/* 完成率进度条样式 */
.custom-tooltip {
    font-size: 0.9em;
    color: #666;
    background-color: #fff;
    border: 1px solid #ebeef5;
    padding: 8px;
    border-radius: 5px;
}

/* 分页组件样式 */
.class-pagination-block {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}

/* 分页按钮自定义样式 */
.el-pagination__jump,
.el-pagination__total {
    color: #409eff;
    font-weight: 500;
}
</style>
