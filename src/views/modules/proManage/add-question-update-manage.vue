<template>
    <div>
        <el-dialog :title="!quesAUDataForm.id ? '添加' :'修改'" :close-on-click-modal="false" :visible.sync="visible" width="550px"
            :before-close="closeNewsSeeDialod">
            <el-form :model="quesAUDataForm" label-width="100px" :rules="quesAUDataRules" ref="quesAUDataRef" class="demo-ruleForm">
                <el-form-item label="所属产品：" prop="proName">
                    <el-select v-model="quesAUDataForm.proName" filterable remote reserve-keyword placeholder="请输入关键词"
                        :remote-method="remoteMethod" :loading="loading" @change="selectOne" :disabled="disabled">
                        <el-option v-for="item in options4" :key="item.productId" :label="item.productName" :value="item.productId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                    <el-select v-model="quesAUDataForm.status" placeholder="请选择审核状态">
                        <el-option v-for="item in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序：" prop="orderNum">
                    <el-input-number v-model="quesAUDataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
                </el-form-item>
                <el-form-item label="问题标题：" prop="title">
                    <el-input v-model="quesAUDataForm.title" placeholder="请简要描述问题……"></el-input>
                </el-form-item>
                <el-form-item label="回答内容：" prop="content">
                    <el-input type="textarea" v-model="quesAUDataForm.content" placeholder="请简要对上面的问题进行回答(最大输入500字符)……"
                        maxlength="500"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" plain @click="closeNewsSeeDialod()">取消</el-button>
                    <el-button type="primary" @click="quesAUDataSubmit()">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                options4: [],
                list: [],
                loading: false,
                visible: false,
                disabled: false,
                productId: '',
                quesAUDataForm: {
                    proName: '',
                    status: 0,
                    orderNum: '',
                    title: '',
                    content: '',
                    id: ''
                },
                selectid: '',
                quesAUDataRules: {
                    proName: [
                        { required: true, message: '请输入所属产品', trigger: 'change' }
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
                ]
            }
        },
        methods: {
            remoteMethod(query) {
                this.getData(query)
            },
            getData(query) {
                this.$http({
                    url: this.$http.adornUrl(`agent/productFaq/my/getProductInfo?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'productName': query
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        if (data.data.length == 0) {
                            this.options4 = [];
                            this.quesAUDataForm.proName = ""
                            return;
                        }
                        // this.list = data.data
                        this.loading = true;
                        setTimeout(() => {
                            this.loading = false;
                            this.options4 = data.data.filter(item => {
                                return item.productName.indexOf(query) > -1;
                            });
                        }, 200);
                    } else {
                        this.options4 = [];
                        this.$message.error(data.msg);
                    }
                })
            },
            showInit(id) {
                this.quesAUDataForm.id = id
                this.visible = true;
                this.disabled = false;
                if (this.quesAUDataForm.id) {
                    this.disabled = true;
                    this.$http({
                        url: this.$http.adornUrl(`agent/productFaq/my/detail?token=${this.$cookie.get('token')}`),
                        method: 'get',
                        params: this.$http.adornParams({
                            'productFaqId': this.quesAUDataForm.id
                        })
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.quesAUDataForm.proName = data.data.productName;
                            this.quesAUDataForm.status = data.data.status;
                            this.quesAUDataForm.orderNum = data.data.orderNum;
                            this.quesAUDataForm.title = data.data.question;
                            this.quesAUDataForm.content = data.data.answer;
                            this.productId = data.data.productId
                        } else {

                            this.$message.error(data.msg)
                        }
                    })
                }
                this.$nextTick(() => {
                    this.$refs['quesAUDataRef'].resetFields()
                })
                // 设置默认值
                if (this.quesAUDataForm.status == 0) {
                    this.quesAUDataForm.status = '上架'
                };
            },
            selectOne(event, item) {
                this.selectid = event
            },
            quesAUDataSubmit() {
                this.$refs['quesAUDataRef'].validate((valid) => {
                    if (valid) {
                        let status = this.quesAUDataForm.status;
                        status == "上架" ? (status = 0) : (status == "下架" ? (status = 1) : status);
                        console.log(this.quesAUDataForm.proName)
                        this.$http({
                            url: this.$http.adornUrl(`agent/productFaq/my/${!this.quesAUDataForm.id ? 'save' : 'update'}?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'productId': this.selectid ? this.selectid : this.productId,  //选中的产品id
                                'id': this.quesAUDataForm.id,
                                'question': this.quesAUDataForm.title,
                                'order': this.quesAUDataForm.orderNum,
                                'status': status,
                                'answer': this.quesAUDataForm.content
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
                this.selectid = ""
            },
            // querySearch(queryString, cb) {
            //     if (!this.quesAUDataForm.proName) {
            //         return;
            //     }
            //     var csvS = this.csvS;
            //     // console.log(csvS)
            //     cb(csvS);
            //     if (csvS) {
            //         this.selectid = csvS[0].id;
            //     }

            // }
        }
    }

</script>

<style>


</style>