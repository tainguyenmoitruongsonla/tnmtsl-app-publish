serviceLichUrl='/dhtn/_LAYOUTS/TanDan/QuanLyVanBan/webservices/LichCongTac.asmx';
var capdonvi =CallWebService(serviceLichUrl,'LayCapDonViNguoiDung',"",null,null,false).text();;
var lichprint = "";
function GetToDay()
{
	var date = new Date();
	//alert(date);
	var nd = date.getDate()>10? date.getDate(): '0'+ date.getDate();
	var nm = Number(date.getMonth() + 1)>=10? Number(date.getMonth() + 1): '0'+ Number(date.getMonth() + 1);
	var ny = date.getFullYear();
	var result = nd + '/' + nm  + '/' + ny;
	return result;
}
function StringtoXML(text)
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



function FillChucVu(ob)
{
	var acc = $(ob).attr("xvalue");
	var cv = GetUserInfo(acc,"TenChucVu");
	$('#ChucVu').val(cv);
}

function EditLichCongTac(id)
{
	var action = '';
	if(id)
	{
		action = 'Sửa';
	}
	else
	{
		action = 'Thêm mới';
	}
	ShowPopup('/dhtn/Pages/lich-cong-tac/popup/sua-dang-ky-lich-ld-donvi.aspx?id=' + id, 700, 450, 'null', action + ' loại lịch công tác');
}
function AddOrEditLoaiLichCT(id) 
{
	var action = '';
	if(id)
	{
		action = 'Sửa';
	}
	else
	{
		action = 'Thêm mới';
	}
	ShowPopup('/dhtn/Pages/lich-cong-tac/popup/them-loai-lich-cong-tac.aspx?id=' + id, 700, 500, 'null', action + ' loại lịch công tác');
}

function ChuyenCanBoKhac()
{
	var id = GetItemDanhDauID();
	if(id.length <= 0)
		alert('Bạn chưa tích chọn lịch công tác nào');
	else if(id.length > 1)
		alert('Bạn chỉ được tích chọn 1 lịch công tác');
	else
		ShowPopup('/dhtn/Pages/lich-cong-tac/popup/chuyen-can-bo-khac.aspx?id=' + id + "&type=chuyen", 600, 505, 'null', 'Chuyển lịch công tác cho cán bộ khác');
}
function LuuChuyenCanBoKhac()
{
	var id = GetQueryString('id');
	var loai = GetQueryString('type');
	var nguoinhan = $('#NguoiThamGia').attr('xvalue');
	var lydo = GetFieldValue('LyDo');
	if (loai == 'chuyen')
	{
		if(typeof nguoinhan == 'undefined' || nguoinhan == '')
		{
			alert('Chưa chọn cán bộ khác');
			return;
		}
		var type = "Chuyển";
	}
	else if (loai == 'khongduyet')
		var type = "Không duyệt";
	var p = new Array();
	p.push(id);
	p.push(type);
	p.push(nguoinhan);
	p.push(lydo);
	var r = CallWebService(urlService, 'DuyetLichCongTac', p).text();
	
	window.parent.HidePopup('1');
}
function DuyetLichCongTac(obj)
{
	var count = "";
	var ids = new Array();
	var listName = list_dm;	
	$("#tableDanhMuc").find("input[id][type='checkbox'][name='check']").each(function(i){
		if($(this).attr('checked') == true)
		{
			ids[i] = $(this).attr("id");
			count+="\n["+$(this).attr("title")+"]";
		}
		});
	
		if(count != "")
		{
			if (confirm("Duyệt các danh mục: " + count + "?"))
			{
				for(index in ids)
				{
					var id = ids[index];
					var type = "Duyệt";
					var p = new Array();
					p.push(id);
					p.push(type);
					p.push('');
					var r = CallWebService(urlService, 'DuyetLichCongTac', p).text();
				}
				top.location = window.location;
			}
		}
		else
		{
			alert('Bạn phải chọn ít nhất một'+ title_dm +'!');
		}
}

function KhongDuyetLichCongTac()
{
	var id = GetItemDanhDauID();
	if(id.length <= 0)
		alert('Bạn chưa tích chọn lịch công tác nào');
	else if(id.length > 1)
		alert('Bạn chỉ được tích chọn 1 lịch công tác');
	else
		ShowPopup('/dhtn/Pages/lich-cong-tac/popup/chuyen-can-bo-khac.aspx?id=' + id + "&type=khongduyet", 600, 250, 'null', 'Không đồng ý lịch công tác');
}




// Ẩn hiện lý do
function KhongDuyetLich()
{
	var actionKhongDuyet = 		'<tr width="20%" align="right">'
								+ '<td style="width: 20%"></td>'
								+ '<td align="left" style="text-align:left;">'
								+ '<a href="javascript:" accesskey="A" class="TDBtnOK" title="Đồng ý" onclick="CapNhatKhongDuyet()">Đồng ý</a>'
								+ '<a href="javascript:" accesskey="C" class="TDBtnCancel" title="Bỏ qua" onclick="window.parent.HidePopup(1)">Bỏ qua</a>'
								+ '</td>'		
								+ '</tr>';
	$('#trKhongDuyet').show();
	$('#trKhongDuyet').after(actionKhongDuyet);
	$('#actionDuyetLich').hide();
}

function CapNhatDuyetLich()
{
	var id = GetQueryString('id');
	var trangthai = 'Đã duyệt';
	var fields = new Array('ID', 'TrangThai');
	var values = new Array(id, trangthai);
	var listName = 'Lịch làm việc';
	var r = UpdateListItemById(listName,fields,values);
	//alert(r);
	top.location = '/dhtn/Pages/lich-cong-tac/danh-sach-chua-duyet.aspx';
}

function CapNhatKhongDuyet()
{
	var id = GetQueryString('id');
	var trangthai = 'Không duyệt';
	var lydo = $('#LyDoKhongDuyet').val();
	//alert(lydo);
	var fields = new Array('ID', 'TrangThai', 'LyDoKhongDuyet');
	var values = new Array(id, trangthai, lydo);
	var listName = 'Lịch làm việc';
	var r = UpdateListItemById(listName,fields,values);
	//alert(r);
	top.location = '/dhtn/Pages/lich-cong-tac/danh-sach-chua-duyet.aspx';
}


function KhongDuyetNhieuLich()
{
	var ids = GetQueryString('ids').split(',');
	var count = GetQueryString('count');
	var listName = GetQueryString('listName');
	var lydo = $('#LyDoKhongDuyet').val();
	if (confirm("Không duyệt các danh mục: " + count + "?"))
			{
				for(index in ids)
				{
					var id = Number(ids[index]);
					//alert(id);
					var trangthai = 'Không duyệt';
					var fields = new Array('ID', 'TrangThai', 'LyDoKhongDuyet');
					var values = new Array(id, trangthai, lydo);
					var r = UpdateListItemById(listName ,fields,values);
					//alert(r);
				}
				return
				top.location = '/dhtn/Pages/lich-cong-tac/danh-sach-chua-duyet.aspx';
			}
}

/////(


function DangKyLichCongTac(callback)
{
  	if (DateVN2EN($('#TuNgay').val()) < DateVN2EN($('#NgayHienTai').val()))
	{
		$('#thongbao').text('Ngày đăng ký không được nhỏ hơn ngày hiện tại!');
		return;
	}
	else
	{
		$('#thongbao').text('');
	}

	var tungay=$('#TuNgay').val();
	var denngay=$('#DenNgay').val();
	var ThoiGianTu = $('#ThoiGianTu').val();
	var PhutTu = $('#PhutTu').val();
	var ThoiGianDen = $('#ThoiGianDen').val();
	var PhutDen = $('#PhutDen').val();
	if(IsCompareDate(tungay,denngay))
	{
		if (ThoiGianTu != '' && PhutTu == '')
			SetFFieldValue('PhutTu','00');
		if (ThoiGianDen  != '' && PhutDen == '')
			SetFFieldValue('PhutDen','00');
	  //Đến ngày phải lớn hơn hoặc bằng từ ngày
		var listname = 'Lịch làm việc';
		var id='';
		var xml = GetFormValue('tableDKLichCT');
		var p = new Array();
		p.push(listname);
		p.push(id);
		p.push(Encode(xml));
		var r = CallWebService(urlService, 'DangKyLich', p).text();
		
		if(callback)
			callback()
		else
			top.location = '/dhtn/Pages/lich-cong-tac/danh-sach-dk-lich-cong-tac.aspx'; 	 
	}
	else
	{
		alert('Đến ngày phải lớn hơn hoặc bằng từ ngày');
	}		 
}
function DangKyTiepLichCongTac()
{
  	if (DateVN2EN($('#TuNgay').val()) < DateVN2EN($('#NgayHienTai').val()))
	{
		$('#thongbao').text('Ngày đăng ký không được nhỏ hơn ngày hiện tại!');
		return;
	}
	else
	{
		$('#thongbao').text('');
	}

	var tungay=$('#TuNgay').val();
	var denngay=$('#DenNgay').val();
	var ThoiGianTu = $('#ThoiGianTu').val();
	var PhutTu = $('#PhutTu').val();		
	if(IsCompareDate(tungay,denngay))
	{
		if (ThoiGianTu != '' && PhutTu == '')
			SetFFieldValue('PhutTu','00');
		if (ThoiGianDen  != '' && PhutDen == '')
			SetFFieldValue('PhutDen','00');
	  	//Đến ngày phải lớn hơn hoặc bằng từ ngày
		var listname = 'Lịch làm việc';
		var id='';
		var xml = GetFormValue('tableDKLichCT');
		var p = new Array();
		
		p.push(listname);
		p.push(id);
		p.push(Encode(xml));
		var r = CallWebService(urlService, 'DangKyLich', p).text();
		alert('Đăng ký thành công');
		top.location = window.location; 	 
	}
	else
	{
		alert('Đến ngày phải lớn hơn hoặc bằng từ ngày');
	}	
}

function SuaKyLichCongTac(id)
{
	id=''+id;	
	var tungay=$('#TuNgay').val();
	var denngay=$('#DenNgay').val();
	if(IsCompareDate(tungay,denngay))
	{
		if (ThoiGianTu != '' && PhutTu == '')
			SetFFieldValue('PhutTu','00');
		if (ThoiGianDen  != '' && PhutDen == '')
			SetFFieldValue('PhutDen','00');
	  //Đến ngày phải lớn hơn hoặc bằng từ ngày
		var listname = 'Lịch làm việc';			 
		var xml = GetFormValue('tableDKLichCT');
		var p = new Array();
		p.push(listname);
		p.push(id);
		p.push(Encode(xml));
		var r = CallWebService(urlService, 'DangKyLich', p).text();			 
		if(typeof window.parent.EditLich_callback!='undefined')
		{
			window.parent.EditLich_callback(r);
			window.parent.HidePopup();
		}
		else
			top.location = '/dhtn/Pages/lich-cong-tac/danh-sach-dk-lich-cong-tac.aspx'; 		
	}
	else
	{
		alert('Đến ngày phải lớn hơn hoặc bằng từ ngày');
	}	 
}

/////////////////////
function AddOrEditLanhDao(id)
{
	var action = '';
	if(id)
	{
		action = 'Sửa';
	}
	else
	{
		action = 'Thêm mới';
	}
	ShowPopup('/dhtn/Pages/lich-cong-tac/popup/them-lanh-dao.aspx?id=' + id, 700, 500, 'null', action + ' thông tin lãnh đạo');
}

function AddOrEditLanhDaoBo(id)
{
	var action = '';
	if(id)
	{
		action = 'Sửa';
	}
	else
	{
		action = 'Thêm mới';
	}
	ShowPopup('/dhtn/Pages/lich-cong-tac/popup/them-lanh-dao-bo.aspx?id=' + id, 700, 500, 'null', action + ' thông tin lãnh đạo');
}

////////////// Lấy ngày đầu tuần của Tuần ngày hiện tại
function LayNgayDauTuan(value)
{
	var date = new Date();
	var d = value.split('/')[0];
	var m = Number(value.split('/')[1]);
	var y = value.split('/')[2];
	date.setDate(d);	
	date.setMonth(m -1);
	date.setFullYear(y);
	//alert(date);
	var day = date.getDay();
	
	
	if(day == 0)
	{
		date.setTime(date.getTime() -  6 * 86400000);
	}
	else
	{
		date.setTime(date.getTime() -  (day - 1) * 86400000);
	}
	var nd = date.getDate()> 10 ? date.getDate(): '0'+ date.getDate();
	var firstday = nd + '/' + Number(date.getMonth() + 1) + '/' + date.getFullYear();
	return firstday;
}
////////////// Lấy ngày cuối tuần của Tuần ngày hiện tại
function LayNgayCuoiTuan(value)
{
	// lay ngay dau tuan
	var date = new Date();
	var d = value.split('/')[0];
	var m = Number(value.split('/')[1]);
	var y = value.split('/')[2];
	date.setDate(d);	
	date.setMonth(m -1);
	date.setFullYear(y);
	//alert(date);
	var day = date.getDay();
	
	
	if(day == 0)
	{
		date.setTime(date.getTime() -  6 * 86400000);
	}
	else
	{
		date.setTime(date.getTime() -  (day - 1) * 86400000);
	}
	 
	// lay ngay cuoi tuan = ngay dau tuan +6
	
	var nextday= new  Date(date.getFullYear(),date.getMonth(),date.getDate()+6);
	var nd = nextday.getDate()> 10 ? nextday.getDate(): '0'+ nextday.getDate();	 
	return nextday= nd +"/"+ parseInt(nextday.getMonth()+1)+"/"+nextday.getFullYear();	
	 
}

function LayNgayTheoThu(ngaychon, day)
{
	var ngaydautuan = LayNgayDauTuan(ngaychon);
	var d = ngaydautuan .split('/')[0];
	var m = Number(ngaydautuan .split('/')[1]) - 1 ;
	var y = ngaydautuan .split('/')[2];
	var date = new Date();
	date.setDate(d);	
	date.setMonth(m);
	date.setFullYear(y);
	date.setTime(date.getTime() +  (day - 2) * 86400000);
	var nd = date.getDate()>=10? date.getDate(): '0'+ date.getDate();
	var nm = Number(date.getMonth() + 1)>=10? Number(date.getMonth() + 1): '0'+ Number(date.getMonth() + 1);
	var ny = date.getFullYear()>= 10? date.getFullYear(): '0'+ date.getFullYear();
	var result = nd + '/' + nm  + '/' + ny;
	return result;	
}
////////////// Lấy ngày hiện tại
function LayNgayHienTai()
{
	var date = new Date();
	//alert(date);
	var nd = date.getDate()>10? date.getDate(): '0'+ date.getDate();
	var nm = Number(date.getMonth() + 1)>10? Number(date.getMonth() + 1): '0'+ Number(date.getMonth() + 1);
	var ny = date.getFullYear()> 10 ? date.getFullYear(): '0'+ date.getFullYear();
	var result = nd + '/' + nm  + '/' + ny;
	return result;
}

///
function InitLichCongTac(id)
{	
	
	var ngay = GetQueryString('ngay');
	if(ngay == 'undefined' || ngay == '')
		ngay = LayNgayHienTai();
	$('#'+id+' ul li').each(function(){
		var id = $(this).find('a').attr('tab');
		id = id.split('-')[1];
		var date = LayNgayTheoThu(ngay, id)
		$(this).find('a').after('<br/><span> Ngày '+date+'</span>');
		$(this).attr('date', date);
		if($(this).attr('date') == ngay)
		{
			$(this).css({
				background: '#C2DCFF'
			});
			$(this).addClass('selected');
			var tabid = $(this).find('a').attr('tab');
			$('#'+tabid).css({
				display:'none'
			});
			
		}
		else
		{
			$(this).removeClass('selected');
			$(this).css({
				background: 'transparent'
			});
		}
	});	
}
/*
function LocDuLieuTheoNgay()
{
	$('#tabLich ul li').each(function(){
		var date = $(this).attr('date');
		var id = $(this).find('a').attr('tab');
		
		$('#'+id+' .maincontent_odd').each(function(){
			var value = $(this).find('.ngaylamviec').text();
			if (value == date)
			{
				$(this).show();
			}
			else
			{
				$(this).remove();
			}
		});
	$('#'+id+' .maincontent_even').each(function(){
			var value = $(this).find('.ngaylamviec').text();
			if (value == date)
			{
				$(this).show();
			}
			else
			{
				$(this).remove();
			}
		});
	});
}
*/

function LocDuLieuTheoNgay()
{
	
	$('#tabLich ul li').each(function(){
		var date = $(this).attr('date');
		var id = $(this).find('a').attr('tab');
		
		if($(this).attr('class') == 'selected')
		{
			$('#tableDanhMuc').find('.maincontent_odd').each(function(){
				var value = $(this).find('.ngaylamviec').text();				
				if (value == date)
				{
					$(this).show();
				
				}
				else
				{
					$(this).hide();
				}
			});
			
			$('#tableDanhMuc').find('.maincontent_even').each(function(){
				var value = $(this).find('.ngaylamviec').text();
				if (value == date)
				{
					$(this).show();
				}
				else
				{
					$(this).hide();
				}
			});
		}

		$(this).click(function(){
			$('#tableDanhMuc').find('.maincontent_odd').each(function(){
				var value = $(this).find('.ngaylamviec').text();
				if (value == date)
				{
					$(this).show();
				}
				else
				{
					$(this).hide();
				}
			});
			$('#tableDanhMuc').find('.maincontent_even').each(function(){
				var value = $(this).find('.ngaylamviec').text();
				if (value == date)
				{
					$(this).show();
				}
				else
				{
					$(this).hide();
				}
			});
		});
	});	
}




function SetQueryString()
{
	var loailich = GetQueryString('loailich');
	var lanhdao = GetQueryString('lanhdao');
	var ngay = GetQueryString('ngay');
	
	if(loailich == 'undefined')
		loailich = '';
	if(lanhdao == 'undefined')
		lanhdao = '';
	if(ngay == 'undefined')
		ngay = '';		
	
        $('#LoaiLich').change(function(){
        	loailich = $(this).val();
			top.location = '/dhtn/Pages/lich-cong-tac/default.aspx?loailich=' + loailich + '&lanhdao=' + lanhdao + '&ngay=' + ngay;        	
        });
        $('#LanhDao').change(function(){
        	lanhdao = $(this).val();
        	top.location = '/dhtn/Pages/lich-cong-tac/default.aspx?loailich=' + loailich + '&lanhdao=' + lanhdao + '&ngay=' + ngay;
        });
        $('#Ngay').change(function(){
        	ngay = $(this).val();
        	top.location = '/dhtn/Pages/lich-cong-tac/default.aspx?loailich=' + loailich + '&lanhdao=' + lanhdao + '&ngay=' + ngay;
        });  	   
}

/// Hiển thị thông tin chi tiết
function ShowCalDetail(id,type)
{
	var title = "Chi tiết lịch công tác";
    var url = "/dhtn/Pages/lich-cong-tac/popup/view-lich-ca-nhan.aspx?uid=";
    if(type=='Lịch cá nhân')
	{
		url='/dhtn/Pages/lich-cong-tac/popup/view-lich-ca-nhan.aspx?uid=';
	}
	else if(type=='Lịch lãnh đạo bộ')
	{
		url='/dhtn/Pages/lich-cong-tac/popup/view-lich-lanh-dao.aspx?uid=';
	}	
	else if(type=='Đơn vị')
	{
		url='/dhtn/Pages/lich-cong-tac/popup/view-lich-don-vi.aspx?uid=';
	}
	else if(type=='Lịch cho người khác')
	{
		url='/dhtn/Pages/lich-cong-tac/popup/view-lich-can-bo-khac.aspx?uid=';
	}
	else if(type == 'Lịch lãnh đạo đơn vị')
	{
		url= '/dhtn/Pages/lich-cong-tac/popup/view-lich-lanh-dao.aspx?uid='
	}
	else
	{
		url='/dhtn/Pages/lich-cong-tac/popup/view-lich-ca-nhan.aspx?uid=';
	}
	var params = {
        title:title,
        url: url + +id,
        width: 800,
        height: 500,
        callback: function (result, returnvalue) {
            if (result === SP.UI.DialogResult.OK) { }
        },
        obj: null,
        maximized: false
    };
    ShowPopup(params);

}  
/* khuong viet ngay 1/11/2012 */

 function IsValidDateTime(strDate){ 
	var n=strDate.split('/');
	var  Mn =n[1];
	var  Day =n[0];
	var  Yr=n[2];

    var DateVal = Mn + "/" + Day + "/" + Yr;
    var inputDate = new Date(DateVal);  
    
    if(inputDate.getDate()!=Day){
       // alert('Invalid Date');
        return(null);
        }
    else if(inputDate.getMonth()!=Mn-1){
    //this is for the purpose JavaScript starts the month from 0
       // alert('Invalid Date');
        return(null);
        }
    else if(inputDate.getFullYear()!=Yr){
       // alert('Invalid Date');
        return(null);
        }   
    return(inputDate);
 } 
 
 
  //
  //startDate: Ngày bị so sánh
  //endDate : Ngày so sánh 
  //
  
 function IsCompareDate(startDate,endDate){// Hàm so sánh ngày tháng theo 2 chuỗi nhập vào theo định dạng là dd/MM/yyyy
 	if(endDate == '')
 		return true;
	  	var startDateTime = IsValidDateTime(startDate);
	  	var endDateTime = IsValidDateTime(endDate);
	  	if(startDateTime!=null && endDateTime !=null){
	  		if (endDateTime.getTime() >= startDateTime.getTime()){//Kiểm tra ngày nhập bắt đầu có lớn hơn ngày kết thúc
	     		 return(true);
	     	}
	  	} 
 
    return(false);
 } 
  // 
  //endDate : Ngày so sánh 
  // 
 function IsCompareDateNow(strDate){// Hàm so sánh ngày tháng theo chuỗi nhập vào theo định dạng là dd/MM/yyyy  với ngày hiên tại
	  	var endDateTime = IsValidDateTime(strDate);
	  	var startDateTime =  new Date();
	  	if(startDateTime!=null && endDateTime !=null){
	  		if (endDateTime.getTime() >= startDateTime.getTime()){//Kiểm tra ngày nhập bắt đầu có lớn hơn ngày kết thúc
	     		 return(true);
	     	}
	  	} 
 
    return(false);
 }
function getQuerystring(key, default_)
{
  if (default_==null) default_="";
  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
  var qs = regex.exec(window.location.href);
  if(qs == null)
    return default_;
  else
    return qs[1];
}

/* Lấy tổng số ngày trong năm */
function CountDateOfYear(year) 
	{
		var date=new Date(year, 2, 0);
		if(date.getDate() > 28)
		    return 365;
	    else  return 366;
	}
function CountWeekOfYear(year) 
	{
		var count=	CountDateOfYear(year);	
		return Math.ceil(count/ 7);
	}


/* Lấy ngày thứ mấy của năm */
function getDayOfYear(date) 
	{
		var offset = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 1).getTime();
		return Math.ceil(offset / 1000 / 60 / 60 / 24);
	}

// Lấy tên thứ tiếng việt của 1 ngày bất kì
function GetNameDay(date) 
{     
	var now=(''+date).substring(0,3);
    var thu=''; 
    switch(now){
		case 'Sun': thu='Chủ nhật'; break;
		case 'Mon':thu='Thứ hai'; break;
		case 'Tue': thu='Thứ 3'; break;
		case 'Wed': thu='Thứ 4'; break;
		case 'Thu': thu='Thứ 5'; break;
		case 'Fri':thu='Thứ 6'; break;
		case 'Sat':thu='Thứ 7'; break;
      }
   return thu;
}


//Lấy tên ngày của tuần bất kì trong năm
function GetNameDayInWeek(indexWeek,year)
{
	var curr = new Date(parseInt(year),0,1);
	curr.setDate(curr.getDate() + (indexWeek-1) * 7);
	var firstdate= new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
	var tomorrow = new Date(curr.setDate(curr.getDate() - curr.getDay() + 2));
 	var twoDays = new Date(curr.setDate(curr.getDate() - curr.getDay() + 3));
 	var threeDays  = new Date(curr.setDate(curr.getDate() - curr.getDay() + 4));
 	var fourDays  = new Date(curr.setDate(curr.getDate() - curr.getDay() + 5));
 	var fiveDays  = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
	var sixDays  = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));
	
	
	
 	var titledate='';//<th  style="width:15%;">'+GetNameDay(firstdate)+'<span class="ngay">'+DateTimeVN(firstdate)+'</span>'+'</th>';
	 
	var i=0;
	for(i=0;i<=6;i++){
		var date = new Date(firstdate.getTime() + i*24 * 60 * 60 * 1000);//thu 3
		titledate=titledate+'<th  nowrap="" style="width:15%;">'+GetNameDay(date)+'<br/><span class="ngay">'+DateTimeVN(date)+'</span>'+'</th>';
	}
	// alert(titledate);	

	return titledate;
}
function DateTimeVN(dateTime) 
	{ 		 
		var nd = dateTime.getDate()>= 10 ? dateTime.getDate(): '0'+ dateTime.getDate();	 
	  	var nm= parseInt(dateTime.getMonth()+1) >=10? parseInt(dateTime.getMonth()+1):'0'+parseInt(dateTime.getMonth()+1);
	  	return  nd +"/"+nm+"/"+dateTime.getFullYear();	
	}

/* Lấy tuần thứ mấy của năm */
function getWeekOfYear(date) 
	{
		d = new Date(date);
	    d.setHours(0,0,0);
	    /*// Set to nearest Thursday: current date + 4 - current day number
	    // Make Sunday's day number 7
	    d.setDate(d.getDate() + 4 - (d.getDay()||7));
	    // Get first day of year
	    var yearStart = new Date(d.getFullYear(),0,1);
	    // Calculate full weeks to nearest Thursday
	    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
	    // Return array of year and week number
	    return weekNo;*/
	    
	    var onejan = new Date(d.getFullYear(), 0, 1);
        return Math.ceil((((d- onejan) / 86400000) + onejan.getDay() + 1) / 7); // Math.ceil((((date- onejan) / 86400000) + onejan.getDay() + 1) / 7);
	} 
	/* Lấy hiện tại là tuần thứ mấy của năm */
function getCurentWeekOfYear() 
	{
		var date= new Date();		 
		return getWeekOfYear(date);
	} 	

function getFirstDayOfWeekDate(week,year) 
	{ 
		var curr = new Date(parseInt(year),0,1);
		curr.setDate(curr.getDate() + (week-1) * 7);
		var firstdate= new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
		return firstdate;
	} 
function getFirstDayOfWeek(week,year) 
	{ 
		var curr = new Date(parseInt(year),0,1);
		curr.setDate(curr.getDate() + (week-1) * 7);
		var firstdate= new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
		var nd = firstdate.getDate()>= 10 ? firstdate.getDate(): '0'+ firstdate.getDate();	 
	  	var nm= parseInt(firstdate.getMonth()+1) >=10? parseInt(firstdate.getMonth()+1):'0'+parseInt(firstdate.getMonth()+1);
	  	return  nd +"/"+nm+"/"+firstdate.getFullYear();
	}
function getLastDayOfWeek(week,year) 
{ 
	var curr = new Date(parseInt(year),0,1);
	curr.setDate(curr.getDate() + (week-1) * 7);
	var lastdate= new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));
	var nd = lastdate.getDate()>= 10 ? lastdate.getDate(): '0'+ lastdate.getDate();	 
	var nm= parseInt(lastdate.getMonth()+1) >=10? parseInt(lastdate.getMonth()+1):'0'+parseInt(lastdate.getMonth()+1);
  	return  nd +"/"+nm+"/"+lastdate.getFullYear();
}
function GetPhongBanByUserName() 
{		 
	var xml = CallWebService(serviceLichUrl,'LayPhongBanNguoiDung',null,null,false).text();			
	return xml;	 

}
function GetDonViByUserName() 
{	 
	 
	var xml = CallWebService(serviceLichUrl,'LayDonViNguoiDung',null,null,false).text();			
	return xml; 

}
	
function GetLichByCurentWeek(loailich)
{	   	
 	var ngayhientai=LayNgayHienTai();
	var ngaydautuan=LayNgayDauTuan(ngayhientai);
	var ngaycuoituan= LayNgayCuoiTuan(ngayhientai);  
 	GetAllLich(loailich,'',ngaydautuan,ngaycuoituan); 
}

function GetAllLichTemp(loailich,hoten,ngaybatdau,ngayketthuc,name,allowEdit) 
{ 			 
	var xml1='';	    
	var type='';	
	switch(loailich){
    	case 'Lịch công tác lãnh đạo bộ': 
			var listname = 'LayLichCongTacLanhDaoBo';
			type='Lịch lãnh đạo bộ';   
		 	var p = new Array();    	
			p.push(ngaybatdau);
			p.push(ngayketthuc);
			xml1 = CallWebService(serviceLichUrl,'LayLichCongTacLanhDaoBoGuest',p,null,null,false).text();
			break;
    	case 'Lịch công tác lãnh đạo văn phòng':	 
    		type='Lịch lãnh đạo đơn vị'; 		    		 
		 	var p = new Array();
		 	p.push(ngaybatdau);
			p.push(ngayketthuc);			 
			xml1 = CallWebService(serviceLichUrl,'LayLichCongTacLanhDaoPhongBan',p,null,null,false).text();
			break;
    	case 'Lịch công tác lãnh đạo đơn vị':	
    		type='Lịch lãnh đạo đơn vị';  		    		 
		 	var p = new Array();
		 	p.push(ngaybatdau);
			p.push(ngayketthuc);		
			xml1 = CallWebService(serviceLichUrl,'LayLichCongTacLanhDaoDonVi',p,null,null,false).text();
			break; 	
    	default:
			var listname = 'LayLichCongTacLanhDao';  
		 	var p = new Array();	 
		 	p.push(loailich);	
			p.push(ngaybatdau);
			p.push(ngayketthuc);			 
			xml1 = CallWebService(serviceLichUrl,'LayLichCongTacLanhDao',p,null,null,false).text();
			break; 		    	
	}
 		
var xml = StringtoXML(xml1);

var alllich='<ul class="tabmenu hidden">';
var lichbody = '';
var lichhead = '<table style="width:100%; border-bottom:1px gray solid; ">';
	lichhead +='<tr>';
	lichhead +='<td style="padding-left:10px; padding-right:10px;font-weight:500; width:170px">Lãnh đạo</td>';
	lichhead +='<td style="padding-left:10px; padding-right:10px;font-weight:500; width:60px">Thời gian</td>';
	lichhead +='<td style="padding-left:10px; padding-right:10px;font-weight:500">Nội dung công việc</td>';
	lichhead +='<td style="padding-left:10px; padding-right:10px;font-weight:500; width:20%">Chủ trì/ Tham dự</td>';
	lichhead +='<td style="padding-left:10px; padding-right:10px;font-weight:500; width:160px">Địa điểm</td>';
	lichhead +='</tr>';
	lichhead +='</table>';
	var num=2;
	$(xml).find('date').each(function(){						 
			var tenthu='&nbsp;'+ $(this).attr('thu');  // Tên thứ
			var ngayofthu='&nbsp;'+ $(this).attr('ngay');  // Ngày của thứ
		 	// Lấy nội dung của lãnh đạo 			 
		 	alllich += '<li><a href="#tab-'+num+'"><span>'+tenthu+'</span><br/>Ngày '+ngayofthu+'</a></li>';
			var itemindata='';
			itemindata += lichhead;
			$(this).find('lanhdao').each(function(){
					var tenlanhdao='&nbsp;'+$(this).attr('hoten');	
					tenlanhdao=tenlanhdao.replace('BT','');
					tenlanhdao=tenlanhdao.replace('TTTT ','').replace('TT','');						
					var chucvu=$(this).attr('chucvu');
					
					var itemlanhdao='';
			 		itemlanhdao = '<table style="width:100%; border-bottom:1px gray solid;">';
					itemlanhdao += '<tr><td style="width:170px"><div style="font-style:italic">'+chucvu+'</div><div style="font-weight:500;">'+tenlanhdao+'</div></td><td>';	 
						 var itemlichtemp = '<table style="width:100%;">';
						 var ids = new Array();
						 var thoigians = new Array();
						 var sukiens = new Array();
						 var thanhphans = new Array();
						 var diadiems = new Array();
						 var capnhats = new Array();
						 $(this).find('item').each(function(){
						 	var id=	$(this).attr('id');
						 	ids.push(id);
						 	var thoigian=$(this).attr('tugio')+'-'+$(this).attr('dengio')+':';
							if(thoigian==':-:')thoigian='';
							thoigian = thoigian.replace('-:','');
							thoigian = thoigian.replace(':-','');
							thoigians.push(thoigian);
						 	var sukien='&nbsp;'+ SPDecode($(this).attr('sukien'));
						 	sukiens.push(sukien);						
							var thanhphan='&nbsp;'+ SPDecode($(this).attr('thanhphan'));
							thanhphans.push(thanhphan);
							var diadiem='&nbsp;'+SPDecode($(this).attr('diadiem'));	
							diadiems.push(diadiem);
							var capnhat='&nbsp;'+$(this).attr('capnhat');
							capnhats.push(capnhat);
						 });
						 if (ids.length > 1)
						 {
						 	 var i = 0;
							 itemlichtemp+='<tr>';
							 itemlichtemp+='<td colspan="4">';
							 while ( i < ids.length - 1) 
							 {
								itemlichtemp+= '<table style="width:100%; border-bottom:1px gray solid;">';									 
								itemlichtemp+='<tr>';
							    itemlichtemp+='<td style="padding: 5px; color:red; width:100px">'+thoigians[i]+'</td>';
								itemlichtemp+='<td style="padding: 5px"><a href="javascript:" style="text-decoration:none" onclick="lich.viewCu(this.id)" id="'+ids[i]+'">'+sukiens[i]+ '</a></td>';
								itemlichtemp+='<td style="padding: 5px; width:30%">'+thanhphans[i]+'</td>';
								itemlichtemp+='<td style="padding: 5px; width:160px">'+diadiems[i]+'</td>';
								itemlichtemp+='</tr>';
								itemlichtemp += '</table>';
								i+=1;
							}
							itemlichtemp+='<td>';
							itemlichtemp+='</tr>';
							itemlichtemp+='<tr>';
						    itemlichtemp+='<td style="padding: 5px; color:red; width:100px">'+thoigians[ids.length - 1]+'</td>';
							itemlichtemp+='<td style="padding: 5px"><a href="javascript:" style="text-decoration:none" onclick="lich.viewCu(this.id)" id="'+ids[ids.length - 1]+'">'+sukiens[ids.length - 1]+ '</a></td>';
							itemlichtemp+='<td style="padding: 5px; width:30%">'+thanhphans[ids.length - 1]+'</td>';
							itemlichtemp+='<td style="padding: 5px; width:160px">'+diadiems[ids.length - 1]+'</td>';
							itemlichtemp+='</tr>';
						}
						else if (ids.length == 1)
						{									 
							itemlichtemp+='<tr>';
						    itemlichtemp+='<td style="padding: 5px; color:red; width:100px">'+thoigians[0]+'</td>';
							itemlichtemp+='<td style="padding: 5px"><a href="javascript:" style="text-decoration:none" onclick="lich.viewCu(this.id)" id="'+ids[0]+'">'+sukiens[0]+ '</a></td>';
							itemlichtemp+='<td style="padding: 5px; width:30%">'+thanhphans[0]+'</td>';
							itemlichtemp+='<td style="padding: 5px; width:160px">'+diadiems[0]+'</td>';
							itemlichtemp+='</tr>';					
						}
						itemlichtemp += '</table>';
						//alert(itemlichtemp);
						itemlanhdao += itemlichtemp;
	           			itemlanhdao +='</td></tr></table>';
	           			//alert(itemlanhdao);
	           			itemindata += itemlanhdao;
				});
			lichbody += '<div id="tab-'+num+'">';
			lichbody += itemindata;
			lichbody += '</div>';
			num++;
	});
	
	alllich += '</ul>';
	alllich += lichbody;
	alllich = '<div id="tabs" class="tabs" style="">' + alllich + '</div>';
  	$("#LichDetails").html(alllich); 	
 	GetDataPrivew(xml);	 
}
function GetAllLichTempTest(loailich,hoten,ngaybatdau,ngayketthuc,name,allowEdit) 
{ 			 
	var xml1='';	
	var type='';	    	
	switch(loailich){
    	case 'Lịch công tác lãnh đạo bộ': 
    		type='Lịch lãnh đạo bộ';
			var listname = 'LayLichCongTacLanhDaoBo';  
		 	var p = new Array();    	
			p.push(ngaybatdau);
			p.push(ngayketthuc);
			xml1 = CallWebService(serviceLichUrl,'LayLichCongTacLanhDaoBoGuest',p,null,null,false).text();
			break;
    	case 'Lịch công tác lãnh đạo văn phòng':	
    		type='Lịch lãnh đạo đơn vị'; 		    		 
		 	var p = new Array();
		 	p.push(ngaybatdau);
			p.push(ngayketthuc);			 
			xml1 = CallWebService(serviceLichUrl,'LayLichCongTacLanhDaoPhongBan',p,null,null,false).text();
			break;
    	case 'Lịch công tác lãnh đạo đơn vị':	
    		type='Lịch lãnh đạo đơn vị';  		    		 
		 	var p = new Array();
		 	p.push(ngaybatdau);
			p.push(ngayketthuc);		
			xml1 = CallWebService(serviceLichUrl,'LayLichCongTacLanhDaoDonVi',p,null,null,false).text();
			break; 
		case 'Lịch công tác lãnh đạo cục chăn nuôi':	
    		type='Lịch lãnh đạo đơn vị';  		    		 
		 	var p = new Array();
		 	p.push(ngaybatdau);
			p.push(ngayketthuc);		
			p.push('CN');
			xml1 = CallWebService(serviceLichUrl,'LayLichCongTacLanhDaoDonViGuest',p,null,null,false).text();
			break;	
		case 'Lịch công tác lãnh đạo Tổng cục Lâm nghiệp':	
    		type='Lịch lãnh đạo đơn vị';  		    		 
		 	var p = new Array();
		 	p.push(ngaybatdau);
			p.push(ngayketthuc);		
			p.push('TCLN');
			xml1 = CallWebService(serviceLichUrl,'LayLichCongTacLanhDaoDonViGuest',p,null,null,false).text();
			break;
    	default:
			var listname = 'LayLichCongTacLanhDao';  
		 	var p = new Array();	 
		 	p.push(loailich);	
			p.push(ngaybatdau);
			p.push(ngayketthuc);			 
			xml1 = CallWebService(serviceLichUrl,'LayLichCongTacLanhDao',p,null,null,false).text();
			break; 			    	
	}	
	$('#LichPrintDetails').html(xml1);
var xml = StringtoXML(xml1);

var alllich='<div class="tabbable tabbable-custom hidden"><ul class="nav nav-tabs">';
var lichbody = '';
var lichhead = '<table style="width:100%; border-bottom:1px gray solid; ">';
	lichhead +='<tr>';
	lichhead +='<td style="padding-left:10px; padding-right:10px;font-weight:bold; width:130px">Lãnh đạo</td>';
	lichhead +='<td style="padding-left:10px; padding-right:10px;font-weight:bold; width:60px">Thời gian</td>';
	lichhead +='<td style="padding-left:10px; padding-right:10px;font-weight:bold">Nội dung công việc</td>';
	lichhead +='<td style="padding-left:10px; padding-right:10px;font-weight:bold; width:20%">Chủ trì/ Tham dự</td>';
	lichhead +='<td style="padding-left:10px; padding-right:10px;font-weight:bold; width:160px">Địa điểm</td>';	
	lichhead +='<td style="padding-left:10px; padding-right:10px;font-weight:bold; width:100px">Cập nhật</td>';
	lichhead +='</tr>';
	lichhead +='</table>';
	var num=2;
	$(xml).find('date').each(function(){						 
			var tenthu='&nbsp;'+ $(this).attr('thu');  // Tên thứ
			var ngayofthu='&nbsp;'+ $(this).attr('ngay');  // Ngày của thứ
		 	// Lấy nội dung của lãnh đạo
		 	alllich +='<li><a href="#tab_'+num+'" data-toggle="tab"><span>'+tenthu+'</span><br/>Ngày '+ngayofthu+'</a></li>';
			var itemindata='';
			itemindata += lichhead;
			$(this).find('lanhdao').each(function(){
					var tenlanhdao='&nbsp;'+$(this).attr('hoten');	
					tenlanhdao=tenlanhdao.replace('BT','');
					tenlanhdao=tenlanhdao.replace('TTTT ','').replace('TT','');						
					var chucvu=$(this).attr('chucvu');
					
					var itemlanhdao='';
			 		itemlanhdao = '<table style="width:100%; border-bottom:1px gray solid;">';
					itemlanhdao += '<tr><td style="width:150px"><div style="font-style:italic">'+chucvu+'</div><div style="font-weight:bold;">'+tenlanhdao+'</div></td><td>';	 
					 var itemlichtemp = '<table style="width:100%;">';
					 var ids = new Array();
					 var thoigians = new Array();
					 var sukiens = new Array();
					 var thanhphans = new Array();
					 var diadiems = new Array();
					 var capnhats = new Array();
					 $(this).find('item').each(function(){
					 	var id=	$(this).attr('id');
					 	if(id != '')
						{
						 	ids.push(id);
						 	var thoigian=$(this).attr('tugio')+'-'+$(this).attr('dengio')+':';						
							thoigian = thoigian.replace(':-::','');
							thoigian = thoigian.replace('-::',':');
							thoigian = thoigian.replace(':-','');
							thoigian = thoigian.replace('::',':');
							thoigians.push(thoigian);
						 	var sukien='&nbsp;'+ SPDecode($(this).attr('sukien'));
						 	sukiens.push(sukien);						
							var thanhphan='&nbsp;'+ SPDecode($(this).attr('thanhphan'));
							thanhphans.push(thanhphan);
							var diadiem='&nbsp;'+SPDecode($(this).attr('diadiem'));	
							diadiems.push(diadiem);
							var capnhat='&nbsp;'+$(this).attr('capnhat');
							capnhats.push(capnhat);
						}
					 });
					 if (ids.length > 1)
					 {
					 	 var i = 0;
						 itemlichtemp+='<tr>';
						 itemlichtemp+='<td colspan="5">';
						 while ( i < ids.length - 1) 
						 {
							itemlichtemp+= '<table style="width:100%; border-bottom:1px gray solid;">';									 
							itemlichtemp+='<tr>';
						    itemlichtemp+='<td style="padding: 5px; color:red; width:50px">'+thoigians[i]+'</td>';
							itemlichtemp+='<td style="padding: 5px"><a href="javascript:" style="text-decoration:none" onclick="lich.viewCu(this.id,&quot;'+type+'&quot;)" id="'+ids[i]+'">'+sukiens[i]+ '</a></td>';
							itemlichtemp+='<td style="padding: 5px; width:20%">'+thanhphans[i]+'</td>';
							itemlichtemp+='<td style="padding: 5px; width:160px">'+diadiems[i]+'</td>';
							itemlichtemp+='<td style="padding: 5px; width:100px">'+capnhats[i]+'</td>';
							itemlichtemp+='</tr>';
							itemlichtemp += '</table>';
							i+=1;
						}
						itemlichtemp+='<td>';
						itemlichtemp+='</tr>';
						itemlichtemp+='<tr>';
					    itemlichtemp+='<td style="padding: 5px; color:red; width:50px">'+thoigians[ids.length - 1]+'</td>';
						itemlichtemp+='<td style="padding: 5px"><a href="javascript:" style="text-decoration:none" onclick="lich.viewCu(this.id,&quot;'+type+'&quot;)" id="'+ids[ids.length - 1]+'">'+sukiens[ids.length - 1]+ '</a></td>';
						itemlichtemp+='<td style="padding: 5px; width:20%">'+thanhphans[ids.length - 1]+'</td>';
						itemlichtemp+='<td style="padding: 5px; width:160px">'+diadiems[ids.length - 1]+'</td>';
						itemlichtemp+='<td style="padding: 5px; width:100px">'+capnhats[ids.length - 1]+'</td>';
						itemlichtemp+='</tr>';
					}
					else if (ids.length == 1)
					{									 
						itemlichtemp+='<tr>';
					    itemlichtemp+='<td style="padding: 5px; color:red; width:50px">'+thoigians[0]+'</td>';
						itemlichtemp+='<td style="padding: 5px"><a href="javascript:" style="text-decoration:none" onclick="lich.viewCu(this.id,&quot;'+type+'&quot;)" id="'+ids[0]+'">'+sukiens[0]+ '</a></td>';
						itemlichtemp+='<td style="padding: 5px; width:20%">'+thanhphans[0]+'</td>';
						itemlichtemp+='<td style="padding: 5px; width:160px">'+diadiems[0]+'</td>';
						itemlichtemp+='<td style="padding: 5px; width:100px">'+capnhats[0]+'</td>';
						itemlichtemp+='</tr>';					
					}
					itemlichtemp += '</table>';
					//alert(itemlichtemp);
					itemlanhdao += itemlichtemp;
           			itemlanhdao +='</td></tr></table>';
           			//alert(itemlanhdao);
           			itemindata += itemlanhdao;
				});
			lichbody += '<div class="tab-pane" id="tab_'+num+'">';
			lichbody += itemindata;
			lichbody += '</div>';
			num++;
	});
	
	alllich += '</ul>';
	alllich += '<div class="tab-content">';
	alllich += lichbody;
	alllich += '</div>';
	alllich += '</div>';
	//alllich = '<div id="tabs" class="tabs" style="">' + alllich + '</div>';
  	$("#LichDetails").html(alllich); 	
 	GetDataPrivew(xml);	 
}

function GetLichCaNhan(hoten,ngaybatdau,ngayketthuc)	
{
	var listname = 'LayLichCongTacCaNhan';  
    var p = new Array();
	p.push(hoten);
	p.push(ngaybatdau);
	p.push(ngayketthuc); 
		var xml1 = CallWebService(serviceLichUrl,'LayLichCongTacCaNhan',p,null,null,false).text();
		var alllich='<table width="100%" cellpadding="0" cellspacing="0" class="lich-cong-tac">';
	  	alllich=alllich+'<tr valign="top" class="ms-vr-title">';
	    alllich=alllich+'<th  style="width: 80px">Ngày tháng</th>'; 
		alllich=alllich+'<th >Nội dung</th>';
		alllich=alllich+'<th >Thành phần</th>';
		alllich=alllich+'<th >Địa điểm</th>';
		alllich=alllich+'<th  style="width: 72px">TG cập nhật</th>';
		alllich=alllich+'</tr>'; 			 
		var xml = StringtoXML(xml1);
		$(xml).find('date').each(function(){
				var itemofthu=0;						 
				var tenthu='&nbsp;'+ $(this).attr('thu');  // Tên thứ
				var ngayofthu='&nbsp;'+ $(this).attr('ngay');  // Ngày của thứ 
				var itemindata='';
				var itemlanhdao=''; 				
				 $(this).find('lanhdao').each(function(){ 					  
				  		// Lấy tên lãnh đạo
						  var tenlanhdao='&nbsp;'+$(this).attr('hoten');	
						// Lấy chức vụ
						 var chucvu='&nbsp;';//+$(this).attr('chucvu'); 
					 
							var itemoflanhdao=0;		
							// Lấy lịch của lãnh đạo 
							 itemindata='';
							 $(this).find('item').each(function(){					 			
						
								// Lấy nội dung tương ứng 		
								var id=	$(this).attr('id');
								//var tugio='&nbsp;'+	$(this).attr('tugio');									
								//var dengio='&nbsp;'+	$(this).attr('dengio');
								var thoigian=$(this).attr('tugio')+'-'+$(this).attr('dengio')+':';
								if(thoigian==':-:' || thoigian=='-:')thoigian='';  
								var sukien='&nbsp;'+ SPDecode($(this).attr('sukien'));							
								var thanhphan='&nbsp;'+ SPDecode($(this).attr('thanhphan'));
								var diadiem='&nbsp;'+SPDecode($(this).attr('diadiem'));	
								var capnhat='&nbsp;'+$(this).attr('capnhat'); 
								 
								if(itemoflanhdao>1)
									{
								 		itemindata=itemindata+'<tr>';
									}
							    // Nội dung công việc
							 	itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px"><b>'+thoigian+'</b>';
							  	itemindata=itemindata+'<a href="javascript:" style="text-decoration:none" onclick="lich.viewCu(this.id,&quot;Lịch cá nhân&quot;)" id="'+id+'">'+sukien+ '</a></td>';
								// Thành phần tham gia
								itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+thanhphan+'</td>';
								// Địa điểm làm việc
								itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+diadiem+'</td>';
								// Ngày cập nhật
								itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+capnhat+'</td></tr>';	
							
								itemofthu=itemofthu+1;	
								itemoflanhdao=itemoflanhdao+1;		
								 
							});
							if(itemoflanhdao==0)
							{
								itemindata='<td></td><td></td><td></td><td></td></tr>';			 
								itemoflanhdao=1;
								itemofthu++;
							}
		           			itemlanhdao=itemlanhdao+'<tr>'; 
		           			itemlanhdao=itemlanhdao+itemindata; 
 					});
 					if(itemlanhdao!=''){
					 // Có nội dung làm việc 
		 				alllich=alllich+'<tr>';
			            alllich=alllich+'<td style="padding-left:10px; padding-right:10px" rowspan="'+(itemofthu+1)+'">';
			            alllich=alllich+'<div>'+tenthu+'</div>';
			            alllich=alllich+'<div>'+ngayofthu+'</div>';
			           	alllich=alllich+'</td>';
			        	alllich=alllich+'</tr>';
			        	alllich=alllich+itemlanhdao;
			        	
					}else {      	
					 // Không có nội dung làm việc 
			        	alllich=alllich+'<tr>';
			            alllich=alllich+'<td style="padding-left:10px; padding-right:10px">';
			            alllich=alllich+'<div>'+tenthu+'</div>';
			            alllich=alllich+'<div>'+ngayofthu+'</div>';
			           	alllich=alllich+'</td>';
			          	//alllich=alllich+'<td class="ms-vb type-lanhdao" >&nbsp;</td>';		
			           	alllich=alllich+'<td style="padding-left:10px; padding-right:10px"><span class="type-thoigian">&nbsp; </span><span class="type-noidung"> &nbsp;</span></td>';
						alllich=alllich+'<td >&nbsp; </td>';
						alllich=alllich+'<td >&nbsp; </td>';
					 	alllich=alllich+'<td > &nbsp;</td>';						 
			        	alllich=alllich+'</tr>'; 	
	        		} 
			});
		 
 
	 alllich=alllich+'</table>';
	
	 $("#LichDetails").html(alllich); 

}
function GetLichDonVi(hoten,ngaybatdau,ngayketthuc)	
{
	var listname = 'LayLichCongTacDonVi'; 
    var p = new Array();
	p.push(hoten);
	p.push(ngaybatdau);
	p.push(ngayketthuc); 
	var xml1 = CallWebService(serviceLichUrl,'LayLichCongTacDonVi',p,null,null,false).text();
		var alllich='<table width="100%" cellpadding="0" cellspacing="0" class="lich-cong-tac">';
	  	alllich=alllich+'<tr valign="top" class="ms-vr-title">';
	    alllich=alllich+'<th  style="width: 80px">Ngày tháng</th>'; 
		alllich=alllich+'<th >Nội dung công việc</th>';
		alllich=alllich+'<th >Thành phần tham gia</th>';
		
		alllich=alllich+'<th >Địa điểm</th>';
		alllich=alllich+'<th >Phương tiện</th>';
		alllich=alllich+'<th  style="width: 72px">TG cập nhật</th>';
		alllich=alllich+'</tr>'; 			 
		

		var xml = StringtoXML(xml1);
		$(xml).find('date').each(function(){
				var itemofthu=0;						 
				var tenthu='&nbsp;'+ $(this).attr('thu');  // Tên thứ
			var ngayofthu='&nbsp;'+ $(this).attr('ngay');  // Ngày của thứ 
				var itemindata='';
				var itemlanhdao=''; 				
				 $(this).find('nguoi').each(function(){ 					  
				  		// Lấy tên lãnh đạo
						  var tenlanhdao='&nbsp;'+$(this).attr('hoten');	
						// Lấy chức vụ
						 var chucvu='&nbsp;';//+$(this).attr('chucvu'); 
					 
							var itemoflanhdao=0;		
							// Lấy lịch của lãnh đạo 
							 itemindata='';
							 $(this).find('item').each(function(){					 			
						
								// Lấy nội dung tương ứng 		
								var id=	$(this).attr('id');
								var thoigian=$(this).attr('tugio')+'-'+$(this).attr('dengio')+':';
								if(thoigian==':-:')thoigian='';  
								var sukien='&nbsp;'+	SPDecode($(this).attr('sukien'));
								var thanhphan='&nbsp;'+SPDecode($(this).attr('thanhphan'));
								var phuongtien='&nbsp;'+SPDecode($(this).attr('phuongtien'));
								var diadiem='&nbsp;'+SPDecode($(this).attr('diadiem'));	
								var capnhat='&nbsp;'+$(this).attr('capnhat'); 
								 
								if(itemoflanhdao>1)
									{
								 		itemindata=itemindata+'<tr>';
									}
							    // Nội dung công việc
							 	itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px"><b>'+thoigian+'</b>';
							  	itemindata=itemindata+'<a href="javascript:" style="text-decoration:none" onclick="lich.viewCu(this.id,&quot;Đơn vị&quot;)" id="'+id+'">'+sukien+ '</a></td>';
								// Thành phần tham gia
								itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+thanhphan+'</td>';
								// Địa điểm làm việc
								itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+diadiem+'</td>';
								//Phương tiện
								itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+phuongtien+'</td>';
								// Ngày cập nhật
								itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+capnhat+'</td></tr>';	
							
								itemofthu=itemofthu+1;	
								itemoflanhdao=itemoflanhdao+1;		
								 
							});
							if(itemoflanhdao==0)
							{
								itemindata='<td></td><td></td><td></td><td></td><td></td></tr>';			 
								itemoflanhdao=1;
								itemofthu++;
							}
		           			itemlanhdao=itemlanhdao+'<tr>'; 
		           			itemlanhdao=itemlanhdao+itemindata; 
 					});
 					if(itemlanhdao!=''){
					 // Có nội dung làm việc 
		 				alllich=alllich+'<tr>';
			            alllich=alllich+'<td style="padding-left:10px; padding-right:10px" rowspan="'+(itemofthu+1)+'">';
			            alllich=alllich+'<div>'+tenthu+'</div>';
			            alllich=alllich+'<div>'+ngayofthu+'</div>';
			           	alllich=alllich+'</td>';
			        	alllich=alllich+'</tr>';
			        	alllich=alllich+itemlanhdao;
			        	
					}else {      	
					 // Không có nội dung làm việc 
			        	alllich=alllich+'<tr>';
			            alllich=alllich+'<td style="padding-left:10px; padding-right:10px">';
			            alllich=alllich+'<div>'+tenthu+'</div>';
			            alllich=alllich+'<div>'+ngayofthu+'</div>';
			           	alllich=alllich+'</td>';
			          	//alllich=alllich+'<td class="ms-vb type-lanhdao" >&nbsp;</td>';		
			           	alllich=alllich+'<td style="padding-left:10px; padding-right:10px"><span class="type-thoigian">&nbsp; </span><span class="type-noidung"> &nbsp;</span></td>';
						alllich=alllich+'<td >&nbsp; </td>';
						alllich=alllich+'<td >&nbsp; </td>';
						alllich=alllich+'<td >&nbsp; </td>';
					 	alllich=alllich+'<td > &nbsp;</td>';						 
			        	alllich=alllich+'</tr>'; 	
	        		} 
			});
		 
 
	 alllich=alllich+'</table>';
	
	 $("#LichDetails").html(alllich); 

}
	 
function GetLichByHoTen(hoten,ngaybatdau,ngayketthuc,allowEdit,type)	
{
	var listname = 'LayLichCongTacTheoHoTen';  
    var p = new Array();
	p.push(hoten);
	p.push(ngaybatdau);
	p.push(ngayketthuc);			 
	var xml1 = CallWebService(serviceLichUrl,'LayLichCongTacTheoHoTen',p,null,null,false).text();	 
 
	var alllich='<table  border="0" width="100%" cellpadding="0" cellspacing="0" class="lich-cong-tac">';
	  	alllich=alllich+'<tr valign="top" class="ms-vr-title">';
	    alllich=alllich+'<th style="width: 80px">Ngày tháng</th>';
		alllich=alllich+'<th style="width: 35%">Nội dung</th>';	 
		alllich=alllich+'<th style="width: 30%">Thành phần</th>';
		alllich=alllich+'<th >Địa điểm</th>';
		if(allowEdit) alllich=alllich+'<th style="width:20px">Sửa</th><th style="width:20px">Xóa</th>';
		alllich=alllich+'</tr>';
		var curDay=DateVN2EN(GetToDay());
		var xml = StringtoXML(xml1);
		$(xml).find('date').each(function(){ 
			var itemofthu=0;						 
			var tenthu='&nbsp;'+ $(this).attr('thu');  // Tên thứ
			var ngayofthu='&nbsp;'+ $(this).attr('ngay');  // Ngày của thứ 
			var mdate= DateVN2EN($(this).attr('ngay'))
			var edit=false;
			if(mdate>=curDay)edit=true;
			var itemindata='';
			var itemlanhdao=''; 				
			 $(this).find('lanhdao').each(function(){ 
			  		// Lấy tên lãnh đạo
					var tenlanhdao='&nbsp;'+$(this).attr('hoten');	
					// Lấy chức vụ
					var chucvu='&nbsp;';//+$(this).attr('chucvu'); 
					var itemoflanhdao=0;		
					// Lấy lịch của lãnh đạo 
					 itemindata='';
					 $(this).find('item').each(function(){					 			
				
						// Lấy nội dung tương ứng 		
						var id=	$(this).attr('id');
						//var tugio='&nbsp;'+	$(this).attr('tugio');									
						//var dengio='&nbsp;'+	$(this).attr('dengio');	
						var sukien=SPDecode($(this).attr('sukien'))+'&nbsp;';	
						var thoigian=$(this).attr('tugio')+'-'+$(this).attr('dengio')+':';
						if(thoigian==':-:' || thoigian=='-:')thoigian='';
						
						var thanhphan=SPDecode($(this).attr('thanhphan'))+'&nbsp;';
						var diadiem=SPDecode($(this).attr('diadiem'))+'&nbsp;';	
						var capnhat=$(this).attr('capnhat')+'&nbsp;'; 
						 
						if(itemofthu>0)
						{
					 		itemindata=itemindata+'<tr>';
						}
					    // Nội dung công việc
					    itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px"><b>'+thoigian+'&nbsp;</b>';
						itemindata=itemindata+'<a href="javascript:" style="text-decoration:none" onclick="lich.viewCu(this.id,&quot;'+type+'&quot;)" id="'+id+'">'+sukien+ '</a></td>';
						// Thành phần tham gia
						itemindata=itemindata+'<td style="width:35%; padding-left:10px; padding-right:10px">'+thanhphan+'</td>';
						// Địa điểm làm việc
						itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+diadiem+'</td>';
						if(allowEdit)
						{
							var btnedit=edit?'<td style="padding-left:10px; padding-right:10px"><a href="javascript:" style="text-decoration:none" onclick="EditLichCongTac('+id+')" ><img name="Sua_'+id+'" src="/dhtn/Images/btn_edit.png" border="0" title="Sửa lịch công tác" width="16" style="vertical-align:middle;"></a></td><td><a href="javascript:" style="text-decoration:none" name="" onclick="deleteDanhMuc(this)" id="'+id+'" title="'+sukien+'"><img name="Xoa_'+id+'" src="/dhtn/Images/btn_delete.png" border="0" title="Xóa lịch công tác" width="16" style="vertical-align:middle;"></a></td>':'<td></td><td></td>';
							itemindata+=btnedit;
						}
						itemindata+='</tr>';
						// Ngày cập nhật
						//itemindata=itemindata+'<td >'+capnhat+'</td></tr>';							
						itemofthu++;
						itemoflanhdao++;		
					});
				 
	           		//itemlanhdao=itemlanhdao+'</tr>';								 
	           		// Ghép noi dung của lãnh đạo với nôi dung của lịch
	           		itemlanhdao=itemlanhdao+itemindata; 
				});
				 
				if(itemlanhdao!=''){
				 // Có nội dung làm việc 
	 				alllich+='<tr>';
		            alllich+='<td  rowspan="'+(itemofthu)+'"  style="text-align:center;font-weight:500; padding-left:10px; padding-right:10px">';
		            alllich+='<div>'+tenthu+'</div>';
		          	alllich+='<div>'+ngayofthu+'</div>';
		           	alllich+='</td>';
		           	if(itemlanhdao=='<tr>'){
						alllich+='<td >&nbsp;</td>';
						// Thành phần tham gia
						alllich+='<td >&nbsp;</td>';
						// Địa điểm làm việc
						alllich+='<td >&nbsp;</td>';
						itemlanhdao='';
						alllich=alllich+'<td/><td/></tr>';
		           	} 
		        	alllich=alllich+itemlanhdao;
				}else {      
				 // Không có nội dung làm việc 
		        	alllich=alllich+'<tr>';
		            alllich=alllich+'<td  style="text-align:center;font-weight:500; padding-left:10px; padding-right:10px">';
		            alllich=alllich+'<div>'+tenthu+'</div>';
		            alllich=alllich+'<div>'+ngayofthu+'</div>';
		           	alllich=alllich+'</td>'; 
		           	alllich=alllich+'<td > &nbsp;</td>';
		           	if(allowEdit)
		           	{
					alllich=alllich+'<td >&nbsp;</td>';
					alllich=alllich+'<td >&nbsp;</td>'; 
					}
		        	alllich=alllich+'<td/><td/></tr>'; 	
        		} 
		});
	 alllich=alllich+'</table>'; 
	 $("#LichDetails").html(alllich); 
}
function GetLichPhongBan(maphongban,hoten,ngaybatdau,ngayketthuc)	
	{
		var listname = 'LayLichCongTacPhongBan';  
	    var p = new Array();
		p.push(maphongban);
		p.push(ngaybatdau);
		p.push(ngayketthuc);	 
		var xml1 = CallWebService(serviceLichUrl,'LayLichCongTacPhongBan',p,null,null,false).text();			 	
		
		var alllich='<table  border="0" width="100%" cellpadding="0" cellspacing="0" class="lich-cong-tac">';
		  	alllich=alllich+'<tr valign="top" class="ms-vr-title">';
		    alllich=alllich+'<th  style="width: 80px">Ngày tháng</th>';
			alllich=alllich+'<th >Họ tên</th>';
			alllich=alllich+'<th >Nội dung công việc</th>';
			alllich=alllich+'<th >Thành phần tham gia</th>';
			alllich=alllich+'<th >Địa điểm</th>';
			alllich=alllich+'<th  style="width: 72px">TG cập nhật</th>';
			alllich=alllich+'</tr>'; 	
			
	 		var xml = StringtoXML(xml1);
 			$(xml).find('date').each(function(){  			 
					var itemofthu=0;						 
					var tenthu='&nbsp;'+ $(this).attr('thu');  // Tên thứ
					var ngayofthu='&nbsp;'+ $(this).attr('ngay');  // Ngày của thứ
				 	// Lấy nội dung của lãnh đạo 			 
					var itemindata='';
					var itemnhanvien=''; 				
					 $(this).find('lanhdao').each(function(){ 
							var tennhanvien='&nbsp;'+$(this).attr('hoten');							
							var chucvu='&nbsp;';
					 
							if($(this).attr('hoten')==hoten || hoten=='')
							{
								 var itemoflanhdao=0;		
								 itemindata='';
								 $(this).find('item').each(function(){					 										
									var id=	$(this).attr('id');
									if(id != '')
									{
										var thoigian=$(this).attr('tugio')+'-'+$(this).attr('dengio')+':';
		 								if(thoigian==':-:' || thoigian=='-:')thoigian=''; 
										var sukien='&nbsp;'+$(this).attr('sukien');							
										var thanhphan='&nbsp;'+$(this).attr('thanhphan');
										var diadiem='&nbsp;'+$(this).attr('diadiem');	
										var capnhat='&nbsp;'+$(this).attr('capnhat'); 
										 
										if(itemoflanhdao>1)
											{
										 		itemindata=itemindata+'<tr>';
											}
									    // Nội dung công việc
									   itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px"><b>'+thoigian+'</b>';
									   itemindata=itemindata+'<a href="javascript:" style="text-decoration:none" onclick="ShowCalDetail(this.id,&quot;Lịch cá nhân&quot;)" id="'+id+'">'+sukien+ '</a></td>';
										// Thành phần tham gia
										itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+thanhphan+'</td>';
										// Địa điểm làm việc
										itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+diadiem+'</td>';
										// Ngày cập nhật
										itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+capnhat+'</td></tr>';	
									
		
										itemofthu=itemofthu+1;	
										itemoflanhdao=itemoflanhdao+1;		
									 }
								});						 
								 
								/*if(itemoflanhdao==0)
								{
									itemindata='<td></td><td></td><td></td><td></td></tr>';			 
									itemoflanhdao=1;
									itemofthu++;
								} */
								if(itemoflanhdao != 0)
								{
			           				itemnhanvien=itemnhanvien+'<tr>';
									itemnhanvien=itemnhanvien+'<td style="padding-left:10px; padding-right:10px" class="ms-vb type-lanhdao" rowspan="'+itemoflanhdao+'">';
									// Tên lãnh đạo + chức vụ
							      	itemnhanvien=itemnhanvien+chucvu+tennhanvien;						  
															
			           				itemnhanvien=itemnhanvien+'</td>';
			           				// Ghép noi dung của lãnh đạo với nôi dung của lịch
			           				itemnhanvien=itemnhanvien+itemindata; 
		           				}
				           	}				           
	 					});
	 					 
	 					if(itemnhanvien!=''){
						 // Có nội dung làm việc 
			 				alllich=alllich+'<tr>';
				            alllich=alllich+'<td style="padding-left:10px; padding-right:10px"  rowspan="'+(itemofthu+1)+'">';
				            alllich=alllich+'<div>'+tenthu+'</div>';
				            alllich=alllich+'<div>'+ngayofthu+'</div>';
				     	      	alllich=alllich+'</td>';
				        	alllich=alllich+'</tr>';
				        	alllich=alllich+itemnhanvien;
				        	
						}else {      	
						 // Không có nội dung làm việc 
				        	alllich=alllich+'<tr>';
				            alllich=alllich+'<td style="padding-left:10px; padding-right:10px">';
				            alllich=alllich+'<div>'+tenthu+'</div>';
				            alllich=alllich+'<div>'+ngayofthu+'</div>';
				           	alllich=alllich+'</td>';
				           	alllich=alllich+'<td class="ms-vb type-lanhdao" >&nbsp;</td>';		
				           	alllich=alllich+'<td ><span class="type-thoigian">&nbsp; </span><span class="type-noidung"> &nbsp;</span></td>';
							alllich=alllich+'<td >&nbsp; </td>';
							alllich=alllich+'<td >&nbsp; </td>';
							alllich=alllich+'<td > &nbsp;</td>';						 
				        	alllich=alllich+'</tr>'; 	
		        		} 
				});
			 
	
		 alllich=alllich+'</table>';		  
		 $("#LichDetails").html(alllich);  
 
	}
	function GetLichPhongBanTheoID(idphongban,hoten,ngaybatdau,ngayketthuc)	
	{
		var listname = 'LayLichCongTacPhongBan';  
	    var p = new Array();
		p.push(idphongban);
		p.push(ngaybatdau);
		p.push(ngayketthuc);	 
		var xml1 = CallWebService(serviceLichUrl,'LayLichCongTacPhongBanTheoID',p,null,null,false).text();			 	
		
		var alllich='<table  border="0" width="100%" cellpadding="0" cellspacing="0" class="lich-cong-tac">';
		  	alllich=alllich+'<tr valign="top" class="ms-vr-title">';
		    alllich=alllich+'<th  style="width: 80px">Ngày tháng</th>';
			alllich=alllich+'<th >Họ tên</th>';
			alllich=alllich+'<th >Nội dung công việc</th>';
			alllich=alllich+'<th >Thành phần tham gia</th>';
			alllich=alllich+'<th >Địa điểm</th>';
			alllich=alllich+'<th  style="width: 72px">TG cập nhật</th>';
			alllich=alllich+'</tr>'; 	
			
	 		var xml = StringtoXML(xml1);
 			$(xml).find('date').each(function(){  			 
					var itemofthu=0;						 
					var tenthu='&nbsp;'+ $(this).attr('thu');  // Tên thứ
					var ngayofthu='&nbsp;'+ $(this).attr('ngay');  // Ngày của thứ
				 	// Lấy nội dung của lãnh đạo 			 
					var itemindata='';
					var itemnhanvien=''; 				
					 $(this).find('lanhdao').each(function(){ 
					  
					  		// Lấy tên lãnh đạo
							var tennhanvien='&nbsp;'+$(this).attr('hoten');							
							// Lấy chức vụ
							var chucvu='&nbsp;';//+$(this).attr('chucvu');
							 
							// alert(tennhanvien+"--!!--"+('&nbsp;'+hoten);
							
							 
							if($(this).attr('hoten')==hoten || hoten=='')
							{
								// alert( xml +"--!!--"+'&nbsp;'+hoten); 

							 	
								 var itemoflanhdao=0;		
								// Lấy lịch của lãnh đạo 
								 itemindata='';
								 $(this).find('item').each(function(){					 			
							
									// Lấy nội dung tương ứng 		
									var id=	$(this).attr('id');
									//var tugio='&nbsp;'+	$(this).attr('tugio');									
									//var dengio='&nbsp;'+$(this).attr('dengio');	
									if(id != '')
									{
										var thoigian=$(this).attr('tugio')+'-'+$(this).attr('dengio')+':';
		 								if(thoigian==':-:')thoigian=''; 
	
										///
										var sukien='&nbsp;'+$(this).attr('sukien');							
										var thanhphan='&nbsp;'+$(this).attr('thanhphan');
										var diadiem='&nbsp;'+$(this).attr('diadiem');	
										var capnhat='&nbsp;'+$(this).attr('capnhat'); 
										 
										if(itemoflanhdao>1)
										{
									 		itemindata=itemindata+'<tr>';
										}
									    // Nội dung công việc
									   itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px"><b>'+thoigian+'</b>';
									   itemindata=itemindata+'<a href="javascript:" style="text-decoration:none" onclick="lich.viewCu(this.id)" id="'+id+'">'+sukien+ '</a></td>';
										// Thành phần tham gia
										itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+thanhphan+'</td>';
										// Địa điểm làm việc
										itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+diadiem+'</td>';
										// Ngày cập nhật
										itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+capnhat+'</td></tr>';	
									
		
										itemofthu=itemofthu+1;	
										itemoflanhdao=itemoflanhdao+1;
									}		
									 
								});						 
								 
								/*if(itemoflanhdao==0)
								{
									itemindata='<td></td><td></td><td></td><td></td></tr>';			 
									itemoflanhdao=1;
									itemofthu++;
								} */
								if(itemoflanhdao != 0)
								{
			           				itemnhanvien=itemnhanvien+'<tr>';
									itemnhanvien=itemnhanvien+'<td style="padding-left:10px; padding-right:10px" class="type-lanhdao" rowspan="'+itemoflanhdao+'">';
									// Tên lãnh đạo + chức vụ
							      	itemnhanvien=itemnhanvien+chucvu+tennhanvien;						  
															
			           				itemnhanvien=itemnhanvien+'</td>';
			           				// Ghép noi dung của lãnh đạo với nôi dung của lịch
			           				itemnhanvien=itemnhanvien+itemindata; 
			           			}
				           	}				           
	 					});
	 					 
	 					if(itemnhanvien!=''){
						 // Có nội dung làm việc 
			 				alllich=alllich+'<tr>';
				            alllich=alllich+'<td style="padding-left:10px; padding-right:10px"  rowspan="'+(itemofthu+1)+'">';
				            alllich=alllich+'<div>'+tenthu+'</div>';
				            alllich=alllich+'<div>'+ngayofthu+'</div>';
				     	      	alllich=alllich+'</td>';
				        	alllich=alllich+'</tr>';
				        	alllich=alllich+itemnhanvien;
				        	
						}else {      	
						 // Không có nội dung làm việc 
				        	alllich=alllich+'<tr>';
				            alllich=alllich+'<td style="padding-left:10px; padding-right:10px">';
				            alllich=alllich+'<div>'+tenthu+'</div>';
				            alllich=alllich+'<div>'+ngayofthu+'</div>';
				           	alllich=alllich+'</td>';
				           	alllich=alllich+'<td class="ms-vb type-lanhdao" >&nbsp;</td>';		
				           	alllich=alllich+'<td ><span class="type-thoigian">&nbsp; </span><span class="type-noidung"> &nbsp;</span></td>';
							alllich=alllich+'<td >&nbsp; </td>';
							alllich=alllich+'<td >&nbsp; </td>';
							alllich=alllich+'<td > &nbsp;</td>';						 
				        	alllich=alllich+'</tr>'; 	
		        		} 
				});
			 
	
		 alllich=alllich+'</table>';		  
		 $("#LichDetails").html(alllich); 
 
	}

 function InitDanhSachLanhDaoDonVi(){

 			var type='Lãnh đạo cơ quan'; 
 			var donvi = capdonvi;
 			if(donvi == 'VanBanBo')
 				donvi = 'VP';
 			InitDanhSachLanhDao(type,donvi); 

 }
function GetLichLDDV(maphongban,hoten,ngaybatdau,ngayketthuc)	
	{
		if(('a'+maphongban+'a')=='aa') maphongban=capdonvi;
	    var p = new Array();
		p.push(maphongban);
		p.push(ngaybatdau);
		p.push(ngayketthuc);	 
		var xml1 = CallWebService(serviceLichUrl,'LayLichCongTacLanhDaoTheoDonVi',p).text();			 	
		
		var alllich='<table  border="0" width="100%" cellpadding="0" cellspacing="0" class="lich-cong-tac">';
		  	alllich=alllich+'<tr valign="top" class="ms-vr-title">';
		    alllich=alllich+'<th  style="width: 80px">Ngày tháng</th>';
			alllich=alllich+'<th >Họ tên</th>';
			alllich=alllich+'<th >Nội dung công việc</th>';
			alllich=alllich+'<th >Thành phần tham gia</th>';
			alllich=alllich+'<th >Địa điểm</th>';
			alllich=alllich+'<th  style="width: 72px">TG cập nhật</th>';
			alllich=alllich+'</tr>'; 	
			
	 		var xml = StringtoXML(xml1);
 			$(xml).find('date').each(function(){  			 
					var itemofthu=0;						 
					var tenthu='&nbsp;'+ $(this).attr('thu');  // Tên thứ
					var ngayofthu='&nbsp;'+ $(this).attr('ngay');  // Ngày của thứ
				 	// Lấy nội dung của lãnh đạo 			 
					var itemindata='';
					var itemnhanvien=''; 				
					 $(this).find('lanhdao').each(function(){ 
					  
					  		// Lấy tên lãnh đạo
							var tennhanvien='&nbsp;'+$(this).attr('hoten');							
							// Lấy chức vụ
							var chucvu='&nbsp;';//+$(this).attr('chucvu');
							 
							// alert(tennhanvien+"--!!--"+('&nbsp;'+hoten);
							
							 
							if($(this).attr('hoten')==hoten || hoten=='')
							{
								// alert( xml +"--!!--"+'&nbsp;'+hoten); 

							 	
								 var itemoflanhdao=0;		
								// Lấy lịch của lãnh đạo 
								 itemindata='';
								 $(this).find('item').each(function(){					 			
							
									// Lấy nội dung tương ứng 		
									var id=	$(this).attr('id');
									if(id != "")
									{	
										var thoigian=$(this).attr('tugio')+'-'+$(this).attr('dengio')+':';
	 									if(thoigian==':-:')thoigian=''; 
	
										///
										var sukien='&nbsp;'+$(this).attr('sukien');							
										var thanhphan='&nbsp;'+$(this).attr('thanhphan');
										var diadiem='&nbsp;'+$(this).attr('diadiem');	
										var capnhat='&nbsp;'+$(this).attr('capnhat'); 
										 
										if(itemoflanhdao>1)
											{
										 		itemindata=itemindata+'<tr>';
											}
								    	// Nội dung công việc
								   		itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px"><b>'+thoigian+'</b>';
								   		itemindata=itemindata+'<a href="javascript:" style="text-decoration:none" onclick="ShowCalDetail(this.id,&quot;Lịch lãnh đạo đơn vị&quot;)" id="'+id+'">'+sukien+ '</a></td>';
										// Thành phần tham gia
										itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+thanhphan+'</td>';
										// Địa điểm làm việc
										itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+diadiem+'</td>';
										// Ngày cập nhật
										itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+capnhat+'</td></tr>';	
	
										itemofthu=itemofthu+1;	
										itemoflanhdao=itemoflanhdao+1;
									}											
								});						 
								 
								if(itemoflanhdao==0)
								{
									itemindata='<td></td><td></td><td></td><td></td></tr>';			 
									itemoflanhdao=1;
									itemofthu++;
								} 
		           				itemnhanvien=itemnhanvien+'<tr>';
								itemnhanvien=itemnhanvien+'<td style="padding-left:10px; padding-right:10px" class="ms-vb type-lanhdao" rowspan="'+itemoflanhdao+'">';
								// Tên lãnh đạo + chức vụ
						      	itemnhanvien=itemnhanvien+chucvu+tennhanvien;						  
														
		           				itemnhanvien=itemnhanvien+'</td>';
		           				// Ghép noi dung của lãnh đạo với nôi dung của lịch
		           				itemnhanvien=itemnhanvien+itemindata; 
				           		}				           
	 					});
	 					 
	 					if(itemnhanvien!=''){
						 // Có nội dung làm việc 
			 				alllich=alllich+'<tr>';
				            alllich=alllich+'<td style="padding-left:10px; padding-right:10px"  rowspan="'+(itemofthu+1)+'">';
				            alllich=alllich+'<div>'+tenthu+'</div>';
				            alllich=alllich+'<div>'+ngayofthu+'</div>';
				     	      	alllich=alllich+'</td>';
				        	alllich=alllich+'</tr>';
				        	alllich=alllich+itemnhanvien;
				        	
						}else {      	
						 // Không có nội dung làm việc 
				        	alllich=alllich+'<tr>';
				            alllich=alllich+'<td style="padding-left:10px; padding-right:10px">';
				            alllich=alllich+'<div>'+tenthu+'</div>';
				            alllich=alllich+'<div>'+ngayofthu+'</div>';
				           	alllich=alllich+'</td>';
				           	alllich=alllich+'<td class="ms-vb type-lanhdao" >&nbsp;</td>';		
				           	alllich=alllich+'<td ><span class="type-thoigian">&nbsp; </span><span class="type-noidung"> &nbsp;</span></td>';
							alllich=alllich+'<td >&nbsp; </td>';
							alllich=alllich+'<td >&nbsp; </td>';
							alllich=alllich+'<td > &nbsp;</td>';						 
				        	alllich=alllich+'</tr>'; 	
		        		} 
				});
			 
	
		 alllich=alllich+'</table>';		  
		 $("#LichDetails").html(alllich); 
 
	}

 function InitDanhSachLanhDaoVanPhong(){
	var type='LANHDAOVANPHONG'; 
	//InitDanhSachLanhDao(type); 
 }

 
 function InitDanhSachLanhDaoBo(){
	var type='Lãnh đạo cơ quan';
	InitDanhSachLanhDao(type,'VanBanBo'); 
 }
 function InitDanhSachLanhDaoBo_Guest(){
	var type='Lãnh đạo cơ quan';
	InitDanhSachLanhDao_Guest(type,'VanBanBo'); 
 }
 function InitDanhSachLanhDao(type,donvi){
	var p = new Array();	 
   	p.push(type);
   	p.push(donvi);	 		 
	var xml1 = CallWebService(serviceLichUrl,'LayDanhSachLanhDao',p,null,null,false).text();
	var xml = StringtoXML(xml1);
	var html='<select id="LanhDao" class="ComboBox" onchange="selectbylanhdao(this)">';
        html+='<option value="">-Chọn lãnh đạo-</option>';


		$(xml).find('item').each(function(){						  
			 html+='<option value="'+$(this).attr('taikhoan')+'">'+$(this).attr('hoten')+'</option>';
		  
		});
		
	 html+='</select>';	 
  	$("#danhsachlanhdao").html(html); 

 }
 function InitDanhSachLanhDao_Guest(type,donvi){
	var p = new Array();	 
   	p.push(type);
   	p.push(donvi);	 		 
	var xml1 = CallWebService(serviceLichUrl,'LayDanhSachLanhDaoGuest',p).text();
	var xml = StringtoXML(xml1);
	var html='<select id="LanhDao" class="ComboBox" onchange="selectbylanhdao(this)">';
        html+='<option value="">-Chọn lãnh đạo-</option>';		
		$(xml).find('item').each(function(){	
			var taikhoan = $(this).attr('taikhoan');
			if(taikhoan !='i:0#.f|hscvmembershipprovider|caoducphat')	  
				html+='<option value="'+taikhoan+'">'+$(this).attr('hoten')+'</option>';		  
		});
		
	 html+='</select>';	 
  	$("#danhsachlanhdao").html(html); 

 }
function GetAllLich(loailich,hoten,ngaybatdau,ngayketthuc,name,allowEdit) 
{ 			 
	var xml1='';	
	var type='';    	
	switch(loailich){
    	case 'Lịch công tác lãnh đạo bộ': 
    		type='Lịch lãnh đạo bộ';
			var listname = 'LayLichCongTacLanhDaoBo';  
		 	var p = new Array();    	
			p.push(ngaybatdau);
			p.push(ngayketthuc);
			xml1 = CallWebService(serviceLichUrl,'LayLichCongTacLanhDaoBoGuest',p,null,null,false).text();
			break;
    	case 'Lịch công tác lãnh đạo văn phòng':	
    		type='Lịch lãnh đạo đơn vị'; 		    		 
		 	var p = new Array();
		 	p.push(ngaybatdau);
			p.push(ngayketthuc);			 
			xml1 = CallWebService(serviceLichUrl,'LayLichCongTacLanhDaoPhongBan',p,null,null,false).text();
			break;
    case 'Lịch công tác lãnh đạo đơn vị':	
    		type='Lịch lãnh đạo đơn vị'; 		    		 
		 	var p = new Array();
		 	p.push(ngaybatdau);
			p.push(ngayketthuc);		
			xml1 = CallWebService(serviceLichUrl,'LayLichCongTacLanhDaoDonVi',p,null,null,false).text();
			break; 	
    	default:
			var listname = 'LayLichCongTacLanhDao';  
		 	var p = new Array();	 
		 	p.push(loailich);	
			p.push(ngaybatdau);
			p.push(ngayketthuc);			 
			xml1 = CallWebService(serviceLichUrl,'LayLichCongTacLanhDao',p,null,null,false).text();
			break; 		    	
	}
 		
var xml = StringtoXML(xml1);  	
var alllich='<table width="100%" cellpadding="0" cellspacing="0" class="lich-cong-tac">';
  	alllich=alllich+'<tr valign="top" class="ms-vr-title">';
    alllich=alllich+'<th  style="width: 80px">Ngày tháng</th>';
	alllich=alllich+'<th >'+name+'</th>';
	alllich=alllich+'<th >Nội dung công việc</th>';
	alllich=alllich+'<th >Đơn vị chủ trì</th>';
	alllich=alllich+'<th >Địa điểm</th>';
	alllich=alllich+'<th  style="width: 72px">TG cập nhật</th>';
	if(allowEdit)
		alllich=alllich+'<th  style="width: 72px">Hiệu chỉnh</th>';
	alllich=alllich+'</tr>';
	$(xml).find('date').each(function(){ 

			var itemofthu=0;						 
			var tenthu='&nbsp;'+ $(this).attr('thu');  // Tên thứ
			var ngayofthu='&nbsp;'+ $(this).attr('ngay');  // Ngày của thứ
		 	// Lấy nội dung của lãnh đạo 			 
			var itemindata='';
			var itemlanhdao=''; 
			 
			 $(this).find('lanhdao').each(function(){ 					  
			  		// Lấy tên lãnh đạo
					var tenlanhdao='&nbsp;'+$(this).attr('hoten');							
					// Lấy chức vụ
					var chucvu='';//$(this).attr('chucvu');	 
					// alert(tenlanhdao+"--!!--"+('&nbsp;'+hoten);	
					var dem=0;						 
					if($(this).attr('hoten')==hoten || hoten==''){							
						var itemoflanhdao=0;		
						// Lấy lịch của lãnh đạo 
						 itemindata='';
						 $(this).find('item').each(function(){ 
							// Lấy nội dung tương ứng 		
							var id=	$(this).attr('id'); 
							var thoigian ='- ';
							if ($(this).attr('tugio') != ':')
							{	
								if ($(this).attr('dengio') != '')						
									thoigian='- '+$(this).attr('tugio')+'-'+$(this).attr('dengio')+':';
								else
									thoigian='- '+$(this).attr('tugio')+':';
 							}
 							thoigian = thoigian.replace('- :',''); 
							
							var sukien='&nbsp;'+ SPDecode($(this).attr('sukien'));							
							var thanhphan='&nbsp;'+ SPDecode($(this).attr('thanhphan'));
							var diadiem='&nbsp;'+SPDecode($(this).attr('diadiem'));	
							var capnhat='&nbsp;'+$(this).attr('capnhat'); 									 
							if(itemoflanhdao>1)
								{
							 		itemindata=itemindata+'<tr>';
								}
						    // Nội dung công việc 
						    itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px"><b>'+thoigian+'</b>';
							itemindata=itemindata+'<a href="javascript:" style="text-decoration:none" onclick="ShowCalDetail(this.id,&quot;'+type+'&quot;)" id="'+id+'">'+sukien+ '</a></td>';
							// Thành phần tham gia
							itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+thanhphan+'</td>';
							// Địa điểm làm việc
							itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+diadiem+'</td>';
							// Ngày cập nhật
							itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+capnhat+'</td>';
							if(allowEdit)
								itemindata+='<td style="padding-left:10px; padding-right:10px"><div><span></span><span></span></div></td>';
							itemindata+='</tr>';
							if(id!='')
								{
									dem++;									 
									itemofthu++;	
									itemoflanhdao++;
								}
							 
						});
						 if(dem>0)
						 {
					 		if(itemindata != '')
					 		{
	           					itemlanhdao=itemlanhdao+'<tr>';
								itemlanhdao=itemlanhdao+'<td rowspan="'+itemoflanhdao+'"  style="font-weight:500; padding-left:10px; padding-right:10px">';
								// Tên lãnh đạo + chức vụ
						      	itemlanhdao=itemlanhdao+chucvu+''+tenlanhdao;					  
													
		           				itemlanhdao=itemlanhdao+'</td>';
	           				// Ghép noi dung của lãnh đạo với nôi dung của lịch
		           				itemlanhdao=itemlanhdao+itemindata; 
	           				}
	           			}
	           		}						 
				});
	 					 
		if(itemlanhdao!=''){
		 // Có nội dung làm việc 
			alllich=alllich+'<tr>';
            alllich=alllich+'<td  rowspan="'+(itemofthu+1)+'"  style="text-align:center;font-weight:500; padding-left:10px; padding-right:10px">';
            alllich=alllich+'<div>'+tenthu+'</div>';
            alllich=alllich+'<div>'+ngayofthu+'</div>';
           	alllich=alllich+'</td>';
        	alllich=alllich+'</tr>';
        	alllich=alllich+itemlanhdao;
        	
		}else {      	
		 // Không có nội dung làm việc 
        	alllich=alllich+'<tr>';
            alllich=alllich+'<td style="text-align:center;center;font-weight:500; padding-left:10px; padding-right:10px" >';
            alllich=alllich+'<div>'+tenthu+'</div>';
            alllich=alllich+'<div>'+ngayofthu+'</div>';
           	alllich=alllich+'</td>';
           	alllich=alllich+'<td >&nbsp;</td>';		
           	alllich=alllich+'<td >&nbsp;</td>';
			alllich=alllich+'<td >&nbsp;</td>';
			alllich=alllich+'<td >&nbsp;</td>';
			alllich=alllich+'<td >&nbsp;</td>';						 
        	alllich=alllich+'</tr>'; 	
		} 
	});
			 
	alllich=alllich+'</table>';
  	$("#LichDetails").html(alllich); 	
 	GetDataPrivew(xml);	 
}
function GetLichLDTheoDonVi(donvi,ngaybatdau,ngayketthuc,name) 
	{ 			 
			var xml1='';		 		    		 
		 	var p = new Array();
		 	p.push(donvi);
		 	p.push(ngaybatdau);
			p.push(ngayketthuc);		
			xml1 = CallWebService('/dhtn/_layouts/HSCVService.asmx','LayLichCongTacLanhDaoTheoDonVi',p).text();
 		
 		var xml = StringtoXML(xml1);  	
		var alllich='<table  border="0" width="100%" cellpadding="0" cellspacing="0" class="lich-cong-tac">';
		  	alllich=alllich+'<tr >';
		    alllich=alllich+'<th  style="width: 80px">Ngày tháng</th>';
			alllich=alllich+'<th style="width: 100px">'+name+'</th>';
			alllich=alllich+'<th >Nội dung công việc</th>';
			alllich=alllich+'<th  >Thành phần tham gia</th>';
			alllich=alllich+'<th >Địa điểm</th>';
			//alllich=alllich+'<th  >TG cập nhật</th>';
			alllich=alllich+'</tr>';
 			$(xml).find('date').each(function(){ 

					var itemofthu=0;						 
					var tenthu='&nbsp;'+ $(this).attr('thu');  // Tên thứ
					var ngayofthu='&nbsp;'+ $(this).attr('ngay');  // Ngày của thứ
				 	// Lấy nội dung của lãnh đạo 			 
					var itemindata='';
					var itemlanhdao=''; 
					 
					 $(this).find('lanhdao').each(function(){ 					  
					  		// Lấy tên lãnh đạo
							var tenlanhdao='&nbsp;'+$(this).attr('hoten');							
							// Lấy chức vụ
							var chucvu='';//$(this).attr('chucvu');	 
							// alert(tenlanhdao+"--!!--"+('&nbsp;'+hoten);	
							var dem=0;						 
							if($(this).attr('hoten')==hoten || hoten==''){							
 								var itemoflanhdao=0;		
								// Lấy lịch của lãnh đạo 
								 itemindata='';
								 $(this).find('item').each(function(){ 
									// Lấy nội dung tương ứng 		
									var id=	$(this).attr('id'); 
									//var tugio='&nbsp;'+	$(this).attr('tugio');									
									//var dengio='&nbsp;'+	$(this).attr('dengio');										
									var thoigian=$(this).attr('tugio')+'-'+$(this).attr('dengio')+':';
	 								if(thoigian==':-:')thoigian=''; 
									
									var sukien='&nbsp;'+	$(this).attr('sukien');							
									var thanhphan='&nbsp;'+SPDecode($(this).attr('thanhphan'));
									var diadiem='&nbsp;'+$(this).attr('diadiem');	
									//var capnhat='&nbsp;'+$(this).attr('capnhat'); 									 
									if(itemoflanhdao>1)
										{
									 		itemindata=itemindata+'<tr>';
										}
								    // Nội dung công việc 
								    itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px" ><b>'+thoigian+'</b>';
									itemindata=itemindata+'<a href="javascript:" style="text-decoration:none" onclick="ShowCalDetail(this.id,&quot;Lịch lãnh đạo đơn vị&quot;)" id="'+id+'">'+sukien+ '</a></td>';
									// Thành phần tham gia
									itemindata=itemindata+'<td style="width: 35%; padding-left:10px; padding-right:10px">'+thanhphan+'</td>';
									// Địa điểm làm việc
									itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+diadiem+'</td>';
									// Ngày cập nhật
									//itemindata=itemindata+'<td >'+capnhat+'</td></tr>';
									itemindata=itemindata+'</tr>';							
									if(id!='')
										{
											dem++;									 
											itemofthu++;	
											itemoflanhdao++;
										}
									 
								});
	  							 if(dem>0){
								 		if(itemindata != '')
								 		{
				           					itemlanhdao=itemlanhdao+'<tr>';
											itemlanhdao=itemlanhdao+'<td rowspan="'+itemoflanhdao+'"  style="font-weight:500; padding-left:10px; padding-right:10px">';
											// Tên lãnh đạo + chức vụ
									      	itemlanhdao=itemlanhdao+chucvu+''+tenlanhdao;					  
																
					           				itemlanhdao=itemlanhdao+'</td>';
				           				// Ghép noi dung của lãnh đạo với nôi dung của lịch
					           				itemlanhdao=itemlanhdao+itemindata; 
				           				}
				           			}
				           		}
	 					});
	 					 
	 					if(itemlanhdao!=''){
						 // Có nội dung làm việc 
			 				alllich=alllich+'<tr>';
				            alllich=alllich+'<td  rowspan="'+(itemofthu+1)+'"  style="text-align:center;font-weight:500; padding-left:10px; padding-right:10px">';
				            alllich=alllich+'<div>'+tenthu+'</div>';
				            alllich=alllich+'<div>'+ngayofthu+'</div>';
				           	alllich=alllich+'</td>';
				        	alllich=alllich+'</tr>';
				        	alllich=alllich+itemlanhdao;
				        	
						}else {      	
						 // Không có nội dung làm việc 
				        	alllich=alllich+'<tr>';
				            alllich=alllich+'<td style="text-align:center;center;font-weight:500; padding-left:10px; padding-right:10px" >';
				            alllich=alllich+'<div>'+tenthu+'</div>';
				            alllich=alllich+'<div>'+ngayofthu+'</div>';
				           	alllich=alllich+'</td>';
				           	alllich=alllich+'<td >&nbsp;</td>';		
				           	alllich=alllich+'<td >&nbsp;</td>';
							alllich=alllich+'<td >&nbsp;</td>';
							alllich=alllich+'<td >&nbsp;</td>';
							//alllich=alllich+'<td >&nbsp;</td>';						 
				        	alllich=alllich+'</tr>'; 	
		        		} 
				});
			 
		alllich=alllich+'</table>';
	  	$("#LichDetails").html(alllich); 
	 	GetDataPrivew(xml);
	}
function GetLichLDDonVi(hoten,ngaybatdau,ngayketthuc,name) 
	{ 			 
			var xml1='';		 		    		 
		 	var p = new Array();
		 	p.push(ngaybatdau);
			p.push(ngayketthuc);		
			xml1 = CallWebService('/dhtn/_layouts/HSCVService.asmx','LayLichCongTacLanhDaoDonVi',p).text();
 		
 		var xml = StringtoXML(xml1);  	
		var alllich='<table  border="0" width="100%" cellpadding="0" cellspacing="0" class="lich-cong-tac">';
		  	alllich=alllich+'<tr >';
		    alllich=alllich+'<th  style="width: 80px">Ngày tháng</th>';
			alllich=alllich+'<th style="width: 100px">'+name+'</th>';
			alllich=alllich+'<th >Nội dung công việc</th>';
			alllich=alllich+'<th  >Thành phần tham gia</th>';
			alllich=alllich+'<th >Địa điểm</th>';
			//alllich=alllich+'<th  >TG cập nhật</th>';
			alllich=alllich+'</tr>';
 			$(xml).find('date').each(function(){ 

					var itemofthu=0;						 
					var tenthu='&nbsp;'+ $(this).attr('thu');  // Tên thứ
					var ngayofthu='&nbsp;'+ $(this).attr('ngay');  // Ngày của thứ
				 	// Lấy nội dung của lãnh đạo 			 
					var itemindata='';
					var itemlanhdao=''; 
					 
					 $(this).find('lanhdao').each(function(){ 					  
					  		// Lấy tên lãnh đạo
							var tenlanhdao='&nbsp;'+$(this).attr('hoten');							
							// Lấy chức vụ
							var chucvu='';//$(this).attr('chucvu');	 
							// alert(tenlanhdao+"--!!--"+('&nbsp;'+hoten);	
							var dem=0;						 
							if($(this).attr('hoten')==hoten || hoten==''){							
 								var itemoflanhdao=0;		
								// Lấy lịch của lãnh đạo 
								 itemindata='';
								 $(this).find('item').each(function(){ 
									// Lấy nội dung tương ứng 		
									var id=	$(this).attr('id'); 
									//var tugio='&nbsp;'+	$(this).attr('tugio');									
									//var dengio='&nbsp;'+	$(this).attr('dengio');										
									var thoigian=$(this).attr('tugio')+'-'+$(this).attr('dengio')+':';
	 								if(thoigian==':-:')thoigian=''; 
									
									var sukien='&nbsp;'+	$(this).attr('sukien');							
									var thanhphan='&nbsp;'+SPDecode($(this).attr('thanhphan'));
									var diadiem='&nbsp;'+$(this).attr('diadiem');	
									//var capnhat='&nbsp;'+$(this).attr('capnhat'); 									 
									if(itemoflanhdao>1)
										{
									 		itemindata=itemindata+'<tr>';
										}
								    // Nội dung công việc 
								    itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px" ><b>'+thoigian+'</b>';
									itemindata=itemindata+'<a href="javascript:" style="text-decoration:none" onclick="ShowCalDetail(this.id,&quot;Lịch lãnh đạo đơn vị&quot;)" id="'+id+'">'+sukien+ '</a></td>';
									// Thành phần tham gia
									itemindata=itemindata+'<td style="width: 35%; padding-left:10px; padding-right:10px">'+thanhphan+'</td>';
									// Địa điểm làm việc
									itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+diadiem+'</td>';
									// Ngày cập nhật
									//itemindata=itemindata+'<td >'+capnhat+'</td></tr>';
									itemindata=itemindata+'</tr>';							
									if(id!='')
										{
											dem++;									 
											itemofthu++;	
											itemoflanhdao++;
										}
									 
								});
	  							 if(dem>0){
								 		if(itemindata != '')
								 		{
				           					itemlanhdao=itemlanhdao+'<tr>';
											itemlanhdao=itemlanhdao+'<td rowspan="'+itemoflanhdao+'"  style="font-weight:500; padding-left:10px; padding-right:10px">';
											// Tên lãnh đạo + chức vụ
									      	itemlanhdao=itemlanhdao+chucvu+''+tenlanhdao;					  
																
					           				itemlanhdao=itemlanhdao+'</td>';
				           				// Ghép noi dung của lãnh đạo với nôi dung của lịch
					           				itemlanhdao=itemlanhdao+itemindata; 
				           				}
				           			}
				           		}
	 					});
	 					 
	 					if(itemlanhdao!=''){
						 // Có nội dung làm việc 
			 				alllich=alllich+'<tr>';
				            alllich=alllich+'<td  rowspan="'+(itemofthu+1)+'"  style="text-align:center;font-weight:500; padding-left:10px; padding-right:10px">';
				            alllich=alllich+'<div>'+tenthu+'</div>';
				            alllich=alllich+'<div>'+ngayofthu+'</div>';
				           	alllich=alllich+'</td>';
				        	alllich=alllich+'</tr>';
				        	alllich=alllich+itemlanhdao;
				        	
						}else {      	
						 // Không có nội dung làm việc 
				        	alllich=alllich+'<tr>';
				            alllich=alllich+'<td style="text-align:center;center;font-weight:500; padding-left:10px; padding-right:10px" >';
				            alllich=alllich+'<div>'+tenthu+'</div>';
				            alllich=alllich+'<div>'+ngayofthu+'</div>';
				           	alllich=alllich+'</td>';
				           	alllich=alllich+'<td >&nbsp;</td>';		
				           	alllich=alllich+'<td >&nbsp;</td>';
							alllich=alllich+'<td >&nbsp;</td>';
							alllich=alllich+'<td >&nbsp;</td>';
							//alllich=alllich+'<td >&nbsp;</td>';						 
				        	alllich=alllich+'</tr>'; 	
		        		} 
				});
			 
		alllich=alllich+'</table>';
	  	$("#LichDetails").html(alllich); 
	 	GetDataPrivew(xml);
	}  

	function  GetDataPrivew(xml){	
	 
			var ndld = new Array();	
			var lich='<table  width="100%" cellpadding="0" cellspacing="0" class="lich-cong-tac">';
		  	var rowsthu='<tr><th>Họ và tên</th>'; 
		  	var rowslanhdao='';
			var	dem=0;
			//alert('ádasd');
 			$(xml).find('date').each(function(){  
 				if($(this).attr('thu').indexOf('Chủ nhật') > -1)
 					rowsthu+='<th  style="text-align:center;vertical-align:top;width: 8%"><div>'+$(this).attr('thu')+'</div><div>'+$(this).attr('ngay')+'</div></th>'; 
 				else
 					rowsthu+='<th  style="text-align:center;vertical-align:top;width: 13%"><div>'+$(this).attr('thu')+'</div><div>'+$(this).attr('ngay')+'</div></th>'; 
	 				$(this).find('lanhdao').each(function(){
	 					//Kiểm tra xem đã tồn tại chưa rùi đưa danh sách lãnh đạo vào mảng 					
	 					var hoten = $(this).attr('hoten');	 					
	 					var tempHoTenLD = trimSpace(encodeXml(hoten));
	 					tempHoTenLD = trimSpace(tempHoTenLD);
	 					var chucvu = $(this).attr('chucvu');
	 					chucvu = trimSpace(chucvu);
	 					if(hoten=="TT Hà Công Tuấn")
	 					{
	 						hoten="TTTT Hà Công Tuấn";
	 						chucvu="Thứ trưởng thường trực";
	 					}
	 					hoten = hoten.replace('BT ','');
	 					hoten = hoten.replace('TTTT ','').replace('TT ','');
	 					hoten = '<span>' + encodeXml(chucvu) + '</span>' + '<br/>' + encodeXml(hoten);
	 					hoten = trimSpace(hoten);
	 					if(dem<1){ 
	 						ndld.push('<tr><td style="text-align:center; padding-left:10px; padding-right:10px"><b>'+hoten+'</b></td>'); 
	 					} 
	 					//vị trí lãnh đạo trong mảng
	 					var index=0;
	 					//giá trị lãnh đạo trong mảng
	 					var valueindex='';
	 					//kiểm tra và gán giá trị mới
	 					var checkLD = false;
	 					for(var i=0;i<ndld.length;i++){
							if(ndld[i].toString().indexOf(hoten)>-1)
							{
								index=i;
								valueindex=ndld[i].toString();
								checkLD = true;
							}	
						} 
						if(!checkLD)
						{
							//ndld.push('<tr><td style="text-align:center; padding-left:10px; padding-right:10px"><b>'+hoten+'</b></td>');
							//valueindex = '<tr><td style="text-align:center; padding-left:10px; padding-right:10px"><b>'+hoten+'</b></td>';
						}
						var itemdata='<td style="padding-left:10px; padding-right:10px;vertical-align:top;">';
						//lấy nội dung của lãnh đạo						
						 $(this).find('item').each(function(){ 									 						
							//Thời gian								
							var thoigian ='- ';
							if ($(this).attr('tugio') != ':')
							{	
								if ($(this).attr('dengio') != '')						
									thoigian='- '+$(this).attr('tugio')+'-'+$(this).attr('dengio')+':';
								else
									thoigian='- '+$(this).attr('tugio')+':';
 							}
 							thoigian = thoigian.replace(':-::','');
							thoigian = thoigian.replace('-::',':');
							thoigian = thoigian.replace(':-','');
							thoigian = thoigian.replace('::',':');
							thoigian = thoigian.replace('- :','');
							// Nội dung công việc 
							itemdata+='<div><b>'+encodeXml(thoigian)+'</b>';
							var thanhphan = '';
							//if($(this).attr('thanhphan') != '') thanhphan = '<p>Thành phần/Chủ trì: <a href="javascript:" style="text-decoration:none" onclick="ShowCalDetail(this.id)" id="'+$(this).attr('id')+'">'+encodeXml($(this).attr('thanhphan'))+'</a></p>';
							itemdata+='<a href="javascript:" style="text-decoration:none" onclick="ShowCalDetail(this.id)" id="'+$(this).attr('id')+'">'+encodeXml($(this).attr('sukien'))+ '</a>'+thanhphan+'</div><div style="text-align:center;"></div><br/>';
						});
					 
						itemdata+='</td>';
						//if(valueindex == "") valueindex ="<tr>"
						ndld[index]=valueindex+itemdata; 
												
					}); 
 				 	dem++; 		 
			}); 
			rowsthu+='</tr>';
			 
			for(var i=0;i<ndld.length;i++){
				rowslanhdao+=ndld[i]+'</tr>';
			}
			
			lich+=rowsthu+rowslanhdao+'</table>';
			lich+='<div style="text-align:right;font-weight: bold;"><br/>VĂN PHÒNG BỘ</div>';
			lichprint = lich;			
	}
	
function addOrEditDanhMucLoaiLich()
{
	var id= GetQueryString("id");
	if(id == 'undefined')
	{
		id = '';
	}
		var xmlStr = GetFormValue('tableDanhMuc');
		if(!xmlStr)
		{
			ShowMessages('Nhập thông tin cho các trường bắt buộc!','warning',4000);
			return;
		}
		var p = new Array();
		p.push('Loại lịch công tác');
		p.push(id);
		p.push(Encode(xmlStr));
    	var idvb = CallWebService(urlService, "TaoDanhMucLoaiLich", p,null).text();
    	window.parent.HidePopup('1');
}

function addOrEditDanhMucLanhDao()
{
	var id= GetQueryString("id");
	if(id == 'undefined')
	{
		id = '';
	}
	
	var xmlStr = GetFormValue('tableDanhMuc');
	if(!xmlStr)
	{
		ShowMessages('Nhập thông tin cho các trường bắt buộc!','warning',4000);
		return;
	}
	var p = new Array();
	p.push('Danh sách lãnh đạo');
	p.push(id);
	p.push(Encode(xmlStr));
	var idvb = CallWebService(urlService, "TaoDanhMucLoaiLich", p,null).text();
	window.parent.HidePopup('1');
}

function GetDataAccountField(lstName, fieldName, id)
{
	var p = new Array();
	p.push(lstName);
	p.push(fieldName);
	p.push(id);
	var r = CallWebService(urlService, 'GetDataAccountField', p).text();
	return r;
}
  
        	
function  AddCSS()
{
      var str='<style>';	        	 
      str+='table {border: 1px black solid;border-right: none;border-bottom: none;padding: 0px;margin: 0px;}';	     	
      str+='table tr {border: none;} ';
      str+='table td,table th {border: 1px black solid;border-left: none;border-top: none;padding: 0px;margin: 0px;}';
      //str+='table th,table td {border: 1px black solid;padding: 0px;margin: 0px;}';	        	   
      str+='</style>';	        	 
      return str;
}
function PrintLich(xmlValue,startDate,endDate,type,name) 
{  
      var html = '<div>'+AddCSS()+xmlValue+'</div>';
	  var select = document.getElementById("Tuan");
	  var selectweek =	select.options[select .selectedIndex].text;
	  var thoigian = 'Tuần thứ ' + selectweek + ' Từ ngày ' + startDate + ' đến ' + endDate;
	  thoigian = thoigian.toUpperCase();
	  var exp=new Tandan.Exporter('/dhtn');
	  exp.download('Tandan.QuanLyVanBan.Commands','Tandan.QuanLyVanBan.Commands.InLichCongTac',{html:html,name:name,thoigian:thoigian});
}


/*------------  End  -----------------*/


function ThayDoiTuNgay()
{
	if (DateVN2EN($('#TuNgay').val()) < DateVN2EN($('#NgayHienTai').val()))
	{
		$('#thongbao').text('Ngày đăng ký không được nhỏ hơn ngày hiện tại!');
		SetFFieldValue('TuNgay','');
		return;
	}
	else
	{
		$('#thongbao').text('');
	}

	var tungay = GetFieldValue('TuNgay');
	$('#PhongHop').attr('url','popup/chon-phong-hop.aspx?ngay='+tungay);
}

function KiemTraDenNgay()
{
	if (DateVN2EN($('#DenNgay').val()))
	{
		if (DateVN2EN($('#DenNgay').val()) < DateVN2EN($('#TuNgay').val()))
		{
			$('#thongbao').text('Đến ngày không nhỏ hơn từ ngày !');
		}
		else
		{
			$('#thongbao').text('');
		}
	}
	else
	{
		$('#thongbao').text('');
	}
}

function InitChonPhongHop()
{
	var p = new Array();
	var ngay = GetQueryString('ngay');
	p.push(ngay);
	var r = CallWebService(urlService, 'LayLichDangKyPhongHop', p).text();
	r = r.replace(/&/g," và ");
	var xml = StringtoXML(r);
	var tbody = '';
	$(xml).find('items').each(function(){
		var tenphong = $(this).attr('TenPhong');
		var diadiem = $(this).attr('DiaDiem');
		var socho = $(this).attr('SoChoNgoi');
		
		tbody += '<tr>';
		tbody += '<td><a href="javascript:" onclick="ChonPhongHop(this)" tenphong="'+tenphong+'" diadiem="'+diadiem+'">Chọn</td>';
		tbody += '<td>'+tenphong+'</td>';
		tbody += '<td>'+diadiem+'</td>';
		tbody += '<td>'+socho+'</td>';
		var lichph = '';
		$(this).find('item').each(function(){
			var thoigian = $(this).attr('thoigian');
			var donvi = $(this).attr('donvi').replace('và','&');
			var trangthai = $(this).attr('trangthai');
			if (trangthai == 'Đã duyệt')
				lichph += '<div style="color:red">' + thoigian + ' -- ' + donvi + '</div>';
			else
				lichph += '<div>' + thoigian + ' -- ' + donvi + '</div>';
		})
		tbody += '<td>'+lichph+'</td>';
		tbody += '</tr>';
	})
	$('#tbody').html(tbody);
}

function ChonPhongHop(obj)
{
	var tenphong = $(obj).attr('tenphong');
	var diadiem = $(obj).attr('diadiem');
	var temp = '<value>'+tenphong + ' - ' + diadiem +'</value><text>'+tenphong + ' - ' + diadiem+'</text>';
	window.parent.ReturnValueFromPopup(temp,'');
	
}

function MyChange(){
	$("#ThanhPhanThamDu").val($("#NguoiThamGia").val());	
}

function GetItemDanhDauID()
{
	count = 0;
	var id = new Array();
	$('input[id][type=checkbox]').filter("[checked='true']").each(function(){
		id[count++] = $(this).attr('id');
	});
	return id;
}

function GetLichLDDonVi1(hoten,ngaybatdau,ngayketthuc,name) 
	{ 			 
			var xml1='';		 		    		 
		 	var p = new Array();
		 	p.push(ngaybatdau);
			p.push(ngayketthuc);		
			xml1 = CallWebService('/dhtn/_layouts/HSCVService.asmx','LayLichCongTacLanhDaoDonVi',p).text();
 		
 		var xml = StringtoXML(xml1);  	
		var alllich='<table  border="0" width="100%" cellpadding="0" cellspacing="0" class="lich-cong-tac">';
		  	alllich=alllich+'<tr >';
		    alllich=alllich+'<th  style="width: 80px">Ngày tháng</th>';
			alllich=alllich+'<th style="width: 100px">'+name+'</th>';
			alllich=alllich+'<th >Nội dung công việc</th>';
			alllich=alllich+'<th  >Thành phần tham gia</th>';
			alllich=alllich+'<th >Địa điểm</th>';
			//alllich=alllich+'<th  >TG cập nhật</th>';
			alllich=alllich+'</tr>';
 			$(xml).find('date').each(function(){ 

					var itemofthu=0;						 
					var tenthu='&nbsp;'+ $(this).attr('thu');  // Tên thứ
					var ngayofthu='&nbsp;'+ $(this).attr('ngay');  // Ngày của thứ
				 	// Lấy nội dung của lãnh đạo 			 
					var itemindata='';
					var itemlanhdao=''; 
					 
					 $(this).find('lanhdao').each(function(){ 					  
					  		// Lấy tên lãnh đạo
							var tenlanhdao='&nbsp;'+$(this).attr('hoten');							
							// Lấy chức vụ
							var chucvu='';//$(this).attr('chucvu');	 
							// alert(tenlanhdao+"--!!--"+('&nbsp;'+hoten);	
							var dem=0;						 
							if($(this).attr('hoten')==hoten || hoten==''){							
 								var itemoflanhdao=0;		
								// Lấy lịch của lãnh đạo 
								 itemindata='';
								 $(this).find('item').each(function(){ 
									// Lấy nội dung tương ứng 		
									var id=	$(this).attr('id'); 
									var thoigian ='- ';
									if ($(this).attr('tugio') != ':')
									{	
										if ($(this).attr('dengio') != '')						
											thoigian='- '+$(this).attr('tugio')+'-'+$(this).attr('dengio')+':';
										else
											thoigian='- '+$(this).attr('tugio')+':';
		 							}
		 							thoigian = thoigian.replace('- :','');									
									var sukien='&nbsp;'+	SPDecode($(this).attr('sukien'));							
									var thanhphan='&nbsp;'+SPDecode($(this).attr('thanhphan'));
									var diadiem='&nbsp;'+SPDecode($(this).attr('diadiem'));	
									//var capnhat='&nbsp;'+$(this).attr('capnhat'); 									 
									if(itemoflanhdao>1)
										{
									 		itemindata=itemindata+'<tr>';
										}
								    // Nội dung công việc 
								    itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px" ><b>'+thoigian+'</b>';
									itemindata=itemindata+'<a href="javascript:" style="text-decoration:none" onclick="ShowCalDetail(this.id,&quot;Lịch lãnh đạo đơn vị&quot;)" id="'+id+'">'+sukien+ '</a></td>';
									// Thành phần tham gia
									itemindata=itemindata+'<td style="width: 35%; padding-left:10px; padding-right:10px">'+thanhphan+'</td>';
									// Địa điểm làm việc
									itemindata=itemindata+'<td style="padding-left:10px; padding-right:10px">'+diadiem+'</td>';
									// Ngày cập nhật
									//itemindata=itemindata+'<td >'+capnhat+'</td></tr>';
									itemindata=itemindata+'</tr>';							
									if(id!='')
										{
											dem++;									 
											itemofthu++;	
											itemoflanhdao++;
										}
									 
								});
	  							 if(dem>0){
								 		if(itemindata != '')
								 		{
				           					itemlanhdao=itemlanhdao+'<tr>';
											itemlanhdao=itemlanhdao+'<td rowspan="'+itemoflanhdao+'"  style="font-weight:500; padding-left:10px; padding-right:10px">';
											// Tên lãnh đạo + chức vụ
									      	itemlanhdao=itemlanhdao+chucvu+''+tenlanhdao;					  
																
					           				itemlanhdao=itemlanhdao+'</td>';
				           				// Ghép noi dung của lãnh đạo với nôi dung của lịch
					           				itemlanhdao=itemlanhdao+itemindata; 
				           				}
				           			}
				           		}
	 					});
	 					 
	 					if(itemlanhdao!=''){
						 // Có nội dung làm việc 
			 				alllich=alllich+'<tr>';
				            alllich=alllich+'<td  rowspan="'+(itemofthu+1)+'"  style="text-align:center;font-weight:500; padding-left:10px; padding-right:10px">';
				            alllich=alllich+'<div>'+tenthu+'</div>';
				            alllich=alllich+'<div>'+ngayofthu+'</div>';
				           	alllich=alllich+'</td>';
				        	alllich=alllich+'</tr>';
				        	alllich=alllich+itemlanhdao;
				        	
						}else {      	
						 // Không có nội dung làm việc 
				        	alllich=alllich+'<tr>';
				            alllich=alllich+'<td style="text-align:center;center;font-weight:500; padding-left:10px; padding-right:10px" >';
				            alllich=alllich+'<div>'+tenthu+'</div>';
				            alllich=alllich+'<div>'+ngayofthu+'</div>';
				           	alllich=alllich+'</td>';
				           	alllich=alllich+'<td >&nbsp;</td>';		
				           	alllich=alllich+'<td >&nbsp;</td>';
							alllich=alllich+'<td >&nbsp;</td>';
							alllich=alllich+'<td >&nbsp;</td>';
							//alllich=alllich+'<td >&nbsp;</td>';						 
				        	alllich=alllich+'</tr>'; 	
		        		} 
				});
			 
		alllich=alllich+'</table>';
	  	$("#LichPrintDetails").html(alllich);
	}
var lich = lich || {};
lich.addLichCaNhan = function (date) {
    var params = {
        title: "Lập lịch cá nhân",
        url: "/dhtn/Pages/lich-cong-tac/popup/lap-lich-ca-nhan.aspx?view=new",
        width: 800,
        height: 500,
        callback: function (result, returnvalue) {
            if (result === SP.UI.DialogResult.OK) {
                //calendar.doCommand('', "assembly=Tandan.QuanLyVanBan.Commands,type=Tandan.QuanLyVanBan.Commands.LapLich,param=type:canhan|data:" + encode(returnvalue));
                var p = new Array();
				p.push('canhan');
				p.push(encode(returnvalue));			 
				var res = CallWebService(serviceLichUrl,'DangKyLich',p,null,null,false).text();
				if(res==""||res==null) $.jGrowl("Thực hiện thành công");
				//location.reload();
				selectweek($('#Tuan').val());
           }
        },
        obj: null,
        maximized: false
    };
    ShowPopup(params);
};
lich.editLichCaNhan=function(id){
	var params = {
        title: "Sửa lịch",
        url: "/dhtn/Pages/lich-cong-tac/popup/lap-lich-ca-nhan.aspx?view=edit&uid="+id,
        width: 850,
        height: 650,
        callback: function (result, returnvalue) {
            if (result === SP.UI.DialogResult.OK) {
                //calendar.doCommand('', "assembly=Tandan.QuanLyVanBan.Commands,type=Tandan.QuanLyVanBan.Commands.LapLich,callback=ldvCallBack,param=type:canhan|data:" + encode(returnvalue));
                var p = new Array();
				p.push('canhan');
				p.push(encode(returnvalue));			 
				var res = CallWebService(serviceLichUrl,'DangKyLich',p,null,null,false).text();
				if(res==""||res==null) $.jGrowl("Thực hiện thành công");
            }
        },
        obj: null,
        maximized: true
    };
    ShowPopup(params);
}
lich.editLich=function(loai, ids){
	var type="";
	var url="";
	var title="Sửa lịch";
	if(loai == "Lịch cá nhân")
	{
		type="edit";
		url="/dhtn/Pages/lich-cong-tac/popup/lap-lich-ca-nhan.aspx?view=edit&uid="+ids;
		title="Sửa lịch";
	}
	else if(loai == "Lịch cho người khác")
	{
		type="edit";
		url="/dhtn/Pages/lich-cong-tac/popup/lap-lich-nguoi-khac.aspx?view=edit&uid="+ids;
		title="Sửa lịch";
	}
	else if(loai == "Lịch lãnh đạo bộ")
	{
		type="edit";
		url="/dhtn/Pages/lich-cong-tac/popup/lap-lich-ld-don-vi.aspx?view=edit&uid="+ids;
		title="Sửa lịch";
	}
	else if(loai == "Đơn vị")
	{
		type="edit";
		url="/dhtn/Pages/lich-cong-tac/popup/lap-lich-don-vi.aspx?view=edit&uid="+ids;
		title="Sửa lịch";
	}
	
    var params = {
        title: title,
        url: url,
        width: 800,
        height: 600,
        callback: function (result, returnvalue) {
            if (result === SP.UI.DialogResult.OK) {
                gridview.doCommand('', "assembly=Tandan.QuanLyVanBan.Commands,type=Tandan.QuanLyVanBan.Commands.LapLich,callback=ldvCallBack,param=type:"+type+"|data:" + encode(returnvalue));
                setTimeout(function(){
				  gridview.refresh();
				}, 2000);
            }
        },
        obj: null,
        maximized: false
    };
    ShowPopup(params);
}

lich.addLichChoNguoiKhac = function (date) {
    var params = {
        title: "Lập lịch cho người khác",
        url: "/dhtn/Pages/lich-cong-tac/popup/lap-lich-nguoi-khac.aspx?view=new",
        width: 800,
        height: 500,
        callback: function (result, returnvalue) {
            if (result === SP.UI.DialogResult.OK) {
                gridview.doCommand('', "assembly=Tandan.QuanLyVanBan.Commands,type=Tandan.QuanLyVanBan.Commands.LapLich,param=type:chonguoikhac|data:" + encode(returnvalue));
                //history.go(0);
                setTimeout(function(){
				  gridview.refresh();
				}, 2000);                
            }
        },
        obj: null,
        maximized: false
    };
    ShowPopup(params);
};
lich.addLichLanhDaoBo = function (date) {
    var params = {
        title: "Lập lịch cho lãnh đạo bộ",
        url: "/dhtn/Pages/lich-cong-tac/popup/lap-lich-ld-don-vi.aspx?view=new",
        width: 800,
        height: 500,
        callback: function (result, returnvalue) {
            if (result === SP.UI.DialogResult.OK) {
                //gridview.doCommand('', "assembly=Tandan.QuanLyVanBan.Commands,type=Tandan.QuanLyVanBan.Commands.LapLich,param=type:lanhdaobo|data:" + encode(returnvalue));
                var p = new Array();
				p.push('lanhdaobo');
				p.push(encode(returnvalue));			 
				var res = CallWebService(serviceLichUrl,'DangKyLich',p,null,null,false).text();
				if(res==""||res==null) $.jGrowl("Thực hiện thành công");
				location.reload();
            }
        },
        obj: null,
        maximized: false
    };
    ShowPopup(params);
};

lich.addLichLanhDaoBo = function (date) {
    var params = {
        title: "Lập lịch cho lãnh đạo bộ",
        url: "/dhtn/Pages/lich-cong-tac/popup/lap-lich-ld-don-vi.aspx?view=new",
        width: 800,
        height: 500,
        callback: function (result, returnvalue) {
            if (result === SP.UI.DialogResult.OK) {
                //gridview.doCommand('', "assembly=Tandan.QuanLyVanBan.Commands,type=Tandan.QuanLyVanBan.Commands.LapLich,param=type:lanhdaobo|data:" + encode(returnvalue));
                var p = new Array();
				p.push('lanhdaobo');
				p.push(encode(returnvalue));			 
				var res = CallWebService(serviceLichUrl,'DangKyLich',p,null,null,false).text();
				if(res==""||res==null) $.jGrowl("Thực hiện thành công");
				location.reload();
            }
        },
        obj: null,
        maximized: false
    };
    ShowPopup(params);
};


lich.addLichDonVi = function (date) {
    var params = {
        title: "Lập lịch đơn vị",
        url: "/dhtn/Pages/lich-cong-tac/popup/lap-lich-don-vi.aspx?view=new",
        width: 800,
        height: 500,
        callback: function (result, returnvalue) {
            if (result === SP.UI.DialogResult.OK) {
                //gridview.doCommand('', "assembly=Tandan.QuanLyVanBan.Commands,type=Tandan.QuanLyVanBan.Commands.LapLich,callback=ldvCallBack,param=type:donvi|data:" + encode(returnvalue));
                var p = new Array();
				p.push('donvi');
				p.push(encode(returnvalue));			 
				var res = CallWebService(serviceLichUrl,'DangKyLich',p,null,null,false).text();
				if(res==""||res==null) $.jGrowl("Thực hiện thành công");
				location.reload(); 
            }
        },
        obj: null,
        maximized: false
    };
    ShowPopup(params);
};
function ldvCallBack(res){
if(res.Status=="Success")$.jGrowl("Thành công");
else $.jGrowl("Có lỗi xảy ra. Vui lòng thử lại sau.");
}
lich.editLichDonVi=function(id){
	var params = {
        title: "Lập lịch đơn vị",
        url: "/dhtn/Pages/lich-cong-tac/popup/lap-lich-don-vi.aspx?view=edit&uid="+id,
        width: 850,
        height: 650,
        callback: function (result, returnvalue) {
            if (result === SP.UI.DialogResult.OK) {
                //calendar.doCommand('', "assembly=Tandan.QuanLyVanBan.Commands,type=Tandan.QuanLyVanBan.Commands.LapLich,param=type:donvi|data:" + encode(returnvalue));
                var p = new Array();
				p.push('donvi');
				p.push(encode(returnvalue));			 
				var res = CallWebService(serviceLichUrl,'DangKyLich',p,null,null,false).text();
				if(res==""||res==null) $.jGrowl("Thực hiện thành công");
				location.reload();
            }
        },
        obj: null,
        maximized: true
    };
    ShowPopup(params);
}
lich.addDuThao=function(){
	var params = {
        title: "Lập lịch đơn vị",
        url: "/dhtn/Pages/lich-cong-tac/popup/du-thao-lich-don-vi.aspx?view=new",
        width: 850,
        height: 650,
        callback: function (result, returnvalue) {
            if (result === SP.UI.DialogResult.OK) {
                //calendar.doCommand('', "assembly=Tandan.QuanLyVanBan.Commands,type=Tandan.QuanLyVanBan.Commands.LapLich,callback=ldvCallBack,param=type:donvi|data:" + encode(returnvalue));
                var p = new Array();
				p.push('donvi');
				p.push(encode(returnvalue));			 
				var res = CallWebService(serviceLichUrl,'DangKyLich',p,null,null,false).text();
				if(res==""||res==null) $.jGrowl("Thực hiện thành công");
				location.reload();
            }
        },
        obj: null,
        maximized: true
    };
    ShowPopup(params);
}
lich.editDuThao=function(id){
	var params = {
        title: "Lập lịch đơn vị",
        url: "/dhtn/Pages/lich-cong-tac/popup/du-thao-lich-don-vi.aspx?view=edit&uid="+id,
        width: 850,
        height: 650,
        callback: function (result, returnvalue) {
            if (result === SP.UI.DialogResult.OK) {
                //calendar.doCommand('', "assembly=Tandan.QuanLyVanBan.Commands,type=Tandan.QuanLyVanBan.Commands.LapLich,callback=ldvCallBack,param=type:donvi|data:" + encode(returnvalue));
                var p = new Array();
				p.push('donvi');
				p.push(encode(returnvalue));			 
				var res = CallWebService(serviceLichUrl,'DangKyLich',p,null,null,false).text();
				if(res==""||res==null) $.jGrowl("Thực hiện thành công");
				location.reload();
            }
        },
        obj: null,
        maximized: true
    };
    ShowPopup(params);
}
lich.editDuThaoGV=function(id){
	var params = {
        title: "Lập lịch đơn vị",
        url: "/dhtn/Pages/lich-cong-tac/popup/du-thao-lich-don-vi.aspx?view=edit&uid="+id,
        width: 850,
        height: 650,
        callback: function (result, returnvalue) {
            if (result === SP.UI.DialogResult.OK) {
                gridview.getInstance().doCommand("assembly=Tandan.QuanLyVanBan.Commands,type=Tandan.QuanLyVanBan.Commands.LapLich,callback=lich.gvCallBack,param=type:donvi|data:" + encode(returnvalue));
            }
        },
        obj: null,
        maximized: true
    };
    ShowPopup(params);
}
lich.duyetDuThao=function(id){
	var data='<Data><ID value="'+id+'"></ID><TrangThai value=""></TrangThai></Data>';
	gridview.getInstance().importXml(data,"lich.gvApprCallBack");
}
lich.duyet = function (ids, gridID) {
    var sids = '';
    if (Array.isArray(ids)) {
        for (var i = 0; i < ids.length; i++) {if(i>0)sids+=","; sids += ids[i]; }
    }
    else sids = ids;
    var grid = gridview.getInstance(gridID);
    var cmd = "assembly=Tandan.QuanLyVanBan.Commands,type=Tandan.QuanLyVanBan.Commands.DuyetLich,callback=lich.duyet_callback,param=action:duyet|id:" + encode(sids);
    grid.doCommand(cmd);
};
lich.chuyen = function (ids, user, userName, gridID) {
    var sids = '';
    if (Array.isArray(ids)) {
        for (var i = 0; i < ids.length; i++) { if (i >= 0) sids += ","; sids += ids[i]; }
    }
    else sids = ids;
    var grid = gridview.getInstance(gridID);
    var cmd = "assembly=Tandan.QuanLyVanBan.Commands,type=Tandan.QuanLyVanBan.Commands.DuyetLich,callback=lich.chuyen_callback,param=action:chuyen|id:" + encode(sids) + "|user:" + encode(user) + "|username:" + encode(userName);
    grid.doCommand(cmd);
};
lich.huy = function (ids, gridID) {
    var sids = '';
    if (Array.isArray(ids)) {
        for (var i = 0; i < ids.length; i++) { if (i >= 0) sids += ","; sids += ids[i]; }
    }
    else sids = ids;
    var grid = gridview.getInstance(gridID);
    var cmd = "assembly=Tandan.QuanLyVanBan.Commands,type=Tandan.QuanLyVanBan.Commands.DuyetLich,callback=lich.huy_callback,param=action:huy|id:" + encode(sids);
    grid.doCommand(cmd);
};
lich.viewDuyet=function(td){
	var id=td.closest('tr').find('.check-cell').find('input').attr('id');
	var type = td.closest('tr').find('.type').find('span:eq(0)').text();
	var url = '';
	var title='';
	if(type=='Lịch cá nhân')
	{
		url='/dhtn/Pages/lich-cong-tac/popup/view-lich-ca-nhan.aspx?uid=';
		title='Chi tiết lịch cá nhân';
	}
	else if(type=='Lịch lãnh đạo bộ')
	{
		url='/dhtn/Pages/lich-cong-tac/popup/view-lich-lanh-dao.aspx?uid=';
		title='Chi tiết lịch lãnh đạo bộ';
	}	
	else if(type=='Đơn vị')
	{
		url='/dhtn/Pages/lich-cong-tac/popup/view-lich-don-vi.aspx?uid=';
		title='Chi tiết lịch đơn vị';
	}
	else if(type=='Lịch cho người khác')
	{
		url='/dhtn/Pages/lich-cong-tac/popup/view-lich-can-bo-khac.aspx?uid=';
		title='Chi tiết lịch lập cho cán bộ khác';
	}
	else if(type == 'Lịch lãnh đạo đơn vị')
	{
		url= '/dhtn/Pages/lich-cong-tac/popup/view-lich-lanh-dao.aspx?uid=';
		title='Chi tiết lịch lãnh đạo đơn vị';
	}
	else
	{
		url='/dhtn/Pages/lich-cong-tac/popup/view-lich-ca-nhan.aspx?uid=';
		title='Chi tiết lịch cá nhân';
	}
	var params = {
        title: title,
        url: url+id,
        width: 800,
        height: 500,
        callback: function (result, returnvalue) {
            if (result === SP.UI.DialogResult.OK) {
                lich.duyet([id], "");
            }
            else if(result == 'huy')
            {
            	lich.huy([id], "");
            }
        },
        obj: null,
        maximized: false
    };
    ShowPopup(params);
}
lich.view=function(td){
	var id=td.closest('tr').find('.check-cell').find('input').attr('id');
	var type = td.closest('tr').find('.type').find('span:eq(0)').text();
	var url = '';
	var title='';
	if(type=='Lịch cá nhân')
	{
		url='/dhtn/Pages/lich-cong-tac/popup/view-lich-ca-nhan.aspx?uid=';
		title='Chi tiết lịch cá nhân';
	}
	else if(type=='Lịch lãnh đạo bộ')
	{
		url='/dhtn/Pages/lich-cong-tac/popup/view-lich-lanh-dao.aspx?uid=';
		title='Chi tiết lịch lãnh đạo bộ';
	}	
	else if(type=='Đơn vị')
	{
		url='/dhtn/Pages/lich-cong-tac/popup/view-lich-don-vi.aspx?uid=';
		title='Chi tiết lịch đơn vị';
	}
	else if(type=='Lịch cho người khác')
	{
		url='/dhtn/Pages/lich-cong-tac/popup/view-lich-can-bo-khac.aspx?uid=';
		title='Chi tiết lịch lập cho cán bộ khác';
	}
	else if(type == 'Lịch lãnh đạo đơn vị')
	{
		url= '/dhtn/Pages/lich-cong-tac/popup/view-lich-lanh-dao.aspx?uid=';
		title='Chi tiết lịch lãnh đạo đơn vị';
	}
	else
	{
		url='/dhtn/Pages/lich-cong-tac/popup/view-lich-ca-nhan.aspx?uid=';
		title='Chi tiết lịch cá nhân';
	}
	var params = {
        title: title,
        url: url+id,
        width: 800,
        height: 500,
        callback: function (result, returnvalue) {
            if (result === SP.UI.DialogResult.OK) {
                lich.duyet([id], "");
            }
        },
        obj: null,
        maximized: false
    };
    ShowPopup(params);
}
lich.viewCu=function(id,type){
	var title= 'Chi tiết lịch';
	var url ='';
	if(type=='Lịch cá nhân')
	{
		url='/dhtn/Pages/lich-cong-tac/popup/view-lich-ca-nhan.aspx?uid=';
	}
	else if(type=='Lịch lãnh đạo bộ')
	{
		url='/dhtn/Pages/lich-cong-tac/popup/view-lich-lanh-dao.aspx?uid=';
	}	
	else if(type=='Đơn vị')
	{
		url='/dhtn/Pages/lich-cong-tac/popup/view-lich-don-vi.aspx?uid=';
	}
	else if(type=='Lịch cho người khác')
	{
		url='/dhtn/Pages/lich-cong-tac/popup/view-lich-can-bo-khac.aspx?uid=';
	}
	else if(type == 'Lịch lãnh đạo đơn vị')
	{
		url= '/dhtn/Pages/lich-cong-tac/popup/view-lich-lanh-dao.aspx?uid='
	}
	else
	{
		url='/dhtn/Pages/lich-cong-tac/popup/view-lich-ca-nhan.aspx?uid=';
	}
	var params = {
        title: title,
        url: url + id,
        width: 800,
        height: 500,
        callback: function (result, returnvalue) {
            if (result === SP.UI.DialogResult.OK) {
                lich.duyet([id], "");
            }
        },
        obj: null,
        maximized: false
    };
    ShowPopup(params);
}

lich.delGV=function(ids,gvid){
	if(!ids){
		var grid=gridview.getInstance(gvid);
		ids=grid.getSelectedValues();
	}
	danhmuc.deleteItem(gvid,ids,'lich.gvDelCallBack');
}
lich.gvDelCallBack=function (gid,result){
	if(result.status=='Success')$.jGrowl('Đã xóa!');
	else $.jGrowl('Có lỗi xảy ra. Vui lòng thử lại sau!');
}
lich.gvApprCallBack=function (gid,result){
	if(result.status=='Success')$.jGrowl('Đã duyệt!');
	else $.jGrowl('Có lỗi xảy ra. Vui lòng thử lại sau!');
}
lich.gvCallBack=function (gid,result){
	if(result.status=='Success')$.jGrowl('Thành công!');
	else $.jGrowl('Có lỗi xảy ra. Vui lòng thử lại sau!');
}
lich.duyet_callback = function (gid,result) {
    $.jGrowl(result.message);
}
lich.chuyen_callback = function (gid, result) {
    $.jGrowl(result.message);
}
lich.huy_callback = function (gid, result) {
    $.jGrowl(result.message);
}
lich.delLich = function () {
    var ids=gridview.getSelectedValues();
    if(ids.length == 0)
    {
        alert("Chưa chọn lịch!");
        return;
    }
    delDM(ids);
}

function CatChuoi(id)
{
	var text = $('#ctl00_PlaceHolderMain_'+id).find('.controls').find('div:eq(0)').text();
	var reg = RegExp("##","g");
	text = text.replace(reg,'; ');
	$('#ctl00_PlaceHolderMain_'+id).find('.controls').find('div:eq(0)').text(text) 
}

function KiemTraPhongHopKhiLapLichCongTac()
{
	var tungay = $('#TuNgay').attr('value');
	var denngay = $('#DenNgay').attr('value');
	var param = new Array();
	param.push(tungay);
	param.push(denngay);
	var r = CallWebService(serviceLichUrl,'KiemTraDangKyPhongHop',param).text();
	alert(r);
}

function trimSpace(str) {
    return str.replace(/^\s*/, "").replace(/\s*$/, "");
}
