<template>
    <div>
        <el-dialog title="审核产品线" :close-on-click-modal="false" :visible.sync="visible" width="550px" :before-close="closeNewsSeeDialod">
            <el-form :model="proLineDataForm" label-width="100px" :rules="proLineDataRules" ref="proLineDataRef" class="demo-ruleForm">
                <el-form-item label="代理商名称：">
                    <el-input v-model="proLineDataForm.agentName" readonly></el-input>
                </el-form-item>
                <el-form-item label="产品线名称：">
                    <el-input v-model="proLineDataForm.proLineName" readonly></el-input>
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                    <el-input v-model="proLineDataForm.status" readonly></el-input>
                </el-form-item>
                <el-form-item label="排序：" prop="orderNum">
                    <el-input v-model="proLineDataForm.orderNum" readonly></el-input>
                </el-form-item>
                <el-form-item label="审核：" prop="resource">
                    <el-radio-group v-model="proLineDataForm.resource" @change="auditChangeHandler">
                        <el-radio :label="3">通过</el-radio>
                        <el-radio :label="4">驳回</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="驳回原因：" prop="desc" v-if="auditDisable">
                    <el-input type="textarea" v-model="proLineDataForm.desc"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="proLineDataSubmit()">确定</el-button>
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
                    desc: '',
                    id: ''
                },
                proLineDataRules: {
                    resource: [
                        { required: true, message: '请选择审核', trigger: 'blur' }
                    ],
                    desc: [
                        { required: true, message: '请输入驳回原因', trigger: 'blur' }
                    ],
                },
            }
        },
        methods: {
            showInit(id) {
                this.proLineDataForm.id = id;
                this.visible = true;
                this.auditDisable = false
                this.$nextTick(() => {
                    this.$refs['proLineDataRef'].resetFields()
                })
                this.$http({
                    url: this.$http.adornUrl(`agent/line/findById?token=${this.$cookie.get('token')}&id=${this.proLineDataForm.id}`),
                    method: 'post',
                    params: this.$http.adornParams()
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.proLineDataForm.agentName = data.data.agentName;
                        this.proLineDataForm.proLineName = data.data.productGroupName;
                        this.proLineDataForm.status = data.data.state == 1 ? '上架' : '下架';
                        this.proLineDataForm.orderNum = data.data.sort;
                    }
                })
            },
            proLineDataSubmit() {
                this.$refs['proLineDataRef'].validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: this.$http.adornUrl(`agent/line/updateStatus?token=${this.$cookie.get('token')}&id=${this.proLineDataForm.id}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'status': this.proLineDataForm.resource,
                                'remark': this.proLineDataForm.desc
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
                if (val == 4) {
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