<template>
    <div>
        <el-dialog title="添加/编辑" :close-on-click-modal="false" :visible.sync="visible" width="550px" :before-close="closeNewsSeeDialod">
            <el-form :model="proLineAUDataForm" :rules="proLineAUDataRules" ref="proLineAUDataRef" label-width="110px"
                class="demo-ruleForm">
                <el-form-item label="产品线名称：" prop="proLineName">
                    <el-input v-model="proLineAUDataForm.proLineName"></el-input>
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                    <el-select v-model="proLineAUDataForm.status" placeholder="请选择审核状态">
                        <el-option v-for="(item,index) in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序：" prop="orderNum">
                    <el-input-number v-model="proLineAUDataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" plain @click="closeNewsSeeDialod">取消</el-button>
                    <el-button type="primary" @click="proLineAUSubmit()">确定</el-button>
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
                proLineAUDataForm: {
                    proLineName: '',
                    status: '1',
                    orderNum: ''
                },
                proLineAUDataRules: {
                    proLineName: [
                        { required: true, message: '请输入产品线名称', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '请选择状态', trigger: 'blur' }
                    ],
                    orderNum: [
                        { required: true, message: '请输入排序号', trigger: 'blur' }
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
                    this.$refs['proLineAUDataRef'].resetFields()
                })
                // 设置默认值
                if (this.proLineAUDataForm.status == 1) {
                    this.proLineAUDataForm.status = '上架'
                }
            },
            proLineAUSubmit() {
                this.$refs['proLineAUDataRef'].validate((valid) => {
                    if (valid) {
                        let status = this.proLineAUDataForm.status;
                        status == "上架" ? (status = 1) : (status = status);
                        console.log(status)
                        alert('验证通过');
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