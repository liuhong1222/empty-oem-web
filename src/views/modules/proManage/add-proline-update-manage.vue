<template>
    <div>
        <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="visible" width="550px" :before-close="closeNewsSeeDialod">
            <el-form :model="proLineAUDataForm" :rules="proLineAUDataRules" ref="proLineAUDataForm" label-width="110px"
                class="demo-ruleForm">
                <el-form-item label="产品线名称：" prop="proLineName">
                    <el-input v-model="proLineAUDataForm.proLineName"></el-input>
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                    <el-select v-model="proLineAUDataForm.status" placeholder="请选择审核状态">
                        <el-option v-for="(item,index) in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序：" prop="orderNum">
                    <el-input-number v-model="proLineAUDataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" plain @click="closeNewsSeeDialod">取消</el-button>
                    <el-button type="primary" @click="proLineAUSubmit()">提交审核</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                visible: false,
                title: '',
                proLineAUDataForm: {
                    proLineName: '',
                    status: '0',
                    orderNum: '',
                    id: ''
                },
                proLineAUDataRules: {
                    proLineName: [
                        { required: true, message: '请输入产品线名称', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '请选择状态', trigger: 'blur' }
                    ],
                    orderNum: [
                        { required: true, message: '请输入排序号', trigger: 'blur' }
                    ],
                },
                statusArr: [
                    { label: '上架', value: 0 },
                    { label: '下架', value: 1 }
                ]
            }
        },
        methods: {
            showInit(row) {
                if (row) {
                    this.proLineAUDataForm.id = row.id
                }
                if (this.$refs['proLineAUDataForm'] !== undefined) {
                    this.$refs['proLineAUDataForm'].resetFields()
                }
                this.visible = true;
                // 设置默认值
                if (this.proLineAUDataForm.status == 0) {
                    this.proLineAUDataForm.status = '上架'
                }

                if (this.proLineAUDataForm.id) {
                    this.title = '编辑'
                    alert('编辑')
                    this.proLineAUDataForm.proLineName = row.product_type_name
                    this.proLineAUDataForm.orderNum = row.order_num
                    this.proLineAUDataForm.status = row.shelf_status == 0 ? '上架' : '下架'
                } else {
                    this.title = '添加'
                    this.proLineAUDataForm.proLineName = ""
                    this.proLineAUDataForm.orderNum = 0
                    this.proLineAUDataForm.status = '上架'
                }
            },
            proLineAUSubmit() {
                console.log(this.proLineAUDataForm.status)
                this.$refs['proLineAUDataForm'].validate((valid) => {
                    if (valid) {
                        let status = this.proLineAUDataForm.status;
                        status == "上架" ? (status = 0) : (status == "下架" ? (status = 1) : status);
                        // console.log(status)
                        this.$http({
                            url: this.$http.adornUrl(`agent/line/saveOrUpdate?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'id': this.proLineAUDataForm.id,
                                'productLineName': this.proLineAUDataForm.proLineName,
                                'orderNum': this.proLineAUDataForm.orderNum,
                                'status': status
                            })
                        }).then(({ data }) => {
                            if (data && data.code === 0) {
                                this.$message.success('成功')
                                this.visible = false;
                                this.$emit('refreshNewsList')
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })
            },
            closeNewsSeeDialod() {
                this.visible = false;
                this.proLineAUDataForm.id = ""
            }
        }
    }

</script>

<style>


</style>