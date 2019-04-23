/**
 * Created by xuhui on 2018/8/29.
 */
var vue = new Vue({
	el: '#app',
	data: {
		map: null,
		venueId: '', //场馆id，为空时查询所有数据
		currentLevel: 'LEVEL_ONE',
		moduleIds: '',
		lineVectorLayerList: [], //防护圈
		currentVectorLayerList: [], //当前防护圈对应的图层数据
		layerData: {},
		currentLayerData: {},
		venueLayerList: [],
		venuePoints: [],
		warningLayer: null,
		warningpoints: {},
		pointLayer: new GL.VectorLayer(),
		populationStatistics: null,
		alarmPerson: null,
		alarmVehicle: null,
		polylines: {}
	},
	watch: {
		currentLevel: function (newl, old) { //一级:LEVEL_ONE, 二级:LEVEL_TWO, 三级:LEVEL_THREE
			// console.log("currentLevel= "+newl);
			if (newl == 'LEVEL_ONE') {
				$(".tag ul").css('display', 'block');
				$('.statistics-analysis').css('display', 'block');
				$('.trend-analysis').css('display', 'none');

				$(".protect-chart:eq(0)").css("background", 'url("assets/map/bg_protect_unnormal.svg") no-repeat');
				$(".protect-chart:eq(1)").css("background", 'url("assets/map/bg_protect_normal.svg") no-repeat');
				$(".protect-chart:eq(2)").css("background", 'url("assets/map/bg_protect_normal.svg") no-repeat');
			} else if (newl == "LEVEL_TWO") {
				$(".tag ul").css('display', 'none');
				$("#rightdown").css('display', 'block');
				$('.statistics-analysis').css('display', 'none');
				$('.trend-analysis').css('display', 'block');

				initlineCharts(this.getCurrentTag(), this.currentLevel, "STATISTICSCYCLE_WEEK");
				//initlineCharts('personTotalNumList',this.currentLevel,"STATISTICSCYCLE_WEEK");

				$(".protect-chart:eq(0)").css("background", 'url("assets/map/bg_protect_normal.svg") no-repeat');
				$(".protect-chart:eq(1)").css("background", 'url("assets/map/bg_protect_unnormal.svg") no-repeat');
				$(".protect-chart:eq(2)").css("background", 'url("assets/map/bg_protect_normal.svg") no-repeat');
			} else if (newl == "LEVEL_THREE") {
				$(".tag ul").css('display', 'block');
				$('.statistics-analysis').css('display', 'none');
				$('.trend-analysis').css('display', 'block');
				//initlineCharts('personTotalNumList',this.currentLevel,"STATISTICSCYCLE_WEEK");
				initlineCharts(this.getCurrentTag(), this.currentLevel, "STATISTICSCYCLE_WEEK");

				$(".protect-chart:eq(0)").css("background", 'url("assets/map/bg_protect_normal.svg") no-repeat');
				$(".protect-chart:eq(1)").css("background", 'url("assets/map/bg_protect_normal.svg") no-repeat');
				$(".protect-chart:eq(2)").css("background", 'url("assets/map/bg_protect_unnormal.svg") no-repeat');
			}
		},
		venueId: function (newv, old) {
			if (newv && newv != '') {
				$('.venuePlan').css('display', 'block');
				$('.venue-total-statistics').css('display', 'none');
			} else {
				$('.venuePlan').css('display', 'none');
				$('.venue-total-statistics').css('display', 'block');
			}
			//调用接口查询数据
		}
	},
	methods: {
		getCurrentTag: function () {
			var currentInterfaceType = $('.trend-sub-active').attr('id');
			if (currentInterfaceType == "trend-person-flow") {
				currentInterfaceType = 'personTotalNumList';
			} else if (currentInterfaceType == "trend-allow-person") {
				currentInterfaceType = 'personCheckNumList';
			} else if (currentInterfaceType == "trend-doubt-person") {
				currentInterfaceType = 'personSusNumList';
			} else if (currentInterfaceType == "trend-car-flow") {
				currentInterfaceType = 'vehicleTotalNumList';
			} else if (currentInterfaceType == "trend-allow-car") {
				currentInterfaceType = 'vehicleCheckNumList';
			} else if (currentInterfaceType == "trend-doubt-car") {
				currentInterfaceType = 'vehicleSusNumList';
			}
			return currentInterfaceType;
		},
		initMarkPoint: function (data) {
			var infoType = data.infoType;
			// if(infoType == 'personAlarm' || infoType == 'vehicleAlarm')
			// console.log(infoType,JSON.stringify(data));
			var pointImg = '';
			if (infoType == 'policePos') {
				pointImg = 'assets/icons/policeman.png';
			} else if (infoType == 'securityPersonPos') {
				pointImg = 'assets/icons/sucurityperson.png';
			} else if (infoType == 'vehiclePos') {
				pointImg = 'assets/icons/policecar.png';
			}
			if (pointImg != '') {
				if (this.pointObj == null) {
					this.pointObj = {};
					map.addLayer(this.pointLayer);
				}
				var points = data.data;
				$.each(points, function (index, item) {
					var uuid = item.uuid;
					if (this.pointObj[uuid] == null) {
						var position = eval(item.positions);
						position = position[0] + ',' + position[1];
						var point = new GL.Point(new GL.LngLat(position), new GL.Icon.Smart(pointImg, [41, 61]));
						if (infoType == 'policePos' || infoType == 'securityPersonPos') {
							point.bindTooltip(item.name);
						} else {
							point.bindTooltip(item.plateNum);
						}
						this.pointObj[uuid] = point;
						this.pointLayer.addOverlay(point);
					} else {
						var point = this.pointObj[uuid];
						var position = eval(item.positions);
						position = position[0] + ',' + position[1];
						var lonlat = new GL.LngLat(position);
						point.setLngLat(lonlat);
						this.pointObj[uuid] = point;
					}
				}.bind(this));
				if (map.getZoom() > 3) {
					this.pointLayer.show();
				} else {
					this.pointLayer.hide();
				}
			}
			if (data.infoType == "alarmNumPush") {
				// console.log("alarmNumPush",data);
				var points = data.data;
				$.each(points, function (index, item) {
					var point = this.warningpoints[item.venueid];
					var alarmnum = item.alarmnum;
					if (point != null) {
						if (alarmnum <= 10) {
							var icon = new GL.Icon.Smart('assets/icons/warning_02.svg', [202, 202]);
							point.setIcon(icon);
							point.bindLabel('<span class="icon-num-min">' + alarmnum + '</span>');
							$('.icon-num-min').parent().addClass('icon-num-label-min');
						} else if (alarmnum > 10 && alarmnum <= 50) {
							var icon = new GL.Icon.Smart('assets/icons/warning_02.svg', [202, 202]);
							point.setIcon(icon);
							point.bindLabel('<span class="icon-num-mid">' + alarmnum + '</span>');
							$('.icon-num-mid').parent().addClass('icon-num-label-mid');
						} else {
							var icon = new GL.Icon.Smart('assets/icons/warning_02.svg', [250, 250]);
							point.setIcon(icon);
							point.bindLabel('<span class="icon-num">' + alarmnum + '</span>');
							$('.icon-num').parent().addClass('icon-num-label');
						}
						/*point.setLabelContent('<span class="icon-num">'+alarmnum+'</span>');
						this.warningpoints[item.venueid] = point;*/
					}
				}.bind(this));
				var zoom = map.getZoom();
				if (zoom > 1) {
					this.warningLayer.hide();
				} else {
					this.warningLayer.show();
				}
			}
			if (data.infoType == "populationStatisticsPush") {
				this.populationStatistics = data.data;
			}
			if (data.infoType == "lineStatusTrack") {
				var uuid = data.data.uuid;
				var status = data.data.status;
				if (status == 'MESS_SECURITYLINE_STATUS:BEFORE') {
					color = "#ff9100";
				} else {
					color = "#ff1800";
				}
				this.polylines[uuid].setStyle(new GL.Style({
					color: color
				}));

				/*var uuid = data.data.uuid;
				if(this.polylines[uuid]){
					var status = data.data.status;
					if(status == 'MESS_SECURITYLINE_STATUS:BEFORE'){
						color = "#ff9100";
					}else{
						color = "#ff1800";
					}
					this.polylines[uuid].setStyle(new GL.Style({ color: color }));
				}else{
					var status = data.data.status;
					var positions = eval(data.data.positions);
					var color = "";
					if(status == 'MESS_SECURITYLINE_STATUS:BEFORE'){
						color = "#ff9100";
					}else{
						color = "#ff1800";
					}
					var pos = [];
					$.each(positions,function (index,position) {
						pos.push(position.join(','))
					})
					var polyline = new GL.Polyline(pos.join(';'), new GL.Style({ color: color }, true));
					polyline.addTo(map);
					this.polylines[uuid] = polyline;
				}*/
			}
			if (data.infoType == "personAlarm") {
				// console.log(infoType,JSON.stringify(data));
				this.alarmPerson = data.data.personAlarmInfo;
			}
			if (data.infoType == "vehicleAlarm") {
				// console.log(infoType,JSON.stringify(data));
				this.alarmVehicle = data.data.vehicleAlarmInfo;
			}

		},
		resetVenueId: function (e) {
			this.venueId = '';
		},
		setVenueCenter: function (selectVenueId) {
			$.each(this.venuePoints, function (index, item) {
				if (item.venueId == selectVenueId) {
					item.bringToFront();
					var center = item.getLngLat();
					map.setView(center, 5);
				}
			});
			if (selectVenueId == '') {
				var center = new GL.LngLat('119.75,32.25');
				map.setView(center, 0);
			}
		},
		onSelectResourceType: function (e) {
			var el = e.currentTarget;
			var parentName = $(el).attr('parent');
			var elName = $(el).attr('value');
			if ($(el).hasClass('resourceNormal')) {
				$(el).removeClass('resourceNormal');
			} else {
				$(el).addClass('resourceNormal');
			}
			$.each(this.layerData[this.moduleIds][parentName], function (index, item) {
				if (elName == index) {
					if ($(el).hasClass('resourceNormal')) {
						item.hide();
					} else {
						item.show();
					}
				}
			});
			$(el).parent().removeClass('resourceOpened');
		},
		onLevelChange: function (lineLevel) {
			//删除地图上的数据
			$.each(this.lineVectorLayerList, function (index, item) {
				item.remove();
			});
			$.each(this.currentVectorLayerList, function (index, item) {
				item.remove();
			});
			if (this.warningLayer) {
				this.warningLayer.remove();
			}
			var center = new GL.LngLat('119.75,32.25');
			map.setView(center, 0);
			this.lineVectorLayerList = [];
			this.currentVectorLayerList = [];
			this.currentLevel = lineLevel;
			this.venueId = '';
			this.getLineList(lineLevel);
			this.getResourceList();
		},
		getLineList: function (lineLevel) {
			var $this = this;
			var titleText = '';
			var fillColor = '';
			var opacity = 1;
			var echart1 = echarts.init(document.getElementById('LEVEL_ONE'));
			var echart2 = echarts.init(document.getElementById('LEVEL_TWO'));
			var echart3 = echarts.init(document.getElementById('LEVEL_THREE'));
			var color = ['#555555', '#666666', '#777777', '#888888', '#444444', '#eeeeee', '#eeeeee', '#eeeeee'];
			echart1.setOption({
				color: color
			});
			echart2.setOption({
				color: color
			});
			echart3.setOption({
				color: color
			});

			if ('LEVEL_ONE' == lineLevel) {
				titleText = 'Inner Protection Circle';
				fillColor = '#241b2a';
				opacity = 1;
			} else if ('LEVEL_TWO' == lineLevel) {
				titleText = 'Mid Protection Circle';
				fillColor = '#242841';
				opacity = 0.6;
			} else if ('LEVEL_THREE' == lineLevel) {
				titleText = 'Outer Protection Circle';
				fillColor = '#253148';
				opacity = 0.5;
			}

			callApi($AllParams.interfaces.getLineList, {
				lineLevel: lineLevel
			}, function (response) {
				if (response.flag && response.result) {
					var lineList = response.result.lineList;
					var resourceList = response.result.resourceList; //防护圈上的图标数据
					//画地图上的线
					$.each(lineList, function (index, item) {
						var positions = item.positions;
						var status = item.status;
						var vectorLayer = new GL.VectorLayer();
						map.addLayer(vectorLayer);
						$this.lineVectorLayerList.push(vectorLayer);
						var lnglats = '';
						$.each(positions, function (i, cell) {
							lnglats += cell[0] + ',' + cell[1] + ';'
						});
						lnglats = lnglats.substring(0, lnglats.length - 1);
						var polygon = new GL.Polygon(lnglats, new GL.Style.Fill({
							fillColor: fillColor,
							color: '#92f2ff',
							opacity: opacity
						}));
						vectorLayer.addOverlay(polygon);
					});

					var seriesData = [];
					$.each(resourceList, function (index, item) {
						var obj = {};
						obj.name = item.resourceTypeValue;
						obj.value = item.resourceNum;
						seriesData.push(obj);
					})
					//画防护圈上的图表
					var color = ['#00ffff', '#f16f09', '#f8ae00', '#7fd30f', '#019e22', '#0095db', '#29abe2', '#2b82e0'];
					var echart = echarts.init(document.getElementById(lineLevel));
					var option = {
						color: color,
						tooltip: {
							trigger: 'item'
							// formatter:'{b} {c}'
						},
						title: {
							text: titleText,
							left: '24%',
							top: '45%',
							textStyle: {
								color: '#ffffff'
							}
						},
						series: {
							type: 'pie',
							radius: ['49%', '58%'],
							label: {
								normal: {
									show: false,
									position: 'center'
								}
							},
							labelLine: {
								normal: {
									show: false
								}
							},
							data: seriesData
						}
					};
					echart.setOption(option);
				}
			})
		},
		initOtherLineList: function () {
			callApi($AllParams.interfaces.getLineList, {
				lineLevel: 'LEVEL_TWO'
			}, function (response) {
				if (response.flag && response.result) {
					var resourceList = response.result.resourceList; //防护圈上的图标数据
					var seriesData = [];
					$.each(resourceList, function (index, item) {
						var obj = {};
						obj.name = item.resourceTypeValue;
						obj.value = item.resourceNum;
						seriesData.push(obj);
					})
					//画防护圈上的图表
					//var color = ['#00ffff','#f16f09','#f8ae00','#7fd30f','#019e22','#0095db','#29abe2','#2b82e0'];
					var color = ['#555555', '#666666', '#777777', '#888888', '#eeeeee', '#eeeeee', '#eeeeee', '#eeeeee'];
					var echart = echarts.init(document.getElementById('LEVEL_TWO'));
					var option = {
						color: color,
						tooltip: {
							trigger: 'item'
						},
						title: {
							text: 'Mid Protection Circle',
							left: '23%',
							top: '45%',
							textStyle: {
								color: '#ffffff'
							}
						},
						series: {
							type: 'pie',
							radius: ['49%', '58%'],
							label: {
								normal: {
									show: false,
									position: 'center'
								}
							},
							labelLine: {
								normal: {
									show: false
								}
							},
							data: seriesData
						}
					};
					echart.setOption(option);
				}
			})
			callApi($AllParams.interfaces.getLineList, {
				lineLevel: 'LEVEL_THREE'
			}, function (response) {
				if (response.flag && response.result) {
					var resourceList = response.result.resourceList; //防护圈上的图标数据
					var seriesData = [];
					$.each(resourceList, function (index, item) {
						var obj = {};
						obj.name = item.resourceTypeValue;
						obj.value = item.resourceNum;
						seriesData.push(obj);
					})
					//画防护圈上的图表
					// var color = ['#00ffff','#f16f09','#f8ae00','#7fd30f','#019e22','#0095db','#29abe2','#2b82e0'];
					var color = ['#333333', '#444444', '#555555', '#666666', '#777777', '#888888', '#666666'];
					var echart = echarts.init(document.getElementById('LEVEL_THREE'));
					var option = {
						color: color,
						tooltip: {
							trigger: 'item'
						},
						title: {
							text: 'Outer Protection Circle',
							left: '23%',
							top: '45%',
							textStyle: {
								color: '#ffffff'
							}
						},
						series: {
							type: 'pie',
							radius: ['49%', '58%'],
							label: {
								normal: {
									show: false,
									position: 'center'
								}
							},
							labelLine: {
								normal: {
									show: false
								}
							},
							data: seriesData
						}
					};
					echart.setOption(option);
				}
			})


		},
		getResourceList: function () { //获取当前防护级别下的地图mark点
			var $this = this;
			// var moduleIds = '';
			if (this.currentLevel == 'LEVEL_ONE') {
				this.moduleIds = 'MESS_MODULETYPE:FIRST_LINE_OF_DEFENSE';
			} else if (this.currentLevel == 'LEVEL_TWO') {
				this.moduleIds = 'MESS_MODULETYPE:SECOND_LINE_OF_DEFENSE';
			} else if (this.currentLevel == 'LEVEL_THREE') {
				this.moduleIds = 'MESS_MODULETYPE:THIRD_LINE_OF_DEFENSE';
			}
			var data = {};
			var params = {};
			params.moduleIds = this.moduleIds;
			callApi($AllParams.interfaces.resourceList, params, function (response) {
				$.each(response.result, function (index, item) {
					var moduleValue = item.moduleValue;
					var parentName = item.parentName;
					var resourceTypeValue = item.resourceTypeValue;
					var resourceList = item.resourceList;
					var iconpath = item.iconPath;

					var moduleId = item.moduleId;
					var parentId = item.parentId;
					var resourceType = item.resourceType;
					if (parentName == undefined) { //场馆venueLayer
						$this.venuePoints = [];
						var vectorLayer = new GL.VectorLayer();
						$this.warningLayer = new GL.VectorLayer();
						map.addLayer($this.warningLayer);
						map.addLayer(vectorLayer);

						$.each(resourceList, function (index, icon) {
							var point = new GL.Point(new GL.LngLat(icon.position), new GL.Icon.Smart('assets/icons/' + iconpath, [40, 61]), {
								"zIndexOffset": 10
							});
							point.venueId = icon.uuid;
							point.on('click', function (e) {
								$this.venueId = icon.uuid;
								$('.venue-popup').css('display', 'block');
							});
							$this.venuePoints.push(point);
							vectorLayer.addOverlay(point);
						});
						$this.venueLayerList.push(vectorLayer);
						callApi($AllParams.interfaces.alarmNum, [], function (data) {
							for (var i = 0; i < data.result.length; i++) {
								var venueid = data.result[i].venueid;
								var alarmnum = parseInt(data.result[i].alarmnum);
								var warningpoint = null;
								if (alarmnum <= 10) {
									//assets/icons/warning_02_min.png
									//warningpoint=new GL.Point(data.result[i].positions,new GL.Icon.Smart('assets/icons/warning_02_mid.png',[177,177]));
									warningpoint = new GL.Point(data.result[i].positions, new GL.Icon.Smart('assets/icons/warning_02.svg', [202, 202]));
									warningpoint.bindLabel('<span class="icon-num-min">' + alarmnum + '</span>');
									$this.warningLayer.addOverlay(warningpoint);
									$('.icon-num-min').parent().addClass('icon-num-label-min');
								} else if (alarmnum > 10 && alarmnum <= 50) {
									warningpoint = new GL.Point(data.result[i].positions, new GL.Icon.Smart('assets/icons/warning_02.svg', [202, 202]));
									warningpoint.bindLabel('<span class="icon-num-mid">' + alarmnum + '</span>');
									$this.warningLayer.addOverlay(warningpoint);
									$('.icon-num-mid').parent().addClass('icon-num-label-mid');
								} else {
									warningpoint = new GL.Point(data.result[i].positions, new GL.Icon.Smart('assets/icons/warning_02.svg', [250, 250]));
									warningpoint.bindLabel('<span class="icon-num">' + data.result[i].alarmnum + '</span>');
									$this.warningLayer.addOverlay(warningpoint);
									$('.icon-num').parent().addClass('icon-num-label');
								}
								$this.warningpoints[venueid] = warningpoint;

								/*var warningpoint=new GL.Point(data.result[i].positions,new GL.Icon.Smart('assets/icons/warning_02.svg',[250,250]));
                                warningpoint.bindLabel('<span class="icon-num">'+data.result[i].alarmnum+'</span>');
                                $('.icon-num').parent().addClass('icon-num-label');
								$this.warningLayer.addOverlay(warningpoint);
								$this.warningpoints[venueid] = warningpoint;*/
							}
							$("img[src='assets/icons/warning_02_mid.png']").parent().css("pointer-events", "none");
							$("img[src='assets/icons/warning_02.svg']").parent().css("pointer-events", "none");
							$("img[src='assets/icons/warning_01.svg']").parent().css("pointer-events", "none");
						})
					} else {
						if (data[moduleId] == undefined) {
							data[moduleId] = {};
							if (data[moduleId][parentName] == undefined) {
								data[moduleId][parentName] = {};
								if (data[moduleId][parentName][resourceTypeValue] == undefined) {
									var vectorLayer = new GL.VectorLayer();
									map.addLayer(vectorLayer);
									$.each(resourceList, function (index, icon) {
										if (icon.position != null) {
											var point = new GL.Point(new GL.LngLat(icon.position), new GL.Icon.Smart('assets/icons/' + iconpath, [40, 61]));
											point.bindTooltip(icon.name);
											vectorLayer.addOverlay(point);
										}

									});
									data[moduleId][parentName][resourceTypeValue] = vectorLayer;
									$this.currentVectorLayerList.push(vectorLayer);
								}
							}
						} else {
							if (data[moduleId][parentName] == undefined) {
								data[moduleId][parentName] = {};
								if (data[moduleId][parentName][resourceTypeValue] == undefined) {
									// console.log("xxdd",resourceList);
									var vectorLayer = new GL.VectorLayer();
									map.addLayer(vectorLayer);
									$.each(resourceList, function (index, icon) {
										if (icon.position != null) {
											var point = new GL.Point(new GL.LngLat(icon.position), new GL.Icon.Smart('assets/icons/' + iconpath, [40, 61]));
											point.bindTooltip(icon.name);
											vectorLayer.addOverlay(point);
										}
									});
									data[moduleId][parentName][resourceTypeValue] = vectorLayer;
									$this.currentVectorLayerList.push(vectorLayer);
								}
							} else {
								var vectorLayer = new GL.VectorLayer();
								map.addLayer(vectorLayer);
								$.each(resourceList, function (index, icon) {
									if (icon.position != null) {
										var point = new GL.Point(new GL.LngLat(icon.position), new GL.Icon.Smart('assets/icons/' + iconpath, [40, 61]));
										point.bindTooltip(icon.name);
										vectorLayer.addOverlay(point);
									}

								});
								data[moduleId][parentName][resourceTypeValue] = vectorLayer;
								$this.currentVectorLayerList.push(vectorLayer);
							}
						}
					}
				});
				$this.layerData = data;
				$this.currentLayerData = data[$this.moduleIds];
				// console.log("---",$this.currentLayerData);
				$.each($this.currentVectorLayerList, function (index, item) {
					item.hide();
				});
			})


		},
		initData: function () {

		},
		onParentResourceTypeSelect: function (event) {
			var el = event.currentTarget;
			if ($(el).siblings().hasClass('resourceOpened')) {
				$(el).siblings().removeClass('resourceOpened');
			} else { //显示下拉框
				$(el).siblings().addClass('resourceOpened');
			}
		},
		controllMapLevel: function () {
			map.on('zoomend', function (e) {
				// console.log("getZoom",map.getZoom());
				var zoom = map.getZoom();
				if (zoom > 1) {
					this.warningLayer.hide();
					$.each(this.currentVectorLayerList, function (index, item) {
						item.show();
					});
				} else {
					this.warningLayer.show();
					$.each(this.currentVectorLayerList, function (index, item) {
						item.hide();
					});
				}
				if (zoom > 3) {
					this.pointLayer.show();
				} else {
					this.pointLayer.hide();
				}
			}.bind(this));
		},
		changeStyle: function (k) {
			var obj = {
				backgroundImage: 'url("assets/layers_en/' + k + '.png")',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: '6px 16px',
				position: 'relative'
			};
			return obj;
		},
		drawLines: function () {
			this.polylines = {};
			callApi($AllParams.interfaces.getLines, {
				timeSafe: "8:00-17:00"
			}, function (response) {
				var result = response.result;
				$.each(result, function (index, line) {
					var uuid = line.uuid;
					var positions = line.positions;
					var status = line.status;
					var color = "";
					if (status == 'MESS_SECURITYLINE_STATUS:BEFORE') {
						color = "#ff9100";
					} else {
						color = "#ff1800";
					}
					var pos = [];
					$.each(positions, function (index, position) {
						pos.push(position.join(','))
					})
					var polyline = new GL.Polyline(pos.join(';'), new GL.Style({
						color: color
					}, true));
					polyline.addTo(map);
					this.polylines[uuid] = polyline;
				}.bind(this))
			}.bind(this));
		}
	},
	mounted: function () {
		// this.initMap();
		GL.ready(initMap, './conf.json');
		setTimeout(function () {
			this.getLineList('LEVEL_ONE');
			this.initOtherLineList();
			this.getResourceList();
			this.drawLines();
			$(".protect-chart:eq(0)").css("background", 'url("assets/map/bg_protect_unnormal.svg") no-repeat');
			this.controllMapLevel();
			var ws = new WebSocket($AllParams.interfaces.websocketUrl);
			ws.onopen = function (evt) {
				console.log("Connection open ...");
			};
			ws.onmessage = function (evt) {
				var data = JSON.parse(evt.data);
				this.initMarkPoint(data);
			}.bind(this);

			ws.onclose = function (evt) {
				console.log("Connection closed.");
			};
		}.bind(this), 2000);
		// this.initData();
	}

})