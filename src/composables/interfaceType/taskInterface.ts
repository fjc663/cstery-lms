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
    created_at?: Date
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