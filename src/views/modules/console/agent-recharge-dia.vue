<template>
    <el-dialog :destroy-on-close="true" :title="'充值'" :close-on-click-modal="false" :visible.sync="dialogVisible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" :label-position="labelPosition" label-width="123px" class="cf">
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
                <span>元</span>
            </el-form-item>
            <el-form-item label="充值条数：" prop="count">
                <el-input-number v-model="dataForm.count" :min="0"></el-input-number>
                <span>元</span>
            </el-form-item>
            <el-form-item label="入账类型：" prop="payType">
                <el-select style="width: 100%;" v-model="dataForm.payType" placeholder="请选择入账类型">
                    <el-option v-for="item in rechargeWayOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" :rows="3" v-model="dataForm.remark" placeholder="套餐说明"></el-input>
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
                dataForm: {},
                dataRule: {
                    category: [
                        { required: true, message: '请输入充值金额', trigger: 'blur' }
                    ],
                    money: [
                        { required: true, message: '请输入充值金额', trigger: 'blur' }
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
            }
        },
        methods: {
            init(rechargeType, agentInfo) {
                this.dialogVisible = true
                this.$nextTick(() => {
                    console.log(agentInfo)
                    this.$refs['dataForm'].resetFields()
                    this.dataForm = {
                        category: rechargeType === 'empty' ? 0 : 1,
                        price: 10
                    }
                })
            },
            handleSubmit() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: this.$http.adornUrl(`agent/level?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'id': this.dataForm.id || undefined
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