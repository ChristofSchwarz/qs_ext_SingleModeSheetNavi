define([], function() {
	return {
		currSelectionsFormula: "=GetCurrentSelections(Chr(10),',',',',60)"
		,editMode_mainDivStyle: "display:table; height:99%; background-image:linear-gradient(45deg,#c9f2df 5%,#ffffff 5%,#ffffff 50%,#c9f2df 50%,#c9f2df 55%,#ffffff 55%,#ffffff 100%); background-size:14.14px 14.14px;"
		,editMode_innerSpanStyle: "display:table-cell; vertical-align:middle; text-align:center;"
		
		// Headline div-Container
		,singleMode_mainDivStyle: "width:100%; font-family:QlikView Sans,sans-serif; height:38px;"
		,singleMode_titleStyle: "font-size:20px;"
		,singleMode_innerLeftStyle: "float:left;width:70%;height:100%;margin:5px;"
		,singleMode_innerRightStyle: "float:right;width:24%;height:100%;margin:5px;text-align:right;"
		,singleMode_aTagLeftStyle: "padding: 0px 12px 3px 8px; background-color: #efefef;"
		,singleMode_aTagRightStyle: "padding: 0px 10px 3px 10px; background-color: #efefef;"
		,button_fontColorActive: '#111'
		,button_fontColorInactive: '#bbb'
		,popOver_outerStyle: 'position: absolute; top: 64px; width:400px; height: 300px;right: 36px; margin-right: 10px; margin-bottom: 10px;'
		,popOver_innerStyle: 'padding: 1px 20px;'
		,popOver_aStyle: 'text-decoration:none; color:#222;'
		
	};
});        
