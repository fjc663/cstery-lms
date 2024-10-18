// 后端返回结果的统一数据接口
export interface result {
    code: number,
    msg: string,
    data: any
}

// 修改密码传输的数据类型
export interface ieditPassword {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
}