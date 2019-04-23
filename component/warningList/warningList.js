/**
 * Created by dell on 2018/8/30.
 */

Vue.component('warning-list',function (resolve, reject) {
	GL.Http.load('./component/warningList/warningList.html',function (responseText) {
		resolve({
			template: responseText,
			props:['level','venueid','alarmperson','alarmvehicle'],
			data: function (){
				return {
					statisticsType: '',
					susType: 'SUSTYPE_PERSON',//人:SUSTYPE_PERSON,车:SUSTYPE_VEHICLE
					personAlarmList: [],
					vehicleAlarmList: [],
					baseImagUrl: $baseImageUrl,
					totalWarningPersonPage: 0,
					totalWarningVehiclePage: 0,
					socketPerson: [],
					socketVehicle: [],
					personAlarms: [],
					vehicleAlarms: []

				};
			},
			watch:{
				level:function (newl,old) {
					// console.log("watched the new level value:"+newl);
					this.queryAlarmList();
				},
				venueid:function (newl,old) {
					// console.log("watched the new venueid value:"+newl);
					this.queryAlarmList();
				},
				alarmperson: function (newl,old) {

					/*this.socketPerson = this.mergeData(newl,this.socketPerson);
					this.personAlarmList = this.mergeData(this.socketPerson,this.personAlarmList);
					for(var i=0;i<this.personAlarmList.length;i++){
						var p = this.personAlarmList[i];
						if(p.status !=undefined){
							if(p.status == 'MESS_ALARMEVENT_PROCESSINGSTATE:COMPLETE'){
								this.personAlarmList.splice(i,1);
							}
						}
					}*/
					this.personAlarmList = this.mergeData_test(newl,this.personAlarmList);


					if(this.personAlarmList.length % 3 == 0){
						this.totalWarningPersonPage = this.personAlarmList.length / 3;
					}else{
						this.totalWarningPersonPage = parseInt(this.personAlarmList.length / 3) + 1;
					}
					this.initPersonLayer();
				},
				alarmvehicle: function (newl,old) {
					// console.log("new vehicle ",newl);
					// this.socketVehicle = this.mergeData([newl],this.socketVehicle);

					/*this.socketVehicle = this.mergeData(newl,this.socketVehicle);
					this.vehicleAlarmList = this.mergeData(this.socketVehicle,this.vehicleAlarmList);

					for(var i=0;i<this.vehicleAlarmList.length;i++){
						var v = this.vehicleAlarmList[i];
						if(v.status !=undefined){
							if(v.status == 'MESS_ALARMEVENT_PROCESSINGSTATE:COMPLETE'){
								this.vehicleAlarmList.splice(i,1);
							}
						}
					}*/
					this.vehicleAlarmList = this.mergeData_test(newl,this.vehicleAlarmList);

					if(this.vehicleAlarmList.length % 3 == 0){
						this.totalWarningVehiclePage = this.vehicleAlarmList.length / 3;
					}else{
						this.totalWarningVehiclePage = parseInt(this.vehicleAlarmList.length / 3) + 1;
					}
					this.initVehicleLayer();

				}
			},
			methods:{
				switchWarnTag:function (id) {
					this.susType = id;
					$('#'+id).addClass('warning_tag-active').siblings().removeClass('warning_tag-active');
					$('.'+id).css('display','block').siblings().css('display','none');
					//查询接口访问数据
				},
				getStatisticsType:function () {
					switch (this.level){
						case 'LEVEL_ONE':
							this.statisticsType = 'STATISTICSTYPE_VENUE';
							break;
						case 'LEVEL_TWO':
							this.statisticsType = 'STATISTICSTYPE_BAYONET';
							break;
						case 'LEVEL_THREE':
							this.statisticsType = 'STATISTICSTYPE_CHECKSTATION';
							break;
					}
				},
				initSwiper:function () {

				},
				queryAlarmList:function () {
					var params = {};
					if(this.venueid != ''){
						params.venueId = this.venueid;
					}else{
						this.getStatisticsType();
						params.statisticsType = this.statisticsType;
					}
					// params.susType = this.susType;
					callApi($AllParams.interfaces.alarmList,params,function (response) {
						if(response.flag && response.result != null){
							var personAlarms =  response.result.personAlarmList;
							var vehicleAlarms = response.result.vehicleAlarmList;
							/*this.personAlarmList = this.mergeData(this.socketPerson,personAlarms);
							this.vehicleAlarmList = this.mergeData(this.vehicleAlarms,vehicleAlarms);*/
							this.personAlarmList = personAlarms;
							this.vehicleAlarmList = vehicleAlarms;

							if(this.personAlarmList.length % 3 == 0){
								this.totalWarningPersonPage = this.personAlarmList.length / 3;
							}else{
								this.totalWarningPersonPage = parseInt(this.personAlarmList.length / 3) + 1;
							}
							if(this.vehicleAlarmList.length % 3 == 0){
								this.totalWarningVehiclePage = this.vehicleAlarmList.length / 3;
							}else{
								this.totalWarningVehiclePage = parseInt(this.vehicleAlarmList.length / 3) + 1;
							}
							this.initPersonLayer();
							this.initVehicleLayer();
							if($('#SUSTYPE_PERSON').hasClass('warning_tag-active')){
								$('.SUSTYPE_PERSON').css('display','block');
								$('.SUSTYPE_VEHICLE').css('display','none');
							}else{
								$('.SUSTYPE_PERSON').css('display','none');
								$('.SUSTYPE_VEHICLE').css('display','block');
							}
						}
					}.bind(this))
				},
				initVehicleLayer: function () {
					if(this.vehicleLayer == null) {
						this.vehicleLayer = new GL.VectorLayer();
						map.addLayer(this.vehicleLayer);
					}
					this.vehicleLayer.clear();
					this.vehicleLayer.setZIndex(0);
					// console.log("all-1:",this.vehicleAlarmList);
					$.each(this.vehicleAlarmList,function (index,vehicle) {
						var positions = vehicle.positions;
						var lngLat = new GL.LngLat(positions);
						var level = vehicle.level;
						var iconPath = "";
						if(level == 'MESS_ALARMEVENT_LEVEL:IMPORTANT'){
							iconPath = "assets/icons/warning_02.png";
						}else{
							iconPath = "assets/icons/warning_01.png";
						}
						var point=new GL.Point(lngLat,new GL.Icon.Smart(iconPath,[109,109]),{"zIndexOffset":-1});
						var pointhtml= '<div class="vehicle-pop-content">' +
							'<div class="vehicle-pop-left">' +
							'<div>PlateNum：'+vehicle.plateNum+'</div>' +
							'<div>Level: '+vehicle.levelValue+'</div>' +
							'<div>Event name：'+vehicle.typeValue+'</div>' +
							'</div>'+
							'<div class="vehicle-pop-right"><img src="'+$baseImageUrl+vehicle.imgUrl+'" width="100%" height="100%"></div>'+
							'</div>';
						point.bindPopup(pointhtml,{
							className: 'vehicle-pop'
						});
						this.vehicleLayer.addOverlay(point);
						//MESS_ALARMEVENT_PROCESSINGSTATE:NEWBUILD
						//MESS_ALARMEVENT_PROCESSINGSTATE:COMPLETE
						// console.log(vehicle.status+"--"+vehicle.plateNum,vehicle);
						if(vehicle.status =='MESS_ALARMEVENT_PROCESSINGSTATE:NEWBUILD'){
							point.highlight('#F4C265');
						}
						if(vehicle.status == undefined){
							point.visible(false);
						}
						vehicle.point = point;
					}.bind(this));
				},
				initPersonLayer: function () {
					if(this.personLayer == null) {
						this.personLayer = new GL.VectorLayer();
						map.addLayer(this.personLayer);
					}
					this.personLayer.setZIndex(0);
					this.personLayer.clear();
					// console.log("all:",this.personAlarmList);
					$.each(this.personAlarmList,function (index,person) {
						// console.log(person);
						var positions = person.positions;
						var lngLat = new GL.LngLat(positions);
						var level = person.level;
						var iconPath = "";
						if(level == 'MESS_ALARMEVENT_LEVEL:IMPORTANT'){
							iconPath = "assets/icons/warning_02.png";
						}else{
							iconPath = "assets/icons/warning_01.png";
						}
						var point=new GL.Point(lngLat,new GL.Icon.Smart(iconPath,[101,101]),{"zIndexOffset":-1});
						var pointhtml= '<div class="person-pop-content">' +
							'<div class="person-pop-left">' +
							'<div>Name：'+person.name+'</div>' +
							'<div>Level: '+person.levelValue+'</div>' +
							'<div>Event name：'+person.typeValue+'</div>' +
							'</div>'+
							'<div class="person-pop-right"><img src="'+$baseImageUrl+person.imgUrl+'" width="100%" height="100%"></div>'+
							'</div>';
						point.bindPopup(pointhtml,{
							className: 'person-pop'
						});
						this.personLayer.addOverlay(point);
						// console.log(person.status+"--"+person.name,person);
						if(person.status =='MESS_ALARMEVENT_PROCESSINGSTATE:NEWBUILD'){
							point.highlight('#F4C265');
						}
						if(person.status == undefined){
							point.visible(false);
						}
						person.point = point;
						// map.setView(lngLat,5);
					}.bind(this));
					/*setTimeout(function () {
					 this.personLayer.clear();
					 }.bind(this),10000)*/
				},
				selectPerson: function (person) {
					var point = person.point;
					var center =  point.getLngLat();
					point.bringToFront().openPopup();
					map.setView(center,5);
				},
				selectVehicle: function (vehicle) {
					var point = vehicle.point;
					var center =  point.getLngLat();
					point.bringToFront().openPopup();
					map.setView(center,5);
				},
				/*mergeData: function (arr1,arr2) {
					var arr = arr1.concat(arr2);
					for(var i = 0;i<arr.length;i++){
						var alarmEventId = arr[i].alarmEventId;
						for(var j = 0;j<arr.length;j++){
							var _alarmEventId =  arr[j].alarmEventId;
							if(i != j && alarmEventId == _alarmEventId){
								arr.splice(j,1);
							}
						}
					}
					return arr;
				},*/
				mergeData_test: function (arr1,arr2) {
					for(var i=0;i<arr1.length;i++){
						var alarmEventId = arr1[i].alarmEventId;
						for(var j=0;j<arr2.length;j++){
							var _alarmEventId =  arr2[j].alarmEventId;
							if(alarmEventId == _alarmEventId){
								arr2.splice(j,1);
							}
						}
					}
					var arr = arr1.concat(arr2);
					var temp = [];
					for(var k = 0;k<arr.length;k++){
						var item = arr[k];
						if(item.status !='MESS_ALARMEVENT_PROCESSINGSTATE:COMPLETE'){
							temp.push(item);
						}
						/*if(item.status != undefined){
							if(item.status == 'MESS_ALARMEVENT_PROCESSINGSTATE:COMPLETE'){
								arr.splice(k,1);
							}
						}*/
					}
					return temp;
				},
				changeImg: function (imgId,imgUrl,event) {
					event.stopPropagation();
					$('#'+imgId).attr('src',imgUrl);
				}
			},
			mounted:function () {
				this.queryAlarmList();
			}
		})
	})
});