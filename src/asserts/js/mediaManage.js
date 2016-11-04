/**
 * Created by zhouchen on 16/3/16.
 */

var datamodel;
var $table = $('#tableContainer');
var hasGrab = false;

//获取表格模型
wisAjax2(interfaceDef.model,"",function(data){
    datamodel = data.models[1].controls;
},false);

//插件选项设置
var options = {
    sortable: false,
    colHasMinWidth: false,
    url: rootPath + "/v1/medias/manage_list",//url和pagePath二选一
    //pagePath: pagePath,
    datamodel: datamodel,//必须 需要展示的数据列
    action: 'mediaList',//必须
    method: 'GET',//可选，默认'POST'//对接后台接口时请改为POST
    pageable: true,//可选，默认true
    params:{
        "sourceType":window.sessionStorage.getItem("filter_sourceType"),
        "mediaInfo":window.sessionStorage.getItem("filter_mediaInfo")
    },
    customColumns: [//数组项如果有colIndex字段，则必须按照该字段从小到大顺序排列
        {
            colField:'headPhoto',
            type:'tpl',
            column: {
                cellsRenderer: function (row, column, value, rowData) {
                    return '<img style="width:43px;height:43px;" src="'+ rootPath + rowData.headPhoto +'"/>';
                }
            }
        },
        {
            colField: 'crawlerState',
            type: 'tpl',
            column: {
                cellsRenderer: function(row, column, value, rowData) {
                    if(rowData.crawlerState == '抓取中'){
                        hasGrab = true;
                    }
                    return rowData.sourceType == "微信公众号" ? rowData.crawlerState : "暂不可用";
                }
            }
        },
        {
            colIndex: 'last',
            type: 'tpl',
            width: '15%',
            column: {
                text: '操作',
                cellsRenderer: function(row, column, value, rowData){
                    var sourceType = rowData.sourceType,
                        updateState = '',
                        updateOperation = '更新内容',
                        operation = '<div data-id="'+ rowData.mediaUUId +'">'+
                                        '<a href="javascript:void(0)" class="edit mrg-rg">编辑</a>' +
                                        '<a href="javascript:void(0)" data-name="'+ rowData.mediaName +'" class="delete mrg-rg">删除</a>' +
                                    '</div>';
                    if(sourceType == "微信公众号"){
                        if(rowData.crawlerState == "抓取中") {
                            updateState = 'gray disable';
                        }else if(rowData.crawlerState == "抓取结束"){
                            updateState = '';
                            updateOperation = '继续抓取';
                        }
                        operation = '<div class="mediaBox" data-id="'+ rowData.mediaUUId +'">'+
                                '<a href="javascript:void(0)" class="edit mrg-rg">编辑</a>' +
                                '<a href="javascript:void(0)" data-id="'+ rowData.wxId +'" data-category="'+ rowData.categoryId +'" class="update mrg-rg '+ updateState +'">'+ updateOperation +'</a>' +
                                '<a href="javascript:void(0)" data-name="'+ rowData.mediaName +'" class="delete mrg-rg">删除</a>' +
                            '</div>';
                    }

                    return operation;
                }
            }
        }
    ],
    rendered: function () {
        wisAjax2(rootPath + "/v1/rawlers_status","",function(data){
            if(data.status == "success"){
                if(data.grabState){
                    $(".mediaBox a.update").addClass("gray disable");
                    $("#grabAll").attr("disabled",true);
                }
            }
        });
    }
};
$table.emapdatatable(options);
//$("#retirementInfoTable").emapdatatable('reload', {querySetting: JSON.stringify(data)});


//获取高级搜索模型
var searchData;
wisAjax2("../data/advencedQueryModel_source.json","",function(data){
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
            $('#advancedQueryPlaceholder .bh-advancedQuery-quick-search-wrap input[type=text]').val(window.sessionStorage.getItem("filter_mediaInfo"));
            if(window.sessionStorage.getItem("filter_sourceType") == null){
                $('[data-name=sourceType] [data-id=ALL]', wrap).addClass("bh-active");
            }else if(window.sessionStorage.getItem("filter_sourceType") != "") {
                $('[data-name=sourceType] [data-id=ALL]', wrap).removeClass("bh-active");
                $('[data-name=sourceType] [data-id='+ window.sessionStorage.getItem("filter_sourceType") +']', wrap).addClass("bh-active");
            }

        }
    });
},false);

$('#advancedQueryPlaceholder').on('search', function(e, data, opts){
    //调用表格reload方法
    var Data = JSON.parse(data);
    var filter = {};
    var sourceArr = Data.filter(function(v){return v.name == 'sourceType'});
    filter.sourceType = sourceArr.length > 0 ?sourceArr[0].value : "";
    filter.mediaInfo = $('#advancedQueryPlaceholder .bh-advancedQuery-quick-search-wrap input[type=text]').val();

    window.sessionStorage.setItem("filter_sourceType",filter.sourceType);
    window.sessionStorage.setItem("filter_mediaInfo",filter.mediaInfo);

    $("#tableContainer").emapdatatable('reload', filter);
});

//编辑
$table.on('click','.edit',function(){
    var mediaUUID = $(this).parent().data("id");
    window.open("editMedia.html?mediaUUID="+mediaUUID);
});

//更新内容   继续抓取
$table.on('click','.update',function(){
    if(!$(this).hasClass("disable")){
        var id = $(this).parent().data("id"),
            wxId = $(this).data("id"),
            categoryId = $(this).data("category");
        BH_UTILS.bhWindow(
            '<div id="submitInfoFormContainer">' +
                '<div class="bh-form-group">' +
                    '<label class="bh-form-label bh-form-h-label bh-pull-left" title="抓取条数">抓取条数</label>' +
                    '<div class="bh-ph-8" style="margin-left: 115px;">' +
                        '<select id="limit">' +
                            '<option>10</option>'+
                            '<option>5</option>'+
                        '</select>'+
                        //'<input class="bh-form-control jqx-widget-content jqx-input jqx-widget jqx-rc-all" id="limit" style="width: 100%;">' +
                    '</div>' +
                '</div>'+
                '<div style="color: red;padding-top: 10px;margin-left: 123px;font-size: 14px;">一次只能启动一个爬虫抓取一个公众号!</div>'+
            '</div>',
            '启动爬虫',//弹框的title
            undefined, //默认的按钮配置
            {
                height: 215
            },
            function($dom){
                var limit = parseInt($("#limit").val()),
                    tmp = {
                        "id": id,
                        "wxId": wxId,
                        "limit": limit,
                        "tag": categoryId,
                        "url": ""
                    };
                $(this).find('button.bh-btn').attr("disabled",true);
                $(this).find('button.bh-btn-primary').html("启动中...");
                $.ajax({
                    type: 'POST',
                    async: true,
                    url: rootPath + "/v1/rawlerexe",
                    data: tmp,
                    dataType: "json",
                    success: function (data) {
                        if(data.status == "success"){
                            setTimeout(function(){
                                $dom.jqxWindow('destroy');
                                $table.emapdatatable('reload', {
                                    "sourceType":window.sessionStorage.getItem("filter_sourceType"),
                                    "mediaInfo":window.sessionStorage.getItem("filter_mediaInfo")
                                });
                            },2000);
                        }
                    },
                    error: function () {
                        $dom.jqxWindow('destroy');
                        $.bhDialog({
                            title:'请求错误',
                            //content:'',
                            width:464,
                            //height:400,
                            className:'bh-dialog-text',
                            buttons:[{text:'好的',className:'bh-btn-primary'}]
                        });
                    }
                });

                //wisAjax(rootPath + "/v1/rawlerexe",tmp,function(data){
                //    if(data.status == "success"){
                //        $(this).find('button.bh-btn').attr("disabled",true);
                //        $(this).find('button.bh-btn-primary').html("启动中...");
                //        setTimeout(function(){
                //            $dom.jqxWindow('destroy');
                //            $table.emapdatatable('reload', {
                //                "sourceType":window.sessionStorage.getItem("filter_sourceType")
                //            });
                //        },2000);
                //    }
                //},false);

                return false;

            }
        );
    }else{
        //BH_UTILS.bhDialogDanger({
        //    title:'爬虫正在抓取中,请耐心等待!'
        //    //content:''
        //});
        $.bhDialog({
            title:'爬虫正在抓取中,请耐心等待!',
            //content:'',
            width:464,
            //height:400,
            className:'bh-dialog-text',
            buttons:[{text:'好的',className:'bh-btn-primary'}]
        });
    }
});

//删除
$table.on('click','.delete',function(){
    var mediaUUID = $(this).parent().data("id");
    BH_UTILS.bhDialogWarning({
        title:'确定删除名为"'+ $(this).data("name") +'"的媒体号?',
        //content:,
        buttons:[
            {
                text:'确定',
                className:'bh-btn-warning',
                callback:function(){
                    var tmp = {
                        "mediaUUID": mediaUUID
                    };
                    wisAjax(rootPath+"/v1/medias/deletion/"+mediaUUID,tmp,function(data){
                        if(data.status == "success"){
                            $table.emapdatatable('reload', {
                                "sourceType":window.sessionStorage.getItem("filter_sourceType"),
                                "mediaInfo":window.sessionStorage.getItem("filter_mediaInfo")
                            });
                            BH_UTILS.bhDialogSuccess({
                                title:'删除成功!'
                                //content:'删除成功!'
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
    //var deleteConfirm = confirm("确定删除名称为\""+ $(this).data("name") +"\"的媒体号?");
    //if(deleteConfirm){
    //    var tmp = {
    //        "mediaUUID": mediaUUID
    //    };
    //    wisAjax(rootPath+"/v1/medias/deletion/"+mediaUUID,tmp,function(data){
    //        if(data.status == "success"){
    //            $table.emapdatatable('reload', {
    //                "sourceType":window.sessionStorage.getItem("filter_sourceType")
    //            });
    //            alert("删除成功");
    //        }
    //    });
    //}
});

//一键抓取
$(".add-btn-box").on("click","a#grabAll",function () {
    if($("#grabAll").attr("disabled")!="disabled"){
        wisAjax(rootPath+"/v1/rawlerexe_all","",function (data) {
            if(data.status == "success"){
                BH_UTILS.bhDialogSuccess({
                    title:'一键抓取启动成功!请耐心等待'
                });
                $table.emapdatatable('reload', {
                    "sourceType":window.sessionStorage.getItem("filter_sourceType"),
                    "mediaInfo":window.sessionStorage.getItem("filter_mediaInfo")
                });
            }
        });
    }
});
