/**
 * Created by zhouchen on 16/5/18.
 */

var formDataModel = '';
var $form = $("#formContainer");
var $btnBox = $(".btn-box");

//获取表单模型
wisAjax2(interfaceDef.formModel, "",function(data){
    formDataModel = data.models[10].controls;
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
eventBind();
//获取表单数据
var group = '';
wisAjax2(rootPath+interfaceDef.groupManage.oneGroup+getQueryString("groupId"),"",
    function(data){
        group = data.datas;
        //向表单中填充数据
        $form.emapForm("setValue", group);
        $('#formContainer [data-name=groupType] input[type=radio]').trigger('change');
        $('#formContainer [data-name=permissionsLimit] input[type=radio]').trigger('change');
        $('#formContainer [data-name=strutsType] input[type=radio]').trigger('change');

    },false);

var $imgBlock = $('#formContainer [data-field=logo]');
var $imgBox = $('#formContainer [data-name=logo]');
var $bgBlock = $('#formContainer [data-field=backgroundImg]');
var $bgBox = $('#formContainer [data-name=backgroundImg]');
//给图片上传字段添加一个红星以标识
// $imgBlock.find("label.bh-form-h-label").addClass("requireLabel");
//添加上传
var img1 = (group.logo == '') ? '../img/upload.jpg' : group.logo;
$imgBox.append(
    '<div class="imgUrlBox">' +
        '<img id="uploadImg" src="'+ img1 +'"/>' +
        '<form id="form"><input type="file" name="imgUrl" id="imgUrl" class="imgUrl"></form>' +
    '</div>'
);
var img2 = (group.backgroundImg == '') ? '../img/upload.jpg' : group.backgroundImg;
$bgBox.append(
    '<div class="imgUrlBox">' +
        '<img id="uploadBgImg" src="'+ img2 +'"/>' +
        '<form id="bgForm"><input type="file" name="backgroundImg" id="backgroundImg" class="imgUrl"></form>' +
    '</div>'
);
//上传实时预览
$('#imgUrl').change(function(){
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
        });
});

function eventBind() {
    //点击保存提交表单
    $btnBox.on("click","#btn-edit",function(){
        if ($form.emapValidate("validate")) {
            var ajaxForm = $form.emapForm("getValue");//获取表单数据
            ajaxForm.tagLimit = (ajaxForm.strutsType == '1') ? '' : ajaxForm.tagLimit;
            ajaxForm.logo = ($("#uploadImg").attr("src") == "../img/upload.jpg") ? "" : $("#uploadImg").attr("src");
            ajaxForm.backgroundImg = ($("#uploadBgImg").attr("src") == "../img/upload.jpg") ? "" : $("#uploadBgImg").attr("src");
            wisAjax(rootPath+interfaceDef.groupManage.editGroup, ajaxForm, function (data) {
                if (data.status == "success") {
                    BH_UTILS.bhDialogSuccess({
                        title:'操作成功!',
                        content:'修改成功!',
                        callback:function(){
                            // window.location.href = '../html/groupManage.html';
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
        window.location.href = "../html/groupManage.html";
    });

    //当组类型选择"广告"时,关联广告位  隐藏
    $('#formContainer [data-name=groupType] input[type=radio]').on('change', function(){
        var val = $(this).closest('[xtype=radiolist]').find('input[type=radio]:checked').val();
        if (val == '4') {
            $form.emapForm('hideItem', 'posterGroupId');//隐藏关联广告位
            $form.emapForm('clear', ['posterGroupId']);//清空关联广告位
        } else {
            $form.emapForm('showItem', 'posterGroupId');//显示关联广告位
        }
    });

    //当权限类型选择"无"时,学校限制  隐藏
    $('#formContainer [data-name=permissionsLimit] input[type=radio]').on('change', function(){
        var val = $(this).closest('[xtype=radiolist]').find('input[type=radio]:checked').val();
        if (val != '1') {
            $form.emapForm('hideItem', 'schoolLimit');//隐藏学校限制项
            $form.emapForm('clear', ['schoolLimit']);//清空学校限制项
        } else {
            $form.emapForm('showItem', 'schoolLimit');//显示学校限制项
        }
    });

    //当构造关系选择"内容关系"时,标签限制  隐藏
    $('#formContainer [data-name=strutsType] input[type=radio]').on('change', function(){
        var val = $(this).closest('[xtype=radiolist]').find('input[type=radio]:checked').val();
        if (val == '0') {
            $form.emapForm('showItem', 'tagLimit');
        } else{
            $form.emapForm('hideItem', 'tagLimit');
            $form.emapForm('clear', ['tagLimit']);
        }
    });

}

