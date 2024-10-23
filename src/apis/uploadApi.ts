import http from "@/utils/http";

// 上传头像图片
export function uploadAvatarAPI(data: FormData): any {
    return http({
        headers: {"Content-Type": "multipart/form-data"},
        url: '/upload/teacher/avatar',
        method: 'Post',
        data: data
    })
}

// 上传分类图片
export function uploadClassAPI(data: FormData): any {
    return http({
        headers: {"Content-Type": "multipart/form-data"},
        url: '/upload/teacher/class',
        method: 'Post',
        data: data
    })
}