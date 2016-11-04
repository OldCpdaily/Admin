/**
 * Created by zhouchen on 16/6/8.
 */
var formDataModel = '';
var $form = $("#formContainer");
var $btnBox = $(".btn-box");

//获取表单模型
wisAjax2(interfaceDef.formModel, "",function(data){
    formDataModel = data.models[18].controls;
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

//点击添加提交表单
$btnBox.on("click","#btn-add",function(){
    if ($form.emapValidate("validate")) {
        var ajaxForm = $form.emapForm("getValue");//获取表单数据
        wisAjax(rootPath+interfaceDef.pushRecordManage.addPush, ajaxForm, function (data) {
            if (data.status == "success") {
                BH_UTILS.bhDialogSuccess({
                    title:'添加成功!',
                    //content:'删除成功!'
                    callback:function(){
                        // window.location.href = '../html/luckyDrawManage.html';
                        window.close();
                    }
                });
            } else {
                $.bhDialog({
                    title:'添加失败!错误原因:'+data.errorMsg,
                    //content:'',
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
    window.close();
});

//当内容类型选择"链接"时,链接可见,否则不可见
$('#formContainer [data-name=audienceType] input[type=radio]').on('change', function () {
    var val = $(this).closest('[xtype=radiolist]').find('input[type=radio]:checked').val();
    if (val == 'all') {
        $form.emapForm('hideItem', 'tags');
        $form.emapForm('hideItem', 'alias');
    } else if(val == 'tag' || val == 'tag_and'){
        $form.emapForm('showItem', 'tags');
        $form.emapForm('hideItem', 'alias');
    } else if(val == 'alias'){
        $form.emapForm('hideItem', 'tags');
        $form.emapForm('showItem', 'alias');
    }
});

