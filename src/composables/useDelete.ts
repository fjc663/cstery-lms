import type { result } from "./interfaceType/commonInterface";
import { ElMessage } from "element-plus";
import { deleteImgAPI } from "@/apis/deleteApi";

// 删除作业图片
const deleteImg = async (filenames: string[]) => {
    const res: result = await deleteImgAPI(filenames);

    if (res.code === 0) {
        ElMessage.error(res.msg);
    }

}

export default function() {
    return {
        deleteImg
    }
}