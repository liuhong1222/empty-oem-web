<template>
    <div>
        <el-dialog title="添加/编辑" :close-on-click-modal="false" :visible.sync="visible" width="850px" :before-close="closeNewsSeeDialod">
            <el-form :model="peoAUDataForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="产品线名称：">
                    <el-input v-model="peoAUDataForm.proLineName"></el-input>
                </el-form-item>
                <el-form-item label="产品名称：">
                    <el-input v-model="peoAUDataForm.proName"></el-input>
                </el-form-item>
                <el-form-item label="产品名称：">
                    <el-input v-model="peoAUDataForm.proName"></el-input>
                </el-form-item>
                <el-form-item label="描述：">
                    <el-input type="textarea" v-model="peoAUDataForm.describe"></el-input>
                </el-form-item>
                <el-form-item label="icon" id="iconImgSize" prop="imageUrlIcon">
                    <el-upload class="upload-demo" drag :show-file-list="true" :on-success="handleAvatarSuccessIcon"
                        :on-progress="onProgressIcon" :before-upload="beforeAvatarUploadIcon" :action="actionIcon()"
                        :data="iconQueryParams" :on-error="errorIcon">
                        <img v-if="peoAUDataForm.imageUrlIcon" :src="peoAUDataForm.imageUrlIcon" class="avatar" :limit="1">
                        <i class="el-icon-plus"></i>
                        <div class="el-upload__tip" slot="tip">要求为背景透明的png格式，且不超过2M，长100px，宽100px，（再次上传请删除上一次上传）</div>
                        <input type="hidden" v-model="peoAUDataForm.imageUrlIcon" />
                    </el-upload>
                </el-form-item><br />
                <el-form-item label="状态：">
                    <el-select v-model="peoAUDataForm.status" placeholder="请选择审核状态">
                        <el-option v-for="(item,index) in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序：">
                    <el-input-number v-model="peoAUDataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
                </el-form-item>
                <el-form-item label="特殊资源">
                    <el-radio-group v-model="peoAUDataForm.methods">
                        <el-radio label="内部编辑"></el-radio>
                        <el-radio label="外部地址"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="链接地址：">
                    <el-input v-model="peoAUDataForm.adress"></el-input>
                </el-form-item>
                <el-form-item label="新闻内容" prop="content">
                    <el-input type="hidden" v-model="peoAUDataForm.content"></el-input>
                    <UE v-bind:defaultMsg="defaultMsgCon" :config=config ref="ue"></UE>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" plain>取消</el-button>
                    <el-button type="primary">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import UE from '../../../components/ue/ue4.vue';
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
                peoAUDataForm: {
                    proLineName: '',
                    proName: '',
                    describe: '',
                    status: '',
                    orderNum: '',
                    methods: '',
                    adress: '',
                    imageUrlIcon: '',
                    content: ''
                },
                statusArr: [
                    { label: '上架', value: 1 },
                    { label: '下架', value: 2 }
                ],
                iconQueryParams: { //icon上传参数
                    imageType: 4,
                    agentId: null,
                    file: null
                },
            }
        },
        methods: {
            showInit() {
                this.visible = true;
            },
            closeNewsSeeDialod() {
                this.visible = false;
            },
            // 上传icon
            actionIcon() {
                let url = this.$http.adornUrl(`file/image/upload?token=${this.$cookie.get('token')}&imageType=4`);
                return url;
            },
            errorIcon() {
                console.log("yyyyyy");
            },
            onProgressIcon() {
                console.log("上传中");
            },
            beforeAvatarUploadIcon(file) {
                const isJPG = (file.type == 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error("上传icon图片只能是背景透明的 png 格式!");
                    return false;
                }
                if (!isLt2M) {
                    this.$message.error("上传icon图片大小不能超过 2MB!");
                    return false;
                }
                var _this = this;
                const imgSize = new Promise(function (resolve, reject) {
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var image = new Image();
                        image.onload = function () {
                            var width = this.width;
                            var height = this.height;
                            if (width !== 100) {
                                _this.$alert('图片长必须为100!', '提示', { confirmButtonText: '确定' });
                                reject();
                            }
                            if (height !== 100) {
                                _this.$alert('图片宽必须为100!', '提示', { confirmButtonText: '确定' });
                                reject();
                            }
                            resolve();
                        };
                        image.src = event.target.result;
                    }
                    reader.readAsDataURL(file);
                });

                return isJPG && isLt2M && imgSize;
            },
            handleAvatarSuccessIcon(res, file) {
                this.iconUrl = res.data.licenseUrl
                this.peoAUDataForm.imageUrlIcon = URL.createObjectURL(file.raw);
            },
        }
    }
</script>

<style>
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