<template>
    <el-dialog title="转代理商" :visible.sync="transferVisible" width="40%" @close="closeTrsdialog">
        <el-form ref="transferFormRef" :model="transferForm" :rules="transferFormRules" label-width="120px">
            <el-form-item label="手机号：" class="seecuslog">
                <el-input v-model="transferForm.mobile" readonly></el-input>
            </el-form-item>
            <el-form-item label="注册时间：" class="seecuslog">
                <el-input v-model="transferForm.createTime" readonly></el-input>
            </el-form-item>
            <el-form-item label="当前代理商：" class="seecuslog">
                <el-input v-model="transferForm.currAgent" readonly></el-input>
            </el-form-item>
            <!-- <el-form-item label="转入代理商：" prop="transferAgent">
                <el-input v-model="transferForm.transferAgent"></el-input>
            </el-form-item> -->
            <el-form-item label="转入代理商：" prop="transferAgent">
                <!-- <el-autocomplete style="width:100%" class="inline-input" v-model="transferForm.transferAgent"
                    :fetch-suggestions="querySearch" placeholder="请输入需要转入的代理商"></el-autocomplete> -->
                <el-select
                    v-model="transferForm.transferAgent"
                    filterable
                    remote
                    style="width:100%"
                    clearable
                    reserve-keyword
                    placeholder="请输入代理商名称"
                    :remote-method="getAgentList"
                    :loading="agentSearchLoading"
                >
                    <el-option
                        v-for="(item, index) in agentList"
                        :key="index"
                        :label="item.companyName"
                        :value="item.id + ''"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="transferForm.remark" placeholder="请输入备注..."></el-input>
            </el-form-item>
            <!-- <el-form-item>
                <el-autocomplete style="width:100%" class="inline-input" v-model="inputName" :fetch-suggestions="querySearch"
                    placeholder="请输入文件名"></el-autocomplete>
            </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="transferVisible = false">取 消</el-button>
            <el-button type="primary" :loading="submitLoading" @click="submitTransAgent()">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    export default {
        data() {
            return {
                transferVisible: false,
                submitLoading: false,
                inputName: '',
                csvList: [],
                csvS: [],
                transferForm: {
                    mobile: '',
                    createTime: '',
                    currAgent: '',
                    transferAgent: '',
                    remark: '',
                    creUserId: ''
                },
                transferFormRules: {
                    transferAgent: [
                        { required: true, message: '请输入需要转入的代理商', trigger: 'change' }
                    ],
                },
                agentList: [],
                agentSearchLoading: false,
            }
        },

        watch: {
            // 'transferForm.transferAgent'() {
            //     this.getAgentList()
            // }

        },
        methods: {
            transferAgentInit(row) {
                this.transferVisible = true;
                this.submitLoading = false
                this.$nextTick(() => {
                    this.$refs['transferFormRef'].resetFields();
                })
                this.transferForm = {
                    transferAgent: '',
                    creUserId: row.customerId,
                    mobile: row.phone,
                    createTime: row.createTime,
                    currAgent: row.companyName,
                    remark: ''
                }
                this.getAgentList()
            },
            // 转代理商
            submitTransAgent() {
                this.$refs['transferFormRef'].validate((valid) => {
                    if (valid) {
                        this.submitLoading = true
                        this.$http({
                            url: this.$http.adornUrl(`agent/user/changeAgent?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            data: ({
                                'customerId': this.transferForm.creUserId + '',
                                // 'outAgentName': this.transferForm.currAgent,
                                'destAgentId': this.transferForm.transferAgent,
                                'remark': this.transferForm.remark
                            })
                        }).then(({ data }) => {
                            this.submitLoading = false
                            if (data && data.code === 0) {
                                this.transferVisible = false
                                this.$emit('refreshDataList')
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1500
                                })
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                    }
                })
            },
            // 获取代理商列表
            getAgentList(name) {
                this.agentSearchLoading = true
                this.$http({
                    url: this.$http.adornUrl(`agent/agentInfo/listAgent?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        name: name || undefined
                    })
                }).then(({ data }) => {
                    this.agentSearchLoading = false
                    if (data && data.code === 0) {
                        this.agentList = data.data || []
                    } else {
                        this.agentList = []
                    }
                })
            },
            closeTrsdialog() {
                this.inputName = "";
                this.transferForm.remark = ""
            },
            querySearch(queryString, cb) {
                var csvS = this.csvS;
                cb(csvS);
            }
        }
    }
</script>
<style>
</style>