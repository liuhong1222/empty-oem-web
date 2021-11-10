<template>
    <el-form
        :inline="true"
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="110px"
    >
        <el-form-item label="浏览器右侧显示：" prop="browserRightDisplay">
            <el-switch v-model="formData.browserRightDisplay" @change="changeSwitch()"></el-switch>
        </el-form-item>
        <el-form-item label="客服昵称：" prop="kefuNickname">
            <el-input v-model="formData.kefuNickname" placeholder="请输入客服昵称" maxlength="20">
            </el-input>
        </el-form-item>
        <el-form-item label="客服热线：" prop="hotline">
            <el-input v-model="formData.hotline" placeholder="请输入客服热线" maxlength="20">
            </el-input>
        </el-form-item>
        <el-form-item label="客服QQ：" prop="qq">
            <el-input v-model="formData.qq" placeholder="请输入客服QQ" maxlength="20">
            </el-input>
        </el-form-item>
        <el-form-item label="商务合作号：" prop="businessCode">
            <el-input v-model="formData.businessCode" placeholder="请输入商务合作号"></el-input>
        </el-form-item>
        <el-form-item label="微信二维码：" prop="wechatQrcode">
            <el-upload
                class="upload-demo"
                drag
                :show-file-list="true"
                name="file"
                :action="onUploadAction()"
                :on-success="handleAvatarSuccessWX"
                :on-error="onUploadError"
                :on-progress="onUploadProgress"
                :before-upload="beforeAvatarUploadWX"
                :data="wxQueryParams"
                enctype="multipart/form-data"
                :limit="1"
            >
                <img
                    v-if="wxUrl"
                    :src="wxUrl"
                    class="avatar"
                />
                <i class="el-icon-plus "></i>
                <div class="el-upload__tip" slot="tip">要求为背景透明的png格式，且不超过2M，长100px，宽100px，（再次上传请删除上一次上传）</div>
                <input type="hidden" v-model="wxUrl" />
            </el-upload>
        </el-form-item>
        <el-form-item label="运维人手机号：" prop="maintainerPhone">
            <el-input v-model="formData.maintainerPhone" placeholder="请输入运维人手机号"></el-input>
        </el-form-item>
        <el-form-item label="运维人QQ号：" prop="maintainerQq">
            <el-input v-model="formData.maintainerQq" placeholder="请输入运维人QQ号"></el-input>
        </el-form-item>
        <el-form-item label="运维人昵称：" prop="maintainerNickname">
            <el-input v-model="formData.maintainerNickname" placeholder="请输入运维人昵称"></el-input>
        </el-form-item>
        <el-form-item label="运维人微信二维码：" prop="maintainerWechatQrcode">
            <el-upload
                class="upload-demo"
                drag
                :show-file-list="true"
                name="file"
                :action="onUploadAction()"
                :on-success="handleAvatarSuccessOpsWX"
                :on-error="onUploadError"
                :on-progress="onUploadProgress"
                :before-upload="beforeAvatarUploadWX"
                :data="wxQueryParams"
                enctype="multipart/form-data"
                :limit="1"
            >
                <img
                    v-if="opsWxUrl"
                    :src="opsWxUrl"
                    class="avatar"
                />
                <i class="el-icon-plus "></i>
                <div class="el-upload__tip" slot="tip">要求为背景透明的png格式，且不超过2M，长100px，宽100px，（再次上传请删除上一次上传）</div>
                <input type="hidden" v-model="opsWxUrl" />
            </el-upload>
        </el-form-item>
    </el-form>
</template>

<script>
import imgUrl from '@/utils/imgUrl'
export default {
    name: "ServiceInfo",
    data() {
        return {
            formData: {},
            rules: {
                browserRightDisplay: [
                    { required: true, message: '请设置浏览器右侧显示', trigger: 'blur' }
                ],
            },
            wxQueryParams: {  // 微信上传参数
                imageType: 5,
                agentId: null,
                file: null
            },
            wxUrl: '', // 微信 预览地址
            opsWxUrl: '', // 运维人微信 预览地址
        };
    },
    methods: {
        init(initData) {
            this.wxUrl = ''
            this.opsWxUrl = ''
            this.formData = {
                ...initData
            }
        },
        /********** 微信二维码 **********/
        handleAvatarSuccessWX(res, file) {
            this.wxUrl = URL.createObjectURL(file.raw)
            this.formData.wechatQrcode = res.data.licenseUrl
        },
        /********** 运维人微信二维码 **********/
        handleAvatarSuccessOpsWX(res, file) {
            this.formData.maintainerWechatQrcode = res.data.licenseUrl
            this.opsWxUrl = URL.createObjectURL(file.raw);
        },
        /********** 上传通用方法 **********/
        beforeAvatarUploadWX(file) {
            const isJPG = (file.type == 'image/png');
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error("上传微信图片只能是背景为透明的 png 格式!");
                return false;
            }
            if (!isLt2M) {
                this.$message.error("上传微信图片大小不能超过 2MB!");
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
        onUploadAction() {
            let url = this.$http.adornUrl(`file/image/upload?imageType=7&token=${this.$cookie.get('token')}`);
            return url;
        },
        onUploadProgress() {
            console.log("上传中");
        },
        onUploadError() {
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