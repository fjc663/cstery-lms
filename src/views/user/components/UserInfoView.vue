<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { ComponentSize, FormRules, FormInstance } from 'element-plus';
import type { result } from '@/composables/interfaceType/commonInterface';
import type { iuserInfo } from '@/composables/interfaceType/userInterface';
import { pcaTextArr } from 'element-china-area-data';
import { useUserInfoStore } from '@/stores/useUserInfoStore';
import useUser from '@/composables/useUser';
import useUpload from '@/composables/useUpload';
import useUtils from '@/composables/useUtils';

// 用户信息展示页面设置
const size = ref<ComponentSize>('default');

// 用户数据
const { user, getUserInfo, updateUserInfo } = useUser();

// 上传逻辑
const { uploadAvatar } = useUpload();

// 工具函数
const { beforeUpload, calculateAge } = useUtils();

// 用户修改的地址数据暂存处
const selectedOptions = ref<string[]>([]);
const detailAddress = ref<string>('');

// 控制修改个人信息抽屉弹出
const editUserInfoDrawer = ref<boolean>(false);

// 表单实例的引用
const userRef = ref<FormInstance>();

// 声明新的表单数据对象，用于编辑
const editForm = ref<iuserInfo>({
    username: '',
    name: '',
    email: '',
    phone: '',
    avatar: '',
    gender: 2,
    birthdate: null,
    address: '',
    desc: ''
});

// 校验要修改的用户数据
const rules = ref<FormRules<iuserInfo>>({
    name: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 1, max: 100, message: '姓名字符长度为1到100', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
    ],
    phone: [
        { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' },
        {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '请输入正确的手机号码',
        },
    ],
});

// 点击取消修改按钮触发
const cancelEdit = () => {
    editUserInfoDrawer.value = false;
    getUserInfo();
    // 将 user 数据重新复制到 editForm 中，避免未提交的修改保留
    editForm.value = { ...user.value };
};

// 打开编辑抽屉时同步 user 数据到 editForm
const openEditDrawer = () => {
    editForm.value = { ...user.value }; // 复制 user 数据到 editForm
    editUserInfoDrawer.value = true;
};

// 修改个人信息
const editPersonalInfo = (formEl: FormInstance | undefined) => {
    if (!formEl) return;

    formEl.validate(async (valid: boolean) => {
        if (valid) {
            editForm.value.address = selectedOptions.value.join(' ') + ' ' + detailAddress.value;

            // 请求更新信息
            await updateUserInfo(editForm.value); // 更新时将 editForm 数据提交

            // 将 editForm 数据同步到 user
            Object.assign(user.value, editForm.value);

            editUserInfoDrawer.value = false;
        }
    });
};

// 上传头像
const onUploadAvatar = async (avatar: any) => {
    const formData = new FormData();
    formData.append('avatar_file', avatar.file);

    const res: result = await uploadAvatar(formData);

    if (res.code === 1) {
        user.value.avatar = res.data;

        const userInfoStore = useUserInfoStore();
        userInfoStore.setAvatar(res.data);
    }
};

// 请求用户数据
onMounted(async () => {
    await getUserInfo();
    selectedOptions.value = user.value.address.split(' ').slice(0, 3);
    detailAddress.value = user.value.address.split(' ')[3];

    editForm.value = {
    ...user.value, // 使用解构拷贝 user 数据的初始值
};
});
</script>


<template>

    <!-- 用户信息卡片 -->
    <el-card class="info-card" shadow="hover">
        <div class="card-header">
            <el-upload class="avatar-uploader" :http-request="onUploadAvatar" :show-file-list="false"
                :before-upload="beforeUpload">
                <img v-if="user.avatar" v-lazy="user.avatar" fit="cover" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                    <Plus />
                </el-icon>
            </el-upload>
        </div>
        <div class="card-body">
            <h2 class="username">{{ user.username }}</h2>

            <el-descriptions class="margin-top" :column="1" :size="size" border>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-xingbie"></use>
                            </svg>
                            姓名
                        </div>
                    </template>
                    {{ user.name || '未填写' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-xingbie"></use>
                            </svg>
                            性别
                        </div>
                    </template>
                    {{ user.gender === 1 ? '男' : user.gender === 0 ? '女' : '保密' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-nianling"></use>
                            </svg>
                            年龄
                        </div>
                    </template>
                    {{ user.birthdate ? calculateAge(user.birthdate) : '未知' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-shengritixing"></use>
                            </svg>
                            生日
                        </div>
                    </template>
                    {{ user.birthdate || '未填写' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-phone"></use>
                            </svg>
                            电话
                        </div>
                    </template>
                    {{ user.phone || '未填写' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-youxiang"></use>
                            </svg>
                            邮箱
                        </div>
                    </template>
                    {{ user.email || '未填写' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-dizhi"></use>
                            </svg>
                            地址
                        </div>
                    </template>
                    {{ user.address || '未填写' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-dizhi"></use>
                            </svg>
                            个人介绍
                        </div>
                    </template>
                    {{ user.desc || '无' }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <el-button type="primary" class="edit-personal-info-button" plain
            @click="openEditDrawer">修改个人信息</el-button>
    </el-card>

    <!-- 修改用户信息的抽屉 -->
    <el-drawer v-model="editUserInfoDrawer" title="修改基本信息" :before-close="cancelEdit">
        <el-form :model="editForm" label-width="auto" style="max-width: 600px" :rules="rules" ref="userRef">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="editForm.name" />
            </el-form-item>
            <el-form-item label="性别">
                <el-select v-model="editForm.gender" placeholder="请选择你的性别">
                    <el-option label="男" :value=1 />
                    <el-option label="女" :value=0 />
                    <el-option label="保密" :value=2 />
                </el-select>
            </el-form-item>
            <el-form-item label="出生日期">
                <el-date-picker v-model="editForm.birthdate" placeholder="请选择出生日期" style="width: 100%" />
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <el-input v-model="editForm.phone" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email" />
            </el-form-item>
            <el-form-item label="省/市/区">
                <el-cascader :options="pcaTextArr" v-model="selectedOptions">
                </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址">
                <el-input v-model="detailAddress" />
            </el-form-item>
            <el-form-item label="个人介绍">
                <el-input type="textarea" v-model="editForm.desc" />
            </el-form-item>
            <div class="edit-button">
                <el-button @click="cancelEdit">取消</el-button>
                <el-button type="primary" @click="editPersonalInfo(userRef)">确定</el-button>
            </div>
        </el-form>
    </el-drawer>

</template>

<style scoped>
.el-descriptions {
    margin-top: 20px;
}

.cell-item {
    display: flex;
    align-items: center;
}

.margin-top {
    margin-top: 20px;
}

.info-card {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
    text-align: center;
    margin-bottom: 20px;
}

.avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}

.username {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
}

.email,
.phone,
.gender,
.birthdate {
    color: #666;
    margin: 10px 0;
    text-align: center;
}

.edit-personal-info-button {
    margin: 10px;
    float: right;
}

.edit-button {
    display: flex;
    justify-content: center;
}
</style>