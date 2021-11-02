<template>
    <el-dialog :destroy-on-close="true" :title="!dataForm.id ? '创建套餐' : '修改套餐'" :close-on-click-modal="false" :visible.sync="dialogVisible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" :label-position="labelPosition" label-width="123px" class="cf">
            <el-form-item label="充值套餐名称：" prop="name">
                <el-input v-model="dataForm.name" placeholder="充值套餐名称"></el-input>
            </el-form-item>
            <el-form-item label="产品名称：" prop="category">
                <el-radio-group v-model="dataForm.category">
                    <el-radio :label="0">空号检测</el-radio>
                    <el-radio :label="1">实时检测</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="套餐类型：" prop="type">
                <el-radio-group v-model="dataForm.type">
                    <el-radio :label="0">普通套餐</el-radio>
                    <el-radio :label="1">自定义套餐</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="充值单价：" prop="unitPrice">
                <el-input-number v-model="dataForm.unitPrice" :min="0"></el-input-number>
                <span>元</span>
            </el-form-item>
            <template v-if="!dataForm.type">
                <el-form-item label="充值套餐条数：" prop="specifications">
                    <el-input-number v-model="dataForm.specifications" :min="0"></el-input-number>
                    <span>条</span>
                </el-form-item>
                <el-form-item label="充值套餐价格：" prop="price">
                    <el-input-number v-model="dataForm.price" :min="0"></el-input-number>
                    <span>元</span>
                </el-form-item>
            </template>
            <template v-else>
                <el-form-item label="最低充值金额：" prop="minPayAmount">
                    <el-input-number v-model="dataForm.minPayAmount" :min="0"></el-input-number>
                    <span>元</span>
                </el-form-item>
            </template>
            <el-form-item label="排序：" prop="sort">
                <el-input-number v-model="dataForm.sort" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="套餐说明：" prop="remark">
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
                dataForm: {
                    category: 0,
                    type: 0,
                },
                dataRule: {
                    name: [
                        { required: true, message: '请输入充值套餐名称', trigger: 'blur' }
                    ],
                    category: [
                        { required: true, message: '请选择产品名称', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择套餐类型', trigger: 'blur' }
                    ],
                    unitPrice: [
                        { required: true, message: '请输入充值单价', trigger: 'blur' }
                    ],
                    specifications: [
                        { required: true, message: '请输入充值套餐条数', trigger: 'blur' }
                    ],
                    price: [
                        { required: true, message: '请输入充值套餐价格', trigger: 'blur' }
                    ],
                    minPayAmount: [
                        { required: true, message: '请输入最低充值金额', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, message: '请输入排序', trigger: 'blur' }
                    ]
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
                        type: 0,
                        id: record.id || 0
                    }
                    if (record.id) {
                        this.getDetailData(record);
                    }
                })
            },
            getDetailData(record) {
                this.$http({
                    url: this.$http.adornUrl(`agent/level/detail?token=${this.$cookie.get('token')}&id=${record.id}`),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.dataForm = data.data || {}
                    }
                })
            },
            handleSubmit() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: this.$http.adornUrl(`agent/level/${!this.dataForm.id ? 'save' : 'update'}?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'id': this.dataForm.id || undefined
                            })
                        }).then(({ data }) => {
                            if (data && data.code === 0) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1500,
                                    onClose: () => {
                                        this.dialogVisible = false
                                        this.$emit('refresh')
                                    }
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