webpackJsonp([24],{"5Q/c":function(a,e,t){var l=t("YR/3");"string"==typeof l&&(l=[[a.i,l,""]]),l.locals&&(a.exports=l.locals);t("XkoO")("2dde9b5f",l,!0)},E6eT:function(a,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=t("A+mb"),o={data:function(){return{dialogVisible:!1,labelPosition:"right",seeImageUrl:"",dataForm:{id:0,businNumber:"",companyName:"",bussicAdress:"",lawName:"",businNum:"",busindate1:"",busindate2:"",username:"",mobile:"",email:"",work:"",loginAcc:"",pwd:"",agencylevel:"",price:"",allowCounts:""}}},methods:{showInit:function(a){var e=this;this.dialogVisible=!0,this.dataForm.id=a,this.$http({url:this.$http.adornUrl("agent/agentInfo/detail?token="+this.$cookie.get("token")+"&agentId="+this.dataForm.id),method:"get",params:this.$http.adornParams()}).then(function(a){var t=a.data;t&&0===t.code&&(e.seeImageUrl=l.a.imgUrl+t.data.licenseUrl,e.dataForm.businNumber=t.data.mchId,e.dataForm.companyName=t.data.companyName,e.dataForm.bussicAdress=t.data.address,e.dataForm.lawName=t.data.legalPerson,e.dataForm.businNum=t.data.licenseNo,e.dataForm.busindate1=t.data.effectDate,e.dataForm.busindate2=t.data.expireDate,e.dataForm.username=t.data.contactName,e.dataForm.mobile=t.data.mobile,e.dataForm.email=t.data.email,e.dataForm.work=t.data.position,e.dataForm.loginAcc=t.data.mobile,e.dataForm.agencylevel=t.data.levelId,e.dataForm.price=t.data.price,e.dataForm.allowCounts=t.data.emptyWarnNumber)})}}},r={render:function(){var a=this,e=a.$createElement,t=a._self._c||e;return t("div",{attrs:{id:"seeAgent"}},[t("el-dialog",{attrs:{title:"查看",visible:a.dialogVisible,width:"52%"},on:{"update:visible":function(e){a.dialogVisible=e}}},[t("el-form",{ref:"dataForm",staticClass:"demo-ruleForm",attrs:{model:a.dataForm,"label-width":"150px","label-position":a.labelPosition}},[t("el-form-item",{attrs:{label:"营业执照："}},[t("el-upload",{staticClass:"avatar-uploader",attrs:{action:"","show-file-list":!1,disabled:""}},[a.seeImageUrl?t("img",{staticClass:"avatar",attrs:{src:a.seeImageUrl}}):t("i",{staticClass:"el-icon-plus avatar-uploader-icon"})])],1),a._v(" "),t("el-form-item",{attrs:{label:"商户编号："}},[t("el-input",{attrs:{placeholder:"商户编号",readonly:""},model:{value:a.dataForm.businNumber,callback:function(e){a.$set(a.dataForm,"businNumber",e)},expression:"dataForm.businNumber"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"公司名称："}},[t("el-input",{attrs:{placeholder:"公司名称",readonly:""},model:{value:a.dataForm.companyName,callback:function(e){a.$set(a.dataForm,"companyName",e)},expression:"dataForm.companyName"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"营业执照所在地："}},[t("el-input",{attrs:{placeholder:"营业执照所在地",readonly:""},model:{value:a.dataForm.bussicAdress,callback:function(e){a.$set(a.dataForm,"bussicAdress",e)},expression:"dataForm.bussicAdress"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"法人姓名："}},[t("el-input",{attrs:{placeholder:"法人姓名",readonly:""},model:{value:a.dataForm.lawName,callback:function(e){a.$set(a.dataForm,"lawName",e)},expression:"dataForm.lawName"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"营业执照号："}},[t("el-input",{attrs:{placeholder:"营业执照号",readonly:""},model:{value:a.dataForm.businNum,callback:function(e){a.$set(a.dataForm,"businNum",e)},expression:"dataForm.businNum"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"营业期限："}},[t("el-input",{staticStyle:{width:"35%"},attrs:{placeholder:"营业执照号",readonly:""},model:{value:a.dataForm.busindate1,callback:function(e){a.$set(a.dataForm,"busindate1",e)},expression:"dataForm.busindate1"}}),a._v("至\n                "),t("el-input",{staticStyle:{width:"35%"},attrs:{placeholder:"营业执照号",readonly:""},model:{value:a.dataForm.busindate2,callback:function(e){a.$set(a.dataForm,"busindate2",e)},expression:"dataForm.busindate2"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"联系人姓名："}},[t("el-input",{attrs:{placeholder:"联系人姓名",readonly:""},model:{value:a.dataForm.username,callback:function(e){a.$set(a.dataForm,"username",e)},expression:"dataForm.username"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"联系人手机号："}},[t("el-input",{attrs:{placeholder:"联系人手机号",readonly:""},model:{value:a.dataForm.mobile,callback:function(e){a.$set(a.dataForm,"mobile",e)},expression:"dataForm.mobile"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"联系人邮箱："}},[t("el-input",{attrs:{placeholder:"联系人邮箱",readonly:""},model:{value:a.dataForm.email,callback:function(e){a.$set(a.dataForm,"email",e)},expression:"dataForm.email"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"职务："}},[t("el-input",{attrs:{placeholder:"职务",readonly:""},model:{value:a.dataForm.work,callback:function(e){a.$set(a.dataForm,"work",e)},expression:"dataForm.work"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"登录账号："}},[t("el-input",{attrs:{placeholder:"登录账号",readonly:""},model:{value:a.dataForm.loginAcc,callback:function(e){a.$set(a.dataForm,"loginAcc",e)},expression:"dataForm.loginAcc"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"代理级别："}},[t("el-input",{attrs:{placeholder:"代理级别",readonly:""},model:{value:a.dataForm.agencylevel,callback:function(e){a.$set(a.dataForm,"agencylevel",e)},expression:"dataForm.agencylevel"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"单价："}},[t("el-input",{attrs:{placeholder:"单价",readonly:""},model:{value:a.dataForm.price,callback:function(e){a.$set(a.dataForm,"price",e)},expression:"dataForm.price"}}),a._v(" "),t("span",[a._v("元/条")])],1),a._v(" "),t("el-form-item",{attrs:{label:"预警条数："}},[t("el-input",{attrs:{placeholder:"预警条数",readonly:""},model:{value:a.dataForm.allowCounts,callback:function(e){a.$set(a.dataForm,"allowCounts",e)},expression:"dataForm.allowCounts"}}),a._v(" "),t("span",[a._v("条")])],1)],1),a._v(" "),t("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[t("el-button",{on:{click:function(e){a.dialogVisible=!1}}},[a._v("取 消")]),a._v(" "),t("el-button",{attrs:{type:"primary"},on:{click:function(e){a.dialogVisible=!1}}},[a._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var s=t("46Yf")(o,r,!1,function(a){t("5Q/c")},null,null);e.default=s.exports},"YR/3":function(a,e,t){(a.exports=t("acE3")(!1)).push([a.i,"\n#seeAgent .el-input__inner {\n    border: none !important;\n}\n",""])}});