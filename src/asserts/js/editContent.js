/**
 * Created by zhouchen on 16/3/17.
 */
var formDataModel;
var $form = $("#formContainer");
var $btnBox = $(".btn-box");

//获取表单模型
wisAjax2(interfaceDef.formModel, "",function(data){
        formDataModel = data.models[0].controls;
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
//事件绑定
eventBind();
// eventBind2();

//获取表单数据
var contentInfo,img;
wisAjax2(rootPath+"/v1/feeds/manage/"+getQueryString("contentId"),
    {
        "contentId": getQueryString("contentId")
    },function(data){
        contentInfo = data.datas;
        //向表单中填充数据
        //if(contentInfo.videoSourceId == "优酷"){
        //    img = "../img/upload.jpg";
        //}
        contentInfo.originTime = data.datas.originTime.substring(0,10) + " " + data.datas.originTime.substring(11,16);
        $form.emapForm("setValue", contentInfo);
        $('#formContainer [data-name=displayTypeId] input[type=radio]').trigger('change');
        $('#formContainer [data-name=videoSourceId] input[type=radio]').trigger('change');
    },false);

$imgBox.append(
    '<div class="imgUrlBox">' +
        '<img id="uploadImg" src="'+ rootPath + contentInfo.imgUrl +'"/>' +
        '<input type="file" name="imgUrl" id="imgUrl" class="imgUrl" title="'+ rootPath + contentInfo.imgUrl +'">' +
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


function eventBind() {
    //修改
    $btnBox.on("click","#btn-modify",function(){
        var ajaxForm = $form.emapForm("getValue"),//获取表单数据
            $myForm = $("#myForm");//获取原始网页地址

        if($form.emapValidate("validate") && ((($("#imgUrl").val() != "") || ($("#uploadImg").attr("src") !="")) ) ){
            ajaxForm.imgUrl = getFileName($("#imgUrl").val());//获取上传的图片的名称
            wisAjax(rootPath+"/v1/feeds/"+contentInfo.contentId, ajaxForm , function (data) {
                if (data.status == "success") {
                    $myForm.attr('action', rootPath+"/v1/feeds/video/img/"+contentInfo.contentId);
                    $myForm.submit();
                } else {
                    alert("修改失败!\n错误原因:" + data.errorMsg);
                }
            });

        }else{
            if(($("#imgUrl").val() == "") && ($("#uploadImg").attr("src") =="") ){
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

    //当展现类型选择"视频"时,视频类型和视频地址可输入,否则不可输入
    $('#formContainer [data-name=displayTypeId] input[type=radio]').on('change', function(){
        var val = $(this).closest('[xtype=radiolist]').find('input[type=radio]:checked').val();
        // if (val != '视频') {
        //     $form.emapForm('hideItem', 'videoAddress');//置灰视频地址项
        //     $form.emapForm('clear', ['videoAddress']);//清空视频地址项
        //     $form.emapForm('hideItem', 'videoSourceId');//置灰视频类型项
        //     $form.emapForm('clear', ['videoSourceId']);//清空视频类型项
        //     $form.emapForm('showItem', 'imgUrl');
        //     $form.emapForm('disableItem','title');
        // } else {
        //     $form.emapForm('showItem', 'videoAddress');
        //     $form.emapForm('showItem', 'videoSourceId');
        //     $form.emapForm('enableItem','title');
        // }

        if (val != '视频' && val != '直播') {
            $form.emapForm('hideItem', 'videoAddress');//隐藏视频地址项
            $form.emapForm('clear', ['videoAddress']);//清空视频地址项
            $form.emapForm('hideItem', 'videoSourceId');//隐藏视频类型项
            $form.emapForm('clear', ['videoSourceId']);//清空视频类型项
            $form.emapForm('showItem', 'imgUrl');
            $form.emapForm('disableItem','title');
            $form.emapForm('hideItem', 'liveState');//隐藏直播状态项
            $form.emapForm('clear', ['liveState']);//清空直播状态项
            $form.emapForm('hideItem', 'liveStartTime');//隐藏直播开始时间项
            $form.emapForm('clear', ['liveStartTime']);//清空直播开始时间项
            $form.emapForm('hideItem', 'liveTime');//隐藏直播时长项
            $form.emapForm('clear', ['liveTime']);//清空直播时长项
        } else if(val == '直播'){
            $form.emapForm('showItem', 'liveState');
            $form.emapForm('showItem', 'liveStartTime');
            $form.emapForm('showItem','liveTime');
            if($('#formContainer [data-name=liveState] input[type=radio]').closest('[xtype=radiolist]').find('input[type=radio]:checked').val() != '2'){
                $form.emapForm('hideItem', 'videoSourceId');//隐藏视频地址项
                $form.emapForm('clear', ['videoSourceId']);//清空视频地址项
                $form.emapForm('hideItem', 'videoAddress');//隐藏视频地址项
                $form.emapForm('clear', ['videoAddress']);//清空视频地址项
            } else {
                $form.emapForm('showItem', 'videoAddress');
                $form.emapForm('showItem', 'videoSourceId');
            }
        } else if(val == '视频'){
            $form.emapForm('showItem', 'videoAddress');
            $form.emapForm('showItem', 'videoSourceId');
            $form.emapForm('enableItem','title');
            $form.emapForm('hideItem', 'liveState');//隐藏直播状态项
            $form.emapForm('clear', ['liveState']);//清空直播状态项
            $form.emapForm('hideItem', 'liveStartTime');//隐藏直播开始时间项
            $form.emapForm('clear', ['liveStartTime']);//清空直播开始时间项
            $form.emapForm('hideItem', 'liveTime');//隐藏直播时长项
            $form.emapForm('clear', ['liveTime']);//清空直播时长项
        }

    });

    //当直播状态选择"回放"时,视频地址  视频类型可输入,否则不可输入
    $('#formContainer [data-name=liveState] input[type=radio]').on('change', function(){
        var val2 = $(this).closest('[xtype=radiolist]').find('input[type=radio]:checked').val();
        if (val2 != '2') {
            $form.emapForm('hideItem', 'videoSourceId');//隐藏视频地址项
            $form.emapForm('clear', ['videoSourceId']);//清空视频地址项
            $form.emapForm('hideItem', 'videoAddress');//隐藏视频地址项
            $form.emapForm('clear', ['videoAddress']);//清空视频地址项
        } else {
            $form.emapForm('showItem', 'videoAddress');
            $form.emapForm('showItem', 'videoSourceId');
        }
    });

    ////当视频类型选择"优酷"时,封面图片不需要上传
    //$('#formContainer [data-name=videoSourceId] input[type=radio]').on('change', function(){
    //    var val = $(this).closest('[xtype=radiolist]').find('input[type=radio]:checked').val();
    //    if (val == '优酷') {//选择优酷时,隐藏封面图片上传
    //        $form.emapForm('clear', 'imgUrl');
    //        $form.emapForm('hideItem', 'imgUrl');
    //    }else{//选择"美拍"时,展现封面图片上传
    //        $form.emapForm('showItem', 'imgUrl');
    //    }
    //});

}