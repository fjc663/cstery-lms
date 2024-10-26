// 学生信息展示接口
export interface istudent {
    id: number,
    username: string,
    name: string,
    student_number: string,
    email: string,
    gender: number,
    school: string,
    avatar: string,
    phone: string,
    address: string,
    desc: string,
}

// 学生信息分页查询条件
export interface istudentPageQuery {
    page: number,
    pageSize: number,
    name?: string,
    gender?: number | null,
}

// 作业完成情况学生信息查询
export interface istudentCompletion {
    submitted: istudent[],
    not_submitted: istudent[]
}