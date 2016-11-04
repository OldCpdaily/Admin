/**
 * Created by zhouchen on 16/5/18.
 */
var formDataModel;
var $form = $("#formContainer");
var $btnBox = $(".btn-box");

//获取表单模型
wisAjax2(interfaceDef.formModel, "",function(data){
    formDataModel = data.models[6].controls;
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

var $tagIdBlock = $('#formContainer [data-field=tagId]'),
    $tagIdBox = $('#formContainer [data-name=tagId]');

//校验标签名称是否唯一
$tagIdBox.blur(function() {
    var tagId = $(this).val();
    if (tagId != ""){
        wisAjax(rootPath+interfaceDef.tagManage.validTagId,
            {
                "tagId": $(this).val()
            },
            function (data) {
                if (data.status == "success") {
                    $tagIdBlock.find("div.jqx-validator-error-info").remove();
                    $tagIdBlock.children(".bh-form-placeholder").html('<font color="green">该标签编号可用</font>');
                    $tagIdBlock.children(".bh-form-placeholder").show();
                    $tagIdBox.css("border", "");
                    $tagIdBlock.removeClass("jqx-validator-error-container");
                    $("#btn-add").removeClass("tagIdExist");
                } else if (data.status == "fail") {
                    $tagIdBlock.addClass("jqx-validator-error-container");
                    $tagIdBox.css("border", "2px solid #e24034");
                    $tagIdBlock.children(".bh-form-placeholder").hide();
                    if ($tagIdBlock.children(".jqx-validator-error-info").length == 0) {
                        $tagIdBlock.append('<div class="bh-form-group jqx-validator-error-info bh-pv-4 bh-col-md-6" style="display: block;">该标签编号已存在!请重新输入</div>');
                    }
                    $("#btn-add").addClass("tagIdExist");
                }
            });
    }
});

//点击添加提交表单
$btnBox.on("click","#btn-add",function(){
    if ($form.emapValidate("validate") && !($(this).hasClass("tagIdExist"))) {
        var ajaxForm = $form.emapForm("getValue");//获取表单数据
        ajaxForm.tagDomain = 0;
        ajaxForm.tagLevel = 0;//标签级别,添加时默认是系统级
        ajaxForm.createUser = 'admin';//创建用户,添加时默认是admin
        wisAjax(rootPath+interfaceDef.tagManage.addTag, ajaxForm, function (data) {
            if (data.status == "success") {
                BH_UTILS.bhDialogSuccess({
                    title:'添加成功!',
                    //content:'删除成功!'
                    callback:function(){
                        // window.location.href = '../html/tagManage.html';
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
    window.location.href = "tagManage.html";
});


