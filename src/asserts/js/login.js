/**
 * Created by zhouchen on 16/4/25.
 */
var $errMsg = $(".title");
$(".login-box").on("click", "#loginBtn", function () {
    var name = $("#name").val(),//用户名
        password = $("#password").val();//密码

    if (name == "" || password == "") {//用户名或密码为空
        if (name == "" && password != "") {//用户名为空
            $(".login-card").addClass("unfillcard");
            $errMsg.show();
            $errMsg.html("用户名不能为空");
        } else if (name != "" && password == "") {//密码为空
            $(".login-card").addClass("unfillcard");
            $(".title").show();
            $errMsg.html("密码不能为空");
        } else {
            $(".login-card").addClass("unfillcard");
            $(".title").show();
            $errMsg.html("用户名和密码不能为空");
        }
    } else if (name != "" && password != "") {//用户名或密码不为空

        $(".login-card").removeClass("unfillcard");
        $(".title").hide();

        $.ajax({
            type: 'POST',
            url: rootPath + "/v2/auth/admin/tokens",
            data: {
                "userId": name,
                "password": password
            },
            dataType: "json",
            crossDomain:true,
            // contentType: "application/json",
            success: function (json) {
                if (json.loginInfo.status == "success") {
                    // window.open(url,"_self");
                    // window.sessionStorage.setItem("token",json.loginInfo.token);
                    // var date = new Date();
                    // date.setTime(date.getTime()+5*1000); //设置date为当前时间+5秒
                    // $.cookie("token",json.loginInfo.token,{expires: date.toUTCString()});
                    // setCookie("Authorization",json.loginInfo.token,"s2");
                    var exp = new Date();
                    exp.setTime(exp.getTime() + 2*60*60*1000);
                    $.cookie("Authorization",json.loginInfo.token,{expires: exp,path:"/"});
                    window.location.href = "http://"+window.location.host+"/v2/statics/html/contentManage_new.html";
                } else {
                    $(".login-card").addClass("errorcard");
                    $errMsg.show();
                    $errMsg.html("用户名或密码错误");
                }
            },
            error: function () {
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

    }


});
