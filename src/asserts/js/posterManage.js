/**
 * Created by zhouchen on 16/3/16.
 */

var datamodel;
var $table = $('#tableContainer');

//获取表格模型
wisAjax2(interfaceDef.model,"",function(data){
    datamodel = data.models[3].controls;
},false);

//插件选项设置
var options = {
    sortable: false,
    colHasMinWidth: false,
    url: rootPath + "/v1/posters/list",//url和pagePath二选一
    //pagePath: pagePath,
    datamodel: datamodel,//必须 需要展示的数据列
    action: 'posterList',//必须
    method: 'GET',//可选，默认'POST'//对接后台接口时请改为POST
    pageable: false,//可选，默认true
    customColumns: [//数组项如果有colIndex字段，则必须按照该字段从小到大顺序排列
        {
            colField: 'posterId',
            type: 'tpl',
            column: {
                cellsRenderer: function(row, column, value, rowData){
                    return rowData.posterId.substring(35,36);
                }
            }
        },
        {
            colField: 'posterPhoto',
            type: 'tpl',
            column: {
                cellsRenderer: function(row, column, value, rowData){
                    var src = rowData.posterPhoto;
                    return '<img style="max-width:103px;height:63px;" src="'+ rootPath + src +'"/>';
                }
            }
        },
        {
            colField: 'state',
            type: 'tpl',
            column: {
                cellsRenderer: function(row, column, value, rowData){
                    return (rowData.state == "0") ? "停用" : "启用";
                }
            }
        },
        {
            colField: 'order',
            type: 'tpl',
            column: {
                cellsRenderer: function(row, column, value, rowData){
                    return rowData.order == "" ? "-" : rowData.order;
                }
            }
        },
        {
            colIndex: 'last',
            type: 'tpl',
            width: '25%',
            column: {
                text: '操作',
                cellsRenderer: function(row, column, value, rowData){
                    var state = (rowData.state == "0") ? "启用" : "停用",
                        order = rowData.posterId.substring(35,36),
                        operation = '<div data-id="'+ rowData.posterId +'">'+
                                        '<a href="javascript:void(0)" class="switch mrg-rg">'+ state +'</a>' +
                                        '<a href="javascript:void(0)" class="edit mrg-rg">编辑</a>' +
                                        '<a href="javascript:void(0)" class="up mrg-rg">上移</a>' +
                                        '<a href="javascript:void(0)" class="down mrg-rg">下移</a>' +
                                    '</div>';
                    if(order == "1"){
                        operation = '<div data-id="'+ rowData.posterId +'">'+
                                        '<a href="javascript:void(0)" class="switch mrg-rg">'+ state +'</a>' +
                                        '<a href="javascript:void(0)" class="edit mrg-rg">编辑</a>' +
                                        '<a href="javascript:void(0)" class="down mrg-rg">下移</a>' +
                                    '</div>';
                    }else if(order == "4"){
                        operation = '<div data-id="'+ rowData.posterId +'">'+
                                        '<a href="javascript:void(0)" class="switch mrg-rg">'+ state +'</a>' +
                                        '<a href="javascript:void(0)" class="edit mrg-rg">编辑</a>' +
                                        '<a href="javascript:void(0)" class="up mrg-rg">上移</a>' +
                                    '</div>';
                    }
                    return operation;
                }
            }
        }
    ]
};
$table.emapdatatable(options);
//$("#retirementInfoTable").emapdatatable('reload', {querySetting: JSON.stringify(data)});

//启用    停用
$table.on('click','.switch',function(){
    if(!$(this).hasClass("disable")){
        var requestState = ($(this).text() == "启用") ? true : false;
        var tmp = {
            "posterId": $(this).parent().data("id"),
            "requestState": requestState //true请求启用    false请求停用
        };
        wisAjax(rootPath+"/v1/posters/status/" + $(this).parent().data("id"),tmp,function(data){
            if(data.status == "success"){
                $table.emapdatatable('reload', {});
            }
        });
    }
});

//编辑
$table.on('click','.edit',function(){
    window.open("editPoster.html?posterId="+$(this).parent().data("id"));
});

//上移
$table.on('click','.up',function(){
    var posterId = $(this).parent().data("id");
    wisAjax(rootPath + "/v1/posters/up/" + posterId,"",function(data){
        if(data.status == "success"){
            $table.emapdatatable('reload', {});
        }else{
            alert("操作失败");
        }
    });
});

//下移
$table.on('click','.down',function(){
    var posterId = $(this).parent().data("id");
    wisAjax(rootPath + "/v1/posters/down/" + posterId,"",function(data){
        if(data.status == "success"){
            $table.emapdatatable('reload', {});
        }else{
            alert("操作失败");
        }
    });
});

