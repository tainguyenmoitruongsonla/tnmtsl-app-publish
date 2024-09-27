//các hàm dùng chung phòng Microsoft Technical
var sysService=sysService||{};
//hàm g?i webservice
var callingwebservice = false;
var wsobject = null;
var spwsdl = new Array();
var divid = GUID();
var timemessages = 0;
var timeajax = 0;
var sourceElement = null;
var oldSourceElement = null;
sysService.url="_layouts/TANDAN.Webservice.asmx";

//chuy?n xmldata thành m?ng
function ResponeDataToArray(xData,unique)
{
	if(xData == "callingwebservice")
		return xData;
	var varray = new Array();
	try
	{
		if ($($(xData).find("rs\\:data,data")[0]).attr('ItemCount') != 0)
	    {
			row=0;
			$(xData).find("z\\:row,row").each(function() {
			    node = this;
			    varray[row] = new Array();
			    $(this.attributes).each(function(){
			    	var f = this.name+"";
			    	var i = f.indexOf("_");
			    	var field = f.substring(i+1);
				    varray[row][field.replace("_x0020_"," ")] = this.value;
			    })
			    row++;
		    })
	    }
    }
    catch(e)
    {
    }
    return varray;
}

function CallWebService(url, method, parameters, callback, fsoap, showMss)
{
	//CheckDoubleCalling([url, method, parameters, callback, fsoap, conflict]);
	if(callingwebservice)
		return "callingwebservice";
	
	var d = GetWSDL(url);
	var soap5 = GetSoap(d,method,parameters);
	var r = "";
	$.ajax({
		type: "POST",
		url: url,
		data: soap5,
		async: false,
		dataType: "xml",
		contentType: "text/xml; charset='utf-8'",
		beforeSend: function (xhr) {
			if(!fsoap)
				xhr.setRequestHeader("SOAPAction", GetSoapAction(d,method));
			//if(showMss != false)
				//ShowMessages(messages1);
		},
		complete:function(data){

			r = $(StringToXML(data.responseText)).find(GetSoapResult(d,method));
			try{
				callback(r.text());
			}
			catch(e){}
			//EnableAllButton();
		},
		error:function(){
			if(showMss != false)
				ShowMessages(messages2);
		}
	})
	return r;
}

//hi?n th? thông báo
function ShowMessages(text,time,auto)
{
	clearTimeout(timemessages);
	if(CheckInPopup())
		return;
	var messdiv = "<div id='"+divid+"' style='display:none;position:absolute;bottom:10px;right:10px;width:auto;border:1px solid #057caf;padding:0px 10px 0px 50px;height:30px; line-height: 30px;background-color:#FFFBDC;color:#057caf;font-size:9pt;background-image:url(/images/loading.gif);background-repeat:no-repeat;background-position: 10px center;text-align:justify'></div>";
	if(typeof $("#"+divid).attr("id") == "undefined")
		$("body").append(messdiv);
	$('#'+divid).text(text);
	$('#'+divid).fadeIn(10);
	if(auto != false)
		HideMessages(time);
	//SP.UI.Notify.addNotification("Ðang t?i d? li?u...", false, "", null);
}

//hàm ?n thông báo
function HideMessages(time)
{
	if(!time)	
		time = 1200;
	timemessages = setTimeout("$('#"+divid+"').fadeOut('slow')",time);
}

function EnableDoubleCalling()
{
	timeajax = setTimeout("wsobject = null;",1000);
}

var timecalldelay = 0;
function CheckDoubleCalling(ob)
{
	clearTimeout(timecalldelay);
	if(!wsobject)
	{
		wsobject = ob;
		callingwebservice = false;
		return true;
	}
	if(ob[5] != wsobject[5])
	{
		wsobject = ob;
		callingwebservice = false;
		return true;
	}
	if(typeof wsobject[2] != typeof ob[2])
	{
		wsobject = ob;
		callingwebservice = false;
		return true;
	}

	var f = true;
	try
	{
		if(wsobject[2].length != ob[2].length)
		{
			wsobject = ob;
			callingwebservice = false;
			return true;
		}
		for(var i =0;i<wsobject[2].length;i++)
		{
			if(wsobject[2][i] != ob[2][i])
				f = false;
		}
	}
	catch(ex)
	{}
	if((wsobject[0] == ob[0])&(wsobject[1] == ob[1])&(f)&(wsobject[3] == ob[3])&(wsobject[4] == ob[4])&(oldSourceElement == sourceElement))
	{
		callingwebservice = true;
		clearTimeout(timeajax);
	}
	else
	{
		wsobject = ob;
		callingwebservice = false;
		oldSourceElement = sourceElement;
	}
	var timecalldelay = setTimeout("wsobject = null;",5000);
}

//hàm l?y thông tin WSDL
function GetWSDL(url)
{
	if(spwsdl[url])
		return spwsdl[url];
	var d = null;
	$.ajax({
		type: "GET",
		url: url+"?wsdl",
		async: false,
		dataType: "xml",
		contentType: "text/xml; charset='utf-8'",
		complete:function (data){
			d = StringToXML(data.responseText);
		}
	})
	//alert($(d).find("wsdl\\:definitions,definitions").attr("targetNamespace"));
	spwsdl[url] = d;
	return d;
}


//hàm thông báo Soap Parameter
function AlertSoapParameters(url, method)
{
	var data = GetWSDL(url);
	var r = "";
	var i =1;
	$(data).find("s\\:element[name='"+method+"'],element[name='"+method+"']").find("s\\:element,element").each(function(){
		r+= i+". "+ $(this).attr("name") + "\n";
		i++;
	});
}

//Hàm l?y các phuong th?c c?a ws
function GetServiceMethod(data)
{
	var m = new Array();
	$(data).find("s:\\schema,schema").children(":not([name$='Response'])").each(function(){
		m.push($(this).attr("name"));
	});
	return m;
}

//Get service xmlns
function GetServiceNamespace(data)
{
	var m = $(data).find("wsdl\\:definitions,definitions").attr("targetNamespace");
	return m;
}


//l?y tên node ch?a giá tr? tr? v?
function GetSoapResult(data, method)
{
	var r = "";
	$(data).find("s\\:element[name='"+method+"Response'],element[name='"+method+"Response']").find("s\\:element,element").each(function(){
		r = $(this).attr("name");
	});
	return r;
}

//l?y SoapAction
function GetSoapAction(data, method)
{
	var r = "";
	$(data).find("wsdl\\:operation[name='"+method+"'],operation[name='"+method+"']").find("soap\\:operation,operation").each(function(){
		r = $(this).attr("soapAction");
	});
	return r;
}

//l?y toàn b? SOAP c?a ws
function GetSoap(data, method, parameters)
{
	var p = new Array();
	var i = 0;
	$(parameters).each(function(){
		p[i] = this;
		i++;
	})
	var r = '<?xml version="1.0" encoding="utf-8"?>';
	r +=	'<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
	r +=	'<soap:Body>';
	r +=	'<'+method+' xmlns="'+GetServiceNamespace(data)+'">';
	i = 0;
	
	$(data).find("s\\:element[name='"+method+"'],element[name='"+method+"']").find("s\\:element,element").each(function(){
		if(p[i] == null)
			p[i] = "";
		if($(this).attr("name") == 'updates')
			r += "<" + $(this).attr("name") + ">" + p[i] + "</" + $(this).attr("name") + ">";
		else
			r += "<" + $(this).attr("name") + ">" + encodeXml(p[i]) + "</" + $(this).attr("name") + ">";
		i++;
	});
	r +=	'</'+method+'>';
	r +=	'</soap:Body>';
	r +=	'</soap:Envelope>';
	return r;
}

//hàm l?y mã duy nh?t
function GetGUID()
{
	var guid = "0123456789101112";
	var p = new Array();
	var serviceName = 'GetGUID';
    var guid = CallWebService(GetCurentWeb() + "/_layouts/td.asmx", serviceName, p).text();
	return guid;
}
// lay duong dan service he thong tu duong dan site
sysService.absUrl=function(url){
	if(url==null||url=='')url='/';
	else if(!url.endsWith('/')) url+='/';
	url+=sysService.url;
	return url;
}
// thuc thi command
sysService.runCommands=function(cmds,url){
	if(!cmds||cmds.length==0)return null;
	var  xml='<cmds>';
	for(var i=0;i<cmds.length;i++)
		xml+='<cmd>'+encodeXml(cmds[i])+'</cmd>';
	xml+='</cmds>';
	if(url==null)url='/';
	else if(!url.endsWith('/'))url+='/';
	url+=sysService.url;
	try	{
		var json=CallWebService(url,"runCommands",[xml]).text();
		return eval(json);
	}catch(e){return null;}
}
// cap nhat thuoc tinh list item
sysService.UpdateListItem=function(id,listName,fields,values,url){
	if(url==null||url=='')url='/';
	else if(!url.endsWith('/')) url+='/';
	url+=sysService.url;
	var sid='';
	var sfield='';
	var svalue='';
	if(Array.isArray(id))
	for(var i=0;i<id.length;i++){
		if(i>0)sid+=',';
		sid+=id[i];
	}else sid=id;
	for(var i=0;i<fields.length;i++){
		if(i>0)sfield+=',';
		sfield+=fields[i];
	}
	for(var i=0;i<values.length;i++){
		if(i>0)svalue+=',';
		svalue+=values[i];
	}
	return CallWebService(url,"UpdateListItemByID",[sid,listName,sfield,svalue],null).text();
}
// xoa list item
sysService.DeleteItem=function(site, listname, id){
	site=sysService.absUrl(site);
	var sid='';
	if(Array.isArray(id))
	for(var i=0;i<id.length;i++){
		if(i>0)sid+=',';
		sid+=id[i];
	}else sid=id;
	var r= CallWebService(site,"DeleteItem",[listName,sid],null).text();
	if(r=='true'||r=='True')return true;
	return false;
}
sysService.GetListItemsJson=function(site,listName, query, viewfields, rowlimit){
	site=sysService.absUrl(site);
	var r=CallWebService(site,"GetListItemsJson",[listName,query,viewfields,rowlimit],null,null,false).text();
	return eval(r);
}
sysService.ImportXml=function(site,listname,xml){site=sysService.absUrl(site);return CallWebService(site,"ImportXml",[listname,xml],null,null,false).text();}
sysService.PhanQuyen=function(id,nhomvaitro,vaitro){var url='/'+sysService.url;return CallWebService(url,"PhanQuyen",[id,nhomvaitro,vaitro],null,null,false).text();}
sysService.ResetPassword=function(user){var url=sysService.absUrl('/');return CallWebService(url,'ResetPassWord',[user],null,null,false).text();}
sysService.ChangePassword=function(oldp,newp){var url=sysService.absUrl('/');return CallWebService(url,'DoiMatKhauNguoiDung',[oldp,newp],null,null,false).text();}