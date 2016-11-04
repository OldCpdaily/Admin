/**
 * Created by zhouchen on 16/3/17.
 */
var formDataModel;
var $form = $("#formContainer");
var $btnBox = $(".btn-box");

//获取表单模型
wisAjax2(interfaceDef.formModel, "",function(data){
        formDataModel = data.models[2].controls;
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

var $imgBlockSmall = $('#formContainer [data-field=imgUrlSmall]'),
    $imgBoxSmall = $('#formContainer [data-name=imgUrlSmall]'),
    $imgBlockBig = $('#formContainer [data-field=imgUrlBig]'),
    $imgBoxBig = $('#formContainer [data-name=imgUrlBig]'),
    $categoryNameBlock = $('#formContainer [data-field=categoryName]'),
    $categoryNameBox = $('#formContainer [data-name=categoryName]');

//给图片上传字段添加一个红星以标识
$imgBlockSmall.find("label.bh-form-h-label").addClass("requireLabel");
$imgBlockBig.find("label.bh-form-h-label").addClass("requireLabel");
eventBind();

//获取表单数据
var categoryInfo;
wisAjax2(rootPath+"/v1/categories/"+getQueryString("categoryId"),//"../data/oneCategory.json",
    {
        "categoryId": getQueryString("categoryId")
    },function(data){
        categoryInfo = data.datas;
        //向表单中填充数据
        $form.emapForm("setValue", categoryInfo);
        $('#formContainer [data-name=categoryDisplayType] input[type=radio]').trigger('change');
    },false);



//小图初始化
$imgBoxSmall.append(
    '<div class="imgUrlBox">' +
        '<img id="uploadImgSmall" src="'+ rootPath + categoryInfo.imgUrlSmall +'"/>' +
        '<input type="file" name="imgUrlSmall" id="imgUrlSmall" class="imgUrl" title="'+ rootPath + categoryInfo.imgUrlSmall +'">' +
    '</div>'
);

//大图初始化
$imgBoxBig.append(
    '<div class="imgUrlBox">' +
        '<img id="uploadImgBig" src="'+ rootPath + categoryInfo.imgUrlBig +'"/>' +
        '<input type="file" name="imgUrlBig" id="imgUrlBig" class="imgUrl" title="'+ rootPath + categoryInfo.imgUrlBig +'">' +
    '</div>'
);

//小图实时预览
$('#imgUrlSmall').change(function(){
    if(this.files[0] !=  ""){
        $imgBlockSmall.find("div.jqx-validator-error-info").remove();
        $imgBlockSmall.children(".bh-form-placeholder").show();
        $imgBoxSmall.css("border","");
        $imgBlockSmall.removeClass("jqx-validator-error-container");
    }
    $('#uploadImgSmall').attr("src",getObjectURL(this.files[0]));
});

//大图实时预览
$('#imgUrlBig').change(function(){
    if(this.files[0] !=  ""){
        $imgBlockBig.find("div.jqx-validator-error-info").remove();
        $imgBlockBig.children(".bh-form-placeholder").show();
        $imgBoxBig.css("border","");
        $imgBlockBig.removeClass("jqx-validator-error-container");
    }
    $('#uploadImgBig').attr("src",getObjectURL(this.files[0]));
});

//校验分类名称是否唯一
$categoryNameBox.blur(function(){
    console.log($(this).val());
    wisAjax2(rootPath + "/v1/feedTagValid",
        {
            "categoryName":$(this).val(),
            "id": getQueryString("categoryId")
        },function(data){
            if(data.status == "success"){
                $categoryNameBlock.find("div.jqx-validator-error-info").remove();
                //$categoryNameBlock.children(".bh-form-placeholder").html('<font color="green">该分类名称可用</font>');
                $categoryNameBlock.children(".bh-form-placeholder").show();
                $categoryNameBox.css("border","");
                $categoryNameBlock.removeClass("jqx-validator-error-container");
                $("#btn-modify").removeClass("categoryNameExist");
            }else if(data.status == "fail"){
                $categoryNameBlock.addClass("jqx-validator-error-container");
                $categoryNameBox.css("border","2px solid #e24034");
                $categoryNameBlock.children(".bh-form-placeholder").hide();
                if($categoryNameBlock.children(".jqx-validator-error-info").length == 0){
                    $categoryNameBlock.append('<div class="bh-form-group jqx-validator-error-info bh-pv-4 bh-col-md-6" style="display: block;">该分类名已存在!请重新输入</div>');
                }
                $("#btn-modify").addClass("categoryNameExist");
            }
        })
});

function eventBind(){
    //修改
    $btnBox.on("click","#btn-modify",function(){

        if($form.emapValidate("validate") && !($(this).hasClass("categoryNameExist")) && ($("#imgUrlSmall").val() != "" || $("#uploadImgSmall").attr("src") != "") && ($("#imgUrlBig").val() != "" || $("#uploadImgBig").attr("src") != "")){
            var ajaxForm = $form.emapForm("getValue"),//获取表单数据
                $myForm = $("#myForm"),//获取原始网页地址
                small = getFileName($("#imgUrlSmall").val()),
                big = getFileName($("#imgUrlBig").val());
            ajaxForm.imgUrlSmall = small;//获取上传的小图片的名称
            ajaxForm.imgUrlBig = big;//获取上传的大图片的名称
            wisAjax(rootPath + "/v1/categories/"+categoryInfo.categoryId, ajaxForm, function (data) {//
                if (data.status == "success") {
                    $myForm.attr('action', rootPath + "/v1/feedtags/img/" + data.categoryId);
                    $myForm.submit();
                } else {
                    alert("修改失败!\n错误原因:" + data.errorMsg);
                }
            });
        }else{
            if($("#imgUrlSmall").val() == "" && $("#uploadImgSmall").attr("src") == ""){
                $imgBlockSmall.addClass("jqx-validator-error-container");
                $imgBoxSmall.css("border","2px solid #e24034");
                $imgBlockSmall.children(".bh-form-placeholder").hide();
                if($imgBlockSmall.children(".jqx-validator-error-info").length == 0){
                    $imgBlockSmall.append('<div class="bh-form-group jqx-validator-error-info bh-pv-4 bh-col-md-6" style="display: block;">图片不能为空</div>');
                }
            }
            if($("#imgUrlBig").val() == "" && $("#uploadImgBig").attr("src") == ""){
                $imgBlockBig.addClass("jqx-validator-error-container");
                $imgBoxBig.css("border","2px solid #e24034");
                $imgBlockBig.children(".bh-form-placeholder").hide();
                if($imgBlockBig.children(".jqx-validator-error-info").length == 0){
                    $imgBlockBig.append('<div class="bh-form-group jqx-validator-error-info bh-pv-4 bh-col-md-6" style="display: block;">图片不能为空</div>');
                }
            }
        }
    });

    $btnBox.on("click","#btn-cancel",function(){
        window.location.href = "categoryManage.html";
    });

    //当封面类型选择"图片"时,需要选择"图片格式"
    $('#formContainer [data-name=categoryDisplayType] input[type=radio]').on('change', function(){
        var val = $(this).closest('[xtype=radiolist]').find('input[type=radio]:checked').val();
        if (val == '图集') {//选择图片时,展现图片格式
            $form.emapForm('showItem', 'relation');
        }else{//选择的不是图片时,隐藏图片格式
            $form.emapForm('clear', 'relation');
            $form.emapForm('hideItem', 'relation');
        }
    });
}

