//  多图上传
(function () {
    var Plugin;
    var fileReader = 'FileReader' in window;
    var _init; //私有方法

    Plugin = (function () {
        // 实例化部分
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapSingleImageUpload.defaults, options);
            this.$element = $(element);

            if (this.options.token && this.options.token != null) {
                //this.options.token = this.options.token.split(',');
            } else {
                this.options.token = "";
            }

            _init(this.$element, this.options);

        }

        // 公共方法
        Plugin.prototype.getFileToken = function () {
            return this.options.token;
        };

        // 返回token下已有的正式文件的url数组
        Plugin.prototype.getFileUrl = function () {
            var options = this.options;
            var fileArr;
            $.ajax({
                type: "post",
                url: options.contextPath + '/sys/emapcomponent/file/getUploadedAttachment/' + options.token + '.do',
                dataType: "json",
                async: false,
                success: function (res) {
                    if (res.success) {
                        var fileHtml = '';
                        fileArr = $(res.items).map(function () {
                            return this.fileUrl;
                        }).get();
                    }
                }
            });

            return fileArr;
        };

        Plugin.prototype.saveTempFile = function () {
            var resultFlag = false;

            if (!this.settings.tempUpload) {
                return resultFlag;
            }
            //  删除已有的正式文件
            $.ajax({
                type: "post",
                url: this.settings.contextPath + '/sys/emapcomponent/file/deleteFileByToken/' + this.settings.token + '.do',
                dataType: "json",
                async: false,
                success: function (data) {
                }
            });


            $.ajax({
                type: "post",
                async: false,
                url: this.options.contextPath
                + "/sys/emapcomponent/file/saveAttachment/"
                + this.options.scope + "/" + this.options.token + ".do",
                data: {
                    attachmentParam: JSON.stringify(this.options.attachmentParams)
                },
                dataType: "json",
                success: function (data) {
                    resultFlag = data;
                }
            });
            return resultFlag;
        };

        Plugin.prototype.destroy = function () {
            this.options = null;
            $(this.$element).data('plugin', false).empty();
        };

        // 私有方法
        _init = function (element, options) {
            var imgWidth = parseInt(options.width) - 6;
            var imgHeight = parseInt(options.height) - 6;

            $(element).addClass('bh-clearfix').append('<p class="bh-file-img-info"></p>' +
                '<div class="bh-file-img-container" style="width: ' + options.width + 'px;">' +
                '<div class="bh-file-img-input bh-file-img-block bh-file-img-single-block" style="width: ' + options.width + 'px;height: ' + options.height + 'px;">' +
                '<span class="bh-file-img-single-info">' +
                '<span class="bh-file-img-plus">+</span>' +
                '<span class="bh-file-img-text">点击上传</span>' +
                '</span>' +
                '<input type="file">' +
                '<div class="bh-file-img-loading" style="line-height: ' + imgHeight + 'px;">上传中...</div>' +
                '<div class="bh-file-img-fail"></div>' +
                '<div class="bh-file-img-table" style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                '<span style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                '<img style="max-width: ' + imgWidth + 'px;max-height: ' + imgHeight + 'px;" />' +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div class="bh-file-img-single-edit">' +
                '<a href="javascript:void(0)" class="bh-file-img-retry">重新上传</a>' +
                '<a href="javascript:void(0)" class="bh-file-img-delete">删除</a>' +
                '</div>' +
                '</div>');

            // 生成描述信息
            var introText = '请上传图片';
            if (options.type && options.type.length > 0) {
                introText += ', 支持' + options.type.join(',').toUpperCase() + '类型';
            }

            if (options.size && options.size > 0) {
                introText += ',大小在' + options.size / 1000 + 'K以内';
            }

            $('.bh-file-img-info', element).html(introText);

            if (options.height <= 100) {
                $('.bh-file-img-text', element).hide();
            }

            // 获取token下已有的文件
            if (options.token && options.token != null) {
                var imgBlock = $('.bh-file-img-container', element);
                $('.bh-file-img-table img', imgBlock).attr('src', options.token);
                imgBlock.addClass('saved').data({
                    'fileid': ""
                });


            }

            options.attachmentParams = {
                storeId: options.storeId,
                scope: options.scope,
                fileToken: options.token,
                params: options.params
            };

            window.addEventListener('message', function (e) {
                var data = JSON.parse(e.data);
                var index = data.index;

                var block = $(".feedback-upload-block:eq(" + index + ")");
                var imgBlock = block.children(".feedback-img-block");
                var failBlock = block.children(".feedback-fail-block");
                if (data.result == "success") {
                    var url = data.data.url;
                    imgBlock.children("img")[0].src = url;
                    imgBlock.show();
                    failBlock.hide();
                    imgUrlArr.push(url);
                } else {
                    failBlock.show();
                }
            }, false);

            // 上传input 初始化
            var fileObj = $(element).find('input[type=file]').fileupload({
                url: options.url,
                //type: 'POST',
                multiple: options.multiple,
                dataType: 'json',
                paramName: 'imgUrl',
                autoUpload:true,
                forceIframeTransport: true,
                limitMultiFileUploads: 1,
                formData: {
                    size: options.size,
                    type: options.type,
                    storeId: options.storeId
                },
                add: function (e, data) {
                    var file = data.files[0];
                    var tmp = new Date().getTime();

                    var imgBlock = $('.bh-file-img-container', element);
                    //$('.bh-file-img-container', element).addClass('loading');
                    imgBlock.addClass('success');
                    if (options.add) {
                        options.add(e, data);
                    }
                    console.log(options);
                    var reader = new FileReader();
                    //将文件以Data URL形式读入页面
                    reader.readAsDataURL(file);
                    reader.onload=function(e){
                        //显示文件
                        $('img', imgBlock).attr('src',  this.result);
                        $(element).data('files', data.files[0]);
                    };
                    data.submit();

                },
                submit: function (e, data) {
                    var file = data.files[0];
                    var imgBlock = $('.bh-file-img-container', element);

                    // 文件的大小 和类型校验
                    if (options.type && options.type.length > 0) {
                        if (!new RegExp(options.type.join('|').toUpperCase()).test(file.name.toUpperCase())) {
                            imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html('文件类型不正确');
                            return false;
                        }
                    }

                    if (fileReader && options.size) {
                        if (file.size / 1024 > options.size) {
                            imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html('文件大小超出限制');
                            return false;
                        }
                    }
                    imgBlock.data('xhr', data);

                    if (options.submit) {
                        options.submit(e, data);
                    }
                    console.log("+++++"+data);
                },
                done: function (e, data) {
                    var file = data.files[0];
                    var imgBlock = $('.bh-file-img-container', element);
                    console.log(data);
                    if (data.result.success) {
                        // 上传成功
                        imgBlock.removeClass('loading').addClass('success');
                        options.tempUpload = true;
                        $('img', imgBlock).attr('src', data.result.url);
                        imgBlock.data({
                            'fileid': data.result.id
                        });
                        if (options.done) {
                            options.done(e, data)
                        }
                        console.log("========="+options);
                    } else {
                        // 上传失败
                        imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html(data.result.error ? data.result.error : '上传失败');
                        if (options.fail) {
                            options.fail(e, data)
                        }
                    }

                },
                fail: function (e, data) {
                    var file = data.files[0];
                    var imgBlock = $('.bh-file-img-container', element);
                    imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html('上传失败');
                    if (options.fail) {
                        options.fail(e, data)
                    }
                }
            });



            $(element).data('obj', fileObj);

            // 删除事件绑定
            $(element).on('click', '.bh-file-img-delete', function () {
                var imgBlock = $(this).closest('.bh-file-img-container');
                imgBlock.removeClass('saved success fail loading error');
                $('.bh-file-img-table img', imgBlock).attr('src', '');
                options.token = "";
                    //$.ajax({
                    //    type: "post",
                    //    url: options.deleteUrl,
                    //    dataType: "json",
                    //    data: {
                    //        attachmentParam: JSON.stringify({
                    //            storeId: options.storeId,
                    //            scope: options.scope,
                    //            fileToken: options.token,
                    //            items: [{
                    //                id: imgBlock.data('fileid'),
                    //                status: 'Delete'
                    //            }]
                    //        })
                    //    },
                    //    success: function (data) {
                    //        if (data.success) {
                    //            imgBlock.removeClass('success').removeClass('error');
                    //            $('.bh-file-img-table img', imgBlock).attr('src', '');
                    //        }
                    //    }
                    //});
            });

            // 重新上传时间绑定
            $(element).on('click', '.bh-file-img-retry', function () {
                var imgBlock = $('.bh-file-img-container', element);
                imgBlock.removeClass('saved success fail loading');
                $('.bh-file-img-table img', imgBlock).attr('src', '');
                $('input[type=file]', imgBlock).click();
            });

        };

        // 定义插件
        $.fn.emapSingleImageUpload = function (options) {
            var instance;
            instance = this.data('plugin');

            // 判断是否已经实例化
            if (!instance) {
                return this.each(function () {
                    if (options == 'destroy') {
                        return this;
                    }
                    return $(this).data('plugin', new Plugin(this, options));
                });
            }
            if (options === true) {
                return instance;
            }
            if ($.type(options) === 'string') {
                return instance[options]();
            }
        };

        // 插件的默认设置
        $.fn.emapSingleImageUpload.defaults = {
            multiple: false,
            dataType: 'json',
            storeId: 'image',
            width: 200,
            height: 150,
            type: ['jpg', 'png', 'bmp'],
            size: 0
        };


    })();

}).call(this);