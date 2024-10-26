import type { result } from "./interfaceType/commonInterface";
import { ElMessage } from "element-plus";
import { deleteTaskAPI } from "@/apis/deleteApi";

// 删除作业图片
const deleteTask = async (filenames: string[]) => {
    const res: result = await deleteTaskAPI(filenames);

    if (res.code === 0) {
        ElMessage.error(res.msg);
    }

}

export default function() {
    return {
        deleteTask
    }
}