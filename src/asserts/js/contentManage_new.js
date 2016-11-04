/**
 * Created by zhouchen on 16/3/16.
 */

var datamodel;
var $table = $('#tableContainer');


//获取表格模型
wisAjax2(interfaceDef.model,"",function(data){
    datamodel = data.models[6].controls;
},false);

//插件选项设置
var options = {
    sortable: true,
    colHasMinWidth: false,
    url: rootPath+interfaceDef.contentManage.contentList,//url和pagePath二选一
    //pagePath: pagePath,
    datamodel: datamodel,//必须 需要展示的数据列
    action: 'contentList',//必须
    method: 'GET',//可选，默认'POST'//对接后台接口时请改为POST
    pageable: true,//可选，默认true
    params:{
        "title":window.sessionStorage.getItem("filter_title"),
        "source":window.sessionStorage.getItem("filter_source"),
        "group":window.sessionStorage.getItem("filter_group"),
        "tag":window.sessionStorage.getItem("filter_tag"),
        "state":window.sessionStorage.getItem("filter_state"),
        "displayType":window.sessionStorage.getItem("filter_displayType")
    },
    customColumns: [//数组项如果有colIndex字段，则必须按照该字段从小到大顺序排列
        {colIndex: 0, type: 'checkbox'},
        {
            colField: 'title',
            type: 'tpl',
            column: {
                sortable: false,
                cellsRenderer: function (row, column, value, rowData) {
                    var url ='';
                    if(rowData.contentType == '0'){
                        url = rowData.contentHtmlUrl;
                    }else{
                        url = rootPath+rowData.contentHtmlUrl
                    }
                    return '<a href="'+ url +'" target="_blank">'+ rowData.title +'</a>';
                }
            }
        },
        {
            colField: 'contentHtmlUrl',
            type: 'tpl',
            column: {sortable: false}
        },
        {
            colField: 'contentId',
            type: 'tpl',
            column: {sortable: false}
        },
        {
            colField: 'tags',
            type: 'tpl',
            column: {sortable: false}
        },
        {
            colField: 'sourceAccount',
            type: 'tpl',
            column: {sortable: false}
        },
        {
            colField: 'displayType',
            type: 'tpl',
            column: {sortable: false}
        },
        {
            colField: 'readNum',
            type: 'tpl',
            column: {sortable: true}
        },
        {
            colField: 'commentNum',
            type: 'tpl',
            column: {sortable: true}
        },
        {
            colField: 'shareNum',
            type: 'tpl',
            column: {sortable: true}
        },
        {
            colField: 'createTime',
            type: 'tpl',
            column: {sortable: true}
        },
        {
            colField: 'publishTime',
            type: 'tpl',
            column: {sortable: true}
        },
        {
            colField: 'state',
            type: 'tpl',
            column: {
                sortable: false,
                cellsRenderer: function (row, column, value, rowData) {
                    var state = '';
                    if(rowData.state == 0){
                        state = '未启用';
                    }else if(rowData.state == 1){
                        state = '启用';
                    }else if(rowData.state == 2){
                        state = '停用'
                    }
                    return state;
                }
            }
        },
        {
            colIndex: 'last',
            type: 'tpl',
            width: '9.2%',
            column: {
                sortable: false,
                text: '操作',
                cellsRenderer: function(row, column, value, rowData){
                    var turnOnOff = '',
                        operationCss = '';
                    if(rowData.state == 0){//此时为未启用状态
                        turnOnOff = '启用';
                        operationCss = '';
                    }else if(rowData.state == 1){//此时为启用用状态
                        turnOnOff = '停用';
                        operationCss = 'gray disable';
                    }else if(rowData.state == 2){//此时为停用状态
                        turnOnOff = '启用';
                        operationCss = '';
                    }
                    var operation = '<div class="operation" data-id="'+ rowData.contentId +'">'+
                                        '<a href="javascript:void(0);" class="turnOnOff mrg-rg">'+ turnOnOff +'</a>' +
                                        '<a href="javascript:void(0);" class="edit mrg-rg '+ operationCss +'">编辑</a>' +
                                        '<a href="javascript:void(0);" data-title="'+ rowData.title +'" class="delete mrg-rg '+ operationCss +'">删除</a>' +
                                    '</div>';
                    return operation;
                }
            }
        }
    ]
};
$table.emapdatatable(options);
$table.on('bindingComplete', function (event) {
    // Some code here. });
    if($table.find("input[type=checkbox]:checked").length != 0){
        //批量删除
        $("#batchDelete").removeClass('disable');
        $("#batchDelete").attr('disabled',false);
        //批量启用
        $("#batchTurnOn").removeClass('disable');
        $("#batchTurnOn").attr('disabled',false);
        //批量停用
        $("#batchTurnOff").removeClass('disable');
        $("#batchTurnOff").attr('disabled',false);
    }else{
        //批量删除
        $("#batchDelete").addClass('disable');
        $("#batchDelete").attr('disabled',true);
        //批量启用
        $("#batchTurnOn").addClass('disable');
        $("#batchTurnOn").attr('disabled',true);
        //批量停用
        $("#batchTurnOff").addClass('disable');
        $("#batchTurnOff").attr('disabled',true);
    }
});

//勾选内容时,启用批量操作按钮
$table.on('change','input[type=checkbox]',function () {
    if($table.find("input[type=checkbox]:checked").length != 0){
        $("#batchDelete").removeClass('disable');
        $("#batchDelete").attr('disabled',false);
        $("#batchTurnOn").removeClass('disable');
        $("#batchTurnOn").attr('disabled',false);
        $("#batchTurnOff").removeClass('disable');
        $("#batchTurnOff").attr('disabled',false);
    }else{
        $("#batchDelete").addClass('disable');
        $("#batchDelete").attr('disabled',true);
        $("#batchTurnOn").addClass('disable');
        $("#batchTurnOn").attr('disabled',true);
        $("#batchTurnOff").addClass('disable');
        $("#batchTurnOff").attr('disabled',true);
    }

});

//获取高级搜索模型
var searchData;
wisAjax2(interfaceDef.contentManage.advencedQueryModel,"",function(data){
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

            $('.bh-advancedQuery-groupList div[data-name=userTag]').append('<div class="bh-label-radio" data-id="noTag">无标签</div>');

            var wrap = $('#advancedQueryPlaceholder .bh-advancedQuery-groupList');

            //获取已存在的筛选条件 "标题"
            $('#advancedQueryPlaceholder .bh-advancedQuery-quick-search-wrap input[type=text]').val(window.sessionStorage.getItem("filter_title"));

            //获取已存在的筛选条件 "校园号"
            if(window.sessionStorage.getItem("filter_source") == null){
                $('[data-name=source] [data-id=ALL]', wrap).addClass("bh-active");
            }else if(window.sessionStorage.getItem("filter_source") != ""){
                $('[data-name=source] [data-id=ALL]', wrap).removeClass("bh-active");
                $('[data-name=source] [data-id='+ window.sessionStorage.getItem("filter_source") +']', wrap).addClass("bh-active");
            }

            //获取已存在的筛选条件 "虚拟组"
            if(window.sessionStorage.getItem("filter_group") == null){
                $('[data-name=group] [data-id=ALL]', wrap).addClass("bh-active");
            }else if(window.sessionStorage.getItem("filter_group") != ""){
                $('[data-name=group] [data-id=ALL]', wrap).removeClass("bh-active");
                $('[data-name=group] [data-id='+ window.sessionStorage.getItem("filter_group") +']', wrap).addClass("bh-active");
            }

            //获取已存在的筛选条件 "标签"
            if(window.sessionStorage.getItem("filter_tag") == null){
                $('[data-name=tag] [data-id=ALL]', wrap).addClass("bh-active");
            }else if(window.sessionStorage.getItem("filter_tag") != ""){
                $('[data-name=tag] [data-id=ALL]', wrap).removeClass("bh-active");
                $('[data-name=tag] [data-id='+ window.sessionStorage.getItem("filter_tag") +']', wrap).addClass("bh-active");
            }

            //获取已存在的筛选条件 "状态"
            if(window.sessionStorage.getItem("filter_state") == null){
                $('[data-name=state] [data-id=ALL]', wrap).addClass("bh-active");

            }else if(window.sessionStorage.getItem("filter_state") != "") {
                $('[data-name=state] [data-id=ALL]', wrap).removeClass("bh-active");
                $('[data-name=state] [data-id='+ window.sessionStorage.getItem("filter_state") +']', wrap).addClass("bh-active");
            }

            //获取已存在的筛选条件 "展现类型"
            if(window.sessionStorage.getItem("filter_displayType") == null){
                $('[data-name=displayType] [data-id=ALL]', wrap).addClass("bh-active");

            }else if(window.sessionStorage.getItem("filter_displayType") != "") {
                $('[data-name=displayType] [data-id=ALL]', wrap).removeClass("bh-active");
                $('[data-name=displayType] [data-id='+ window.sessionStorage.getItem("filter_displayType") +']', wrap).addClass("bh-active");
            }
        }
    });
},false);


$('#advancedQueryPlaceholder').on('search', function(e, data, opts){
    //调用表格reload方法
    var Data = JSON.parse(data);
    var filter = {};
    var groupArr = Data.filter(function(v){return v.name == 'group'});
    var stateArr = Data.filter(function(v){return v.name == 'state'});
    var tagArr = Data.filter(function(v){return v.name == 'tag'});
    var sourceArr = Data.filter(function(v){return v.name == 'source'});
    var displayTypeArr = Data.filter(function(v){return v.name == 'displayType'});

    filter.group = groupArr.length > 0 ? groupArr[0].value : "";
    filter.tag = tagArr.length > 0 ? tagArr[0].value : "";
    filter.state = stateArr.length > 0 ? stateArr[0].value : "";
    filter.source = sourceArr.length > 0 ? sourceArr[0].value : "";
    filter.displayType = displayTypeArr.length > 0 ? displayTypeArr[0].value : "";
    filter.title = $('#advancedQueryPlaceholder .bh-advancedQuery-quick-search-wrap input[type=text]').val();
    window.sessionStorage.setItem("filter_title",filter.title);
    window.sessionStorage.setItem("filter_source",filter.source);
    window.sessionStorage.setItem("filter_group",filter.group);
    window.sessionStorage.setItem("filter_tag",filter.tag);
    window.sessionStorage.setItem("filter_state",filter.state);
    window.sessionStorage.setItem("filter_displayType",filter.displayType);

    $("#tableContainer").emapdatatable('reload', filter);
});


//启用    停用
$table.on('click','.turnOnOff',function(){
    if(!$(this).hasClass("disable")){
        var contentId = $(this).parent().data("id");
        var requestState = ($(this).text() == "启用") ? 1 : 2;
        var tmp = {
            "contentId": contentId,
            "requestState": requestState //true请求启用    false请求停用
        };
        wisAjax(rootPath+interfaceDef.contentManage.turnOnOff,tmp,function(data){
            if(data.status == "success"){
                 $table.emapdatatable('reload', {
                     "title":window.sessionStorage.getItem("filter_title"),
                     "source":window.sessionStorage.getItem("filter_source"),
                     "group":window.sessionStorage.getItem("filter_group"),
                     "tag":window.sessionStorage.getItem("filter_tag"),
                     "state":window.sessionStorage.getItem("filter_state"),
                     "displayType":window.sessionStorage.getItem("filter_displayType")

                 });
            }else{
                $.bhDialog({
                    title:'操作失败',
                    content:'启用失败!错误原因:'+data.errorMsg,
                    width:464,
                    //height:400,
                    className:'bh-dialog-text',
                    buttons:[{text:'好的',className:'bh-btn-primary'}]
                });
            }
        });
    }
});

//批量启用
$(".add-btn-box").on('click','a#batchTurnOn',function(){
    //选中的内容个数
    var num =  $table.find("input[type=checkbox]:checked:not(.selectFlag)").length;
    BH_UTILS.bhDialogWarning({
        title: '启用',
        content: '确定启用这' + num + '条内容?',
        buttons:[
            {
                text:'确定',
                className:'bh-btn-warning',
                callback:function(){
                    //选中的内容id组成字符串,用逗号隔开
                    var contentIds =  $table.find("input[type=checkbox]:checked:not(.selectFlag)").closest('tr').find('div.operation').map(function () {
                        return $(this).data("id");
                    }).get().join(",");
                    wisAjax(rootPath+interfaceDef.contentManage.turnOnOff,
                        {
                            "contentId": contentIds,
                            "requestState": "1"
                        },
                        function(data){
                        if(data.status == "success"){
                            $table.emapdatatable('reload', {
                                "title":window.sessionStorage.getItem("filter_title"),
                                "source":window.sessionStorage.getItem("filter_source"),
                                "group":window.sessionStorage.getItem("filter_group"),
                                "tag":window.sessionStorage.getItem("filter_tag"),
                                "state":window.sessionStorage.getItem("filter_state"),
                                "displayType":window.sessionStorage.getItem("filter_displayType")
                            });
                            BH_UTILS.bhDialogSuccess({
                                title: '操作成功',
                                content:'启用成功!'
                            });
                        }else{
                            $.bhDialog({
                                title:'操作失败',
                                content:'启用失败!错误原因:'+data.errorMsg,
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

//批量停用
$(".add-btn-box").on('click','a#batchTurnOff',function(){
    //选中的内容个数
    var num =  $table.find("input[type=checkbox]:checked:not(.selectFlag)").length;
    BH_UTILS.bhDialogWarning({
        title: '启用',
        content: '确定停用这' + num + '条内容?',
        buttons:[
            {
                text:'确定',
                className:'bh-btn-warning',
                callback:function(){
                    //选中的内容id组成字符串,用逗号隔开
                    var contentIds =  $table.find("input[type=checkbox]:checked:not(.selectFlag)").closest('tr').find('div.operation').map(function () {
                        return $(this).data("id");
                    }).get().join(",");
                    wisAjax(rootPath+interfaceDef.contentManage.turnOnOff,
                        {
                            "contentId": contentIds,
                            "requestState": "2"
                        },
                        function(data){
                            if(data.status == "success"){
                                $table.emapdatatable('reload', {
                                    "title":window.sessionStorage.getItem("filter_title"),
                                    "source":window.sessionStorage.getItem("filter_source"),
                                    "group":window.sessionStorage.getItem("filter_group"),
                                    "tag":window.sessionStorage.getItem("filter_tag"),
                                    "state":window.sessionStorage.getItem("filter_state"),
                                    "displayType":window.sessionStorage.getItem("filter_displayType")
                                });
                                BH_UTILS.bhDialogSuccess({
                                    title: '操作成功',
                                    content:'停用成功!'
                                });
                            }else{
                                $.bhDialog({
                                    title:'操作失败',
                                    content:'停用失败!错误原因:'+data.errorMsg,
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

//编辑
$table.on('click','.edit',function(){
    if(!$(this).hasClass("disable")) {
        var contentId = $(this).parent().data("id");
        window.open("editContent_new.html?contentId=" + contentId);
    }
});

//删除
$table.on('click','.delete',function(){
    if(!$(this).hasClass("disable")) {
        var contentId = $(this).parent().data("id");
        BH_UTILS.bhDialogWarning({
            title: '删除',
            content: '确定删除标题为"' + $(this).data("title") + '"的资讯?',
            buttons: [
                {
                    text: '确定',
                    className: 'bh-btn-warning',
                    callback: function () {
                        var tmp = {
                            "contentId": contentId
                        };
                        wisAjax(rootPath+interfaceDef.contentManage.delete, tmp, function (data) {
                            if (data.status == "success") {
                                $table.emapdatatable('reload', {
                                    "title":window.sessionStorage.getItem("filter_title"),
                                    "source":window.sessionStorage.getItem("filter_source"),
                                    "group":window.sessionStorage.getItem("filter_group"),
                                    "tag":window.sessionStorage.getItem("filter_tag"),
                                    "state":window.sessionStorage.getItem("filter_state"),
                                    "displayType":window.sessionStorage.getItem("filter_displayType")
                                });
                                BH_UTILS.bhDialogSuccess({
                                    title: '操作成功',
                                    content:'删除成功!'
                                });
                            }else{
                                $.bhDialog({
                                    title:'操作失败',
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
                    text: '取消',
                    className: 'bh-btn-default'
                }
            ]
        });
    }
});

//批量删除
$(".add-btn-box").on('click','a#batchDelete',function(){
    //选中的内容个数
    var num =  $table.find("input[type=checkbox]:checked:not(.selectFlag)").length;
    BH_UTILS.bhDialogWarning({
        title: '删除',
        content: '确定删除这' + num + '条内容?',
        buttons:[
            {
                text:'确定',
                className:'bh-btn-warning',
                callback:function(){
                    //选中的内容id组成字符串,用逗号隔开
                    var contentIds =  $table.find("input[type=checkbox]:checked:not(.selectFlag)").closest('tr').find('div.operation').map(function () {
                        return $(this).data("id");
                    }).get().join(",");
                    wisAjax(rootPath+interfaceDef.contentManage.delete,{"contentId":contentIds},function(data){
                        if(data.status == "success"){
                            $table.emapdatatable('reload', {
                                "title":window.sessionStorage.getItem("filter_title"),
                                "source":window.sessionStorage.getItem("filter_source"),
                                "group":window.sessionStorage.getItem("filter_group"),
                                "tag":window.sessionStorage.getItem("filter_tag"),
                                "state":window.sessionStorage.getItem("filter_state"),
                                "displayType":window.sessionStorage.getItem("filter_displayType")
                            });
                            BH_UTILS.bhDialogSuccess({
                                title: '操作成功',
                                content:'删除成功!'
                            });
                        }else{
                            $.bhDialog({
                                title:'操作失败',
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
