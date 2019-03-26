<template>
    <div>
        <el-dialog title="审核/查看" :close-on-click-modal="false" :visible.sync="visible" width="550px" :before-close="closeNewsSeeDialod">
            <el-form :model="proAuditDataForm" label-width="100px" :rules="proAuditDataRules" ref="proAuditDataRef"
                class="demo-ruleForm">
                <el-form-item label="代理商名称：">
                    <el-input v-model="proAuditDataForm.agentName"></el-input>
                </el-form-item>
                <el-form-item label="产品线名称：">
                    <el-input v-model="proAuditDataForm.proLineName"></el-input>
                </el-form-item>
                <el-form-item label="产品名称：">
                    <el-input v-model="proAuditDataForm.proName"></el-input>
                </el-form-item>
                <el-form-item label="描述：">
                    <el-input type="textarea" v-model="proAuditDataForm.describe"></el-input>
                </el-form-item>
                <el-form-item label="icon：" id="iconseeImgPro">
                    <el-upload class="avatar-uploader" action="" :show-file-list="false" disabled>
                        <img v-if="iconsImageUrl" :src="logoImageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                
                <el-form-item label="状态：">
                    <el-input v-model="proAuditDataForm.status"></el-input>
                </el-form-item>
                <el-form-item label="排序：">
                    <el-input v-model="proAuditDataForm.sort"></el-input>
                </el-form-item>
                <el-form-item label="跳转方式：">
                    <el-input v-model="proAuditDataForm.methods"></el-input>
                </el-form-item>
                <el-form-item label="新闻内容:">
                    <UE v-bind:defaultMsg="defaultMsgCon" :config=config ref="ue"></UE>
                </el-form-item>
                <!-- 审核 -->
                <el-form-item label="审核结果：" prop="resource" style="margin-left: 30px">
                    <el-radio-group v-model="proAuditDataForm.resource" @change="auditChangeHandler">
                        <el-radio :label="1">通过</el-radio>
                        <el-radio :label="3">驳回</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="驳回原因：" prop="bhdesc" v-if="auditDisable" style="margin-left: 30px">
                    <el-input type="textarea" v-model="proAuditDataForm.bhdesc"></el-input>
                </el-form-item>
                <!-- 查看 -->
                <el-form-item label="审核结果：">
                    <el-input v-model="proAuditDataForm.auditRes"></el-input>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="proAuditDataForm.auditDesc"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" plain>取消</el-button>
                    <el-button type="primary" @click="proAuditDataSubmit()">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import UE from '../../../components/ue/ue2.vue';
    export default {
        components: { UE },
        data() {
            return {
                auditDisable: false,
                defaultMsgCon: '',
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
                    describe: '',
                    status: '',
                    sort: '',
                    methods: '',
                    resource: '',
                    bhdesc: '',
                    auditRes: '',
                    auditDesc: ''
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
            showInit() {
                this.iconsImageUrl = "";
                this.visible = true;
                
                this.$nextTick(() => {
                    this.$refs['proAuditDataRef'].resetFields()
                })
            },
            proAuditDataSubmit() {
                this.$refs['proAuditDataRef'].validate((valid) => {
                    if (valid) {
                        console.log('通过')
                    }
                })
            },
            closeNewsSeeDialod() {
                this.visible = false;
            },
            auditChangeHandler(val) {
                if (val == 3) {
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
    #iconseeImgPro .el-upload,
    #iconseeImgPro .el-upload .avatar {
        width: 150px;
        height: 50px;
    }
</style>