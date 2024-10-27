import router from '@/router';
import { ElMessage, type UploadProps } from 'element-plus';

// 复制到剪贴板的函数
const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        ElMessage.success('复制成功');
    } catch {
        ElMessage.error("复制失败");
    }
};

// 返回上次路由
const goBack = () => {
    router.back();
}

// 日期格式化函数
const formatDate = (date: Date) => {
    const formattedDate = new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '-'); // 将默认的'/'替换为'-'

    return `${formattedDate} 23:59:59`; // 添加时间
};

// 格式化为更易读的格式，例如：YYYY-MM-DD HH:mm:ss
const formattedDateTime = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).replace(/\//g, '-');
}

// 上传图片前的钩子函数
const beforeUpload: UploadProps['beforeUpload'] = (file: File) => {
    const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt10M = file.size / 1024 / 1024 < 10;

    if (!isJPGorPNG) {
        ElMessage.error('上传图片只能是 JPG/PNG 格式!');
        return false;
    }

    if (!isLt10M) {
        ElMessage.error('上传图片大小不能超过 10MB!');
        return false;
    }

    return true;
};

// 处理上传图片超出限制的情况
const handleExceed = () => {
    ElMessage.warning('最多只能上传10张图片');
};

// 禁止选择过去时间
const disabledDate = (time: Date) => {
    return time.getTime() < Date.now()
}

// 根据出生日期计算年龄
const calculateAge = (birthday: Date | string | null): string | number => {
    if (!birthday) {
        return '';
    }

    // 如果 `birthday` 是字符串，则尝试转换为 `Date`
    const dateObj = birthday instanceof Date ? birthday : new Date(birthday);
    if (isNaN(dateObj.getTime())) { // 确保转换成功
        return '';
    }

    const ageDifMs: number = Date.now() - dateObj.getTime();
    const ageDate: Date = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};


// 配置时间快捷选项
const shortcuts = [
    {
      text: '一周后',
      value: () => {
        const date = new Date()
        date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
        return date
      },
    },
    {
        text: '二周后',
        value: () => {
          const date = new Date()
          date.setTime(date.getTime() + 3600 * 1000 * 24 * 14)
          return date
        },
      },
      {
        text: '30天后',
        value: () => {
          const date = new Date()
          date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
          return date
        },
      },
  ]

export default function () {
    return {
        copyToClipboard,
        goBack,
        formatDate,
        formattedDateTime,
        beforeUpload,
        handleExceed,
        disabledDate,
        shortcuts,
        calculateAge
    }
}