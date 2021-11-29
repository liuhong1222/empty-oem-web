<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" @close="closeDialog">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="dataForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="nickname">
        <el-input v-model="dataForm.nickname" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <!-- <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码"></el-input>
      </el-form-item> -->
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="角色" size="mini" prop="roleId">
        <el-radio v-model="dataForm.roleId" :label="1">管理员</el-radio>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="state">
        <el-radio-group v-model="dataForm.state">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import md5 from 'js-md5'
import { isEmail, isMobile } from '@/utils/validate'
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      var validateComfirmPassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('确认密码不能为空'))
        } else if (this.dataForm.password !== value) {
          callback(new Error('确认密码与密码输入不一致'))
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          id: 0,
          userName: '',
          nickname: '',
          phone: '',
          password: '',
          email: '',
          state: 1,
          roleId: 1
        },
        dataRule: {
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
          ],
          phone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          comfirmPassword: [
            { validator: validateComfirmPassword, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
          roleId: [
            { required: true, message: '角色不能为空', trigger: 'blur' },
          ],
          state: [
            { required: true, message: '状态不能为空', trigger: 'blur' },
          ]
        },
        submitLoading: false
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.submitLoading = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        if (id) {
          this.$http({
            url: this.$http.adornUrl(`/sys/user/info/${id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              const { username, nickname, phone, email, state, roleId } = (data.user || {});
              this.dataForm.username = username
              this.dataForm.nickname = nickname
              this.dataForm.phone = phone
              this.dataForm.email = email
              this.dataForm.state = state
              this.dataForm.roleId = roleId
              this.dataForm.id = id
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            let sha256 = require("js-sha256").sha256
            this.$http({
              url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'save' : 'update'}?token=${this.$cookie.get('token')}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'username': this.dataForm.username,
                'password': this.dataForm.password ? sha256(this.dataForm.password) : this.dataForm.password,
                'email': this.dataForm.email,
                'phone': this.dataForm.phone,
                'state': this.dataForm.state,
                'nickname': this.dataForm.nickname,
                'roleId': this.dataForm.roleId
              })
            }).then(({ data }) => {
              this.submitLoading = false;
              if (data && data.code === 0) {
                this.visible = false
                this.$emit('refreshDataList', 1)
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
      closeDialog () {  // 关闭之前
        this.dataForm.comfirmPassword = ''
        this.dataForm.password = ''
      }
    }
  }
</script>