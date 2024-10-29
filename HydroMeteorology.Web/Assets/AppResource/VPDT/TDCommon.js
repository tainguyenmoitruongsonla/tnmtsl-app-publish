//////////////////////Config/////////////////////////////////////////
var messages1 = "Đang đồng bộ dữ liệu...";
var messages2 = "Có lỗi xẩy ra..";
var messages3 = "Không tồn tại trường:\n";
var messages4 = "Thành công!";
var messages5 = "Chưa hoàn thành tạo mới Item. Có thể do Server đang bận!";
var messages6 = "Chưa hoàn thành cập nhật Item. Có thể do Server đang bận!";
var messages7 = "Chưa hoàn thành xóa Item. Có thể do Server đang bận!";
var messages8 = "Không được để trống các trường có dấu (*) !";
var messages9 = "Dữ liệu không được phép trùng! Vui lòng kiểm tra lại!";
var messages10 = "Ban kiểm tra thư viện hỗ trợ scan đã cài đặt chưa?";
var messages11 = "Phiên bản này đang là phiên bản hiện tại!";
var messages12 = "Không xóa được phiên bản hiện tại!";
var messages13 = "Chưa xóa được tất cả các phiên bản. Có thể do Server đang bận!";
var messages14 = "Không được xóa hết phần này!";
var messages15 = "Bạn có chắc muốn xóa phần này?";
var messages16 = "Thay thế tập tin mới?";
var messages17 = "Chưa xóa được file!";
var messages18 = "Bạn chỉ được chọn một mục để sửa!";
var messages19 = "Bạn chưa chọn mục nào để sửa!";
var messages20 = "Không được nhập các ký tự \">\", \"<\", \"'\", \"&\"!";
var messages21 = "Bạn chưa chọn mục nào để xóa!";
var messages22 = "Bạn chưa chọn phòng ban nào để xóa!";
var messages22b = "Chưa có phòng ban nào được chọn!";
var messages22a = "Bạn chưa chọn phòng ban nào để thêm người dùng!";
var messages23 = "Nhập [Người đại diện] hoặc [Cơ quan tổ chức] để lưu hồ sơ!";
var messages24 = "Bạn chỉ được chọn một tài khoản để sửa!";
var messages25 = "Bạn chưa chọn tài khoản nào để sửa!";
var messages26 = "Bạn chưa chọn tài khoản nào để xóa!";
var messages27 = "Bạn có chắc muốn xóa tài khoản này?";
var messages28 = "Bạn chưa chọn hồ sơ nào!";
var messages29 = "Bạn có chắc muốn xóa hồ sơ này?";
var messages31 = "Hệ thống sẽ hỗ trợ chế độ chuyển mặc định khi chọn hồ sơ từ nhiều loại hình dịch vụ!";
var messages32 = "Việc sao chép quy trình từ một dịch vụ/lĩnh vực khác sẽ xóa toàn bộ quy trình cũ của dịch vụ/lĩnh vực này. Bạn có muốn tiếp tục?";
var messages33 = "Nhập mật khẩu mới cho tài khoản";
var messages34 = "Bạn chưa nhập mật khẩu mới";
var messages35 = "Chưa lưu được hồ sơ!";
var messages36 = "Hồ sơ đã được chuyển!";
var messages37 = "Hồ sơ chưa được chuyển!";
var messages38 = "Bạn chỉ được chọn một hồ sơ để gửi yêu cầu bổ sung!";
var messages39 = "Ðã gửi yêu cầu bổ sung!";
var messages40 = "Yêu cầu bổ sung chưa được gửi! Có thể do server bận!";

function $id(id){return document.getElementById(id)};
String.prototype.beginsWith = function (s) {return(this.indexOf(s) === 0);};
if(typeof String.prototype.endsWith!=="function"){String.prototype.endsWith=function(e){return this.indexOf(e,this.length-e.length)!==-1}}
function $hasClass(c, b) { return c.className.match(new RegExp("(\\s|^)" + b + "(\\s|$)")); }; function $addClass(c, b) { if (!c) { return false; } if (!$hasClass(c, b)) { c.className += " " + b; } };
function zoomBox(el) {var $t = $(el);var o = $t.offset();var x = o.left;var y = o.top;var w = $t.width();var h = $t.height();;c = $id("zoom-box");if(!c){c=document.createElement('div');c.className="zoom-box";c.id="zoom-box";document.body.appendChild(c);} c.style.left = x + "px"; c.style.top = y + "px"; c.style.right = (window.innerWidth - x - w) + "px"; c.style.bottom = (window.innerHeight - y - h) + "px"; $addClass(c, "in"); setTimeout(function () { var g = $id("zoom-box"); g.style.cssText = ""; g.style.opacity = 1; }, 10); }
function getStore(name,useckie){if(typeof(Storage)!=="undefined")return localStorage[name];else if(useckie)return getCookie(name);}
function setStore(name,value,useckie,d){if(typeof(Storage)!=="undefined")localStorage[name]=value;else if(useckie)setCookie(name,value,d);}
// download tu list 'TaiXuong'
function downloadByFileId(e){if(!e)return;var t=$("#frm-download");if(!t||t.length==0){t=$("<iframe id='frm-download' style='display:none'></iframe>");$("body").append(t)}t.attr("src","/_layouts/tandan/download.aspx?f="+e)};
// Hộp tìm kiếm
var searchBox={};
searchBox.settings={};
searchBox.register=function(e,t,n){searchBox.settings[e]={onchange:t,onkeyup:n}};
searchBox.onchange=function(e){if(searchBox.settings)for(var t in searchBox.settings){var n=searchBox.settings[t];if(n.onchange)n.onchange(n.key,e,this.value)}};
searchBox.onkeyup=function(e){if(searchBox.settings)for(var t in searchBox.settings){var n=searchBox.settings[t];if(n.onkeyup)n.onkeyup(t,e,this.value)}};
$(document).ready(function () { var e = $id("SidebarSearch"); if (!e) return; e.onchange = searchBox.onchange; e.onkeyup = searchBox.onkeyup });
//full screen
function ToggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
}
if (Function.prototype.getFuncName !== 'function') {
    Function.prototype.getFuncName = function () {
        var name = '';
        var self = this;
        var string = self.toString();
        var sanitized = string.replace(/\s+/g, '').
                    replace('function', '').
                    replace('(', '').
                    replace(')', '');
        var re = /.+\{/;
        var matches = sanitized.match(re);
        name = matches[0].replace('{', '');
        return name;
    };
}

/* Thư viện jquery dùng chung */
//cookie
//(function(e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else{e(jQuery)}})(function(e){function n(e){return u.raw?e:encodeURIComponent(e)}function r(e){return u.raw?e:decodeURIComponent(e)}function i(e){return n(u.json?JSON.stringify(e):String(e))}function s(e){if(e.indexOf('"')===0){e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")}try{e=decodeURIComponent(e.replace(t," "));return u.json?JSON.parse(e):e}catch(n){}}function o(t,n){var r=u.raw?t:s(t);return e.isFunction(n)?n(r):r}var t=/\+/g;var u=e.cookie=function(t,s,a){if(s!==undefined&&!e.isFunction(s)){a=e.extend({},u.defaults,a);if(typeof a.expires==="number"){var f=a.expires,l=a.expires=new Date;l.setDate(l.getDate()+f)}return document.cookie=[n(t),"=",i(s),a.expires?"; expires="+a.expires.toUTCString():"",a.path?"; path="+a.path:"",a.domain?"; domain="+a.domain:"",a.secure?"; secure":""].join("")}var c=t?undefined:{};var h=document.cookie?document.cookie.split("; "):[];for(var p=0,d=h.length;p<d;p++){var v=h[p].split("=");var m=r(v.shift());var g=v.join("=");if(t&&t===m){c=o(g,s);break}if(!t&&(g=o(g))!==undefined){c[m]=g}}return c};u.defaults={};e.removeCookie=function(t,n){if(e.cookie(t)===undefined){return false}e.cookie(t,"",e.extend({},n,{expires:-1}));return!e.cookie(t)}})
//
/*!
* jQuery Cookie Plugin v1.4.0
* https://github.com/carhartl/jquery-cookie
*
* Copyright 2013 Klaus Hartl
* Released under the MIT license
*/
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals.
        factory(jQuery);
    }
} (function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch (e) { }
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                                encode(key), '=', stringifyCookieValue(value),
                                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                                options.path ? '; path=' + options.path : '',
                                options.domain ? '; domain=' + options.domain : '',
                                options.secure ? '; secure' : ''
                        ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, { expires: -1 }));
        return !$.cookie(key);
    };

}));
(function(a){a.fn.extend({outerHTML:function(b){if(!this.length)return null;else if(b===undefined){var c=this.length?this[0]:this,d;if(c.outerHTML)d=c.outerHTML;else d=a(document.createElement("div")).append(a(c).clone()).html();if(typeof d==="string")d=a.trim(d);return d}else if(a.isFunction(b)){this.each(function(c){var d=a(this);d.outerHTML(b.call(this,c,d.outerHTML()))})}else{var e=a(this),f=[],g=a(b),h;for(var i=0;i<e.length;i++){h=g.clone(true);e.eq(i).replaceWith(h);for(var j=0;j<h.length;j++)f.push(h[j])}return f.length?a(f):null}}})})(jQuery);
(function($){
	$.fn.disableSelection = function() {
		return this.each(function() {           
			$(this).attr('unselectable', 'on')
			.css({
				'-moz-user-select':'none',
				'-webkit-user-select':'none',
				'user-select':'none'
			})
		   .each(function() {
			   this.onselectstart = function() { return false; };
		   });
		});
	};
	$.fn.enableSelection = function() {
		return this.each(function() {           
			$(this).attr('unselectable', 'off')
			.css({
				'-moz-user-select':'text',
				'-webkit-user-select':'text',
				'user-select':'text'
			})
		   .each(function() {
			   this.onselectstart = function() { return true; };
		   });
		});
	};	
	$.fn.convertVn2EnText = function(){
		return Vn2EnText(this);
	};
	$.fn.outerHtml = function()
	{
		if (this.length)
		{
			var div = $('<div style="display:none"></div>');
			var clone =
			$(this[0].cloneNode(false)).html(this.html()).appendTo(div);
			var outer = div.html();
			div.remove();
			return outer;
		}
		else
			return null;
	};
})(jQuery);

jQuery.expr[':'].focus = function( elem ) {
  return elem === document.activeElement && ( elem.type || elem.href );
};

$.expr[":"].econtains = function(obj, index, meta, stack){
	return (obj.textContent || obj.innerText || $(obj).text() || "").toLowerCase().indexOf(meta[3].toLowerCase()) != -1;
}

$.expr[":"].vcontains = function(obj, index, meta, stack){
	return Vn2EnText((obj.textContent || obj.innerText || $(obj).text() || "").toLowerCase()).indexOf(Vn2EnText(meta[3].toLowerCase())) != -1;
}

$.expr[":"].cssrpos = function(obj, index, meta, stack){
	return $(obj).css("position").toLowerCase().indexOf(meta[3].toLowerCase()) != -1;
}

//===================================POPUP=========================================
// Bật dialog
var curelement = null;
// url - đường dẫn
// title - tiêu đề
// width, height - chiều rộng và chiều cao của dialog
// max :(true or false) cho phép dialog được phép mở rộng max kích thước ko?
// obj đối tương hàm trả giá trị về
// callback là hàm gọi lại hàm
// OpenDialog là hàm mở dialog tag popup => ReturnValueCallBackAdd là hàm thực hiện trả lại giá trị cho tagpopup
// ShowPopup là hàm mở dialog popup => ReturnValueCallBack là hàm thực hiện trả lại giá trị cho input popup
// HidenDialog là hàm đóng dialog
function OpenDialog(url, title, width ,height, max, obj, callback)
{
	var dialogOptions = SP.UI.$create_DialogOptions();// loi tren ie 9 10
	dialogOptions.url = url;
	dialogOptions.title = title;
	dialogOptions.width = width;
	dialogOptions.height = height;
	dialogOptions.allowMaximize = max;
	curelement = $(obj);
	dialogOptions.dialogReturnValueCallback = eval(callback);
	SP.UI.ModalDialog.showModalDialog(dialogOptions);
	
}

function ShowPopup(param)
{
	var dialogOptions = SP.UI.$create_DialogOptions();// loi tren ie 9 10
	dialogOptions.url = param.url;
	dialogOptions.title = param.title;
	dialogOptions.width = param.width;
	dialogOptions.height = param.height;
	dialogOptions.allowMaximize = param.max;
	dialogOptions.showMaximized = param.maximized;
	curelement = $(param.obj);
	dialogOptions.dialogReturnValueCallback = eval(param.callback);
	SP.UI.ModalDialog.showModalDialog(dialogOptions);
	var winH;
	var winW;
	if(window.innerHeight && window.innerWidth){
		winH = window.innerHeight;
		winW = window.innerWidth;
	}
	else {
		winW = $(window).width();
		winH = $(window).height();
	}
	$('.ms-dlgOverlay').attr('style', $('.ms-dlgOverlay').attr('style') + '; height: '+ winH + 'px !important' );
}
function CloseCallback(result, value) { 
    if(result === SP.UI.DialogResult.cancel) {   
    }
    if(result === SP.UI.DialogResult.cancel) {   
    }
}
function HideDialog()
{
	SP.UI.ModalDialog.commonModalDialogClose();
}
// dư liệu đầu vào value là đoạn xml <data><item value="">x</item>...</data>
function ReturnValueCallBack(result, value)
{
	if(result === SP.UI.DialogResult.OK) {
		var data = '<?xml version="1.0" encoding="utf-8"?>'+value;
		var xmldata =  $.parseXML(data);
		
		var xvalue = "";
		var xdata = "";
		var xtext = "";

        $(xmldata).find('item').each(function(){  
            var $item = $(this);   
            var v = $item.attr("value");  
            var text = $item.text();   
   			if(xvalue=="")
   			{
   				xvalue = v;
   				xdata = text;
   				xtext = text;
   			}
   			else
   			{
   				xvalue = xvalue+"##"+v;
   				xdata = xdata+"##"+text;
   				xtext = xtext+", "+text;
   			}
        });
	        			
		$(curelement).attr("xvalue",xvalue);
		$(curelement).val(xtext).trigger("change");
		$(curelement).attr("xdata",xdata);
		
    }
}
// dư liệu đầu vào returnvalue là 1 đối tượng gồm có text và value là các chuỗi có nhiều giá trị được phân biệt bởi '##'
function ReturnValueCallBackAdd(result, returnvalue)
{
	if(result === SP.UI.DialogResult.OK) {
		var text = returnvalue.text;
		var xvalue = returnvalue.value;
		var d = text.split('##');
		var v = xvalue.split('##');
		$(curelement).parent().find('.tag').remove();
		$(curelement).val("");
		$(curelement).attr('xvalue',"");
		for(i=0;i<d.length;i++)
		{
			addTag($(curelement),d[i],v[i])
		}
    }
}
//==============================================================================================
//hàm mã hóa
function Encode(value) {
	return encodeURIComponent(value);
}
var encode=Encode;
//hàm giải mã
function Decode(value) {
	if(typeof value != "undefined")	
		return decodeURIComponent(value.replace(/\+/g, " "));
	return "";
}
var decode=Decode;
//	chỉ nhập số
function validateNumber(event) {
	var key = window.event ? event.keyCode : event.which;
    if (event.keyCode == 8 || event.keyCode == 46
     || event.keyCode == 37 || event.keyCode == 39) {
        return true;
    }
    else if ( key < 48 || key > 57 ) {
        return false;
    }
    else return true;
};

// Ngày tháng năm cập nhật động 
function DynamicDate(){
	var m = "Sáng";
	var gd = new Date();
	var secs = gd.getSeconds();
	var minutes = gd.getMinutes();
	var hours = gd.getHours();
	var day = gd.getDay();
	var month = gd.getMonth();
	var date = gd.getDate();
	var year = gd.getYear();	
	if(year<1000){
		year += 1900;
	}
	if(hours==0){
		hours = 12;
	}
	if(hours>12){
		hours = hours - 12;
		m = "Chiều";
	}
	if(secs<10){
		secs = "0"+secs;
	}
	if(minutes<10){
		minutes = "0"+minutes;
	}
	var dayarray = new Array ("Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy");
	var montharray = new Array("1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12");
	var fulldate = dayarray[day]+", " + date + "/" +montharray[month]+"/"+year+", "+hours+":"+minutes+":"+secs+" "+m;	
	$(".dynamic-date").html(fulldate);
	setTimeout("DynamicDate()", 1000);
}

// Lấy thứ, ngày, tháng, năm đầy đủ
function GetDate()
{
	var monthNames = new Array("01","02","03","04","05","06","07","08","09","10","11","12");           
	var dayNames = new Array("Chủ Nhật,","Thứ Hai,","Thứ Ba,","Thứ tư,","Thứ Năm,","Thứ Sáu,","Thứ Bảy,")           
	var now = new Date();           
	thisYear = now.getYear();           
	thisDay = dayNames[now.getDay()];
	var date = now.getDate() + "";
	date = (date.length > 1)?date:("0"+date);
	if(thisYear < 1900) {thisYear += 1900}; // corrections if Y2K display problem           
	var result =  thisDay +" "+"ngày"+" "+ date + " tháng " + monthNames[now.getMonth()] + " năm " + thisYear;           
	return result
}
// Lấy giá trị trên query string
function GetQueryString(name)
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
	return "";
  else
	return Decode(results[1]);
}
// Lấy giá trị trên query string
function GetQueryStringFromUrl(name, url)
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  if( results == null )
	return "";
  else
	return Decode(results[1]);
}

//đọc cookie
function GetCookie(c_name)
{
	c_name = escape(c_name);
	if (document.cookie.length>0)
	  {
	  c_start=document.cookie.indexOf(c_name + "=");
	  if (c_start!=-1)
		{ 
		c_start=c_start + c_name.length+1 ;
		c_end=document.cookie.indexOf(";",c_start);
		if (c_end==-1) c_end=document.cookie.length
		return unescape(document.cookie.substring(c_start,c_end));
		} 
	  }
	return ""
}
function getCookie(c_name)
{
	c_name = escape(c_name);
	if (document.cookie.length>0)
	  {
	  c_start=document.cookie.indexOf(c_name + "=");
	  if (c_start!=-1)
		{ 
		c_start=c_start + c_name.length+1 ;
		c_end=document.cookie.indexOf(";",c_start);
		if (c_end==-1) c_end=document.cookie.length
		return unescape(document.cookie.substring(c_start,c_end));
		} 
	  }
	return ""
}
//ghi cookie - đã có hàm SetCookie của Sharepoint
function setCookie(c_name,value,expiredays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie= escape(c_name)+ "=" +escape(value)+((expiredays==null) ? "" : "; expires="+exdate.toUTCString());
}
//tạo xdoc từ string
function String2XML(text)
{
	if (window.ActiveXObject){
		var doc=new ActiveXObject('Microsoft.XMLDOM');
		doc.async='false';
		doc.loadXML(text);
	} else {
		var parser=new DOMParser();
		var doc=parser.parseFromString(text,'text/xml');
	}
	return doc;
}
function StringToXML(text)
{
	if (window.ActiveXObject){
		var doc=new ActiveXObject('Microsoft.XMLDOM');
		doc.async='false';
		doc.loadXML(text);
	} else {
		var parser=new DOMParser();
		var doc=parser.parseFromString(text,'text/xml');
	}
	return doc;
}
//chuyển xdoc thành string
function XML2String(xdoc)
{
	var str = "";
	if (window.ActiveXObject){
		str = xdoc.xml;
	} 
	else {
		var s = new XMLSerializer();
		str = s.serializeToString(xdoc);
	}
	return str;
}
function XMLToString(xdoc)
{
	var str = "";
	if (window.ActiveXObject){
		str = xdoc.xml;
	} 
	else {
		var s = new XMLSerializer();
		str = s.serializeToString(xdoc);
	}
	return str;
}
function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
// Tạo mã duy nhất
function GUID() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
function GUIDString() {
    return S4() + S4() + S4() + S4();
}

function ReplaceText(Text,strTarget,strSubString){
	if(strTarget == "")
		return Text;
	strText = Text;
	var intIndexOfMatch =-1
	if(strText) intIndexOfMatch =strText.indexOf( strTarget );
	while (intIndexOfMatch != -1){
		strText = strText.replace( strTarget, strSubString )
		intIndexOfMatch = strText.indexOf( strTarget );
	}
	return( strText );
}


function RewriteSrc(h,t)
{
	var href = "";
	var type= "_t/";
	if(t)
		type = "_w/";
	var i = h.lastIndexOf("/");
	var h1 = h.substring(0,i+1);
	h1 += type;
	var h2 = h.substring(i+1);
	i = h2.lastIndexOf(".");
	var h3 = h2.substring(0,i);
	var h4 = h2.substring(i+1);
	h2 = h3+ "_" + h4 + ".jpg";
	href = h1 + h2;
	return href;
}
function ResizeImg(h,t)
{
	var href = h.toLowerCase().split("src")[1];
	href = href.replace(/"/gi, "'");
	href = href.split("'")[1]+"";
	return RewriteSrc(href,t);
}
function FileNameOfLink(link)
{ 
	var fileN = link.split("/");
	return fileN[fileN.length - 1];
}

// convert date VN -> EN
function DateVN2EN(date)
{
	if(typeof date != 'undefined')
	{
		if(date == "") return "";
		var year, month, day;
		var temp = date.split('/');
		if(temp.length != 3) return "";
		year=temp[2];
		month=temp[1];
		day=temp[0];
		return year + "-" + month + "-" + day + "T12:00:00Z";
	}
	else
	return "";
}

// convert date EN -> VN
function DateEN2VN(date)
{
	//alert(date);
	if(date == "") return "";
	var year, month, day;
	var temp = date.split('T')[0].split(' ')[0].split('-');
	if(temp.length != 3) return "";
	year = temp[0];
	month = temp[1];
	day = temp[2];
	return day + "/" + month + "/" + year;
}

//So sánh ngày theo định dạng EN.
function CompareDateEn(date1, date2)
{
	date1 = DateVN2EN(date1);
	date2 = DateVN2EN(date2);
	var myDate1 = new Date(date1);
	var myDate2 = new Date(date2);
	if(myDate1 < myDate2)
		return -1;
	else if(myDate1 > myDate2)
		return 1;
	return 0;
}

//So sánh ngày theo định dạng VN.
function CompareDateVN(date1, date2)
{
	var myDate1 = new Date(date1);
	var myDate2 = new Date(date2);
	if(myDate1 < myDate2)
		return -1;
	else if(myDate1 > myDate2)
		return 1;
	return 0;
}



// Kiểm tra xem mảng array có chứa item không. (True / False).
function IsItemInArray(array, item) 
{
	var j = 0;
	while (j < array.length) 
	{
		if (array[j] == item) 
			return true;
		else 
			j++; 
	}
	return false;
}
 
//xóa item khỏi array
function RemoveItemFromArray(array, item) 
{
	var j = 0;
	while (j < array.length) 
	{
	//	alert(originalArray[j]);
		if (array[j] == item) 
			array.splice(j, 1);
		else
			j++; 
	}
	return array;
}

//copy array sang vùng nhớ khác
function CopyArray(originalArray) 
{
	var destinationArray = new Array();
	var j = 0;
	for (j =0; j < originalArray.length; j++) 
	{
		destinationArray[j] = originalArray[j];
	}
	return destinationArray;
}

//thêm item vào array ở vị trí xác định
function InserItemToArray(array, item, index)
{
	return array.splice(index, 0, item);
}

function TrimUrl(url)
{
	var str = url + "";
	str = str.substring(str.indexOf("//") + 2);
	str = str.split('?')[0];
	return str;
}

function GetPageUrl(url)
{
	var str = url + '';
	str = str.substring(str.indexOf("//") + 2);
	str = str.substring(str.indexOf("/"));
	return str;
}

function GetCurrentPageUrl()
{
	var str = GetPageUrl(top.location);
	str = str.split('?')[0];
	str = str.split('#')[0];
	return str.toLowerCase();
}
// Trở lại trang có dường dẫn truyền vào query string source
function GoBack()
{
	if(GetQueryString("source")!="")
		top.location = Decode(GetQueryString("source"));
	else
		self.location = self.location;
}

function RefreshPage()
{
	self.location=self.location;
}

function ConvertNode2Array(xml,nodeName)
{
	var r = new Array();
	var dem = 0;
	$(xml).find("[nodeName="+nodeName+"]").each(function(){
		r[dem] =  new Array();
		$(this.attributes).each(function(){
			r[dem][this.name] = this.value;
		})
		dem++;
	});
	return r;
}
// Cắt chuỗi
function SplitStr(str,spl,index)
{
	return str.split(spl)[index];
}

function JointStr(str1,str2,str3)
{
	if(!str3) str3 = '';
	return str1 + str2 + str3;
}

function Equal(v)
{
	return v;
}
function Vn2EnText(str)
{
	str= str.toLowerCase();  
	str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");  
	str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");  
	str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");  
	str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");  
	str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");  
	str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");  
	str= str.replace(/đ/g,"d");
	return str;
}
function Vn2Sign(str)
{
	str= str.toLowerCase();  
	str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");  
	str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");  
	str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");  
	str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");  
	str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");  
	str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
	str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"");
	str= str.replace(/-+-/g,"");
	str= str.replace(/^\-+|\-+$/g,""); 
	return str;
}

function stopEventPropagation(evt) {
	if (typeof evt.stopPropagation != "undefined") {
		evt.stopPropagation();
	} else {
		evt.cancelBubble = true;
	}
}

function IsNullOrEmpty(v)
{
	if(typeof v == "undefined") return true;
	if(v == "") return true;
	return false;
}

function IsNull(v)
{
	if(typeof v == "undefined")
		return true;
	return false;
}

function IsNotNull(v)
{
	if(typeof v != "undefined")
		return true;
	return false;
}

function IsNotEmpty(v)
{
	if(v != "")
		return true;
	return false;
}

function SPDecode(s)
{
	return ReplaceText(ReplaceText(ReplaceText(ReplaceText(s,"&#39;","\""),"&lt;","<"),"&gt;",">"),"&quot;","'");
}

// Edited by AnhND
function GetFirstCharacters(value){
	if(typeof value == 'undefined')
	{
		return "";
	}
	var result = '';
	var values = value.split(' ');
	for(i = 0; i<values.length; i++)
	{
		result += values[i].substring(0,1);
	}
	return result;
}

// Hàm bỏ dấu
function Vn2En(value) {
    var str = value;
    str = str.toLowerCase();
    str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
	str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
	str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
	str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
	str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
	str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
	str= str.replace(/đ/g,"d");
	str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");
	str= str.replace(/-+-/g,"-");
	str= str.replace(/^\-+|\-+$/g,"");     
	return str
}


//////////////////////////////////////////// CurrentContext//////////////////////////////////////////////

var thisWebUrl = "";
var curentUser = new Array;
var userArray = new Array();

function GetCurentWeb() {
	if(thisWebUrl.length > 0) return thisWebUrl;
	var p = new Array();
	p.push(((location.href.indexOf("?") > 0) ? location.href.substr(0, location.href.indexOf("?")) : location.href));
	thisWebUrl = CallWebService("/_vti_bin/Webs.asmx","WebUrlFromPageUrl",p).text();
	return thisWebUrl;
}

function GetCurentUser(type) {
	if(IsNullOrEmpty(type))
		type="account";
	if(typeof curentUser[type] != "undefined")
		if(curentUser[type].length > 0) return curentUser[type];
	curentUser[type] = CallWebService(tdws,"GetCurentUser",[type]).text();
	return curentUser[type];
}

function GetUserInfo(acc,fi)
{
	if(userArray[fi])	return userArray[fi];
	userArray[fi] = CallWebService(GetCurentWeb() + tdws,"GetUserInfo",[acc,fi]).text();
	return userArray[fi];
}

function UpdateUserInfo(acc,xml)
{
	return CallWebService(GetCurentWeb() + tdws,"UpdateUserInfo",[acc,xml]).text();
}

function GetWebFromUrl(url)
{
	return CallWebService(tdws,"GetWebFromUrl",[url]).text();
}

function FormatWebUrl(web)
{
	if(IsNullOrEmpty(web))
		web = GetCurentWeb() ;
	if(web == "/")
		web =  "";
	return web;
}

/* Event when upload completed */
function handleUploaded(sender, event) {
    var rFileName = event.get_fileName();
    var postedUrl = event.get_postedUrl();
    var fileUrl = GetQueryStringFromUrl('fileUrl', postedUrl);
    $('.returnData').val(fileUrl);
    var objUpload = null;
    $('.ajax__fileupload_fileItemInfo').each(function () {
        var objName = $(this).find('.filename');
        var objStt = $(this).find('.uploadstatus');
        var fileName = objName.first().text();
        if (fileName + '' == rFileName + '') {
            objStt.text("(Hoàn thành)");
            objName.html("<a href='" + fileUrl + "'>" + fileName + "</a>");
            objUpload = $(this).parent().parent().parent();
        }
    });
    /*var rData = objUpload.attr("rdata");
    if (rData + '' != 'undefined') {
        rData = rData.replace('<rdata>', '').replace('</rdata>', '');
    }
    else { rData = '' }
    rData += '<uploaded url="' + fileUrl + '" filename="' + rFileName + '"></uploaded>';
    rData = '<rdata>' + rData + '</rdata>';
    rData = Encode(rData);*/
}
//
var xml_special_to_escaped_one_map = {
    '&': '&amp;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;'
};
 
var escaped_one_to_xml_special_map = {
    '&amp;': '&',
    '&quot;': '"',
    '&lt;': '<',
    '&gt;': '>'
};
 
function encodeXml(string) {
	if(typeof string== 'string' || string instanceof String){
		try{
		    return string.replace(/([\&"<>])/g, function(str, item) {
		        return xml_special_to_escaped_one_map[item];
		    });
	    }
	    catch(e){}
    }
    return string;
};
 
function decodeXml(string) {
	if(typeof string== 'string' || string instanceof String){
    return string.replace(/(&quot;|&lt;|&gt;|&amp;)/g,
        function(str, item) {
            return escaped_one_to_xml_special_map[item];
    });
    }
    return string;
}
function makeToast(html,delay,left,top)
{
	if(!left)left=0;
	if(!top)top=0;
	if(!delay) delay=500;
	var tag=$('#td-toast');
	if(tag==null||tag.length==0)tag=$("<div id='td-toast' class='tooltip' style='position:absolute;width:200px;height50px;top:"+top+";left:"+left+";display:none'></div>");
	tag.html(html);
	$('body').append(tag);
	tag.fadeIn(400);
	setTimeout(function(){tag.fadeOut(400);},delay);
}