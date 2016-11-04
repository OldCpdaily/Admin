//  多图上传
(function () {
    var Plugin;
    var fileReader = 'FileReader' in window;
    var _init, _getLimitInfo, _refreshFileInput; //私有方法

    Plugin = (function () {
        // 实例化部分
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapImageUpload.defaults, options);
            this.$element = $(element);

            if (this.options.token && this.options.token != null ) {
                this.options.token = this.options.token.split(',');
            //    this.options.token = this.options.token.toString();
            //    this.options.scope = this.options.token.substring(0, this.options.token.length - 1);
            //    this.options.newToken = false;
            } else {
                this.options.token = [];
            //    this.options.scope = new Date().getTime() + "" + parseInt(Math.random() * 100).toString();
            //    this.options.token = this.options.scope + 1;
            //    this.options.newToken = true;
            }

            _init(this.$element, this.options);

        }

        // 公共方法
        Plugin.prototype.getFileToken = function () {
            return this.options.token.join(',');
        };

        // 返回token下已有的正式文件的url数组
        Plugin.prototype.getFileUrl = function () {
            var options = this.options;
            var fileArr;
            $.ajax({
                type: "post",
                url: options.contextPath + '/sys/emapcomponent/file/getUploadedAttachment/' + options.token + '.do',
                dataType: "json",
                async : false,
                success: function (res) {
                    if (res.success) {
                        var fileHtml = '';
                        fileArr = $(res.items).map(function(){
                            return this.fileUrl;
                        }).get();
                    }
                }
            });

            return fileArr;
        };

        Plugin.prototype.saveTempFile = function () {
            if ($('.bh-file-img-block', this.$element).length < 2) { return; }
            var resultFlag = false;
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
                '<div class="bh-file-img-container">' +
                '<div class="bh-file-img-input bh-file-img-block" style="width: ' + options.width + 'px;height: ' + options.height + 'px;">' +
                '<span>' +
                '<span class="bh-file-img-plus">+</span>' +
                '<span class="bh-file-img-text">点击上传</span>' +
                '</span>' +
                '<input type="file" ' + (options.multiple ? 'multiple' : '') + '>' +
                '</div>' +
                '</div>');

            // 生成描述信息
            var introText = '请上传图片';
            if (options.type && options.type.length > 0) {
                introText += ', 支持' + options.type.join(',').toUpperCase() + '类型';
            }

            if(options.size && options.size > 0) {
                introText += ',大小在' + options.size + 'K以内';
            }

            if(options.limit && options.limit > 0) {
                introText += ',数量在' + options.limit + '以内';
            }


            $('.bh-file-img-info', element).html(introText);

            if (options.height <= 100) {
                $('.bh-file-img-text', element).hide();
            }


            // 获取token下已有的文件
            if (!options.newToken) {
                var itemHtml = '';
                $(options.token.split(',')).each(function(){
                    itemHtml += '<div class="bh-file-img-block saved" data-fileid="' + this.id + '" style="width: ' + options.width + 'px;height: ' + options.height + 'px;">' +
                        '<div class="bh-file-img-loading" style="line-height: ' + imgHeight + 'px;">上传中...</div>' +
                        '<div class="bh-file-img-fail"></div>' +
                        '<div class="bh-file-img-table" style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                        '<span style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                        '<img src="' + this.fileUrl + '" style="max-width: ' + imgWidth + 'px;max-height: ' + imgHeight + 'px;" />' +
                        '</span>' +
                        '</div>' +
                        '<a href="javascript:void(0)" class="bh-file-img-delete">删除</a>' +
                        '</div>';
                });
                $('.bh-file-img-input', element).before(itemHtml);

            }

            options.attachmentParams = {
                storeId: options.storeId,
                scope: options.scope,
                fileToken: options.token,
                params: options.params
            };


            // 上传input 初始化
            $(element).find('input[type=file]').fileupload({
                url: options.url,
                autoUpload: true,
                multiple: options.multiple,
                dataType: 'json',
                limitMultiFileUploads: 1,
                formData: {
                    size: options.size,
                    type: options.type,
                    storeId: options.storeId
                },
                add: function (e, data) {
                    var files = data.files;
                    var tmp = new Date().getTime();

                    $(files).each(function (i) {
                        data.files[i].bhId = tmp + i;

                        $('.bh-file-img-input', element).before('<div class="bh-file-img-block loading" data-bhid="' + data.files[i].bhId + '" style="width: ' + options.width + 'px;height: ' + options.height + 'px;">' +
                            '<div class="bh-file-img-loading" style="line-height: ' + imgHeight + 'px;">上传中...</div>' +
                            '<div class="bh-file-img-fail"></div>' +
                            '<div class="bh-file-img-table" style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                            '<span style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                            '<img style="max-width: ' + imgWidth + 'px;max-height: ' + imgHeight + 'px;" />' +
                            '</span>' +
                            '</div>' +
                            '<a href="javascript:void(0)" class="bh-file-img-delete">删除</a>' +
                            '</div>');
                    });

                    if (options.add) {
                        options.add(e, data);
                    }
                    data.submit();

                },
                submit: function (e, data) {
                    var file = data.files[0];
                    var imgBlock = $('.bh-file-img-block[data-bhid=' + file.bhId + ']', element);

                    // 文件数量限制的校验
                    if (options.limit) {
                        var currentCount = $('.bh-file-img-block', element).length - 1;
                        if (currentCount > options.limit) {
                            imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html('文件数量超出限制');
                            return false;
                        }
                    }

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
                },
                done: function (e, data) {
                    var file = data.files[0];
                    var imgBlock = $('.bh-file-img-block[data-bhid=' + file.bhId + ']', element);

                    if (data.result.success) {
                        // 上传成功
                        imgBlock.removeClass('loading').addClass('success');

                        $('img', imgBlock).attr('src', data.result.tempFileUrl);
                        imgBlock.data({
                            'fileid' : data.result.id
                        });

                        options.token.push(data.result.url);

                    } else {
                        // 上传失败
                        imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html(data.result.error ? data.result.error : '上传失败');
                    }

                    if (options.done) {
                        options.done(e, data)
                    }
                },
                fail: function (e, data) {
                    var file = data.files[0];
                    var imgBlock = $('.bh-file-img-block[data-bhid=' + file.bhId + ']', element);
                    imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html('上传失败');
                    if (options.fail) {
                        options.fail(e, data)
                    }
                }
            });

            // 删除事件绑定
            $(element).on('click', '.bh-file-img-delete', function(){
                var imgBlock = $(this).closest('.bh-file-img-block');
                if (imgBlock.hasClass('success')) {
                    // 删除临时文件
                    $.ajax({
                        type: "post",
                        url: imgBlock.data('deleteurl'),
                        dataType: "json",
                        data: {
                            attachmentParam: JSON.stringify({
                                storeId: options.storeId,
                                scope: options.scope,
                                fileToken: options.token,
                                items: [{
                                    id: imgBlock.data('fileid'),
                                    status: 'Delete'
                                }]
                            })
                        },
                        success: function (data) {
                            if (data.success) {
                                imgBlock.remove();
                            }
                        }
                    });
                } else if(imgBlock.hasClass('error')) {
                    // 错误文件直接删除
                    imgBlock.remove();
                } else if(imgBlock.hasClass('loading')) {
                    //  删除正在上传的文件
                    imgBlock.data('xhr').abort();
                    itimgBlockem.remove();
                } else if(imgBlock.hasClass('saved')){
                    // 删除正式文件
                    deleteSavedFile();
                }

                function deleteSavedFile () {
                    $.ajax({
                        type: "post",
                        url: options.contextPath + '/sys/emapcomponent/file/deleteFileByToken/' + options.token + '.do?WID=' + imgBlock.data('fileid'),
                        dataType: "json",
                        success: function (data) {
                            if (data.success) {
                                imgBlock.remove();
                            }
                        }
                    });
                    $.ajax({
                        type: "post",
                        url: options.contextPath + '/sys/emapcomponent/file/deleteFileByToken/' + options.token + '.do?WID=' + imgBlock.data('fileid') + '_1',
                        dataType: "json",
                        success: function (data) {}
                    });
                    $.ajax({
                        type: "post",
                        url: options.contextPath + '/sys/emapcomponent/file/deleteFileByToken/' + options.token + '.do?WID=' + imgBlock.data('fileid') + '_2',
                        dataType: "json",
                        success: function (data) {}
                    });
                }
            });
        };

        // 刷新上传控件的显示或隐藏
        _refreshFileInput = function(element, options) {
            var currentCount = $('.bh-file-img-block', element).length - 1;
            var fileInput = $('.bh-file-img-input', element);
            if (currentCount >= options.limit) {
                // 数量达到上限 上传控件隐藏
                fileInput.hide();
            } else {
                // 数量未达到上限 上传控件显示
                fileInput.show();
            }
        };

        // 定义插件
        $.fn.emapImageUpload = function (options, params) {
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
                return instance[options](params);
            }
        };

        // 插件的默认设置
        $.fn.emapImageUpload.defaults = {
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