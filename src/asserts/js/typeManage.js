/**
 * Created by zhouchen on 16/3/16.
 */
//校验类型值是否唯一
$.fn.emapValidate.defaultRules = {
    "unique": {
        "alertText": "该类型值已存在!请重新输入",
        "func": function (val) {
            var form = $('#formContainer-add');
            if (form.length == 0) {
                form = $('#formContainer-edit');
            }

            var result = true;
            var value = val,
                typeId = $('[data-name=typeId]', form).val();
            if (typeId != "") {
                var $valueBlock = $('[data-field=value]',form),
                    $valueBox = $('[data-name=value]',form);
                wisAjax2(rootPath+interfaceDef.typeManage.validTypeId,
                    {
                        "typeId": typeId,
                        "value": value
                    },
                    function (data) {
                        if (data.status == "success") {
                            result = true;
                            $valueBlock.find("div.jqx-validator-error-info").remove();
                            $valueBlock.children(".bh-form-placeholder").html('<font color="green">该类型值可用</font>');
                            $valueBlock.children(".bh-form-placeholder").show();
                            $valueBox.css("border", "");
                            $valueBlock.removeClass("jqx-validator-error-container");
                        } else if (data.status == "failed") {
                            result = false;
                        }
                    }, false);

            }
            return result;
        }
    }
};


var datamodel, formDataModel,
    $table = $('#tableContainer');
//获取表格模型
wisAjax2(interfaceDef.model, "", function (data) {
    datamodel = data.models[4].controls;
}, false);

//插件选项设置
var options = {
    sortable: false,
    colHasMinWidth: false,
    url: rootPath+interfaceDef.typeManage.typeList,//url和pagePath二选一
    //pagePath: pagePath,
    datamodel: datamodel,//必须 需要展示的数据列
    action: 'sysTypeList',//必须
    method: 'GET',//可选，默认'POST'//对接后台接口时请改为POST
    pageable: true,//可选，默认true
    params: {
        "typeId": window.sessionStorage.getItem("filter_typeId")
    },
    customColumns: [//数组项如果有colIndex字段，则必须按照该字段从小到大顺序排列
        {
            colIndex: 'last',
            type: 'tpl',
            width: '20%',
            column: {
                text: '操作',
                cellsRenderer: function (row, column, value, rowData) {
                    var operation = '<div data-value="' + rowData.value + '" data-typeid="' + rowData.typeId + '">' +
                        '<a href="javascript:void(0)" class="edit mrg-rg">编辑</a>' +
                        '<a href="javascript:void(0)" data-name="' + rowData.display + '" class="delete mrg-rg">删除</a>' +
                        '</div>';
                    return operation;
                }
            }
        }
    ]
};
$table.emapdatatable(options);
//$("#retirementInfoTable").emapdatatable('reload', {querySetting: JSON.stringify(data)});

//获取高级搜索模型
var searchData;
wisAjax2(interfaceDef.typeManage.advencedQueryModel, "", function (data) {
    searchData = data;
    $(searchData.controls).each(function () {
        this.get = function (field) {
            return this[field];
        }
    });
    //渲染高级搜索
    $('#advancedQueryPlaceholder').emapAdvancedQuery({
        data: searchData,
        initComplete: function () {
            var wrap = $('#advancedQueryPlaceholder .bh-advancedQuery-groupList');
            if (window.sessionStorage.getItem("filter_typeId") == null) {
                $('[data-name=typeId] [data-id=ALL]', wrap).addClass("bh-active");
            } else if (window.sessionStorage.getItem("filter_typeId") != "") {
                $('[data-name=typeId] [data-id=ALL]', wrap).removeClass("bh-active");
                $('[data-name=typeId] [data-id=' + window.sessionStorage.getItem("filter_typeId") + ']', wrap).addClass("bh-active");
            }
        }
    });
}, false);

$('#advancedQueryPlaceholder').on('search', function (e, data, opts) {
    //调用表格reload方法
    var Data = JSON.parse(data);
    var filter = {};
    var sourceArr = Data.filter(function (v) {
        return v.name == 'typeId'
    });
    filter.typeId = sourceArr.length > 0 ? sourceArr[0].value : "";
    window.sessionStorage.setItem("filter_typeId", filter.typeId);

    $("#tableContainer").emapdatatable('reload', filter);
});

//添加
$(".add-btn-box").on('click', 'a#addTypeBtn', function () {
    BH_UTILS.bhWindow(
        '<div id="submitInfoFormContainer">' +
            '<div class="bh-form-group">' +
                '<div id="formContainer-add"></div>' +
            '</div>' +
        '</div>',

        '添加类型',//弹框的title
        undefined, //默认的按钮配置
        {
            height: 420,
            width: 400
        },
        function ($dom) {
            var $formAdd = $("#formContainer-add");
            if ($formAdd.emapValidate("validate")) {//校验
                var addData = $formAdd.emapForm("getValue");
                wisAjax(rootPath+interfaceDef.typeManage.addType, addData, function (data) {
                    if (data.status == "success") {
                        $table.emapdatatable('reload', {
                            "typeId":window.sessionStorage.getItem("filter_typeId")
                        });
                        $dom.jqxWindow('destroy');
                        BH_UTILS.bhDialogSuccess({
                            title: '添加成功!'
                        });
                    } else {
                        $dom.jqxWindow('destroy');
                        $.bhDialog({
                            title: '添加失败!错误原因:' + data.errorMsg,
                            //content:'',
                            width: 464,
                            //height:400,
                            className: 'bh-dialog-text',
                            buttons: [{text: '好的', className: 'bh-btn-primary'}]
                        });
                    }
                });
            } else {
                return false;
            }

        }
    );
    //获取表单模型
    wisAjax2(interfaceDef.formModel, "", function (data) {
        formDataModel = data.models[5].controls;
        $(formDataModel).each(function () {
            this.get = function (field) {
                return this[field];
            }
        })
    }, false);
    //渲染表单
    $("#formContainer-add").emapForm({
        model: "v",
        data: formDataModel,
        readonly: false
    });
});

//编辑
$table.on('click', '.edit', function () {
    var value = $(this).parent().data("value");
    var typeId = $(this).parent().data("typeid");
    //打开编辑弹框
    BH_UTILS.bhWindow(
        '<div id="submitInfoFormContainer">' +
            '<div class="bh-form-group">' +
                '<div id="formContainer-edit"></div>' +
            '</div>' +
        '</div>',

        '编辑类型',//弹框的title
        undefined, //默认的按钮配置
        {
            height: 420,
            width: 400
        },
        function ($dom) {
            var $formEdit = $("#formContainer-edit");
            if ($formEdit.emapValidate("validate")) {//校验
                var editData = $formEdit.emapForm("getValue");
                wisAjax(rootPath+interfaceDef.typeManage.editType, editData, function (data) {
                    if (data.status == "success") {
                        $table.emapdatatable('reload', {
                            "typeId":window.sessionStorage.getItem("filter_typeId")
                        });
                        $dom.jqxWindow('destroy');
                        BH_UTILS.bhDialogSuccess({
                            title: '修改成功!'
                        });
                    } else {
                        $dom.jqxWindow('destroy');
                        $.bhDialog({
                            title: '修改失败!错误原因:' + data.errorMsg,
                            //content:'',
                            width: 464,
                            //height:400,
                            className: 'bh-dialog-text',
                            buttons: [{text: '好的', className: 'bh-btn-primary'}]
                        });
                    }
                });
            } else {
                return false;
            }
        }
    );
    //获取表单模型
    wisAjax2(interfaceDef.formModel, "", function (data) {
        formDataModel = data.models[13].controls;
        $(formDataModel).each(function () {
            this.get = function (field) {
                return this[field];
            }
        })
    }, false);
    //渲染表单
    $("#formContainer-edit").emapForm({
        model: "v",
        data: formDataModel,
        readonly: false
    });
    //获取表单数据
    wisAjax2(rootPath+interfaceDef.typeManage.oneType,
        {
            "value": value,
            "typeId": typeId
        }, function (data) {
            //向表单中填充数据
            $("#formContainer-edit").emapForm("setValue", data.datas);
        }, false);
});
//删除
$table.on('click', '.delete', function () {
    var value = $(this).parent().data("value");
    var typeId = $(this).parent().data("typeid");
    BH_UTILS.bhDialogWarning({
        title: '确定删除名为"' + $(this).data("name") + '"的类型?',
        //content:,
        buttons: [
            {
                text: '确定',
                className: 'bh-btn-warning',
                callback: function () {
                    var tmp = {
                        "value": value,
                        "typeId": typeId
                    };
                    wisAjax(rootPath+interfaceDef.typeManage.delete, tmp, function (data) {
                        if (data.status == "success") {
                            $table.emapdatatable('reload', {
                                "typeId":window.sessionStorage.getItem("filter_typeId")
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

});
