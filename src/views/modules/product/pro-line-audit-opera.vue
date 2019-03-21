<template>
    <div>
        <el-dialog title="审核" :close-on-click-modal="false" :visible.sync="visible" width="550px" :before-close="closeNewsSeeDialod">
            <el-form :model="proLineDataForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="代理商名称：">
                    <el-input v-model="proLineDataForm.agentName" readonly></el-input>
                </el-form-item>
                <el-form-item label="产品线名称：">
                    <el-input v-model="proLineDataForm.proLineName" readonly></el-input>
                </el-form-item>
                <el-form-item label="审核状态：">
                    <el-select v-model="proLineDataForm.status" placeholder="请选择审核状态">
                        <el-option v-for="(item,index) in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序：">
                    <el-input-number v-model="proLineDataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
                </el-form-item>
                <el-form-item label="审核结果：" prop="resource">
                    <el-radio-group v-model="proLineDataForm.resource" @change="auditChangeHandler">
                        <el-radio :label="0">通过</el-radio>
                        <el-radio :label="1">驳回</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="驳回原因：" prop="desc" v-if="auditDisable">
                    <el-input type="textarea" v-model="proLineDataForm.desc"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">确定</el-button>
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
                auditDisable: false,
                proLineDataForm: {
                    agentName: '',
                    proLineName: '',
                    status: '',
                    orderNum: '',
                    resource: '',
                    desc: ''
                },
                statusArr: [
                    { label: '上架', value: 1 },
                    { label: '下架', value: 2 }
                ],
            }
        },
        methods: {
            showInit() {
                this.visible = true;
            },
            auditChangeHandler(val) {
                if (val == 1) {
                    this.auditDisable = true
                } else {
                    this.auditDisable = false
                    this.proLineDataForm.desc = ""
                }
            },
            closeNewsSeeDialod() {
                this.visible = false
            }
        }
    }
</script>

<style></style>