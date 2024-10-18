<script lang="ts" setup>
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';

// 模拟班级数据
const classes = ref([
    { id: 1, name: '高一(1)班', teacher: '张老师', requests: [{ studentName: '学生A', studentId: 101 }, { studentName: '学生B', studentId: 102 }] },
    { id: 2, name: '高二(3)班', teacher: '李老师', requests: [{ studentName: '学生C', studentId: 103 }] },
]);

// 表单和状态
const classForm = ref({ id: null, name: '', teacher: '张老师' });
const dialogVisible = ref(false);
const dialogTitle = ref('创建班级');
const searchQuery = ref('');
const requestDialogVisible = ref(false);
const currentRequests = ref([]);

// 过滤班级
const filteredClasses = computed(() => {
    return classes.value.filter(c => c.name.includes(searchQuery.value));
});

// 打开添加班级对话框
const showAddClassDialog = () => {
    dialogTitle.value = '创建班级';
    classForm.value = { id: null, name: '', teacher: '张老师' }; // 班主任为当前教师
    dialogVisible.value = true;
};

// 编辑班级
const editClass = (classData) => {
    dialogTitle.value = '编辑班级';
    classForm.value = { ...classData };
    dialogVisible.value = true;
};

// 保存班级信息
const saveClass = () => {
    if (classForm.value.id) {
        // 编辑班级
        const index = classes.value.findIndex(c => c.id === classForm.value.id);
        if (index !== -1) {
            classes.value[index] = { ...classForm.value };
            ElMessage.success('班级信息已更新');
        }
    } else {
        // 创建新班级
        const newId = classes.value.length + 1;
        classes.value.push({ id: newId, ...classForm.value, requests: [] });
        ElMessage.success('班级已创建');
    }
    dialogVisible.value = false;
};

// 删除班级
const deleteClass = (classData) => {
    const index = classes.value.findIndex(c => c.id === classData.id);
    if (index !== -1) {
        classes.value.splice(index, 1);
        ElMessage.success('班级已删除');
    }
};

// 查看学生申请
const viewRequests = (classData) => {
    currentRequests.value = classData.requests;
    requestDialogVisible.value = true;
};

// 同意学生申请
const approveRequest = (request) => {
    ElMessage.success(`已同意 ${request.studentName} 的申请`);
};

// 拒绝学生申请
const rejectRequest = (request) => {
    ElMessage.error(`已拒绝 ${request.studentName} 的申请`);
};
</script>

<template>
    <el-container>
        <!-- 班级管理标题 -->
        <el-header height="60px" class="header">
            <h2>班级管理</h2>
        </el-header>

        <!-- 主内容区域 -->
        <el-main class="main-content">
            <!-- 工具栏 -->
            <el-row justify="space-between" class="toolbar">
                <el-col>
                    <el-button type="primary" @click="showAddClassDialog">创建班级</el-button>
                </el-col>
                <el-col>
                    <el-input v-model="searchQuery" placeholder="搜索班级" prefix-icon="el-icon-search"></el-input>
                </el-col>
            </el-row>

            <!-- 班级表格 -->
            <el-table :data="filteredClasses" style="width: 100%" border>
                <el-table-column prop="id" label="班级ID" width="100"></el-table-column>
                <el-table-column prop="name" label="班级名称"></el-table-column>
                <el-table-column prop="teacher" label="班主任"></el-table-column>
                <el-table-column label="学生申请" width="120">
                    <template #default="scope">
                        <el-button @click="viewRequests(scope.row)" type="text" size="small">查看申请</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template #default="scope">
                        <el-button @click="editClass(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="deleteClass(scope.row)" type="text" size="small"
                            class="delete-btn">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>

        <!-- 添加/编辑班级对话框 -->
        <el-dialog :title="dialogTitle" v-model="dialogVisible">
            <el-form :model="classForm" label-width="80px">
                <el-form-item label="班级名称">
                    <el-input v-model="classForm.name"></el-input>
                </el-form-item>
                <el-form-item label="班主任">
                    <el-input v-model="classForm.teacher" :disabled="true"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveClass">保存</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 查看学生申请对话框 -->
        <el-dialog title="学生申请列表" v-model="requestDialogVisible">
            <el-table :data="currentRequests" style="width: 100%">
                <el-table-column prop="studentName" label="学生姓名" width="150"></el-table-column>
                <el-table-column prop="studentId" label="学生ID"></el-table-column>
                <el-table-column label="操作" width="180">
                    <template #default="scope">
                        <el-button @click="approveRequest(scope.row)" type="primary" size="small">同意</el-button>
                        <el-button @click="rejectRequest(scope.row)" type="danger" size="small">拒绝</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </el-container>
</template>

<style scoped>
.header {
    background-color: #409EFF;
    color: white;
    display: flex;
    align-items: center;
    padding: 0 20px;
}

.main-content {
    padding: 20px;
}

.toolbar {
    margin-bottom: 20px;
}

.delete-btn {
    color: red;
}
</style>