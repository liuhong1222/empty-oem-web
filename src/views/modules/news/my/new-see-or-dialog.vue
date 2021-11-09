<template>
    <div class="auditSee">
        <el-dialog title="查看" :close-on-click-modal="false" :visible.sync="visible" width="1078px" :before-close="closeNewsSeeDialod">
            <el-form :model="newsSeeForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="新闻标题:">
                    <el-input v-model="newsSeeForm.newsTitle" readonly></el-input>
                </el-form-item>
                <el-form-item label="新闻内容:">
                    <UE v-bind:defaultMsg="defaultMsgCon" :config="config" ref="ue"></UE>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import UE from '../../../../components/ue/ue1.vue';
    export default {
        components: { UE },
        data() {
            return {
                visible: false,
                newsSeeForm: {
                    newsTitle: '',
                },
                dataForm: {
                    id: ''
                },
                defaultMsgCon: '',
                config: {
                    initialFrameWidth: '100%',
                    initialFrameHeight: 350,
                    autoFloatEnabled: false,
                    toolbars: [],
                    readonly: true,
                    elementPathEnabled: false,
                },
            }
        },
        methods: {
            showInit(id) {
                this.dataForm.id = id
                this.visible = true;
                this.$http({
                    url: this.$http.adornUrl(`agent/news/my/detail?token=${this.$cookie.get('token')}&newsId=${this.dataForm.id}`),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.newsSeeForm.newsTitle = data.data.title || '';
                        this.defaultMsgCon = data.data.content || '';
                    }
                })
            },
            closeNewsSeeDialod() {
                this.visible = false;
                this.defaultMsgCon = '';
                this.newsSeeForm.newsTitle = '';
                if (this.$refs.ue.hasContent) {   //判断是否有内容
                    this.$refs.ue.execCommand()
                }
            }
        }
    }
</script>

<style>
    .auditSee .edui-default .edui-editor-bottomContainer {
        display: none;
    }

    .auditSee .el-input,
    .auditSee .el-input__inner {
        width: 100%;
    }
    .auditSee #editor1 {
        margin-top: 7px;
    }
</style>