<template>
    <div>
        <el-dialog title="退款" :visible.sync="refundVisible" width="52%">
            <el-form :model="refundDataForm" :rules="refunddatarules" ref="refundDataFormRef" label-width="150px"
                :label-position="labelPosition">
                <el-form-item label="手机号码：" prop="mobile">
                    <el-input v-model="refundDataForm.mobile" placeholder="手机号码" id="mobile" readonly></el-input>
                </el-form-item>
                <!-- <el-form-item label="客户名称：" >
                    <el-input v-model="refundDataForm.custNanme" placeholder="客户名称" id="custNanme" readonly></el-input>
                </el-form-item> -->
                <el-form-item label="剩余条数：" prop="refunCounts">
                    <el-input v-model="refundDataForm.refunCounts" placeholder="剩余条数" id="refunCounts" readonly></el-input>
                </el-form-item>
                <el-form-item label="可退条数：" prop="refundableCounts">
                    <el-input v-model="refundDataForm.refundableCounts" placeholder="可退条数" id="refundableCounts" readonly></el-input>
                </el-form-item>
                <el-form-item label="退款条数：" prop="refunNumber">
                    <el-input style="width: 90%; margin-right: 8px;" v-model="refundDataForm.refunNumber" placeholder="退款条数不能大于剩余条数"></el-input>
                    <span>条</span>
                </el-form-item>
                <el-form-item label="单价：" prop="refunPrice">
                    <el-input style="width: 90%; margin-right: 8px;" v-model="refundDataForm.refunPrice" placeholder="单价"></el-input>
                    <span>元/条</span>
                </el-form-item>
                <el-form-item label="退款金额：" prop="refunMoney">
                    <el-input style="width: 90%; margin-right: 8px;" v-model="refundDataForm.refunMoney" placeholder="根据条数和单价，自动计算退款金额" id="refunMoney" readonly ></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item label="备注：" prop="desc">
                    <el-input type="textarea" v-model="refundDataForm.desc" placeholder="备注..."></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="refundVisible = false">取 消</el-button>
                <el-button type="primary" @click="refundDataFormTrue" :disabled="disabled">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
    export default {
        data() {
            return {
                refundVisible: false,
                labelPosition: 'right',
                disabled: false,
                refundDataForm: {
                    mobile: '',
                    custNanme: '',
                    refunCounts: '',
                    refundableCounts: '',
                    refunNumber: '',
                    refunPrice: '',
                    refunMoney: '',
                    desc: ''
                },
                refunddatarules: {
                    mobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' }
                    ],
                    // custNanme: [
                    //     { required: true, message: '请输入客户名称', trigger: 'blur' }
                    // ],
                    refunCounts: [
                        { required: true, message: '请输入剩余条数', trigger: 'blur' }
                    ],
                    refundableCounts: [
                        { required: true, message: '可退条数', trigger: 'blur' }
                    ],
                    refunNumber: [
                        { required: true, message: '请输入退款条数', trigger: 'blur' }

                    ],
                    refunPrice: [
                        { required: true, message: '请输入单价', trigger: 'blur' }

                    ],
                    refunMoney: [
                        { required: true, message: '根据条数和单价，自动计算退款金额', trigger: 'blur' }

                    ],
                },

            }
        },
        watch: {
            refundDataForm: {
                handler: function (val, oldval) {
                    if (this.refundDataForm.refunNumber > this.refundDataForm.refundableCounts) {
                        this.$message.error('退款条数不能大于可退条数');
                        this.refundDataForm.refunMoney = ""
                        this.refundDataForm.refunPrice = ""
                        return;
                    }
                    if (this.refundDataForm.refunNumber !== "" && this.refundDataForm.refunPrice !== "") {
                        if (isNaN(Number(this.refundDataForm.refunNumber) * (this.refundDataForm.refunPrice))) {
                            this.refundDataForm.refunMoney = "";
                            this.$message.error('格式不正确!')
                            return
                        } else {
                            this.refundDataForm.refunMoney = Number(this.refundDataForm.refunNumber) * (this.refundDataForm.refunPrice);
                        }

                    } else {
                        this.refundDataForm.refunMoney = ""
                    }

                },
                deep: true
            }
        },
        methods: {
            packagePro() {
                this.$http({
                    url: this.$http.adornUrl(`agent/cust/getCustInfo?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'creUserId': this.refundDataForm.creUserId,
                        'custName': this.refundDataForm.userName
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.refundDataForm.mobile = data.data.mobile
                        this.refundDataForm.custNanme = data.data.custName
                        this.refundDataForm.refunCounts = data.data.account
                        this.refundDataForm.refundableCounts = data.data.refundableAccount  //可退条数

                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            refundInit(arr) {
                // console.log(arr[0])
                // console.log(arr[1])

                this.refundDataForm.creUserId = arr[2]
                this.refundDataForm.userName = arr[3]
                // console.log(this.refundDataForm.userName)
                // console.log(this.refundDataForm.creUserId)
                if (arr[1] == 0 || arr[1] == null) {  //个人
                    this.refundVisible = true
                    this.packagePro()
                    this.$nextTick(() => {
                        this.$refs['refundDataFormRef'].resetFields()
                    })
                } else { //企业
                    this.refundVisible = true
                    this.packagePro()
                    this.$nextTick(() => {
                        this.$refs['refundDataFormRef'].resetFields()
                    })
                }
            },
            refundDataFormTrue() {
                this.$refs['refundDataFormRef'].validate((valid) => {
                    if (valid) {
                        // console.log('表单验证通过')
                        this.$confirm('确认要退款吗？')
                            .then(_ => {
                                this.refundSubmit()
                            })
                            .catch(_ => { })
                    }
                })
            },
            refundSubmit() {
                this.$http({
                    url: this.$http.adornUrl(`agent/cust/refunds?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'creUserId': this.refundDataForm.creUserId,
                        'number': this.refundDataForm.refunNumber,
                        'amount': this.refundDataForm.refunMoney,
                        'remark': this.refundDataForm.desc
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.disabled = true
                        this.$message({
                            message: '退款成功',
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.refundVisible = false
                                this.disabled = false
                                this.refundDataForm.desc = ""
                                this.$emit('refreshDataList')
                            }
                        })
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            }
        }
    }

</script>
<style>
    #mobile,
    #custNanme,
    #refunCounts,
    #refundableCounts,
    #refunMoney {
        border: none
    }
</style>