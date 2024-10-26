<script lang="ts" setup>
import type { result } from '@/composables/interfaceType/commonInterface';
import type { itask } from '@/composables/interfaceType/taskInterface';
import useDelete from '@/composables/useDelete';
import useTask from '@/composables/useTask';
import useUpload from '@/composables/useUpload';
import useUtils from '@/composables/useUtils';
import { ElMessage, type UploadProps, type UploadUserFile } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const router = useRouter();

// 工具方法
const { formatDate, goBack, formattedDateTime, beforeTaskUpload, handleExceed, disabledDate, shortcuts } = useUtils();

// 作业相关处理逻辑
const { task, getTaskById, studentCompletionStatus, getStudentCompletionStatus, editTask } = useTask();

// 上传逻辑
const { uploadTask } = useUpload();
// 删除逻辑
const { deleteTask } = useDelete();

// 从路由获得作业ID
const route = useRoute();
const taskId = Number(route.params.id);


// 修改作业信息弹窗控制
const editAssignmentDrawerVisible = ref<boolean>(false);
const editAssignmentForm = ref<itask>({
    title: '',
    desc: '',
    due_date: new Date('2024-02-13'),
    allow_late_submission: true,
    submission_format: '',
    images: JSON.parse('[]'),
});

// 预览URL和弹窗显示
const dialogImageUrl = ref<string>('');
const dialogVisible = ref<boolean>(false);

// 作业图片URL列表
const fileList = ref<UploadUserFile[]>([]);

// 作业删除列表
const filenames = ref<string[]>([]);

// 打开修改作业信息弹窗
const openEditAssignmentDialog = () => {
    editAssignmentForm.value = { ...task.value };
    editAssignmentDrawerVisible.value = true;
};

// 上传作业图片
const onUploadTask = async (task: any) => {
    // 设置表单数据
    const formData = new FormData();
    formData.append('task_image_file', task.file);

    // 上传
    const res: result = await uploadTask(formData);

    if (res.code === 1) {

        // 查找在 fileList 中对应的文件索引
        const fileIndex = fileList.value.findIndex(item => item.uid === task.file.uid);

        if (fileIndex !== -1) {
            // 更新对应文件的信息
            fileList.value[fileIndex] = {
                ...fileList.value[fileIndex],
                name: res.data.split('/').pop(), // 更新文件名
                url: res.data, // 上传成功后的图片 URL
                status: 'success' // 更新状态
            };
        }
    }
};

// 移除图片
const handleRemove: UploadProps['onRemove'] = (file: any, files: any[]) => {
    filenames.value.push(file.name);
    fileList.value = files;
    ElMessage.success('移除成功');
};

// 预览图片
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!;
    dialogVisible.value = true;
}

// 更新作业信息
const editAssignment = async () => {
    // 校验标题
    if (editAssignmentForm.value.title.length < 1 || editAssignmentForm.value.title.length > 100) {
        ElMessage.error("请输入1到200字符长度的标题");
        return;
    }

    // 转化作业图片列表为JSON
    editAssignmentForm.value.images = JSON.parse(JSON.stringify(fileList.value.map(v => v.url)));

    const code: number = await editTask(editAssignmentForm.value);

    if (code === 1) {
        // 关闭对话框
        editAssignmentDrawerVisible.value = false;

        // 删除上传但移除的图片
        deleteTask(filenames.value)

        // 提交后刷新页面
        getTaskById(taskId);
        getStudentCompletionStatus(taskId);
    }
};

// 跳转到打分页面
const goToGradePage = (studentId: number) => {
    router.push({path: `/task/answer/${studentId}`, query: {taskId: taskId}})
};

// 页面数据初始化
onMounted(async () => {
    await getTaskById(taskId);
    await getStudentCompletionStatus(taskId);

    // 如果有提交图片，展示回显作业图片
    if (Array.isArray(task.value.images)) {
        fileList.value = task.value.images.map((url: string) => ({
            name: url.split('/').pop() || '',
            url: url,
        }));
    }
})

</script>

<template>
    <div class="assignment-completion">
        <el-page-header @back="goBack" />

        <h1>作业完成情况</h1>

        <!-- 作业信息展示 -->
        <el-card class="assignment-info">
            <h2>{{ task.title }}</h2>
            <p><strong>描述：</strong>{{ task.desc }}</p>
            <p><strong>截止日期：</strong>{{ task.due_date ? formatDate(task.due_date) : '无' }}</p>
            <p><strong>允许超时提交：</strong>{{ task.allow_late_submission ? '是' : '否' }}</p>

            <!-- 展示多张作业图片 -->
            <div v-if="task.images && Array.isArray(task.images)" class="image-gallery">
                <el-image v-for="(image, index) in task.images" :key="index" :src="image" alt="作业图片" fit="cover"
                    :zoom-rate="1.2" :preview-src-list="task.images" :initial-index="index" class="task-image" />
            </div>

            <!-- 修改作业信息按钮 -->
            <div class="edit-btn">
                <el-button type="primary" @click="openEditAssignmentDialog">修改</el-button>
            </div>

        </el-card>

        <!-- 学生提交情况展示 -->
        <div class="submission-status">
            <el-row :gutter="20">
                <!-- 已提交的学生 -->
                <el-col :span="12">
                    <el-card class="submitted-students">
                        <h3>已提交的学生</h3>
                        <el-table :data="studentCompletionStatus.submitted" border
                            :header-cell-style="{ 'text-align': 'center', 'background-color': '#f7f8fa', 'font-weight': 'bold' }"
                            :cell-style="{ 'text-align': 'center' }">
                            <el-table-column type="index" width="80" label="序号">
                                <template #default="scope">{{ scope.$index + 1 }}</template>
                            </el-table-column>
                            <el-table-column prop="name" label="姓名"></el-table-column>
                            <el-table-column prop="student_number" label="学号"></el-table-column>
                            <el-table-column prop="submitted_at" label="提交时间">
                                <template #default="scope">
                                    {{ formattedDateTime(scope.row.submitted_at) }}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template #default="scope">
                                    <!-- 跳转打分按钮 -->
                                    <el-button type="success" link @click="goToGradePage(scope.row.id)">作答详情</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-col>

                <!-- 未提交的学生 -->
                <el-col :span="12">
                    <el-card class="unsubmitted-students">
                        <h3 style="color: red;">未提交的学生</h3>
                        <el-table :data="studentCompletionStatus.not_submitted" border
                            :header-cell-style="{ 'text-align': 'center', 'background-color': '#f7f8fa', 'font-weight': 'bold' }"
                            :cell-style="{ 'text-align': 'center' }">
                            <el-table-column type="index" width="80" label="序号">
                                <template #default="scope">{{ scope.$index + 1 }}</template>
                            </el-table-column>
                            <el-table-column prop="name" label="姓名"></el-table-column>
                            <el-table-column prop="student_number" label="学号"></el-table-column>
                        </el-table>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <!-- 修改作业信息抽屉 -->
        <el-drawer title="修改作业" v-model="editAssignmentDrawerVisible" direction="rtl" size="40%"
            custom-class="create-assignment-drawer" :with-header="true">
            <el-form :model="editAssignmentForm" label-width="100px">
                <el-form-item label="标题">
                    <el-input v-model="editAssignmentForm.title" placeholder="请输入作业标题"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="editAssignmentForm.desc" placeholder="请输入作业描述"></el-input>
                </el-form-item>
                <el-form-item label="截止日期">
                    <el-date-picker v-model="editAssignmentForm.due_date" type="date" :disabled-date="disabledDate"
                        :shortcuts="shortcuts" placeholder="选择截止日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="允许超时提交">
                    <el-switch v-model="editAssignmentForm.allow_late_submission"></el-switch>
                </el-form-item>
                <el-form-item label="提交格式">
                    <el-select v-model="editAssignmentForm.submission_format" placeholder="请选择提交格式">
                        <el-option label="图片" value="img"></el-option>
                        <el-option label="文本" value="text"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="上传图片">

                    <el-upload class="upload-demo" drag multiple :limit="10" v-model:file-list="fileList"
                        :on-exceed="handleExceed" list-type="picture-card" :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove" :http-request="onUploadTask" :before-upload="beforeTaskUpload">
                        <div class="el-upload__text">拖动图片到此处，或 <em>点击上传</em></div>
                        <template v-slot:tip>
                            <div class="el-upload__tip">最多上传10张小于10MB，格式为JPG/PNG的图片。</div>
                        </template>
                    </el-upload>

                    <el-dialog v-model="dialogVisible">
                        <div class="image-container">
                            <img class="preview-image" :src="dialogImageUrl" alt="Preview Image" />
                        </div>
                    </el-dialog>
                </el-form-item>

                <div class="drawer-footer">
                    <el-button @click="editAssignmentDrawerVisible = false">取消</el-button>
                    <el-button type="primary" @click="editAssignment">修改</el-button>
                </div>

            </el-form>

        </el-drawer>
    </div>
</template>

<style scoped>
.assignment-completion {
    padding: 20px;
    min-height: 100vh;
    background-color: #f7f9fc;
    /* 设置页面背景色，区分内容区域 */
}

.assignment-info {
    margin-bottom: 20px;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
    /* 较强阴影，使卡片更具视觉层次 */
}

.assignment-info h2 {
    font-size: 1.8em;
    color: #333;
    margin-bottom: 10px;
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

.task-image:hover {
    transform: scale(1.05);
    /* 鼠标悬停放大效果 */
}

.edit-btn {
    margin: 20px;
    display: flex;
    justify-content: flex-end;
}

.submission-status {
    margin-top: 20px;
}

.submitted-students,
.unsubmitted-students {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.submission-status h3 {
    font-size: 1.4em;
    font-weight: bold;
    color: #409EFF;
    /* 标题颜色与主题一致 */
    margin-bottom: 15px;
}

.el-upload__text em {
    color: #409EFF;
}

.image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 100%;
    /* 保持容器的宽度限制 */
    padding: 10px;
    /* 增加内边距 */
}

.preview-image {
    max-width: 100%;
    /* 图片宽度最大为容器的宽度 */
    max-height: 80vh;
    /* 高度最大为视窗的 80%，确保不会超出可视区域 */
    object-fit: contain;
    /* 确保图片不会被拉伸或裁剪 */
    border-radius: 8px;
    /* 图片预览增加圆角 */
}

.drawer-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
}

.el-dialog__header {
    background-color: #409EFF;
    /* 对话框头部背景色 */
    color: white;
}

.el-button {
    transition: all 0.3s ease;
}

.el-button:hover {
    transform: translateY(-2px);
    /* 鼠标悬停时的浮动效果 */
}

.el-table {
    width: 100%;
    background-color: #f9fafa;
    border-radius: 8px;
}

.el-table th {
    background-color: #eef2f8;
    font-weight: bold;
    text-align: center;
    color: #5a5e66;
}

.el-table td {
    text-align: center;
    padding: 12px 8px;
    /* 增加表格行间距 */
}

.el-table .el-table__row:hover {
    background-color: #f2f7fc;
    /* 悬停高亮表格行 */
}
</style>
