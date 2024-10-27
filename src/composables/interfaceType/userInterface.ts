// 注册表单接口
export interface iregister {
    username: string,
    password: string,
    confirm_password: string
}

// 登录表单接口
export interface ilogin {
    username: string,
    password: string,
}

// 教师端后端返回的用户信息类型
export interface iuserInfo {
    username: string,
    name: string,
    email: string,
    phone: string,
    avatar: string,
    gender: number,
    birthdate: Date | null,
    address: string,
    desc: string
}

// 修改密码传输的数据类型
export interface ieditPassword {
    old_password: string,
    new_password: string,
    confirm_password: string
}