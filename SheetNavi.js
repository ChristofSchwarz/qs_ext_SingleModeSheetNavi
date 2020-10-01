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
			var ownId = layout.qInfo.qId;
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
					+ '<a id="list_' + ownId + '" class="lui-button" style="' + settings.singleMode_aTagLeftStyle + '">'
					+    '<span class="lui-button__caret lui-caret" aria-hidden="true"></span>'
					+ '</a>&nbsp;'
					+ '<a id="prev_' + ownId + '" class="lui-button" title="Previous Sheet" style="' + settings.singleMode_aTagLeftStyle + '">'
					+    '<span class="lui-icon lui-icon--previous lui-button__icon" aria-hidden="true"></span>'
					+ '</a>&nbsp;'
					+ '<a id="next_' + ownId + '" class="lui-button" title="Next Sheet" style="' + settings.singleMode_aTagRightStyle + '">'
					+    '<span class="lui-icon lui-icon--next lui-button__icon" aria-hidden="true"></span>'
					+ '</a>'			
				+ '</div>';
				parent.insertBefore(titleDiv, insertBefore);
				// overwrite Qliks default padding-top of 50px, reduce to 10 px
				document.getElementById('content').style="padding:10px;";
				
				// Prev Button clicked
				document.getElementById('prev_' + ownId).onclick = function(event){
					enigma.evaluate(settings.currSelectionsFormula).then(function(res){
						var selections = '&select=' + encodeURIComponent(res).replace(/%0A/g,'&select=');
						console.log(layout.prevLink + selections);
						//location.href = document.getElementById('prev_' + ownId).attri + selections;
						location.href = layout.prevLink + selections;
					})
				};
				// Next Button clicked
				document.getElementById('next_' + ownId).onclick = function(event){
					enigma.evaluate(settings.currSelectionsFormula).then(function(res){
						var selections = '&select=' + encodeURIComponent(res).replace(/%0A/g,'&select=');
						console.log(layout.nextLink + selections);
						//location.href = document.getElementById('next_' + ownId).attri + selections;
						location.href = layout.nextLink + selections;
					})
				};
				// query enigma with a sessionObject for all a list of sheets
				var qParam = {
					qInfo: {qType: "SheetList"},
					qAppObjectListDef: {
						qType: "sheet",
						qData: { title: "/qMetaDef/title", rank: "/rank" }
					}
				};
				
				enigma.createSessionObject(qParam).then(function(obj){
					return obj.getLayout()
				}).then(function(objLayout){
				
					
					var sheetList = objLayout.qAppObjectList.qItems;
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
					
					document.getElementById('list_' + ownId).onclick = function(event){
						if(document.getElementById('popover_' + ownId)) {
							document.getElementById('popover_' + ownId).remove();
						} else {
							enigma.evaluate(settings.currSelectionsFormula).then(function(res){
								var selections = '&select=' + encodeURIComponent(res).replace(/%0A/g,'&select=');
								//console.log('sel',selections);
								var pop = document.createElement('div');
								pop.id = 'popover_' + ownId;
								pop.setAttribute("class", "lui-popover-container");
								//<div id="lui-popover-2" class="lui-popover-container ng-scope" tabindex="-1" qva-focus="autoFocus" ng-style="style" lui-component="" x-template="template" x-controller="controller" x-input="input" x-close="close" x-variant="variant" x-arrow="arrow" qva-outside="onOutside($event)" qva-outside-ignore-for="nav-sheet" style="position: absolute; top: 44.5px; left: 306px; margin-right: 10px; margin-bottom: 10px;"><div lui-class-list="classList" class="qv-appview-navigator ng-scope lui-popover" ng-style="style" style="width: 749px; height: 751.2px;">
								pop.style = settings.popOver_outerStyle;
								var html = '<div class="qv-appview-navigator lui-popover" style="' + settings.popOver_innerStyle + '">'
								+'<ul style="list-style:none;">';
								for(const [key,value] of Object.entries(sheetTitles)) {
									html += (key == currSheetId ? 
									'<li style="list-style:square;font-weight:bold;">' + value  
									: '<li><a href="' + location.href.replace(currSheetId, key).split('&select=')[0] + selections + '" style="' + settings.popOver_aStyle + '">' + value + '</a>')
									+ '</li>'
								}
								html += '</ul></div>';
								pop.innerHTML = html;
								document.getElementById('main_' + ownId).appendChild(pop);
							})
						}
					}
					
					if (nextSheet[currSheetId]) {
						console.log('next sheet:' + nextSheet[currSheetId]);
						document.getElementById('next_'+ownId).attri = location.href.replace(currSheetId, nextSheet[currSheetId]).split('&select=')[0];
						layout.nextLink = location.href.replace(currSheetId, nextSheet[currSheetId]).split('&select=')[0];
						document.getElementById('next_'+ownId).style.color = settings.button_fontColorActive;
						document.getElementById('next_'+ownId).style["pointer-events"] = "auto";
					} else {
						console.log('no next sheet');
						layout.nextLink = null;
						document.getElementById('next_'+ownId).style.color = settings.button_fontColorInactive;
						document.getElementById('next_'+ownId).style["pointer-events"] = "none";
					}
					if (prevSheet[currSheetId]) {
						console.log('prev sheet:' + prevSheet[currSheetId]);
						document.getElementById('prev_'+ownId).attri = location.href.replace(currSheetId, prevSheet[currSheetId]).split('&select=')[0];
						layout.prevLink = location.href.replace(currSheetId, prevSheet[currSheetId]).split('&select=')[0];
						document.getElementById('prev_'+ownId).style.color = settings.button_fontColorActive;
						document.getElementById('prev_'+ownId).style["pointer-events"] = "auto";
					} else {
						console.log('no prev sheet');
						layout.prevLink = null;
						document.getElementById('prev_'+ownId).style.color = settings.button_fontColorInactive;
						document.getElementById('prev_'+ownId).style["pointer-events"] = "none";
					}						
					
				}).catch(function(err){
					console.error(err);
				});
			}
			return qlik.Promise.resolve();
		}
	};
});
