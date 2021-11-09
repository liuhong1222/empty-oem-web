<template>
    <el-dialog title="查看" :close-on-click-modal="false" :visible.sync="visible" class="el-dialog-enter" width="599px">
        <el-form :model="seeAuditDataForm" ref="seeAuditDataFormRef" label-width="105px" :label-position="labelPosition">
            <el-form-item label="消息标题：">
                <el-input v-model="seeAuditDataForm.title" placeholder="消息标题" readonly></el-input>
            </el-form-item>
            <el-form-item label="消息类别：">
                <el-input v-model="seeAuditDataForm.infoType" placeholder="消息类别" readonly></el-input>
            </el-form-item>
            <el-form-item label="发送对象：">
                <el-input type="textarea" v-model="seeAuditDataForm.sendObject" placeholder="发送对象" :rows="10" readonly></el-input>
            </el-form-item>
            <el-form-item label="消息内容：">
                <el-input type="textarea" v-model="seeAuditDataForm.messCon" placeholder="消息内容" :rows="5" readonly></el-input>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>

    export default {
        data() {
            return {
                visible: false,
                seeAuditDataForm: {
                    title: '',
                    infoType: '',
                    sendObject: '',
                    messCon: ''
                },
                dataForm: {
                    id: ''
                },
                labelPosition: 'right',
            }
        },
        methods: {
            showInit(id, type) {
                this.dataForm.id = id
                this.visible = true;
                this.$http({
                    url: this.$http.adornUrl(`agent/message/my/detail?token=${this.$cookie.get('token')}&agentMessageId=${this.dataForm.id}`),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.seeAuditDataForm.title = data.data.title;
                        this.seeAuditDataForm.messCon = data.data.content;
                        this.seeAuditDataForm.infoType = data.data.noticeTypeName;
                        var str = "";
                        for (var i = 0; i < data.data.customerMobileList.length; i++) {
                            data.data.customerMobileList[i] += ','
                            if (i % 3 == 0 && i !== 0) {
                                str += "\n"
                            }
                            if (str.substr(0, 1) == '，')
                                str = str.substr(1);  //去掉第一个一个符号
                            str += data.data.customerMobileList[i];
                        }
                        str = str.slice(0, str.length - 1)  //去掉最后一个符号
                        this.seeAuditDataForm.sendObject = str
                    }
                })
            }
        }
    }

</script>
<style lang="scss">
</style>