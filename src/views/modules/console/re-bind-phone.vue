<template>
    <el-dialog title="重新绑定手机号" :visible.sync="dialogVisible" width="520px">
        <el-form :model="rePhoneForm" ref="rePhoneRef" :rules="codedataRule" label-width="150px" class="demo-ruleForm" :label-position="labelPosition">
            <el-form-item label="原手机号：">
                <el-input v-model="rePhoneForm.phone" placeholder="原手机号" readonly></el-input>
            </el-form-item>
            <el-form-item label="短信验证码：" prop="oldCode">
                <el-input v-model="rePhoneForm.oldCode" placeholder="请输入手机验证码..." style="width:44%;"></el-input>
                <el-button type="primary" v-text="btntextold" :disabled="disabled" id="getoldCode" @click="getoldCode"></el-button>
            </el-form-item>
            <el-form-item label="新手机号：" prop="newPhone">
                <el-input v-model="rePhoneForm.newPhone" placeholder="请输入新手机号"></el-input>
            </el-form-item>
            <el-form-item label="短信验证码：" prop="newCode">
                <el-input v-model="rePhoneForm.newCode" placeholder="请输入手机验证码..." style="width:44%;"></el-input>
                <el-button v-text="btntextnew" :disabled="twoDisabled" id="getnewCode" @click="getnewCode" :type="btnType"></el-button>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitBindPhone">确 定</el-button>
              </span>
    </el-dialog>
</template>

<script>
    import { isEmail, isMobile } from '@/utils/validate'
    export default {
        data() {
            var validateMobile = (rule, value, callback) => {
                if (!isMobile(value)) {
                    callback(new Error('手机号格式错误!'))
                } else {
                    callback()
                }
            }
            return {
                btntextold: '获取验证码',
                btntextnew: '获取验证码',
                btnType: 'info',
                timeold: 0,
                timenew: 0,
                disabled: false,
                twoDisabled: true,
                dialogVisible: false,
                labelPosition: 'right',
                rePhoneForm: {
                    phone: '',
                    oldCode: '',
                    getoldCode: '获取验证码',
                    newPhone: '',
                    newCode: '',
                    getNewCode: '获取验证码'
                },
                codedataRule: {
                    newPhone: [
                        { required: true, message: '手机号不能为空', trigger: 'blur' },
                        { validator: validateMobile, trigger: 'blur' }
                    ],
                    oldCode: [
                        { required: true, message: '请输入旧手机号验证码', trigger: 'blur' },
                    ],
                    newCode: [
                        { required: true, message: '请输入新手机号验证码', trigger: 'blur' },
                    ],
                }
            }
        },
        methods: {
            showInit(mobile) {
                this.dialogVisible = true
                this.rePhoneForm.phone = mobile
                this.$nextTick(() => {
                    this.$refs['rePhoneRef'].resetFields()
                })
                // console.log('重新绑定手机哈')
            },

            // 获取旧手机验证码
            getoldCode() {
                this.$http({
                    url: this.$http.adornUrl(`agent/sms/sendVerifyCode?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'mobile': this.rePhoneForm.phone,
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.timeold = 60;
                        this.twoDisabled = false
                        this.btnType = 'primary'
                        this.disabled = true
                        this.timer();
                    } else {
                        this.$message.error(data.msg)
                    }
                })

            },
            timer() {
                if (this.timeold > 0) {
                    this.timeold--;
                    this.btntextold = this.timeold + "s后重新获取";
                    setTimeout(this.timer, 1000);
                } else {
                    this.timeold = 0;
                    this.btntextold = "获取验证码";
                    this.disabled = false;
                }
            },

            // 获取新手机号验证码
            getnewCode() {
                if (this.rePhoneForm.newPhone == "") {
                    this.$message.error('请输入新手机号!')
                    return
                }

                // 判断手机号是否存在
                this.$http({
                    url: this.$http.adornUrl(`agent/sms/checkMobile?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'mobile': this.rePhoneForm.newPhone,
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) { //不存在
                        this.twoDisabled = true
                        this.$http({
                            url: this.$http.adornUrl(`agent/sms/sendVerifyCode?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'mobile': this.rePhoneForm.newPhone,
                            })
                        }).then(({ data }) => {
                            if (data && data.code === 0) {
                                this.timenew = 60;
                                this.timernew();
                            } else {
                                this.$message.error(data.msg)
                            }
                        })

                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            timernew() {
                if (this.timenew > 0) {
                    this.timenew--;
                    this.btntextnew = this.timenew + "s后重新获取";
                    setTimeout(this.timernew, 1000);
                } else {
                    this.timenew = 0;
                    this.btntextnew = "获取验证码";
                    this.twoDisabled = false
                }
            },

            // 提交信息
            submitBindPhone() {
                this.$refs['rePhoneRef'].validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: this.$http.adornUrl(`agent/sms/updateMobile?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'oldMobile': this.rePhoneForm.phone,
                                'oldCode': this.rePhoneForm.oldCode,
                                'newMobile': this.rePhoneForm.newPhone,
                                'newCode': this.rePhoneForm.newCode,
                            })
                        }).then(({ data }) => {
                            if (data && data.code === 0) { //不存在
                                this.$message({
                                    message: '修改成功，请重新登录!',
                                    type: 'success',
                                    duration: 1500,
                                    onClose: () => {
                                        this.dialogVisible = false
                                        // this.$emit('refreshDataList')
                                        this.$cookie.delete('token')
                                        this.$router.push({ name: 'login' }, () => {
                                            // 刷新页面, 清空整站临时存储数据
                                        })
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
    #getoldCode,
    #getnewCode {
        width: 30%;
        height: 42px;
        text-align: center;
        cursor: pointer;
        color: #fff;
    }
    /* #getnewCode:hover,
    #getoldCode:hover {
        background-color: #559AF3;
    } */
</style>