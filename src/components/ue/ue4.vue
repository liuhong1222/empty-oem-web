<template>
        <div>
            <script id="editor4" type="text/plain"></script>
            <!-- <span>{{defaultMsg}}</span> -->
        </div>
    </template>
    <script>
        export default {
            name: 'UE',
            data() {
                return {
                    editor4: null,
                    newsCon: '',
                }
            },
            props: {
                defaultMsg: {
                    type: String,
                },
                config: {
                    type: Object,
                }
            },
    
            mounted() {
                // const _this = this;
                this.editor4 = UE.getEditor('editor4', this.config);
                // this.editor4.addListener("ready", function () {
                //     _this.editor4.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
                // });
            },
            watch: {
                defaultMsg(nv) {
                    if (nv) {
                        // debugger
                        // console.log(nv)
                        this.editor4 = UE.getEditor('editor4', this.config);
                        this.editor4.setContent(nv); // 放入内容。
                    }
                }
            },
            methods: {
    
                getUEContentMsj() { // 获取内容方法
                    return this.editor4.getContent()
                },
                getContentTxtMsj() {
                    return this.editor4.getContentTxt()
                },
                execCommand() {   //清空内容
                    return this.editor4.execCommand('cleardoc');
                },
                hasContent() {
                    return this.editor4.hasContent()
                }
            },
            destroyed() {
                return this.editor4.destroy();
            }
        }
    </script>