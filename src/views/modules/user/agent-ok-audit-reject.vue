<template>
    <div class="mainAess">
        <el-dialog title="审核" :visible.sync="dialogVisible" width="1000px" @close="closeDialog">
            <agent-setting-detail ref="detailRef" />
            <el-form :model="auditruleForm" :rules="auditrules" ref="auditruleForm" label-width="100px" class="demo-ruleForm"
                style="margin-top:30px">
                <el-form-item label="审核结果：" prop="resource">
                    <el-radio-group v-model="auditruleForm.resource" @change="auditChangeHandler">
                        <el-radio :label="9">通过</el-radio>
                        <el-radio :label="1">驳回</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="驳回原因：" prop="desc" v-if="auditDisable">
                    <el-input type="textarea" v-model="auditruleForm.desc"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="submitLoading" @click="auditSubmitForm('auditruleForm')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import AgentSettingDetail from '@/components/agent-setting-detail/index.vue'
    export default {
        components: {
            AgentSettingDetail
        },
        data() {
            return {
                agentSettingInfo: {},
                agentId: "",
                auditDisable: false,
                submitLoading: false,
                dialogVisible: false,
                labelPosition: 'right',
                auditruleForm: {
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
                }
            }
        },
        methods: {
            seeInit({ agentId }) {
                this.dialogVisible = true
                this.agentId = agentId + '';
                this.submitLoading = false
                this.$http({
                    url: this.$http.adornUrl(`agent/set/findBasicInfo?token=${this.$cookie.get('token')}&agentId=${agentId}`),
                    method: 'post',
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        const { agentSetInfo } = (data.data || {})
                        this.agentSettingInfo = agentSetInfo || {}
                        this.$refs.detailRef.init(this.agentSettingInfo)
                    }
                })

                this.$nextTick(() => {
                    this.$refs['auditruleForm'].resetFields();
                })
            },
            closeDialog() {
                this.auditDisable = false
            },
            auditChangeHandler(val) {
                if (val == 1) {
                    this.auditDisable = true
                } else {
                    this.auditDisable = false
                    this.auditruleForm.desc = ""
                }
            },

            // 提交通过/驳回
            auditSubmitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.submitLoading = true
                        this.$http({
                            url: this.$http.adornUrl(`agent/set/audit?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'agentId': this.agentId,
                                'remark': this.auditruleForm.desc,
                                state: this.auditruleForm.resource
                            })
                        }).then(({ data }) => {
                            this.submitLoading = false
                            if (data && data.code === 0) {
                                this.$message.success('操作成功!')
                                this.dialogVisible = false
                                this.$emit('auditRefreshDataList')
                            } else {
                                this.$message.error(data.msg)

                            }
                        })
                    }
                });
            },
        }
    }

</script>

<style lang="scss">
</style>