/**
 * Created by zhouchen on 16/3/17.
 */
var formDataModel,
    $form = $("#formContainer"),
    $btnBox = $(".btn-box");

//获取表单模型
wisAjax2(interfaceDef.formModel, "",function(data){
    formDataModel = data.models[3].controls;
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

//给图片上传字段添加一个红星以标识
$imgBlock.find("label.bh-form-h-label").addClass("requireLabel");

$imgBox.append(
    '<div class="imgUrlBox">' +
        '<img id="uploadImg" src="../img/upload.jpg"/>' +
        '<input type="file" name="imgUrl" id="imgUrl" class="imgUrl">' +
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

//添加
$btnBox.on("click","#btn-add",function(){
    var ajaxForm = $form.emapForm("getValue"),//获取表单数据
        $myForm = $("#myForm");//获取原始网页地址
    if($form.emapValidate("validate") && ($("#imgUrl").val() != "") ){
        ajaxForm.imgUrl = getFileName($("#imgUrl").val());//获取上传的图片的名称
        wisAjax(rootPath + "/v1/feeds/addition", ajaxForm, function (data) {
            if (data.status == "success") {
                $myForm.attr('action', rootPath + "/v1/feeds/video/img/" + data.id);
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
    window.location.href = "contentManage.html";
});

//当展现类型选择"直播"时,直播开始时间  直播状态  直播时长可输入,否则不可输入
$('#formContainer [data-name=displayTypeId] input[type=radio]').on('change', function(){
    var val = $(this).closest('[xtype=radiolist]').find('input[type=radio]:checked').val();
    if (val != '直播') {
        $form.emapForm('hideItem', 'liveState');//隐藏直播状态项
        $form.emapForm('clear', ['liveState']);//清空直播状态项
        $form.emapForm('hideItem', 'liveStartTime');//隐藏直播开始时间项
        $form.emapForm('clear', ['liveStartTime']);//清空直播开始时间项
        $form.emapForm('hideItem', 'liveTime');//隐藏直播时长项
        $form.emapForm('clear', ['liveTime']);//清空直播时长项
    } else {
        $form.emapForm('showItem', 'liveState');
        $form.emapForm('showItem', 'liveStartTime');
        $form.emapForm('showItem','liveTime');

    }

});
//当直播状态选择"回放"时,视频地址  视频类型可输入,否则不可输入
$('#formContainer [data-name=liveState] input[type=radio]').on('change', function(){
    var val = $(this).closest('[xtype=radiolist]').find('input[type=radio]:checked').val();
    if (val != '2') {
        $form.emapForm('hideItem', 'videoAddress');//隐藏视频地址项
        $form.emapForm('clear', ['videoAddress']);//清空视频地址项
        $form.emapForm('hideItem', 'videoSourceId');//隐藏视频地址项
        $form.emapForm('clear', ['videoSourceId']);//清空视频地址项
    } else {
        $form.emapForm('showItem', 'videoAddress');
        $form.emapForm('showItem', 'videoSourceId');
    }
});