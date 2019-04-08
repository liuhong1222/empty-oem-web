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
                <el-autocomplete style="width:100%" class="inline-input" v-model="transferForm.transferAgent"
                    :fetch-suggestions="querySearch" placeholder="请输入需要转入的代理商"></el-autocomplete>
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
            <el-button type="primary" @click="submitTransAgent()">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    export default {
        data() {
            return {
                transferVisible: false,
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
                        { required: true, message: '请输入需要转入的代理商', trigger: 'blur' }
                    ],
                }
            }
        },

        watch: {
            'transferForm.transferAgent'() {

                this.csvS = [];//这是定义好的用于存放下拉提醒框中数据的数组
                this.$http({
                    url: this.$http.adornUrl(`agent/user/findCompanyName?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        'inAgentName': this.transferForm.transferAgent
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.csvList = data.data.list
                        var len = this.csvList.length;
                        var arr = [];
                        for (var i = 0; i < len; i++) { //根据输入框中inputName的值进行模糊匹配
                            if (this.csvList[i].indexOf(this.transferForm.transferAgent) >= 0) {
                                arr.push(this.csvList[i]);//符合条件的值都放入arr中
                            }
                        }
                        //el-autocomplete元素要求数组内是对象
                        for (var i = 0; i < arr.length; i++) {
                            var obj = { value: "" };
                            obj.value = arr[i];
                            this.csvS.push(obj);
                        }
                    } else {
                        this.$message.error(data.msg);
                    }
                })
            }

        },
        methods: {
            transferAgentInit(row) {
                // console.log(row.creUserId)
                this.transferForm.creUserId = row.creUserId
                this.transferForm.mobile = row.user_phone;
                this.transferForm.createTime = row.create_time;
                this.transferForm.currAgent = row.company_name
                this.transferVisible = true;
                this.$nextTick(() => {
                    this.$refs['transferFormRef'].resetFields();
                })
            },
            // 转代理商
            submitTransAgent() {
                this.$refs['transferFormRef'].validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: this.$http.adornUrl(`agent/user/changeAgent?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'creUserId': this.transferForm.creUserId,
                                'outAgentName': this.transferForm.currAgent,
                                'inAgentName': this.transferForm.transferAgent,
                                'remark': this.transferForm.remark
                            })
                        }).then(({ data }) => {
                            if (data && data.code === 0) {
                                // console.log(data)
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1500,
                                    onClose: () => {
                                        this.transferVisible = false
                                        this.$emit('refreshDataList')
                                    }
                                })
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
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