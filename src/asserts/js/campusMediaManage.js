/**
 * Created by zhouchen on 16/5/18.
 */

var datamodel = '';
var $table = $('#tableContainer');

//获取表格模型
wisAjax2(interfaceDef.model,"",function(data){
    datamodel = data.models[8].controls;
},false);

wisAjax2(rootPath+interfaceDef.campusMediaManage.grabStatus,"",function(data){
    if(!data.grabState){
        $("#grabAll").removeClass('disable');
        $("#grabAll").attr('disabled',false);
    }
},false);


//插件选项设置
var options = {
    sortable: false,
    colHasMinWidth: false,
    url:rootPath+interfaceDef.campusMediaManage.campusMediaList,
    //pagePath: pagePath,
    datamodel: datamodel,//必须 需要展示的数据列
    action: 'campusMediaList',//必须
    method: 'GET',//可选，默认'POST'//对接后台接口时请改为POST
    pageable: true,//可选，默认true
    params:{
        "campusMediaName":window.sessionStorage.getItem("filter_campusMediaName"),
        "sourceType":window.sessionStorage.getItem("filter_sourceType"),
        "organizationType":window.sessionStorage.getItem("filter_organizationType")
    },
    customColumns: [//数组项如果有colIndex字段，则必须按照该字段从小到大顺序排列
        {colIndex: 0, type: 'checkbox'},
        {
            colField:'campusMediaLogo',
            type:'tpl',
            column: {
                cellsRenderer: function (row, column, value, rowData) {
                    return '<img style="width:43px;height:43px;" src="'+ rowData.campusMediaLogo +'"/>';
                }
            }
        },
        {
            colField:'college',
            type:'tpl',
            column: {
                cellsRenderer: function (row, column, value, rowData) {
                    return (rowData.college == '')?'无':rowData.college;
                }
            }
        },
        {
            colField:'sourceType',
            type:'tpl',
            column: {
                cellsRenderer: function (row, column, value, rowData) {
                    return '<div class="sourceType">'+ rowData.sourceType +'</div>';
                }
            }
        },
        {
            colField:'crawlerState',
            type:'tpl',
            column: {
                cellsRenderer: function (row, column, value, rowData) {
                    return '<div class="crawlerState">'+ rowData.crawlerState +'</div>';
                }
            }
        },
        {
            colIndex: 'last',
            type: 'tpl',
            width: '12.5%',
            column: {
                text: '操作',
                cellsRenderer: function(row, column, value, rowData){
                    var sourceType = rowData.sourceType,
                        updateState = '',
                        updateOperation = '更新内容',
                        operation = '<div data-id="'+ rowData.campusMediaId +'">'+
                            '<a href="javascript:void(0)" class="edit mrg-rg">编辑</a>' +
                            '<a href="javascript:void(0)" data-name="'+ rowData.campusMediaName +'" class="delete mrg-rg">删除</a>' +
                            '</div>';
                    if(sourceType == "微信" || sourceType == "网站"){
                        if(rowData.crawlerState == "抓取中") {
                            updateState = 'gray disable';
                        }else if(rowData.crawlerState == "抓取结束"){
                            updateState = '';
                            updateOperation = '继续抓取';
                        }
                        var sourceTypeCss = '';
                        if(sourceType == "网站"){
                            sourceTypeCss = 'webMediaBox'
                        }else if(sourceType == "微信"){
                            sourceTypeCss = 'mediaBox'
                        }
                        operation = '<div class="'+ sourceTypeCss +'" data-id="'+ rowData.campusMediaId +'" data-source="'+ rowData.source +'" data-state="'+ rowData.crawlerState +'">'+
                            '<a href="javascript:void(0)" class="edit mrg-rg">编辑</a>' +
                            '<a href="javascript:void(0)" class="update mrg-rg '+ updateState +'">'+ updateOperation +'</a>' +
                            '<a href="javascript:void(0)" data-name="'+ rowData.campusMediaName +'" class="delete mrg-rg">删除</a>' +
                            '</div>';
                    }
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
        //批量抓取
        $("#batchGrab").removeClass('disable');
        $("#batchGrab").attr('disabled',false);
        //批量终止
        $("#batchStop").removeClass('disable');
        $("#batchStop").attr('disabled',false);
    }else{
        //批量抓取
        $("#batchGrab").addClass('disable');
        $("#batchGrab").attr('disabled',true);
        //批量终止
        $("#batchStop").addClass('disable');
        $("#batchStop").attr('disabled',true);
    }
});

//勾选内容时,启用批量抓取操作按钮
$table.on('change','input[type=checkbox]',function () {
    if($table.find("input[type=checkbox]:checked").length != 0){
        $("#batchGrab").removeClass('disable');
        $("#batchGrab").attr('disabled',false);
        //批量终止
        $("#batchStop").removeClass('disable');
        $("#batchStop").attr('disabled',false);
    }else{
        $("#batchGrab").addClass('disable');
        $("#batchGrab").attr('disabled',true);
        //批量终止
        $("#batchStop").addClass('disable');
        $("#batchStop").attr('disabled',true);
    }


});

//获取高级搜索模型
var searchData;
wisAjax2(interfaceDef.campusMediaManage.advencedQueryModel,"",function(data){
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
            //获取已存的筛选条件 "校园号名称"
            $('#advancedQueryPlaceholder .bh-advancedQuery-quick-search-wrap input[type=text]').val(window.sessionStorage.getItem("filter_campusMediaName"));

            //获取已存的筛选条件 "校园号类型"
            if(window.sessionStorage.getItem("filter_sourceType") == null){
                $('[data-name=sourceType] [data-id=ALL]', wrap).addClass("bh-active");
            }else if(window.sessionStorage.getItem("filter_sourceType") != ""){
                $('[data-name=sourceType] [data-id=ALL]', wrap).removeClass("bh-active");
                $('[data-name=sourceType] [data-id='+ window.sessionStorage.getItem("filter_sourceType") +']', wrap).addClass("bh-active");
            }
            if(window.sessionStorage.getItem("filter_organizationType") == null){
                $('[data-name=organizationType] [data-id=ALL]', wrap).addClass("bh-active");
            }else if(window.sessionStorage.getItem("filter_organizationType") != ""){
                $('[data-name=organizationType] [data-id=ALL]', wrap).removeClass("bh-active");
                $('[data-name=organizationType] [data-id='+ window.sessionStorage.getItem("filter_organizationType") +']', wrap).addClass("bh-active");
            }
        }
    });
},false);


$('#advancedQueryPlaceholder').on('search', function(e, data, opts){
    //调用表格reload方法
    var Data = JSON.parse(data);
    var filter = {};
    var sourceTypeArr = Data.filter(function(v){return v.name == 'sourceType'});
    var organizationTypeArr = Data.filter(function(v){return v.name == 'organizationType'});

    filter.sourceType = sourceTypeArr.length > 0 ? sourceTypeArr[0].value : "";
    filter.organizationType = organizationTypeArr.length > 0 ? organizationTypeArr[0].value : "";
    filter.campusMediaName = $('#advancedQueryPlaceholder .bh-advancedQuery-quick-search-wrap input[type=text]').val();

    window.sessionStorage.setItem("filter_sourceType",filter.campusMediaName);
    window.sessionStorage.setItem("filter_sourceType",filter.sourceType);
    window.sessionStorage.setItem("filter_organizationType",filter.organizationType);

    $("#tableContainer").emapdatatable('reload', filter);
});

//编辑
$table.on('click','.edit',function(){
    var campusMediaId = $(this).parent().data("id");
    window.open("editCampusMedia.html?campusMediaId="+campusMediaId);
});


//删除
$table.on('click','.delete',function(){
    var campusMediaId = $(this).parent().data("id");
    BH_UTILS.bhDialogWarning({
        title:'确定删除名为"'+ $(this).data("name") +'"的校园号?',
        //content:,
        buttons:[
            {
                text:'确定',
                className:'bh-btn-warning',
                callback:function(){
                    var tmp = {
                        "campusMediaId": campusMediaId
                    };
                    wisAjax(rootPath+interfaceDef.campusMediaManage.delete,tmp,function(data){
                        if(data.status == "success"){
                            $table.emapdatatable('reload', {
                                "campusMediaName":window.sessionStorage.getItem("filter_campusMediaName"),
                                "sourceType":window.sessionStorage.getItem("filter_sourceType"),
                                "organizationType":window.sessionStorage.getItem("filter_organizationType")
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

//批量抓取
$('.add-btn-box').on('click','a#batchGrab',function () {
    //选中的内容个数
    var num = $table.find("input[type=checkbox]:checked:not(.selectFlag)").length;
    var wxNum = $table.find("input[type=checkbox]:checked:not(.selectFlag)").closest('tr').find('div.mediaBox[data-state!=抓取中]').length;
    if(!$(this).hasClass("disable")) {
        if(wxNum == 0){
            BH_UTILS.bhDialogWarning({
                title: '启动爬虫',
                content: '一共选中' + num + '个,可启动的微信爬虫为<b style="font-size: 18px;color: red;">' + wxNum + '</b>个<br><font color="red"><只有微信类型的才可以进行批量抓取哦!><br></只有微信类型的才可以进行批量抓取哦><不要勾选太多哦,一次最多3~4个,不然CPU会被占光哦></font>',
                buttons: [
                    {
                        text: '关闭',
                        className: 'bh-btn-warning'
                    }
                ]
            });
        }else {
            BH_UTILS.bhWindow(
                '<div id="submitInfoFormContainer">' +
                '<div class="bh-form-group" style="margin-bottom: 15px;">' +
                '<label class="bh-form-label bh-form-h-label bh-pull-left" title="可抓取个数">可抓取个数</label>' +
                '<div class="bh-ph-8" style="margin-left: 115px;">' +
                '<div style="line-height: 28px">' + wxNum + '    (  一共选中' + num + '个  )</div>' +
                '</div>' +
                '</div>' +
                '<div class="bh-form-group">' +
                '<label class="bh-form-label bh-form-h-label bh-pull-left" title="抓取条数">抓取条数</label>' +
                '<div class="bh-ph-8" style="margin-left: 115px;">' +
                '<select id="limit">' +
                '<option>10</option>' +
                '<option>5</option>' +
                '</select>' +
                //'<input class="bh-form-control jqx-widget-content jqx-input jqx-widget jqx-rc-all" id="limit" style="width: 100%;">' +
                '</div>' +
                '</div>' +
                '<div style="color: red;padding-top: 5px;margin-left: 123px;font-size: 12px;">只有微信类型的才可以进行批量抓取哦!<br>不要勾选太多哦,一次最多3~4个,不然CPU会被占光哦</div>' +
                '</div>',
                '启动爬虫',//弹框的title
                undefined, //默认的按钮配置
                {
                    height: 270
                },
                function ($dom) {
                    $(this).find('button.bh-btn').attr("disabled", true);
                    $(this).find('button.bh-btn-primary').html("启动中...");
                    //选中的校园号组成数组
                    var medias = [];
                    $table.find("input[type=checkbox]:checked:not(.selectFlag)").closest('tr').find('div.mediaBox[data-state!=抓取中]').each(function () {
                        var $item = $(this);
                        var id = $item.data("id");
                        var wxId = $item.data("source");
                        medias.push({"id": id, "wxId": wxId});
                    });

                    var limit = parseInt($("#limit").val()),
                        tmp = {
                            "params": medias,
                            "limit": limit,
                            "tag": "",
                            "url": ""
                        };
                    $.ajax({
                        type: 'POST',
                        async: true,
                        url: rootPath + interfaceDef.campusMediaManage.grab,
                        data: {"data": JSON.stringify(tmp)},
                        dataType: "json",
                        success: function (data) {
                            if (data.status == "success") {
                                setTimeout(function () {
                                    $dom.jqxWindow('destroy');
                                    $table.emapdatatable('reload', {
                                        "sourceType": window.sessionStorage.getItem("filter_sourceType"),
                                        "mediaInfo": window.sessionStorage.getItem("filter_mediaInfo")
                                    });
                                    // window.location.reload();
                                }, 2000);
                            }
                        },
                        error: function () {
                            $dom.jqxWindow('destroy');
                            $.bhDialog({
                                title: '请求错误',
                                //content:'',
                                width: 464,
                                //height:400,
                                className: 'bh-dialog-text',
                                buttons: [{text: '好的', className: 'bh-btn-primary'}]
                            });
                        }
                    });

                    return false;

                }
            );
        }
    }
});


//更新内容   继续抓取
$table.on('click','.update',function(){
    if(!$(this).hasClass("disable")){
        var id = $(this).parent().data("id"),
            source = $(this).parent().data("source");
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
                // '<div style="color: red;padding-top: 10px;margin-left: 123px;font-size: 14px;">一次只能启动一个爬虫抓取一个公众号!</div>'+
            '</div>',
            '启动爬虫',//弹框的title
            undefined, //默认的按钮配置
            {
                height: 195
            },
            function($dom){
                var limit = parseInt($("#limit").val()),
                    tmp = {
                        "params": [{
                            "id": id,
                            "wxId": source
                        }],
                        "limit": limit,
                        "tag": "",
                        "url": ""
                    };
                $(this).find('button.bh-btn').attr("disabled",true);
                $(this).find('button.bh-btn-primary').html("启动中...");
                $.ajax({
                    type: 'POST',
                    async: true,
                    url: rootPath + interfaceDef.campusMediaManage.grab,
                    data: {"data":JSON.stringify(tmp)},
                    dataType: "json",
                    success: function (data) {
                        if(data.status == "success"){
                            setTimeout(function(){
                                $dom.jqxWindow('destroy');
                                $table.emapdatatable('reload', {
                                    "sourceType":window.sessionStorage.getItem("filter_sourceType"),
                                    "mediaInfo":window.sessionStorage.getItem("filter_mediaInfo")
                                });
                                // window.location.reload();
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

//重启爬虫
$(".add-btn-box").on("click","a#batchStop",function () {
    var num = $table.find("input[type=checkbox]:checked:not(.selectFlag)").length;//选中的个数
    var num2 = $table.find(".mediaBox").filter(function(i,item){return $(item).data('state') == '抓取中'}).length;//选中的数据爬虫状态为'抓取中'的个数
    if($("#batchStop").attr("disabled")!="disabled"){
        if(num2 == 0){
            BH_UTILS.bhDialogWarning({
                title: '终止爬虫',
                content: '一共选中' + num + '个,可终止的抓取进行中的爬虫为<b style="font-size: 18px;color: red;">' + num2 + '</b>个<br><font color="red"><只有进行中的爬虫才可以终止哦!></font>',
                buttons: [
                    {
                        text: '关闭',
                        className: 'bh-btn-warning'
                    }
                ]
            });
        }else {
            BH_UTILS.bhDialogWarning({
                title: '终止爬虫',
                content: '一共选中' + num + '个,可终止的抓取进行中的爬虫为' + num2 + '个,确定要终止这' + num2 + '个爬虫么?<br><font color="red"><只有进行中的爬虫才可以终止哦!></font>',
                buttons: [
                    {
                        text: '确定',
                        className: 'bh-btn-warning',
                        callback: function () {
                            //选中的媒体号id组成字符串,用逗号隔开
                            var mediasId = $table.find(".mediaBox").filter(function (i, item) {
                                return $(item).data('state') == '抓取中'
                            }).map(function () {
                                return $(this).data("id");
                            }).get().join(",");
                            $(this).find('button.bh-btn').attr("disabled", true);
                            $(this).find('button.bh-btn-primary').html("终止中...");
                            wisAjax(rootPath + interfaceDef.campusMediaManage.batchStop, {"data": mediasId}, function (data) {
                                if (data.status == 'success') {
                                    BH_UTILS.bhDialogSuccess({
                                        title: '操作成功',
                                        content: '终止成功!'
                                    });
                                    setTimeout(function () {

                                        // window.location.reload();

                                        $table.emapdatatable('reload', {
                                            "sourceType": window.sessionStorage.getItem("filter_sourceType"),
                                            "mediaInfo": window.sessionStorage.getItem("filter_mediaInfo")
                                        });
                                    }, 2000);

                                } else {
                                    $.bhDialog({
                                        title: '操作失败',
                                        content: '终止失败!错误原因:' + data.errorMsg,
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
    }
});


//一键抓取
$(".add-btn-box").on("click","a#grabAll",function () {
    if($("#grabAll").attr("disabled")!="disabled"){
        wisAjax(rootPath+interfaceDef.campusMediaManage.grabAll,"",function (data) {
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