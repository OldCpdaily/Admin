/**
 * Created by zhouchen on 16/5/18.
 */

var formDataModel = '';
var $form = $("#formContainer");
var $btnBox = $(".btn-box");
var initFlag = true;

var checkInfo = {};
//获取表单模型
wisAjax2(interfaceDef.formModel, "",function(data){
    formDataModel = data.models[21].controls;
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

$('[data-field=schoolLimit]').
    after('<table id="schoolLimitT"  hidden >'+
    '<thead>'+
    '<tr>'+
    '<th style="min-width: 200px;">学校编码</th>'+
    '<th style="min-width: 100px;">是否默认展示</th>'+
    '<th style="min-width: 100px;">是否默认发布</th>'+
    '</tr>'+
    '</thead> ' +
    ' <tbody id="rows">'+
    '</tbody>'+
    '</table> ');
var initLimits = function(permissionsLimit,limitsString){
    if(permissionsLimit == 1 && limitsString && limitsString!=''){
        var limits =   JSON.parse(limitsString);
        console.log(limits);
        $('#schoolLimitT tbody').empty();
        $(limits).each(function(index,value){
            checkInfo[value.schoolId] = {};
            checkInfo[value.schoolId]['isDefaultDisPlay'] = value.isDefaultDisPlay;
            checkInfo[value.schoolId]['isDefaultSave'] = value.isDefaultSave;
            $("#schoolLimitR").tmpl(value).appendTo('#schoolLimitT #rows');
        });
    }
    bindCheck();
}
//获取表单数据
var circle = '';
wisAjax2(rootPath+interfaceDef.circleManage.oneCircle+getQueryString("circleId"),"",
    function(data){
        circle = data.datas;
        //向表单中填充数据
        $form.emapForm("setValue", circle);
        $('#formContainer [data-name=permissionsLimit] input[type=radio]').trigger('change');

    },false);



var $imgBlock = $('#formContainer [data-field=logo]');
var $imgBox = $('#formContainer [data-name=logo]');
var $bgBox = $('#formContainer [data-name=backgroundImg]');
//给图片上传字段添加一个红星以标识
// $imgBlock.find("label.bh-form-h-label").addClass("requireLabel");
//添加上传
var img1 = (circle.logo == '') ? '../img/upload.jpg' : circle.logo;
$imgBox.append(
    '<div class="imgUrlBox">' +
    '<img id="uploadImg" src="'+ img1 +'"/>' +
    '<form id="form"><input type="file" name="imgUrl" id="imgUrl" class="imgUrl"></form>' +
    '</div>'
);
var img2 = (circle.backgroundImg == '') ? '../img/upload.jpg' : circle.backgroundImg;
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


function eventBind() {
    //点击保存提交表单
    $btnBox.on("click","#btn-edit",function(){
        if ($form.emapValidate("validate")) {
            var ajaxForm = $form.emapForm("getValue");//获取表单数据
            ajaxForm.logo = ($("#uploadImg").attr("src") == "../img/upload.jpg") ? "" : $("#uploadImg").attr("src");
            ajaxForm.backgroundImg = ($("#uploadBgImg").attr("src") == "../img/upload.jpg") ? "" : $("#uploadBgImg").attr("src");
            ajaxForm.limits = JSON.stringify(collectLimitInfo());
            wisAjax(rootPath+interfaceDef.circleManage.editCircle, ajaxForm, function (data) {
                if (data.status == "success") {
                    BH_UTILS.bhDialogSuccess({
                        title:'操作成功!',
                        content:'修改成功!',
                        callback:function(){
                            // window.location.href = '../html/circleManage.html';
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
        window.location.href = "../html/circleManage.html";
    });

    //当权限类型选择"无"时,学校限制  隐藏
    $('#formContainer [data-name=permissionsLimit] input[type=radio]').on('change', function(){
        var val = $(this).closest('[xtype=radiolist]').find('input[type=radio]:checked').val();
        if (val != '1') {
            $form.emapForm('hideItem', 'schoolLimit');//隐藏学校限制项
            $form.emapForm('clear', ['schoolLimit']);//清空学校限制项
            $("#schoolLimitT").hide();
        } else {
            $form.emapForm('showItem', 'schoolLimit');//显示学校限制项
            $('#schoolLimitT').show()
        }
    });

    $('#formContainer [data-name=schoolLimit]').on('change', function(){
        if(initFlag){
            if(circle.schoolLimit.split(",").length == $form.emapForm("getValue").schoolLimit.split(",").length){
                initLimits(circle.permissionsLimit,circle.limits);
                initFlag = false;
            }
            return;
        }
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
}


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