/**
 * Created by zhouchen on 16/5/18.
 */
/**
 * Created by zhouchen on 16/5/18.
 */
/**
 * Created by zhouchen on 16/3/17.
 */
var formDataModel;
var $form = $("#formContainer");
var $btnBox = $(".btn-box");

//获取表单模型
wisAjax2(interfaceDef.formModel, "",function(data){
    formDataModel = data.models[7].controls;
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
var tag;
wisAjax2(rootPath+interfaceDef.tagManage.oneTag+getQueryString("tagId"),"",
    function(data){
        tag = data.datas;
        //向表单中填充数据
        $form.emapForm("setValue", tag);
    },false);


//点击保存提交表单
$btnBox.on("click","#btn-edit",function(){
    if ($form.emapValidate("validate") && !($(this).hasClass("tagIdExist"))) {
        var ajaxForm = $form.emapForm("getValue");//获取表单数据
        ajaxForm.tagDomain = 0;
        wisAjax(rootPath+interfaceDef.tagManage.editTag, ajaxForm, function (data) {
            if (data.status == "success") {
                BH_UTILS.bhDialogSuccess({
                    title:'编辑成功!',
                    callback:function(){
                        // window.location.href = '../html/tagManage.html';
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
    window.location.href = "tagManage.html";
});


