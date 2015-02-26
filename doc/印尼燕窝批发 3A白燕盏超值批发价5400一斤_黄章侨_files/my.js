
function my() {

    var work, buffer, blocker;

    this.ie6 = ($.browser.msie && ($.browser.version == "6.0") && !$.support.style);

    this.initMy = function (workSelector, bufferSelector) {
        work = $(workSelector);
        buffer = $(bufferSelector);
        blocker = work.parent();
    }

    /**
    ** 调用服务器方法
    ** method          : 服务器方法名
    ** fnBeforeCall    : 请求服务器方法之前执行的行数，如果函数返回 false 则取消调用：function(){}。
    ** params          : 系统将 params(json格式) 连同 form 表单内容传递到服务器
    ** fnBack          ：回调函数（处理服务器返回结果）：function(r){}，r 为服务器 WidgetBase.R 属性的 json 形式。
    **/
    this.call = function (method, fnBeforeCall, params, fnBack) {
        if ((typeof (method) == "undefined") || (method == "")) {
            alert("缺少 method 参数。");
            return;
        }
        var ret = true;
        if ($.isFunction(fnBeforeCall)) {
            ret = fnBeforeCall();
        }
        if (ret != false) {
            $(document).data("__back", fnBack); //TODO: Key重复问题
            _internal_call(method, params);
        }
    }

    /**
    ** 日志数据
    **/
    this.ping = function(type, key1, key2, title){
        if (!window._pingImg){
            window._pingImg = new Image();
        }
        var p = {type: type, key1: key1, key2: key2, title: title, r: new Date().getTime()};
        window._pingImg.src = "http://my.tjkx.com/gate/ping/index.ashx?" + $.param(p);
    }

    /**
    ** 消息提示
    ** msg          : 内容
    ** fnCallback   : 
    **/
    this.msg = function (msg, fnCallback) {
        var css = {
            width: '300px',
            top: blocker.offset().top + 10,
            position: 'fixed',
            _position: 'absolute',
            border: 'none',
            padding: '5px',
            backgroundColor: '#333',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .9,
            color: '#fff'
        };
        if (!this.ie6) css.left = blocker.offset().left + blocker.width() - 320;
        blocker.block({
            message: $('<div style="line-height:48px; font-size:24px; padding:10px 10px 10px 60px; margin-left:20px; color:#eee; display:block; text-align:left;background: url(http://theme.tjkximg.com/v9/my/images/imeem.png) no-repeat 0 10px;"><span>' + msg + '</span></div>'),
            fadeIn: 500,
            fadeOut: 500,
            showOverlay: false,
            centerY: false,
            centerX: false,
            css: css,
            overlayCSS: {
                backgroundColor: '#f4f4f4',
                opacity: 0.6
            }
        });
        setTimeout(function () { blocker.unblock(); if ($.isFunction(fnCallback)) fnCallback(); }, 2000);
    }

    /** 发送私信
    ** receiverid   接收人id：大于0表示指定接收人，等于0表示系统，小于0有用户输入接收者昵称
    ** msg          消息内容
    **/
    this.sms = function (receiverid, msg) {
        var box = null;
        var textarea = null;
        var btn = null;
        var nickname = null;
        var w = 445, h = 200;
        if (box == null) {
            box = new Boxy('<div class="lett_box2"><div class="row_clear2" style="height: 10px;"></div>'+
            '<div class="lett_b2" style="width: 45px;">发给：</div><div class="lett_b2" style="width: 32%; padding-left: 0px;">'+
            '<span class="receiver"></span></div><div class="row_clear2" style="height: 20px;"></div><div class="lett_b2" style="width: 45px;">内容：</div><div class="lett_b2" style="width: 80%; padding-left: 0px;">'+
            '<textarea name="" class="lett_k2"></textarea></div><div class="lett_b2"><div style="float: left; font-size: 12px; width: 130px; padding-left: 52px;">您还可以输入<span class="smscount">300</span>个字</div>'+
            '<div class="lett_but" style="padding-left: 158px; padding-top: 10px;"><input type="button" value="发 送"></div></div><div class="row_clear2" style="height: 40px;"></div></div>', { title: "&emsp;", closeText: "[关闭]", show: false, fixed: true });
        }
        if (receiverid > 0) {
            //获取接收者名称
            var p = {};
            p.__method = "Profile";
            p.id = receiverid;
            $.getJSON("http://my.tjkx.com/my.ashx?callback=?", p, function (r) {
                if (r.succ) {
                    if (!r.data) {
                        box.setTitle('发送私信至糖酒快讯客服');
                        box.getContent().find(".receiver").html('<span class="orange">糖酒快讯客服</span>');
                    }
                    else {
                        box.setTitle('发送私信至' + r.data.nickname);
                        box.getContent().find(".receiver").html(r.data.nickname);
                    }
                }
                else {
                    return;
                }
            });
        }
        else if (receiverid == 0) {
            box.setTitle('发送私信至糖酒快讯客服');
            box.getContent().find(".receiver").html('<span class="orange">糖酒快讯客服</span>');
        }
        else if (receiverid < 0) {
            var cot = '请输入接收人昵称！';
            box = new Boxy('<div class="lett_box2"><div class="row_clear2" style="height: 10px;"></div>'+
            '<div class="lett_b2" style="width: 45px;">发给：</div><div class="lett_b2" style="width: 32%; padding-left: 0px;">'+
            '<input type="text" class="lett_k3"   value="请输入对方昵称！" /></div><div class="lett_b2" style="width: 30%; font-size: 12px;">发给 <span class="orange">糖酒快讯客服</span></div>'+
            '<div class="row_clear2" style="height: 20px;"></div><div class="lett_b2" style="width: 45px;">内容：</div><div class="lett_b2" style="width: 80%; padding-left: 0px;">'+
            '<textarea name="" class="lett_k2"></textarea></div><div class="lett_b2"><div style="float: left; font-size: 12px; width: 130px; padding-left: 52px;">您还可以输入<span class="smscount">300</span>个字</div>'+
            '<div class="lett_but" style="padding-left: 158px; padding-top: 10px;"><input type="button" value="发 送"></div></div><div class="row_clear2" style="height: 40px;"></div></div>', 
            { title: "&emsp;", closeText: "[关闭]", show: false, fixed: true });
            nickname = box.getContent().find(".lett_k3").val(cot).css("color", "#999");
            box.getContent().find(".orange").click(function(){
                nickname.val("糖酒快讯客服");
            })
            nickname.focus(function () {
                if ($(this).val() == cot) {
                    $(this).val("").css("color", "#555");
                }
            }).blur(function () {
                if ($(this).val() == '') {
                    $(this).val(cot).css("color", "#999");
                }
            });
            box.setTitle('发送私信');
        }
        if (!box.isVisible()) box.moveTo(null, null).show();
        textarea = box.getContent().find("textarea").val(msg);

        textarea.keyup(function () {
            if (300 - textarea.val().length >= 0) {
               box.getContent().find(".smscount").html(300 - textarea.val().length);
            } else {
                textarea.val(textarea.val().substr(0, 300));
            }
        });

        btn = box.getContent().find("input[type='button']");
        box.tween(w, h, null);
        btn.click(function () {
            if(textarea.val()==""){
                my.msg("请录入内容！");
                return;
            }
            //发送消息
            var p = {};
            p.__method = "SendSMS";
            p.msg = textarea.val();
            p.receiverid = receiverid;
            p.nickname = nickname == null ? '' : nickname.val();
            $.getJSON("http://my.tjkx.com/my.ashx?callback=?", p, function (r) {
                if (r.succ) {
                    my.msg("发送成功！");
                    box.hide(null);
                }
                else {
                    my.msg(r.msg);
                }
            });
        });
    }
     /** 发送私信
    ** receiverid   接收人id：大于0表示指定接收人，等于0表示系统，小于0有用户输入接收者昵称
    ** nickname     接收者昵称
    ** msg          消息内容
    **/
    this.smsSend = function (receiverid,nickname, msg,fnCallback) {
        if (!receiverid && !nickname) {
            alert('请指定接收人！');
            return;
        }
        if (!msg) {
            my.msg('请输入消息内容！');
            return;
        }
        //发送消息
        var p = {};
        p.__method = "SendSMS";
        p.msg = msg;
        p.receiverid = receiverid;
        p.nickname =  nickname;
        $.getJSON("http://my.tjkx.com/my.ashx?callback=?", p, function (r) {
            if (r.succ) {
                my.msg("发送成功！");
                if ($.isFunction(fnCallback)) fnCallback(); 
            }
            else {
                my.msg(r.msg);
            }
        });
    }
    /**
    ** 载入 widget 部件
    ** name    : widget 名称，文件路径去掉 /widget/ 和 .ascx 剩余的部分，如 userinfo 表示 ~/widget/userinfo.ascx
    ** params  : 需要发送到服务器的参数(json格式)
    ** fnOnLoad：仅测试用
    **/
    this.widget = function (name, params, fnOnLoad) {
        if ((typeof (name) == "undefined" || name == "")) {
            alert("缺少 name 参数。");
            return;
        }
        var p = ($.isPlainObject(params)) ? params : {};
        p.__widget = name;
        var url = "/loader.aspx?" + $.param(p) + "&" + new Date().getTime();

        var css = {
            width: '300px',
            top: blocker.offset().top + 10,
            position: 'fixed',
            _position: 'absolute',
            border: 'none',
            padding: '5px',
            backgroundColor: '#333',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .9,
            color: '#fff'
        };
        if (!this.ie6) css.left = blocker.offset().left + blocker.width() - 320;
        blocker.block({
            message: $('<div style="display: block; padding:10px 10px 10px 60px; color:#eee; line-height:48px; font-size:24px; margin-left:20px;text-align:left;background: url(http://theme.tjkximg.com/v9/my/images/loading2.gif) no-repeat 0 15px;"><span>载入中...</span></div>'),
            fadeIn: 500,
            fadeOut: 500,
            showOverlay: true,
            centerY: false,
            centerX: false,
            css: css,
            overlayCSS: {
                backgroundColor: '#f4f4f4',
                opacity: 0.6
            }
        });

        work.find("form").removeAttr("id").removeAttr("name");
        buffer.load(url, null, function (html) {
            blocker.unblock();
            work.hide(0, function () {
                work.css({ left: 0 }).hide().html("").insertBefore(buffer);
                buffer.fadeIn(900);
                var t = work;
                work = buffer;
                buffer = t;
                if ((typeof (init) != "undefined") && $.isFunction(init)) {
                    init();
                    init = null;
                }
                $("html,body").animate({ scrollTop: 0 });

                if (!my.ie6) {
                    var win = $(window);
                    var nav = $(".w-nav");
                    if (nav.length > 0) {
                        var top = nav.offset().top - 50;
                        var scroll = function () {
                            if (win.scrollTop() > top) {
                                if (!nav.hasClass("nav-fixed")) { nav.addClass("nav-fixed"); /*nav.css("left", nav.offset().left);*/ }
                            }
                            else {
                                if (nav.hasClass("nav-fixed")) nav.removeClass("nav-fixed");
                            }
                        };
                        win.unbind("scroll", scroll).bind("scroll", scroll);
                        nav.find("li").click(function () {
                            var me = $(this);
                            if (me.hasClass("pg") || ($(this).parents(".nav-fixed").length == 0)) return;
                            $("html,body").animate({ scrollTop: me.parents(".nav-ct").offset().top - 40 });
                        });
                    }
                }
            });
        });
    }

    /***********构造分页***********
    * selector  :jquery 选择器
    * pageCount :总页数
    * pageNum   :当前页次
    * maxItemCount  :显示多好项
    * fnGoPage      :点击导航所执行的函数：function(pn){ } : pn 为所点击的页次
    **/
    this.page = function (selector, pageCount, pageNum, maxItemCount, fnGoPage) {
        var c = $(selector).html("");
        var from = 1;
        var to = Math.min(maxItemCount, pageCount);
        var hf = maxItemCount / 2;
        if (pageNum > hf) {
            from += (pageNum - hf);
            to = Math.min(from + maxItemCount - 1, pageCount);
            if ((to - from + 1) < maxItemCount) {
                from = Math.max(to - maxItemCount + 1, 1);
            }
        }
        for (var i = from; i <= to; i++) {
            if (i == pageNum) {
                c.append("<span>" + i + "</span>");
            } else {
                c.append("<a href='#'>" + i + "</a>");
            }
        }
        c.find("a").click(function () {
            if (!$.isFunction(fnGoPage)) return false;
            fnGoPage($(this).text());
            return false;
        });
    }

    /***********构造分页2***********/
    this.page2 = function (selector, pageCount, pageNum, fnGoPage) {
        if(pageCount == 1) return;
        var c = $(selector).html("");
        c.append((pageNum < 2) ? "<a href='javascript:;' class='off'>首页</a>" : "<a href='javascript:;' pg='1'>首页</a>");
        c.append((pageNum < 2) ? " <a href='javascript:;' class='off'>上页</a>" : " <a href='javascript:;' pg='" + (pageNum - 1) + "'>上页</a>");
        c.append((pageNum >= pageCount) ? " <a href='javascript:;' class='off'>下页</a>" : " <a href='javascript:;' pg='" + (pageNum + 1) + "'>下页</a>");
        c.append((pageNum >= pageCount) ? " <a href='javascript:;' class='off'>末页</a>" : " <a href='javascript:;' pg='" + pageCount + "'>末页</a>");
        var s = $(" <select></select");
        for (var i = 1; i <= pageCount; i++) {
            s.append((i == pageNum) ? "<option selected>" + i + "/" + pageCount + "</option>" : "<option value='" + i + "'>" + i + "/" + pageCount + "</option>");
        }
        c.append(s);
        var go = function (me, pg) {
            if ($.isFunction(fnGoPage)) fnGoPage(pg);
            if (me.parents(".w-nav").hasClass("nav-fixed")) {
                $("html,body").animate({ scrollTop: me.parents(".nav-ct").offset().top - 40 });
            }
        }
        c.find("a[pg]").click(function () { go($(this), $(this).attr("pg")); });
        c.find("select").change(function () { go($(this), $(this).val()); });
    }

    /************** ajax 处理 **************
    * url:              调用地址
    * method:           url 中定义的服务器处理方法名
    * inputSelector:    包含全部输入框选择器，表单项的 name 值应与服务器上定义的继承于 V9.Helper.ParamsBase 类型属性匹配。
    * fnPrepareParams:  准备参数：function(params){ }，调用 params.setParams(key, value) 添加参数
    * fnSucc:           服务器调用成功后执行的函数: function(r){ }，r 为服务器返回的用户json数据
    */
    this.ajax = function (url, method, fnPrepareParams, fnSucc) {
        var p = new params();
        p.setParams("__method", method);

        var f = $("[" + method + "]");
        f.filter(":input:password[p],input:text[p],:input:hidden[p],:input:checked[p],select").each(function () {
            var me = $(this);
            var key = $.trim(me.attr("p"));
            var value = me.val();
            p.setParams(key, value);
        });
        if ($.isFunction(fnPrepareParams)) {
            fnPrepareParams(p);
        }

        $.ajax({
            type: "POST",
            url: url,
            data: p.getParams(),
            success: function (ret) {
                if ($.isFunction(fnSucc)) {
                    fnSucc(ret);
                }
            },
            error: function () {
                //alert("系统错误");
            }
        });

        /**参数**/
        function params() {
            var p = {};

            this.setParams = function (key, value) {
                if (key == "") return;
                if (typeof p[key] == "undefined")
                    p[key] = value;
                else {
                    p[key] += "," + value.toString();
                }
            }

            this.getParams = function () {
                return p;
            }
        }
    }

    /**
    ** html 编辑器
    ** textareaSelector    ：textarea 的 jquery 选择器
    **/
    this.editor = function (textareaSelector) {
        $(textareaSelector).xheditor({ tools: 'Cut,Copy,Paste,Pastetext,Blocktag,Fontface,FontSize,Bold,Italic,Underline,Strikethrough,FontColor,BackColor,SelectAll,Removeformat,Align, List,Outdent,Indent,Link,Unlink,Anchor,Img,Hr,Table,Source,Preview,Print,Fullscreen' });
    }

    /**
    ** 卸载 html 编辑器
    ** textareaSelector    ：textarea 的 jquery 选择器
    **/
    this.uneditor = function (textareaSelector) {
        $(textareaSelector).xheditor(false);
    }

     /**
    ** 上传文件
    ** selector     ：点击触发上传事件的 jquery 选择器
    ** fnCompleted  ：上传完成之后处理返回结果的函数：function(r){}，r 为服务器 WidgetBase.R 属性的 json 形式。
    ** options      : 检测上传文件的大小类型等。目前只支持文件类型及文件大小的检测
    **/
    this.file = function (selector, fnCompleted, key) {
        if (!key) key = "image";
        var t = $(selector);
        if (t.length != 1) return;
        var _fid = $(window).data("__fid");
        if (!_fid) _fid = 0;
        _fid++;
        $(window).data("__fid", _fid);
        var fid = "__f_f_id_" + _fid;
        var fspan = $("<div class='upload'><span class='filespan'>&emsp;+ 选择文件&emsp;</span><iframe name='" + fid + "' style='display:none;'></iframe></div>").insertAfter(t);

        var iframe = fspan.find("iframe");
        var txt = fspan.find("span");

        txt.hover(function(){
            if (fspan.find("input").length > 0) return;
            var file = $("<input class='file' type='file' name='" + fid + "' />");
            file.attr("name", key);
            if (key == "image") file.attr("accept", "image/*"); else file.attr("accept", "*");
            file.change(function () {
                if ($(this).val() == "") return;
                form.attr("target", iframe.attr("name"));
                txt.css("color", "white").html("&emsp;上传中…");
                timer = setInterval(function () { if (txt.css("color") == "white") txt.css("color", ""); else txt.css("color", "white"); }, 700);
                form[0].submit();
            });
            txt.after(file);
        }, null);

        var form = t.parents("form").first();
        if (form.attr("target")) form.data("target", form.attr("target"));

        var timer = null;

        fspan.hover(function () { $(this).css("background-color", '#ccc') }, function () { $(this).css("background-color", '') });
        iframe.load(function () {
            if (timer) { clearInterval(timer); timer = null; }
            form.removeAttr("target");
            if (form.data("target")) form.attr("target", form.data("target"));
            var r = (document.all) ? iframe[0].contentWindow.document.body.innerHTML : iframe[0].contentDocument.body.innerHTML;
            if (r == "") return;
            fspan.find("input").remove();
            var j = $.parseJSON(r);
            if (!j.succ) {
                if (j.msg) alert(j.msg); else alert("未知错误");
                txt.css("color", "red").html("&emsp;上传失败");
                return;
            }
            if ($.isFunction(fnCompleted)) {
                fnCompleted(j);
            }
            txt.css("color", "").html("&emsp;上传成功");
        });
    }

    /**
    ** 验证码
    **/
    this.code = function (imgSelector) {
        var img = $(imgSelector);
        img.attr("src", "http://my.tjkx.com/verifycode.axd?" + new Date().getTime())
            .css("cursor", "pointer")
            .click(function () { $(this).attr("src", "http://my.tjkx.com/verifycode.axd?" + new Date().getTime()); });
    }

    /**
    ** 绑定省市区
    **/
    this.ProvinceCity = function (proviceCity, controlOptions) {
        var settings =
		{
		    //准备赋值的隐藏控件选择器如#xx
		    hdInputID: "",
		    province: "",
		    city1: "",
		    city2: ""
		};
        controlOptions = controlOptions || {};
        $.extend(settings, controlOptions);
        var _self = $(proviceCity);
        //定义3个默认值
        _self.data("province", ["请选择", "0"]);
        _self.data("city1", ["请选择", "0"]);
        _self.data("city2", ["请选择", "0"]);
        //插入3个空的下拉框
        _self.append("<select style='margin-left:0'></select>");
        _self.append("<select></select>");
        _self.append("<select></select>");
        //分别获取3个下拉框
        var $sel1 = _self.find("select").eq(0);
        var $sel2 = _self.find("select").eq(1);
        var $sel3 = _self.find("select").eq(2);
        //默认省级下拉
        if (_self.data("province")) {
            $sel1.append("<option value='" + _self.data("province")[1] + "'>" + _self.data("province")[0] + "</option>");
        }
        $.each(GP, function (index, data) {
            $sel1.append("<option value='" + data.areaid + "'>" + data.title + "</option>");
        });

        //默认的1级城市下拉
        if (_self.data("city1")) {
            $sel2.append("<option value='" + _self.data("city1")[1] + "'>" + _self.data("city1")[0] + "</option>");
        }
        //默认的2级城市下拉
        if (_self.data("city2")) {
            $sel3.append("<option value='" + _self.data("city2")[1] + "'>" + _self.data("city2")[0] + "</option>");
        }
        //给省市区赋值
        if (settings.province != "") {
            $sel1.val(settings.province);
        }

        //省级联动 控制
        var index1 = "";
        $sel1.change(function () {
            //清空其它2个下拉框
            $sel2[0].innerHTML = "";
            $sel3[0].innerHTML = "";
            index1 = this.selectedIndex;
            if (index1 == 0) {	//当选择的为 “请选择” 时
                if (_self.data("city1")) {
                    $sel2.append("<option value='" + _self.data("city1")[1] + "'>" + _self.data("city1")[0] + "</option>");
                }
                if (_self.data("city2")) {
                    $sel3.append("<option value='" + _self.data("city2")[1] + "'>" + _self.data("city2")[0] + "</option>");
                }
            } else {
                $.each(GT[index1 - 1], function (index, data) {
                    $sel2[0].options.add(new Option(data.title, data.areaid));

                });
                $.each(GC[index1 - 1][0], function (index, data) {
                    $sel3[0].options.add(new Option(data.title, data.areaid));
                })
            }
            if (settings.city1 != "") {
                $sel2.val(settings.city1);
            }
            setHdInputVal(settings.hdInputID, $sel1.val(), $sel2.val(), $sel3.val());
        }).change();
        //1级城市联动 控制
        var index2 = "";
        $sel2.change(function () {
          
            setHdInputVal(settings.hdInputID, $sel1.val(), $sel2.val(), $sel3.val());
        });
        setHdInputVal(settings.hdInputID, $sel1.val(), $sel2.val(), $sel3.val());
        $sel3.hide();
        /**
        ** 选择完省市区后给隐藏控件赋值
        ** hdInput：隐藏控件id.selVal1, selVal2, selVal3分别为省市区的选中值
        **/
        function setHdInputVal(hdInput, selVal1, selVal2, selVal3) {
            if (hdInput != "") {
                if (selVal3 != "undefined" && selVal3 != "")
                    $(hdInput).val(selVal3);
                else if (selVal2 != "undefined" && selVal2 != "")
                    $(hdInput).val(selVal2);
                else if (selVal1 != "undefined" && selVal1 != "")
                    $(hdInput).val(selVal1);
            }
        }
    }
    /**
    ** 当前用户操作
    **/
    function user() {
        var box = null;
        var frame = null;
        var retUrl = null;
        /**
        ** 显示登录对话框
        ** utype        ：登录类型，local-本地，weibo-新浪微博
        ** returnUrl    ：登录成功后转向地址
        **/
        this.login = function (utype, returnUrl) {
            retUrl = returnUrl;
            if (box == null) {
                box = new Boxy('<div style="padding:0;"><iframe scrolling="no" frameborder="0"></iframe></div>', { title: "&emsp;", closeText: "[关闭]", show: false, fixed: true });
                frame = box.getContent().find("iframe");
            }
            var url = "", title = "", w = 0, h = 0;
            switch (utype) {
                case "local":
                    break;
                case "weibo":
                    url = "http://my.tjkx.com/reg/logincall.aspx?utype=weibo";
                    title = "使用新浪微博账号登录";
                    w = 600, h = 450;
                    break;
                case "qqt":
                    url = "http://my.tjkx.com/reg/logincall.aspx?utype=qqt";
                    title = "使用腾讯微博账号登录";
                    w = 600, h = 450;
                    break;
                case "qq":
                    url = "http://my.tjkx.com/reg/logincall.aspx?utype=qq";
                    title = "使用QQ账号登录";
                    w = 500, h = 380;
                    break;
                case "renren":
                    url = "http://my.tjkx.com/reg/logincall.aspx?utype=renren";
                    title = "使用人人网账号登录";
                    w = 420, h = 320;
                    break;
                case "kaixin":
                    url = "http://my.tjkx.com/reg/logincall.aspx?utype=kaixin";
                    title = "使用开心网账号登录";
                    w = 430, h = 380;
                    break;
                case "baidu":
                    url = "http://my.tjkx.com/reg/logincall.aspx?utype=baidu";
                    title = "使用百度网账号登录";
                    w = 430, h = 380;
                    break;
                default: return;
            }
            if (!box.isVisible()) box.moveTo(null, null).show();
            if (frame.attr("src") != url) {
                frame.attr("src", url).animate({ width: w, height: h });
                box.setTitle(title);
                box.tween(w, h, null);
            }
        }
        this.loginSucc = function () {
            box.hide();
            frame.attr("src", "");
            if (retUrl) {
                location.href = retUrl;
            } else {
                this.show();
            }
        }
        this.loginFail = function () {
            box.hide();
            frame.attr("src", "");
        }

        /**
        ** 退出登录
        ** fnCallback  ：退出成功后需要执行的函数： function(r){}
        **/
        this.logout = function (fnCallback) {
            var p = {};
            p.__method = "logout";
            $.getJSON("http://my.tjkx.com/reg/ajax.ashx?callback=?", p, function (r) {
                if (r.data && r.data.urls && r.data.urls.length) {
                    var frm = $("#synLogout");
                    if (frm.length == 0) {
                        $("body").append($("<iframe style='width:0; height:0; display:none;' id='synLogout'></iframe>"));
                    }
                    var idx = 0;
                    $("#synLogout").load(function () {
                        idx++;
                        if (idx >= r.data.urls.length) {
                            if ($.isFunction(fnCallback)) { fnCallback(r.data); }
                        } else {
                            $(this).attr("src", r.data.urls[idx]);
                        }
                    }).attr("src", r.data.urls[idx]);
                } else {
                    if ($.isFunction(fnCallback)) { fnCallback(r.data); }
                }
            });
        }

        /**
        ** 获取用户当前登录状态
        ** fnCallback  ：获取成功后需要执行的函数： function(r){}
        **/
        this.state = function (fnCallback) {
            if (!$.isFunction(fnCallback)) return;
            var p = {};
            p.__method = "state";
            $.getJSON("http://my.tjkx.com/reg/ajax.ashx?callback=?", p, function (r) {
                fnCallback(r.data);
            });
        }

        /**
        ** 本地用户登录
        ** fnCallback  ：登录成功后需要执行的函数： function(r){}
        **/
        this.login2 = function (p, fnCallback) {
            if (!$.isFunction(fnCallback)) return;
            p.__method = "Login2";
            $.getJSON("http://my.tjkx.com/reg/ajax.ashx?callback=?", p, function (r) {
                fnCallback(r);
            });
        }

        /**
        ** 显示用户当前登录状态
        ** containerSelector   ：显示在何处？
        **/
        this.show = function (containerSelector) {
            if (!containerSelector) containerSelector = "#__user";
            var c = $(containerSelector);
            if (c.length == 0) return;
            this.state(function (r) {
                c.html((r.id < 1) ? "未登录" : r.nick);
            });
        }
    }
    this.user = new user();
}

/**
** （系统用）回调函数，如果需要处理回调结果，则由各 widget 去定义 back 函数
** r   ：服务器 WidgetBase.R 属性的 json 形式。
**/
function _internal_back(r) {
    var b = $(document).data("__back");
    if ($.isFunction(b)) {
        var json = $.parseJSON(r);
        b(json);
    }
}

var my = new my();




﻿
function TjkxV8(){this.mediaTag=function(src,width,height,url){if((src.indexOf(".mp4")>-1)||(src.indexOf(".f4v")>-1)||(src.indexOf(".flv")>-1)||(src.indexOf(".swf")>-1)){return(((url != "") && (typeof (url) != "undefined"))?'<a style="position:absolute;top:0;left:0;bottom:0;right:0;display:block;width:100%;height:expression(this.parentNode.scrollHeight);filter:alpha(opacity=0);opacity:0;background:#FFF;" href="'+url+'" target="_blank"></a>':"")
+ ((src.indexOf(".swf")>-1)?'<embed wmode="transparent" src="'+src+'" width="'+width+'px" height="'+height+'px" quality="high" allowscriptaccess="sameDomain" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />':
'<embed width="'+width+'" height="'+height+'" flashvars="file='+src+'&controlbar=none&autostart=true&screencolor=000000" type="application/x-shockwave-flash" src="http://theme.tjkx.com/flash/jwplayer/player2.swf" allowscriptaccess="always" allowfullscreen="true" wmode="transparent" />');}
else{if(typeof(url)=="undefined"){return'<img src="'+src+'" style="border:0;">'}else{return'<a href="'+url+'" target="_blank"><img src="'+src+'" style="border:0;"></a>';}}}
this.cookieHintExpand=function(op){if(op){this.setCookie("hp","1",30);}
else{this.setCookie("hp","0",30);}}
this.cookieSetLayout=function(value){this.setCookie("layout",value,30);}
this.setCookie=function(name,value,day,domain){this.setCookieInTime(name,value,day*24*3600*1000,domain);}
this.setCookieInTime=function(name,value,time){this.delCookie(name);var dm=(arguments[3])?arguments[3]:location.hostname;var exp=new Date();exp.setTime(exp.getTime()+time);document.cookie=name+"="+value+";path=/;expires="+exp.toGMTString()+";domain="+dm;}
this.delCookie=function(name){var exp=new Date();exp.setTime(exp.getTime()-10000);var dm=(arguments[1])?arguments[1]:location.hostname;document.cookie=name+"=;path=/;expires="+exp.toGMTString()+";domain="+dm;}
this.getcookie=function(name){var arr=document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));if(arr!=null)return unescape(arr[2]);return null;}
this.goTo=function(e){var d=document.createElement("a"),c="_blank",f=document.body,g=arguments[1]==c?c:"_parent";if(!d.click){return window.open(e,g)}
d.setAttribute("target",g);d.setAttribute("href",e);d.style.display="none";if(!f){return}
f.appendChild(d);d.click();if(g==c){setTimeout(function(){try{f.removeChild(d)}catch(a){}},500)}}
this.goToSignin=function(){url=document.location.href;if(parent){try{url=parent.document.location.href;}
catch(e){url="http://user.tjkx.com";}}
this.setCookie("ReturnUrl",url,1,"tjkx.com");this.goTo("http://passport.tjkx.com/signin.aspx");}
this.divShowOrHide=function(divname){var div=$('#'+divname);var showtime=0;if(arguments[1]!=undefined){showtime=arguments[1];}
if(div.css("display")=="none"){div.show(showtime);}
else{div.hide(showtime);}}
this.formtarget=function(formid,isOpenNew){var formobj=$("#"+formid);if(isOpenNew){formobj.attr("target","_blank");}
else{formobj.attr("target","");}}
this.divObjShowOrHide=function(div){var showtime=0;if(arguments[1]!=undefined){showtime=arguments[1];}
if(div.css("display")=="none"){div.show(showtime);}
else{div.hide(showtime);}}
this.stat=function(p){var url="";if(p.type=="hit"){url="http://stat.tjkx.com/hits/index.ashx?page="+p.p1+"&id="+p.p2;}
if(url!=""){var img=window["stat"+(new Date()).getTime()]=new Image();if(url.indexOf("?",0)<0){url+="?";}
img.src=url+"&t="+(new Date()).getTime();}}
this.showAdv=function(id){document.write("<script type='text/javascript' src='http://gg.tjkx.com/html/?id="+id+"&r="+(new Date()).getTime()+"'"+"></script"+">");}
this.renderAdv=function(obj){if(obj.Items.length==0)return;var advArray=[];for(var i=0;i<obj.Items.length;i++){advArray[i]={l:obj.Items[i].Length,c:obj.Items[i].Html};}
var idx=(advArray.length==1||!obj.IsRandom)?0:parseInt((Math.random()*advArray.length));var panel="AdvRandom"+parseInt((Math.random()*1000000));var timeID;var time=advArray[idx].l;var showDetail=function(){if(advArray.length==1){document.write(advArray[idx].c);}
else{if(!timeID){document.write("<div id='"+panel+"'>"+advArray[idx].c+"</div>");}
else{$("#"+panel).html(advArray[idx].c);clearInterval(timeID);}
idx<(advArray.length-1)?idx++:idx=0;autoPlay();}};var autoPlay=function(){timeID=window.setInterval(showDetail,time*6000);};switch(obj.Style){case 0:{showDetail();break;}
default:;}};this.showVote=function(obj){document.write("<script type='text/javascript' src='http://vote.tjkx.com/ModuleDeal.aspx?id="+obj.id+"&ms="+obj.ms+"&w="+obj.w+"&h="+obj.h+"&bc="+obj.bgcolor+"&ist="+obj.showtitle+"&stid="+obj.stid+"&sid="+obj.sid+"&r="+(new Date()).getTime()+"&pbid="+obj.pbid+"&qid="+obj.qid+"'></script>");};

this.shareTo=function(style){var html;switch(style){
case 1:html='<div class="bdsharebuttonbox"><a href="#" class="bds_more" data-cmd="more">分享到：</a><a href="#" class="bds_tsina" data-cmd="tsina" title="分享到新浪微博">新浪微博</a><a href="#" class="bds_qzone" data-cmd="qzone" title="分享到QQ空间">QQ空间</a><a href="#" class="bds_tqq" data-cmd="tqq" title="分享到腾讯微博">腾讯微博</a><a href="#" class="bds_renren" data-cmd="renren" title="分享到人人网">人人网</a><a href="#" class="bds_weixin" data-cmd="weixin" title="分享到微信">微信</a></div><script>window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"32"},"share":{"bdSize":16},"image":{"viewList":["qzone","tsina","tqq","renren","weixin"],"viewText":"分享到：","viewSize":"16"},"selectShare":{"bdContainerClass":null,"bdSelectMiniList":["qzone","tsina","tqq","renren","weixin"]}};with(document)0[(getElementsByTagName(\'head\')[0]||body).appendChild(createElement(\'script\')).src=\'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=\'+~(-new Date()/36e5)];</script>';
break;
case 2:html='<script>window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"32"},"slide":{"type":"slide","bdImg":"6","bdPos":"right","bdTop":"100"},"image":{"viewList":["qzone","tsina","tqq","renren","weixin"],"viewText":"分享到：","viewSize":"16"},"selectShare":{"bdContainerClass":null,"bdSelectMiniList":["qzone","tsina","tqq","renren","weixin"]}};with(document)0[(getElementsByTagName(\'head\')[0]||body).appendChild(createElement(\'script\')).src=\'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=\'+~(-new Date()/36e5)];</script>';
break;
case 3:html='<div class="bdsharebuttonbox"><a href="#" class="bds_more" data-cmd="more"></a><a href="#" class="bds_tsina" data-cmd="tsina" title="分享到新浪微博"></a><a href="#" class="bds_qzone" data-cmd="qzone" title="分享到QQ空间"></a><a href="#" class="bds_tqq" data-cmd="tqq" title="分享到腾讯微博"></a><a href="#" class="bds_renren" data-cmd="renren" title="分享到人人网"></a><a href="#" class="bds_weixin" data-cmd="weixin" title="分享到微信"></a></div><script>window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"16"},"share":{},"image":{"viewList":["qzone","tsina","tqq","renren","weixin"],"viewText":"分享到：","viewSize":"16"},"selectShare":{"bdContainerClass":null,"bdSelectMiniList":["qzone","tsina","tqq","renren","weixin"]}};with(document)0[(getElementsByTagName(\'head\')[0]||body).appendChild(createElement(\'script\')).src=\'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=\'+~(-new Date()/36e5)];</script>';
break;
case 4:html='<div id="bdshare" class="bdshare_t bds_tools get-codes-bdshare"><a class="bds_qzone"></a><a class="bds_tsina"></a><a class="bds_tqq"></a><a class="bds_renren"></a><a class="shareCount"></a></div><script type="text/javascript" id="bdshare_js" data="type=tools&amp;uid=6484985" ></script><script type="text/javascript" id="bdshell_js"></script><script type="text/javascript">document.getElementById("bdshell_js").src = "http://bdimg.share.baidu.com/static/js/shell_v2.js?cdnversion=" + new Date().getHours();</script>';
break;
case 5:html='<div class="bdsharebuttonbox"><a href="#" class="bds_more" data-cmd="more"></a><a href="#" class="bds_tsina" data-cmd="tsina" title="分享到新浪微博"></a><a href="#" class="bds_qzone" data-cmd="qzone" title="分享到QQ空间"></a><a href="#" class="bds_tqq" data-cmd="tqq" title="分享到腾讯微博"></a><a href="#" class="bds_renren" data-cmd="renren" title="分享到人人网"></a><a href="#" class="bds_weixin" data-cmd="weixin" title="分享到微信"></a></div><script>window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"32"},"share":{},"image":{"viewList":["qzone","tsina","tqq","renren","weixin"],"viewText":"分享到：","viewSize":"16"},"selectShare":{"bdContainerClass":null,"bdSelectMiniList":["qzone","tsina","tqq","renren","weixin"]}};with(document)0[(getElementsByTagName("head")[0]||body).appendChild(createElement("script")).src="http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion="+~(-new Date()/36e5)];</script>';}
document.write(html);}
this.baiduTongji=function(){var _bdhmProtocol=(("https:"==document.location.protocol)?" https://":" http://");document.write(unescape("%3Cspan style='display:none;'%3E"));document.write(unescape("%3Cscript src='"+_bdhmProtocol+"hm.baidu.com/h.js%3F20764dac33abb1e716a771d3a6c91b96' type='text/javascript'%3E%3C/script%3E"));

/* document.write(unescape("%3Cscript src='http://s15.cnzz.com/stat.php?id=3661402&web_id=3661402' language='JavaScript'%3E%3C/script%3E")); */

document.write(unescape("%3C/span%3E"));
}
this.showRelatedNewsForV6=function(p){if(typeof(p)=="undefined")return;var lst="";for(var i=0;i<p.Links.length;i++){lst+="<li><a href='"+p.Links[i].Url+"' target='_blank' class='p02' style='color:blue;'>"+p.Links[i].Title+"</a></li>";}
var k=p.Key;if(k==""){var idx=document.title.indexOf("—",0);k=(idx>0)?document.title.substr(0,idx):document.title;}
lst+="<li style='list-style-type:none;'>&emsp;&emsp;<a href='http://info.tjkx.com/so/tohtm.aspx?key="+window.escape(k)+"' target='_blank' class='p02' style='color:black;'>查看更多关于<span style='color:red;'>“"+k+"”</span>的食品资讯 &gt;&gt;</a></li>";lst="<tr><td style='padding-left:100px; line-height:25px;'><a href='http://info.tjkx.com/' target='_blank' class='p04' style='font-size:14px;'><strong>新版食品资讯频道编辑推荐：</strong></a><ul>"+lst+"</ul></td></tr>";$(lst).insertBefore($("td .td16").parent());}}
function RedirectPath(){};var v8=new TjkxV8();v8.setCookie("dpi",screen.availWidth+","+screen.availHeight,30);if(location.href.toLowerCase().indexOf("http://info.tjkx.com/news/")==0){var _v6_idx=document.title.indexOf("—",0);if(_v6_idx==-1)_v6_idx=document.title.indexOf("【",0);var _v6_key=(_v6_idx>0)?document.title.substr(0,_v6_idx):document.title;document.write(unescape("%3Cscript src='http://gate.tjkx.com/so/RelatedNewsForV6.ashx?title="+window.escape(_v6_key)+"' type='text/javascript'%3E%3C/script%3E"));};





/**
 * Boxy 0.1.4 - Facebook-style dialog, with frills
 *
 * (c) 2008 Jason Frame
 * Licensed under the MIT License (LICENSE)
 */ 
/*
 * jQuery plugin
 *
 * Options:
 *   message: confirmation message for form submit hook (default: "Please confirm:")
 * 
 * Any other options - e.g. 'clone' - will be passed onto the boxy constructor (or
 * Boxy.load for AJAX operations)
 */
jQuery.fn.boxy = function(options) {
    options = options || {};
    return this.each(function() {      
        var node = this.nodeName.toLowerCase(), self = this;
        if (node == 'a') {
            jQuery(this).click(function() {
                var active = Boxy.linkedTo(this),
                    href = this.getAttribute('href'),
                    localOptions = jQuery.extend({actuator: this, title: this.title}, options);
                    
                if (active) {
                    active.show();
                } else if (href.indexOf('#') >= 0) {
                    var content = jQuery(href.substr(href.indexOf('#'))),
                        newContent = content.clone(true);
                    content.remove();
                    localOptions.unloadOnHide = false;
                    new Boxy(newContent, localOptions);
                } else { // fall back to AJAX; could do with a same-origin check
                    if (!localOptions.cache) localOptions.unloadOnHide = true;
                    Boxy.load(this.href, localOptions);
                }
                
                return false;
            });
        } else if (node == 'form') {
            jQuery(this).bind('submit.boxy', function() {
                Boxy.confirm(options.message || '请确认：', function() {
                    jQuery(self).unbind('submit.boxy').submit();
                });
                return false;
            });
        }
    });
};

//
// Boxy Class

function Boxy(element, options) {
    
    this.boxy = jQuery(Boxy.WRAPPER);
    jQuery.data(this.boxy[0], 'boxy', this);
    
    this.visible = false;
    this.options = jQuery.extend({}, Boxy.DEFAULTS, options || {});
    
    if (this.options.modal) {
        this.options = jQuery.extend(this.options, {center: true, draggable: false});
    }
    
    // options.actuator == DOM element that opened this boxy
    // association will be automatically deleted when this boxy is remove()d
    if (this.options.actuator) {
        jQuery.data(this.options.actuator, 'active.boxy', this);
    }
    
    this.setContent(element || "<div></div>");
    this._setupTitleBar();
    
    this.boxy.css('display', 'none').appendTo(document.body);
    this.toTop();

    if (this.options.fixed) {
        if (jQuery.browser.msie && jQuery.browser.version < 7) {
            this.options.fixed = false; // IE6 doesn't support fixed positioning
        } else {
            this.boxy.addClass('fixed');
        }
    }
    
    if (this.options.center && Boxy._u(this.options.x, this.options.y)) {
        this.center();
    } else {
        this.moveTo(
            Boxy._u(this.options.x) ? this.options.x : Boxy.DEFAULT_X,
            Boxy._u(this.options.y) ? this.options.y : Boxy.DEFAULT_Y
        );
    }
    
    if (this.options.show) this.show();

};

Boxy.EF = function() {};

jQuery.extend(Boxy, {
    
    WRAPPER:    "<table cellspacing='0' cellpadding='0' border='0' class='boxy-wrapper'>" +
                "<tr><td class='top-left'></td><td class='top'></td><td class='top-right'></td></tr>" +
                "<tr><td class='left'></td><td class='boxy-inner'></td><td class='right'></td></tr>" +
                "<tr><td class='bottom-left'></td><td class='bottom'></td><td class='bottom-right'></td></tr>" +
                "</table>",
    
    DEFAULTS: {
        title:                  null,           // titlebar text. titlebar will not be visible if not set.
        closeable:              true,           // display close link in titlebar?
        draggable:              true,           // can this dialog be dragged?
        clone:                  false,          // clone content prior to insertion into dialog?
        actuator:               null,           // element which opened this dialog
        center:                 true,           // center dialog in viewport?
        show:                   true,           // show dialog immediately?
        modal:                  false,          // make dialog modal?
        fixed:                  true,           // use fixed positioning, if supported? absolute positioning used otherwise
        closeText:              '关闭',      // text to use for default close link
        unloadOnHide:           false,          // should this dialog be removed from the DOM after being hidden?
        clickToFront:           false,          // bring dialog to foreground on any click (not just titlebar)?
        behaviours:             Boxy.EF,        // function used to apply behaviours to all content embedded in dialog.
        afterDrop:              Boxy.EF,        // callback fired after dialog is dropped. executes in context of Boxy instance.
        afterShow:              Boxy.EF,        // callback fired after dialog becomes visible. executes in context of Boxy instance.
        afterHide:              Boxy.EF,        // callback fired after dialog is hidden. executed in context of Boxy instance.
        beforeUnload:           Boxy.EF         // callback fired after dialog is unloaded. executed in context of Boxy instance.
    },
    
    DEFAULT_X:          50,
    DEFAULT_Y:          50,
    zIndex:             1337,
    dragConfigured:     false, // only set up one drag handler for all boxys
    resizeConfigured:   false,
    dragging:           null,
    
    // load a URL and display in boxy
    // url - url to load
    // options keys (any not listed below are passed to boxy constructor)
    //   type: HTTP method, default: GET
    //   cache: cache retrieved content? default: false
    //   filter: jQuery selector used to filter remote content
    load: function(url, options) {
        
        options = options || {};
        
        var ajax = {
            url: url, type: 'GET', dataType: 'html', cache: false, success: function(html) {
                html = jQuery(html);
                if (options.filter) html = jQuery(options.filter, html);
                new Boxy(html, options);
            }
        };
        
        jQuery.each(['type', 'cache'], function() {
            if (this in options) {
                ajax[this] = options[this];
                delete options[this];
            }
        });
        
        jQuery.ajax(ajax);
        
    },
    
    // allows you to get a handle to the containing boxy instance of any element
    // e.g. <a href='#' onclick='alert(Boxy.get(this));'>inspect!</a>.
    // this returns the actual instance of the boxy 'class', not just a DOM element.
    // Boxy.get(this).hide() would be valid, for instance.
    get: function(ele) {
        var p = jQuery(ele).parents('.boxy-wrapper');
        return p.length ? jQuery.data(p[0], 'boxy') : null;
    },
    
    // returns the boxy instance which has been linked to a given element via the
    // 'actuator' constructor option.
    linkedTo: function(ele) {
        return jQuery.data(ele, 'active.boxy');
    },
    
    // displays an alert box with a given message, calling optional callback
    // after dismissal.
    alert: function(message, callback, options) {
        return Boxy.ask(message, ['确认'], callback, options);
    },
    
    // displays an alert box with a given message, calling after callback iff
    // user selects OK.
    confirm: function(message, after, options) {
        return Boxy.ask(message, ['确认', '取消'], function(response) {
            if (response == '确认') after();
        }, options);
    },
    
    // asks a question with multiple responses presented as buttons
    // selected item is returned to a callback method.
    // answers may be either an array or a hash. if it's an array, the
    // the callback will received the selected value. if it's a hash,
    // you'll get the corresponding key.
    ask: function(question, answers, callback, options) {
        
        options = jQuery.extend({modal: true, closeable: false},
                                options || {},
                                {show: true, unloadOnHide: true});
        
        var body = jQuery('<div></div>').append(jQuery('<div class="question"></div>').html(question));
        
        // ick
        var map = {}, answerStrings = [];
        if (answers instanceof Array) {
            for (var i = 0; i < answers.length; i++) {
                map[answers[i]] = answers[i];
                answerStrings.push(answers[i]);
            }
        } else {
            for (var k in answers) {
                map[answers[k]] = k;
                answerStrings.push(answers[k]);
            }
        }
        
        var buttons = jQuery('<form class="answers"></form>');
        buttons.html(jQuery.map(answerStrings, function(v) {
			//add by zhangxinxu 给确认对话框的确认取消按钮添加不同的class
			var btn_index; 	
			if(v === "确认"){
				btn_index = 1;
			}else if(v === "取消"){
				btn_index = 2;
			}else{
				btn_index = 3;	
			}
			//add end.  include the 'btn_index' below 
            return "<input class='boxy-btn"+btn_index+"' type='button' value='" + v + "' />";
        }).join(' '));
        
        jQuery('input[type=button]', buttons).click(function() {
            var clicked = this;
            Boxy.get(this).hide(function() {
                if (callback) callback(map[clicked.value]);
            });
        });
        
        body.append(buttons);
        
        new Boxy(body, options);
        
    },
    
    // returns true if a modal boxy is visible, false otherwise
    isModalVisible: function() {
        return jQuery('.boxy-modal-blackout').length > 0;
    },
    
    _u: function() {
        for (var i = 0; i < arguments.length; i++)
            if (typeof arguments[i] != 'undefined') return false;
        return true;
    },
    
    _handleResize: function(evt) {
        var d = jQuery(document);
        jQuery('.boxy-modal-blackout').css('display', 'none').css({
            width: d.width(), height: d.height()
        }).css('display', 'block');
    },
    
    _handleDrag: function(evt) {
        var d;
        if (d = Boxy.dragging) {
            d[0].boxy.css({left: evt.pageX - d[1], top: evt.pageY - d[2]});
        }
    },
    
    _nextZ: function() {
        return Boxy.zIndex++;
    },
    
    _viewport: function() {
        var d = document.documentElement, b = document.body, w = window;
        return jQuery.extend(
            jQuery.browser.msie ?
                { left: b.scrollLeft || d.scrollLeft, top: b.scrollTop || d.scrollTop } :
                { left: w.pageXOffset, top: w.pageYOffset },
            !Boxy._u(w.innerWidth) ?
                { width: w.innerWidth, height: w.innerHeight } :
                (!Boxy._u(d) && !Boxy._u(d.clientWidth) && d.clientWidth != 0 ?
                    { width: d.clientWidth, height: d.clientHeight } :
                    { width: b.clientWidth, height: b.clientHeight }) );
    }

});

Boxy.prototype = {
    
    // Returns the size of this boxy instance without displaying it.
    // Do not use this method if boxy is already visible, use getSize() instead.
    estimateSize: function() {
        this.boxy.css({visibility: 'hidden', display: 'block'});
        var dims = this.getSize();
        this.boxy.css('display', 'none').css('visibility', 'visible');
        return dims;
    },
                
    // Returns the dimensions of the entire boxy dialog as [width,height]
    getSize: function() {
        return [this.boxy.width(), this.boxy.height()];
    },
    
    // Returns the dimensions of the content region as [width,height]
    getContentSize: function() {
        var c = this.getContent();
        return [c.width(), c.height()];
    },
    
    // Returns the position of this dialog as [x,y]
    getPosition: function() {
        var b = this.boxy[0];
        return [b.offsetLeft, b.offsetTop];
    },
    
    // Returns the center point of this dialog as [x,y]
    getCenter: function() {
        var p = this.getPosition();
        var s = this.getSize();
        return [Math.floor(p[0] + s[0] / 2), Math.floor(p[1] + s[1] / 2)];
    },
                
    // Returns a jQuery object wrapping the inner boxy region.
    // Not much reason to use this, you're probably more interested in getContent()
    getInner: function() {
        return jQuery('.boxy-inner', this.boxy);
    },
    
    // Returns a jQuery object wrapping the boxy content region.
    // This is the user-editable content area (i.e. excludes titlebar)
    getContent: function() {
        return jQuery('.boxy-content', this.boxy);
    },
    
    // Replace dialog content
    setContent: function(newContent) {
        newContent = jQuery(newContent).css({display: 'block'}).addClass('boxy-content');
        if (this.options.clone) newContent = newContent.clone(true);
        this.getContent().remove();
        this.getInner().append(newContent);
        this._setupDefaultBehaviours(newContent);
        this.options.behaviours.call(this, newContent);
        return this;
    },
    
    // Move this dialog to some position, funnily enough
    moveTo: function(x, y) {
        this.moveToX(x).moveToY(y);
        return this;
    },
    
    // Move this dialog (x-coord only)
    moveToX: function(x) {
        if (typeof x == 'number') this.boxy.css({left: x});
        else this.centerX();
        return this;
    },
    
    // Move this dialog (y-coord only)
    moveToY: function(y) {
        if (typeof y == 'number') this.boxy.css({top: y});
        else this.centerY();
        return this;
    },
    
    // Move this dialog so that it is centered at (x,y)
    centerAt: function(x, y) {
        var s = this[this.visible ? 'getSize' : 'estimateSize']();
        if (typeof x == 'number') this.moveToX(x - s[0] / 2);
        if (typeof y == 'number') this.moveToY(y - s[1] / 2);
        return this;
    },
    
    centerAtX: function(x) {
        return this.centerAt(x, null);
    },
    
    centerAtY: function(y) {
        return this.centerAt(null, y);
    },
    
    // Center this dialog in the viewport
    // axis is optional, can be 'x', 'y'.
    center: function(axis) {
        var v = Boxy._viewport();
        var o = this.options.fixed ? [0, 0] : [v.left, v.top];
        if (!axis || axis == 'x') this.centerAt(o[0] + v.width / 2, null);
        if (!axis || axis == 'y') this.centerAt(null, o[1] + v.height / 2);
        return this;
    },
    
    // Center this dialog in the viewport (x-coord only)
    centerX: function() {
        return this.center('x');
    },
    
    // Center this dialog in the viewport (y-coord only)
    centerY: function() {
        return this.center('y');
    },
    
    // Resize the content region to a specific size
    resize: function(width, height, after) {
        if (!this.visible) return;
        var bounds = this._getBoundsForResize(width, height);
        this.boxy.css({left: bounds[0], top: bounds[1]});
        this.getContent().css({width: bounds[2], height: bounds[3]});
        if (after) after(this);
        return this;
    },
    
    // Tween the content region to a specific size
    tween: function(width, height, after) {
        if (!this.visible) return;
        var bounds = this._getBoundsForResize(width, height);
        var self = this;
        this.boxy.stop().animate({left: bounds[0], top: bounds[1]});
        this.getContent().stop().animate({width: bounds[2], height: bounds[3]}, function() {
            if (after) after(self);
        });
        return this;
    },
    
    // Returns true if this dialog is visible, false otherwise
    isVisible: function() {
        return this.visible;    
    },
    
    // Make this boxy instance visible
    show: function() {
        if (this.visible) return;
        if (this.options.modal) {
            var self = this;
            if (!Boxy.resizeConfigured) {
                Boxy.resizeConfigured = true;
                jQuery(window).resize(function() { Boxy._handleResize(); });
            }
            this.modalBlackout = jQuery('<div class="boxy-modal-blackout"></div>')
                .css({zIndex: Boxy._nextZ(),
                      opacity: 0.7,
                      width: jQuery(document).width(),
                      height: jQuery(document).height()})
                .appendTo(document.body);
            this.toTop();
            if (this.options.closeable) {
                jQuery(document.body).bind('keypress.boxy', function(evt) {
                    var key = evt.which || evt.keyCode;
                    if (key == 27) {
                        self.hide();
                        jQuery(document.body).unbind('keypress.boxy');
                    }
                });
            }
        }
        this.boxy.stop().css({opacity: 1}).show();
        this.visible = true;
        this._fire('afterShow');
        return this;
    },
    
    // Hide this boxy instance
    hide: function(after) {
        if (!this.visible) return;
        var self = this;
        if (this.options.modal) {
            jQuery(document.body).unbind('keypress.boxy');
            this.modalBlackout.animate({opacity: 0}, function() {
                jQuery(this).remove();
            });
        }
        this.boxy.stop().animate({opacity: 0}, 300, function() {
            self.boxy.css({display: 'none'});
            self.visible = false;
            self._fire('afterHide');
            if (after) after(self);
            if (self.options.unloadOnHide) self.unload();
        });
        return this;
    },
    
    toggle: function() {
        this[this.visible ? 'hide' : 'show']();
        return this;
    },
    
    hideAndUnload: function(after) {
        this.options.unloadOnHide = true;
        this.hide(after);
        return this;
    },
    
    unload: function() {
        this._fire('beforeUnload');
        this.boxy.remove();
        if (this.options.actuator) {
            jQuery.data(this.options.actuator, 'active.boxy', false);
        }
    },
    
    // Move this dialog box above all other boxy instances
    toTop: function() {
        this.boxy.css({zIndex: Boxy._nextZ()});
        return this;
    },
    
    // Returns the title of this dialog
    getTitle: function() {
        return jQuery('> .title-bar h2', this.getInner()).html();
    },
    
    // Sets the title of this dialog
    setTitle: function(t) {
        jQuery('> .title-bar h2', this.getInner()).html(t);
        return this;
    },
    
    //
    // Don't touch these privates
    
    _getBoundsForResize: function(width, height) {
        var csize = this.getContentSize();
        var delta = [width - csize[0], height - csize[1]];
        var p = this.getPosition();
        return [Math.max(p[0] - delta[0] / 2, 0),
                Math.max(p[1] - delta[1] / 2, 0), width, height];
    },
    
    _setupTitleBar: function() {
        if (this.options.title) {
            var self = this;
            var tb = jQuery("<div class='title-bar'></div>").html("<h2>" + this.options.title + "</h2>");
            if (this.options.closeable) {
                tb.append(jQuery("<a href='#' class='close'></a>").html(this.options.closeText));
            }
            if (this.options.draggable) {
                tb[0].onselectstart = function() { return false; }
                tb[0].unselectable = 'on';
                tb[0].style.MozUserSelect = 'none';
                if (!Boxy.dragConfigured) {
                    jQuery(document).mousemove(Boxy._handleDrag);
                    Boxy.dragConfigured = true;
                }
                tb.mousedown(function(evt) {
                    self.toTop();
                    Boxy.dragging = [self, evt.pageX - self.boxy[0].offsetLeft, evt.pageY - self.boxy[0].offsetTop];
                    jQuery(this).addClass('dragging');
                }).mouseup(function() {
                    jQuery(this).removeClass('dragging');
                    Boxy.dragging = null;
                    self._fire('afterDrop');
                });
            }
            this.getInner().prepend(tb);
            this._setupDefaultBehaviours(tb);
        }
    },
    
    _setupDefaultBehaviours: function(root) {
        var self = this;
        if (this.options.clickToFront) {
            root.click(function() { self.toTop(); });
        }
        jQuery('.close', root).click(function() {
            self.hide();
            return false;
        }).mousedown(function(evt) { evt.stopPropagation(); });
    },
    
    _fire: function(event) {
        this.options[event].call(this);
    }
    
};