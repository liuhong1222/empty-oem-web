<template>
    <el-dialog title="设置余额提醒" :visible.sync="visible" width="600px">
        <el-form ref="formRef" :model="form" :rules="formRules" label-width="120px">
            <el-form-item label="选择产品：" prop="productType">
                <el-select style="width: 200px;" @change="getWarningInfo" v-model="form.productType" placeholder="请选择产品">
                    <el-option v-for="item in categoryOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="提醒余额：" prop="warningCount">
                <el-input-number v-model="form.warningCount" :step="1" :precision="0" :min="0"></el-input-number>
                <span class="warning-tip">条</span>
                <div class="warning-tip">产品余额低于该值时，系统会发送提醒信息到联系人手机号</div>
            </el-form-item>
            <el-form-item label="联系人手机号：" prop="informMobiles">
                <el-input type="textarea" rows="4" v-model="form.informMobiles" placeholder="请输入联系人手机号，多个号码以英文半角逗号分隔"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" :loading="submitLoading" @click="handleSubmit()">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    export default {
        data() {
            return {
                categoryOptions: [
                    { label: '空号检测', value: 1 },
                    { label: '实时检测', value: 2 },
                    { label: '国际号码检测', value: 3 },
                    { label: '定向通用检测', value: 4 },
                    { label: 'line定向检测', value: 5 }
                ],
                visible: false,
                submitLoading: false,
                form: {
                    productType: undefined,
                    warningCount: undefined,
                    informMobiles: undefined,
                },
                formRules: {
                    productType: [
                        { required: true, message: '请选择产品', trigger: 'blur' }
                    ],
                    warningCount: [
                        { required: true, message: '请输入提醒余额', trigger: 'blur' }
                    ],
                    informMobiles: [
                        { required: true, message: '请输入联系人手机号', trigger: 'blur' },
                        {
                            // 多个手机号用英文逗号隔开
                            pattern: /^1[3456789][0-9]{9}(,1[3456789][0-9]{9})*$/,
                            message: "请输入正确的手机号",
                            trigger: "blur"
                        }
                    ],
                },
                customerInfo: {},
                warningInfo: {},
            }
        },
        methods: {
            init(row) {
                this.visible = true
                this.submitLoading = false
                this.customerInfo = row
                this.warningInfo = {}
                this.form =  {
                    productType: 1,
                    warningCount: undefined,
                    informMobiles: undefined,
                }
                this.$nextTick(() => {
                    this.$refs['formRef'].resetFields();
                    this.getWarningInfo()
                })
            },
            handleSubmit() {
                this.$refs['formRef'].validate((valid) => {
                    if (valid) {
                        this.submitLoading = true
                        this.$http({
                            url: this.$http.adornUrl(`agent/warning/modify?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            data: {
                                id: this.warningInfo.id,
                                customerId: this.customerInfo.customerId + '',
                                ...this.form
                            }
                        }).then(({ data }) => {
                            this.submitLoading = false
                            if (data && data.code === 0) {
                                this.visible = false
                                this.$message({
                                    message: '设置成功',
                                    type: 'success',
                                    duration: 1500
                                })
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                    }
                })
            },
            getWarningInfo() {
                this.agentSearchLoading = true
                this.$http({
                    url: this.$http.adornUrl(`agent/warning/findOne?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: {
                        customerId: this.customerInfo.customerId + '',
                        productType: this.form.productType
                    }
                }).then(({ data }) => {
                    let tempObj = {}
                    if (data && data.code === 0) {
                        let newData = data.data || {}
                        tempObj = {
                            warningCount: newData.warningCount || undefined,
                            informMobiles: newData.informMobiles || undefined,
                        }
                        this.warningInfo = newData
                    } else {
                        tempObj = {
                            warningCount: undefined,
                            informMobiles: undefined,
                        }
                        this.warningInfo = {}
                        this.$message.error(data.msg);
                    }
                    this.form = {
                        ...this.form,
                        ...tempObj
                    }
                })
            },
        }
    }
</script>
<style  lang="scss" scoped>
.warning-tip {
    color: #606266;
    font-size: 12px;
}
</style>