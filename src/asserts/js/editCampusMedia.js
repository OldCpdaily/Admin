/**
 * Created by zhouchen on 16/5/18.
 */

var formDataModel = '';
var $form = $("#formContainer");
var $btnBox = $(".btn-box");

//获取表单模型
wisAjax2(interfaceDef.formModel, "",function(data){
    formDataModel = data.models[12].controls;
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
var campusMedia = '';
wisAjax2(rootPath+interfaceDef.campusMediaManage.oneCampusMedia+getQueryString("campusMediaId"),"",
    function(data){
        campusMedia = data.datas;
        //向表单中填充数据
        $form.emapForm("setValue", campusMedia);
    },false);

var $imgBlock = $('#formContainer [data-field=campusMediaLogo]');
var $imgBox = $('#formContainer [data-name=campusMediaLogo]');
var $bgBlock = $('#formContainer [data-field=backgroundImg]');
var $bgBox = $('#formContainer [data-name=backgroundImg]');
//给图片上传字段添加一个红星以标识
// $imgBlock.find("label.bh-form-h-label").addClass("requireLabel");
//添加上传
var img1 = (campusMedia.campusMediaLogo == '') ? '../img/upload.jpg' : campusMedia.campusMediaLogo;
$imgBox.append(
    '<div class="imgUrlBox">' +
        '<img id="uploadImg" src="'+ img1 +'"/>' +
        '<form id="imgUrlForm"><input type="file" name="imgUrl" id="imgUrl" class="imgUrl" title=""></form>' +
    '</div>'
);

var img2 = (campusMedia.backgroundImg == '') ? '../img/upload.jpg' : campusMedia.backgroundImg;
$bgBox.append(
    '<div class="imgUrlBox">' +
        '<img id="uploadBgImg" src="'+ img2 +'"/>' +
        '<form id="backgroundImgForm"><input type="file" name="backgroundImg" id="backgroundImg" class="imgUrl" title=""></form>' +
    '</div>'
);
//上传实时预览
$('#imgUrl').change(function(){
    if(this.files[0] !=  ""){
        $imgBlock.find("div.jqx-validator-error-info").remove();
        $imgBlock.children(".bh-form-placeholder").show();
        $imgBox.css("border","");
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
$('#backgroundImg').change(function(){
    if(this.files[0] !=  ""){
        $bgBlock.find("div.jqx-validator-error-info").remove();
        $bgBlock.children(".bh-form-placeholder").show();
        $bgBox.css("border","");
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


//点击保存提交表单
$btnBox.on("click","#btn-edit",function(){
    if ($form.emapValidate("validate")) {
        var ajaxForm = $form.emapForm("getValue");//获取表单数据
        ajaxForm.campusMediaLogo = ($("#uploadImg").attr("src") == "../img/upload.jpg") ? "" : $("#uploadImg").attr("src");
        ajaxForm.backgroundImg = ($("#uploadBgImg").attr("src") == "../img/upload.jpg") ? "" : $("#uploadBgImg").attr("src");
        wisAjax(rootPath+interfaceDef.campusMediaManage.editCampusMedia, ajaxForm, function (data) {
            if (data.status == "success") {
                BH_UTILS.bhDialogSuccess({
                    title:'操作成功!',
                    content:'修改成功!',
                    callback:function(){
                        // window.location.href = '../html/campusMediaManage.html';
                        window.close();
                    }
                });
            } else {
                $.bhDialog({
                    title:'操作失败',
                    content:'修改失败!错误原因:'+data.errorMsg,
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
    window.location.href = "../html/campusMediaManage.html";
});


