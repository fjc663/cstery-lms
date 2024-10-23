import { ref } from "vue";
import type { iclass } from "./interfaceType/classInterface";
import type { result } from "./interfaceType/commonInterface";
import { addClassApi, deleteClassApi, editClassApi, getClassApi, getClassByIdApi, getClassStudentsApi, getClassStudentsPageApi } from "@/apis/classApi";
import { ElMessage } from "element-plus";
import type { istudent, istudentPageQuery } from "./interfaceType/studentInterface";


// 班级数据列表
const classes = ref<iclass[]>([]);

// 班级学生数据列表
const students = ref<istudent[]>([]);

// 班级详细信息
const clas = ref<iclass>({
    id: -1,
    class_name: '',
    class_code: '',
    teacher_name: '',
    desc: '',
    class_img: ''
});

// 分页查询条件
const pageQueryStudent = ref<istudentPageQuery>({
    page: 1,
    pageSize: 10
});

// 分页查询得到总条数
const totalStudent = ref<number>(0);

// 请求班级数据
const getClass = async () => {

    const res: result = await getClassApi();

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }
    classes.value = res.data;
}

// 添加班级数据
const addClass = async (clas: iclass) => {

    const res: result = await addClassApi(clas);

    if (res.code === 1) {
        ElMessage.success('创建成功');
    } else {
        ElMessage.error(res.msg);
    }


}

// 修改班级数据
const editClass = async (clas: iclass) => {
    const res: result = await editClassApi(clas);

    if (res.code === 1) {
        ElMessage.success('修改成功');
    } else {
        ElMessage.error(res.msg);
    }
}

// 删除班级数据
const deleteClass = async (class_id: number) => {

    const res: result = await deleteClassApi(class_id);

    if (res.code === 1) {
        ElMessage.success('删除成功');
    } else {
        ElMessage.error(res.msg);
    }

}

// 获得班级学生信息
const getClassStudents = async (class_id: number) => {

    const res: result = await getClassStudentsApi(class_id);

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }
    students.value = res.data;

}

// 根据ID获得班级详细信息
const getClassById = async (class_id: number) => {

    const res: result = await getClassByIdApi(class_id);

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }
    clas.value = res.data;

}

// 分页获得班级学生信息
const getClassStudentsPage = async (class_id: number) => {

    const res: result = await getClassStudentsPageApi(class_id, pageQueryStudent.value);

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    if (res.data) {
        students.value = res.data.records;
        totalStudent.value = res.data.total;
    }

}

export default function () {
    return {
        classes,
        getClass,
        addClass,
        editClass,
        deleteClass,
        students,
        getClassStudents,
        clas,
        getClassById,
        pageQueryStudent,
        totalStudent,
        getClassStudentsPage
    }
}