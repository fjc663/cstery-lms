<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { type FormRules, type FormInstance } from 'element-plus'
import useUser from '@/composables/useUser';
import type { ieditPassword } from '@/composables/interfaceType/userInterface';

// 表单实例的引用
const formRef = ref<FormInstance>();

// 表单数据
const form = ref<ieditPassword>({
    old_password: '',
    new_password: '',
    confirm_password: ''
});

// 验证规则
const rules = ref<FormRules<ieditPassword>>({
    old_password: [
        { required: true, message: '请输入旧密码', trigger: 'blur' },
        { min: 6, max: 18, message: '密码长度应为 6 到 18 个字符', trigger: 'blur' }
    ],
    new_password: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 18, message: '密码长度应为 6 到 18 个字符', trigger: 'blur' }
    ],
    confirm_password: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        {
            validator: (rule: any, value: string, callback: any) => {
                if (value !== form.value.new_password) {
                    callback(new Error('两次输入的密码不一致'));
                } else {
                    callback();
                }
            }, trigger: 'blur'
        }
    ]
});

// 修改密码函数
const { editPassword } = useUser();

// 提交表单
const submitForm = (formEl: any) => {
    if (!formEl) return;

    formEl.validate(async (valid: boolean) => {
        if (valid) {
            editPassword(form.value);
        } else {
            ElMessage.error('请输入正确格式');
            return false;
        }
    });
};
</script>

<template>
    <div class="password-change-page">
        <!-- 背景设计 -->
        <div class="background-overlay"></div>

        <!-- 中心表单 -->
        <el-card class="password-card" shadow="hover">
            <h1 class="password-change-title">修改密码</h1>

            <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="password-form">
                <!-- 旧密码 -->
                <el-form-item label="旧密码" prop="old_password">
                    <el-input v-model="form.old_password" type="password" placeholder="请输入旧密码"
                        class="input-field"></el-input>
                </el-form-item>

                <!-- 新密码 -->
                <el-form-item label="新密码" prop="new_password">
                    <el-input v-model="form.new_password" type="password" placeholder="请输入新密码"
                        class="input-field"></el-input>
                </el-form-item>

                <!-- 确认新密码 -->
                <el-form-item label="确认密码" prop="confirm_password">
                    <el-input v-model="form.confirm_password" type="password" placeholder="请再次输入新密码"
                        class="input-field"></el-input>
                </el-form-item>

                <!-- 提交按钮 -->
                <el-form-item>
                    <el-button type="primary" @click="submitForm($refs.formRef)" class="submit-btn">修改</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<style scoped>
/* 背景设计 */
.password-change-page {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    position: relative;
    background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
}

/* 半透明模糊背景，提升表单层次 */
.background-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    z-index: -1;
}

/* 表单卡片设计 */
.password-card {
    margin-top: 100px;
    padding: 40px;
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.85);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
    text-align: center;
}

/* 标题样式 */
.password-change-title {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
}

/* 输入框样式 */
.input-field {
    width: 100%;
    border-radius: 8px;
    padding: 12px;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* 提交按钮样式 */
.submit-btn {
    width: 100%;
    padding: 12px 0;
    font-size: 16px;
    border-radius: 8px;
    background: linear-gradient(45deg, #4f93ff, #5a7ffd);
    color: white;
    transition: all 0.3s ease;
}

.submit-btn:hover {
    background: linear-gradient(45deg, #5a7ffd, #6ca0ff);
    transform: translateY(-3px);
}

/* 全局样式 */
.el-form-item {
    margin-bottom: 30px;
}

.el-button {
    font-weight: bold;
    letter-spacing: 1px;
}
</style>
