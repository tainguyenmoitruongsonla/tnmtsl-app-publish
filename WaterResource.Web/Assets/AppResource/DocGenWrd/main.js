DocUtils.loadDoc("tagExample.docx")
DocUtils.loadDoc("tagFormating.docx")
DocUtils.loadDoc("tagLooping.docx")
DocUtils.loadDoc("tagIntelligentLoopTable.docx")
DocUtils.loadDoc("MyEvent.docx")

function textAreaAdjust(o) {
    o.style.height = "1px";
    o.style.height = (25+o.scrollHeight)+"px";
}

window.onload=  function () {

var textAreaList= document.getElementsByTagName('textarea');

for (var i = textAreaList.length - 1; i >= 0; i--) {
	textAreaAdjust(textAreaList[i])
	var executeButton=document.createElement('button')
	executeButton.className = "execute";
	executeButton.innerHTML="Execute";
	textAreaList[i].parentNode.insertBefore(executeButton, textAreaList[i].nextSibling);

	var viewRawButton=document.createElement('button')
	viewRawButton.className = "raw";
	viewRawButton.innerHTML="View raw Document";
	textAreaList[i].parentNode.insertBefore(viewRawButton, textAreaList[i].nextSibling);
};

var MyExecuteButton = document.getElementById('btnexport');
MyExecuteButton.onclick = function () {
    //txtArea = document.getElementById('txtJson');
    var docData = docXData["MyEvent.docx"]; //docXData is an array containing all the raw data for these examples
    var doc = new DocxGen(docData); //Create a new DocxGen document

    doc.setTemplateVars(
        {
            "TuanThu": "31", "FromDay": "31/7/2018", "ToDay": "5/8/2018",
            "ChairEvents": [
                {
                    "chairname": "TCT Nguyễn Văn Tỉnh",
                    "WeekEvents":
                        [
                            {
                                "diadiem": "Phòng họp 203 A1",
                                "ngay": "30/7/2018",
                                "eventname": "Họp phòng chống thiên tai",
                                "thanhphan": "Trưởng, phó các đơn vị",
								"EventArrs":
									[
                                        {
                                            "test1": "Noi dung test 1.1"
                                        },
                                        {
                                            "test1": "Noi dung test 1.2"
                                        }
									]
                            },
                            {
                                "diadiem": "Phòng họp 203 A1",
                                "ngay": "31/7/2018",
                                "eventname": "Tiếp khách UNDP",
                                "thanhphan": "Theo giấy mời",
								"EventArrs":
									[
                                        {
                                            "test1": "Noi dung test 2.1"
                                        },
                                        {
										    "test1": "Noi dung test 2.2"
                                        }
									]
                            }
                        ]
                },
                {
                    "chairname": "P.TCT Nguyễn Văn Thành",
                    "WeekEvents":
                        [
                            {
                                "diadiem": "Phòng họp 203 A1",
                                "ngay": "30/7/2018",
                                "eventname": "Họp phòng chống thiên tai",
                                "thanhphan": "Trưởng, phó các đơn vị",
								"EventArrs":
										[
                                        {
                                            "test1": "Noi dung test 3.1"
                                        },
                                        {
                                            "test1": "Noi dung test 3.2"
                                        }
										]
                            },
                            {
                                "diadiem": "Phòng họp 203 A1",
                                "ngay": "31/7/2018",
                                "eventname": "Tiếp khách UNDP",
                                "thanhphan": "Theo giấy mời",
								"EventArrs":
										[
                                        {
                                            "test1": "Noi dung test 4.1"
                                        },
                                        {
                                            "test1": "Noi dung test 4.2"
                                        }
										]
                            }
                        ]
                }
            ]
        }
    ) //set the templateVariables
    doc.applyTemplateVars() //apply them
    doc.output() //Output the document using Data-URI	
    console.log(txtArea.value);
    //eval(txtArea.value);
}


var executeButtonList=document.getElementsByClassName('execute');
for (var i = 0; i < executeButtonList.length; i++) {
        
	executeButtonList[i].onclick=function()
	{
		childs=(this.parentNode.childNodes)

		for (var j = 0; j < childs.length; j++) {
			if(childs[j].tagName=='TEXTAREA')
			{
				console.log(childs[j].value)
				eval(childs[j].value)
			}
		};
	}
};

var viewRawButtonList= document.getElementsByClassName('raw');

for (var i = 0; i < viewRawButtonList.length; i++) {
	viewRawButtonList[i].onclick=function()
	{
		childs=(this.parentNode.childNodes)

		for (var j = 0; j < childs.length; j++) {
			if(childs[j].tagName=='TEXTAREA')
			{
				raw=(childs[j].getAttribute("raw"))
				console.log	(raw)
				var doc=new DocxGen(docXData[raw])
				doc.output()
			}
		};
	}
};
}

