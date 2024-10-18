// 用户端登录和注册表单接口
export interface iuser {
    username: string,
    email?: string,
    password: string,
    comfirmPwd?: string
}

// 用户端后端返回的用户信息类型
export interface iuserInfo {
    id: number,
    username: string,
    email: string,
    phone: string,
    avatarUrl: string,
    gender: number,
    birthdate: string,
    address: string,
    lastLogin: string,
}