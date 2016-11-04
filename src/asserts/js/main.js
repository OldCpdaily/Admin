/**
 * Created by zhouchen on 16/3/17.
 */

var rootPath = "";
function asideNavInit() {
    $.bhAsideNav.init(
        {
        title: "NEXT",
        iconFont: "iconfont",
        data: [
            [{
                text: "内容管理",
                icon: "icon-home",
                href: "contentManage_new.html"
            }],
            [{
                text: "抽奖管理",
                icon: "icon-home",
                href: "luckyDrawManage.html"
            }],
            [{
                text: "虚拟组管理",
                icon: "icon-home",
                href: "groupManage.html"
            }],
            [{
                text: "圈子管理",
                icon: "icon-home",
                href: "circleManage.html"
            }],
            [{
                text: "校园号管理",
                icon: "icon-home",
                href: "campusMediaManage.html"
            }],
            [{
                text: "标签管理",
                icon: "icon-home",
                href: "tagManage.html"
            }],
            [{
                text: "类型管理",
                icon: "icon-home",
                href: "typeManage.html"
            }],
            [{
                text: "推送记录",
                icon: "icon-home",
                href: "pushRecordManage.html"
            }],
            [{
                text: "用户管理",
                icon: "icon-home",
                href: "userManage.html"
            }]
        ]
    })
    WIS_EMAP_CONFIG.getOptionType = 'GET';
}

//接口定义
var interfaceDef = {
    "model": "../data/model.json",
    "formModel": "../data/form_model.json",
    "uploadImg": "/v2/img/upload",
    "contentManage": {//内容管理系列接口
        "advencedQueryModel": "../data/advencedQueryModel_new.json",//管理页面的高级搜索模型
        "turnOnOff": "/v2/feed/turnOnOff",//启用 停用
        "delete": "/v2/feed/delete",//删除
        "oneContent": "/v2/feed/",//获取一条内容
        "addContent": "/v2/feed/add",//添加一条内容
        "editContent": "/v2/feed/edit", //修改一条内容
        "contentList": "/v2/feed/contentList"//获取内容列表
    },
    "groupManage": {//虚拟组管理系列接口
        "advencedQueryModel": "../data/advencedQueryModel_group.json",//管理页面的高级搜索模型
        "groupList": "/v2/groups",//获取虚拟组列表
        "delete": "/v2/group/delete",//删除
        "oneGroup": "/v2/group/",//获取一个虚拟组
        "addGroup": "/v2/group/add",//添加一个虚拟组
        "editGroup": "/v2/group/edit",//编辑一个虚拟组
        "validGroupId": "/v2/group/validGroupId"//添加时,验证虚拟组编号是否唯一
    },
    "circleManage": {//圈子管理系列接口
        "advencedQueryModel": "../data/advencedQueryModel_circle.json",//管理页面的高级搜索模型
        "circleList": "/v2/circles",//获取虚拟组列表
        "delete": "/v2/circle/delete",//删除
        "oneCircle": "/v2/circle/",//获取一个虚拟组
        "addCircle": "/v2/circle/add",//添加一个虚拟组
        "editCircle": "/v2/circle/edit",//编辑一个虚拟组
        "validCircleId": "/v2/circle/validCircleId"//添加时,验证虚拟组编号是否唯一
    },
    "campusMediaManage": {//校园号管理系列接口
        "advencedQueryModel": "../data/advencedQueryModel_campusMedia.json",//管理页面的高级搜索模型
        "campusMediaList": "/v2/medias",//获取校园号列表
        "delete": "/v2/media/delete",//删除
        "oneCampusMedia": "/v2/media/",//获取一个校园号
        "editCampusMedia": "/v2/media/edit",//编辑一个校园号
        "addCampusMedia": "/v2/media/add",//添加一个校园号
        "validCampusMediaId": "/v2/media/validId",//添加时,验证校园号编号是否唯一
        "grab": "/v2/rawlerexe",//抓取单个
        "grabStatus": "/v2/rawlers_status",//爬虫状态
        "batchStop": "/v2/rawlerexe_kill",//批量终止
        "grabAll": "/v2/rawlerexe_all"//一键抓取
    },
    "tagManage": {//标签管理系列接口
        "tagList": "/v2/tags?tagDomain=0",//获取标签列表
        "oneTag": "/v2/tag/",//获取一个标签
        "delete": "/v2/tag/delete",//删除
        "editTag": "/v2/tag/edit",//编辑一个标签
        "addTag": "/v2/tag/add",//添加一个标签
        "validTagId": "/v2/tag/validTagId"//添加时,验证标签的编号是否唯一
    },
    "typeManage": {//类型管理系列接口
        "advencedQueryModel": "../data/advencedQueryModel_type.json",//管理页面的高级搜索模型
        "typeList": "/v2/syscodes",//获取类型列表
        "editType": "/v2/syscode/edit",//编辑一个类型
        "addType": "/v2/syscode/add",//添加一个类型
        "delete": "/v2/syscode/delete",//删除
        "oneType": "/v2/syscode",//获取一个类型
        "validTypeId": "/v2/syscode/validType"//添加时,验证类型编号是否唯一
    },
    "luckyDrawManage": {
        "luckyDrawList": "/v2/lotteryDraws",
        "addLuckyDraw": "/v2/lotteryDraw/add",
        "editLuckyDraw": "/v2/lotteryDraw/edit",
        "delete": "/v2/lotteryDraws/delete",
        "oneLuckyDraw": "/v2/lotteryDraw/"
    },
    "userManage": {
        "advencedQueryModel": "../data/advencedQueryModel_user.json",//管理页面的高级搜索模型
        "userList": "/v2/users"
    },
    "schoolManage": {
        "schoolList": "../data/schoolList.json",
        "addSchool": "../data/turnOnOff.json",
        "editSchool": "../data/turnOnOff.json",
        "delete": "../data/turnOnOff.json",
        "oneSchool": "../data/oneSchool.json"
    },
    "pushRecordManage": {
        "advencedQueryModel": "../data/advencedQueryModel_push.json",
        "pushRecordList": "/v2/pushs",
        "addPush": "/v2/push/add",
        "push": "/v2/push/execute",
        "detail": "/v2/push/",
        "delete": "/v2/push/delete",
        "editPush": "/v2/push/edit"
    }
};

//每页table显示条数变化的处理
$('body').find('#tableContainer').on('pageSizeChanged', function (event){
    var $table2 = $(event.target);
    var args = event.args;
    var pageSize = args.pageSize;
    //重新设置table的高度
    var tableHeight = BH_UTILS.getTableHeight(pageSize);
    $table2.jqxDataTable({height: tableHeight});
});

function wisAjax(path, params, callback, async){

    var a = true;
    if(async !== undefined)
        a = async;

    $.ajax({
        type: 'POST',
        async: a,
        url: path,
        data: params,
        dataType: "json",
        success: function (json) {
            callback(json);
        },
        error: function () {
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
}

function wisAjax2(path, params, callback, async){

    var a = true;
    if(async !== undefined)
        a = async;

    $.ajax({
        type: 'GET',
        async: a,
        url: path,
        data: params,
        dataType: "json",
        success: function (json) {
            callback(json);
        },
        error: function () {
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
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

function changeString(data){
    if(typeof data == "object"){
        for(var key in data ){
            console.log(key+"--"+json[key]);
        }
    }
}


function getFileName(path){
    var pos1 = path.lastIndexOf('/');
    var pos2 = path.lastIndexOf('\\');
    var pos  = Math.max(pos1, pos2);
    if( pos<0 )
        return path;
    else
        return path.substring(pos+1);
}

function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) {
        url = window.createObjectURL(file)
    } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file)
    } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file)
    }
    return url;
}

function getImgName(name){
    arr = name.split("/");
    return arr[arr.length-1];
}
