webpackJsonp([64],{ogUN:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l={data:function(){return{dialogFormVisible:!1,form:{name:"",region:"",date1:"",date2:"",delivery:!1,type:[],resource:"",desc:""},formLabelWidth:"120px"}},methods:{init:function(e){console.log("init + 统计"),this.dialogFormVisible=!0}}},i={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("el-dialog",{attrs:{title:"统计",visible:e.dialogFormVisible},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[o("el-form",{attrs:{model:e.form}},[o("el-form-item",{attrs:{label:"修改一","label-width":e.formLabelWidth}},[o("el-input",{attrs:{"auto-complete":"off"},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"修改二","label-width":e.formLabelWidth}},[o("el-select",{attrs:{placeholder:"修改。。。"},model:{value:e.form.region,callback:function(t){e.$set(e.form,"region",t)},expression:"form.region"}},[o("el-option",{attrs:{label:"区域一",value:"shanghai"}}),e._v(" "),o("el-option",{attrs:{label:"区域二",value:"beijing"}})],1)],1)],1),e._v(" "),o("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:function(t){e.dialogFormVisible=!1}}},[e._v("取 消")]),e._v(" "),o("el-button",{attrs:{type:"primary"},on:{click:function(t){e.dialogFormVisible=!1}}},[e._v("确 定")])],1)],1)},staticRenderFns:[]},r=o("46Yf")(l,i,!1,null,null,null);t.default=r.exports}});