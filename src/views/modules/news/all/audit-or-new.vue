<template>
    <div class="auditSee">
        <el-dialog :title="title" :visible.sync="dialogVisible" width="1078px" @close="closeNewsAuditDialog">
            <el-form :model="auditnewsSeeForm" ref="auditnewsSeeForm" label-width="100px" :rules="auditrules" class="demo-ruleForm">
                <el-form-item label="新闻标题:">
                    <el-input v-model="auditnewsSeeForm.newsTitle" readonly></el-input>
                </el-form-item>
                <el-form-item label="新闻内容:">
                    <UE v-bind:defaultMsg="defaultMsgCon" :config=config ref="ue"></UE>
                </el-form-item>
                <el-form-item label="审核结果：" prop="resource" style="margin-left: 30px" v-show="seeAuditShow">
                    <el-radio-group v-model="auditnewsSeeForm.resource" @change="auditChangeHandler">
                        <el-radio :label="1">通过</el-radio>
                        <el-radio :label="3">驳回</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="驳回原因：" prop="desc" v-if="auditDisable" style="margin-left: 30px" v-show="seeAuditShow">
                    <el-input type="textarea" v-model="auditnewsSeeForm.desc"></el-input>
                </el-form-item>
                <el-form-item style="margin-left: 30px" v-show="seeAuditShow">
                    <el-button type="primary" @click="auditSubmitForm('auditnewsSeeForm')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import UE from '../../../../components/ue/ue2.vue';
    export default {
        components: { UE },
        data() {
            return {
                dialogVisible: false,
                auditDisable: false,
                seeAuditShow: false, //（查看和审核）显示或者隐藏 审核按钮，和确定按钮
                auditnewsSeeForm: {
                    newsTitle: '',
                    resource: '',
                    desc: ''
                },
                auditrules: {
                    resource: [
                        { required: true, message: '请选择审核结果', trigger: 'change' }
                    ],
                    desc: [
                        { required: true, message: '请填写驳回原因', trigger: 'blur' }
                    ]
                },
                dataForm: {
                    id: ''
                },
                title: '',
                defaultMsgCon: '',
                config: {
                    initialFrameWidth: '100%',
                    initialFrameHeight: 350,
                    autoFloatEnabled: false,
                    toolbars: [],
                    readonly: true,
                    elementPathEnabled: false,
                    // serverUrl: 'http://172.16.4.242:9999/open/agent/ueditor?token=' + `${this.$cookie.get('token')}`
                },
            };
        },
        methods: {
            auditShowInit(id, type) {
                this.dataForm.id = id
                this.dialogVisible = true
                if (type == "see") {
                    this.title = "查看";
                    this.seeAuditShow = false;
                } else if (type == "audit") {
                    this.title = "审核";
                    this.seeAuditShow = true;
                }
                this.$http({
                    url: this.$http.adornUrl(`agent/news/all/detail?token=${this.$cookie.get('token')}&newsId=${this.dataForm.id}`),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.auditnewsSeeForm.newsTitle = data.data.title || '';
                        this.defaultMsgCon = data.data.content || '';
                    }
                })
                this.$nextTick(() => {
                    this.$refs['auditnewsSeeForm'].resetFields();
                })
            },
            closeNewsAuditDialog() {
                this.auditDisable = false;
                this.defaultMsgCon = "";  //清空重新赋值

            },
            auditChangeHandler(val) {
                if (val == 3) {
                    this.auditDisable = true
                } else {
                    this.auditDisable = false
                    this.auditnewsSeeForm.desc = ""
                }
            },
            // 提交审核
            auditSubmitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: this.$http.adornUrl(`agent/news/all/audit?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'newsId': this.dataForm.id,
                                'auditState': this.auditnewsSeeForm.resource,
                                'auditRemark': this.auditnewsSeeForm.desc
                            })
                        }).then(({ data }) => {
                            if (data && data.code === 0) {
                                this.$message.success('操作成功!')
                                this.dialogVisible = false
                                this.$emit('auditRefreshDataList', 1)
                            } else {
                                this.$message.error(data.msg)

                            }
                        })
                    }
                });
            },

        }
    };
</script>
<style>
    .auditSee .edui-default .edui-editor-bottomContainer {
        display: none;
    }

    .auditSee .el-input,
    .auditSee .el-input__inner {
        width: 100%;
    }

    .auditSee #editor2 {
        margin-top: 7px;
    }
</style>