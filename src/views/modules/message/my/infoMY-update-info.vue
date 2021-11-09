<template>
    <el-dialog title="修改" :close-on-click-modal="false" :visible.sync="visible" class="el-dialog-enter" width="640px">
        <el-form :model="updateInfoDataForm" ref="updateInfoDataFormRef" :rules="updatetrules" label-width="150px">
            <el-form-item label="消息标题：" prop="title">
                <el-input v-model="updateInfoDataForm.title" placeholder="消息标题"></el-input>
            </el-form-item>
            <!-- <el-form-item label="消息类别：" prop="infoType">
                <el-input v-model="updateInfoDataForm.infoType" placeholder="消息类别"></el-input>
            </el-form-item> -->
            <el-form-item label="消息类别：" prop="infoType">
                <el-select v-model="updateInfoDataForm.infoType" placeholder="请选择消息类别">
                    <el-option :value="item.id" :label="item.type" v-for="(item,index) in infoTypeArr" :key="index">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发送对象：">
                <el-input type="textarea" v-model="updateInfoDataForm.sendObject" placeholder="发送对象" :rows="5" readonly></el-input>
            </el-form-item>
            <el-form-item label="消息内容：" prop="messCon">
                <el-input type="textarea" v-model="updateInfoDataForm.messCon" placeholder="消息内容" :rows="5"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()">提交修改审核</el-button>
        </span>
    </el-dialog>
</template>
<script>
    export default {
        data() {
            return {
                visible: false,
                updateInfoDataForm: {
                    title: '',
                    infoType: '',
                    sendObject: '',
                    messCon: '',
                    resource: '',
                    desc: ''
                },
                updatetrules: {
                    title: [
                        { required: true, message: '请填写消息标题', trigger: 'blur' }
                    ],
                    infoType: [
                        { required: true, message: '请选择消息类别', trigger: 'blur' }
                    ],
                    messCon: [
                        { required: true, message: '请填写消息内容', trigger: 'blur' }
                    ]
                },
                dataForm: {
                    id: ''
                },
                infoTypeArr: [
                    { id: '0', type: '系统消息' },
                    { id: '2', type: '活动通知' },
                    { id: '3', type: '故障通知' },
                    { id: '1', type: '更新通知' },
                ]
            }
        },
        methods: {
            updateShowInit(id) {
                this.dataForm.id = id
                this.visible = true;
                this.$http({
                    url: this.$http.adornUrl(`agent/message/my/detail?token=${this.$cookie.get('token')}&agentMessageId=${this.dataForm.id}`),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.updateInfoDataForm.title = data.data.title;
                        this.updateInfoDataForm.messCon = data.data.content;
                        this.updateInfoDataForm.infoType = data.data.noticeType + '';
                        this.updateInfoDataForm.sendObject = (data.data.customerMobileList).toString();
                    }
                })
                this.$nextTick(() => {
                    this.$refs['updateInfoDataFormRef'].resetFields()
                })
            },
            dataFormSubmit() {
                this.$refs['updateInfoDataFormRef'].validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: this.$http.adornUrl(`agent/message/my/update?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'agentMessageId': this.dataForm.id,
                                'title': this.updateInfoDataForm.title,
                                'message': this.updateInfoDataForm.messCon,
                                'type': this.updateInfoDataForm.infoType,
                            })
                        }).then(({ data }) => {
                            if (data && data.code === 0) {
                                this.$message({
                                    message: '消息已提交审核!',
                                    type: 'success',
                                    duration: 1500,
                                    onClose: () => {
                                        this.visible = false
                                        this.$emit('updateRefreshDataList')
                                    }
                                })
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    } else {
                        this.$message.error('请完善信息!')
                    }
                })
            }
        }
    }
</script>