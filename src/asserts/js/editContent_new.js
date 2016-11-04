/**
 * Created by zhouchen on 16/3/17.
 */
var formDataModel = '';
var $form = $("#formContainer");
var $btnBox = $(".btn-box");

//获取表单模型
wisAjax2(interfaceDef.formModel, "",function(data){
        formDataModel = data.models[9].controls;
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


//事件绑定
eventBind();
// eventBind2();

//获取表单数据
var contentInfo = '';
wisAjax2(rootPath+interfaceDef.contentManage.oneContent+getQueryString("contentId"),"",
    function(data){
        contentInfo = data.datas;
        if(contentInfo.sourceType == '1'){
            contentInfo.userAccount = contentInfo.sourceAccount;
        }
        if(contentInfo.commentType != '1'){
            contentInfo.commentType = '0'
        }
        $form.emapForm("setValue", contentInfo);
        $('#formContainer [data-name=displayType] input[type=radio]').trigger('change');
        $('#formContainer [data-name=broadcastState] input[type=radio]').trigger('change');
        $('#formContainer [data-name=contentType] input[type=radio]').trigger('change');
        $('#formContainer [data-name=sourceType] input[type=radio]').trigger('change');

    },false);

var $contentDetailBlock = $('#formContainer [data-field=detailContent]');
var $contentDetailBox = $('#formContainer [data-name=detailContent]');

//给"详细内容"字段添加富文本编辑器
$contentDetailBox.append('<div id="summernote" class="summernote">'+ contentInfo.detailContent +'</div>');
$('.summernote').summernote({
    height: 500,
    lang: 'zh-CN',
    dialogsInBody: true,
    dialogsFade: true,  // Add fade effect on dialogs
    placeholder: '请从这里开始书写你的文章',
    disableDragAndDrop: true,
    shortcuts: false,
    toolbar: [
        ['styleList', ['style']],
        ['style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
//                ['font', ['strikethrough', 'superscript', 'subscript']],
        ['fontname', ['fontname','fontsize']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
//                ['height', ['height']],
        ['insert', ['link', 'picture', 'video', 'hr']],
        ['opeate', ['codeview', 'fullscreen', 'undo', 'redo']]
    ],
    popover: {
        image: [
            ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
            ['float', ['floatLeft', 'floatRight', 'floatNone']],
            ['remove', ['removeMedia']]
        ],
        link: [
            ['link', ['linkDialogShow', 'unlink']]
        ],
        air: [
            ['color', ['color']],
            ['font', ['bold', 'underline', 'clear']],
            ['para', ['ul', 'paragraph']],
//                    ['table', ['table']],
            ['insert', ['link', 'picture']]
        ]
    },
    callbacks: {
        onImageUpload: function(files, editor, $editable) {
            sendFile(files[0],editor,$editable);
        }
    }

});

function sendFile(file, editor, $editable){
    var data = new FormData();
    data.append("file", file);

    $.ajax({
            type: 'post',
            url: rootPath + interfaceDef.uploadImg,
            contentType: false, //必须
            processData: false, //必
            data: data
        })
        .done(function (res) {
            // console.log(res);
            if (res.status == "success") {
                $('#summernote').summernote('editor.insertImage', rootPath+res.imgUrl);
                $(".note-alarm").html("上传成功,请等待加载");
                setTimeout(function () {
                    $(".note-alarm").remove();
                }, 3000);
            }

        })
        .fail(function (e) {
            $(".note-alarm").html("上传失败");
            setTimeout(function () {
                $(".note-alarm").remove();
            }, 3000);
        });
}

var $imgBlock = $('#formContainer [data-field=advImg]');
var $imgBox = $('#formContainer [data-name=advImg]');
var $imgBlock1 = $('#formContainer [data-field=picture1]');
var $imgBox1 = $('#formContainer [data-name=picture1]');
var $imgBlock2 = $('#formContainer [data-field=picture2]');
var $imgBox2 = $('#formContainer [data-name=picture2]');
var $imgBlock3 = $('#formContainer [data-field=picture3]');
var $imgBox3 = $('#formContainer [data-name=picture3]');
//给图片上传字段添加一个红星以标识
$imgBlock1.find("label.bh-form-h-label").addClass("requireLabel");

var img = (contentInfo.advImg == "") ? '../img/upload.jpg' : contentInfo.advImg;
$imgBox.append(
    '<div class="imgUrlBox">' +
    '<img id="uploadImg" src="'+ img +'"/>' +
    '<form id="pictureForm"><input type="file" name="imgUrl" id="imgUrl" class="imgUrl"></form>' +
    '</div>'
);
var img1 = (contentInfo.picture1 == "") ? '../img/upload.jpg' : contentInfo.picture1;
$imgBox1.append(
    '<div class="imgUrlBox">' +
        '<img id="uploadImg1" src="'+ img1 +'"/>' +
        '<form id="pictureForm1"><input type="file" name="imgUrl1" id="imgUrl1" class="imgUrl"></form>' +
    '</div>'
);
var img2 = (contentInfo.picture2 == "") ? '../img/upload.jpg' : contentInfo.picture2;
$imgBox2.append(
    '<div class="imgUrlBox">' +
        '<img id="uploadImg2" src="'+ img2 +'"/>' +
        '<form id="pictureForm2"><input type="file" name="imgUrl2" id="imgUrl2" class="imgUrl"></form>' +
    '</div>'
);
var img3 = (contentInfo.picture3 == "") ? '../img/upload.jpg' : contentInfo.picture3;
$imgBox3.append(
    '<div class="imgUrlBox">' +
        '<img id="uploadImg3" src="'+ img3 +'"/>' +
        '<form id="pictureForm3"><input type="file" name="imgUrl3" id="imgUrl3" class="imgUrl"></form>' +
    '</div>'
);
//上传实时预览 && 上传
$('#imgUrl').change(function () {
    if (this.files[0] != "") {
        $imgBlock1.find("div.jqx-validator-error-info").remove();
        $imgBlock1.children(".bh-form-placeholder").show();
        $imgBox1.css("border", "");
        $imgBlock1.removeClass("jqx-validator-error-container");
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
//上传实时预览 && 上传
$('#imgUrl1').change(function () {
    if (this.files[0] != "") {
        $imgBlock1.find("div.jqx-validator-error-info").remove();
        $imgBlock1.children(".bh-form-placeholder").show();
        $imgBox1.css("border", "");
        $imgBlock1.removeClass("jqx-validator-error-container");
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
                $('#uploadImg1').attr("src", rootPath+res.imgUrl);//上传的图片实时预览
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

//上传实时预览 && 上传
$('#imgUrl2').change(function () {
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
                $('#uploadImg2').attr("src", rootPath+res.imgUrl);//上传的图片实时预览
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

//上传实时预览 && 上传
$('#imgUrl3').change(function () {
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
                $('#uploadImg3').attr("src", rootPath+res.imgUrl);//上传的图片实时预览
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
    //修改
    $btnBox.on("click","#btn-modify",function(){
        var ajaxForm = $form.emapForm("getValue");//获取表单数据

        if($form.emapValidate("validate") && ((($("#imgUrl").val() != "") || ($("#uploadImg").attr("src") !="")) ) ){
            if(ajaxForm.displayType == '4' || ajaxForm.displayType == '3'){
                ajaxForm.detailContent = ''
            }else{
                if(ajaxForm.contentType != '1'){
                    ajaxForm.detailContent = ''
                }else{
                    ajaxForm.detailContent = $('#summernote').summernote('code');//获取富文本编辑器的内容

                }
            }
            ajaxForm.advImg = ($("#uploadImg").attr("src") == "../img/upload.jpg") ? "" : $("#uploadImg").attr("src");
            ajaxForm.picture1 = ($("#uploadImg1").attr("src") == "../img/upload.jpg") ? "" : $("#uploadImg1").attr("src");
            ajaxForm.picture2 = ($("#uploadImg2").attr("src") == "../img/upload.jpg") ? "" : $("#uploadImg2").attr("src");
            ajaxForm.picture3 = ($("#uploadImg3").attr("src") == "../img/upload.jpg") ? "" : $("#uploadImg3").attr("src");
            if(ajaxForm.displayType == '4' ||ajaxForm.displayType == '3'){
                ajaxForm.detailContent = '';
            }

            if(ajaxForm.sourceType == '1'){
                ajaxForm.sourceAccount = ajaxForm.userAccount;
            }
            wisAjax(rootPath+interfaceDef.contentManage.editContent, ajaxForm , function (data) {
                if (data.status == "success") {
                    BH_UTILS.bhDialogSuccess({
                        title:'操作成功!',
                        content:'修改成功!',
                        callback:function(){
                            // window.location.href = '../html/contentManage_new.html';
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
        }else{
            if(($("#imgUrl1").val() == "") && ($("#uploadImg1").attr("src") =="") ){
                $imgBlock1.addClass("jqx-validator-error-container");
                $imgBox1.css("border","2px solid #e24034");
                $imgBlock1.children(".bh-form-placeholder").hide();
                if($imgBlock1.children(".jqx-validator-error-info").length == 0){
                    $imgBlock1.append('<div class="bh-form-group jqx-validator-error-info bh-pv-4 bh-col-md-6" style="display: block;">图片不能为空</div>');
                }
            }
        }
    });

    $btnBox.on("click","#btn-cancel",function(){
        window.location.href = "../html/contentManage_new.html";
    });

    //当展现类型选择"直播"时,直播开始时间  直播状态  直播时长可输入,否则不可输入
    $('#formContainer [data-name=displayType] input[type=radio]').on('change', function () {
        var val = $(this).closest('[xtype=radiolist]').find('input[type=radio]:checked').val();
        if (val == '4') {//视频
            $form.emapForm('showItem', ['videoType', 'videoShareCode', 'videoSourceUrl']);//显示视频类型
            // $form.emapForm('showItem', 'videoShareCode');//显示视频源文件地址
            // $form.emapForm('showItem', 'videoSourceUrl');//显示视频来源地址

            $form.emapForm('hideItem', ['broadcastState','broadcastStartTime','broadcastTime','contentType','link','detailContent','topicInviter','sortNum']);//隐藏直播状态
            // $form.emapForm('clear', ['broadcastState']);
            // $form.emapForm('clear', ['broadcastStartTime']);
            // $form.emapForm('clear', ['broadcastTime']);
            // $form.emapForm('clear', ['contentType']);
            // $form.emapForm('clear', ['link']);
            // $form.emapForm('clear', ['detailContent']);
            // $form.emapForm('clear', ['topicInviter']);
            // $form.emapForm('clear', ['sortNum']);

        } else if(val == '3') {//直播
            $form.emapForm('showItem', ['broadcastState','broadcastStartTime','broadcastTime','videoSourceUrl','sortNum']);//显示直播状态
            $form.emapForm('hideItem', ['videoType','videoShareCode','link','topicInviter','detailContent']);//隐藏视频类型
            // $form.emapForm('clear', 'videoType');
            // $form.emapForm('clear', 'videoShareCode');
            // $form.emapForm('clear', 'link');
            // $form.emapForm('clear', 'topicInviter');
            // $form.emapForm('clear', 'detailContent');

        } else if(val == '6'){
            $form.emapForm('showItem', ['topicInviter']);
            $form.emapForm('hideItem', ['videoType','videoShareCode','broadcastState','broadcastStartTime','broadcastTime','videoSourceUrl','sortNum']);
            // $form.emapForm('clear', 'videoType');
            // $form.emapForm('clear', 'videoShareCode');
            // $form.emapForm('clear', 'broadcastState');
            // $form.emapForm('clear', 'broadcastStartTime');
            // $form.emapForm('clear', 'broadcastTime');
            // $form.emapForm('clear', 'videoSourceUrl');
            // $form.emapForm('clear', 'sortNum');

        } else {
            $form.emapForm('showItem', ['link','detailContent']);//隐藏直播时长
            $form.emapForm('hideItem', ['videoType','videoShareCode','broadcastState','broadcastStartTime','broadcastTime','videoSourceUrl','topicInviter','sortNum']);//隐藏视频类型
            // $form.emapForm('clear', 'videoType');
            // $form.emapForm('clear', 'videoShareCode');
            // $form.emapForm('clear', 'broadcastState');
            // $form.emapForm('clear', 'broadcastStartTime');
            // $form.emapForm('clear', 'broadcastTime');
            // $form.emapForm('clear', 'videoSourceUrl');
            // $form.emapForm('clear', 'topicInviter');
            // $form.emapForm('clear', 'sortNum');

        }

    });
    //当直播状态选择"回放"时,视频地址  视频类型可输入,否则不可输入
    $('#formContainer [data-name=broadcastState] input[type=radio]').on('change', function () {
        if ($('#formContainer [data-name="displayType"] input[type=radio]:checked').val() != '3') return;
        var val = $(this).closest('[xtype=radiolist]').find('input[type=radio]:checked').val();
        if (val == '1' || val == '0') {
            $form.emapForm('hideItem', ['videoType','videoShareCode']);//隐藏视频地址项
            $form.emapForm('clear', ['videoType','videoShareCode']);//清空视频地址项
        } else if(val == '2'){
            $form.emapForm('showItem', ['videoShareCode','videoType']);
            $form.emapForm('setValue', {'videoType':contentInfo.videoType});
        }
    });
    //当内容类型选择"链接"时,链接可见,否则不可见
    $('#formContainer [data-name=contentType] input[type=radio]').on('change', function () {
        if ($('#formContainer [data-name="displayType"] input[type=radio]:checked').val() == '4') {
            $form.emapForm('hideItem', ['detailContent','localLink','link','contentType']);
            return;
        }
        var val = $(this).closest('[xtype=radiolist]').find('input[type=radio]:checked').val();
        if (val == '0') {
            $form.emapForm('showItem', 'link');
            $form.emapForm('enableItem', 'link');
            $('#formContainer [data-field=link]').find('input[data-name]').attr('disabled',false);
            $form.emapForm('hideItem', ['detailContent','localLink']);

        } else if(val == '1'){
            $form.emapForm('showItem', 'detailContent');
            $form.emapForm('hideItem', ['link','localLink']);
        }else if(val == '2' || val == '3'){
            $form.emapForm('disableItem',['link','localLink']);
            $form.emapForm('showItem', ['link','localLink']);
            $form.emapForm('hideItem', 'detailContent');
        }
    });

    //当来源类型选择"校园号"时,下拉选择的来源账号可见,输入框的来源账号不可见.否则相反
    $('#formContainer [data-name=sourceType] input[type=radio]').on('change', function () {
        var val = $(this).closest('[xtype=radiolist]').find('input[type=radio]:checked').val();
        if (val == '0') {
            $form.emapForm('hideItem', 'userAccount');
            $form.emapForm('showItem', 'sourceAccount');
            $form.emapForm('clear', ['userAccount']);
        } else {
            $form.emapForm('showItem', 'userAccount');
            $form.emapForm('clear', ['sourceAccount']);
            $form.emapForm('hideItem', 'sourceAccount');
        }
    });
}