import http from "@/utils/http";

// 删除作业图片
export function deleteTaskAPI(filenames: string[]): any {
    // 手动构建查询参数
    const params = new URLSearchParams();
    filenames.forEach(filename => {
        params.append('filenames', filename); // 添加多个同名参数
    });

    return http({
        url: '/delete/teacher/task',
        method: 'Delete',
        params: params
    })
}

