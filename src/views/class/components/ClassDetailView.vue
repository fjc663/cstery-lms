<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import useClass from '@/composables/useClass';
import { useRoute } from 'vue-router';
import useUtils from '@/composables/useUtils';
import { Search } from '@element-plus/icons-vue'


// 通过路由获取班级ID
const route = useRoute();
const classId = Number(route.params.id);

// 获取班级和学生数据
const { clas, getClassById, students, totalStudent, pageQueryStudent, getClassStudentsPage } = useClass();

const page = ref<number>(1); // 当前页
const pageSize = ref<number>(10); // 每页条数

// 每页大小改变时触发
const handleSizeChange = (pageSize: number) => {
    pageQueryStudent.value.pageSize = pageSize;

    getClassStudentsPage(classId);
};

// 页码改变时触发
const handleCurrentChange = (page: number) => {
    pageQueryStudent.value.page = page;

    getClassStudentsPage(classId);
};

// 搜索和过滤条件
const filters = ref({
    name: '',
    gender: -1,
});

// 分页条件查询
const searchStudent = () => {
    pageQueryStudent.value.name = filters.value.name;
    if (filters.value.gender === 0 || filters.value.gender === 1 || filters.value.gender === 2) {
        pageQueryStudent.value.gender = filters.value.gender;
    } else {
        pageQueryStudent.value.gender = null;
    }
    getClassStudentsPage(classId);
}

// 复制到剪贴板的函数
const { copyToClipboard, goBack } = useUtils();

// 初始化页面
onMounted(async () => {
    await getClassById(classId);

    pageQueryStudent.value.page = page.value;
    pageQueryStudent.value.pageSize = pageSize.value;
    await getClassStudentsPage(classId);
});
</script>

<template>
    <div class="class-detail">
        <el-page-header @back="goBack" />

        <div class="class-header">
            <img v-lazy="clas.class_img" alt="班级图片" class="class-img" />
            <div class="separator"></div> <!-- 分隔符 -->
            <div class="class-info">
                <h1>{{ clas.class_name }}</h1>
                <p>班主任：{{ clas.teacher_name }}</p>
                <p>
                    班级邀请码：{{ clas.class_code }}
                    <el-button type="success" link class="copy-button"
                        @click="copyToClipboard(clas.class_code || '')">复制</el-button>
                </p>
                <p>班级描述：{{ clas.desc }}</p>
            </div>
        </div>

        <div class="student-list">
            <h2>班级学生</h2>
            <div class="search-controls">
                <!-- 分类名称输入框 -->
                <el-input v-model="filters.name" placeholder="请输入学生名称" clearable class="search-input">
                    <template #append>
                        <el-button @click="searchStudent" :icon="Search" />
                    </template>
                </el-input>

                <!-- 分类状态选择框 -->
                <el-select v-model="filters.gender" @change="searchStudent" placeholder="性别" clearable
                    class="status-select">
                    <el-option label="全部" :value="-1"></el-option>
                    <el-option label="女" :value="0"></el-option>
                    <el-option label="男" :value="1"></el-option>
                    <el-option label="未知" :value="2"></el-option>
                </el-select>

                <el-table :data="students" style="width: 100%"
                    :header-cell-style="{ 'text-align': 'center', 'background-color': '#f7f8fa', 'font-weight': 'bold' }"
                    :cell-style="{ 'text-align': 'center' }">
                    <el-table-column type="index" label="序号" width="80" />
                    <el-table-column label="头像">
                        <template #default="scope">
                            <el-image :src="scope.row.avatar" fit="cover" class="image-class" />
                        </template>
                    </el-table-column>

                    <el-table-column prop="name" label="姓名">
                        <template #default="scope">
                            {{ scope.row.name == null ? scope.row.username : scope.row.name }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="gender" label="性别">
                        <template #default="scope">
                            {{ scope.row.gender == 0 ? '女' : scope.row.gender == 1 ? '男' : '未知' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="student_number" label="学号"></el-table-column>
                    <el-table-column prop="phone" label="电话"></el-table-column>
                    <el-table-column prop="email" label="邮箱"></el-table-column>
                    <el-table-column prop="desc" label="个人介绍"></el-table-column>
                </el-table>
            </div>

            <!-- 分页 -->
            <div class="class-pagination-block">
                <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper" :total="totalStudent"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>

        </div>
    </div>
</template>

<style scoped>
.class-detail {
    padding: 40px;
    background-color: #f9f9f9;
    border-radius: 10px;
}

.class-header {
    display: flex;
    align-items: flex-start;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
}

/* 控制内部搜索控件的布局 */
.search-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 15px;
    /* 控制元素之间的间距 */
}

/* 设置输入框样式 */
.search-input {
    width: 200px;
    /* 控制输入框宽度 */
}

/* 设置下拉框样式 */
.status-select {
    width: 100px;
    /* 控制下拉框宽度 */
}

.class-img {
    width: 300px;
    /* 设置固定宽度 */
    height: auto;
    /* 自动高度以保持比例 */
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.separator {
    width: 1px;
    /* 分隔符的宽度 */
    background-color: #eaeaea;
    /* 分隔符颜色 */
    margin: 0 20px;
    /* 左右间距 */
    height: 100%;
    /* 分隔符高度 */
}

.class-info {
    flex: 1;
    /* 使班级信息区域占据剩余空间 */
}

.class-header h1 {
    color: #333;
    margin-bottom: 10px;
}

.student-list {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    margin-top: 30px;
}

.image-class {
    border-radius: 8px;
    width: 80px;
    height: 80px;
    object-fit: cover;
}

.student-list h2 {
    color: #333;
    margin-bottom: 20px;
    font-size: 1.8rem;
    font-weight: bold;
    text-align: center;
}

.custom-table {
    border: none;
    margin-bottom: 20px;
}

.student-avatar {
    border-radius: 50%;
    width: 50px;
    height: 50px;
    border: 2px solid #007bff;
    transition: transform 0.3s;
}

.student-avatar:hover {
    transform: scale(1.1);
}

.student-name {
    font-weight: 500;
    color: #007bff;
    margin: 0;
    padding: 10px 0;
}

.name-column,
.gender-column,
.student-number-column,
.phone-column,
.email-column,
.desc-column {
    padding: 15px 10px;
    /* 设置适当的间距 */
    text-align: left;
}

.name-column {
    color: #333;
    font-weight: bold;
}

.gender-column {
    color: #666;
}

.student-number-column,
.phone-column,
.email-column {
    color: #777;
}

.desc-column {
    color: #555;
}

/* 分页组件样式 */
.class-pagination-block {
    margin-top: 10px;
    display: flex;
    justify-content: end;
}
</style>
