import type { icorrect, itask } from "@/composables/interfaceType/taskInterface";
import http from "@/utils/http";


// 请求添加作业
export function createTaskApi(task: itask): any {
    return http({
        url: '/teacher/task',
        method: 'Post',
        data: task
    })
}

// 根据作业ID请求作业信息
export function getTaskByIdApi(taskId: number):any {
    return http({
        url: `/teacher/task/${taskId}`
    })
}

// 请求学生完成作业情况
export function getStudentCompletionStatusApi(taskId: number): any {
    return http({
        url: `/teacher/task/completion/${taskId}`
    })
}

// 请求修改作业
export function editTaskApi(task: itask): any {
    return http({
        url: '/teacher/task',
        method: 'Put',
        data: task
    })
}

// 请求学生作答详情
export function getAnswerApi(studentId: number, taskId: number): any {
    return http({
        url: `/teacher/task/answer/${studentId}`,
        params: {task_id: taskId}
    })
}

// 批改作答
export function correctAnswerApi(correct: icorrect): any {
    return http({
        url: '/teacher/task/correct',
        method: 'Put',
        data: correct
    })
}