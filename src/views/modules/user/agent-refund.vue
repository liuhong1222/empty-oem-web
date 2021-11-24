<template>
    <el-dialog :destroy-on-close="true" width="600px" :title="'退款'" :close-on-click-modal="false" :visible.sync="dialogVisible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" :label-position="labelPosition" label-width="123px" class="cf">
            <el-form-item label="代理商名称：" prop="agentName">
                <el-input v-model="dataForm.agentName" disabled placeholder="请输代理商名称"></el-input>
            </el-form-item>
            <el-form-item label="产品名称：" prop="category">
                <el-radio-group v-model="dataForm.category">
                    <el-radio :label="0">空号检测</el-radio>
                    <el-radio :label="1">实时检测</el-radio>
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
                    <el-option v-for="item in refundWayOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
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
            return {
                dialogVisible: false,
                submitLoading: false,
                labelPosition: 'right',
                dataForm: {
                    agentName: '',
                    category: 0,
                    remainNumberTotal: undefined,
                    giftNumber: undefined,
                    refundNumber: undefined,
                    price: undefined,
                    refundAmount: undefined,
                    refundType: undefined,
                    remark: undefined,
                },
                dataRule: {
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
                        { required: true, message: '请输入退款条数', trigger: 'change' }
                    ],
                    price: [
                        { required: true, message: '请输入单价', trigger: 'change' }
                    ],
                    refundAmount: [
                        { required: true, message: '请输入退款金额', trigger: 'change' }
                    ],
                    refundType: [
                        { required: true, message: '请选择退款方式', trigger: 'change' }
                    ],
                    remark: [
                        { required: true, message: '请输入备注', trigger: 'blur' }
                    ]
                },
                agentRefundInfo: {},
                refundWayOptions: [
                    { label: '对公转账', value: 0 },
                    { label: '支付宝扫码付', value: 1 },
                    { label: '注册赠送', value: 2 },
                    { label: '赠送', value: 3 },
                    { label: '对公支付宝转账', value: 4 },
                    { label: '对私支付宝', value: 5 },
                    { label: '对私微信', value: 6 },
                    { label: '对私转账', value: 7 },
                ],
            }
        },
        watch: {
            'dataForm.refundNumber'() {
                if (this.dataForm.refundNumber !== undefined && this.dataForm.price !== undefined) {
                    this.dataForm.refundAmount = this.dataForm.refundNumber * this.dataForm.price
                } else {
                    this.dataForm.refundAmount = undefined
                }
            },
            'dataForm.price'() {
                if (this.dataForm.refundNumber !== undefined && this.dataForm.price !== undefined) {
                    this.dataForm.refundAmount = this.dataForm.refundNumber * this.dataForm.price
                } else {
                    this.dataForm.refundAmount = undefined
                }
            },
            'dataForm.category' () {
                if (this.dataForm.category) { // 实时检测
                    this.dataForm.remainNumberTotal = this.agentRefundInfo.refundableRealtime || 0
                    this.dataForm.giftNumber = this.agentRefundInfo.refundableRealtime || 0
                } else { // 空号检测
                    this.dataForm.remainNumberTotal = this.agentRefundInfo.refundableEmpty || 0
                    this.dataForm.giftNumber = this.agentRefundInfo.refundableEmpty || 0
                }
            }
        },
        methods: {
            init(record) {
                this.dialogVisible = true
                this.submitLoading = false
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    this.dataForm = {
                        category: 0,
                        agentName: record.companyName,
                        id: record.id + '',
                        remainNumberTotal: undefined,
                        giftNumber: undefined,
                        refundNumber: undefined,
                        price: undefined,
                        refundAmount: undefined,
                        refundType: undefined,
                        remark: undefined,
                    }
                    this.getRefundData(record);
                })
            },
            getRefundData(record) {
                this.$http({
                    url: this.$http.adornUrl(`agent/agentInfo/getRefundableNumOfAgent?token=${this.$cookie.get('token')}&custId=${record.customerId}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        agentId: record.id + ''
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.agentRefundInfo = data.data || {}
                        this.dataForm.remainNumberTotal = this.agentRefundInfo.refundableEmpty || 0
                        this.dataForm.giftNumber = this.agentRefundInfo.refundableEmpty || 0
                    }
                })
            },
            handleSubmit() {
                if (this.dataForm.refundNumber > this.dataForm.giftNumber) {
                    this.$message.warning('退款条数不可超过可退条数')
                    return false
                }
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.submitLoading = true
                        this.$http({
                            url: this.$http.adornUrl(`agent/agentInfo/refundOfAgent?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'agentId': this.dataForm.id,
                                'name': this.dataForm.agentName,
                                'price': this.dataForm.price,
                                'refundNumber': this.dataForm.refundNumber,
                                'refundAmount': this.dataForm.refundAmount,
                                'refundType': this.dataForm.refundType,
                                'category': this.dataForm.category,
                                'remark': this.dataForm.remark,
                            })
                        }).then(({ data }) => {
                            this.submitLoading = false
                            if (data && data.code === 0) {
                                this.dialogVisible = false
                                this.$emit('refresh')
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1500,
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