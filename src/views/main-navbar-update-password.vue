<template>
  <el-dialog title="修改初始密码" :visible.sync="visible" :append-to-body="true" :close-on-click-modal="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="账号">
        <span>{{ userName }}</span>
      </el-form-item>
      <el-form-item label="原密码" prop="password">
        <el-input type="password" v-model="dataForm.password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="dataForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="dataForm.confirmPassword"></el-input>
      </el-form-item>
    </el-form>
    <p style="margin-left: 15px">注：为保障您的数据安全，请您尽快修改初始密码。</p>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import md5 from 'js-md5';
  import { pwdRule } from '@/utils/validate';
  export default {
    data() {
      var validateConfirmPassword = (rule, value, callback) => {
        if (this.dataForm.newPassword !== value) {
          callback(new Error('确认密码与新密码不一致'))
        } else {
          callback()
        }
      };
      var validatePwd = (rule, value, callback) => {
        if (!pwdRule(value)) {
          callback(new Error('8~16 个字符，至少包括一个大写字母、一个小写字母以及一个数字!'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        submitLoading: false,
        dataForm: {
          password: '',
          newPassword: '',
          confirmPassword: ''
        },
        dataRule: {
          password: [
            { required: true, message: '原密码不能为空', trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: '新密码不能为空', trigger: 'blur' },
            { validator: validatePwd, trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '确认密码不能为空', trigger: 'blur' },
            { validator: validateConfirmPassword, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      userName: {
        get() { return this.$store.state.user.name }
      },
      mainTabs: {
        get() { return this.$store.state.common.mainTabs },
        set(val) { this.$store.commit('common/updateMainTabs', val) }
      }
    },
    watch: {
      dataForm: {
        handler: function (val, oldval) {
          if (this.dataForm.password !== "" && this.dataForm.newPassword !== "") {
            if (this.dataForm.password == this.dataForm.newPassword) {
              this.$message.error('新旧密码不能一致!');
              this.disabled = true;
              return;
            } else {
              this.disabled = false;
            }
          }

        },
        deep: true
      }
    },
    methods: {
      // 初始化
      init() {
        this.visible = true
        this.submitLoading = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.submitLoading = true
            let sha256 = require("js-sha256").sha256
            this.$http({
              url: this.$http.adornUrl('/sys/user/password'),
              method: 'post',
              data: this.$http.adornData({
                'password': sha256(this.dataForm.password),
                'newPassword': sha256(this.dataForm.newPassword)
              })
            }).then(({ data }) => {
              this.submitLoading = false
              if (data && data.code === 0) {
                this.$message({
                  message: '修改成功，请重新登录!',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$nextTick(() => {
                      this.mainTabs = []
                      this.$cookie.delete('token')
                      this.$router.replace({ name: 'login' })
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