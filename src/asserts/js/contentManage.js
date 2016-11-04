/**
 * Created by zhouchen on 16/3/16.
 */

var datamodel;
var $table = $('#tableContainer');


//获取表格模型
wisAjax2(interfaceDef.model,"",function(data){
    datamodel = data.models[0].controls;
},false);

//插件选项设置
var options = {
    sortable: true,
    colHasMinWidth: false,
    url: rootPath + "/v1/feeds/manage_list",//url和pagePath二选一
    //pagePath: pagePath,
    datamodel: datamodel,//必须 需要展示的数据列
    action: 'contentList',//必须
    method: 'GET',//可选，默认'POST'//对接后台接口时请改为POST
    pageable: true,//可选，默认true
    params:{
        "source":window.sessionStorage.getItem("filter_source"),
        "category":window.sessionStorage.getItem("filter_category"),
        "state":window.sessionStorage.getItem("filter_state"),
        "userTag":window.sessionStorage.getItem("filter_userTag"),
        "title":window.sessionStorage.getItem("filter_title")

    },
    customColumns: [//数组项如果有colIndex字段，则必须按照该字段从小到大顺序排列
        {
            colField: 'UUID',
            type: 'tpl',
            column: {sortable: false}
        },
        {
            colField: 'title',
            type: 'tpl',
            column: {
                sortable: false,
                cellsRenderer: function (row, column, value, rowData) {
                    return '<a href="'+ rootPath + rowData.contentHtmlUrl +'" target="_blank">'+ rowData.title +'</a>';
                }
            }
        },
        {
            colField: 'contentHtmlUrl',
            type: 'tpl',
            column: {sortable: false}
        },
        {
            colField: 'originTime',
            type: 'tpl',
            column: {
                sortable: true,
                cellsRenderer: function (row, column, value, rowData){
                    var date = rowData.originTime.substring(0,10);
                    var time = rowData.originTime.substring(11,16);
                    return date+ " " +time;
                }
            }
        },
        {
            colField: 'readNum',
            type: 'tpl',
            column: {sortable: true}
        },
        {
            colField: 'source',
            type: 'tpl',
            column: {sortable: false}
        },
        {
            colField: 'category',
            type: 'tpl',
            column: {sortable: false}
        },
        {
            colField: 'displayType',
            type: 'tpl',
            column: {sortable: false}
        },
        {
            colField: "homeRecommend",
            type: 'tpl',
            column: {
                sortable: false,
                cellsRenderer: function (row, column, value, rowData) {
                    return (rowData.homeRecommend == true) ? "是" : "否";
                }
            }
        },
        {
            colField: 'state',
            type: 'tpl',
            column: {
                sortable: false,
                cellsRenderer: function (row, column, value, rowData) {
                    return (rowData.state == true) ? "启用" : "停用";

                }
            }
        },
        {
            colIndex: 'last',
            type: 'tpl',
            width: '14%',
            column: {
                sortable: false,
                text: '操作',
                cellsRenderer: function(row, column, value, rowData){
                    var turnOnOffCss = '',
                        turnOnOff = '启用',
                        homeRecommendCss = '',
                        homeRecommend = '推头条',
                        operationCss = 'gray disable',
                        operation = '';
                    if(rowData.state == false){//未启用时
                        homeRecommendCss = 'gray disable';
                        operationCss = '';
                    }else if(rowData.state == true && rowData.homeRecommend == true){//已启用且已推头条
                        turnOnOffCss = 'gray disable';
                        turnOnOff = '停用';
                        homeRecommendCss = '';
                        homeRecommend ='取消头条';
                    }else if(rowData.state == true && rowData.homeRecommend == false){//已启用但未推头条
                        turnOnOff = '停用';
                    }
                    operation = '<div data-id="'+ rowData.UUID +'">'+
                                    '<a href="javascript:void(0)" class="turnOnOff mrg-rg '+ turnOnOffCss +'">'+ turnOnOff +'</a>' +
                                    '<a href="javascript:void(0)" class="homeRecommend mrg-rg '+ homeRecommendCss +'">'+ homeRecommend +'</a>' +
                                    '<a href="javascript:void(0)" class="edit mrg-rg '+ operationCss +'">维护</a>' +
                                    '<a href="javascript:void(0)" data-title="'+ rowData.title +'" class="delete mrg-rg '+ operationCss +'">删除</a>' +
                                '</div>';
                    return operation;
                }
            }

        }
    ]
};
$table.emapdatatable(options);

//获取高级搜索模型
var searchData;
wisAjax2("../data/advencedQueryModel.json","",function(data){
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
            //获取已存的筛选条件 "标题"
            $('#advancedQueryPlaceholder .bh-advancedQuery-quick-search-wrap input[type=text]').val(window.sessionStorage.getItem("filter_title"));

            //获取已存的筛选条件 "分类"
            if(window.sessionStorage.getItem("filter_category") == null){
                $('[data-name=category] [data-id=ALL]', wrap).addClass("bh-active");
            }else if(window.sessionStorage.getItem("filter_category") != ""){
                $('[data-name=category] [data-id=ALL]', wrap).removeClass("bh-active");
                $('[data-name=category] [data-id='+ window.sessionStorage.getItem("filter_category") +']', wrap).addClass("bh-active");
            }

            //获取已存的筛选条件 "来源"
            if(window.sessionStorage.getItem("filter_source") == null){
                $('[data-name=source] [data-id=ALL]', wrap).addClass("bh-active");

            }else if(window.sessionStorage.getItem("filter_source") != "") {
                $('[data-name=source] [data-id=ALL]', wrap).removeClass("bh-active");
                $('[data-name=source] [data-id='+ window.sessionStorage.getItem("filter_source") +']', wrap).addClass("bh-active");
            }

            //获取已存的筛选条件 "状态"
            if(window.sessionStorage.getItem("filter_state") == null){
                $('[data-name=state] [data-id=ALL]', wrap).addClass("bh-active");

            }else if(window.sessionStorage.getItem("filter_state") != "") {
                $('[data-name=state] [data-id=ALL]', wrap).removeClass("bh-active");
                $('[data-name=state] [data-id='+ window.sessionStorage.getItem("filter_state") +']', wrap).addClass("bh-active");
            }

            //获取已存的筛选条件 "用户标签"
            if(window.sessionStorage.getItem("filter_userTag") == null){
                $('[data-name=userTag] [data-id=ALL]', wrap).addClass("bh-active");

            }else if(window.sessionStorage.getItem("filter_userTag") != "") {
                $('[data-name=userTag] [data-id=ALL]', wrap).removeClass("bh-active");
                $('[data-name=userTag] [data-id='+ window.sessionStorage.getItem("filter_userTag") +']', wrap).addClass("bh-active");
            }

        }
    });
},false);


$('#advancedQueryPlaceholder').on('search', function(e, data, opts){
    //调用表格reload方法
    var Data = JSON.parse(data);
    var filter = {};
    var sourceArr = Data.filter(function(v){return v.name == 'source'});
    var categoryArr = Data.filter(function(v){return v.name == 'category'});
    var stateArr = Data.filter(function(v){return v.name == 'state'});
    var userTagArr = Data.filter(function(v){return v.name == 'userTag'});

    filter.source = sourceArr.length > 0 ?sourceArr[0].value : "";
    filter.category = categoryArr.length > 0 ? categoryArr[0].value : "";
    filter.state = stateArr.length > 0 ? stateArr[0].value : "";
    filter.userTag = userTagArr.length > 0 ? userTagArr[0].value : "";
    filter.title = $('#advancedQueryPlaceholder .bh-advancedQuery-quick-search-wrap input[type=text]').val();
    window.sessionStorage.setItem("filter_source",filter.source);
    window.sessionStorage.setItem("filter_category",filter.category);
    window.sessionStorage.setItem("filter_state",filter.state);
    window.sessionStorage.setItem("filter_title",filter.title);
    window.sessionStorage.setItem("filter_userTag",filter.userTag);

    $("#tableContainer").emapdatatable('reload', filter);
});


//启用    停用
$table.on('click','.turnOnOff',function(){
    if(!$(this).hasClass("disable")){
        var contentId = $(this).parent().data("id");
        var requestState = ($(this).text() == "启用") ? true : false;
        var tmp = {
            "contentId": contentId,
            "requestState": requestState //true请求启用    false请求停用
        };
        wisAjax2(rootPath+"/v1/feeds/validity",tmp,function(data){
            if(data.status == "success"){
                 $table.emapdatatable('reload', {
                     "userTag":window.sessionStorage.getItem("filter_userTag"),
                     "source":window.sessionStorage.getItem("filter_source"),
                     "category":window.sessionStorage.getItem("filter_category"),
                     "state":window.sessionStorage.getItem("filter_state"),
                     "title":window.sessionStorage.getItem("filter_title")
                 });
            }
        });
    }
});

//推头条   取消头条
$table.on('click','.homeRecommend',function(){
    if(!$(this).hasClass("disable")){
        var contentId = $(this).parent().data("id");
        var requestState = ($(this).text() == "推头条") ? true : false;
        var tmp = {
            "contentId": contentId,
            "requestState": requestState //true请求启用    false请求停用
        };
        wisAjax2(rootPath+"/v1/feeds/recommendation",tmp,function(data){
            if(data.status == "success"){
                $table.emapdatatable('reload', {
                    "userTag":window.sessionStorage.getItem("filter_userTag"),
                    "source":window.sessionStorage.getItem("filter_source"),
                    "category":window.sessionStorage.getItem("filter_category"),
                    "state":window.sessionStorage.getItem("filter_state"),
                    "title":window.sessionStorage.getItem("filter_title")
                });
            }
        });
    }
});

//维护
$table.on('click','.edit',function(){
    if(!$(this).hasClass("disable")) {
        var contentId = $(this).parent().data("id");
        window.open("editContent.html?contentId=" + contentId);
    }
});

//删除
$table.on('click','.delete',function(){
    if(!$(this).hasClass("disable")) {
        var contentId = $(this).parent().data("id");
        BH_UTILS.bhDialogWarning({
            title: '这是一条警告信息',
            content: '确定删除标题为"' + $(this).data("title") + '"的资讯?',
            buttons: [
                {
                    text: '确定',
                    className: 'bh-btn-warning',
                    callback: function () {
                        var tmp = {
                            "contentId": contentId
                        };
                        wisAjax(rootPath + "/v1/feeds/deletion/" + contentId, tmp, function (data) {
                            if (data.status == "success") {
                                $table.emapdatatable('reload', {
                                    "userTag": window.sessionStorage.getItem("filter_userTag"),
                                    "source": window.sessionStorage.getItem("filter_source"),
                                    "category": window.sessionStorage.getItem("filter_category"),
                                    "state": window.sessionStorage.getItem("filter_state"),
                                    "title": window.sessionStorage.getItem("filter_title")
                                });
                                BH_UTILS.bhDialogSuccess({
                                    title: '删除成功!'
                                    //content:'删除成功!'
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


