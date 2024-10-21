import { useUserInfoStore } from '@/stores/useUserInfoStore';
import { userLoginAPI, userRegisterAPI, editPasswordAPI, getUserInfoAPI, updateUserInfoAPI } from '@/apis/userApi';
import type { result, ieditPassword } from './interfaceType/commonInterface';
import type { iuserInfo, ilogin, iregister } from './interfaceType/userInterface';
import { ElMessage } from 'element-plus';
import router from '@/router';
import { ref } from 'vue';

const useUserInfo = useUserInfoStore();

// 用户数据
const user = ref<iuserInfo>({
    username: '',
    name: '',
    email: '',
    phone: '',
    avatar: '',
    gender: 2,
    address: '',
    desc: ''
});

// 请求登录
const userLogin = async (loginForm: ilogin): Promise<number> => {
    //删除用户名和密码左右两端的空格
    loginForm.username = loginForm.username.replace(/(^\s*)|(\s*$)/g, "");
    loginForm.password = loginForm.password.replace(/(^\s*)|(\s*$)/g, "");

    // 发送登录请求
    const res: result = await userLoginAPI(loginForm);

    if (res.code === 1) {
        ElMessage.success("登录成功");

        // 设置token和用户名
        useUserInfo.setToken(res.data.token);
        if (res.data.name !== null) {
            useUserInfo.setTeachername(res.data.name);
        } else {
            useUserInfo.setTeachername(loginForm.username);
        }
        useUserInfo.setAvatar(res.data.avatar);

    } else {
        ElMessage.error(res.msg);
    }
    return res.code;
};

// 用户注册
const userRegister = async (registerForm: iregister): Promise<number> => {
    // 发送注册请求和处理响应结果
    const res: result = await userRegisterAPI(registerForm);

    if (res.code === 1) {
        ElMessage.success("注册成功，请用该账号登录");
    } else {
        ElMessage.success(res.msg);
    }

    return res.code;
};

// 退出登录
const logout = () => {
    useUserInfo.remove()
    router.push({ path: '/login', query: { isLogin: 1 } });
}


// 修改密码
const editPassword = async (form: ieditPassword) => {
    const res: result = await editPasswordAPI(form);

    if (res.code === 1) {
        ElMessage.success('密码修改成功');

        form = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        };

        logout();
        ElMessage.success('请用新密码登录');
    } else {
        ElMessage.error(res.msg);
    }
};

// 请求用户数据
const getUserInfo = async () => {
    const res: result = await getUserInfoAPI();

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }
    user.value = res.data;
}

// 修改个人信息
const updateUserInfo = async () => {

    const res: result = await updateUserInfoAPI(user.value);

    if (res.code === 0) {
        ElMessage.error(res.msg);
    } else {
        ElMessage.success("修改成功");
    }
    getUserInfo();
};

export default function() {
    return {
        user,
        userLogin,
        userRegister,
        logout,
        editPassword,
        getUserInfo,
        updateUserInfo
    }
}