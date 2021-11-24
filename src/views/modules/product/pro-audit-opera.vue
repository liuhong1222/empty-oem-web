<template>
    <div>
        <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="visible" width="550px" :before-close="closeNewsSeeDialod">
            <el-form :model="proAuditDataForm" label-width="100px" :rules="proAuditDataRules" ref="proAuditDataRef"
                class="demo-ruleForm">
                <el-form-item label="代理商名称：">
                    <el-input v-model="proAuditDataForm.agentName" readonly></el-input>
                </el-form-item>
                <el-form-item label="产品线名称：">
                    <el-input v-model="proAuditDataForm.proLineName" readonly></el-input>
                </el-form-item>
                <el-form-item label="产品名称：">
                    <el-input v-model="proAuditDataForm.proName" readonly></el-input>
                </el-form-item>
                <el-form-item label="描述：">
                    <el-input type="textarea" v-model="proAuditDataForm.describe" readonly></el-input>
                </el-form-item>
                <el-form-item label="icon：" id="iconseeImgPro">
                    <el-upload class="avatar-uploader" action="" :show-file-list="false" disabled>
                        <img v-if="iconsImageUrl" :src="iconsImageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item label="状态：">
                    <el-input v-model="proAuditDataForm.status" readonly></el-input>
                </el-form-item>
                <el-form-item label="排序：">
                    <el-input v-model="proAuditDataForm.sort" readonly></el-input>
                </el-form-item>
                <el-form-item label="跳转方式：">
                    <el-input v-model="proAuditDataForm.methods" readonly></el-input>
                </el-form-item>
                <el-form-item label="链接地址：" v-if="linkUrl">
                    <el-input v-model="proAuditDataForm.linkUrl" readonly></el-input>
                </el-form-item>
                <el-form-item label="编辑内容:" v-if="editCon"> 
                    <UE v-bind:defaultMsg="defaultMsgCon" :config="config" ref="ue"></UE>
                </el-form-item>
                <!-- 查看 -->
                <!-- <el-form-item label="审核结果：" prop="auditRes" v-if="seeShow">
                    <el-input v-model="proAuditDataForm.auditRes" readonly></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="auditDesc" v-if="seeShow1">
                    <el-input type="textarea" v-model="proAuditDataForm.auditDesc" readonly></el-input>
                </el-form-item> -->
                <!-- 审核 -->
                <el-form-item label="审核结果：" prop="resource" style="margin-left: 30px" v-if="auditShow">
                    <el-radio-group v-model="proAuditDataForm.resource" @change="auditChangeHandler">
                        <el-radio :label="3">通过</el-radio>
                        <el-radio :label="4">驳回</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="驳回原因：" prop="bhdesc" v-if="auditDisable" style="margin-left: 30px">
                    <el-input type="textarea" v-model="proAuditDataForm.bhdesc"></el-input>
                </el-form-item>

                <el-form-item v-if="showBnt">
                    <el-button type="info" plain @click="closeNewsSeeDialod()">取消</el-button>
                    <el-button type="primary" :loading="submitLoading" @click="proAuditDataSubmit()">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import UE from '../../../components/ue/ue5.vue';
    import imgUrl from '@/utils/imgUrl'
    export default {
        components: { UE },
        data() {
            return {
                submitLoading: false,
                auditDisable: false,
                seeShow: false,
                seeShow1: false,
                auditShow: false,
                showBnt: false,
                linkUrl: false,
                editCon: true,
                defaultMsgCon: '',
                title: '',
                config: {
                    initialFrameWidth: '100%',
                    initialFrameHeight: 350,
                    autoFloatEnabled: false,
                    toolbars: [],
                    readonly: true,
                    elementPathEnabled: false,
                },
                visible: false,
                iconsImageUrl: '',
                proAuditDataForm: {
                    agentName: '',
                    proLineName: '',
                    proName: '',
                    describe: '',
                    status: '',
                    sort: '',
                    methods: '',
                    linkUrl: '',
                    resource: '',
                    bhdesc: '',
                    auditRes: '',
                    auditDesc: '',
                    id: ''
                },
                proAuditDataRules: {
                    resource: [
                        { required: true, message: '请选择状态', trigger: 'blur' }
                    ],
                    bhdesc: [
                        { required: true, message: '请输入驳回原因', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            showInit(id, stu) {
                this.proAuditDataForm.id = id
                // this.$nextTick(() => {
                //     this.$refs['proAuditDataRef'].resetFields();
                // })
                this.proAuditDataForm.resource = undefined
                this.proAuditDataForm.bhdesc = undefined
                if (stu == "audit") {
                    this.title = "审核"
                    this.auditShow = true;
                    this.auditDisable = false;
                    this.seeShow = false;
                    this.seeShow1 = false;
                    this.showBnt = true;
                } else {
                    this.title = "查看";
                    this.auditShow = false;
                    this.auditDisable = false;
                    this.seeShow = true;
                    this.seeShow1 = true;
                    this.showBnt = false;
                }
                this.iconsImageUrl = "";
                this.defaultMsgCon = ""
                this.visible = true;
                this.submitLoading = false
                this.$http({
                    url: this.$http.adornUrl(`agent/product/findById?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'id': this.proAuditDataForm.id + ''
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.defaultMsgCon = data.data.content;
                        if (data.data.redirect_way == 0) { //内部
                            this.linkUrl = false;
                            this.editCon = true
                        } else {
                            this.linkUrl = true;
                            this.editCon = false
                        }
                        this.proAuditDataForm.agentName = data.data.agentName;
                        this.proAuditDataForm.proLineName = data.data.productGroupName;
                        this.proAuditDataForm.proName = data.data.name;
                        this.proAuditDataForm.describe = data.data.description;
                        this.iconsImageUrl = this.$imgPreStr + data.data.icon;
                        this.proAuditDataForm.status = data.data.state === 0 ? '下架' : '上架';
                        this.proAuditDataForm.sort = data.data.sort;
                        this.proAuditDataForm.methods = data.data.redirectWay;
                        this.proAuditDataForm.linkUrl = data.data.external_links;
                        this.proAuditDataForm.auditRes = data.data.applyState;
                        this.proAuditDataForm.auditDesc = data.data.remark;
                    }
                })

            },
            proAuditDataSubmit() {
                this.$refs['proAuditDataRef'].validate((valid) => {
                    if (valid) {
                        this.submitLoading = true
                        this.$http({
                            url: this.$http.adornUrl(`agent/product/updateStatus?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'status': this.proAuditDataForm.resource,
                                'id': this.proAuditDataForm.id + '',
                                'remark': this.proAuditDataForm.bhdesc
                            })
                        }).then(({ data }) => {
                            this.submitLoading = false
                            if (data && data.code === 0) {
                                this.$message.success('成功')
                                this.visible = false
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
                this.defaultMsgCon = ""
                if (this.$refs.ue && this.$refs.ue.hasContent) {   //判断是否有内容
                    this.$refs.ue.execCommand()
                }
            },
            auditChangeHandler(val) {
                if (val == 4) {
                    this.auditDisable = true
                } else {
                    this.auditDisable = false
                    this.proAuditDataForm.bhdesc = ""
                }
            },
        }
    }
</script>

<style>
    /* #iconseeImgPro .el-upload,
    #iconseeImgPro .el-upload .avatar {
        width: 150px;
        height: 50px;
    } */
    #iconImgSize .el-upload-dragger {
        width: 100px;
        height: 100px;
    }

    #iconImgSize .el-upload-dragger {
        width: 100px;
        height: 100px;
        font-size: 24px;
        line-height: 100px;
    }

    #iconImgSize .el-upload-dragger .avatar {
        width: 100px;
        height: 100px;
    }
</style>