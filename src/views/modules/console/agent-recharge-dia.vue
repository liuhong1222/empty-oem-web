<template>
    <el-dialog :destroy-on-close="true" :title="'充值'" width="520px" :close-on-click-modal="false" :visible.sync="dialogVisible">
        <el-form v-if="!showPayCode" :model="dataForm" :rules="dataRule" ref="dataForm" :label-position="labelPosition" label-width="123px" class="cf">
            <el-form-item label="产品名称：" prop="category">
                <el-radio-group v-model="dataForm.category" disabled>
                    <el-radio :label="0">空号检测</el-radio>
                    <el-radio :label="1">实时检测</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="充值单价：" prop="price">
                <el-input-number v-model="dataForm.price" disabled :min="0"></el-input-number>
                <span>元</span>
            </el-form-item>
            <el-form-item label="充值金额：" prop="money">
                <el-input-number v-model="dataForm.money" :min="0"></el-input-number>
                <span>万元</span>
            </el-form-item>
            <el-form-item label="充值条数：" prop="count">
                <el-input-number v-model="dataForm.count" disabled :min="0"></el-input-number>
                <span>万条</span>
            </el-form-item>
            <el-form-item label="入账类型：" prop="payType">
                <el-select style="width: 100%;" disabled v-model="dataForm.payType" placeholder="请选择入账类型">
                    <el-option v-for="item in rechargeWayOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" :rows="3" v-model="dataForm.remark" placeholder="请输入备注"></el-input>
            </el-form-item>
        </el-form>
        <div v-else class="pay-code-wrapper">
            <!-- <img :src="payCodeUrl" /> -->
            <div id="qrcode"></div>
            <span>请打开支付宝扫描二维码</span>
        </div>
        <span slot="footer" class="dialog-footer">
            <template v-if="!showPayCode">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="submitLoading" @click="handleSubmit()">确定</el-button>
            </template>
            <el-button v-else type="primary" :loading="submitLoading" @click="handlePayOk()">支付完成</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import QRCode from 'qrcodejs2'
    export default {
        data() {
            return {
                showPayCode: false,
                payCodeUrl: '',
                orderNo: '',
                dialogVisible: false,
                labelPosition: 'right',
                dataForm: {},
                dataRule: {
                    category: [
                        { required: true, message: '请输入充值金额', trigger: 'change' }
                    ],
                    money: [
                        { required: true, message: '请输入充值金额', trigger: 'change' }
                    ]
                },
                rechargeWayOptions: [
                    { label: '对公转账', value: 0 },
                    { label: '支付宝扫码付', value: 1 },
                    { label: '注册赠送', value: 2 },
                    { label: '赠送', value: 3 },
                    { label: '对公支付宝转账', value: 4 },
                    { label: '对私支付宝', value: 5 },
                    { label: '对私微信', value: 6 },
                    { label: '对私转账', value: 7 },
                ],
                submitLoading: false,
            }
        },
        watch: {
            'dataForm.money'() {
                if (this.dataForm.money) {
                    this.dataForm.count = Math.ceil(Number(this.dataForm.money * 10000) / (this.dataForm.price)) / 10000
                } else {
                    this.dataForm.count = undefined
                }
            },

        },
        methods: {
            init(rechargeType, agentInfo) {
                this.dialogVisible = true
                this.showPayCode = false
                this.payCodeUrl = ''
                this.orderNo = ''
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    this.dataForm = {
                        category: rechargeType === 'empty' ? 0 : 1,
                        price: rechargeType === 'empty' ? agentInfo.price : agentInfo.realPrice,
                        payType: 1
                    }
                })
            },
            getQrcode() {
                this.$nextTick(() => {
                    document.getElementById('qrcode').innerHTML = "";
                    let qrcode = new QRCode('qrcode', {
                        width: 240,
                        height: 240,
                    })
                    qrcode.clear(); // 清除二维码
                    qrcode.makeCode(this.payCodeUrl);
                })
            },
            handleSubmit() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.submitLoading = true
                        this.$http({
                            url: this.$http.adornUrl(`agent/fund/recharge`),
                            method: 'post',
                            data: {
                                'token': this.$cookie.get('token'),
                                'price': this.dataForm.price,
                                'number': this.dataForm.count,
                                'money': this.dataForm.money,
                                'remark': this.dataForm.remark,
                                'category': this.dataForm.category,
                            }
                        }).then(({ data }) => {
                            this.submitLoading = false
                            if (data && data.code === 0) {
                                this.showPayCode = true
                                this.payCodeUrl = data.data.payUrl
                                this.orderNo = data.data.orderNo
                                this.getQrcode()
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })
            },
            handlePayOk() {
                this.submitLoading = true
                this.$http({
                    url: this.$http.adornUrl(`agent/fund/findOrderStatus?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'orderNo': this.orderNo,
                    })
                }).then(({ data }) => {
                    this.submitLoading = false
                    if (data && data.code === 0) {
                        this.dialogVisible = false
                        if (data.data && data.data.orderStatus == "Success") {
                            this.$emit('refresh')
                            this.$message({
                                message: '充值成功',
                                type: 'success',
                                duration: 1500
                            })
                        } else {
                            this.$message.error('充值失败，请重新充值!')
                        }
                    } else {
                        this.$message.error(data.msg)
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
    .pay-code-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        > img {
            width: 240px;
            height: 240px;
            margin-bottom: 12px;
        }
    }
</style>