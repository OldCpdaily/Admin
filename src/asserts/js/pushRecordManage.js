/**
 * Created by zhouchen on 16/6/8.
 */

var datamodel = '';
var $table = $('#tableContainer');

//获取表格模型
wisAjax2(interfaceDef.model,"",function(data){
    datamodel = data.models[10].controls;
},false);

//插件选项设置
var options = {
    sortable: false,
    colHasMinWidth: false,
    url: rootPath+interfaceDef.pushRecordManage.pushRecordList,
    //pagePath: pagePath,
    datamodel: datamodel,//必须 需要展示的数据列
    action: 'pushList',//必须
    method: 'GET',//可选，默认'POST'//对接后台接口时请改为POST
    pageable: true,//可选，默认true
    params:{
        "alterContent":window.sessionStorage.getItem("filter_alterContent"),
        "status":window.sessionStorage.getItem("filter_pushStatus")
    },
    customColumns: [//数组项如果有colIndex字段，则必须按照该字段从小到大顺序排列
        {
            colField: 'contentId',
            type: 'tpl',
            column: {
                cellsRenderer: function (row, column, value, rowData) {
                    return (rowData.contentId == '') ? '暂未关联内容' : rowData.contentId;
                }
            }
        },
        {
            colIndex: 'last',
            type: 'tpl',
            width: '11%',
            column: {
                text: '操作',
                cellsRenderer: function(row, column, value, rowData){
                    var pushState = (rowData.status == '已推送') ? 1 : 0;
                    var pushStr = pushState?'已推送':'推送',
                        pushCss = pushState?'gray disable':'',
                        operation = '';
                    if(pushState){
                        operation = '<div class="operation" data-id="'+ rowData.pushId +'" data-title="'+ rowData.title +'">'+
                                        '<a href="javascript:void(0)" class="view mrg-rg">查看</a>' +
                                    '</div>';
                    }else{
                        operation = '<div class="operation" data-id="'+ rowData.pushId +'" data-title="'+ rowData.title +'">'+
                                        '<a href="javascript:void(0)" class="edit mrg-rg">编辑</a>' +
                                        '<a href="javascript:void(0)" class="push mrg-rg">推送</a>' +
                                        '<a href="javascript:void(0)" class="delete mrg-rg">删除</a>' +
                                    '</div>';
                    }

                    return operation;
                }
            }
        }
    ]
};
$table.emapdatatable(options);

//获取高级搜索模型
var searchData;
wisAjax2(interfaceDef.pushRecordManage.advencedQueryModel,"",function(data){
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

            //获取已存在的筛选条件 "标题"
            $('#advancedQueryPlaceholder .bh-advancedQuery-quick-search-wrap input[type=text]').val(window.sessionStorage.getItem("filter_alterContent"));

            //获取已存在的筛选条件 "推送状态"
            if(window.sessionStorage.getItem("filter_pushStatus") == null){
                $('[data-name=status] [data-id=ALL]', wrap).addClass("bh-active");
            }else if(window.sessionStorage.getItem("filter_pushStatus") != ""){
                $('[data-name=status] [data-id=ALL]', wrap).removeClass("bh-active");
                $('[data-name=status] [data-id='+ window.sessionStorage.getItem("filter_pushStatus") +']', wrap).addClass("bh-active");
            }
        }
    });
},false);


$('#advancedQueryPlaceholder').on('search', function(e, data, opts){
    //调用表格reload方法
    var Data = JSON.parse(data);
    var filter = {};
    var statusArr = Data.filter(function(v){return v.name == 'status'});

    filter.pushStatus = statusArr.length > 0 ? statusArr[0].value : "";
    filter.alterContent = $('#advancedQueryPlaceholder .bh-advancedQuery-quick-search-wrap input[type=text]').val();
    window.sessionStorage.setItem("filter_alterContent",filter.alterContent);
    window.sessionStorage.setItem("filter_pushStatus",filter.pushStatus);

    $("#tableContainer").emapdatatable('reload', filter);
});


//查看
$table.on('click','.view',function(){
    var pushId = $(this).parent().data("id");
    window.open("pushDetail.html?pushId="+pushId+'&flag=0');
});

//编辑
$table.on('click','.edit',function(){
    var pushId = $(this).parent().data("id");
    window.open("pushDetail.html?pushId="+pushId+'&flag=1');
});

//推送
$table.on('click','.push',function(){
    if(!$(this).hasClass("disable")) {
        var pushId = $(this).parent().data("id");
        BH_UTILS.bhDialogWarning({
            title: '确定推送标题为"' + $(this).parent().data("title") + '"的推送?',
            //content:,
            buttons: [
                {
                    text: '确定',
                    className: 'bh-btn-warning',
                    callback: function () {
                        var tmp = {
                            "pushId": pushId
                        };
                        wisAjax(rootPath + interfaceDef.pushRecordManage.push, tmp, function (data) {
                            if (data.status == "success") {
                                $table.emapdatatable('reload', {
                                    "alterContent":window.sessionStorage.getItem("filter_alterContent"),
                                    "status":window.sessionStorage.getItem("filter_pushStatus")
                                });
                                BH_UTILS.bhDialogSuccess({
                                    title: '推送成功!'
                                    //content:'删除成功!'
                                });
                            } else {
                                $.bhDialog({
                                    title: '推送失败!错误原因:' + data.errorMsg,
                                    //content:'',
                                    width: 464,
                                    //height:400,
                                    className: 'bh-dialog-text',
                                    buttons: [{text: '好的', className: 'bh-btn-primary'}]
                                });
                            }
                        });
                    }
                },
                {
                    text: '取消',
                    className: 'bh-btn-default'
                }
            ]
        });
    }
});

//删除
$table.on('click','.delete',function(){
    if(!$(this).hasClass("disable")) {
        var pushId = $(this).parent().data("id");
        BH_UTILS.bhDialogWarning({
            title: '确定删除标题为"' + $(this).parent().data("title") + '"的推送?',
            //content:,
            buttons: [
                {
                    text: '确定',
                    className: 'bh-btn-warning',
                    callback: function () {
                        var tmp = {
                            "pushId": pushId
                        };
                        wisAjax(rootPath + interfaceDef.pushRecordManage.delete, tmp, function (data) {
                            if (data.status == "success") {
                                $table.emapdatatable('reload', {
                                    "alterContent":window.sessionStorage.getItem("filter_alterContent"),
                                    "status":window.sessionStorage.getItem("filter_pushStatus")
                                });
                                BH_UTILS.bhDialogSuccess({
                                    title: '删除成功!'
                                });
                            } else {
                                $.bhDialog({
                                    title: '删除失败!错误原因:' + data.errorMsg,
                                    //content:'',
                                    width: 464,
                                    //height:400,
                                    className: 'bh-dialog-text',
                                    buttons: [{text: '好的', className: 'bh-btn-primary'}]
                                });
                            }
                        });
                    }
                },
                {
                    text: '取消',
                    className: 'bh-btn-default'
                }
            ]
        });
    }
});


