<template>
    <div>
        <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="visible" width="550px" :before-close="closeNewsSeeDialod">
            <el-form :model="quesAuditDataForm" label-width="100px" :rules="quesAuditDataRules" ref="quesAuditDataRef"
                class="demo-ruleForm">
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
                <el-form-item label="审核：" v-if="seeShow">
                    <el-input v-model="quesAuditDataForm.audit" readonly></el-input>
                </el-form-item>
                <el-form-item label="备注：" v-if="seeShow1">
                    <el-input type="textarea" v-model="quesAuditDataForm.seeDesc" readonly></el-input>
                </el-form-item>

                <!-- 审核 -->
                <el-form-item label="审核：" prop="resource" v-if="auditShow">
                    <el-radio-group v-model="quesAuditDataForm.resource" @change="auditChangeHandler">
                        <el-radio :label="3">通过</el-radio>
                        <el-radio :label="4">驳回</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="驳回原因：" prop="desc" v-if="auditDisable">
                    <el-input type="textarea" v-model="quesAuditDataForm.desc"></el-input>
                </el-form-item>
                <el-form-item v-if="showBnt">
                    <el-button type="primary" @click="quesAuditDataSubmit()">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>


<script>
    export default {
        data() {
            return {
                seeShow: false,
                seeShow1: false,
                auditShow: false,
                showBnt: false,
                title: '',
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
                    id: '',
                    auditStatus: ''
                },
                quesAuditDataRules: {
                    resource: [
                        { required: true, message: '请选择审核', trigger: 'blur' }
                    ],
                    desc: [
                        { required: true, message: '请输入驳回原因', trigger: 'blur' }
                    ],
                }
            }
        },
        methods: {
            showInit(id, stu) {
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs['quesAuditDataRef'].resetFields()
                })
                if (stu == "audit") {
                    this.title = "审核"
                    this.auditShow = true;
                    this.seeShow = false;
                    this.seeShow1 = false;
                    this.showBnt = true;
                } else {
                    this.title = "查看";
                    this.auditShow = false;
                    this.auditDisable = false;
                    this.seeShow = true;
                    this.seeShow1 = true;
                    this.showBnt = false;
                }
                this.$http({
                    url: this.$http.adornUrl(`agent/productFaq/all/detail?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'productFaqId': id + ''
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.quesAuditDataForm = {
                            id: id,
                            agentName: data.data.agentName,
                            belongPro: data.data.productName,
                            status: data.data.state,
                            sort: data.data.sort,
                            quesTitle: data.data.title,
                            quesCon: data.data.content,
                            audit: data.data.applyState,
                            seeDesc: data.data.remark,
                        }
                    }
                })
            },
            quesAuditDataSubmit() {
                this.$refs['quesAuditDataRef'].validate((valid) => {
                    if (valid) {
                        console.log(this.quesAuditDataForm.resource)
                        this.$http({
                            url: this.$http.adornUrl(`agent/productFaq/all/audit?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'productFaqId': this.quesAuditDataForm.id + '',
                                'auditState': this.quesAuditDataForm.resource,
                                'auditRemark': this.quesAuditDataForm.desc
                            })
                        }).then(({ data }) => {
                            if (data && data.code === 0) {
                                this.$message.success('成功')
                                this.visible = false
                                this.$emit('refreshNewsList')
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })
            },
            auditChangeHandler(val) {
                if (val == 1) {
                    this.auditDisable = false
                    this.quesAuditDataForm.desc = ""
                } else {
                    this.auditDisable = true
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