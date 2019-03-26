<template>
    <div class="updateInput">
        <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" width="1078px"
            :before-close="closeNewsDialod">
            <el-form :model="newsForm" :rules="newsRules" ref="newsRuleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="新闻标题" prop="newsTitle">
                    <el-input v-model="newsForm.newsTitle"></el-input>
                </el-form-item>
                <el-form-item label="新闻内容" prop="newsContent">
                    <el-input type="hidden" v-model="newsForm.newsContent"></el-input>
                    <UE v-bind:defaultMsg="defaultMsgCon" :config=config ref="ue"></UE>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="getUEContentBtn()" id="submitCon">提交发布申请</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import UE from '../../../../components/ue/ue.vue';
    export default {
        components: { UE },
        data() {
            return {
                visible: false,
                defaultMsgCon: '',
                config: {
                    initialFrameWidth: '100%',
                    initialFrameHeight: 350,
                    autoFloatEnabled: false,
                    elementPathEnabled: false,
                    // serverUrl: 'http://172.16.4.242:9999/open/agent/ueditor?token=' + `${this.$cookie.get('token')}`
                },
                dataForm: {
                    id: ''
                },
                newsForm: {
                    newsTitle: '',
                    newsContent: ''
                },
                newsRules: {
                    newsTitle: [
                        { required: true, message: '请输新闻标题!', trigger: 'blur' },
                    ],
                    newsContent: [
                        { required: true, message: '请输入新闻内容!', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            showInit(id) {
                this.dataForm.id = id || 0
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs['newsRuleForm'].resetFields()
                })
                $("#submitCon").html('提交发布申请')
                if (this.dataForm.id) {
                    $("#submitCon").html('提交修改申请')
                    this.$http({
                        url: this.$http.adornUrl(`agent/news/my/detail?token=${this.$cookie.get('token')}&newsId=${this.dataForm.id}`),
                        method: 'get',
                        params: this.$http.adornParams()
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.newsForm.newsTitle = data.data.title;
                            this.defaultMsgCon = data.data.message;
                        }
                    })
                }
            },
            // 确认发布
            getUEContentBtn() {
                if (this.$refs.ue.hasContent) {   //判断是否有内容
                    this.newsForm.newsContent = this.$refs.ue.getUEContentMsj()
                }
                this.$refs['newsRuleForm'].validate((valid) => {
                    if (valid) {
                        let content = this.$refs.ue.getUEContentMsj();
                        // 不带标签
                        let noLableCon = this.$refs.ue.getContentTxtMsj();
                        // console.log(noLableCon)
                        // if (content == "") {
                        //     this.$message({
                        //         message: '请输入新闻内容',
                        //         type: 'warning'
                        //     });
                        //     return;
                        // }
                        this.$http({
                            url: this.$http.adornUrl(`agent/news/my/${!this.dataForm.id ? 'save' : 'update'}?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'newsId': this.dataForm.id || undefined,
                                'title': this.newsForm.newsTitle,
                                'message': content,
                                'newsContent': noLableCon
                            })
                        }).then(({ data }) => {
                            if (data && data.code === 0) {
                                this.$message.success('新闻发布成功!');
                                this.newsForm.newsTitle = "";
                                this.$refs.ue.execCommand();
                                this.visible = false;
                                this.$emit('refreshNewsList')
                            } else {
                                // this.$refs.ue.execCommand();
                                // this.newsForm.newsTitle = "";
                                this.$message.error(data.msg);
                            }
                        })
                    }
                })

            },
            closeNewsDialod() {
                this.visible = false;
                // this.$refs.ue.execCommand();
                this.defaultMsgCon = ""
                this.newsForm.newsTitle = "";
                if (this.$refs.ue.hasContent) {   //判断是否有内容
                    // alert(33333)
                    this.$refs.ue.execCommand()
                }
            }
        }
    }
</script>
<style>
    .updateInput .el-input,
    .updateInput .el-input__inner {
        width: 100%;
    }

    .updateInput .el-form-item__content {
        line-height: 25px;

    }

    .updateInput #editor {
        margin-top: -15px;
    }
</style>