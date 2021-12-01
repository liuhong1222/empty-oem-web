<template>
  <el-dialog
    :title="!isEdit ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="dataForm.roleName" :disabled="isEdit" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item size="mini" label="授权">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="menuId"
          ref="menuListTree"
          :default-expand-all="true"
          show-checkbox>
        </el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        submitLoading: false,
        menuList: [],
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          roleName: '',
          remark: ''
        },
        dataRule: {
          roleName: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ]
        },
        isEdit: false,
        tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      }
    },
    methods: {
      init (id) {
        this.submitLoading = false
        new Promise((resolve) => {
          this.$http({
            url: this.$http.adornUrl('sys/menu/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.menuList = treeDataTranslate(data, 'menuId')
            resolve();
          })
        }).then(() => {
          return new Promise((resolve) => {
            this.visible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].resetFields()
              this.$refs.menuListTree.setCheckedKeys([])
              this.dataForm = {
                roleName: '',
                remark: '',
              }
              resolve()
            })
          })
        }).then(() => {
          if (id || id === 0) {
            this.isEdit = true
            this.$http({
              url: this.$http.adornUrl(`sys/role/info/${id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = {
                  id: id,
                  roleName: data.role.name,
                  remark: data.role.remark,
                }
                var idx = data.role.menuIdList.indexOf(this.tempKey)
                if (idx !== -1) {
                  data.role.menuIdList.splice(idx, data.role.menuIdList.length - idx)
                }
                this.$refs.menuListTree.setCheckedKeys(data.role.menuIdList)
              }
            })
          } else {
            this.isEdit = false
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.submitLoading = true
            this.$http({
              url: this.$http.adornUrl(`sys/role/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.roleName,
                'remark': this.dataForm.remark,
                'menuIdList': [].concat(this.$refs.menuListTree.getCheckedKeys(), [this.tempKey], this.$refs.menuListTree.getHalfCheckedKeys())
              })
            }).then(({data}) => {
              this.submitLoading = false
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
      }
    }
  }
</script>
