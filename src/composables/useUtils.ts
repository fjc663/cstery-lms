import { ElMessage } from 'element-plus';

// 复制到剪贴板的函数
const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        ElMessage.success('复制成功');
    } catch {
        ElMessage.error("复制失败");
    }
};

export default function() {
    return {
        copyToClipboard
    }
}