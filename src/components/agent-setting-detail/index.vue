<template>
    <el-collapse class="view-agent-set-info" accordion v-model="activeNames">
        <el-collapse-item title="基本信息 ✚" name="1">
            <table class="discribe-wrapper" border>
                <tbody>
                    <tr class="discribe-row">
                        <td class="discribe-col title">代理商编号</td>
                        <td class="discribe-col">
                            <div>{{ agentSettingInfo.agentId ? agentSettingInfo.agentId + '' : '' }}</div>
                        </td>
                        <td class="discribe-col title">代理商名称</td>
                        <td class="discribe-col">{{ agentSettingInfo.agentName }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">代理商logo</td>
                        <td class="discribe-col">
                            <img v-if="agentSettingInfo.agentLogo" :src="`${$imgPreStr + agentSettingInfo.agentLogo}`" />
                        </td>
                        <td class="discribe-col title">代理商icon</td>
                        <td class="discribe-col">
                            <img v-if="agentSettingInfo.agentIcon" :src="`${$imgPreStr + agentSettingInfo.agentIcon}`" />
                        </td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">代表签字</td>
                        <td class="discribe-col">
                            <img style="width: 200px;" v-if="agentSettingInfo.deputySignature" :src="`${$imgPreStr + agentSettingInfo.deputySignature}`" />
                        </td>
                        <td class="discribe-col title">公司红章</td>
                        <td class="discribe-col">
                            <img v-if="agentSettingInfo.companyChop" :src="`${$imgPreStr + agentSettingInfo.companyChop}`" />
                        </td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">短信签名</td>
                        <td class="discribe-col">{{ agentSettingInfo.smsSignature }}</td>
                        <td class="discribe-col title">代理商域名</td>
                        <td class="discribe-col">
                            <div>{{ agentSettingInfo.domain }}</div>    
                        </td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">网站名称</td>
                        <td class="discribe-col">
                            <div>{{ agentSettingInfo.siteName }}</div>
                        </td>
                        <td class="discribe-col title">seo优化页面关键字</td>
                        <td class="discribe-col">{{ agentSettingInfo.seoKeywords }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">seo优化页面描述内容</td>
                        <td class="discribe-col">{{ agentSettingInfo.seoDescription }}</td>
                        <td class="discribe-col title">51la的站长统计</td>
                        <td class="discribe-col">{{ agentSettingInfo.la51Src }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">百度的站长统计</td>
                        <td class="discribe-col">{{ agentSettingInfo.baiduSrc }}</td>
                        <td class="discribe-col title">百度营销账号token</td>
                        <td class="discribe-col">
                            <div>{{ agentSettingInfo.baiduocpcToken }}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </el-collapse-item>
        <el-collapse-item title="客服资料 ✚" name="2">
            <table class="discribe-wrapper" border>
                <tbody>
                    <tr class="discribe-row">
                        <td class="discribe-col title">浏览器右侧显示</td>
                        <td class="discribe-col">{{ agentSettingInfo.browserRightDisplay ? '是' : '否' }}</td>
                        <td class="discribe-col title">客服昵称</td>
                        <td class="discribe-col">{{ agentSettingInfo.kefuNickname }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">客服热线</td>
                        <td class="discribe-col">{{ agentSettingInfo.hotline }}</td>
                        <td class="discribe-col title">客服QQ</td>
                        <td class="discribe-col">{{ agentSettingInfo.qq }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">商务合作号</td>
                        <td class="discribe-col">{{ agentSettingInfo.businessCode }}</td>
                        <td class="discribe-col title">微信二维码</td>
                        <td class="discribe-col">
                            <img v-if="agentSettingInfo.wechatQrcode" :src="`${$imgPreStr + agentSettingInfo.wechatQrcode}`" />
                        </td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">运维人手机号</td>
                        <td class="discribe-col">{{ agentSettingInfo.maintainerPhone }}</td>
                        <td class="discribe-col title">运维人QQ号</td>
                        <td class="discribe-col">{{ agentSettingInfo.maintainerQq }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">运维人昵称</td>
                        <td class="discribe-col">{{ agentSettingInfo.maintainerNickname }}</td>
                        <td class="discribe-col title">运维人微信二维码</td>
                        <td class="discribe-col">
                            <img v-if="agentSettingInfo.maintainerWechatQrcode" :src="`${$imgPreStr + agentSettingInfo.maintainerWechatQrcode}`" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </el-collapse-item>
        <el-collapse-item title="域名备案信息 ✚" name="3">
            <table class="discribe-wrapper" border>
                <tbody>
                    <tr class="discribe-row">
                        <td class="discribe-col title">域名版权信息</td>
                        <td class="discribe-col">{{ agentSettingInfo.domainCopyright }}</td>
                        <td class="discribe-col title">公司地址</td>
                        <td class="discribe-col">{{ agentSettingInfo.domainCompanyAddress }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">联系方式</td>
                        <td class="discribe-col">{{ agentSettingInfo.domainContactWay }}</td>
                        <td class="discribe-col title">增值电信业务经营许可证</td>
                        <td class="discribe-col">
                            <div>{{ agentSettingInfo.telecomCertification }}</div>
                        </td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">ICP备案</td>
                        <td class="discribe-col">
                            <div>{{ agentSettingInfo.icp }}</div>
                        </td>
                        <td class="discribe-col title">公安备案</td>
                        <td class="discribe-col">
                            <div>{{ agentSettingInfo.publicSecurityFiling }}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </el-collapse-item>
        <el-collapse-item title="收款资料 ✚" name="4">
            <table class="discribe-wrapper" border>
                <tbody>
                    <tr class="discribe-row">
                        <td class="discribe-col title">对公收款人</td>
                        <td class="discribe-col">{{ agentSettingInfo.payeePublic }}</td>
                        <td class="discribe-col title">对公收款银行</td>
                        <td class="discribe-col">{{ agentSettingInfo.payBankPublic }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">对公收款账号</td>
                        <td class="discribe-col">
                            <div>{{ agentSettingInfo.payAccountPublic }}</div>
                        </td>
                        <td class="discribe-col title">对私收款人</td>
                        <td class="discribe-col">{{ agentSettingInfo.payeePrivate }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">对私收款银行</td>
                        <td class="discribe-col">{{ agentSettingInfo.payBankPrivate }}</td>
                        <td class="discribe-col title">对私收款账号</td>
                        <td class="discribe-col">
                            <div>{{ agentSettingInfo.payAccountPrivate }}</div>
                        </td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">微信收款人</td>
                        <td class="discribe-col">{{ agentSettingInfo.payeeWechat }}</td>
                        <td class="discribe-col title">微信收款二维码</td>
                        <td class="discribe-col">
                            <img v-if="agentSettingInfo.payQrcodeWechat" :src="`${$imgPreStr + agentSettingInfo.payQrcodeWechat}`" />
                        </td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">微信收款账号</td>
                        <td class="discribe-col">{{ agentSettingInfo.payAccountWechat }}</td>
                        <td class="discribe-col title">支付宝收款人</td>
                        <td class="discribe-col">{{ agentSettingInfo.payeeAlipay }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">支付宝收款二维码</td>
                        <td class="discribe-col">
                            <img v-if="agentSettingInfo.payQrcodeAlipay" :src="`${$imgPreStr + agentSettingInfo.payQrcodeAlipay}`" />
                        </td>
                        <td class="discribe-col title">支付宝收款账号</td>
                        <td class="discribe-col">{{ agentSettingInfo.payAccountAlipay }}</td>
                    </tr>
                </tbody>
            </table>
        </el-collapse-item>
        <el-collapse-item title="支付宝资料 ✚" name="5">
            <table class="discribe-wrapper" border>
                <tbody>
                    <tr class="discribe-row">
                        <td class="discribe-col title">支付宝应用ID</td>
                        <td class="discribe-col">
                            <div>{{ agentSettingInfo.alipayAppid }}</div>
                        </td>
                        <td class="discribe-col title">支付宝网关地址</td>
                        <td class="discribe-col">
                            <div>{{ agentSettingInfo.alipayGateway }}</div>
                        </td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">支付回调地址</td>
                        <td class="discribe-col">
                            <div>{{ agentSettingInfo.alipayNotify }}</div>
                        </td>
                        <td class="discribe-col title">支付宝公钥</td>
                        <td class="discribe-col">
                            <div>{{ agentSettingInfo.alipayPublicKey }}</div>
                        </td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">应用私钥</td>
                        <td class="discribe-col" colspan="3" style="width: 75%;">
                            <div style="width: 500px;">{{ agentSettingInfo.applicationPrivateKey }}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </el-collapse-item>
        <el-collapse-item title="合同资料 ✚" name="6">
            <table class="discribe-wrapper" border>
                <tbody>
                    <tr class="discribe-row">
                        <td class="discribe-col title">合同资料公司名称</td>
                        <td class="discribe-col">
                            <div>{{ agentSettingInfo.contactCompanyName }}</div>
                        </td>
                        <td class="discribe-col title">合同资料公司地址</td>
                        <td class="discribe-col">{{ agentSettingInfo.contactCompanyAddress }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">合同资料公司账户</td>
                        <td class="discribe-col">
                            <div>{{ agentSettingInfo.contactCompanyAccount }}</div>
                        </td>
                        <td class="discribe-col title">合同资料公司开户行</td>
                        <td class="discribe-col">{{ agentSettingInfo.contactCompanyBank }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">合同资料邮编</td>
                        <td class="discribe-col">{{ agentSettingInfo.contactPostcode }}</td>
                        <td class="discribe-col title">合同资料电话</td>
                        <td class="discribe-col">{{ agentSettingInfo.contactPhone }}</td>
                    </tr>
                </tbody>
            </table>
        </el-collapse-item>
        <el-collapse-item title="微信资料 ✚" name="7">
            <table class="discribe-wrapper" border>
                <tbody>
                    <tr class="discribe-row">
                        <td class="discribe-col title">微信网关地址</td>
                        <td class="discribe-col">
                            <div>{{ agentSettingInfo.wechatGateway }}</div>
                        </td>
                        <td class="discribe-col title">微信支付回调地址</td>
                        <td class="discribe-col">
                            <div>{{ agentSettingInfo.wechatpayNotify }}</div>
                        </td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">微信应用ID</td>
                        <td class="discribe-col">
                            <div>{{ agentSettingInfo.wechatAppid }}</div>
                        </td>
                        <td class="discribe-col title">微信mchid</td>
                        <td class="discribe-col">
                            <div>{{ agentSettingInfo.wechatMchid }}</div>
                        </td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">微信key</td>
                        <td class="discribe-col">{{ agentSettingInfo.wechatKey }}</td>
                        <td class="discribe-col title">微信秘钥</td>
                        <td class="discribe-col">{{ agentSettingInfo.wechatAppsecret }}</td>
                    </tr>
                </tbody>
            </table>
        </el-collapse-item>
        <el-collapse-item title="其他 ✚" name="8">
            <table class="discribe-wrapper" border>
                <tbody>
                    <tr class="discribe-row">
                        <td class="discribe-col title">服务协议</td>
                        <td class="discribe-col" colspan="3" style="width: 75%;">
                            <div>
                                <UE :defaultMsg="agentSettingInfo.agreement" :config="config" ref="ue"></UE>
                            </div>
                        </td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">备注</td>
                        <td class="discribe-col" colspan="3" style="width: 75%;">
                            <div style="width: 600px;">{{ agentSettingInfo.remark }}</div>
                        </td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">审批状态</td>
                        <td class="discribe-col">{{ stateMap[agentSettingInfo.state] }}</td>
                        <td class="discribe-col title">创建时间</td>
                        <td class="discribe-col">{{ agentSettingInfo.createTime }}</td>
                    </tr>
                </tbody>
            </table>
        </el-collapse-item>
    </el-collapse>
</template>

<script>
    import UE from '../ue/ue6.vue';
    export default {
        components: { UE },
        data() {
            return {
                activeNames: ['1'],
                agentSettingInfo: {},
                stateMap: {
                    '0': '待审核',
                    '9': '已认证',
                    '1': '已驳回',
                },
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
            init(initData) {
                this.activeNames = ['1']
                this.agentSettingInfo = initData || {}
            },
        }
    }

</script>

<style lang="scss">

    .view-agent-set-info .edui-default .edui-editor-bottomContainer {
        display: none;
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

    .mainAess .el-input__inner {
        border: none
    }

    #picImgSizeDemo .el-upload,
    #picImgSizeDemo1 .el-upload {
        width: 180px;
        height: 150px;
    }

    #picImgSizeDemo .el-upload img,
    #picImgSizeDemo1 .el-upload img {
        width: 100%;
        height: 100%
    }
</style>
<style lang="scss" scoped>
/deep/ .el-collapse {
    border: 1px solid #ebeef5;
    .el-collapse-item__header {
        background: #fafafa;
        padding: 0px 8px 0px 12px;
    }
    .el-collapse-item__content {
        padding: 20px;
    }
}
</style>