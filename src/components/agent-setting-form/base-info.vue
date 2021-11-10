<template>
    <el-form
        :inline="true"
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="110px"
    >
        <el-form-item label="代理商编号：" prop="agentId">
            <el-input v-model="formData.agentId" placeholder="请输入商户编号" disabled></el-input>
        </el-form-item>
        <el-form-item label="代理商名称：" prop="agentName">
            <el-input v-model="formData.agentName" placeholder="请输入代理商名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="logo：" id="logoImgSize" prop="agentLogo">
            <el-upload
                class="upload-demo"
                drag
                :show-file-list="true"
                name="file"
                :action="actionLogo()"
                :on-success="handleAvatarSuccessLogo"
                :on-error="errorLogo"
                :on-progress="onProgressLogo"
                :before-upload="beforeAvatarUploadLogo"
                :data="logoQueryParams"
                enctype="multipart/form-data"
                :limit="1"
            >
                <img
                    v-if="logoUrl"
                    :src="logoUrl"
                    class="avatar"
                />
                <i class="el-icon-plus"></i>
                <div class="el-upload__tip" slot="tip">
                    要求为背景透明的png格式，且不超过2M，长140px，宽36px，（再次上传请删除上一次上传）
                </div>
                <input type="hidden" v-model="logoUrl" />
            </el-upload>
        </el-form-item>
        <el-form-item label="icon：" id="iconImgSize" prop="agentIcon">
            <el-upload
                class="upload-demo"
                drag
                :show-file-list="true"
                :on-success="handleAvatarSuccessIcon"
                :on-progress="onProgressIcon"
                :before-upload="beforeAvatarUploadIcon"
                :action="actionIcon()"
                :data="iconQueryParams"
                :on-error="errorIcon"
            >
                <img
                    v-if="iconUrl"
                    :src="iconUrl"
                    class="avatar"
                    :limit="1"
                />
                <i class="el-icon-plus"></i>
                <div class="el-upload__tip" slot="tip">
                    要求为背景透明的png格式，且不超过2M，长40px，宽40px，（再次上传请删除上一次上传）
                </div>
                <input type="hidden" v-model="iconUrl" />
            </el-upload>
        </el-form-item>
        <el-form-item label="代表签字：" prop="deputySignature">
            <el-upload
                class="upload-demo"
                drag
                :show-file-list="true"
                name="file"
                :action="actionSignatures()"
                :on-success="handleAvatarSuccessSignatures"
                :on-error="errorSignatures"
                :on-progress="onProgressSignatures"
                :before-upload="beforeAvatarUploadSignatures"
                :data="SignaturesQueryParams"
                enctype="multipart/form-data"
                :limit="1"
            >
                <img
                    v-if="signUrl"
                    :src="signUrl"
                    class="avatar"
                />
                <i class="el-icon-plus"></i>
                <div class="el-upload__tip" slot="tip">
                    要求为背景透明的png格式，且不超过2M，长1261px，宽482px，（再次上传请删除上一次上传）
                </div>
                <input type="hidden" v-model="signUrl" />
            </el-upload>
        </el-form-item>
        <el-form-item label="公司红章：" prop="companyChop">
            <el-upload
                class="upload-demo"
                drag
                :show-file-list="true"
                name="file"
                :action="actionChapter()"
                :on-success="handleAvatarSuccessChapter"
                :on-error="errorChapter"
                :on-progress="onProgressChapter"
                :before-upload="beforeAvatarUploadChapter"
                :data="ChapterQueryParams"
                enctype="multipart/form-data"
                :limit="1"
            >
                <img
                    v-if="sealUrl"
                    :src="sealUrl"
                    class="avatar"
                />
                <i class="el-icon-plus"></i>
                <div class="el-upload__tip" slot="tip">
                    要求为背景透明的png格式，且不超过2M，长169px，宽168px，（再次上传请删除上一次上传）
                </div>
                <input type="hidden" v-model="sealUrl" />
            </el-upload>
        </el-form-item>
        <el-form-item label="短信签名：" prop="smsSignature">
            <el-input placeholder="请输入短信签名" v-model="formData.smsSignature"></el-input>
        </el-form-item>
        <el-form-item label="代理商域名：" prop="domain">
            <el-input placeholder="请输入代理商域名" v-model="formData.domain"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import imgUrl from '@/utils/imgUrl'
export default {
    name: "BaseInfo",
    data() {
        return {
            formData: {},
            rules: {
                agentId: [
                    { required: true, message: '请输入代理商编号', trigger: 'blur' }
                ],
                agentIcon: [
                    { required: true, message: '请上传icon', trigger: 'blur' }
                ],
                agentLogo: [
                    { required: true, message: '请上传logo', trigger: 'blur' }
                ],
                deputySignature: [
                    { required: true, message: '请上传代表签字', trigger: 'blur' }
                ],
                companyChop: [
                    { required: true, message: '请上传公司红章', trigger: 'blur' }
                ],
                agentName: [
                    { required: true, message: '请输入代理商名称', trigger: 'blur' }
                ],
                smsSignature: [
                    { required: true, message: '请输入短信签名', trigger: 'blur' }
                ],
                domain: [
                    { required: true, message: '请输入代理商域名', trigger: 'blur' }
                ]
            },
            logoQueryParams: {  // logo 上传参数
                imageType: 3,
                agentId: null,
                file: null
            },
            iconQueryParams: { // icon 上传参数
                imageType: 4,
                agentId: null,
                file: null
            },
            SignaturesQueryParams: { // 代表签字上传参数
                imageType: 1,
                agentId: null,
                file: null
            },
            ChapterQueryParams: { // 公司红章上传参数
                imageType: 2,
                agentId: null,
                file: null
            },
            logoUrl: '', // logo 预览地址
            iconUrl: '', // icon 预览地址
            signUrl: '', // sign 预览地址
            sealUrl: '', // seal 预览地址
        };
    },
    methods: {
        init(initData) {
            this.logoUrl = ''
            this.iconUrl = ''
            this.signUrl = ''
            this.sealUrl = ''
            this.formData = {
                ...initData
            }
        },
        /******* 上传 执行顺序：beforeAvatarUpload ---执行 action 提交----执行 handleAvatarSuccess or uploadError **********/
        /********** logo **********/
        beforeAvatarUploadLogo(file) {
            const isJPG = (file.type == 'image/png');
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error("上传logo图片只能是背景为透明的png 格式!");
                return false;
            }
            if (!isLt2M) {
                this.$message.error("上传logo图片大小不能超过 2MB!");
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
                        if (width !== 140) {
                            _this.$alert('图片长必须为140!', '提示', { confirmButtonText: '确定' });
                            reject();
                        }
                        if (height !== 36) {
                            _this.$alert('图片宽必须为36!', '提示', { confirmButtonText: '确定' });
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
        actionLogo() {
            let url = this.$http.adornUrl(`file/image/upload?token=${this.$cookie.get('token')}`);
            return url;
        },
        onProgressLogo() {
            console.log("上传中");
        },
        handleAvatarSuccessLogo(res, file) {
            this.logoUrl = URL.createObjectURL(file.raw)
            this.formData.agentLogo = res.data.licenseUrl
        },
        errorLogo() {
            console.log("上传失败");
        },
        /********** icon **********/
        beforeAvatarUploadIcon(file) {
            const isJPG = (file.type == 'image/png');
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error("上传icon图片只能是背景为透明的png 格式!");
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
                        if (width !== 40) {
                            _this.$alert('图片长必须为40!', '提示', { confirmButtonText: '确定' });
                            reject();
                        }
                        if (height !== 40) {
                            _this.$alert('图片宽必须为40!', '提示', { confirmButtonText: '确定' });
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
        actionIcon() {
            let url = this.$http.adornUrl(`file/image/upload?token=${this.$cookie.get('token')}`);
            return url;
        },
        onProgressIcon() {
            console.log("上传中");
        },
        handleAvatarSuccessIcon(res, file) {
            this.formData.agentIcon = res.data.licenseUrl
            this.iconUrl = URL.createObjectURL(file.raw);
        },
        errorIcon() {
            console.log("上传失败");
        },
        /********** 代表签字 **********/
        beforeAvatarUploadSignatures(file) {
            const isJPG = (file.type == 'image/png');
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error("上传代表签字图片只能是背景为透明的png 格式!");
                return false;
            }
            if (!isLt2M) {
                this.$message.error("上传代表签字图片大小不能超过 2MB!");
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
                        if (width !== 1261) {
                            _this.$alert('图片长必须为1261!', '提示', { confirmButtonText: '确定' });
                            reject();
                        }
                        if (height !== 482) {
                            _this.$alert('图片宽必须为482!', '提示', { confirmButtonText: '确定' });
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
        actionSignatures() {
            let url = this.$http.adornUrl(`file/image/upload?token=${this.$cookie.get('token')}`);
            return url;
        },
        onProgressSignatures() {
            console.log("上传中");
        },
        handleAvatarSuccessSignatures(res, file) {
            this.formData.deputySignature = res.data.licenseUrl
            this.signUrl = URL.createObjectURL(file.raw);
        },
        errorSignatures() {
            console.log("上传失败");
        },
        /********** 公司红章 **********/
        beforeAvatarUploadChapter(file) {
            const isJPG = (file.type === 'image/jpeg') || (file.type == 'image/png') || (file.type == 'image/jpg');
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error("上传公司红章图片只能是背景为透明的png 格式!");
                return false;
            }
            if (!isLt2M) {
                this.$message.error("上传公司红章图片大小不能超过 2MB!");
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
                        if (width !== 169) {
                            _this.$alert('图片长必须为169!', '提示', { confirmButtonText: '确定' });
                            reject();
                        }
                        if (height !== 168) {
                            _this.$alert('图片宽必须为168!', '提示', { confirmButtonText: '确定' });
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
        actionChapter() {
            let url = this.$http.adornUrl(`file/image/upload?token=${this.$cookie.get('token')}`);
            return url;
        },
        onProgressChapter() {
            console.log("上传中");
        },
        handleAvatarSuccessChapter(res, file) {
            this.formData.companyChop = res.data.licenseUrl
            this.sealUrl = URL.createObjectURL(file.raw);
        },
        errorChapter() {
            console.log("上传失败");
        },
    },
};
</script>

<style lang="scss" scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    .el-dialog {
        width: 55% !important;
        min-width: 750px;
    }

    .settingSteps .el-step__head.is-process,
    .settingSteps .is-success,
    .settingSteps .is-process,
    .settingSteps .el-step__head.is-finish {
        color: #3e8ef7;
        border-color: #3e8ef7;
    }

    .essentialInformation,
    .domainNameFiling,
    .customerInformation,
    .contractInformation,
    .alipayIInformation,
    .weixinLoginInfo,
    .weixinInformation {
        min-width: 350px;
        min-height: 500px;
        margin: 0 auto;

        >.el-form {
            padding: 30px 30px;
        }
    }

    .el-upload-dragger {
        width: 174px;
        height: 182px;
    }

    .main {
        background-color: #fff;
        padding-top: 35px
    }

    .main .noborder .el-input__inner {
        border: none
    }

    .seeBasic .el-collapse-item__header {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 20px;
        margin-left: 20px
    }

    .seeBasic .el-input__inner,
    .seeBasic .el-textarea__inner {
        border: none
    }

    .seeBasic .el-collapse-item__wrap {
        padding-left: 20px
    }

    #iconImgSize .el-upload-dragger {
        width: 40px;
        height: 40px;
        font-size: 24px;
        line-height: 40px;
    }

    #iconImgSize .el-upload-dragger .avatar {
        width: 40px;
        height: 40px;
    }

    #logoImgSize .el-upload-dragger {
        width: 150px;
        height: 50px;
        line-height: 50px;
        font-size: 24px;
    }

    #logoImgSize .el-upload-dragger .avatar {
        width: 150px;
        height: 50px;
    }

    .el-upload-dragger {
        width: 174px;
        height: 182px;
        font-size: 24px;
        color: #999;
        line-height: 182px;
    }

    #logoseeImg .el-upload,
    #logoseeImg .el-upload .avatar {
        width: 150px;
        height: 50px;
    }

    #iconseeImg .el-upload,
    #iconseeImg .el-upload .avatar {
        width: 40px;
        height: 40px;
    }

    .delWXimg {
        position: absolute;
        left: 190px;
        top: 79px;
        z-index: 999;
    }

    .delWXimg img {
        vertical-align: text-top !important;
        cursor: pointer;
    }
</style>