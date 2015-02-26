    // //输入框字数提示插件工具
    // function str(){
    //     var val = $('.plform textarea').val().length;
    //     if (val<140) {
    //       var str = 140-val;
    //       $('.string_more span').html(str);
    //     }else{
    //         $('.string_more span').html(0);
    //         $('.plform textarea').val($('.plform textarea').val().substr(0,140))
    //         alert('140个字已经够了');
    //     }
    // }
    // //判断输入字数
    // if ($('.plform textarea').length > 0) {
    //     $('.plform textarea').keyup(str);
    //     $('.plform textarea').change(str);
    // };
    //获取评论数
    $('#com_count').html($('input[name="comments"]').val());
    //获取点评人数
    $('#changyan_count_unit').html($('input[name="people_comments"]').val());
    //获取当前链接
    $('.qq_x_url').attr('href','http://app.39yst.com/?app=member&controller=index&action=qq_login&x_url='+window.location.href)
    //获取当前链接
    $('.plform input[name="topicid"]').val(window.location.href.split('/')[window.location.href.split('/').length-1].split('.')[0]);
    //判断cookie，验证是否登录
    if($.cookie('cmstop_userid') != null ) {
        $.ajax({
            url:"http://app.39yst.com/?app=member&controller=index&action=ajaxlogin",
            dataType:"jsonp",
            jsonp:"jsoncallback",
            success:function(data){
                if(data.state == true){
                    $('#denglu_Box').html('');
                    $('#loginzhuce').html('<a href="http://app.39yst.com/?app=member&controller=panel&action=index" class="welcome" title="'+data.username+'" target="_blank">欢迎，'+data.username.substr(0,5)+'</a> <a href="http://app.39yst.com/?app=member&controller=index&action=logout" class="out">退出</a>');
                    if(data.photo == ''){
                        $('#photo').html('<a href="http://app.39yst.com/?app=member&controller=panel&action=expertavatar" target="_blank"><img src="http://img.39yst.com/templates/39yst/comment/images/touxiang.jpg" width="50" height="50" /></a>');
                    } else {
                        $('#photo').html('<a href="http://app.39yst.com/?app=member&controller=panel&action=index" target="_blank"><img src="'+data.photo+'" width="50" height="50" /></a>');
                    }
                    $('.biaoqing input[name="x_url"]').val(window.location.href);                 
                    $('#plbtn').attr({'class':'plbtn_red','value':''});
                } 
            }
        });
    }
    //登陆数据验证
    function ajax_login(){
        var login_input = document.getElementById('logins').getElementsByTagName('input');
        $.ajax({
            type:"get",
            url:"http://passport.39yst.com/api.php?op=login",
            data:{"username":login_input[0].value,"password":login_input[1].value,'app_key':'3B62D75B-A024-9B67-7E8B-B5AC46BDAEBB'},
            dataType:"jsonp",
            jsonp:"jsoncallback",
            success:function(data){
                if(data.status > 0){
                    $('#denglu_Box').html('');
                    $('#loginzhuce').html('<a href="http://app.39yst.com/?app=member&controller=panel&action=index" class="welcome" title="'+data.username+'" target="_blank">欢迎，'+data.username.substr(0,5)+'</a> <a href="http://app.39yst.com/?app=member&controller=index&action=logout" class="out">退出</a>');
                    if(data.photo == 'http:\/\/img.39yst.com\/images\/nohead.jpg'){
                        $('#photo').html('<a href="http://app.39yst.com/?app=member&controller=panel&action=expertavatar" target="_blank"><img src="http://img.39yst.com/templates/39yst/comment/images/touxiang.jpg" width="50" height="50" /></a>');
                    } else {
                        $('#photo').html('<a href="http://app.39yst.com/?app=member&controller=panel&action=index" target="_blank"><img src="'+data.photo+'" width="50" height="50" /></a>');
                    }
                    $('.biaoqing input[name="x_url"]').val(window.location.href);                 
                    $('#plbtn').attr({'class':'plbtn_red','value':''})
                    popup.select.close(layel_hide);
                    $('.biaoqing span').html(data.message);
                    timeout();
                }else{
                    $('#layel .red').eq(0).html(data.error);
                }
            }
        });
    }
    $('#plbtn').click(function(event) {
        if ($('#plbtn').attr('class') == 'plbtn') {
            popup.select.show(layel_show)
        }else{
            if ($('.plform textarea[name="content"]').val() == '') {
                $('.biaoqing span').html('评论不能为空')
                timeout()
                return false;
            }else{
                $.ajax({
                    type:"get",
                    url:"http://app.39yst.com/?app=comment&controller=comment&action=ajax_add",
                    data:{"content":$('.plform textarea[name="content"]').val(),'topicid':window.location.href.split('/')[window.location.href.split('/').length-1].split('.')[0]},
                    dataType:"jsonp",
                    jsonp:"jsoncallback",
                    success:function(data){
                        if(data.state == true){
                            $('.biaoqing span').html('评论成功');
                            $('.plform textarea[name="content"]').val('')
                            timeout();
                        }else{
                            $('.biaoqing span').html(data.error);
                            timeout();
                        }
                    }
                });
            }
        }
    });
    //定时取消提示
    function timeout(){
        var t = setTimeout(function(){$('.biaoqing span').html('')},1000);
    }
    //登陆表单验证
    function login() {
       var login_input = document.getElementById('logins').getElementsByTagName('input');
       if (login_input[0].value == "邮箱/手机号") {
        $('#layel .red').eq(0).html('请输入账号');
        return
       }else if (login_input[1].value == "输入密码") {
        $('#layel .red').eq(0).html('请输入密码');
        return
       }else{
          ajax_login();
       };
    }
    //弹层插件工具
    var popup = {
        select:{
            show:function(callback,box){
                if (document.getElementById('popup_select_tan') != undefined) return;
                var select_width = document.body.clientWidth || document.documentElement.clientWidth,
                    select_height = document.body.clientHeight || document.documentElement.clientHeight ;
                
                var popup_select_style = document.createElement('style');
                    popup_select_style.type = "text/css";
                var popup_select_style_text = '#popup_select_tan{position:absolute;top:0;width:100%;height:100%;background:#000;opacity:0.5;filter:alpha(opacity=50);z-index:1000;width:'+select_width+'px;height:'+select_height+'px;}'
                if (popup_select_style.styleSheet) { //IE
                  popup_select_style.styleSheet.cssText = popup_select_style_text;
                } else { 
                  popup_select_style.innerHTML = popup_select_style_text;
                }
                document.body.appendChild(popup_select_style);
                var popup_select_tan = document.createElement('div');
                popup_select_tan.id = 'popup_select_tan';
                document.body.appendChild(popup_select_tan);
                if (typeof callback != 'undefined') callback();  
            } , 
            close:function(callback){
                if (typeof callback != 'undefined') callback();  
                if (document.getElementById('popup_select_tan') != undefined) {
                    document.body.removeChild(document.getElementById('popup_select_tan'))
                };
                if (document.getElementById('popup_select_box') != undefined) {
                    document.body.removeChild(document.getElementById('popup_select_box'))
                };
                var a = document.body.childNodes;
                for (var i = 0 ; i < a.length; i++) {
                    if (a[i].nodeType==1 && a[i].type == "text/css") {
                        document.body.removeChild(a[i]);
                    };                 
                }; 
                if (typeof callback != 'undefined') callback(); 
            }
        }
    };
    function layel_hide(){
        $('#layel').hide()
    }
    function layel_show(){
        $('#layel').show();
    }
    // if ($('.biaoqing .icon1').length>0)
    //     $('.biaoqing .icon2').click(function(){
    //         $('.pic_list').toggle();
    //     });
    //微信推送内容
    weixin_random([
        ['你还长期步行吗 看完这个你绝对会被吓死',36],
        ['过年了，这7种东西可不敢随便送人：送错了会闯祸',37],
        ['女人老不老就看3部位，要年轻莫做这些事 ',38],
        ['早上千万别再洗头了 已经死了5个人',39],
        ['上厕所拉不出？把那儿拍三下就通了',40],
        ['五种人注定得癌症，太可怕了',41],
        ['六种性格的人会影响寿命，你在其中么',42],
        ['指甲别剪成弧形的 这么多年的习惯竟然是错的',43],
        ['春节到了要警惕自身的8个小动作，当心把财神爷吓跑了！',44],
        ['长期单身会短命？不是吓你，11类人最容易短寿，希望没有你',45]
    ])
    function weixin_random(arr){
        var len = arr.length;
        var tit = arr[Math.ceil(Math.random()*len)-1][0]
        var num = arr[Math.ceil(Math.random()*len)-1][1]
        $('.video').after('<div style="text-align:center; height:86px; width: 610px;margin-top:10px;"><dl style=" height:86px; width: 510px;  float:left; text-align:right; margin-right:10px; line-height: 30px; font-size:14px;margin-top: 20px;"><dt style="height: 29px;">'+tit+'</dt><dd style="font-size:14px;">详情请关注微信号：<div style="color: #c00;display: inline;">love39yst</div> 直接扫描右侧二维码关注后回复【'+num+'】</dd></dl><div style=" float:left;height:86px; width:86px;"><img src="http://img.39yst.com/templates/39yst/images/wx.jpg" width="86" height="86" alt="关注39养生堂微信"></div></div>')
    }