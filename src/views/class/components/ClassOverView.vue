<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { iclass } from '@/composables/interfaceType/classInterface';
import useClass from '@/composables/useClass';
import type { result } from '@/composables/interfaceType/commonInterface';
import { ElMessage, ElDialog, ElMessageBox } from 'element-plus';
import type { UploadProps, FormRules, FormInstance } from 'element-plus'
import useUpload from '@/composables/useUpload';
import { useRouter } from 'vue-router';
import useUtils from '@/composables/useUtils';


const router = useRouter();

// 班级信息处理逻辑
const { classes, getClass, addClass, editClass, deleteClass } = useClass();

// 表单实例的引用
const classFormRef = ref<FormInstance>();

const newClass = ref<iclass>({
    class_name: '',
    teacher_name: '',
    class_img: '',
    desc: '',
});

// 控制添加和修改班级的弹窗
const isDialogVisible = ref<boolean>(false);
// 表明当前是编辑还是添加
const isEdit = ref<boolean>(false);
// 表单校验规则
const rules = ref<FormRules<iclass>>({
    class_name: [
        { required: true, message: '班级名称不能为空', trigger: 'blur' },
        { min: 1, max: 100, message: '班级名称长度应为 1 到 100 个字符', trigger: 'blur' }
    ],
    teacher_name: [
        { required: true, message: '老师名称不能为空', trigger: 'blur' },
        { min: 1, max: 100, message: '老师名称长度应为 1 到 100 个字符', trigger: 'blur' }
    ],
});

// 添加新班级
const onAddClass = async () => {
    isEdit.value = false;
    isDialogVisible.value = true;

    newClass.value = {
        class_name: '',
        class_img: '',
        desc: '',
    };
};

// 编辑班级信息
const onEditClass = (clas: iclass) => {
    isEdit.value = true;
    isDialogVisible.value = true;
    Object.assign(newClass.value, clas);
};

// 提交班级信息表单
const submitClassForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;

    formEl.validate(async (valid: boolean) => {
        if (valid) {
            if (isEdit.value) {
                await editClass(newClass.value);
            } else {
                await addClass(newClass.value);
            }
            getClass();
            isDialogVisible.value = false;
        }
    });
};

// 删除班级
const onDeleteClass = async (classId: number) => {
    ElMessageBox.confirm('此操作将永久删除该班级, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        await deleteClass(classId);
        getClass();
    }).catch(() => {
        ElMessage({ type: 'info', message: '已取消删除' });
    });
};

// 查看班级详细信息
const viewClassDetails = (classId: number) => {
    router.push(`/class/${classId}`);
}

// 文件上传处理逻辑
const { uploadClass } = useUpload();

// 上传班级图片
const onUploadClass = async (avatar: any) => {
    const formData = new FormData();
    formData.append('class_image_file', avatar.file);

    const res: result = await uploadClass(formData);

    if (res.code === 1) {
        newClass.value.class_img = res.data;
    }
};

// 上传班级图片前的钩子函数
const beforeClassUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.size / 1024 / 1024 > 10) {
        ElMessage.error('头像大小必须小于10MB');
        return false;
    }
    return true;
};

// 复制到剪贴板的函数
const { copyToClipboard } = useUtils();

// 初始化班级数据
onMounted(() => getClass());
</script>

<template>
    <el-dialog v-model="isDialogVisible" :title="isEdit ? '修改班级信息' : '创建新班级'" width="500px">
        <div class="dialog-content">
            <el-form :model="newClass" label-width="100px" :rules="rules" ref="classFormRef">
                <el-form-item label="班级名称" prop="class_name">
                    <el-input v-model="newClass.class_name" placeholder="班级名称" class="input-field" />
                </el-form-item>

                <el-form-item label="老师名称" prop="teacher_name">
                    <el-input v-model="newClass.teacher_name" placeholder="老师名称" class="input-field" />
                </el-form-item>

                <el-form-item v-if="isEdit" label="班级邀请码" prop="class_code">
                    <el-input v-model="newClass.class_code" placeholder="班级邀请码" class="input-field" disabled />
                </el-form-item>

                <el-form-item label="班级描述" prop="desc">
                    <el-input type="textarea" v-model="newClass.desc" placeholder="班级描述" class="textarea-field" />
                </el-form-item>

                <el-form-item label="班级图片" prop="class_img">
                    <p class="upload-tip" style="color: red;">上传的班级图片应小于10MB，格式为JPG/PNG。</p>
                    <el-upload class="class-uploader" :http-request="onUploadClass" :show-file-list="false"
                        :before-upload="beforeClassUpload">
                        <img v-if="newClass.class_img" v-lazy="newClass.class_img" class="uploaded-image" />
                        <el-icon v-else class="class-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>

            </el-form>

        </div>
        <template #footer>
            <el-button @click="onAddClass" class="cancel-button">取 消</el-button>
            <el-button type="primary" @click="submitClassForm(classFormRef)" class="confirm-button">{{ isEdit ? "修改" : "创建"
                }}</el-button>
        </template>
    </el-dialog>

    <div class="class-management">

        <div class="class-management-header">
            <h1 class="header-title">班级管理</h1>
            <el-button type="primary" @click="onAddClass">添加新班级</el-button>
        </div>


        <div class="class-list">
            <h2>我的班级</h2>
            <div class="card-container">
                <div class="class-card" v-for="classItem in classes" :key="classItem.id">
                    <img v-lazy="classItem.class_img" alt="班级图片" @click="viewClassDetails(classItem.id || 0)"
                        class="class-img" />
                    <h3>
                        <el-tooltip placement="top" effect="light" v-if="classItem.class_name.length > 12"
                            popper-class="custom-tooltip">
                            <template #content>
                                <div>{{ classItem.class_name }}</div>
                            </template>
                            {{ classItem.class_name.slice(0, 12) + '...' }}
                        </el-tooltip>
                        <span v-else>{{ classItem.class_name }}</span>
                    </h3>
                    <p>
                        <el-tooltip placement="top" effect="light" v-if="classItem.desc.length > 14"
                            popper-class="custom-tooltip">
                            <template #content>
                                <div>{{ classItem.desc }}</div>
                            </template>
                            {{ classItem.desc.slice(0, 14) + '...' }}
                        </el-tooltip>
                        <span v-else>{{ classItem.desc }}</span>
                    </p>
                    <p>
                        邀请码：{{ classItem.class_code }}
                        <el-button type="success" link class="copy-button"
                            @click="copyToClipboard(classItem.class_code || '')">复制</el-button>
                    </p>
                    <div class="button-group">
                        <el-button type="primary" size="small" @click.stop="onEditClass(classItem)">修改</el-button>
                        <el-button type="danger" size="small"
                            @click.stop="onDeleteClass(classItem.id || -1)">删除</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.class-management {
    padding: 40px;
    background: linear-gradient(135deg, #f0f4f8, #e7eef2);
    border-radius: 10px;
    min-height: 100vh;
}

.class-management-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #345677;
    /* 主题颜色 */
    color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-title {
    font-size: 2em;
    margin: 0 auto;
}

.class-list {
    margin-top: 20px;
}

.card-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 30px;
    margin-top: 20px;
}

@media (max-width: 600px) {
    .card-container {
        grid-template-columns: 1fr;
        /* 小屏幕时每行一张卡片 */
    }
}

.class-card {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 20px;
    transition: transform 0.3s;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}

.class-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.class-img {
    width: 100%;
    height: 150px;
    border-radius: 8px;
    object-fit: cover;
    cursor: pointer;
}

.dialog-content {
    padding: 20px;
}

.input-field,
.textarea-field {
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s;
}

.input-field:focus,
.textarea-field:focus {
    border-color: #409eff;
    /* 聚焦时边框颜色 */
}


.cancel-button {
    background-color: #f0f0f0;
    color: #333;
}

.confirm-button {
    background-color: #409eff;
    color: white;
}

.confirm-button:hover {
    background-color: #66b1ff;
    /* 更深的蓝色 */
}

.cancel-button:hover {
    background-color: #e2e2e2;
    /* 更深的灰色 */
}

/* 上传区域样式优化 */
.class-uploader {
    width: 180px;
    height: 180px;
    border: 2px dashed #d9d9d9;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: #f9f9f9;
    transition: border-color 0.3s ease, background-color 0.3s ease;
}

.class-uploader:hover {
    border-color: #409eff;
    background-color: #f0f9ff;
}

.uploaded-image {
    width: 180px;
    height: 180px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.class-uploader-icon {
    font-size: 36px;
    color: #8c939d;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    transition: color 0.3s ease;
}

.class-uploader:hover .class-uploader-icon {
    color: #409eff;
}
</style>
