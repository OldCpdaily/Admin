/**
 * Created by zhouchen on 16/3/17.
 */
var formDataModel;
var $form = $("#formContainer");
var $btnBox = $(".btn-box");

//获取表单模型
wisAjax2(interfaceDef.formModel, "",function(data){
    formDataModel = data.models[1].controls;
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

var $imgBlock = $('#formContainer [data-field=imgUrl]');
var $imgBox = $('#formContainer [data-name=imgUrl]');
var $bgBlock = $('#formContainer [data-field=backgroundImgUrl]');
var $bgBox = $('#formContainer [data-name=backgroundImgUrl]');
//给图片上传字段添加一个红星以标识
$imgBlock.find("label.bh-form-h-label").addClass("requireLabel");

$imgBox.append(
    '<div class="imgUrlBox">' +
        '<img id="uploadImg" src="../img/upload.jpg"/>' +
        '<input type="file" name="imgUrl" id="imgUrl" class="imgUrl">' +
    '</div>'
);
$bgBox.append(
    '<div class="imgUrlBox">' +
        '<img id="uploadBgImg" src="../img/upload.jpg"/>' +
        '<input type="file" name="backgroundImgUrl" id="backgroundImgUrl" class="imgUrl">' +
    '</div>'
);


$('#imgUrl').change(function(){
    if(this.files[0] !=  ""){
        $imgBlock.find("div.jqx-validator-error-info").remove();
        $imgBlock.children(".bh-form-placeholder").show();
        $imgBox.css("border","");
        $imgBlock.removeClass("jqx-validator-error-container");
    }
    $('#uploadImg').attr("src",getObjectURL(this.files[0]));
});
$('#backgroundImgUrl').change(function(){
    if(this.files[0] !=  ""){
        $bgBlock.find("div.jqx-validator-error-info").remove();
        $bgBlock.children(".bh-form-placeholder").show();
        $bgBox.css("border","");
        $bgBlock.removeClass("jqx-validator-error-container");
    }
    $('#uploadBgImg').attr("src",getObjectURL(this.files[0]));
});

//添加
$btnBox.on("click","#btn-add",function() {
    if ($form.emapValidate("validate") && ($("#imgUrl").val() != "")) {
        var ajaxForm = $form.emapForm("getValue"),//获取表单数据
            $myForm = $("#myForm");//获取原始网页地址
        ajaxForm.imgUrl = getFileName($("#imgUrl").val());//获取上传的图片的名称
        ajaxForm.backgroundImgUrl = getFileName($("#backgroundImgUrl").val());//获取上传的图片的名称
        wisAjax(rootPath + "/v1/medias", ajaxForm, function (data) {
            if (data.status == "success") {
                $myForm.attr('action', rootPath + "/v1/medias/imgs/" + data.id);
                $myForm.submit();
            } else {
                alert("添加失败!\n错误原因:" + data.errorMsg);
            }
        });
    }else{
        if($("#imgUrl").val() == ""){
            $imgBlock.addClass("jqx-validator-error-container");
            $imgBox.css("border","2px solid #e24034");
            $imgBlock.children(".bh-form-placeholder").hide();
            if($imgBlock.children(".jqx-validator-error-info").length == 0){
                $imgBlock.append('<div class="bh-form-group jqx-validator-error-info bh-pv-4 bh-col-md-6" style="display: block;">图片不能为空</div>');
            }
        }

    }
});

$btnBox.on("click","#btn-cancel",function(){
    window.location.href = "mediaManage.html";
});

//当来源类型选择"微信公众号"时,名称   描述  头像  不需要填写
$('#formContainer [data-name=sourceType] input[type=radio]').on('change', function(){
    var val = $(this).closest('[xtype=radiolist]').find('input[type=radio]:checked').val();
    if (val == '微信公众号') {//选择微信公众号时,置灰并清空媒体号名称  描述  头像上传
        //$form.emapForm('showItem', 'wxId');
        //$form.emapForm('disableItem', 'mediaName');
        //$form.emapForm('clear', ['mediaName']);
        //$form.emapForm('disableItem', 'mediaDescription');
        //$form.emapForm('clear', ['mediaDescription']);
        //$form.emapForm('disableItem', 'headPhoto');
        //$form.emapForm('clear', ['headPhoto']);
        //$form.emapForm('enableItem', 'wxId');
        //$("#btn-add").html("验证");
    }else if(val == '视频网站'){//选择视频网站时,置灰并清空爬虫模板,启用其他选项
        //$form.emapForm('hideItem', 'wxId');
        //$form.emapForm('enableItem', 'mediaName');
        //$form.emapForm('enableItem', 'mediaDescription');
        //$form.emapForm('enableItem', 'headPhoto');
        //$form.emapForm('disableItem','wxId');
        //$form.emapForm('clear',['wxId']);
        $form.emapForm('disableItem', 'crawlerModel');
        $form.emapForm('clear', ['crawlerModel']);
    }else{//选择网站时,启用所有选项
        //$form.emapForm('hideItem', 'wxId');
        //$form.emapForm('enableItem', 'mediaName');
        //$form.emapForm('enableItem', 'mediaDescription');
        //$form.emapForm('enableItem', 'headPhoto');
        $form.emapForm('enableItem', 'crawlerModel');
        //$form.emapForm('disableItem','wxId');
        //$form.emapForm('clear',['wxId']);
    }
});


