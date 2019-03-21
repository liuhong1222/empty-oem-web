<template>
    <div>
        <el-dialog title="添加/编辑" :close-on-click-modal="false" :visible.sync="visible" width="550px" :before-close="closeNewsSeeDialod">
            <el-form :model="quesAUDataForm" label-width="100px" :rules="quesAUDataRules" ref="quesAUDataRef" class="demo-ruleForm">
                <el-form-item label="所属产品：" prop="proName">
                    <el-input v-model="quesAUDataForm.proName" placeholder="请输入产品名称……"></el-input>
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                    <el-select v-model="quesAUDataForm.status" placeholder="请选择审核状态">
                        <el-option v-for="(item,index) in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序：" prop="orderNum">
                    <el-input-number v-model="quesAUDataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
                </el-form-item>
                <el-form-item label="问题标题：" prop="title">
                    <el-input v-model="quesAUDataForm.title" placeholder="请简要描述问题……"></el-input>
                </el-form-item>
                <el-form-item label="回答内容：" prop="content">
                    <el-input type="textarea" v-model="quesAUDataForm.content" placeholder="请简要对上面的问题进行回答(最大输入500字符)……"
                        maxlength="500"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" plain @click="closeNewsSeeDialod()">取消</el-button>
                    <el-button type="primary" @click="quesAUDataSubmit()">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                visible: false,
                quesAUDataForm: {
                    proName: '',
                    status: '1',
                    orderNum: '',
                    title: '',
                    content: ''
                },
                quesAUDataRules: {
                    proName: [
                        { required: true, message: '请输入所属产品', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '请选择状态', trigger: 'blur' }
                    ],
                    orderNum: [
                        { required: true, message: '请输入排序号', trigger: 'blur' }
                    ],
                    title: [
                        { required: true, message: '请输入问题标题', trigger: 'blur' }
                    ],
                    content: [
                        { required: true, message: '请输入回答内容', trigger: 'blur' }
                    ],
                },
                statusArr: [
                    { label: '上架', value: 1 },
                    { label: '下架', value: 2 }
                ]
            }
        },
        methods: {
            showInit() {
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs['quesAUDataRef'].resetFields()
                })
                // 设置默认值
                if (this.quesAUDataForm.status == 1) {
                    this.quesAUDataForm.status = '上架'
                }
            },
            quesAUDataSubmit() {
                this.$refs['quesAUDataRef'].validate((valid) => {
                    if (valid) {
                        let status = this.quesAUDataForm.status;
                        status == "上架" ? (status = 1) : (status = status);
                        console.log(status)
                    }
                })
            },
            closeNewsSeeDialod() {
                this.visible = false;
            }
        }
    }

</script>

<style>


</style>