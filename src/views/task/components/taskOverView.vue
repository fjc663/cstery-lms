<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import useClass from '@/composables/useClass';
import useUtils from '@/composables/useUtils';
import type { iclass } from '@/composables/interfaceType/classInterface';
import type { itask } from '@/composables/interfaceType/taskInterface';
import useTask from '@/composables/useTask';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { UploadProps, UploadUserFile } from 'element-plus'
import type { result } from '@/composables/interfaceType/commonInterface';
import useUpload from '@/composables/useUpload';
import useDelete from '@/composables/useDelete';
import { useRouter } from 'vue-router';


const router = useRouter();

// 班级相关处理逻辑
const { classes, getClass } = useClass();

// 作业相关处理逻辑
const { createTask, deleteTask } = useTask();

// 工具方法
const { formattedDateTime, copyToClipboard, beforeUpload, handleExceed, disabledDate, shortcuts } = useUtils();

// 上传逻辑
const { uploadTask } = useUpload();
// 删除逻辑
const { deleteImg } = useDelete();

// 创建新作业弹窗控制
const createAssignmentDrawerVisible = ref<boolean>(false);
const newAssignment = ref<itask>({
    title: '',
    desc: '',
    due_date: null,
    allow_late_submission: false,
    submission_format: 'text',
    clas_id: 0, // 所属班级 ID
    images: JSON.parse('[]'),
});

// 打开创建作业弹窗
const openCreateAssignmentDialog = (classItem: iclass) => {
    newAssignment.value.clas_id = classItem.id || 0; // 记录当前班级ID
    createAssignmentDrawerVisible.value = true;
};

// 作业图片URL列表
const fileList = ref<UploadUserFile[]>([]);

// 作业删除列表
const filenames = ref<string[]>([]);

// 预览URL和弹窗显示
const dialogImageUrl = ref<string>('');
const dialogVisible = ref<boolean>(false);

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

// 创建作业
const createAssignment = async () => {
    // 校验标题
    if (newAssignment.value.title.length < 1 || newAssignment.value.title.length > 100) {
        ElMessage.error("请输入1到200字符长度的标题");
        return;
    }

    // 转化作业图片列表为JSON
    newAssignment.value.images = JSON.parse(JSON.stringify(fileList.value.map(v => v.url)));

    const code: number = await createTask(newAssignment.value);

    if (code === 1) {
        // 关闭对话框
        createAssignmentDrawerVisible.value = false;

        // 清空表单
        newAssignment.value = {
            title: '',
            desc: '',
            due_date: null,
            allow_late_submission: false,
            submission_format: 'text',
            clas_id: 0, // 所属班级 ID
            images: JSON.parse('[]'),
        }

        // 删除上传但移除的图片
        deleteImg(filenames.value)

        // 提交后刷新页面
        getClass();
    }
};

// 查看完成情况
const viewCompletion = (assignmentId: number) => {
    router.push(`/task/${assignmentId}`)
};

// 删除作业
const onDeleteTask = async (taskId: number) => {
    ElMessageBox.confirm('此操作将永久删除该作业, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        await deleteTask(taskId);
        getClass();
    }).catch(() => {
        ElMessage({ type: 'info', message: '已取消删除' });
    });
};

// 初始化页面数据
onMounted(() => getClass())
</script>

<template>
    <div class="assignment-management">
        <h1>作业管理</h1>
        <el-row :gutter="20">
            <el-col :span="8" v-for="classItem in classes" :key="classItem.id">
                <el-card class="class-card" shadow="always">
                    <h2>
                        <el-tooltip placement="top" effect="light" v-if="classItem.class_name.length > 30"
                            popper-class="custom-tooltip">
                            <template #content>
                                <div>{{ classItem.class_name }}</div>
                            </template>
                            {{ classItem.class_name.slice(0, 30) + '...' }}
                        </el-tooltip>
                        <span v-else>{{ classItem.class_name }}</span>
                    </h2>
                    <p>
                        班级代码: {{ classItem.class_code }}
                        <el-button type="success" link class="copy-button"
                            @click="copyToClipboard(classItem.class_code || '')">复制</el-button>
                    </p>
                    <el-divider></el-divider>

                    <!-- 已布置的作业列表，添加滚动条 -->
                    <div class="assignment-list">
                        <h3>已布置作业</h3>
                        <el-scrollbar max-height="300px"> <!-- 设置最大高度和滚动 -->
                            <el-timeline>
                                <el-timeline-item v-for="task in classItem.tasks" :key="task.id"
                                    :timestamp="formattedDateTime(task.created_at || new Date())">
                                    <div class="assignment-item">
                                        <span>{{ task.title }}</span>
                                        <div style="margin-right: 30px;">
                                            <el-button type="primary" link
                                                @click="viewCompletion(task.id || 0)">完成情况</el-button>
                                            <el-button type="danger" link
                                                @click="onDeleteTask(task.id || 0)">删除</el-button>
                                        </div>

                                    </div>
                                </el-timeline-item>
                            </el-timeline>
                        </el-scrollbar>
                    </div>

                    <!-- 创建作业按钮 -->
                    <div class="create-btn">
                        <el-button type="primary" @click="openCreateAssignmentDialog(classItem)">创建作业</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 创建作业抽屉 -->
        <el-drawer title="创建新作业" v-model="createAssignmentDrawerVisible" direction="rtl" size="40%"
            custom-class="create-assignment-drawer" :with-header="true">
            <el-form :model="newAssignment" label-width="100px">
                <el-form-item label="标题">
                    <el-input v-model="newAssignment.title" placeholder="请输入作业标题"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="newAssignment.desc" placeholder="请输入作业描述"></el-input>
                </el-form-item>
                <el-form-item label="截止日期">
                    <el-date-picker v-model="newAssignment.due_date" type="date" :disabled-date="disabledDate"
                        :shortcuts="shortcuts" placeholder="选择截止日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="允许超时提交">
                    <el-switch v-model="newAssignment.allow_late_submission"></el-switch>
                </el-form-item>
                <el-form-item label="提交格式">
                    <el-select v-model="newAssignment.submission_format" placeholder="请选择提交格式">
                        <el-option label="图片" value="img"></el-option>
                        <el-option label="文本" value="text"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="上传图片">

                    <el-upload class="upload-demo" drag multiple :limit="10" v-model:file-list="fileList"
                        :on-exceed="handleExceed" list-type="picture-card" :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove" :http-request="onUploadTask" :before-upload="beforeUpload">
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
                    <el-button @click="createAssignmentDrawerVisible = false">取消</el-button>
                    <el-button type="primary" @click="createAssignment">创建</el-button>
                </div>

            </el-form>

        </el-drawer>
    </div>
</template>

<style scoped>
.assignment-management {
    padding: 20px;
    background-color: #f5f7fa;
    /* 设置页面背景色，使内容与背景区分 */
}

.class-card {
    margin: 20px 0;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    /* 增加阴影使卡片浮起 */
    max-height: 600px;
    /* 限制卡片高度 */
    overflow: hidden;
    background-color: #ffffff;
    /* 设置卡片背景色 */
    transition: transform 0.2s ease;
    /* 鼠标悬停动画效果 */
}

.class-card:hover {
    transform: translateY(-4px);
    /* 鼠标悬停时卡片轻微上浮 */
}

.assignment-list {
    margin-bottom: 15px;
}

.assignment-item {
    display: flex;
    justify-content: space-between;
}

.el-scrollbar {
    padding-top: 15px;
    max-height: 300px;
}

.el-scrollbar::-webkit-scrollbar {
    width: 6px;
    /* 自定义滚动条宽度 */
}

.el-scrollbar::-webkit-scrollbar-thumb {
    background-color: #c0c4cc;
    border-radius: 3px;
}

.el-scrollbar::-webkit-scrollbar-track {
    background-color: #f0f1f2;
    border-radius: 3px;
}

.create-btn {
    display: flex;
    justify-content: flex-end;
    padding-top: 10px;
    /* 添加间距，使按钮与上方内容分隔 */
    margin-right: 30px;
}

.create-assignment-drawer {
    padding: 20px;
    background-color: #f9fafc;
    /* 设置抽屉背景色 */
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
</style>