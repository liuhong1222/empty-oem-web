<template>
    <div class="site-wrapper site-page--login">
        <div class="login-con">
            <div class="login-img">
                <img src="~@/assets/img/lo_pic.jpg" alt="">
            </div>
            <div class="login-main">
                <!-- <img src="~@/assets/img/logo.png" alt=""> -->
                <div class="context">
                    <span></span>
                    <h3 class="login-title">找回密码</h3>
                </div>
                <el-form :model="dataForm" :rules="dataRule" ref="dataForm" status-icon style="position:relative;margin-top:60px" v-show="getCodeForm">
                    <el-form-item prop="mobile" style="margin-bottom:50px">
                        <img src="~@/assets/img/phoneUser.jpg" alt="" class="icon">
                        <el-input v-model="dataForm.mobile" placeholder="请输入手机号" class="account"></el-input>
                        <!-- <span style="display:block;height:41px" v-show="errTextVisible">{{errText}}</span> -->
                    </el-form-item>
                    <el-form-item prop="code">
                        <img src="~@/assets/img/pwdImg.jpg" alt="" class="icon">
                        <el-input v-model="dataForm.code" type="password" placeholder="请输入验证码" class="getcode" style="width:50%;"></el-input>
                    </el-form-item>
                    <el-form-item style="position: absolute;right:0px;top:79px">
                        <el-button @click="codeBtn" style="position: absolute;top:14px;right:0;width:110px;z-index:100;height:44px" v-text="btntext"
                            id="codeBtn" :disabled="disabled"></el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="display:block;margin:60px auto 0;width:120px" @click="nextOpr">下一步</el-button>
                    </el-form-item>
                </el-form>

                <el-form :model="dataForm1" :rules="dataRule1" ref="dataForm1" status-icon style="position:relative;margin-top:60px" v-show="rulePwdForm">
                    <el-form-item prop="newPassword" style="margin-bottom:35px">
                        <img src="~@/assets/img/keylogin.jpg" alt="" class="icon">
                        <el-input type="password" v-model="dataForm1.newPassword" class="account" placeholder="请输入新密码..."></el-input>
                    </el-form-item>
                    <el-form-item prop="confirmPassword">
                        <img src="~@/assets/img/keylogin.jpg" alt="" class="icon">
                        <el-input type="password" v-model="dataForm1.confirmPassword" class="account" placeholder="请确认密码..."></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="display:block;margin:50px auto 0;width:120px" @click="submitEditPwd">确定</el-button>
                    </el-form-item>
                </el-form>


            </div>
        </div>
    </div>
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
            var validateConfirmPassword = (rule, value, callback) => {
                if (this.dataForm1.newPassword !== value) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }
            return {
                btntext: '获取验证码',
                disabled: false,
                time: 0,
                getCodeForm: true,
                rulePwdForm: false,
                errText: '',
                errTextVisible: true,
                dataForm: {
                    mobile: '',
                    code: '',
                    codeBtn: '获取验证码',
                    uuid: '',
                    captcha: ''
                },
                dataRule: {
                    mobile: [
                        { required: true, message: '手机号不能为空', trigger: 'blur' },
                        { validator: validateMobile, trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '验证码不能为空', trigger: 'blur' }
                    ]
                },
                dataForm1: {
                    newPassword: '',
                    confirmPassword: ''
                },
                dataRule1: {
                    newPassword: [
                        { required: true, message: '新密码不能为空', trigger: 'blur' }
                    ],
                    confirmPassword: [
                        { required: true, message: '确认密码不能为空', trigger: 'blur' },
                        { validator: validateConfirmPassword, trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
        },
        methods: {
            // 提交表单
            // dataFormSubmit() {
            //     this.$refs['dataForm'].validate((valid) => {
            //         if (valid) {
            //             this.$http({
            //                 url: this.$http.adornUrl('/sys/login'),
            //                 method: 'post',
            //                 data: this.$http.adornData({
            //                     'username': this.dataForm.userName,
            //                     'password': this.dataForm.password,
            //                     'uuid': this.dataForm.uuid,
            //                     'captcha': '1111'
            //                 })
            //             }).then(({ data }) => {
            //                 if (data && data.code === 0) {
            //                     this.$cookie.set('token', data.token)
            //                     // 判断哪个，进入不同的工作台
            //                     this.$router.replace({ name: 'console-admin' })
            //                 } else {
            //                     this.$message.error(data.msg)
            //                 }
            //             })
            //         }
            //     })
            // },
            forgetPwd() {
                this.$router.replace({ name: 'forget' })
            },
            // 点击获取验证码
            codeBtn() {
                if (this.dataForm.mobile == "") {
                    this.$message.warning('手机号不能为空!');
                } else if (!reg.test(this.dataForm.mobile)) {
                    this.$message.warning('手机格式不正确!');
                } else {
                    this.time = 60;
                    this.disabled = true;
                    this.timer();
                }
            },
            timer() {
                if (this.time > 0) {
                    this.time--;
                    this.btntext = this.time + "s后重新获取";
                    setTimeout(this.timer, 1000);
                } else {
                    this.time = 0;
                    this.btntext = "获取验证码";
                    this.disabled = false;
                }
            },
            // 点击下一步
            nextOpr() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.getCodeForm = false
                        this.rulePwdForm = true
                    }
                })
            },

            // 确定
            submitEditPwd() {
                this.$refs['dataForm1'].validate((valid) => {
                    if (valid) {
                        this.$message.success('请重新登录!');
                        this.$router.replace({ name: 'login' })
                    }
                })
            }

        }
    }

</script>

<style lang="scss">
    $bc:#4680ff;
    $lbc:#6192FC;
    .site-wrapper.site-page--login {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0px;
        z-index: -1;
        background-image: linear-gradient(0deg, #152151 0%, #09102c 100%);
    }

    .login-con {
        width: 915px;
        height: 514px;
        position: absolute;
        left: 50%;
        top: 20%;
        margin-left: -475.5px;
    }

    .login-main {
        position: absolute;
        top: 0;
        right: 3px;
        padding: 26px 31px 0px 39px;
        min-height: 100%;
        background-color: #eee;

        >img {
            float: right;
        }
        >.context {
            margin-top: 50px;
            margin-bottom: 25px;
            >span {
                width: 4px;
                display: inline-block;
                height: 20px;
                background-color: #4680ff;
                vertical-align: middle;
            }
            >h3 {
                font-size: 18px;
                color: #333;
                font-weight: 700;
                display: inline;
                margin-left: 5px;
                vertical-align: middle;
            }
            >p {
                font-size: 14px;
                color: #999;
                margin-left: 15px;
            }
        }
    }

    .account {
        width: 280px !important;
        height: 44px;
        line-height: 44px;
        background-color: #ffffff;
        border-radius: 3px;
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        margin-left: -3px;
    }

    .account .el-input__inner,
    .getcode .el-input__inner {
        border: none !important;
    }

    .getcode {
        height: 44px;
        line-height: 44px;
        background-color: #ffffff;
        border-radius: 2px;
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        margin-left: -3px;
    }

    #codeBtn {
        height: 44px;
        border-radius: 2px;
        background-color: #4680ff;
        color: #fff;
        cursor: pointer
    }

    .loginBtn {
        width: 334px;
        height: 44px;
        background-color: $bc;
        border-radius: 3px;
        border: none !important;
    }

    .loginBtn:hover,
    .loginBtn:focus {
        background-color: $lbc !important;
    }

    .icon {
        margin-top: -2px;
    }

    .el-button--text:focus,
    .el-button--text:hover {
        color: $lbc !important;
    }

    .forgetPwd {
        float: right;
        color: $bc;
        ;
        font-size: 14px;
        margin-top: -15px;
        margin-bottom: 20px;
    }
</style>