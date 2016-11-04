/**
 * Created by zhouchen on 16/3/17.
 */
var formDataModel;
var $form = $("#formContainer");
var $btnBox = $(".btn-box");

//获取表单模型
wisAjax2(interfaceDef.formModel, "",function(data){
        formDataModel = data.models[4].controls;
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

var $imgBlock = $('#formContainer [data-field=posterPhoto]');
var $imgBox = $('#formContainer [data-name=posterPhoto]');

//给图片上传字段添加一个红星以标识
$imgBlock.find("label.bh-form-h-label").addClass("requireLabel");
eventBind();

//获取表单数据
var poster;
wisAjax2(rootPath+"/v1/posters/"+getQueryString("posterId"),//"../data/onePoster.json",
    {
        "posterId": getQueryString("posterId")
    },function(data){
        poster = data.datas;
        //向表单中填充数据
        $form.emapForm("setValue", poster);
    },false);


var photo = (poster.posterPhoto == "获取失败") ? "../img/upload.jpg" : (rootPath + poster.posterPhoto);
//海报图初始化
$imgBox.append(
    '<div class="imgUrlBox">' +
        '<img id="uploadImg" src="'+ photo +'"/>' +
        '<input type="file" name="posterPhoto" id="posterPhoto" class="imgUrl" title="'+ rootPath + poster.posterPhoto +'">' +
    '</div>'
);

//海报图实时预览
$('#posterPhoto').change(function(){
    if(this.files[0] !=  ""){
        $imgBlock.find("div.jqx-validator-error-info").remove();
        $imgBlock.children(".bh-form-placeholder").show();
        $imgBox.css("border","");
        $imgBlock.removeClass("jqx-validator-error-container");
    }
    $('#uploadImg').attr("src",getObjectURL(this.files[0]));
});

function eventBind(){
    //修改
    $btnBox.on("click","#btn-modify",function(){

        if($form.emapValidate("validate") && ($("#posterPhoto").val() != "" || $("#uploadImg").attr("src") != "")){
            var ajaxForm = $form.emapForm("getValue"),//获取表单数据
                $myForm = $("#myForm"),//获取原始网页地址
                posterPhoto = getFileName($("#posterPhoto").val());
            ajaxForm.posterPhoto = posterPhoto;//获取上传的小图片的名称
            wisAjax(rootPath + "/v1/posters/"+poster.posterId, ajaxForm, function (data) {//
                if (data.status == "success") {
                    $myForm.attr('action', rootPath + "/v1/posters/img/" + data.id);
                    $myForm.submit();
                } else {
                    alert("修改失败!\n错误原因:" + data.errorMsg);
                }
            });
        }else{
            if($("#posterPhoto").val() == "" && $("#uploadImg").attr("src") == ""){
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
        window.location.href = "posterManage.html";
    });

}

