webpackJsonp([29],{Cowt:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={data:function(){return{visible:!1,remarkText:"",remarkMessage:"",tradeNoValue:"",companyName:null,accountUsername:null,accountPhone:null,disabled:!1,condition:null,preMoney:null,actualMoney:null,orderTypeName:null,discountMoney:null,balanceVisible:!1,dataForm:{aid:76},dataList:{id:null,auditResult:null,auditMark:null,orderType:null,tradeNo:null},chooseDate:null}},methods:{init:function(t,e){var a=t.companyName,r=t.id,i=t.accountPhone,s=t.discountMoney,n=t.orderNo,o=t.actualMoney,l=t.preMoney,d=t.orderTypeName,u=t.orderType,c=t.tradeNo;this.visible=!0,this.companyName=a,this.accountPhone=i,this.actualMoney=o,this.preMoney=l,this.tradeNo=c,this.orderTypeName=d,this.dataList.orderType=u,this.discountMoney=s,this.dataList.orderNo=n,this.dataList.id=r,"success"==e?(this.condition=!0,this.dataList.auditResult=!0):"error"==e&&(this.condition=!1,this.dataList.auditResult=!1)},saveData:function(){var t=this;this.disabled=!0,this.$http({url:this.$http.adornUrl("/biz/incomeorder/audit"),method:"post",headers:{"Content-Type":"application/x-www-form-urlencoded;charset=utf-8"},data:this.$http.adornData(this.dataList,!0,"form")}).then(function(e){var a=e.data;a&&0===a.code?t.$message({message:"操作成功",type:"success",duration:1500,onClose:function(){t.disabled=!1,t.visible=!1,t.$emit("refreshDataList"),t.dataList.remarkText="",t.auditResult=null}}):(t.disabled=!1,t.auditResult=null,t.$emit("refreshDataList",!0),t.$message.error(a.msg))})},rebutData:function(){var t=this;this.disabled=!0,this.$http({url:this.$http.adornUrl("/biz/incomeorder/audit"),method:"post",headers:{"Content-Type":"application/x-www-form-urlencoded;charset=utf-8"},data:this.$http.adornData(this.dataList,!0,"form")}).then(function(e){var a=e.data;a&&0===a.code?t.$message({message:"操作成功",type:"success",duration:1500,onClose:function(){t.disabled=!1,t.visible=!1,t.$emit("refreshDataList"),t.dataList.remarkText="",t.auditResult=null}}):(t.disabled=!1,t.auditResult=null,t.$emit("refreshDataList",!0),t.$message.error(a.msg))})},saveMark:function(t){this.dataList.auditMark=this.$refs.mark.value},closeDialog:function(){this.remarkText="",this.chooseDate=null,this.tradeNoValue="",this.disabled=!1},saveTradeNo:function(t){var e=this.$refs.tradeNo.value;e?(this.disabled=!1,this.dataList.tradeNo=e):this.disabled=!0}},watch:{remarkText:function(t,e){150===t.length?this.remarkMessage="备注最多输入150字哦":this.remarkMessage=""}},filters:{currency:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3,a=arguments[2],r=arguments[3],i=arguments[4];t=(t+"").replace(/[^0-9+-Ee.]/g,""),i=i||"ceil";var s=isFinite(+t)?+t:0,n=isFinite(+e)?Math.abs(e):0,o=void 0===r?",":r,l=void 0===a?".":a,d="";d=(n?function(t,e){var a=Math.pow(10,e);return""+parseFloat(Math[i](parseFloat((t*a).toFixed(2*e))).toFixed(2*e))/a}(s,n):""+Math.round(s)).split(".");for(var u=/(-?\d+)(\d{3})/;u.test(d[0]);)d[0]=d[0].replace(u,"$1"+o+"$2");return(d[1]||"").length<n&&(d[1]=d[1]||"",d[1]+=new Array(n-d[1].length+1).join("0")),d.join(l)}}},i={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-dialog",{staticClass:"el-dialog-enter",attrs:{title:"入账审核","close-on-click-modal":!1,visible:t.visible},on:{"update:visible":function(e){t.visible=e},close:t.closeDialog}},[a("el-form",{attrs:{inline:!0,model:t.dataForm,"label-width":"100px"}},[a("el-form-item",{attrs:{label:"公司名称"}},[t._v("\n\t\t\t\t\t"+t._s(t.companyName)+"\n      ")]),a("br"),t._v(" "),a("el-form-item",{attrs:{label:"万数账号"}},[t._v("\n\t\t\t\t"+t._s(t.accountPhone)+"\n      ")]),a("br"),t._v(" "),a("el-form-item",{attrs:{label:"充值金额"}},[t._v("\n\t\t\t\t\t"+t._s(t._f("currency")(t.preMoney))+" 元\n      ")]),a("br"),t._v(" "),a("el-form-item",{attrs:{label:"优惠金额"}},[t._v("\n\t\t\t\t\t"+t._s(t._f("currency")(t.discountMoney))+" 元\n      ")]),a("br"),t._v(" "),a("el-form-item",{attrs:{label:"实际金额"}},[t._v("\n\t\t\t\t\t"+t._s(t._f("currency")(t.actualMoney))+" 元\n      ")]),a("br"),t._v(" "),a("el-form-item",{attrs:{label:"充值类型"}},[t._v("\n\t\t\t\t"+t._s(t.orderTypeName)+"\n      ")]),a("br"),t._v(" "),2==t.dataList.orderType?a("el-form-item",{attrs:{label:"银行流水号"}},[a("el-input",{ref:"tradeNo",staticClass:"tradeNoInput",attrs:{placeholder:"银行流水号"},on:{change:t.saveTradeNo},model:{value:t.tradeNoValue,callback:function(e){t.tradeNoValue=e},expression:"tradeNoValue"}})],1):t._e(),a("br"),t._v(" "),a("el-form-item",{attrs:{label:"备注"}},[a("el-input",{ref:"mark",attrs:{rows:3,cols:53,maxlength:"150",placeholder:"请输入本次操作备注",type:"textarea",clearable:""},on:{change:t.saveMark},model:{value:t.remarkText,callback:function(e){t.remarkText=e},expression:"remarkText"}}),t._v(" "),a("div",{ref:"FormDiv",staticClass:"el-form-item__error"},[t._v(" "+t._s(t.remarkMessage)+" ")]),t._v(" "),a("span",[t._v(t._s(t.remarkText.length)+"/150")])],1),a("br"),t._v(" "),!0===t.condition?a("el-button",{staticClass:"submit-button",attrs:{type:"primary",disabled:t.disabled},on:{click:t.saveData}},[t._v("提交")]):t._e(),t._v(" "),!1===t.condition?a("el-button",{staticClass:"submit-button",attrs:{type:"primary",disabled:t.disabled},on:{click:t.rebutData}},[t._v("提交")]):t._e(),t._v(" "),a("el-button",{on:{click:function(e){t.visible=!1}}},[t._v("取消")])],1)],1)},staticRenderFns:[]};var s=a("46Yf")(r,i,!1,function(t){a("uLrJ")},null,null);e.default=s.exports},n31h:function(t,e,a){(t.exports=a("acE3")(!1)).push([t.i,"\n.tradeNoInput {\r\n  width: 330px;\n}\n.el-dialog__header {\r\n  border-bottom: 1px solid #cccccc;\n}\n.el-dialog-enter .el-dialog__body {\r\n  padding: 30px 30px 30px 100px;\n}\n.submit-button {\r\n  margin-left: 120px;\r\n  margin-right: 50px;\n}\r\n\r\n",""])},uLrJ:function(t,e,a){var r=a("n31h");"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);a("XkoO")("165a7a57",r,!0)}});