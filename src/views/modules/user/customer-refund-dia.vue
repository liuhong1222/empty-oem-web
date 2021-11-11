<template>
    <el-dialog :destroy-on-close="true" :title="'退款'" width="600px" :close-on-click-modal="false" :visible.sync="dialogVisible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" :label-position="labelPosition" label-width="123px" class="cf">
            <el-form-item label="手机号码：" prop="phone">
                <el-input v-model="dataForm.phone" disabled placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item label="产品名称：" prop="category">
                <el-radio-group v-model="dataForm.category">
                    <el-radio :label="0">空号检测</el-radio>
                    <el-radio :label="1">实时检测</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="剩余条数：" prop="remainNumberTotal">
                <el-input v-model="dataForm.remainNumberTotal" disabled></el-input>
                <span>条</span>
            </el-form-item>
            <el-form-item label="可退条数：" prop="giftNumber">
                <el-input v-model="dataForm.giftNumber" disabled></el-input>
                <span>条</span>
            </el-form-item>
            <el-form-item label="退款条数：" prop="refundNumber">
                <el-input-number v-model="dataForm.refundNumber" :min="0"></el-input-number>
                <span>条</span>
            </el-form-item>
            <el-form-item label="单价：" prop="price">
                <el-input-number v-model="dataForm.price" :min="0"></el-input-number>
                <span>元/条</span>
            </el-form-item>
            <el-form-item label="退款金额：" prop="refundAmount">
                <el-input-number v-model="dataForm.refundAmount" :min="0"></el-input-number>
                <span>元</span>
            </el-form-item>
            <el-form-item label="退款方式：" prop="refundType">
                <el-select style="width: 100%;" v-model="dataForm.refundType" placeholder="请选择退款方式">
                    <el-option label="对公转账" value="0"></el-option>
                    <el-option label="支付宝" value="1"></el-option>
                    <el-option label="其他" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" :rows="3" v-model="dataForm.remark" placeholder="请输入备注"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary"  @click="handleSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        data() {
            return {
                dialogVisible: false,
                labelPosition: 'right',
                dataForm: {
                    category: 0,
                },
                dataRule: {
                    phone: [
                        { required: true, message: '请输入手机号码', trigger: 'blur' }
                    ],
                    category: [
                        { required: true, message: '请选择产品名称', trigger: 'blur' }
                    ],
                    remainNumberTotal: [
                        { required: true, message: '请输入剩余条数', trigger: 'blur' }
                    ],
                    giftNumber: [
                        { required: true, message: '请输入可退条数', trigger: 'blur' }
                    ],
                    refundNumber: [
                        { required: true, message: '请输入退款条数', trigger: 'blur' }
                    ],
                    price: [
                        { required: true, message: '请输入单价', trigger: 'blur' }
                    ],
                    refundAmount: [
                        { required: true, message: '请输入退款金额', trigger: 'blur' }
                    ],
                    refundType: [
                        { required: true, message: '请选择退款方式', trigger: 'blur' }
                    ],
                    remark: [
                        { required: true, message: '请输入备注', trigger: 'blur' }
                    ]
                },
                customerInfo: {},
            }
        },
        watch: {
            'dataForm.category'() {
                if (this.dataForm.category === 0) {
                    this.dataForm.price = this.customerInfo.xxx
                } else {
                    this.dataForm.price = this.customerInfo.xxx
                }
            }
        },
        methods: {
            init(record) {
                this.dialogVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    this.dataForm = {
                        category: 0,
                        custId: record.customerId || undefined
                    }
                    this.getDetailData(record);
                })
            },
            getDetailData(record) {
                this.$http({
                    url: this.$http.adornUrl(`agent/cust/getCustInfo?token=${this.$cookie.get('token')}&custId=${record.customerId}`),
                    method: 'post',
                    params: this.$http.adornParams({})
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.customerInfo = data.data || {}
                        this.dataForm.price = this.customerInfo.xxx
                        this.dataForm.phone = this.customerInfo.phone
                        this.dataForm.remainNumberTotal = this.customerInfo.remainNumberTotal
                        this.dataForm.giftNumber = this.customerInfo.giftNumber
                    }
                })
            },
            handleSubmit() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: this.$http.adornUrl(`agent/cust/refunds?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                custId: this.dataForm.custId,
                                price: this.dataForm.price,
                                number: this.dataForm.refundNumber,
                                amount: this.dataForm.refundAmount,
                                remark: this.dataForm.remark,
                                category: this.dataForm.category,
                                refundType: this.dataForm.refundType,
                                openingBalance: this.dataForm.remainNumberTotal,
                                type: 2, // 1 充值 2 退款
                            })
                        }).then(({ data }) => {
                            if (data && data.code === 0) {
                                this.dialogVisible = false
                                this.$emit('refresh')
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1500
                                })
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })

            }
        }
    }

</script>

<style lang="scss">
    .el-form-item__content {
        margin-left: 0
    }
</style>