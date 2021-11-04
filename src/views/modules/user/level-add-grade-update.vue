<template>
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="levelvisible" @close="closeDialog">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" :label-position="labelPosition" label-width="123px" class="cf">
            <!-- <el-form-item label="代理商等级：" prop="levelNum">
                <el-input v-model="dataForm.levelNum" placeholder="代理商等级 如：1"></el-input>
            </el-form-item>
            <el-form-item label="等级名称：" prop="levelName">
                <el-input v-model="dataForm.levelName" placeholder="代理商等级 如：一级代理商"></el-input>
            </el-form-item> -->
            <el-form-item label="代理商等级：" prop="price">
                <el-input v-model="dataForm.levelName" placeholder="代理商等级"></el-input>
                <span>级</span>
            </el-form-item>
            <el-form-item label="单价：" prop="price">
                <el-input v-model="dataForm.price" placeholder="单价"></el-input>
                <span>元/条</span>
            </el-form-item>
            <el-form-item label="预警条数：" prop="moreCounts">
                <el-input v-model="dataForm.moreCounts" placeholder="预警条数"></el-input>
                <span>条</span>
            </el-form-item>
            <!-- <el-form-item label="充值金额：" prop="minRecharge">
                <el-col :span="8">
                    <el-input v-model="dataForm.minRecharge" style="width:100%" placeholder="最小充值"></el-input>
                </el-col>
                <el-col class="line" :span="1">-</el-col>
                <el-col :span="8">
                    <el-input v-model="dataForm.maxRecharge" style="width:100%" placeholder="最大充值"></el-input>
                </el-col>
            </el-form-item> -->
            <el-form-item label="最小充值条数：" prop="price">
               <el-input-number v-model="dataForm.minCount" :min="0"></el-input-number>
                <span>条</span>
            </el-form-item>
            <el-form-item label="最小充值金额：" prop="price">
                <el-input-number v-model="dataForm.minPrice" disabled :min="0"></el-input-number>
                <span>元</span>
            </el-form-item>
            <el-form-item label="备注：" prop="price">
                <el-input v-model="dataForm.remark" :rows="3" placeholder="请输入备注" type="textarea"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="levelvisible = false">取消</el-button>
            <el-button type="primary"  @click="levelSubmit()">确定</el-button>
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
                    id: 0,
                    levelName: '',
                    levelNum: '',
                    price: '',
                    moreCounts: '',
                    minRecharge: '',
                    maxRecharge: ''
                },
                dataRule: {
                    levelName: [
                        { required: true, message: '请输入代理商等级名称', trigger: 'blur' }
                    ],
                    levelNum: [
                        { required: true, message: '请输入代理商等级', trigger: 'blur' }
                    ],
                    price: [
                        { required: true, message: '请输入单价', trigger: 'blur' }
                    ],
                    moreCounts: [
                        { required: true, message: '请输入允许超出条数', trigger: 'blur' }
                    ],
                    minRecharge: [
                        { required: true, message: '请输入充值金额', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            levelInit(id) {
                this.dataForm.id = id || 0
                this.levelvisible = true
                // console.log(id)
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                })
                if (this.dataForm.id) {
                    this.$http({
                        url: this.$http.adornUrl(`agent/level/detail?token=${this.$cookie.get('token')}&id=${this.dataForm.id}`),
                        method: 'get',
                        params: this.$http.adornParams()
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            // console.log(data)
                            this.dataForm.levelName = data.data.name
                            this.dataForm.levelNum = data.data.level
                            this.dataForm.price = data.data.price
                            this.dataForm.moreCounts = data.data.emptyWarnNumber
                            this.dataForm.minRecharge = data.data.minRecharge
                            this.dataForm.maxRecharge = data.data.maxRecharge
                        }
                    })
                }
            },
            levelSubmit() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: this.$http.adornUrl(`agent/level/${!this.dataForm.id ? 'save' : 'update'}?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'id': this.dataForm.id || undefined,
                                'name': this.dataForm.levelName,
                                'level': this.dataForm.levelNum,
                                'price': this.dataForm.price,
                                'emptyWarnNumber': this.dataForm.moreCounts,
                                'minRecharge': this.dataForm.minRecharge,
                                'maxRecharge': this.dataForm.maxRecharge
                            })
                        }).then(({ data }) => {
                            // console.log(data)
                            if (data && data.code === 0) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1500,
                                    onClose: () => {
                                        this.levelvisible = false
                                        this.$emit('refreshDataList')
                                    }
                                })
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })

            },
            closeDialog() {
                this.dataForm.minRecharge=""
                this.dataForm.maxRecharge=""
            },
        }
    }

</script>

<style lang="scss">
    .el-form-item__content {
        margin-left: 0
    }
</style>