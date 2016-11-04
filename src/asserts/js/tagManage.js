/**
 * Created by zhouchen on 16/5/18.
 */

var datamodel;
var $table = $('#tableContainer');

//获取表格模型
wisAjax2(interfaceDef.model,"",function(data){
    datamodel = data.models[5].controls;
},false);

//插件选项设置
var options = {
    sortable: false,
    colHasMinWidth: false,
    url: rootPath+interfaceDef.tagManage.tagList,
    //pagePath: pagePath,
    datamodel: datamodel,//必须 需要展示的数据列
    action: 'tagList',//必须
    method: 'GET',//可选，默认'POST'//对接后台接口时请改为POST
    pageable: true,//可选，默认true
    customColumns: [//数组项如果有colIndex字段，则必须按照该字段从小到大顺序排列
        {colIndex: 0, type: 'checkbox'},
        {
            colIndex: 'last',
            type: 'tpl',
            width: '9.2%',
            column: {
                text: '操作',
                cellsRenderer: function(row, column, value, rowData){
                    var operation = '<div class="operation" data-id="'+ rowData.tagId +'" data-name="'+ rowData.tagName +'">'+
                                        '<a href="javascript:void(0)" class="edit mrg-rg">编辑</a>' +
                                        '<a href="javascript:void(0)" class="delete mrg-rg">删除</a>' +
                                    '</div>';
                    return operation;
                }
            }
        }
    ]
};
$table.emapdatatable(options);

//表格渲染完成后,若没有行被选中,则置灰批量按钮,否则点亮
$table.on('bindingComplete', function (event) {
    // Some code here. });
    if($table.find("input[type=checkbox]:checked").length != 0){
        //批量删除
        $("#batchDelete").removeClass('disable');
        $("#batchDelete").attr('disabled',false);
    }else{
        //批量删除
        $("#batchDelete").addClass('disable');
        $("#batchDelete").attr('disabled',true);
    }
});

//勾选内容时,启用批量操作按钮
$table.on('change','input[type=checkbox]',function () {
    if($table.find("input[type=checkbox]:checked").length != 0){
        $("#batchDelete").removeClass('disable');
        $("#batchDelete").attr('disabled',false);
    }else{
        $("#batchDelete").addClass('disable');
        $("#batchDelete").attr('disabled',true);
    }

});

//编辑
$table.on('click','.edit',function(){
    var tagId = $(this).parent().data("id");
    window.open("editTag.html?tagId="+tagId);
});

//批量删除
$(".add-btn-box").on('click','a#batchDelete',function(){
    //选中的标签个数
    var num =  $table.find("input[type=checkbox]:checked:not(.selectFlag)").length;
    BH_UTILS.bhDialogWarning({
        title:'确定删除这'+ num +'个标签么?',
        //content:,
        buttons:[
            {
                text:'确定',
                className:'bh-btn-warning',
                callback:function(){
                    //选中的标签id组成字符串,用逗号隔开
                    var tagIds =  $table.find("input[type=checkbox]:checked:not(.selectFlag)").closest('tr').find('div.operation').map(function () {
                        return $(this).data("id");
                    }).get().join(",");
                    wisAjax(rootPath+interfaceDef.tagManage.delete,{"tagId":tagIds},function(data){
                        if(data.status == "success"){
                            $table.emapdatatable('reload', {});
                            BH_UTILS.bhDialogSuccess({
                                title:'删除成功!'
                                //content:'删除成功!'
                            });
                        }else{
                            $.bhDialog({
                                title:'删除失败!错误原因:'+data.errorMsg,
                                //content:'',
                                width:464,
                                //height:400,
                                className:'bh-dialog-text',
                                buttons:[{text:'好的',className:'bh-btn-primary'}]
                            });
                        }
                    });
                }
            },
            {
                text:'取消',
                className:'bh-btn-default'
            }
        ]
    });
});

//删除
$table.on('click','.delete',function(){
    var tagId = $(this).parent().data("id");
    BH_UTILS.bhDialogWarning({
        title:'确定删除名为"'+ $(this).parent().data("name") +'"的标签?',
        //content:,
        buttons:[
            {
                text:'确定',
                className:'bh-btn-warning',
                callback:function(){
                    var tmp = {
                        "tagId": tagId
                    };
                    wisAjax(rootPath+interfaceDef.tagManage.delete,tmp,function(data){
                        if(data.status == "success"){
                            $table.emapdatatable('reload', {});
                            BH_UTILS.bhDialogSuccess({
                                title:'删除成功!'
                                //content:'删除成功!'
                            });
                        }else{
                            $.bhDialog({
                                title:'删除失败!错误原因:'+data.errorMsg,
                                //content:'',
                                width:464,
                                //height:400,
                                className:'bh-dialog-text',
                                buttons:[{text:'好的',className:'bh-btn-primary'}]
                            });
                        }
                    });
                }
            },
            {
                text:'取消',
                className:'bh-btn-default'
            }
        ]
    });

});


