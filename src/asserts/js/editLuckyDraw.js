/**
 * Created by zhouchen on 16/5/18.
 */
var formDataModel = '';
var $form = $("#formContainer");
var $btnBox = $(".btn-box");

//获取表单模型
wisAjax2(interfaceDef.formModel, "",function(data){
    formDataModel = data.models[16].controls;
    $(formDataModel).each(function () {
        this.get = function (field) {
            return this[field];
        }
    })
},false);

//渲染表单
$form.emapForm({
    model: "h",
    data: formDataModel,
    readonly: false
});

//获取表单数据
var luckyDraw;
wisAjax2(rootPath+interfaceDef.luckyDrawManage.oneLuckyDraw+getQueryString("luckyDrawId"),"",
    function(data){
        luckyDraw = data.datas;
        luckyDraw.contentId = (data.datas.contentId == '') ? '暂未关联内容' : data.datas.contentId;
        //向表单中填充数据
        $form.emapForm("setValue", luckyDraw);
    },false);


//点击保存提交表单
$btnBox.on("click","#btn-edit",function(){
    if ($form.emapValidate("validate") && !($(this).hasClass("tagIdExist"))) {
        var ajaxForm = $form.emapForm("getValue");//获取表单数据
        wisAjax(rootPath+interfaceDef.luckyDrawManage.editLuckyDraw, ajaxForm, function (data) {
            if (data.status == "success") {
                BH_UTILS.bhDialogSuccess({
                    title:'编辑成功!',
                    callback:function(){
                        // window.location.href = '../html/luckyDrawManage.html';
                        window.close();
                    }
                });
            } else {
                $.bhDialog({
                    title:'编辑失败!错误原因:'+data.errorMsg,
                    //content:'',
                    width:464,
                    //height:400,
                    className:'bh-dialog-text',
                    buttons:[{text:'好的',className:'bh-btn-primary'}]
                });
            }
        });
    }

});

$btnBox.on("click","#btn-cancel",function(){
    window.location.href = "../html/luckyDrawManage.html";
});


