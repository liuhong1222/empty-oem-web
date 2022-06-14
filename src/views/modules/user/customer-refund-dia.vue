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
                    <el-radio :label="2">国际检测</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="剩余条数：" prop="remainNumberTotal">
                <el-input style="width: 90%; margin-right: 8px;" v-model="dataForm.remainNumberTotal" disabled></el-input>
                <span>条</span>
            </el-form-item>
            <el-form-item label="可退条数：" prop="giftNumber">
                <el-input style="width: 90%; margin-right: 8px;" v-model="dataForm.giftNumber" disabled></el-input>
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
                <el-input-number v-model="dataForm.refundAmount" disabled :min="0"></el-input-number>
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
            <el-button type="primary" :loading="submitLoading" @click="handleSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        data() {
            const validateContainDot = (rule, value, callback) => {
                if (value && (value + '').indexOf('.') !== -1) {
                    callback(new Error('不可为小数'))
                } else {
                    callback()
                }
            }
            return {
                dialogVisible: false,
                submitLoading: false,
                labelPosition: 'right',
                dataForm: {
                    category: 0,
                    remainNumberTotal: '',
                    phone: '',
                    giftNumber: '',
                    refundNumber: '',
                    price: '',
                    refundAmount: '',
                    refundType: '',
                    remark: '',
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
                        { required: true, message: '请输入退款条数', trigger: 'blur' },
                        { validator: validateContainDot, trigger: 'blur' }
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
                        { required: false, message: '请输入备注', trigger: 'blur' }
                    ]
                },
                customerInfo: {},
            }
        },
        watch: {
            'dataForm.category'() {
                if (this.dataForm.category === 0) {
                    this.dataForm.remainNumberTotal = this.customerInfo.emptyCount
                    this.dataForm.giftNumber = this.customerInfo.refundableEmptyNum
                } else if (this.dataForm.category === 1) {
                    this.dataForm.remainNumberTotal = this.customerInfo.realtimeCount
                    this.dataForm.giftNumber = this.customerInfo.refundableRealTimeNum
                } else {
                    this.dataForm.remainNumberTotal = this.customerInfo.internationalCount
                    this.dataForm.giftNumber = this.customerInfo.refundableInternationalNum
                }
            },
            'dataForm.price'() {
                this.dataForm.refundAmount = (this.dataForm.refundNumber || 0) * (this.dataForm.price || 0)
            },
            'dataForm.refundNumber'() {
                this.dataForm.refundAmount = (this.dataForm.refundNumber || 0) * (this.dataForm.price || 0)
            },
        },
        methods: {
            init(record) {
                this.dialogVisible = true
                this.submitLoading = false
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    this.dataForm = {
                        category: 0,
                        custId: record.customerId ? record.customerId + '' : undefined
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
                        this.dataForm = {
                            ...this.dataForm,
                            phone: this.customerInfo.custPhone,
                            remainNumberTotal: this.customerInfo.emptyCount,
                            giftNumber: this.customerInfo.refundableEmptyNum,
                        }
                    }
                })
            },
            handleSubmit() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        const { refundNumber, giftNumber } = this.dataForm
                        if (refundNumber > giftNumber) {
                            this.$message.warning('退款条数不可超出可退条数')
                            return false
                        }
                        this.submitLoading = true
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
                            this.submitLoading = false
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