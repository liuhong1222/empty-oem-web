<template>
    <el-dialog :title="!dataForm.id ? '新增代理商等级' : '修改代理商等级'" :close-on-click-modal="false" :visible.sync="levelvisible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" :label-position="labelPosition" label-width="123px" class="cf">
            <el-form-item label="产品代理类型：" prop="levelType">
                <el-radio-group v-model="dataForm.levelType">
                    <el-radio :label="0">空号检测</el-radio>
                    <el-radio :label="1">实时检测</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="代理商等级：" prop="level">
                <el-input v-model="dataForm.level" placeholder="请输入代理商等级"></el-input>
                <span>级</span>
            </el-form-item>
            <el-form-item label="单价：" prop="price">
                <el-input-number @change="handleInputChange" v-model="dataForm.price" :min="0"></el-input-number>
                <span class="margin-left-8">元/条</span>
            </el-form-item>
            <el-form-item label="预警条数：" prop="warningsNumber">
                <el-input-number v-model="dataForm.warningsNumber" :min="0"></el-input-number>
                <span class="margin-left-8">条</span>
            </el-form-item>
            <el-form-item label="最小充值条数：" prop="minRechargeNumber">
               <el-input-number @change="handleInputChange" v-model="dataForm.minRechargeNumber" :min="0"></el-input-number>
                <span class="margin-left-8">条</span>
            </el-form-item>
            <el-form-item label="最小充值金额：" prop="minPaymentAmount">
                <el-input-number v-model="dataForm.minPaymentAmount" disabled :min="0"></el-input-number>
                <span class="margin-left-8">元</span>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
                <el-input v-model="dataForm.remark" :rows="3" placeholder="请输入备注" type="textarea"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="levelvisible = false">取消</el-button>
            <el-button type="primary" :loading="submitLoading" @click="levelSubmit()">确定</el-button>
          </span>
    </el-dialog>
</template>

<script>
    export default {
        data() {
            return {
                levelvisible: false,
                labelPosition: 'right',
                dataForm: {
                    levelType: 0
                },
                dataRule: {
                    levelType: [
                        { required: true, message: '请选择产品代理类型', trigger: 'blur' }
                    ],
                    level: [
                        { required: true, message: '请输入代理商等级', trigger: 'blur' }
                    ],
                    price: [
                        { required: true, message: '请输入单价', trigger: 'blur' }
                    ],
                    warningsNumber: [
                        { required: true, message: '请输入预警条数', trigger: 'blur' }
                    ],
                    minRechargeNumber: [
                        { required: true, message: '请输入最小充值条数', trigger: 'blur' }
                    ],
                    minPaymentAmount: [
                        { required: true, message: '请输入最小充值金额', trigger: 'blur' }
                    ]
                },
                submitLoading: false
            }
        },
        methods: {
            levelInit(id) {
                this.levelvisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                })
                if (id) {
                    this.$http({
                        url: this.$http.adornUrl(`agent/level/detail?token=${this.$cookie.get('token')}&id=${this.dataForm.id}`),
                        method: 'get',
                        params: this.$http.adornParams()
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            const { levelType, level, price, warningsNumber, minRechargeNumber, minPaymentAmount, remark } = (data.data || {})
                            this.dataForm = {
                                id,
                                levelType,
                                level,
                                price,
                                warningsNumber,
                                minRechargeNumber,
                                minPaymentAmount,
                                remark
                            }
                        }
                    })
                }
            },
            levelSubmit() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.submitLoading = true
                        this.$http({
                            url: this.$http.adornUrl(`agent/level/${!this.dataForm.id ? 'save' : 'update'}?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                ...this.dataForm,
                                id: this.dataForm.id || undefined
                            })
                        }).then(({ data }) => {
                            this.submitLoading = false
                            if (data && data.code === 0) {
                                this.levelvisible = false
                                this.$emit('refreshDataList')
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
            },
            handleInputChange() {
                this.$nextTick(() => {
                    const { price, minRechargeNumber } = this.dataForm
                    this.dataForm.minPaymentAmount = (price || 0) * (minRechargeNumber || 0)
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
<style scoped lang="scss">
    .margin-left-8 {
        margin-left: 8px;
    }
</style>