/**
 * Created by zhouchen on 16/5/18.
 */
var formDataModel = '';
var $form = $("#formContainer");
var $btnBox = $(".btn-box");
var checkInfo = {};
//获取表单模型
wisAjax2(interfaceDef.formModel, "", function (data) {
    formDataModel = data.models[20].controls;
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

$('[data-field=schoolLimit]').
    after('<table id="schoolLimitT" hidden border="1">'+
            '<thead>'+
            '<tr>'+
            '<td>学校编码</td>'+
            '<td>是否默认展示</td>'+
            '<td>是否默认发布</td>'+
            '</tr>'+
            '</thead> ' +
           ' <tbody id="rows">'+
            '</tbody>'+
            '</table> ');
var $circleIdBlock = $('#formContainer [data-field=circleId]'),
    $circleIdBox = $('#formContainer [data-name=circleId]');

//校验虚拟组编号是否唯一
$circleIdBox.blur(function () {
    var circleId = $(this).val();
    if (circleId != "") {
        wisAjax(rootPath+interfaceDef.circleManage.validCircleId,
            {
                "circleId": $(this).val()
            },
            function (data) {
                if (data.status == "success") {
                    $circleIdBlock.find("div.jqx-validator-error-info").remove();
                    $circleIdBlock.children(".bh-form-placeholder").html('<font color="green">该圈子号可用</font>');
                    $circleIdBlock.children(".bh-form-placeholder").show();
                    $circleIdBox.css("border", "");
                    $circleIdBlock.removeClass("jqx-validator-error-container");
                    $("#btn-add").removeClass("circleIdExist");
                } else if (data.status == "failed") {
                    $circleIdBlock.addClass("jqx-validator-error-container");
                    $circleIdBox.css("border", "2px solid #e24034");
                    $circleIdBlock.children(".bh-form-placeholder").hide();
                    if ($circleIdBlock.children(".jqx-validator-error-info").length == 0) {
                        $circleIdBlock.append('<div class="bh-form-circle jqx-validator-error-info bh-pv-4 bh-col-md-6" style="display: block;">该圈子编号已存在!请重新输入</div>');
                    }
                    $("#btn-add").addClass("circleIdExist");
                }
            });
    }
});

var $imgBlock = $('#formContainer [data-field=logo]');
var $imgBox = $('#formContainer [data-name=logo]');
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
    $('#uploadBgImg').attr("src", getObjectURL(this.files[0]));

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
        })

});

var collectLimitInfo = function(){
    var schoolLimits = new Array();
    $('#schoolLimitT>#rows>tr').each(function(index,row){
        var schoolLimit = {};
        schoolLimit.schoolId = $(row).attr("id");
        schoolLimit.schoolName = $(row).find("#schoolName").text();
        schoolLimit.isDefaultDisPlay =$(row).find("#isDefaultDisPlay").is(':checked') ? 1:0;
        schoolLimit.isDefaultSave = $(row).find("#isDefaultSave").is(':checked') ? 1:0;
        schoolLimits.push(schoolLimit)
    });
    return schoolLimits;
}

//点击添加提交表单
$btnBox.on("click", "#btn-add", function () {
    if ($form.emapValidate("validate") && !($(this).hasClass("circleIdExist"))) {
        var ajaxForm = $form.emapForm("getValue");//获取表单数据
        ajaxForm.logo = ($("#uploadImg").attr("src") == "../img/upload.jpg") ? "" : $("#uploadImg").attr("src");
        ajaxForm.backgroundImg = ($("#uploadBgImg").attr("src") == "../img/upload.jpg") ? "" : $("#uploadBgImg").attr("src");
        ajaxForm.limits = JSON.stringify(collectLimitInfo());
        wisAjax(rootPath+interfaceDef.circleManage.addCircle, ajaxForm, function (data) {
            if (data.status == "success") {
                BH_UTILS.bhDialogSuccess({
                    title: '操作成功!',
                    content: '添加成功!',
                    callback: function () {
                        // window.location.href = '../html/circleManage.html';
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
    window.location.href = "circleManage.html";
});


//当权限类型选择"无"时,学校限制  隐藏
$('#formContainer [data-name=permissionsLimit] input[type=radio]').on('change', function(){
    var val = $(this).closest('[xtype=radiolist]').find('input[type=radio]:checked').val();
    if (val == '0') {
        $form.emapForm('hideItem', 'schoolLimit');//隐藏学校限制项
        $form.emapForm('clear', ['schoolLimit']);//清空学校限制项
        $("#schoolLimitT").hide();
    } else {
        $form.emapForm('showItem', 'schoolLimit');//显示学校限制项
        $('#schoolLimitT').show()
    }
});

$('#formContainer [data-name=schoolLimit]').on('change', function(){
    var ajaxForm = $form.emapForm("getValue");//获取表单数据
    console.log(ajaxForm)
    var schoolIds = ajaxForm.schoolLimit.split(",");
    var schoolNames = ajaxForm.schoolLimit_DISPLAY.split(",");
    var schoolLimit = {};
    $('#schoolLimitT tbody').empty();
    if(schoolIds != '') {
        $(schoolIds).each(function (index, value) {
            schoolLimit.schoolId = value;
            schoolLimit.schoolName = schoolNames[index];
            schoolLimit.isDefaultDisPlay = checkInfo[value]  && checkInfo[value]['isDefaultDisPlay'] == 1 ? 1: 0;
            schoolLimit.isDefaultSave = checkInfo[value]  && checkInfo[value]['isDefaultSave'] == 1? 1: 0;
            $("#schoolLimitR").tmpl(schoolLimit).appendTo('#schoolLimitT #rows');
            if(!checkInfo[value]){
                checkInfo[value] = {};
            }
            bindCheck();
        });
    }
});

var bindCheck = function(){
    $('#schoolLimitT>#rows').find('[id=isDefaultDisPlay]').on('change', function(){
        var collegeId = $(this).closest('tr').attr('id');
        if($(this).is(':checked')){
            checkInfo[collegeId]['isDefaultDisPlay'] = 1
        }else{
            checkInfo[collegeId]['isDefaultDisPlay'] = 0
        }
    });
    $('#schoolLimitT>#rows').find('[id=isDefaultSave]').on('change', function(){
        var collegeId = $(this).closest('tr').attr('id');
        if($(this).is(':checked')){
            checkInfo[collegeId]['isDefaultSave'] = 1
        }else{
            checkInfo[collegeId]['isDefaultSave'] = 0
        }
    });
}