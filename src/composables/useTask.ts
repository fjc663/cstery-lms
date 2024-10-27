import { correctAnswerApi, createTaskApi, deleteTaskApi, editTaskApi, getAnswerApi, getStudentCompletionStatusApi, getTaskByIdApi } from "@/apis/taskApi";
import type { result } from "./interfaceType/commonInterface";
import type { ianswer, icorrect, itask } from "./interfaceType/taskInterface";
import { ElMessage } from "element-plus";
import type { istudentCompletion } from "./interfaceType/studentInterface";
import { ref } from "vue";


// 作业详细信息
const task = ref<itask>({
    title: '',
    desc: '',
    due_date: new Date('2024-02-13'),
    allow_late_submission: true,
    submission_format: '',
    images: JSON.parse('[]'),
})

// 答案详细信息
const answer = ref<ianswer>({
    score: 0,
    feedback: ''
})

// 作业完成情况信息
const studentCompletionStatus = ref<istudentCompletion>({
    submitted: [],
    not_submitted: []
})

// 创建作业
const createTask = async (task: itask): Promise<number> => {
    const res: result = await createTaskApi(task);

    if (res.code === 1) {
        ElMessage.success('创建成功');
    } else {
        ElMessage.error(res.msg);
    }

    return res.code;
}

// 根据作业ID请求作业信息
const getTaskById = async (taskId: number) => {
    const res: result = await getTaskByIdApi(taskId);

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    task.value = res.data;
}

// 查询学生作业完成情况
const getStudentCompletionStatus = async (taskId: number) => {
    const res: result = await getStudentCompletionStatusApi(taskId);

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    studentCompletionStatus.value = res.data;
}

// 修改作业
const editTask = async (task: itask): Promise<number> => {
    const res: result = await editTaskApi(task);

    if (res.code === 1) {
        ElMessage.success('修改成功');
    } else {
        ElMessage.error(res.msg);
    }

    return res.code;
}

// 查询学生作答详情
const getAnswer = async (studentId: number, taskId: number) => {
    const res: result = await getAnswerApi(studentId, taskId);

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    answer.value = res.data;
}

// 批改学生作答
const correctAnswer = async (correct: icorrect): Promise<number> => {
    const res: result = await correctAnswerApi(correct);

    if (res.code === 1) {
        ElMessage.success('提交成功');
    } else {
        ElMessage.error(res.msg);
    }

    return res.code;
}

// 删除作业
const deleteTask = async (taskId: number) => {
    const res: result = await deleteTaskApi(taskId);

    if (res.code === 1) {
        ElMessage.success('删除成功');
    } else {
        ElMessage.error(res.msg);
    }
}

export default function() {
    return {
        createTask,
        task,
        getTaskById,
        studentCompletionStatus,
        getStudentCompletionStatus,
        editTask,
        answer,
        getAnswer,
        correctAnswer,
        deleteTask
    }
}