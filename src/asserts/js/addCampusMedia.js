/**
 * Created by zhouchen on 16/5/18.
 */
var formDataModel = '';
var $form = $("#formContainer");
var $btnBox = $(".btn-box");

//获取表单模型
wisAjax2(interfaceDef.formModel, "", function (data) {
    formDataModel = data.models[11].controls;
    $(formDataModel).each(function () {
        this.get = function (field) {
            return this[field];
        }
    });
}, false);

//渲染表单
$form.emapForm({
    model: "h",
    data: formDataModel,
    readonly: false
});

var $campusMediaIdBlock = $('#formContainer [data-field=campusMediaId]'),
    $campusMediaIdBox = $('#formContainer [data-name=campusMediaId]');

//校验校园号编号是否唯一
$campusMediaIdBox.blur(function () {
    var campusMediaId = $(this).val();
    if (campusMediaId != "") {
        wisAjax(rootPath+interfaceDef.campusMediaManage.validCampusMediaId,
            {
                "campusMediaId": $(this).val()
            },
            function (data) {
                if (data.status == "success") {
                    $campusMediaIdBlock.find("div.jqx-validator-error-info").remove();
                    $campusMediaIdBlock.children(".bh-form-placeholder").html('<font color="green">该校园号编号可用</font>');
                    $campusMediaIdBlock.children(".bh-form-placeholder").show();
                    $campusMediaIdBox.css("border", "");
                    $campusMediaIdBlock.removeClass("jqx-validator-error-container");
                    $("#btn-add").removeClass("tagIdExist");
                } else if (data.status == "fail") {
                    $campusMediaIdBlock.addClass("jqx-validator-error-container");
                    $campusMediaIdBox.css("border", "2px solid #e24034");
                    $campusMediaIdBlock.children(".bh-form-placeholder").hide();
                    if ($campusMediaIdBlock.children(".jqx-validator-error-info").length == 0) {
                        $campusMediaIdBlock.append('<div class="bh-form-group jqx-validator-error-info bh-pv-4 bh-col-md-6" style="display: block;">该虚拟组编号已存在!请重新输入</div>');
                    }
                    $("#btn-add").addClass("groupIdExist");
                }
            });
    }
});

var $imgBlock = $('#formContainer [data-field=campusMediaLogo]');
var $imgBox = $('#formContainer [data-name=campusMediaLogo]');
var $bgBlock = $('#formContainer [data-field=backgroundImg]');
var $bgBox = $('#formContainer [data-name=backgroundImg]');
//给图片上传字段添加一个红星以标识
// $imgBlock.find("label.bh-form-h-label").addClass("requireLabel");
//添加上传
$imgBox.append(
    '<div class="imgUrlBox">' +
        '<img id="uploadImg" src="../img/upload.jpg"/>' +
        '<form id="imgUrlForm"><input type="file" name="imgUrl" id="imgUrl" class="imgUrl"></form>' +
    '</div>'
);
$bgBox.append(
    '<div class="imgUrlBox">' +
        '<img id="uploadBgImg" src="../img/upload.jpg"/>' +
        '<form id="backgroundImgForm"><input type="file" name="backgroundImg" id="backgroundImg" class="imgUrl"></form>' +
    '</div>'
);
//上传实时预览 && 上传
$('#imgUrl').change(function () {

    if (this.files[0] != "") {
        $imgBlock.find("div.jqx-validator-error-info").remove();
        $imgBlock.children(".bh-form-placeholder").show();
        $imgBox.css("border", "");
        $imgBlock.removeClass("jqx-validator-error-container");
    }
    // 上传
    var file = new FormData($(this).closest('form')[0]);
    $.ajax({
            type: 'post',
            url: rootPath+interfaceDef.uploadImg,
            contentType: false, //必须
            processData: false, //必
            data: file
        })
        .done(function (res) {
            // console.log(res);
            if(res.status == "success"){
                $('#uploadImg').attr("src", rootPath+res.imgUrl);//上传的图片实时预览
            }else{
                $.bhDialog({
                    title:'操作失败',
                    content:'图片上传失败!错误原因:'+res.errorMsg,
                    width:464,
                    //height:400,
                    className:'bh-dialog-text',
                    buttons:[{text:'好的',className:'bh-btn-primary'}]
                });
            }
        })
        .fail(function (e) {
            console.log(e)
        });
});

$('#backgroundImg').change(function () {
    if (this.files[0] != "") {
        $bgBlock.find("div.jqx-validator-error-info").remove();
        $bgBlock.children(".bh-form-placeholder").show();
        $bgBox.css("border", "");
        $bgBlock.removeClass("jqx-validator-error-container");
    }
    // 上传
    var file = new FormData($(this).closest('form')[0]);
    $.ajax({
            type: 'post',
            url: rootPath+interfaceDef.uploadImg,
            contentType: false, //必须
            processData: false, //必须
            data: file
        })
        .done(function (res) {
            // console.log(res);
            if(res.status == "success"){
                $('#uploadBgImg').attr("src", rootPath+res.imgUrl);//上传的图片实时预览
            }else{
                $.bhDialog({
                    title:'操作失败',
                    content:'图片上传失败!错误原因:'+res.errorMsg,
                    width:464,
                    //height:400,
                    className:'bh-dialog-text',
                    buttons:[{text:'好的',className:'bh-btn-primary'}]
                });
            }
        })
        .fail(function (e) {
            console.log(e)
        })

});

//点击添加提交表单
$btnBox.on("click", "#btn-add", function () {
    if ($form.emapValidate("validate") && !($(this).hasClass("groupIdExist"))) {
        var ajaxForm = $form.emapForm("getValue");//获取表单数据
        ajaxForm.campusMediaLogo = ($("#uploadImg").attr("src") == "../img/upload.jpg") ? "" : $("#uploadImg").attr("src");
        ajaxForm.backgroundImg = ($("#uploadBgImg").attr("src") == "../img/upload.jpg") ? "" : $("#uploadBgImg").attr("src");
        wisAjax(rootPath+interfaceDef.campusMediaManage.addCampusMedia, ajaxForm, function (data) {
            if (data.status == "success") {
                BH_UTILS.bhDialogSuccess({
                    title: '操作成功!',
                    content: '添加成功!',
                    callback: function () {
                        // window.location.href = '../html/campusMediaManage.html';
                        window.close();
                    }
                });
            } else {
                $.bhDialog({
                    title: '操作失败',
                    content: '添加失败!错误原因:' + data.errorMsg,
                    width: 464,
                    //height:400,
                    className: 'bh-dialog-text',
                    buttons: [{text: '好的', className: 'bh-btn-primary'}]
                });
            }
        });
    }

});

$btnBox.on("click", "#btn-cancel", function () {
    window.location.href = "../html/campusMediaManage.html";
});


