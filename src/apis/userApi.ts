import http from '@/utils/http'
import type { iregister, ilogin, ieditPassword } from '@/composables/interfaceType/userInterface'
import type { iuserInfo } from '@/composables/interfaceType/userInterface'


// 用户注册
export function userRegisterAPI(data: iregister): any {
    return http({
        url: '/teacher/user/register',
        method: 'Post',
        data: data
    })
}

// 用户登录
export function userLoginAPI(data: ilogin): any {
    return http({
        url: '/teacher/user/login',
        method: 'Post',
        data: data
    })
}

// 获得用户信息
export function getUserInfoAPI(): any {
    return http({
        url: '/teacher/user'
    })
}

// 修改用户信息
export function updateUserInfoAPI(data: iuserInfo): any {
    return http({
        url: '/teacher/user',
        method: 'Put',
        data: data
    })
}

// 修改密码
export function editPasswordAPI(data: ieditPassword): any {
    return http({
        url: '/teacher/user/editPassword',
        method: 'Put',
        data: data
    })
}
