<template>
    <div class="main">
        <!-- 设置 -->
        <div v-show="flagVisibile">
            <el-steps :active="active" finish-status="success" align-center class="settingSteps">
                <el-step title="基本信息"></el-step>
                <el-step title="客服资料"></el-step>
                <el-step title="域名备案信息"></el-step>
                <el-step title="支付宝资料"></el-step>
                <el-step title="合同信息"></el-step>
                <el-step title="微信收款资料"></el-step>
                <el-step title="微信登录资料"></el-step>
            </el-steps>
            <!-- 内容显示 -->
            <div>
                <!-- 基本信息 -->
                <div class="essentialInformation" v-if="active === 0 ">
                    <el-form :inline="true" :model="basicdataForm" v-model="dataList" :rules="basicDatarules"
                        ref="basicdataList" label-width="110px">
                        <!-- <el-form-item label="代理商序号：" prop="agentId" class="noborder">
                            <el-input v-model="basicdataForm.agentId" placeholder="代理商序号" readonly></el-input>
                        </el-form-item><br /> -->
                        <el-form-item label="商户编号：" prop="busicId" class="noborder">
                            <el-input v-model="basicdataForm.busicId" placeholder="商户编号" readonly></el-input>
                        </el-form-item><br />
                        <el-form-item label="代理商名称：" prop="agentName" class="noborder">
                            <el-input v-model="basicdataForm.agentName" placeholder="代理商名称" readonly></el-input>
                        </el-form-item>
                        <br />
                        <el-form-item label="logo：" id="logoImgSize" prop="imageUrlLogo">
                            <el-upload class="upload-demo" drag :show-file-list="true" name="file"
                                :action="actionLogo()" :on-success="handleAvatarSuccessLogo" :on-error="errorLogo"
                                :on-progress="onProgressLogo" :before-upload="beforeAvatarUploadLogo"
                                :data="logoQueryParams" enctype="multipart/form-data" :limit="1">
                                <img v-if="basicdataForm.imageUrlLogo" :src="basicdataForm.imageUrlLogo" class="avatar">
                                <i class="el-icon-plus "></i>
                                <!-- <div class="el-upload__text" style="margin-top:-28px"><em>点击上传</em></div> -->
                                <div class="el-upload__tip" slot="tip">要求为背景透明的png格式，且不超过2M，长140px，宽36px，（再次上传请删除上一次上传）
                                </div>
                                <input type="hidden" v-model="basicdataForm.imageUrlLogo" />
                            </el-upload>
                        </el-form-item><br />
                        <el-form-item label="icon：" id="iconImgSize" prop="imageUrlIcon">
                            <el-upload class="upload-demo" drag :show-file-list="true"
                                :on-success="handleAvatarSuccessIcon" :on-progress="onProgressIcon"
                                :before-upload="beforeAvatarUploadIcon" :action="actionIcon()" :data="iconQueryParams"
                                :on-error="errorIcon">
                                <img v-if="basicdataForm.imageUrlIcon" :src="basicdataForm.imageUrlIcon" class="avatar"
                                    :limit="1">
                                <i class="el-icon-plus"></i>
                                <!-- <div class="el-upload__text"><em>点击上传</em></div> -->
                                <div class="el-upload__tip" slot="tip">要求为背景透明的png格式，且不超过2M，长40px，宽40px，（再次上传请删除上一次上传）
                                </div>
                                <input type="hidden" v-model="basicdataForm.imageUrlIcon" />
                            </el-upload>
                        </el-form-item><br />
                        <el-form-item label="代表签字：" prop="imageUrlSignatures">
                            <el-upload class="upload-demo" drag :show-file-list="true" name="file"
                                :action="actionSignatures()" :on-success="handleAvatarSuccessSignatures"
                                :on-error="errorSignatures" :on-progress="onProgressSignatures"
                                :before-upload="beforeAvatarUploadSignatures" :data="SignaturesQueryParams"
                                enctype="multipart/form-data" :limit="1">
                                <img v-if="basicdataForm.imageUrlSignatures" :src="basicdataForm.imageUrlSignatures"
                                    class="avatar">
                                <i class="el-icon-plus"></i>
                                <!-- <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div> -->
                                <div class="el-upload__tip" slot="tip">
                                    要求为背景透明的png格式，且不超过2M，长1261px，宽482px，（再次上传请删除上一次上传）</div>
                                <input type="hidden" v-model="basicdataForm.imageUrlSignatures" />
                            </el-upload>
                        </el-form-item><br />
                        <el-form-item label="公司红章：" prop="imageUrlChapter">
                            <el-upload class="upload-demo" drag :show-file-list="true" name="file"
                                :action="actionChapter()" :on-success="handleAvatarSuccessChapter"
                                :on-error="errorChapter" :on-progress="onProgressChapter"
                                :before-upload="beforeAvatarUploadChapter" :data="ChapterQueryParams"
                                enctype="multipart/form-data" :limit="1">
                                <img v-if="basicdataForm.imageUrlChapter" :src="basicdataForm.imageUrlChapter"
                                    class="avatar">
                                <i class="el-icon-plus"></i>
                                <!-- <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div> -->
                                <div class="el-upload__tip" slot="tip">要求为背景透明的png格式，且不超过2M，长169px，宽168px，（再次上传请删除上一次上传）
                                </div>
                                <input type="hidden" v-model="basicdataForm.imageUrlChapter" />
                            </el-upload>
                        </el-form-item><br />
                        <el-form-item label="短信签名：" prop="messSign">
                            <el-input placeholder="单行输入" v-model="basicdataForm.messSign"></el-input>
                        </el-form-item><br />
                        <el-form-item label="代理商域名：" prop="agentDomain">
                            <el-input placeholder="单行输入" v-model="basicdataForm.agentDomain"></el-input>
                        </el-form-item><br />
                        <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
                    </el-form>
                </div>
                <!-- 客服资料 -->
                <!-- class="customerInformation" 注释掉 要不验证 不出来-->
                <div v-if="active === 1" style="padding: 30px 30px;">
                    <el-form label-width="110px" :model="customerDataForm" :rules="customerDatarules"
                        ref="customerdataList" class="demo-ruleForm">
                        <el-form-item label="浏览器右侧显示">
                            <el-switch v-model="customerDataForm.browserDisplay" @change="changeSwitch()"></el-switch>
                        </el-form-item>
                        <el-form-item label="客服热线" prop="kfLine">
                            <el-input v-model="customerDataForm.kfLine" placeholder="客服热线 (最大输入长度为24)" maxlength="24">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="客服qq" prop="keyqq">
                            <el-input v-model="customerDataForm.keyqq" placeholder="客服qq (最大输入长度为24)" maxlength="24">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="美洽ID：" prop="beautyID">
                            <el-input v-model="customerDataForm.beautyID" placeholder="美洽ID"></el-input>
                        </el-form-item>
                        <el-form-item label="商务合作号" prop="businNO">
                            <el-input v-model="customerDataForm.businNO" placeholder="商务合作号"></el-input>
                        </el-form-item>
                        <el-form-item label="微信二维码" id="wxImgSize">
                            <div class="delWXimg" v-show="delWXimgVisible">
                                <img src="~@/assets/img/delWX.png" alt=""
                                    @click="delWXimgBtn">&nbsp;<span>（删除后可重新上传）</span>
                            </div>
                            <el-upload class="upload-demo" drag :show-file-list="true" name="file" :action="actionWx()"
                                :on-success="handleAvatarSuccessWx" :on-error="errorWx" :on-progress="onProgressWx"
                                :before-upload="beforeAvatarUploadWx" :data="wxQueryParams"
                                enctype="multipart/form-data" :limit="1" :file-list="fileList2">
                                <img v-if="customerDataForm.imageUrlWx" :src="customerDataForm.imageUrlWx"
                                    class="avatar">
                                <i class="el-icon-plus "></i>
                                <div class="el-upload__tip" slot="tip">要求为背景透明的png格式，且不超过2M，长100px，宽100px，（再次上传请删除上一次上传）
                                </div>
                                <input type="hidden" v-model="customerDataForm.imageUrlWx" />
                            </el-upload>
                        </el-form-item><br />
                        <el-button style="margin-top: 12px;" @click="lastStep">上一步</el-button>
                        <el-button style="margin-top: 12px;" @click="nextcustomer">下一步</el-button>
                    </el-form>
                </div>
                <!-- 域名备案信息 -->
                <!-- class="domainNameFiling" 注释掉 要不验证 不出来 -->
                <div v-if="active === 2" style="padding: 30px 30px;">
                    <el-form label-width="110px" :model="domainDataForm" :rules="domainDatarules" ref="domaindataList"
                        class="demo-ruleForm">
                        <el-form-item label="版权信息：" prop="copyinfo">
                            <el-input v-model="domainDataForm.copyinfo" placeholder="请输入版权信息"></el-input>
                        </el-form-item>
                        <el-form-item label="公司地址：" prop="compAdress">
                            <el-input v-model="domainDataForm.compAdress" placeholder="请输入公司地址"></el-input>
                        </el-form-item>
                        <el-form-item label="联系方式：" prop="custHotline">
                            <el-input v-model="domainDataForm.custHotline" placeholder="请输入联系方式"></el-input>
                        </el-form-item>
                        <el-form-item prop="telservice">
                            <span slot="label" style="line-height: 16px;display: inline-block;">增值电信业务经营许可证：</span>
                            <el-input v-model="domainDataForm.telservice" placeholder="请输入增值电信业务经营许可证"></el-input>
                        </el-form-item>
                        <el-form-item label="ICP备案：" prop="icpInfo">
                            <el-input v-model="domainDataForm.icpInfo" placeholder="请输入ICP备案，例：沪ICP备案：15046301号-2
                            "></el-input>
                        </el-form-item>
                        <el-form-item label="公安备案：" prop="secrecord">
                            <el-input v-model="domainDataForm.secrecord" placeholder="请输入公安备案，例：沪公网安备案 31011702001190号">
                            </el-input>
                        </el-form-item>
                        <el-button style="margin-top: 12px;" @click="lastStep">上一步</el-button>
                        <el-button style="margin-top: 12px;" @click="nextDomain">下一步</el-button>
                    </el-form>
                </div>

                <!-- 支付宝资料 -->
                <div class="alipayIInformation" v-if="active === 3 ">
                    <el-form :model="alipaydataForm" ref="alipaydataFormref" label-width="110px" class="demo-ruleForm">
                        <el-form-item label="appid">
                            <el-input v-model="alipaydataForm.aliappid" placeholder="appid"></el-input>
                        </el-form-item>
                        <el-form-item label="支付宝调用地址">
                            <el-input v-model="alipaydataForm.alicallUrl" placeholder="支付宝调用地址"></el-input>
                        </el-form-item>
                        <el-form-item label="支付回调地址">
                            <el-input v-model="alipaydataForm.alicallbackUrl" placeholder="支付回调地址"></el-input>
                        </el-form-item>
                        <el-form-item label="支付宝公钥">
                            <el-input type="textarea" v-model="alipaydataForm.alipublicKey" placeholder="支付宝公钥"
                                :rows="5"></el-input>
                        </el-form-item>
                        <el-form-item label="应用私钥">
                            <el-input type="textarea" v-model="alipaydataForm.aliprivateKey" placeholder="应用私钥"
                                :rows="5"></el-input>
                        </el-form-item>
                        <el-button style="margin-top: 12px;" @click="lastStep">上一步</el-button>
                        <el-button style="margin-top: 12px;" @click="nextalipay">下一步</el-button>
                    </el-form>
                </div>

                <!-- 合同信息 -->
                <div v-if="active === 4" class="contractInformation">
                    <el-form :model="contractdataForm" :rules="contractdatarules" ref="contractdataFormref"
                        label-width="110px" class="demo-ruleForm">
                        <el-form-item label="公司名称" prop="comName">
                            <el-input v-model="contractdataForm.comName" placeholder="公司名称"></el-input>
                        </el-form-item>
                        <el-form-item label="公司地址" prop="comAdress">
                            <el-input v-model="contractdataForm.comAdress" placeholder="公司地址"></el-input>
                        </el-form-item>
                        <el-form-item label="账号" prop="comAccount">
                            <el-input v-model="contractdataForm.comAccount" placeholder="账号"></el-input>
                        </el-form-item>
                        <el-form-item label="开户行" prop="openBank">
                            <el-input v-model="contractdataForm.openBank" placeholder="开户行"></el-input>
                        </el-form-item>
                        <el-form-item label="邮编" prop="zipcode">
                            <el-input v-model="contractdataForm.zipcode" placeholder="邮编"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" prop="phone">
                            <el-input v-model="contractdataForm.phone" placeholder="电话"></el-input>
                        </el-form-item>
                        <el-button style="margin-top: 12px;" @click="lastStep">上一步</el-button>
                        <el-button style="margin-top: 12px;" @click="nextcontract">下一步</el-button>
                    </el-form>
                </div>

                <!-- 微信收款资料 -->
                <div class="weixinInformation" v-if="active === 5">
                    <el-form :model="wxdataForm" ref="wxdataFormref" label-width="110px" :rules="wxdataFormrefrules"
                        class="demo-ruleForm">
                        <el-form-item label="微信调用地址" prop="wxcallUrl">
                            <el-input v-model="wxdataForm.wxcallUrl" placeholder="微信调用地址"></el-input>
                        </el-form-item>
                        <el-form-item label="微信回调地址" prop="wxcallbackUrl">
                            <el-input v-model="wxdataForm.wxcallbackUrl" placeholder="微信回调地址"></el-input>
                        </el-form-item>
                        <el-form-item label="appid" prop="wxappid">
                            <el-input v-model="wxdataForm.wxappid" placeholder="appid"></el-input>
                        </el-form-item>
                        <el-form-item label="mchid" prop="wxmchid">
                            <el-input v-model="wxdataForm.wxmchid" placeholder="mchid"></el-input>
                        </el-form-item>
                        <el-form-item label="key" prop="wxkey">
                            <el-input v-model="wxdataForm.wxkey" placeholder="key"></el-input>
                        </el-form-item>
                        <el-button style="margin-top: 12px;" @click="lastStep">上一步</el-button>
                        <el-button style="margin-top: 12px;" @click="submitweixin">下一步</el-button>
                    </el-form>
                </div>
                <!-- 微信登录资料 -->
                <div class="weixinLoginInfo" v-if="active === 6">
                    <el-form :model="wxLoginForm" ref="wxLoginFormref" label-width="110px" class="demo-ruleForm">
                        <el-form-item label="APPID">
                            <el-input v-model="wxLoginForm.APPID" placeholder="APPID"></el-input>
                        </el-form-item>
                        <el-form-item label="APPSECRET">
                            <el-input v-model="wxLoginForm.APPSECRET" placeholder="APPSECRET"></el-input>
                        </el-form-item>
                        <el-button style="margin-top: 12px;" @click="lastStep">上一步</el-button>
                        <el-button style="margin-top: 12px;" @click="submitweiLogin">完成</el-button>
                    </el-form>
                </div>
            </div>
        </div>
        <!-- 查看 -->
        <div v-show="seeflagVisibile" class="seeBasic">
            <el-collapse v-model="activeNames" @change="handleChange" accordion>
                <el-collapse-item title="基本信息 ✚" name="1">
                    <el-form :model="basicdataForm" ref="basicdataForm" label-width="150px" class="demo-ruleForm"
                        :label-position="labelPosition">
                        <!-- <el-form-item label="代理商序号：">
                            <el-input v-model="basicdataForm.agentId" placeholder="代理商序号" readonly></el-input>
                        </el-form-item> -->
                        <el-form-item label="商户编号：">
                            <el-input v-model="basicdataForm.busicId" placeholder="商户编号" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="代理商名称：">
                            <el-input v-model="basicdataForm.agentName" placeholder="代理商名称" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="logo：" id="logoseeImg">
                            <el-upload class="avatar-uploader" action="" :show-file-list="false" disabled>
                                <img v-if="basicdataForm.imageUrlLogo" :src="basicdataForm.imageUrlLogo" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="icon：" id="iconseeImg">
                            <el-upload class="avatar-uploader" action="" :show-file-list="false" disabled>
                                <img v-if="basicdataForm.imageUrlIcon" :src="basicdataForm.imageUrlIcon" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="代表签字：">
                            <el-upload class="avatar-uploader" action="" :show-file-list="false" disabled>
                                <img v-if="basicdataForm.imageUrlSignatures" :src="basicdataForm.imageUrlSignatures"
                                    class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="公司红章：">
                            <el-upload class="avatar-uploader" action="" :show-file-list="false" disabled>
                                <img v-if="basicdataForm.imageUrlChapter" :src="basicdataForm.imageUrlChapter"
                                    class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="短信签名：">
                            <el-input v-model="basicdataForm.messSign" placeholder="短信签名" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="代理商域名：">
                            <el-input v-model="basicdataForm.agentDomain" placeholder="代理商域名" readonly></el-input>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>

                <el-collapse-item title="客服资料 ✚" name="2">
                    <el-form label-width="110px" :model="customerDataForm" ref="customerdataList" class="demo-ruleForm">
                        <el-form-item label="浏览器右侧显示">
                            <el-switch v-model="customerDataForm.browserDisplay" disabled></el-switch>
                        </el-form-item>
                        <el-form-item label="客服热线：">
                            <el-input v-model="customerDataForm.kfLine" placeholder="客服热线" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="客服qq：">
                            <el-input v-model="customerDataForm.keyqq" placeholder="客服qq" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="美洽ID：" prop="beautyID">
                            <el-input v-model="customerDataForm.beautyID" placeholder="美洽ID"></el-input>
                        </el-form-item>
                        <el-form-item label="商务合作号：">
                            <el-input v-model="customerDataForm.businNO" placeholder="商务合作号" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="微信二维码：">
                            <el-upload class="avatar-uploader" action="" :show-file-list="false" disabled>
                                <img v-if="customerDataForm.imageUrlWx" :src="customerDataForm.imageUrlWx"
                                    class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>

                <el-collapse-item title="域名备案信息 ✚" name="3">
                    <el-form label-width="180px" :model="domainDataForm" ref="domaindataList" class="demo-ruleForm">
                        <el-form-item label="版权信息：">
                            <el-input v-model="domainDataForm.copyinfo" placeholder="版权信息" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="公司地址：">
                            <el-input v-model="domainDataForm.compAdress" placeholder="公司地址" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="联系方式：">
                            <el-input v-model="domainDataForm.custHotline" placeholder="联系方式" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="增值电信业务经营许可证：">
                            <el-input v-model="domainDataForm.telservice" placeholder="增值电信业务经营许可证" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="ICP备案：">
                            <el-input v-model="domainDataForm.icpInfo" placeholder="请输入ICP备案，例：沪ICP备案：15046301号-2"
                                readonly></el-input>
                        </el-form-item>
                        <el-form-item label="公安备案：">
                            <el-input v-model="domainDataForm.secrecord" placeholder="请输入公安备案，例：沪公网安备案 31011702001190号"
                                readonly></el-input>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="支付宝资料 ✚" name="4">
                    <el-form :model="alipaydataForm" ref="alipaydataFormref" label-width="110px" class="demo-ruleForm">
                        <el-form-item label="appid">
                            <el-input v-model="alipaydataForm.aliappid" placeholder="appid" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="支付宝调用地址">
                            <el-input v-model="alipaydataForm.alicallUrl" placeholder="支付宝调用地址" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="支付回调地址">
                            <el-input v-model="alipaydataForm.alicallbackUrl" placeholder="支付回调地址" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="支付宝公钥">
                            <el-input type="textarea" v-model="alipaydataForm.alipublicKey" placeholder="支付宝公钥"
                                :rows="5" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="应用私钥">
                            <el-input type="textarea" v-model="alipaydataForm.aliprivateKey" placeholder="应用私钥"
                                :rows="5" readonly></el-input>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="合同资料 ✚" name="5">
                    <el-form :model="contractdataForm" ref="contractdataFormref" label-width="110px"
                        class="demo-ruleForm">
                        <el-form-item label="公司名称">
                            <el-input v-model="contractdataForm.comName" placeholder="公司名称" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="公司地址">
                            <el-input v-model="contractdataForm.comAdress" placeholder="公司地址" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="账号">
                            <el-input v-model="contractdataForm.comAccount" placeholder="账号" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="开户行">
                            <el-input v-model="contractdataForm.openBank" placeholder="开户行" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="邮编">
                            <el-input v-model="contractdataForm.zipcode" placeholder="邮编" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="电话">
                            <el-input v-model="contractdataForm.phone" placeholder="电话" readonly></el-input>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="微信收款资料 ✚" name="6">
                    <el-form :model="wxdataForm" ref="wxdataFormref" label-width="110px" class="demo-ruleForm">
                        <el-form-item label="微信调用地址">
                            <el-input v-model="wxdataForm.wxcallUrl" placeholder="微信调用地址" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="微信回调地址">
                            <el-input v-model="wxdataForm.wxcallbackUrl" placeholder="微信回调地址" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="appid">
                            <el-input v-model="wxdataForm.wxappid" placeholder="appid" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="mchid">
                            <el-input v-model="wxdataForm.wxmchid" placeholder="mchid" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="key">
                            <el-input v-model="wxdataForm.wxkey" placeholder="key" readonly></el-input>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="微信登录资料 ✚" name="7">
                    <el-form :model="wxLoginForm" ref="wxLoginFormref" label-width="110px" class="demo-ruleForm">
                        <el-form-item label="APPID">
                            <el-input v-model="wxLoginForm.APPID" placeholder="APPID" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="APPSECRET">
                            <el-input v-model="wxLoginForm.APPSECRET" placeholder="APPSECRET" readonly></el-input>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>

</template>

<script>
    import imgUrl from '@/utils/imgUrl'
    export default {
        data() {
            return {
                delWXimgVisible: false,
                fileList2: [],
                flagVisibile: false,
                seeflagVisibile: false,
                labelPosition: 'right',

                agentId: null,
                activeNames: ['1'],
                active: 0,
                dataList: [],
                wxUrl: '',
                logoUrl: '',
                iconUrl: '',
                signUrl: '',
                sealUrl: '',
                basicdataForm: { //基本信息
                    agentId: '',
                    busicId: '',
                    agentName: '',
                    messSign: '',
                    agentDomain: '',
                    imageUrlIcon: "",
                    imageUrlLogo: "",
                    imageUrlSignatures: "",  //代表签字
                    imageUrlChapter: "",  //公司红章
                },
                basicDatarules: {  //基本信息规则
                    // agentId: [
                    //     { required: true, message: '请输入代理商序号', trigger: 'blur' }
                    // ],
                    busicId: [
                        { required: true, message: '请输入商户编号', trigger: 'blur' }
                    ],
                    imageUrlIcon: [
                        { required: true, message: '请上传icon', trigger: 'blur' }
                    ],
                    imageUrlLogo: [
                        { required: true, message: '请上传logo', trigger: 'blur' }
                    ],
                    imageUrlSignatures: [
                        { required: true, message: '请上传代表签字', trigger: 'blur' }
                    ],
                    imageUrlChapter: [
                        { required: true, message: '请上传公司红章', trigger: 'blur' }
                    ],
                    agentName: [
                        { required: true, message: '请输入代理商名称', trigger: 'blur' }
                    ],
                    messSign: [
                        { required: true, message: '请输入短信签名', trigger: 'blur' }
                    ],
                    agentDomain: [
                        { required: true, message: '请输入代理商域名', trigger: 'blur' }
                    ]
                },
                domainDataForm: { //域名备案信息
                    copyinfo: '',
                    compAdress: '',
                    custHotline: '',
                    telservice: '',
                    icpInfo: '',
                    secrecord: '',
                    id: ''  //后端返回的id
                },
                domainDatarules: {//域名备案信息规则
                    copyinfo: [
                        { required: true, message: '请输入版权信息', trigger: 'blur' }
                    ],
                    compAdress: [
                        { required: true, message: '请输入公司地址', trigger: 'blur' }
                    ],
                    custHotline: [
                        { required: false, message: '请输入客服热线', trigger: 'blur' }
                    ],
                    icpInfo: [
                        { required: true, message: '请输入icp备案', trigger: 'blur' }
                    ],
                    secrecord: [
                        { required: true, message: '请输入公司备案', trigger: 'blur' }
                    ],
                    telservice: [
                        { required: false, message: '请输入经营许可证', trigger: 'blur' }
                    ],
                },
                customerDataForm: {  //客服资料信息
                    kfLine: '',
                    keyqq: '',
                    businNO: '',
                    beautyID: '',//美洽id
                    id: '',  //后端返回的id
                    browserDisplay: true,  //浏览器右侧显示
                    imageUrlWx: "",
                },
                customerDatarules: {
                    kfLine: [
                        { required: true, message: '请输入客服热线', trigger: 'blur' }
                    ],
                    keyqq: [
                        { required: true, message: '请输入客服qq', trigger: 'blur' }
                    ],
                    beautyID: [
                        { required: false, message: '请输入美洽ID', trigger: 'blur' }
                    ],
                    businNO: [
                        { required: true, message: '请输入商务合作号', trigger: 'blur' }
                    ],
                },
                contractdataForm: {  //合同信息
                    comName: '',
                    comAdress: '',
                    comAccount: '',
                    openBank: '',
                    zipcode: '',
                    phone: '',
                    id: ''  //后端返回的id
                },
                contractdatarules: {
                    comName: [
                        { required: true, message: '请输入公司名称', trigger: 'blur' }
                    ],
                    comAdress: [
                        { required: true, message: '请输入公司地址', trigger: 'blur' }
                    ],
                    comAccount: [
                        { required: true, message: '请输入账号', trigger: 'blur' }
                    ],
                    openBank: [
                        { required: true, message: '请输入开户行', trigger: 'blur' }
                    ],
                    zipcode: [
                        { required: true, message: '请输入邮编', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '请输入手机号', trigger: 'blur' }
                    ],
                },
                alipaydataForm: { //支付宝信息
                    aliappid: '',
                    alicallUrl: '',
                    alicallbackUrl: '',
                    alipublicKey: '',
                    aliprivateKey: '',
                    id: ''  //后端返回的id
                },
                wxdataForm: {
                    wxkey: '',
                    wxappid: '',
                    wxmchid: '',
                    wxcallbackUrl: '',
                    wxcallUrl: '',
                    id: ''  //后端返回的id
                },
                wxdataFormrefrules: {
                    wxcallUrl: [
                        { required: false, message: '请输入公司名称', trigger: 'blur' }
                    ],
                    wxcallbackUrl: [
                        { required: false, message: '请输入公司地址', trigger: 'blur' }
                    ],
                    wxappid: [
                        { required: false, message: '请输入账号', trigger: 'blur' }
                    ],
                    wxmchid: [
                        { required: false, message: '请输入开户行', trigger: 'blur' }
                    ],
                    wxkey: [
                        { required: false, message: '请输入邮编', trigger: 'blur' }
                    ]
                },
                wxLoginForm: {
                    APPID: '',
                    APPSECRET: '',
                    id: ''
                },
                // imageUrlIcon: "",
                // imageUrlLogo: "",
                // imageUrlSignatures: "",  //代表签字
                // imageUrlChapter: "",  //公司红章
                logoQueryParams: {  //logo上传参数
                    imageType: 3,
                    agentId: null,
                    file: null
                },
                wxQueryParams: {  //logo上传参数
                    imageType: 5,
                    agentId: null,
                    file: null
                },
                iconQueryParams: { //icon上传参数
                    imageType: 4,
                    agentId: null,
                    file: null
                },
                SignaturesQueryParams: { //代表签字
                    imageType: 1,
                    agentId: null,
                    file: null
                },
                ChapterQueryParams: { //公司红章
                    imageType: 2,
                    agentId: null,
                    file: null
                }
            };
        },
        activated() {
            this.getBasicInfo()
        },
        methods: {
            changeSwitch() {
                this.customerDataForm.browserDisplay = this.customerDataForm.browserDisplay
            },
            getBasicInfo() {
                this.logoUrl = '',
                    this.iconUrl = '',
                    this.signUrl = '',
                    this.sealUrl = '',
                    this.basicdataForm.imageUrlLogo = ""
                this.basicdataForm.imageUrlIcon = ""
                this.basicdataForm.imageUrlSignatures = ""
                this.basicdataForm.imageUrlChapter = ""
                // 获取基本信息
                this.$http({
                    url: this.$http.adornUrl(`agent/set/findBasicInfo?token=${this.$cookie.get('token')}`),
                    method: 'post',
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        if (data.data[0].setStatus == 'true') {
                            this.seeflagVisibile = true
                            this.flagVisibile = false
                        } else if (data.data[0].setStatus == 'false') {
                            this.flagVisibile = true
                            this.seeflagVisibile = false
                        }
                        this.basicdataForm.agentId = data.data[0].agentId
                        this.basicdataForm.busicId = data.data[0].agent_no
                        this.basicdataForm.agentName = data.data[0].company_name
                        this.basicdataForm.messSign = data.data[0].sms_sign
                        this.basicdataForm.agentDomain = data.data[0].name
                        this.agentId = data.data[0].agentId
                        if (data.data[0].logo_url && data.data[0].icon_url && data.data[0].sign_url && data.data[0].seal_url) {
                            this.basicdataForm.imageUrlLogo = imgUrl.imgUrl + data.data[0].logo_url
                            this.basicdataForm.imageUrlIcon = imgUrl.imgUrl + data.data[0].icon_url
                            this.basicdataForm.imageUrlSignatures = imgUrl.imgUrl + data.data[0].sign_url
                            this.basicdataForm.imageUrlChapter = imgUrl.imgUrl + data.data[0].seal_url
                        }
                    }
                })
            },
            // 删除图片
            delWXimgBtn() {
                this.$http({
                    url: this.$http.adornUrl(`agent/set/delAgentWeixinImage?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'agentId': this.agentId,
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.fileList2 = [];
                        this.wxUrl = "";
                        this.customerDataForm.imageUrlWx = ""
                        this.delWXimgVisible = false;
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            next() {  //点击基本信息
                this.$refs['basicdataList'].validate((valid) => {
                    if (valid) {
                        // 提交基本信息
                        this.$http({
                            url: this.$http.adornUrl(`agent/set/updateBasicInfo?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'agentId': this.agentId,
                                'logo_url': this.logoUrl,
                                'icon_url': this.iconUrl,
                                'sign_url': this.signUrl,
                                'seal_url': this.sealUrl,
                                'sms_sign': this.basicdataForm.messSign,
                                'name': this.basicdataForm.agentDomain
                            })
                        }).then(({ data }) => {
                            // console.log(data)
                            if (data && data.code === 0) {
                                this.$nextTick(() => {
                                    this.$refs['basicdataList'].clearValidate()
                                })
                                this.getkfinfo()  //获取客服信息
                                if (this.active++ > 5) this.active = 0;
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })
            },
            // 获取客服资料
            getkfinfo() {
                this.customerDataForm.id = ""
                this.customerDataForm.imageUrlWx = ""
                this.$http({
                    url: this.$http.adornUrl(`agent/set/findCustService?token=${this.$cookie.get('token')}&agentId=${this.agentId}`),
                    method: 'post',
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        // console.log(data)
                        if (data.data !== null) {
                            this.customerDataForm.kfLine = data.data.hotline
                            this.customerDataForm.keyqq = data.data.qq
                            this.customerDataForm.beautyID = data.data.meiqiaEntid
                            this.customerDataForm.businNO = data.data.bizNo
                            this.customerDataForm.id = data.data.id
                            if (data.data.weixinUrl) {
                                this.customerDataForm.imageUrlWx = imgUrl.imgUrl + data.data.weixinUrl
                                this.delWXimgVisible = true
                            } else {
                                this.wxUrl = ""
                                this.delWXimgVisible = false
                            }
                            if (data.data.rightDisplay == 0) {
                                this.customerDataForm.browserDisplay = false
                            } else if (data.data.rightDisplay == 1) {
                                this.customerDataForm.browserDisplay = true
                            }
                        } else {
                            this.customerDataForm.kfLine = ""
                            this.customerDataForm.keyqq = ""
                            this.customerDataForm.beautyID = ""
                            this.customerDataForm.businNO = ""
                        }
                    }
                })
            },
            // 提交客服资料
            nextcustomer() {
                this.$refs['customerdataList'].validate((valid) => {
                    if (valid) {

                        this.$http({
                            url: this.$http.adornUrl(`agent/set/updateCustService?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'agentId': this.agentId,
                                'id': this.customerDataForm.id,
                                'bizNo': this.customerDataForm.businNO,
                                'qq': this.customerDataForm.keyqq,
                                'meiqiaEntid': this.customerDataForm.beautyID,
                                'hotline': this.customerDataForm.kfLine,
                                'weixinUrl': this.wxUrl,
                                'rightDisplay': (this.customerDataForm.browserDisplay) == true ? 1 : 0
                            })
                        }).then(({ data }) => {
                            // console.log(data)
                            if (data && data.code === 0) {
                                this.$nextTick(() => {
                                    this.$refs['customerdataList'].clearValidate()
                                })
                                this.getDomain()//获取域名备案信息
                                if (this.active++ > 5) this.active = 0;
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })
            },
            // 获取下一步里面的内容（域名备案信息）
            getDomain() {
                this.domainDataForm.id = ""
                this.$http({
                    url: this.$http.adornUrl(`agent/set/findDomainInfo?token=${this.$cookie.get('token')}&agentId=${this.agentId}`),
                    method: 'post',
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        // console.log(data)
                        if (data.data !== null) {
                            this.domainDataForm.copyinfo = data.data.copyright
                            this.domainDataForm.compAdress = data.data.address
                            this.domainDataForm.telservice = data.data.licence
                            this.domainDataForm.icpInfo = data.data.icpRecord
                            this.domainDataForm.secrecord = data.data.policeRecord
                            this.domainDataForm.custHotline = data.data.contactInfo
                            this.domainDataForm.id = data.data.id
                        } else {
                            this.domainDataForm.copyinfo = ""
                            this.domainDataForm.compAdress = ""
                            this.domainDataForm.telservice = ""
                            this.domainDataForm.icpInfo = ""
                            this.domainDataForm.secrecord = ""
                            this.domainDataForm.custHotline = ""
                        }
                    }
                })
            },

            // 提交域名信息
            nextDomain() {
                this.$refs['domaindataList'].validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: this.$http.adornUrl(`agent/set/updateDomainInfo?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'agentId': this.agentId,
                                'id': this.domainDataForm.id,
                                'licence': this.domainDataForm.telservice,
                                'copyright': this.domainDataForm.copyinfo,
                                'icpRecord': this.domainDataForm.icpInfo,
                                'policeRecord': this.domainDataForm.secrecord,
                                'address': this.domainDataForm.compAdress,
                                'contactInfo': this.domainDataForm.custHotline
                            })
                        }).then(({ data }) => {
                            // console.log(data)
                            if (data && data.code === 0) {
                                this.$nextTick(() => {
                                    this.$refs['domaindataList'].clearValidate()
                                })
                                this.getalipay() //获取支付宝信息
                                if (this.active++ > 5) this.active = 0;
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })
            },
            // 获取支付宝信息
            getalipay() {
                this.alipaydataForm.id = ""
                this.$http({
                    url: this.$http.adornUrl(`agent/set/findAlipay?token=${this.$cookie.get('token')}&agentId=${this.agentId}`),
                    method: 'post',
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        // console.log(data)
                        if (data.data !== null) {
                            this.alipaydataForm.aliappid = data.data.appid
                            this.alipaydataForm.alicallUrl = data.data.callUrl
                            this.alipaydataForm.alicallbackUrl = data.data.callbackUrl
                            this.alipaydataForm.alipublicKey = data.data.publicKey
                            this.alipaydataForm.aliprivateKey = data.data.privateKey
                            this.alipaydataForm.id = data.data.id
                        } else {
                            // alert(33333)
                            this.alipaydataForm.aliappid = ""
                            this.alipaydataForm.alicallUrl = ""
                            this.alipaydataForm.alicallbackUrl = ""
                            this.alipaydataForm.alipublicKey = ""
                            this.alipaydataForm.aliprivateKey = ""
                        }
                    }
                })
            },
            // 提交支付宝
            nextalipay() {

                this.$http({
                    url: this.$http.adornUrl(`agent/set/updateAlipay?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'agentId': this.agentId,
                        'id': this.alipaydataForm.id,
                        'appid': this.alipaydataForm.aliappid,
                        'callUrl': this.alipaydataForm.alicallUrl,
                        'callbackUrl': this.alipaydataForm.alicallbackUrl,
                        'publicKey': this.alipaydataForm.alipublicKey,
                        'privateKey': this.alipaydataForm.aliprivateKey,
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        let keys = [];
                        for (var key in this.contractdatarules) {
                            keys.push(this.contractdatarules[key]);
                        }
                        if (this.alipaydataForm.aliappid !== "" && this.alipaydataForm.alicallUrl !== "" && this.alipaydataForm.alicallbackUrl !== "" && this.alipaydataForm.alipublicKey !== "" && this.alipaydataForm.aliprivateKey !== "") {
                            for (var i = 0; i < keys.length; i++) {
                                keys[i][0].required = true
                            }
                        } else {
                            for (var i = 0; i < keys.length; i++) {
                                keys[i][0].required = false
                            }
                        }
                        this.getcontractinfo()//获取合同信息
                        if (this.active++ > 5) this.active = 0;
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },

            // 获取合同信息
            getcontractinfo() {
                this.contractdataForm.id = ""
                this.$http({
                    url: this.$http.adornUrl(`agent/set/findContract?token=${this.$cookie.get('token')}&agentId=${this.agentId}`),
                    method: 'post',
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        // console.log(data)
                        if (data.data !== null) {
                            this.contractdataForm.comName = data.data.companyName
                            this.contractdataForm.comAdress = data.data.companyAddress
                            this.contractdataForm.comAccount = data.data.accountNo
                            this.contractdataForm.openBank = data.data.bankName
                            this.contractdataForm.zipcode = data.data.postcode
                            this.contractdataForm.phone = data.data.mobile,
                                this.contractdataForm.id = data.data.id
                        } else {
                            this.contractdataForm.comName = ""
                            this.contractdataForm.comAdress = ""
                            this.contractdataForm.comAccount = ""
                            this.contractdataForm.openBank = ""
                            this.contractdataForm.zipcode = ""
                            this.contractdataForm.phone = ""
                        }
                    }
                })
            },
            // 提交合同
            nextcontract() {
                this.$refs['contractdataFormref'].validate((valid) => {
                    if (valid) {

                        this.$http({
                            url: this.$http.adornUrl(`agent/set/updateContract?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'agentId': this.agentId,
                                'id': this.contractdataForm.id,
                                'companyName': this.contractdataForm.comName,
                                'companyAddress': this.contractdataForm.comAdress,
                                'accountNo': this.contractdataForm.comAccount,
                                'bankName': this.contractdataForm.openBank,
                                'postcode': this.contractdataForm.zipcode,
                                'mobile': this.contractdataForm.phone
                            })
                        }).then(({ data }) => {
                            // console.log(data)
                            if (data && data.code === 0) {
                                this.$nextTick(() => {
                                    this.$refs['contractdataFormref'].clearValidate()
                                })
                                this.getweixinInfo()  //获取微信收款信息
                                if (this.active++ > 5) this.active = 0;
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })
            },


            //获取微信信息
            getweixinInfo() {
                this.wxdataForm.id = ""
                this.$http({
                    url: this.$http.adornUrl(`agent/set/findWeixinpay?token=${this.$cookie.get('token')}&agentId=${this.agentId}`),
                    method: 'post',
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        if (data.data !== null) {
                            this.wxdataForm.wxkey = data.data.wxkey
                            this.wxdataForm.wxappid = data.data.appid
                            this.wxdataForm.wxmchid = data.data.mchid
                            this.wxdataForm.wxcallbackUrl = data.data.callbackUrl
                            this.wxdataForm.wxcallUrl = data.data.callUrl
                            this.wxdataForm.id = data.data.id
                        } else {

                            this.wxdataForm.wxkey = ""
                            this.wxdataForm.wxappid = ""
                            this.wxdataForm.wxmchid = ""
                            this.wxdataForm.wxcallbackUrl = ""
                            this.wxdataForm.wxcallUrl = ""
                        }
                    }
                })
            },

            // 提交微信信息
            submitweixin() {

                this.$http({
                    url: this.$http.adornUrl(`agent/set/updateWeixinpay?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'agentId': this.agentId,
                        'id': this.wxdataForm.id,
                        'appid': this.wxdataForm.wxappid,
                        'callUrl': this.wxdataForm.wxcallUrl,
                        'callbackUrl': this.wxdataForm.wxcallbackUrl,
                        'mchid': this.wxdataForm.wxmchid,
                        'wxkey': this.wxdataForm.wxkey,
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.getWxLoginInfo()//获取微信登录信息
                        if (this.active++ > 5) this.active = 0;

                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            // 获取微信登录信息
            getWxLoginInfo() {
                this.wxLoginForm.id = ""
                this.$http({
                    url: this.$http.adornUrl(`agent/set/findWxLogin?token=${this.$cookie.get('token')}&agentId=${this.agentId}`),
                    method: 'post',
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        if (data.data !== null) {
                            this.wxLoginForm.APPID = data.data.appid
                            this.wxLoginForm.APPSECRET = data.data.appSecret
                            this.wxLoginForm.id = data.data.id
                        } else {
                            this.wxLoginForm.APPID = ""
                            this.wxLoginForm.APPSECRET = ""
                        }
                    }
                })
            },
            // 提交完成最后一步微信登录信息
            submitweiLogin() {
                this.$http({
                    url: this.$http.adornUrl(`agent/set/updateWxLogin?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'agentId': this.agentId,
                        'id': this.wxLoginForm.id,
                        'appid': this.wxLoginForm.APPID,
                        'appSecret': this.wxLoginForm.APPSECRET,
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.$message({
                            message: "操作成功",
                            type: "success",
                            duration: 1500,
                            onClose: () => {
                                this.flagVisibile = false
                                this.seeflagVisibile = true
                                this.getBasicInfo()
                            }
                        });
                        if (this.active++ >= 5) this.active = 0;
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            lastStep() {
                if (this.active == 1) {
                    let agentId = this.agentId
                    this.$refs['customerdataList'].clearValidate()
                    this.getBasicInfo(agentId)
                } else if (this.active == 2) {
                    this.$refs['domaindataList'].clearValidate()
                    this.getkfinfo()
                } else if (this.active == 4) {
                    this.$refs['contractdataFormref'].clearValidate()
                    this.getalipay()
                } else if (this.active == 6) {
                    this.getweixinInfo()
                } else if (this.active == 5) {
                    this.$refs['wxdataFormref'].clearValidate()
                    this.getcontractinfo()

                }
                this.active--;
            },
            closeDialog() { },
            // 上传微信二维码
            actionWx() {
                let url = this.$http.adornUrl(`file/image/upload?imageType=7&token=${this.$cookie.get('token')}`);
                return url;
            },
            beforeAvatarUploadWx(file) {
                const isJPG = (file.type == 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error("上传微信图片只能是背景为透明的png 格式!");
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
            handleAvatarSuccessWx(res, file) {
                this.wxUrl = res.data.licenseUrl
                this.customerDataForm.imageUrlWx = URL.createObjectURL(file.raw);
                this.delWXimgVisible = true
            },
            errorWx() {
                console.log("yyyyyy");
            },
            onProgressWx() {
                console.log("上传中");
            },
            //上传 执行顺序：beforeAvatarUpload ---执行action提交----执行handleAvatarSuccess or uploadError
            actionLogo() {
                let url = this.$http.adornUrl(`file/image/upload?token=${this.$cookie.get('token')}`);

                return url;
            },
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
            handleAvatarSuccessLogo(res, file) {
                this.logoUrl = res.data.licenseUrl
                this.basicdataForm.imageUrlLogo = URL.createObjectURL(file.raw);
            },
            errorLogo() {
                console.log("yyyyyy");
            },
            onProgressLogo() {
                console.log("上传中");
            },
            // 上传icon
            actionIcon() {
                let url = this.$http.adornUrl(`file/image/upload?token=${this.$cookie.get('token')}`);
                return url;
            },
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
            handleAvatarSuccessIcon(res, file) {
                this.iconUrl = res.data.licenseUrl
                this.basicdataForm.imageUrlIcon = URL.createObjectURL(file.raw);
            },
            errorIcon() {
                console.log("yyyyyy");
            },
            onProgressIcon() {
                console.log("上传中");
            },

            //上传代表签字
            actionSignatures() {
                let url = this.$http.adornUrl(`file/image/upload?token=${this.$cookie.get('token')}`);
                return url;
            },
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
            handleAvatarSuccessSignatures(res, file) {
                this.signUrl = res.data.licenseUrl
                this.basicdataForm.imageUrlSignatures = URL.createObjectURL(file.raw);
            },
            errorSignatures() {
                console.log("yyyyyy");
            },
            onProgressSignatures() {
                console.log("上传中");
            },

            // 上传公司红章

            actionChapter() {
                let url = this.$http.adornUrl(`file/image/upload?token=${this.$cookie.get('token')}`);
                return url;
            },
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
            handleAvatarSuccessChapter(res, file) {
                this.sealUrl = res.data.licenseUrl
                this.basicdataForm.imageUrlChapter = URL.createObjectURL(file.raw);
            },
            errorChapter() {
                console.log("yyyyyy");
            },
            onProgressChapter() {
                console.log("上传中");
            },
            handleChange(val) {
                if (val == 2) {  //客服信息
                    this.customerDataForm.kfLine = ""
                    this.customerDataForm.keyqq = ""
                    this.customerDataForm.businNO = ""
                    this.customerDataForm.beautyID = ""
                    this.customerDataForm.browserDisplay = ""
                    this.$http({
                        url: this.$http.adornUrl(`agent/set/findCustService?token=${this.$cookie.get('token')}&agentId=${this.agentId}`),
                        method: 'post',
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            if (data.data !== null) {
                                this.customerDataForm.kfLine = data.data.hotline
                                this.customerDataForm.keyqq = data.data.qq
                                this.customerDataForm.beautyID = data.data.meiqiaEntid
                                this.customerDataForm.businNO = data.data.bizNo
                                if (data.data.weixinUrl) {
                                    this.customerDataForm.imageUrlWx = imgUrl.imgUrl + data.data.weixinUrl
                                }
                                // 0 关  1 开
                                if (data.data.rightDisplay == 0) {
                                    this.customerDataForm.browserDisplay = false
                                } else if (data.data.rightDisplay == 1) {
                                    this.customerDataForm.browserDisplay = true
                                }
                            }

                        }
                    })
                } else if (val == 3) {  //域名
                    this.domainDataForm.copyinfo = ""
                    this.domainDataForm.compAdress = ""
                    this.domainDataForm.telservice = ""
                    this.domainDataForm.icpInfo = ""
                    this.domainDataForm.secrecord = ""
                    this.domainDataForm.custHotline = ""
                    this.domainDataForm.id = ""
                    this.$http({
                        url: this.$http.adornUrl(`agent/set/findDomainInfo?token=${this.$cookie.get('token')}&agentId=${this.agentId}`),
                        method: 'post',
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            if (data.data !== null) {
                                this.domainDataForm.copyinfo = data.data.copyright
                                this.domainDataForm.compAdress = data.data.address
                                this.domainDataForm.telservice = data.data.licence
                                this.domainDataForm.icpInfo = data.data.icpRecord
                                this.domainDataForm.secrecord = data.data.policeRecord
                                this.domainDataForm.custHotline = data.data.contactInfo
                                this.domainDataForm.id = data.data.id
                            }

                        }
                    })
                } else if (val == 4) { //支付宝资料
                    this.alipaydataForm.aliappid = ""
                    this.alipaydataForm.alicallUrl = ""
                    this.alipaydataForm.alicallbackUrl = ""
                    this.alipaydataForm.alipublicKey = ""
                    this.alipaydataForm.aliprivateKey = ""
                    this.$http({
                        url: this.$http.adornUrl(`agent/set/findAlipay?token=${this.$cookie.get('token')}&agentId=${this.agentId}`),
                        method: 'post',
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            if (data.data !== null) {
                                this.alipaydataForm.aliappid = data.data.appid
                                this.alipaydataForm.alicallUrl = data.data.callUrl
                                this.alipaydataForm.alicallbackUrl = data.data.callbackUrl
                                this.alipaydataForm.alipublicKey = data.data.publicKey
                                this.alipaydataForm.aliprivateKey = data.data.privateKey
                            }

                        }
                    })
                } else if (val == 5) {  //合同
                    this.contractdataForm.comName = ""
                    this.contractdataForm.comAdress = ""
                    this.contractdataForm.comAccount = ""
                    this.contractdataForm.openBank = ""
                    this.contractdataForm.zipcode = ""
                    this.contractdataForm.phone = ""
                    this.$http({
                        url: this.$http.adornUrl(`agent/set/findContract?token=${this.$cookie.get('token')}&agentId=${this.agentId}`),
                        method: 'post',
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            if (data.data !== null) {
                                this.contractdataForm.comName = data.data.companyName
                                this.contractdataForm.comAdress = data.data.companyAddress
                                this.contractdataForm.comAccount = data.data.accountNo
                                this.contractdataForm.openBank = data.data.bankName
                                this.contractdataForm.zipcode = data.data.postcode
                                this.contractdataForm.phone = data.data.mobile
                            }

                        }
                    })
                } else if (val == 6) {
                    this.wxdataForm.wxkey = ""
                    this.wxdataForm.wxappid = ""
                    this.wxdataForm.wxmchid = ""
                    this.wxdataForm.wxcallbackUrl = ""
                    this.wxdataForm.wxcallUrl = ""
                    this.$http({
                        url: this.$http.adornUrl(`agent/set/findWeixinpay?token=${this.$cookie.get('token')}&agentId=${this.agentId}`),
                        method: 'post',
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            if (data.data !== null) {
                                this.wxdataForm.wxkey = data.data.wxkey
                                this.wxdataForm.wxappid = data.data.appid
                                this.wxdataForm.wxmchid = data.data.mchid
                                this.wxdataForm.wxcallbackUrl = data.data.callbackUrl
                                this.wxdataForm.wxcallUrl = data.data.callUrl
                            }


                        }
                    })
                } else if (val == 7) {
                    // alert('微信登录信息')
                    this.wxLoginForm.APPID = ""
                    this.wxLoginForm.APPSECRET = ""
                    this.$http({
                        url: this.$http.adornUrl(`agent/set/findWxLogin?token=${this.$cookie.get('token')}&agentId=${this.agentId}`),
                        method: 'post',
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            if (data.data !== null) {
                                this.wxLoginForm.APPID = data.data.appid
                                this.wxLoginForm.APPSECRET = data.data.appSecret
                            }
                        }
                    })
                }
            }

        }
    };

</script>
<style lang="scss">
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