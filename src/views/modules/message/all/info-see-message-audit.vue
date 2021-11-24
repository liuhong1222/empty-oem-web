<template>
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="visible" class="el-dialog-enter" width="640px"
        @close="closeNewsAuditDialog">
        <el-form :model="seeAuditDataForm" ref="seeAuditDataFormRef" :rules="auditrules" label-width="150px"
            :label-position="labelPosition">
            <el-form-item label="消息标题：">
                <el-input v-model="seeAuditDataForm.title" placeholder="消息标题" readonly></el-input>
            </el-form-item>
            <el-form-item label="消息类别：">
                <el-input v-model="seeAuditDataForm.infoType" placeholder="消息类别" readonly></el-input>
            </el-form-item>
            <el-form-item label="发送对象：">
                <el-input type="textarea" v-model="seeAuditDataForm.sendObject" placeholder="发送对象" :rows="5" readonly></el-input>
            </el-form-item>
            <el-form-item label="消息内容：">
                <el-input type="textarea" v-model="seeAuditDataForm.messCon" placeholder="消息内容" :rows="5" readonly></el-input>
            </el-form-item>
            <el-form-item label="审核结果：" prop="resource" v-show="seeAuditShow">
                <el-radio-group v-model="seeAuditDataForm.resource" @change="auditChangeHandler">
                    <el-radio :label="3">通过</el-radio>
                    <el-radio :label="4">驳回</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="驳回原因：" prop="desc" v-if="auditDisable" v-show="seeAuditShow">
                <el-input type="textarea" v-model="seeAuditDataForm.desc"></el-input>
            </el-form-item>
            <el-form-item v-show="seeAuditShow">
                <el-button type="primary" :loading="submitLoading" @click="seeAuditDataFormBtn('seeAuditDataFormRef')">确定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>

    export default {
        data() {
            return {
                visible: false,
                auditDisable: false,
                seeAuditShow: false, //（查看和审核）显示或者隐藏 审核按钮，和确定按钮
                seeAuditDataForm: {
                    title: '',
                    infoType: '',
                    sendObject: '',
                    messCon: '',
                    resource: '',
                    desc: ''
                },
                dataForm: {
                    id: ''
                },
                title: '',
                labelPosition: 'right',
                auditrules: {
                    resource: [
                        { required: true, message: '请选择审核结果', trigger: 'change' }
                    ],
                    desc: [
                        { required: true, message: '请填写驳回原因', trigger: 'blur' }
                    ]
                },
                submitLoading: false
            }
        },
        methods: {
            showInit(record, type) {
                this.dataForm.id = record.id
                this.visible = true;
                this.submitLoading = false
                if (type == "see") {
                    this.title = "查看";
                    this.seeAuditShow = false;
                } else if (type == "audit") {
                    this.title = "审核";
                    this.seeAuditShow = true;
                }
                this.$http({
                    url: this.$http.adornUrl(`agent/message/all/detail?token=${this.$cookie.get('token')}&agentMessageId=${this.dataForm.id}`),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.seeAuditDataForm.title = data.data.title;
                        this.seeAuditDataForm.messCon = data.data.content;
                        this.seeAuditDataForm.infoType = data.data.noticeTypeName;
                        var str = "";
                        for (var i = 0; i < data.data.customerMobileList.length; i++) {
                            data.data.customerMobileList[i] += ','
                            if (i % 3 == 0 && i !== 0) {
                                str += "\n"
                            }
                            if (str.substr(0, 1) == '，')
                                str = str.substr(1);  //去掉第一个一个符号
                            str += data.data.customerMobileList[i];
                        }
                        str = str.slice(0, str.length - 1)  //去掉最后一个符号
                        this.seeAuditDataForm.sendObject = str
                    }
                })
                this.$nextTick(() => {
                    this.$refs['seeAuditDataFormRef'].resetFields();
                })
            },
            closeNewsAuditDialog() {
                this.auditDisable = false
                this.seeAuditDataForm.desc = ""
            },
            auditChangeHandler(val) {
                if (val == 4) {
                    this.auditDisable = true
                } else {
                    this.auditDisable = false
                }
            },
            seeAuditDataFormBtn(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.submitLoading = true
                        this.$http({
                            url: this.$http.adornUrl(`agent/message/all/audit?token=${this.$cookie.get('token')}&agentMessageId=${this.dataForm.id}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'auditState': this.seeAuditDataForm.resource,
                                'auditRemark': this.seeAuditDataForm.desc
                            })
                        }).then(({ data }) => {
                            this.submitLoading = false
                            if (data && data.code === 0) {
                                this.$message.success('操作成功!')
                                this.visible = false
                                this.$emit('auditRefreshDataList')
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                });
            }
        }
    }

</script>
<style lang="scss">
</style>