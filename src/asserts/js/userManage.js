/**
 * Created by zhouchen on 16/5/31.
 */

var datamodel = '';
var $table = $('#tableContainer');

//获取表格模型
wisAjax2(interfaceDef.model,"",function(data){
    datamodel = data.models[11].controls;
},false);

//插件选项设置
var options = {
    sortable: false,
    colHasMinWidth: false,
    url: rootPath+interfaceDef.userManage.userList,
    //pagePath: pagePath,
    datamodel: datamodel,//必须 需要展示的数据列
    action: 'userList',//必须
    method: 'GET',//可选，默认'POST'//对接后台接口时请改为POST
    pageable: true,//可选，默认true
    params:{
        "userName":window.sessionStorage.getItem("filter_userName"),
        "isAnonymousUser":window.sessionStorage.getItem("filter_isAnonymousUser"),
        "userStatus":window.sessionStorage.getItem("filter_userStatus"),
        "userTag":window.sessionStorage.getItem("filter_userTag")
    },
    customColumns: [//数组项如果有colIndex字段，则必须按照该字段从小到大顺序排列
    ]
};
$table.emapdatatable(options);
//$("#retirementInfoTable").emapdatatable('reload', {querySetting: JSON.stringify(data)});

//获取高级搜索模型
var searchData;
wisAjax2(interfaceDef.userManage.advencedQueryModel,"",function(data){
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
            //获取已存的筛选条件 "用户名"
            $('#advancedQueryPlaceholder .bh-advancedQuery-quick-search-wrap input[type=text]').val(window.sessionStorage.getItem("filter_userName"));

            //获取已存的筛选条件 "是否匿名"
            if(window.sessionStorage.getItem("filter_isAnonymousUser") == null){
                $('[data-name=isAnonymousUser] [data-id=ALL]', wrap).addClass("bh-active");
            }else if(window.sessionStorage.getItem("filter_isAnonymousUser") != ""){
                $('[data-name=isAnonymousUser] [data-id=ALL]', wrap).removeClass("bh-active");
                $('[data-name=isAnonymousUser] [data-id='+ window.sessionStorage.getItem("filter_isAnonymousUser") +']', wrap).addClass("bh-active");
            }

            //获取已存的筛选条件 "状态"
            if(window.sessionStorage.getItem("filter_userStatus") == null){
                $('[data-name=userStatus] [data-id=ALL]', wrap).addClass("bh-active");
            }else if(window.sessionStorage.getItem("filter_userStatus") != ""){
                $('[data-name=userStatus] [data-id=ALL]', wrap).removeClass("bh-active");
                $('[data-name=userStatus] [data-id='+ window.sessionStorage.getItem("filter_userStatus") +']', wrap).addClass("bh-active");
            }

            //获取已存的筛选条件 "用户标签"
            if(window.sessionStorage.getItem("filter_userTag") == null){
                $('[data-name=userTag] [data-id=ALL]', wrap).addClass("bh-active");
            }else if(window.sessionStorage.getItem("filter_userTag") != ""){
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
    var userStatusArr = Data.filter(function(v){return v.name == 'userStatus'});
    var userTagArr = Data.filter(function(v){return v.name == 'userTag'});
    var isAnonymousUserArr = Data.filter(function(v){return v.name == 'isAnonymousUser'});


    filter.isAnonymousUser = isAnonymousUserArr.length > 0 ? isAnonymousUserArr[0].value : "";
    filter.userTag = userTagArr.length > 0 ? userTagArr[0].value : "";
    filter.userStatus = userStatusArr.length > 0 ? userStatusArr[0].value : "";

    filter.userName = $('#advancedQueryPlaceholder .bh-advancedQuery-quick-search-wrap input[type=text]').val();

    window.sessionStorage.setItem("filter_isAnonymousUser",filter.isAnonymousUser);
    window.sessionStorage.setItem("filter_userTag",filter.userTag);
    window.sessionStorage.setItem("filter_userStatus",filter.userStatus);
    window.sessionStorage.setItem("filter_userName",filter.userName);


    $("#tableContainer").emapdatatable('reload', filter);
});

