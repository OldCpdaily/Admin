/**
 * Created by zhouchen on 16/5/18.
 */

var datamodel = '';
var $table = $('#tableContainer');

//获取表格模型
wisAjax2(interfaceDef.model,"",function(data){
    datamodel = data.models[9].controls;
},false);

//插件选项设置
var options = {
    sortable: false,
    colHasMinWidth: false,
    url: rootPath+interfaceDef.luckyDrawManage.luckyDrawList,
    //pagePath: pagePath,
    datamodel: datamodel,//必须 需要展示的数据列
    action: 'luckyDrawList',//必须
    method: 'GET',//可选，默认'POST'//对接后台接口时请改为POST
    pageable: true,//可选，默认true
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
            width: '10%',
            column: {
                text: '操作',
                cellsRenderer: function(row, column, value, rowData){
                    var operation = '<div class="operation" data-id="'+ rowData.luckyDrawId +'" data-name="'+ rowData.luckyDrawTitle +'">'+
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
//$("#retirementInfoTable").emapdatatable('reload', {querySetting: JSON.stringify(data)});

//编辑
$table.on('click','.edit',function(){
    var luckyDrawId = $(this).parent().data("id");
    window.open("editLuckyDraw.html?luckyDrawId="+luckyDrawId);
});

//删除
$table.on('click','.delete',function(){
    var luckyDrawId = $(this).parent().data("id");
    BH_UTILS.bhDialogWarning({
        title:'确定删除名为"'+ $(this).parent().data("name") +'"的标签?',
        //content:,
        buttons:[
            {
                text:'确定',
                className:'bh-btn-warning',
                callback:function(){
                    var tmp = {
                        "luckyDrawId": luckyDrawId
                    };
                    wisAjax(rootPath+interfaceDef.luckyDrawManage.delete,tmp,function(data){
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


