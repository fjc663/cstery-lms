import type { iclass } from "@/composables/interfaceType/classInterface";
import type { istudentPageQuery } from "@/composables/interfaceType/studentInterface";
import http from "@/utils/http";

// 请求班级数据
export function getClassApi(): any {
    return http({
        url: '/teacher/class'
    })
}

// 请求添加班级
export function addClassApi(clas: iclass): any {
    return http({
        url: '/teacher/class',
        method: 'Post',
        data: clas
    })
}

// 请求修改班级信息
export function editClassApi(clas: iclass): any {
    return http({
        url: '/teacher/class',
        method: 'Put',
        data: clas
    })
}

// 请求删除班级
export function deleteClassApi(class_id: number): any {
    return http({
        url: '/teacher/class',
        method: 'Delete',
        params: { class_id: class_id }
    })
}

// 请求班级学生数据
export function getClassStudentsApi(class_id: number): any {
    return http({
        url: `teacher/class/stu/${class_id}`
    })
}

// 根据班级ID请求班级详细信息
export function getClassByIdApi(class_id: number): any {
    return http({
        url: `teacher/class/${class_id}`
    })
}

// 分页请求班级学生数据
export function getClassStudentsPageApi(class_id: number, page_query_model: istudentPageQuery): any {
    return http({
        url: `teacher/class/stu/page/${class_id}`,
        params: page_query_model
    })
}
