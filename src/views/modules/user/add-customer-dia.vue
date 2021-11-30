<template>
    <el-dialog
        title="创建客户账号"
        :visible.sync="visible"
        :close-on-click-modal="false"
        @close="closeDialog"
        width="520px"
    >
        <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            label-width="100px"
        >
            <el-form-item label="手机号码：" prop="phone">
                <el-input v-model="dataForm.phone" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input type="password" v-model="dataForm.password" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="confirmPassword">
                <el-input type="password" v-model="dataForm.confirmPassword" placeholder="请输入"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button
                type="primary"
                :loading="submitLoading"
                @click="dataFormSubmit()"
            >
                确定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import { isMobile } from '@/utils/validate'
export default {
    data() {
        const validateConfirmPassword = (rule, value, callback) => {
            if (this.dataForm.password !== value) {
                callback(new Error("确认密码与密码不一致"));
            } else {
                callback();
            }
        };
        const validateMobile = (rule, value, callback) => {
            if (!isMobile(value)) {
                callback(new Error('手机号格式错误'))
            } else {
                callback()
            }
        }
        return {
            visible: false,
            submitLoading: false,
            dataForm: {
                phone: '',
                password: '',
                confirmPassword: '',
            },
            dataRule: {
                phone: [
                    { required: true, message: "手机号码不能为空", trigger: "blur" },
                    { validator: validateMobile, trigger: 'blur' }
                ],
                password: [
                    { required: true, message: "密码不能为空", trigger: "blur" },
                ],
                confirmPassword: [
                    { required: true, message: "确认密码不能为空", trigger: "blur" },
                    { validator: validateConfirmPassword, trigger: "blur" },
                ],
            },
        };
    },
    methods: {
        // 初始化
        init() {
            this.visible = true;
            this.submitLoading = false;
            this.$nextTick(() => {
                this.$refs["dataForm"].resetFields();
            });
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs["dataForm"].validate((valid) => {
                if (valid) {
                    this.submitLoading = true;
                    this.$http({
                        url: this.$http.adornUrl("agent/cust/addCustOfAgent"),
                        method: "post",
                        data: this.$http.adornData({
                            phone: this.dataForm.phone,
                            pwd: this.dataForm.password,
                            secondPwd: this.dataForm.confirmPassword,
                        }),
                    }).then(({ data }) => {
                        this.submitLoading = false;
                        if (data && data.code === 0) {
                            this.$message.success('创建成功!')
                            this.visible = false
                            this.$emit('refresh', 1)
                        } else {
                            this.$message.error(data.msg);
                        }
                    });
                }
            });
        },
        closeDialog() {
            this.auditDisable = false
        },
    }
};
</script>