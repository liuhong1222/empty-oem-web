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
                <el-form-item label="审核结果：" prop="auditRes" v-if="seeShow">
                    <el-input v-model="proAuditDataForm.auditRes" readonly></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="auditDesc" v-if="seeShow1">
                    <el-input type="textarea" v-model="proAuditDataForm.auditDesc" readonly></el-input>
                </el-form-item>
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
                    <el-button type="primary" @click="proAuditDataSubmit()">确定</el-button>
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
                    // serverUrl: 'http://172.16.4.242:9999/open/agent/ueditor?token=' + `${this.$cookie.get('token')}`
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
                if (stu == "audit") {
                    this.title = "审核"
                    this.auditShow = true;
                    this.seeShow = false;
                    this.seeShow1 = false;
                    this.showBnt = true;
                    this.$nextTick(() => {
                        this.$refs['proAuditDataRef'].resetFields();
                    })
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

                this.$http({
                    url: this.$http.adornUrl(`agent/product/findById?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'id': this.proAuditDataForm.id + ''
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.defaultMsgCon = data.data.product_content;
                        if (data.data.jump_mode == 1) { //内部
                            this.linkUrl = false;
                            this.editCon = true
                        } else {
                            this.linkUrl = true;
                            this.editCon = false
                        }
                        if (data.data.audit_status == 2 || data.data.audit_status == 4) {
                            this.seeShow1 = true;
                        } else if (data.data.audit_status == 1) {
                            this.seeShow1 = false;
                        }
                        this.proAuditDataForm.agentName = data.data.agentName;
                        this.proAuditDataForm.proLineName = data.data.productLineName;
                        this.proAuditDataForm.proName = data.data.product_name;
                        this.proAuditDataForm.describe = data.data.product_desc;
                        this.iconsImageUrl = imgUrl.imgUrl + data.data.icon_path;
                        this.proAuditDataForm.status = data.data.shelf_status == 0 ? '下架' : '上架';
                        this.proAuditDataForm.sort = data.data.order_num;
                        this.proAuditDataForm.methods = data.data.jump_mode == 1 ? '内部编辑' : '外部编辑';
                        this.proAuditDataForm.linkUrl = data.data.link_url;
                        this.proAuditDataForm.auditRes = data.data.auditStatus;
                        this.proAuditDataForm.auditDesc = data.data.remark;

                    }
                })

            },
            proAuditDataSubmit() {
                this.$refs['proAuditDataRef'].validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: this.$http.adornUrl(`agent/product/updateStatus?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'status': this.proAuditDataForm.resource,
                                'id': this.proAuditDataForm.id,
                                'remark': this.proAuditDataForm.bhdesc
                            })
                        }).then(({ data }) => {
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
                if (this.$refs.ue.hasContent) {   //判断是否有内容
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