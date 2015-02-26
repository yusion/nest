/*失焦获焦*/
function inputTipText() {
	$("input[class*=common_text]")
			.each(function() {
				var oldVal = $(this).val();
				$(this)
						.css({"color": "#999"})
						.focus(function() {
							if ($(this).val() != oldVal) {
								$(this).css({"color": "#333"})
							} else {
								$(this).val("").css({"color": "#999"})
							}
							$(this).css({"border": "1px solid #3b5998"})
						})
						.blur(function() {
							if ($(this).val() == "") {
								$(this).val(oldVal).css({"color": "#999"})
							}
							$(this).css({"border": "1px solid #dfdfdf"})
						})
						.keydown(function() {
							$(this).css({"color": "#333"})
						});

			});
}

$(function() {
	inputTipText();
})

/*默认显示一点内容点击全部显示*/
$(function() {
	var timer = [];
	jQuery(".n_drop-more").mouseover(function() {
		if (!jQuery(this).hasClass("hover")) {
			jQuery(this).addClass("hover");
			$(".n_drop").show();
			jQuery(this).find("#drop_nav").stop(true, true).slideDown(230);
		}
		window.clearTimeout(timer[0]);
	}).mouseleave(function() {
		if (jQuery(this).hasClass("hover")) {
			var _this = this;
			timer[0] = window.setTimeout(function() {
				jQuery(_this).removeClass("hover");
				jQuery(_this).find("#drop_nav").stop(true, true).slideUp(150);
			}, 300);
		}
	});
});
/**/
$(function() {
	var timer = [];
	jQuery(".article-tools-share").mouseover(function() {
		if (!jQuery(this).hasClass("hover")) {
			jQuery(this).addClass("hover");
			jQuery(this).find("#share_pop").stop(true, true).slideDown(230);
		}
		window.clearTimeout(timer[0]);
	}).mouseleave(function() {
		if (jQuery(this).hasClass("hover")) {
			var _this = this;
			timer[0] = window.setTimeout(function() {
				jQuery(_this).removeClass("hover");
				jQuery(_this).find("#share_pop").stop(true, true).slideUp(150);
			}, 300);
		}
	});
});

var sharefloat = $('.sharefloat');
function backtoTopLeft() {
	var btLeft = $(window).width() / 2 + 172;
	if (btLeft <= 570) {
		sharefloat.css({'left': 955});
	} else {
		sharefloat.css({'left': btLeft});
	}
}
backtoTopLeft();
$(window).resize(backtoTopLeft);

$(".article-tools").css({display: 'none'});
var initTop = 0;
$(window).scroll(function() {
	var scrollTop = $(document).scrollTop();
	if (scrollTop > initTop || scrollTop < 188) {
		$('#article-tools').removeAttr("style");
		$(".article-tools").css({display: 'none'});
	} else {
		$(".article-tools").css({display: 'block'});
		$("#article-tools").css({display: 'block', position: "fixed", top: "0"});
	}
	initTop = scrollTop;
});

$('.gotop02').show();
$('.gotop02-con').hide();
$('.favo').css({'border-bottom': '1px solid #ccd3e4'});
$(window).scroll(function() {
	var scrollTop = $(document).scrollTop();
	if (scrollTop >= 300) {
		$('.favo').css({'border-bottom': 'none'});
		$('.gotop02-con').show();
	} else {
		$('.favo').css({'border-bottom': '1px solid #ccd3e4'});
		$('.gotop02-con').hide();
	}
});
$('.gotop02-con').click(function() {
	$('html,body').animate({
		scrollTop: '0px'
	}, 1000);//返回顶部所用的时间 
});

window.onload = function(){
	$(".m11").css({position: "", top: "0px"});
	var tmpsct = $(".m11").offset().top + 250;
	$(window).scroll(function() {
		var scrollTop = $(document).scrollTop();
		var docHeight = document.body.offsetHeight || document.documentElement.offsetHeight;
		var srcHeight = docHeight-60-700;
		if (scrollTop>=tmpsct && scrollTop < srcHeight) {
			$('.m11').css({'position':'fixed','top':0});
		}else if(scrollTop<tmpsct){
			$('.m11').css({'position':'','top':''});
		}else if (scrollTop>=tmpsct){
			$('.m11').css({'position':'absolute','top':srcHeight+'px'});
		}
		// if (scrollTop > tmpsct) {
		// 	$(".m11").css({position: "fixed", top: "-10px"});
		// } else {
		// 	$('#article-tools').removeAttr("style");
		// 	$(".m11").css({position: ""});
		// }
	});
}

document.write('<div style=\'display:none\'><script src=\'http://w.cnzz.com/c.php?id=30022630&l=2\' language=\'JavaScript\' charset=\'utf-8\'></script></div>');
js = '';
js += "<!-- 广告位：内容页图加广告 -->";
js += "<script type=\"text/javascript\" >BAIDU_CLB_SLOT_ID = \"952858\";</script>";
js += "<script type=\"text/javascript\" src=\"http://cbjs.baidu.com/js/o.js\"></script>";
document.write(js);

function pageScroll(){
	if (!$) {
	window.scrollBy(0,-100);
	scrolldelay = setTimeout('pageScroll()',100);
	var sTop=document.documentElement.scrollTop+document.body.scrollTop;
	if(sTop==0) clearTimeout(scrolldelay);
	}else{
		return
	}
}

$(document).ready(function(){

    if($.cookie('cmstop_userid') != null ) {
        //console.log(1+':'+$.cookie('cmstop_userid'));
        $.ajax({
            url:"http://app.39yst.com/?app=member&controller=index&action=ajaxlogin",
            dataType:"jsonp",
            jsonp:"jsoncallback",
            success:function(data){
                if(data.state == true){
                    $('#denglu_Box').html('');
                    $('#loginzhuce').html('<a href="http://app.39yst.com/?app=member&controller=panel&action=index" class="welcome" title="'+data.username+'" target="_blank">欢迎，'+data.username.substr(0,5)+'</a> <a href="http://app.39yst.com/?app=member&controller=index&action=logout" class="out">退出</a>');
                    if ($('#is_login').length > 0) {
                        $('#is_login').html('');
                        if(data.photo == ''){
                            $('#photo').html('<a href="http://app.39yst.com/?app=member&controller=panel&action=expertavatar" target="_blank"><img src="http://img.39yst.com/images/nohead.jpg" width="60" height="60" /></a>');
                        } else {
                            $('#photo').html('<a href="http://app.39yst.com/?app=member&controller=panel&action=index" target="_blank"><img src="'+data.photo+'" width="60" height="60" /></a>');
                        }
                        $('.string_more').html('还可以输入<span>140</span>字<input type="hidden" name="r" value="http://www.39yst.com/jscs/201411/191157.shtml"><input id="plbtn" type="submit" class="plbtn_red" value="评论">')
                    }                   
                } 
            }
        });
    }
}); 

// var url = window.location.href;
// if ($('#denglu .hezuo').length>0) $('#denglu .hezuo').html('使用合作账号一键登录：<br /><a href="http://app.39yst.com/?app=member&controller=index&action=qq_login&x_url='+url+'" target="_blank"><img src="http://img.39yst.com/templates/39yst/images/qq_login.gif" width="124" height="24" /></a>&nbsp;&nbsp;<a href="http://app.beta.39yst.com/?app=member&controller=index&action=sina_login&x_url='+url+'" target="_blank" style="display:none"><img src="http://img.39yst.com/templates/39yst/images/weibo.gif" width="132" height="24" /></a>')