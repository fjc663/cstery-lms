// 封装axiios
import axios from "axios"
import { useUserInfoStore } from "@/stores/useUserInfoStore"
import { ElMessage } from "element-plus";
import router from "@/router";

const httpInstance = axios.create({
    baseURL: '/api',
    timeout: 5000,
})

// 拦截器

// axios请求拦截器
httpInstance.interceptors.request.use(config => {
    const userInfoStore = useUserInfoStore();
    config.headers.authorization = userInfoStore.token; // 配置token

    return config
}, e => Promise.reject(e))

// axios响应拦截器
httpInstance.interceptors.response.use(res => res.data, e => {
    if (e.response.status === 401) {
        ElMessage.warning("请先登录");

        const userInfoStore = useUserInfoStore();
        userInfoStore.removeTokenAndUsername();  // 清除token

        router.push({path: '/login', query: {redirect: router.currentRoute.value.fullPath}})  // 登录完返回登录前页面
    }

    return Promise.reject(e)
})

export default httpInstance