// 作业信息展示接口
export interface itask {
    id?: number,
    title: string,
    desc: string,
    due_date: Date | null,
    allow_late_submission: boolean,
    submission_format: string,
    images: JSON,
    clas_id?: number
    created_at?: Date,
}

// 作业作答信息接口
export interface ianswer {
    id?: number,
    title?: string,
    desc?: string,
    images?: JSON,
    score: number,
    feedback: string,
    student_name?: '',
    student_number?: '',
    created_at?: Date,
    updated_at?: Date
}

// 作业批改接口
export interface icorrect {
    student_id: number,
    task_id: number,
    score: number | null,
    feedback: string
}

// 作业信息分页查询条件
export interface itaskPageQuery {
    page: number,
    pageSize: number,
    task_title?: string,
    class_name?: string,
    is_cut_off?: boolean | null
}

// 作业成绩展示接口
export interface itaskScore {
    id: number,
    title: string,
    due_date: Date | null,
    class_name: string,
    completed_count: number,
    not_completed_count: number,
    total_count: number,
    completion_rate: number,
    average_score: number
}

// 作业详细报告
export interface itaskReport {
    title: string,
    completed_count: number,
    not_completed_count: number,
    score_list: number[],
    average_score: number
    pass_rate: number
}