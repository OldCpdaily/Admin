/**
 * Created by zhouchen on 16/5/18.
 */

var datamodel = '';
var $table = $('#tableContainer');

//获取表格模型
wisAjax2(interfaceDef.model,"",function(data){
    datamodel = data.models[7].controls;
},false);

//插件选项设置
var options = {
    sortable: false,
    colHasMinWidth: false,
    url:rootPath+interfaceDef.groupManage.groupList,
    //pagePath: pagePath,
    datamodel: datamodel,//必须 需要展示的数据列
    action: 'groupList',//必须
    method: 'GET',//可选，默认'POST'//对接后台接口时请改为POST
    pageable: true,//可选，默认true
    params:{
        "groupName":window.sessionStorage.getItem("filter_groupName"),
        "groupType":window.sessionStorage.getItem("filter_groupType")
    },
    customColumns: [//数组项如果有colIndex字段，则必须按照该字段从小到大顺序排列
        {colIndex: 0, type: 'checkbox'},
        {
            colIndex: 'last',
            type: 'tpl',
            width: '9.2%',
            column: {
                text: '操作',
                cellsRenderer: function(row, column, value, rowData){
                    var operation = '<div class="operation" data-id="'+ rowData.groupId +'" data-name="'+ rowData.groupName +'">'+
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

//获取高级搜索模型
var searchData;
wisAjax2(interfaceDef.groupManage.advencedQueryModel,"",function(data){
    searchData = data;
    $(searchData.controls).each(function () {
        this.get = function (field) {
            return this[field];
        }
    });
    //渲染高级搜索
    $('#advancedQueryPlaceholder').emapAdvancedQuery({
        data: searchData,
        initComplete: function(){

            var wrap = $('#advancedQueryPlaceholder .bh-advancedQuery-groupList');
            //获取已存的筛选条件 "组名称"
            $('#advancedQueryPlaceholder .bh-advancedQuery-quick-search-wrap input[type=text]').val(window.sessionStorage.getItem("filter_groupName"));

            //获取已存的筛选条件 "组类型"
            if(window.sessionStorage.getItem("filter_groupType") == null){
                $('[data-name=groupType] [data-id=ALL]', wrap).addClass("bh-active");
            }else if(window.sessionStorage.getItem("filter_groupType") != ""){
                $('[data-name=groupType] [data-id=ALL]', wrap).removeClass("bh-active");
                $('[data-name=groupType] [data-id='+ window.sessionStorage.getItem("filter_groupType") +']', wrap).addClass("bh-active");
            }
        }
    });
},false);


$('#advancedQueryPlaceholder').on('search', function(e, data, opts){
    //调用表格reload方法
    var Data = JSON.parse(data);
    var filter = {};
    var groupTypeArr = Data.filter(function(v){return v.name == 'groupType'});

    filter.groupType = groupTypeArr.length > 0 ? groupTypeArr[0].value : "";
    filter.groupName = $('#advancedQueryPlaceholder .bh-advancedQuery-quick-search-wrap input[type=text]').val();

    window.sessionStorage.setItem("filter_groupType",filter.groupType);
    window.sessionStorage.setItem("filter_groupName",filter.groupName);

    $("#tableContainer").emapdatatable('reload', filter);
});

//编辑
$table.on('click','.edit',function(){
    var groupId = $(this).parent().data("id");
    window.open("editGroup.html?groupId="+groupId);
});

//批量删除
$(".add-btn-box").on('click','a#batchDelete',function(){
    //选中的虚拟组个数
    var num =  $table.find("input[type=checkbox]:checked:not(.selectFlag)").length;
    BH_UTILS.bhDialogWarning({
        title:'确定删除这'+ num +'个虚拟组么?',
        //content:,
        buttons:[
            {
                text:'确定',
                className:'bh-btn-warning',
                callback:function(){
                    //选中的虚拟组id组成字符串,用逗号隔开
                    var groupIds =  $table.find("input[type=checkbox]:checked:not(.selectFlag)").closest('tr').find('div.operation').map(function () {
                        return $(this).data("id");
                    }).get().join(",");
                    wisAjax(rootPath+interfaceDef.groupManage.delete,{"groupId":groupIds},function(data){
                        if(data.status == "success"){
                            $table.emapdatatable('reload', {
                                "groupName":window.sessionStorage.getItem("filter_groupName"),
                                "groupType":window.sessionStorage.getItem("filter_groupType")
                            });
                            BH_UTILS.bhDialogSuccess({
                                title:'操作成功!',
                                content:'删除成功!'
                            });
                        }else{
                            $.bhDialog({
                                title:'操作失败!',
                                content:'删除失败!错误原因:'+data.errorMsg,
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
    var groupId = $(this).parent().data("id");
    BH_UTILS.bhDialogWarning({
        title:'确定删除名为"'+ $(this).parent().data("name") +'"的虚拟组?',
        //content:,
        buttons:[
            {
                text:'确定',
                className:'bh-btn-warning',
                callback:function(){
                    var tmp = {
                        "groupId": groupId
                    };
                    wisAjax(rootPath+interfaceDef.groupManage.delete,tmp,function(data){
                        if(data.status == "success"){
                            $table.emapdatatable('reload', {
                                "groupName":window.sessionStorage.getItem("filter_groupName"),
                                "groupType":window.sessionStorage.getItem("filter_groupType")
                            });
                            BH_UTILS.bhDialogSuccess({
                                title:'删除成功!'
                                //content:'删除成功!'
                            });
                        }else{
                            $.bhDialog({
                                title:'操作失败!',
                                content:'删除失败!错误原因:'+data.errorMsg,
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


