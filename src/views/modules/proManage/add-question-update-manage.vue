<template>
    <div>
        <el-dialog :title="!quesAUDataForm.id ? '添加常见问题' :'修改常见问题'" :close-on-click-modal="false" :visible.sync="visible" width="520px">
            <el-form :model="quesAUDataForm" label-width="100px" :rules="quesAUDataRules" ref="quesAUDataRef" class="demo-ruleForm">
                <el-form-item label="所属产品：" prop="proId">
                    <el-select v-model="quesAUDataForm.proId" style="width: 100%;" placeholder="请选择所属产品">
                        <el-option v-for="(item, index) in product" :key="index" :label="item.name" :value="item.id + ''">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                    <el-select v-model="quesAUDataForm.status" style="width: 100%;" placeholder="请选择状态">
                        <el-option v-for="item in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序：" prop="orderNum">
                    <el-input-number v-model="quesAUDataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
                </el-form-item>
                <el-form-item label="问题标题：" prop="title">
                    <el-input v-model="quesAUDataForm.title" placeholder="请简要描述问题"></el-input>
                </el-form-item>
                <el-form-item label="回答内容：" prop="content">
                    <el-input type="textarea" v-model="quesAUDataForm.content" placeholder="请简要对上面的问题进行回答(最大输入500字符)"
                        maxlength="500"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" plain @click="closeNewsSeeDialod()">取消</el-button>
                    <el-button type="primary" :loading="submitLoading" @click="quesAUDataSubmit()">确定</el-button>
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
                submitLoading: false,
                product: [],
                quesAUDataForm: {
                    proName: '',
                    status: 0,
                    orderNum: '',
                    title: '',
                    content: '',
                    id: '',
                    proId: '',
                },
                quesAUDataRules: {
                    proId: [
                        { required: true, message: '请选择所属产品', trigger: 'change' }
                    ],
                    status: [
                        { required: true, message: '请选择状态', trigger: 'blur' }
                    ],
                    orderNum: [
                        { required: true, message: '请输入排序号', trigger: 'blur' }
                    ],
                    title: [
                        { required: true, message: '请输入问题标题', trigger: 'blur' }
                    ],
                    content: [
                        { required: true, message: '请输入回答内容', trigger: 'blur' }
                    ],
                },
                statusArr: [
                    { label: '上架', value: 1 },
                    { label: '下架', value: 0 }
                ],
                agentId: ''
            }
        },
        methods: {
            getAllPro() {
                this.$http({
                    url: this.$http.adornUrl(`agent/product/listProductsOfAgent?token=${this.$cookie.get('token')}&agentId=${this.agentId}`),
                    method: 'post',
                    params: this.$http.adornParams()
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.product = data.data || []
                    } else {
                        this.product = []
                    }
                })
            },
            showInit(id) {
                this.visible = true;
                this.submitLoading = false
                this.$nextTick(() => {
                    this.$refs['quesAUDataRef'].resetFields()
                })
                this.agentId = this.$json.parse(sessionStorage.getItem('agentInfo') || '{}').id
                this.getAllPro()
                if (id) {
                    this.$http({
                        url: this.$http.adornUrl(`agent/productFaq/my/detail?token=${this.$cookie.get('token')}`),
                        method: 'get',
                        params: this.$http.adornParams({
                            'productFaqId': id + ''
                        })
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.quesAUDataForm = {
                                status: data.data.state,
                                orderNum: data.data.sort,
                                title: data.data.title,
                                content: data.data.content,
                                proId: data.data.productId + '',
                                id: id,
                            }
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }
            },
            quesAUDataSubmit() {
                this.$refs['quesAUDataRef'].validate((valid) => {
                    if (valid) {
                        this.submitLoading = true
                        this.$http({
                            url: this.$http.adornUrl(`agent/productFaq/my/${!this.quesAUDataForm.id ? 'save' : 'update'}?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'productId': this.quesAUDataForm.proId,  //选中的产品id
                                'id': this.quesAUDataForm.id + '',
                                'question': this.quesAUDataForm.title,
                                'order': this.quesAUDataForm.orderNum,
                                'status': this.quesAUDataForm.status,
                                'answer': this.quesAUDataForm.content
                            })
                        }).then(({ data }) => {
                            this.submitLoading = false
                            if (data && data.code === 0) {
                                this.$message.success('成功')
                                this.visible = false;
                                this.$emit('refreshNewsList', 1)
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })
            },
            closeNewsSeeDialod() {
                this.visible = false;
            },
        }
    }

</script>

<style>


</style>