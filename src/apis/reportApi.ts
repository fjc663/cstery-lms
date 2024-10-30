import type { itaskPageQuery } from "@/composables/interfaceType/taskInterface";
import http from "@/utils/http";


// 根据教师ID分页查询作业
export function getAllTaskApi(taskPageQuery: itaskPageQuery): any {
    return http({
        url: '/teacher/report',
        params: taskPageQuery
    })
}

// 根据作业ID查询作业报告
export function getTaskReportApi(taskId: number): any {
    return http({
        url: `/teacher/report/${taskId}`
    })
}

// 请求首页图片
export function getHomeImageApi(): any {
    return http({
        url: '/teacher/report/home/images'
    })
}