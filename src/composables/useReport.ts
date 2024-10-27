import { getAllTaskApi, getTaskReportApi } from "@/apis/reportApi"
import type { result } from "./interfaceType/commonInterface"
import type { itaskPageQuery, itaskReport, itaskScore } from "./interfaceType/taskInterface"
import { ref } from "vue"
import { ElMessage } from "element-plus"


// 班级学生数据列表
const taskScores = ref<itaskScore[]>([]);

// 作业成绩详细信息
const taskReport = ref<itaskReport>({
    title: '',
    completed_count: 0,
    not_completed_count: 0,
    score_list: [],
    average_score: 0,
    pass_rate: 0
})

// 分页查询条件
const pageQueryTask = ref<itaskPageQuery>({
    page: 1,
    pageSize: 10
});

// 分页查询得到总条数
const totaltask = ref<number>(0);

const getAllTask = async () => {
    const res: result = await getAllTaskApi(pageQueryTask.value);

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    totaltask.value = res.data.total;
    taskScores.value = res.data.records;
}

const getTaskReport = async (taskId: number) => {
    const res: result = await getTaskReportApi(taskId);

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    taskReport.value = res.data;
}


export default function() {
    return {
        pageQueryTask,
        getAllTask,
        totaltask,
        taskScores,
        taskReport,
        getTaskReport
    }
}