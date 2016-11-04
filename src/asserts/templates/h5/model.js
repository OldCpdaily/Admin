/**
 * Created by zhouchen on 16/5/26.
 */
/**
 * Created by zhouchen on 16/4/6.
 */
$(function(){
    var $parameter = $('#parameter');
    var liveState = $parameter.data('livestate');
    var contentId = $parameter.data('id');
    var type = $parameter.data('type');
    if(type == '4' || (type == '3' && liveState == '2')) {
        var url = $parameter.data('vedio');
        $('.info-content').append('<div class="iframe-box">' +
                                       '<iframe class="info-video-iframe" webkitallowfullscreen mozallowfullscreen allowfullscreen frameborder src="'+ url +'" width="90%"></iframe>' +
                                  '</div>');
        $('.info-video-iframe').css('height',($('.info-video-iframe').width()*3/4));
    }else if(type == '6'){
        $('.info-title').hide();
    }else{
        $('iframe').each(function(){
            var $p = $(this).parent();
            var src = $p.next('div.iframeDiv').data('src');
            $(this).remove();
            $p.append('<div class="iframe-box">' +
                           '<iframe class="info-video-iframe" webkitallowfullscreen mozallowfullscreen allowfullscreen frameborder src="http:'+ src +'" width="90%"></iframe>' +
                      '</div>');
            $p.children().css('height',($p.children().width()*3)/4);
        });
    }


});

function wisAjax(path, params, callback, async){

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