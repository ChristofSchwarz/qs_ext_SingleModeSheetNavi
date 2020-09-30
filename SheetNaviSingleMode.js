define(["qlik", "./settings"],
function (qlik, settings) {
	return {
		support : {
			snapshot: true,
			export: true,
			exportData : false
		},
		//resize: function (){},
		paint: function ($element, layout) {

			//const fontColorActive = '#111';
			//const fontColorInactive = '#bbb';
			var ownId = this.options.id;
			var app = qlik.currApp(this);
			var enigma = app.model.enigmaModel;
			var currSheetId = location.href.split('sheet')[1];
			if (currSheetId.substr(0,1) == '/') currSheetId = currSheetId.substr(1).split('/')[0];
			if (currSheetId.substr(0,1) == '=') currSheetId = currSheetId.substr(1).split('&')[0];
			console.log('curr sheet:' + currSheetId);
			var parent = document.getElementById('single-object');
			var insertBefore = document.getElementById('grid-wrap');
			var titleDiv;
			
			if (location.href.indexOf('state/edit') > -1 && !parent) {
				// Sense Client Edit Mode
				var text1 = 'This extension only has a function in ';
				var text2 = 'Single Mode'
				var text3 = '. It is invisible and without function in the Standard Client.';
				$element.html( '<div style="' + settings.editMode_mainDivStyle + '">'
				+ '<span style="' + settings.editMode_innerSpanStyle + '" title="'+ text1 + text2 + text3 + '">' + text1
				+ '<a href="' + location.href.split('/sheet/'+currSheetId)[0].replace('/sense/app/','/single?appid=')+'&sheet='+currSheetId+'&opt=currsel'
				+ '" target="_blank">' + text2 + '</a>' + text3
				+ '</span></div>');
				$("[tid="+ownId+"]").show();
			} 
			if (location.href.indexOf('state/edit') == -1 && !parent) {
				// Sense Client Analysis Mode
				$element.html("");
				$("[tid="+ownId+"]").hide();
			}
			
			if (parent && !document.getElementById('main_' + ownId)) {
				// Single Mode
				titleDiv = document.createElement('div');
				titleDiv.id = 'main_' + ownId;
				titleDiv.style = settings.singleMode_mainDivStyle;  
				titleDiv.innerHTML = '<div style="' + settings.singleMode_innerLeftStyle + '">'
					+ '<p id="title_' + ownId + '" style="' + settings.singleMode_titleStyle + '"></p>'
				+ '</div>'
				+ '<div style="' + settings.singleMode_innerRightStyle + '">'
					+ '<a id="prev_' + ownId + '" class="lui-button" title="Previous Sheet" style="' + settings.singleMode_aTagLeftStyle + '">'
						+'<span class="lui-icon lui-icon--previous lui-button__icon" aria-hidden="true"></span>'
					+ '</a>&nbsp;'
					+ '<a id="next_' + ownId + '" class="lui-button" title="Next Sheet" style="' + settings.singleMode_aTagRightStyle + '">'
						+'<span class="lui-icon lui-icon--next lui-button__icon" aria-hidden="true"></span>'
					+ '</a>'			
				+ '</div>';
				parent.insertBefore(titleDiv, insertBefore);
				// overwrite Qliks default padding-top of 50px, reduce to 10 px
				document.getElementById('content').style="padding:10px;";
				
				// query enigma with a sessionObject for all a list of sheets
				var qParam = {
					qInfo: {qType: "SheetList"},
					qAppObjectListDef: {
						qType: "sheet",
						qData: { title: "/qMetaDef/title", rank: "/rank" }
					}
				};
				enigma.createSessionObject(qParam).then(function(obj){
					//console.log("SessionObject:", res);
					obj.getLayout().then(function(layout){
						var sheetList = layout.qAppObjectList.qItems
						// sort the responses (sheet list) by the rank
						sheetList.sort(function(a, b) {
						  if (a.qData.rank < b.qData.rank) return -1;
						  if (a.qData.rank > b.qData.rank) return 1;
						  return 0;
						});
						//console.log(sheetList);
						var nextSheet=[], prevSheet=[], sheetTitles=[];
						sheetTitles[sheetList[0].qInfo.qId] = sheetList[0].qData.title;
						for (var i = 1; i < sheetList.length; i++) {
							sheetTitles[sheetList[i].qInfo.qId] = sheetList[i].qData.title;
							prevSheet[sheetList[i].qInfo.qId] = sheetList[i-1].qInfo.qId;
							nextSheet[sheetList[i-1].qInfo.qId] = sheetList[i].qInfo.qId;
						}
						if (parent) document.getElementById('title_'+ownId).innerText = sheetTitles[currSheetId];
						console.log('title:' + sheetTitles[currSheetId]);	
						if (nextSheet[currSheetId]) {
							console.log('next sheet:' + nextSheet[currSheetId]);
							document.getElementById('next_'+ownId).href = location.href.replace(currSheetId, nextSheet[currSheetId]);
							document.getElementById('next_'+ownId).style.color = settings.button_fontColorActive;
							document.getElementById('next_'+ownId).style["pointer-events"] = "auto";
						} else {
							console.log('no next sheet');
							document.getElementById('next_'+ownId).style.color = settings.button_fontColorInactive;
							document.getElementById('next_'+ownId).style["pointer-events"] = "none";
						}
						if (prevSheet[currSheetId]) {
							console.log('prev sheet:' + prevSheet[currSheetId]);
							document.getElementById('prev_'+ownId).href = location.href.replace(currSheetId, prevSheet[currSheetId]);
							document.getElementById('prev_'+ownId).style.color = settings.button_fontColorActive;
							document.getElementById('prev_'+ownId).style["pointer-events"] = "auto";
						} else {
							console.log('no prev sheet');
							document.getElementById('prev_'+ownId).style.color = settings.button_fontColorInactive;
							document.getElementById('prev_'+ownId).style["pointer-events"] = "none";
						}						
					})
				});
			}
			return qlik.Promise.resolve();
		}
	};

} );

