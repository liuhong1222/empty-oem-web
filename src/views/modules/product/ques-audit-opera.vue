<template>
    <div>
        <el-dialog title="审核/查看" :close-on-click-modal="false" :visible.sync="visible" width="550px" :before-close="closeNewsSeeDialod">
            <el-form :model="quesAuditDataForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="代理商名称：">
                    <el-input v-model="quesAuditDataForm.agentName" readonly></el-input>
                </el-form-item>
                <el-form-item label="所属产品：">
                    <el-input v-model="quesAuditDataForm.belongPro" readonly></el-input>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-input v-model="quesAuditDataForm.status" readonly></el-input>
                </el-form-item>
                <el-form-item label="排序：">
                    <el-input v-model="quesAuditDataForm.sort" readonly></el-input>
                </el-form-item>
                <el-form-item label="问题标题：">
                    <el-input v-model="quesAuditDataForm.quesTitle" readonly></el-input>
                </el-form-item>
                <el-form-item label="回答内容：">
                    <el-input type="textarea" v-model="quesAuditDataForm.quesCon" readonly></el-input>
                </el-form-item>
                <!-- 查看 -->
                <el-form-item label="审核：">
                    <el-input v-model="quesAuditDataForm.audit" readonly></el-input>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="quesAuditDataForm.seeDesc" readonly></el-input>
                </el-form-item>

                <!-- 审核 -->
                <el-form-item label="审核结果：" prop="resource">
                    <el-radio-group v-model="quesAuditDataForm.resource" @change="auditChangeHandler">
                        <el-radio :label="0">通过</el-radio>
                        <el-radio :label="1">驳回</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="驳回原因：" prop="desc" v-if="auditDisable">
                    <el-input type="textarea" v-model="quesAuditDataForm.desc"></el-input>
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
                quesAuditDataForm: {
                    agentName: '',
                    belongPro: '',
                    status: '',
                    sort: '',
                    quesTitle: '',
                    quesCon: '',
                    audit: '',
                    seeDesc: '',
                    resource: '',

                }
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
                    this.quesAuditDataForm.desc = ""
                }
            },
            closeNewsSeeDialod() {
                this.visible = false;
            }
        }
    }
</script>

<style>
</style>