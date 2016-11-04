/**
 * Created by zhouchen on 16/6/12.
 */
var formDataModel = '';
var $form = $("#formContainer");
var $btnBox = $(".btn-box");

if(getQueryString('flag') == '0'){
    $('#btn-cancel').html('关闭');
    //获取表单模型
    wisAjax2(interfaceDef.formModel, "",function(data){
        formDataModel = data.models[17].controls;
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
    var pushDetail;
    wisAjax2(rootPath+interfaceDef.pushRecordManage.detail+getQueryString("pushId"),"",
        function(data){
            pushDetail = data.datas;
            //向表单中填充数据
            $form.emapForm("setValue", pushDetail);
            if(pushDetail.audienceType == 'all'){
                $form.emapForm('hideItem', ['tags','alias']);
                $form.emapForm('clear', ['tags','alias']);
            }else if(pushDetail.audienceType.indexOf('tag')>=0){
                $form.emapForm('showItem', 'tags');
                $form.emapForm('hideItem', 'alias');
                $form.emapForm('clear', 'alias');
            }else if(pushDetail.audienceType == 'alias'){
                $form.emapForm('showItem', 'alias');
                $form.emapForm('hideItem', 'tags');
                $form.emapForm('clear', 'tags');
            }
            $form.emapForm('disableItem', ['platform','audienceType','tags','alias']);
            $('.bh-disabled label').css('color','#333');
        },false);



}else{
    $('#btn-cancel').html('取消');
    $('#btn-edit').show();

    //获取表单模型
    wisAjax2(interfaceDef.formModel, "",function(data){
        formDataModel = data.models[19].controls;
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
    var pushDetail;
    wisAjax2(rootPath+interfaceDef.pushRecordManage.detail+getQueryString("pushId"),"",
        function(data){
            pushDetail = data.datas;
            //向表单中填充数据
            $form.emapForm("setValue", pushDetail);
            $('#formContainer [data-name=audienceType] input[type=radio]').trigger('change');
        },false);


}

$btnBox.on("click","#btn-cancel",function(){
    window.close();
});

function eventBind() {

    //修改
    $btnBox.on("click","#btn-edit",function(){
        if($form.emapValidate("validate")){
            var ajaxForm = $form.emapForm("getValue");//获取表单数据
            wisAjax(rootPath+interfaceDef.pushRecordManage.editPush, ajaxForm , function (data) {
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
        }
    });

    //当推送类型选择"用户标签"时,隐藏 用户别名
    $('#formContainer [data-name=audienceType] input[type=radio]').on('change', function () {
        var val = $(this).closest('[xtype=radiolist]').find('input[type=radio]:checked').val();
        if (val == 'all') {
            $form.emapForm('hideItem', ['alias','tags']);
            $form.emapForm('clear', ['alias','tags']);
        } else if(val == 'tag' || val == 'tag_and'){
            $form.emapForm('showItem', ['tags']);
            $form.emapForm('hideItem', ['alias']);
            $form.emapForm('clear', ['alias']);
        }else if(val == 'alias'){
            $form.emapForm('showItem', ['alias']);
            $form.emapForm('hideItem', ['tags']);
            $form.emapForm('clear', ['tags']);
        }
    });
}