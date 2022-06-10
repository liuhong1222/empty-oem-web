<template>
    <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="150px"
    >
        <el-form-item label="对公收款人：" prop="payeePublic">
            <el-input v-model="formData.payeePublic" placeholder="请输入对公收款人">
            </el-input>
        </el-form-item>
        <el-form-item label="对公收款银行：" prop="payBankPublic">
            <el-input v-model="formData.payBankPublic" placeholder="请输入对公收款银行">
            </el-input>
        </el-form-item>
        <el-form-item label="对公收款账号：" prop="payAccountPublic">
            <el-input v-model="formData.payAccountPublic" maxlength="50" placeholder="请输入对公收款账号">
            </el-input>
        </el-form-item>
        <el-form-item label="对私收款人：" prop="payeePrivate">
            <el-input v-model="formData.payeePrivate" placeholder="请输入对私收款人">
            </el-input>
        </el-form-item>
        <el-form-item label="对私收款银行：" prop="payBankPrivate">
            <el-input v-model="formData.payBankPrivate" placeholder="请输入对私收款银行">
            </el-input>
        </el-form-item>
        <el-form-item label="对私收款账号：" prop="payAccountPrivate">
            <el-input v-model="formData.payAccountPrivate" placeholder="请输入对私收款账号">
            </el-input>
        </el-form-item>
        <el-form-item label="微信收款人：" prop="payeeWechat">
            <el-input v-model="formData.payeeWechat" placeholder="请输入微信收款人">
            </el-input>
        </el-form-item>
        <el-form-item label="微信收款二维码：" prop="payQrcodeWechat">
            <el-upload
                class="upload-demo wechat"
                drag
                :show-file-list="true"
                name="file"
                :action="onUploadAction()"
                :on-success="handleAvatarSuccessWX"
                :on-error="onUploadError"
                :on-progress="onUploadProgress"
                :before-upload="beforeAvatarUpload"
                :data="wxQueryParams"
                enctype="multipart/form-data"
                :limit="1"
                :on-remove="() => handleRemoveFile('wechat')"
            >
                <img
                    v-if="wxUrl"
                    :src="wxUrl"
                    class="avatar"
                />
                <i v-else class="el-icon-plus "></i>
                <div class="el-upload__tip" slot="tip">要求为背景透明的png格式，且不超过2M，长100px，宽100px（再次上传请删除上一次上传）</div>
            </el-upload>
        </el-form-item>
        <el-form-item label="微信收款账号：" prop="payAccountWechat">
            <el-input v-model="formData.payAccountWechat" placeholder="请输入微信收款账号">
            </el-input>
        </el-form-item>
        <el-form-item label="支付宝收款人：" prop="payeeAlipay">
            <el-input v-model="formData.payeeAlipay" placeholder="请输入支付宝收款人">
            </el-input>
        </el-form-item>
        <el-form-item label="支付宝收款二维码：" prop="payQrcodeAlipay">
            <el-upload
                class="upload-demo"
                drag
                :show-file-list="true"
                name="file"
                :action="onUploadAction()"
                :on-success="handleAvatarSuccessZFB"
                :on-error="onUploadError"
                :on-progress="onUploadProgress"
                :before-upload="beforeAvatarUpload"
                :data="wxQueryParams"
                enctype="multipart/form-data"
                :limit="1"
                :on-remove="() => handleRemoveFile('alipay')"
            >
                <img
                    v-if="zfbUrl"
                    :src="zfbUrl"
                    class="avatar"
                />
                <i v-else class="el-icon-plus"></i>
                <div class="el-upload__tip" slot="tip">要求为背景透明的png格式，且不超过2M，长100px，宽100px（再次上传请删除上一次上传）</div>
            </el-upload>
        </el-form-item>
        <el-form-item label="支付宝收款账号：" prop="payAccountAlipay">
            <el-input v-model="formData.payAccountAlipay" placeholder="请输入支付宝收款账号">
            </el-input>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: "GatheringInfo",
    data() {
        return {
            formData: {},
            rules: {
            },
            wxUrl: '',
            zfbUrl: '',
            wxQueryParams: {
                imageType: 5,
                agentId: null,
                file: null
            },
        };
    },
    methods: {
        init(initData) {
            this.wxUrl = initData.payQrcodeWechat ? this.$imgPreStr + initData.payQrcodeWechat : ''
            this.zfbUrl = initData.payQrcodeAlipay ? this.$imgPreStr + initData.payQrcodeAlipay : ''
            this.formData = {
                ...initData
            }
        },
        /********** 微信收款二维码 **********/
        handleAvatarSuccessWX(res, file) {
            this.wxUrl = URL.createObjectURL(file.raw)
            this.formData.payQrcodeWechat = res.data.licenseUrl
        },
        /********** 支付宝收款二维码 **********/
        handleAvatarSuccessZFB(res, file) {
            this.formData.payQrcodeAlipay = res.data.licenseUrl
            this.zfbUrl = URL.createObjectURL(file.raw);
        },
        /********** 上传通用方法 **********/
        beforeAvatarUpload(file) {
            const isTypeRight = (file.type == 'image/png');
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isTypeRight) {
                this.$message.error("上传收款图片只能是背景为透明的 png 格式!");
                return false;
            }
            if (!isLt2M) {
                this.$message.error("上传收款图片大小不能超过 2MB!");
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
            return isTypeRight && isLt2M && imgSize;
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
        handleRemoveFile(key) {
            if (key === 'wechat') {
                this.wxUrl = ''
                this.formData.payQrcodeWechat = ''
            } else {
                this.zfbUrl = ''
                this.formData.payQrcodeAlipay = ''
            }
        }
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

    /deep/ .upload-demo {
        .el-upload-dragger {
            width: 178px;
            height: 178px;
            color: #999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>