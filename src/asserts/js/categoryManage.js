/**
 * Created by zhouchen on 16/3/16.
 */

var datamodel;
var $table = $('#tableContainer');

//获取表格模型
wisAjax2(interfaceDef.model,"",function(data){
    datamodel = data.models[2].controls;
},false);

//插件选项设置
var options = {
    sortable: false,
    colHasMinWidth: false,
    url: rootPath+"/v1/categories",//"../data/categoryList.json",////url和pagePath二选一
    //pagePath: pagePath,
    datamodel: datamodel,//必须 需要展示的数据列
    action: 'categoryList',//必须
    method: 'GET',//可选，默认'POST'//对接后台接口时请改为POST
    pageable: true,//可选，默认true
    customColumns: [//数组项如果有colIndex字段，则必须按照该字段从小到大顺序排列
        {
            colIndex: 'last',
            type: 'tpl',
            width: '25%',
            column: {
                text: '操作',
                cellsRenderer: function(row, column, value, rowData){
                    var operation = '<div data-id="'+ rowData.categoryId +'">'+
                                        '<a href="javascript:void(0)" class="edit mrg-rg">编辑</a>' +
                                        '<a href="javascript:void(0)" data-title="'+ rowData.categoryName +'" class="delete mrg-rg">删除</a>' +
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
    var categoryUUID = $(this).parent().data("id");
    window.open("editCategory.html?categoryId="+categoryUUID);
});

//删除
$table.on('click','.delete',function(){
    var categoryId = $(this).parent().data("id");
    BH_UTILS.bhDialogWarning({
        title:'确定删除名为"'+ $(this).data("title") +'"的分类?',
        //content:,
        buttons:[
            {
                text:'确定',
                className:'bh-btn-warning',
                callback:function(){
                    var tmp = {
                        "categoryId": categoryId
                    };
                    wisAjax(rootPath+"/v1/categories/deletion/"+categoryId,tmp,function(data){
                        if(data.status == "success"){
                            $table.emapdatatable('reload', {});
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

    //var deleteConfirm = confirm("确定删除名为\""+ $(this).data("title") +"\"的分类?");
    //if(deleteConfirm){
    //    var tmp = {
    //        "categoryId": categoryId
    //    };
    //    wisAjax(rootPath+"/v1/categories/deletion/"+categoryId,tmp,function(data){
    //        if(data.status == "success"){
    //            $table.emapdatatable('reload', {});
    //            alert("删除成功");
    //        }
    //    });
    //}

});


