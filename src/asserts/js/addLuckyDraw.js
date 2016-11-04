/**
 * Created by zhouchen on 16/5/18.
 */
var formDataModel = '';
var $form = $("#formContainer");
var $btnBox = $(".btn-box");

//获取表单模型
wisAjax2(interfaceDef.formModel, "",function(data){
    formDataModel = data.models[15].controls;
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

//点击添加提交表单
$btnBox.on("click","#btn-add",function(){
    if ($form.emapValidate("validate")) {
        var ajaxForm = $form.emapForm("getValue");//获取表单数据
        wisAjax(rootPath+interfaceDef.luckyDrawManage.addLuckyDraw, ajaxForm, function (data) {
            if (data.status == "success") {
                BH_UTILS.bhDialogSuccess({
                    title:'添加成功!',
                    //content:'删除成功!'
                    callback:function(){
                        // window.location.href = '../html/luckyDrawManage.html';
                        window.close();
                    }
                });
            } else {
                $.bhDialog({
                    title:'添加失败!错误原因:'+data.errorMsg,
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


