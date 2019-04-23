/**
 * Created by xuhui on 2018/8/29.
 */

var vue = new Vue({
    el: '#app',
    data: {
        map: null,
        aa: '112233',
        venueId: '', //场馆id，为空时查询所有数据
        currentLevel: 'LEVEL_ONE',
        mapData: []
    },
    watch: {
        currentLevel: function (newl, old) { //一级:LEVEL_ONE, 二级:LEVEL_TWO, 三级:LEVEL_THREE
            console.log("currentLevel= " + newl);
            if (newl == 'LEVEL_ONE') {
                $('.statistics-analysis').css('display', 'block');
                $('.trend-analysis').css('display', 'none');
            } else {
                $('.statistics-analysis').css('display', 'none');
                $('.trend-analysis').css('display', 'block');
            }
        },
        venueId: function (newv, old) {
            console.log("venueId= " + newv);
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
        onSelectResourceType: function (name) {

        },
        getLineList: function (lineLevel) {
            this.currentLevel = lineLevel;
            var titleText = '';
            if ('LEVEL_ONE' == lineLevel) {
                titleText = '一级防护盾';
            } else if ('LEVEL_TWO' == lineLevel) {
                titleText = '二级防护盾';
            } else if ('LEVEL_THREE' == lineLevel) {
                titleText = '三级防护盾';
            }
            var color = ['#00ffff', '#616f09', '#f8ae00', '#0095db'];
            var echart = echarts.init(document.getElementById(lineLevel));
            var option = {
                color: color,
                tooltip: {
                    trigger: 'item'
                },
                title: {
                    text: titleText,
                    left: '36%',
                    top: '45%',
                    textStyle: {
                        color: '#ffffff'
                    }
                },
                series: {
                    type: 'pie',
                    radius: ['49%', '58%'],
                    label: {
                        formatter: '{c}个\n{b}',
                        fontSize: '16'
                    },
                    // labelLine:{
                    //     show:false
                    // },
                    data: [{
                            name: '车辆通道',
                            value: 40
                        },
                        {
                            name: '人员通道',
                            value: 74
                        },
                        {
                            name: '防控点',
                            value: 6
                        }
                    ]
                }
            };
            echart.setOption(option);

            callApi($AllParams.interfaces.getLineList, {
                lineLevel: lineLevel
            }, function (response) {
                if (200 == response.resultCode) {
                    var lnglats = response.lineList.positions;
                    var resourceList = response.resourceList; //防护圈上的图标数据
                    var color = ['#00ffff', '#616f09', '#f8ae00', '#0095db'];
                    var echart = echarts.init(document.getElementById(lineLevel));
                    var option = {
                        color: color,
                        tooltip: {
                            trigger: 'item'
                        },
                        title: {
                            text: titleText,
                            left: '36%',
                            top: '45%',
                            textStyle: {
                                color: '#ffffff'
                            }
                        },
                        series: {
                            type: 'pie',
                            radius: ['49%', '58%'],
                            label: {
                                formatter: '{c}个\n{b}',
                                fontSize: '16'
                            },
                            data: [{
                                    name: '车辆通道',
                                    value: 40
                                },
                                {
                                    name: '人员通道',
                                    value: 74
                                },
                                {
                                    name: '防控点',
                                    value: 6
                                }
                            ]
                        }
                    };
                    echart.setOption(option);
                }
            })
        },
        getResourceList: function () { //获取当前防护级别下的地图mark点
            var moduleIds = '';
            if (this.currentLevel = 'LEVEL_ONE') {
                moduleIds = ['MESS_MODULETYPE:FIRST_LINE_OF_DEFENSE'];
            } else if (this.currentLevel = 'LEVEL_TWO') {
                moduleIds = ['MESS_MODULETYPE:SECOND_LINE_OF_DEFENSE'];
            } else if (this.currentLevel = 'LEVEL_THREE') {
                moduleIds = ['MESS_MODULETYPE:THIRD_LINE_OF_DEFENSE'];
            }
            var params = {};
            params.moduleIds = moduleIds;
            callApi($AllParams.interfaces.resourceList, params, function (response) {});
            // callApi($AllParams.interfaces.resourceList,params,function (response) {
            //     if(response.flag){
            //       var result = response.result;
            //       $.each(result,function (index,item) {
            //         if(moduleIds === item.moduleId){
            //             var resourceType = item.resourceType;
            //             var resourceList = item.resourceList;
            //             var icon = '';
            //             var vectorLayer = '';
            //
            //             switch (resourceType){
            //                 case $AllParams.resouceType.venue:
            //                     icon = new GL.Icon.Smart('assets/icons/venue.png', [40, 61]);
            //                     vectorLayer = $AllParams.venueVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.fireengine:
            //                     icon = new GL.Icon.Smart('assets/icons/fireengine.png', [40, 61]);
            //                     vectorLayer = $AllParams.fireengineVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.ambulance:
            //                     icon = new GL.Icon.Smart('assets/icons/ambulance.png', [40, 61]);
            //                     vectorLayer = $AllParams.ambulanceVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.command_vehicle:
            //                     icon = new GL.Icon.Smart('assets/icons/command_vehicle.png', [40, 61]);
            //                     vectorLayer = $AllParams.command_vehicleVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.check_vehicle:
            //                     icon = new GL.Icon.Smart('assets/icons/check_vehicle.png', [40, 61]);
            //                     vectorLayer = $AllParams.check_vehicleVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.policecar:
            //                     icon = new GL.Icon.Smart('assets/icons/policecar.png', [40, 61]);
            //                     vectorLayer = $AllParams.policecarVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.airport:
            //                     icon = new GL.Icon.Smart('assets/icons/airport.png', [40, 61]);
            //                     vectorLayer = $AllParams.airportVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.cargo_station:
            //                     icon = new GL.Icon.Smart('assets/icons/cargo_station.png', [40, 61]);
            //                     vectorLayer = $AllParams.cargo_stationVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.port:
            //                     icon = new GL.Icon.Smart('assets/icons/port.png', [40, 61]);
            //                     vectorLayer = $AllParams.portVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.landport:
            //                     icon = new GL.Icon.Smart('assets/icons/port.png', [40, 61]);
            //                     vectorLayer = $AllParams.landportVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.railway_station:
            //                     icon = new GL.Icon.Smart('assets/icons/railway_station.png', [40, 61]);
            //                     vectorLayer = $AllParams.railwayStationVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.hotel:
            //                     icon = new GL.Icon.Smart('assets/icons/hotel.png', [40, 61]);
            //                     vectorLayer = $AllParams.hotelVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.nearby_store:
            //                     icon = new GL.Icon.Smart('assets/icons/nearby_store.png', [40, 61]);
            //                     vectorLayer = $AllParams.nearbyStoreVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.checkstation:
            //                     icon = new GL.Icon.Smart('assets/icons/checkstation.png', [40, 61]);
            //                     vectorLayer = $AllParams.checkstationVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.highway_checkstation:
            //                     icon = new GL.Icon.Smart('assets/icons/checkstation.png', [40, 61]);
            //                     vectorLayer = $AllParams.highwayCheckstationVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.security_bayonet:
            //                     icon = new GL.Icon.Smart('assets/icons/security_bayonet.png', [40, 61]);
            //                     vectorLayer = $AllParams.security_bayonetVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.main_intersection:
            //                     icon = new GL.Icon.Smart('assets/icons/main_intersection.png', [40, 61]);
            //                     vectorLayer = $AllParams.main_intersectionVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.intelligence_bayonet:
            //                     icon = new GL.Icon.Smart('assets/icons/intelligence_bayonet.png', [40, 61]);
            //                     vectorLayer = $AllParams.intelligence_bayonetVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.policeman:
            //                     icon = new GL.Icon.Smart('assets/icons/policeman.png', [40, 61]);
            //                     vectorLayer = $AllParams.policemanVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.sucurityperson:
            //                     icon = new GL.Icon.Smart('assets/icons/sucurityperson.png', [40, 61]);
            //                     vectorLayer = $AllParams.sucuritypersonVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.volunteer:
            //                     icon = new GL.Icon.Smart('assets/icons/volunteer.png', [40, 61]);
            //                     vectorLayer = $AllParams.volunteerVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.staff:
            //                     icon = new GL.Icon.Smart('assets/icons/staff.png', [40, 61]);
            //                     vectorLayer = $AllParams.staffVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.welkin_detector:
            //                     icon = new GL.Icon.Smart('assets/icons/welkin_detector.png', [40, 61]);
            //                     vectorLayer = $AllParams.welkin_detectorVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.uav:
            //                     icon = new GL.Icon.Smart('assets/icons/uav.png', [40, 61]);
            //                     vectorLayer = $AllParams.uavVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.camera:
            //                     icon = new GL.Icon.Smart('assets/icons/camera.png', [40, 61]);
            //                     vectorLayer = $AllParams.cameraVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.fireplug:
            //                     icon = new GL.Icon.Smart('assets/icons/fireplug.png', [40, 61]);
            //                     vectorLayer = $AllParams.fireplugVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.robot:
            //                     icon = new GL.Icon.Smart('assets/icons/robot.png', [40, 61]);
            //                     vectorLayer = $AllParams.robotVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.importandexport_product_channel:
            //                     icon = new GL.Icon.Smart('assets/icons/importandexport_product_channel.png', [40, 61]);
            //                     vectorLayer = $AllParams.importandexport_product_channelVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.emergency_channel:
            //                     icon = new GL.Icon.Smart('assets/icons/emergency_channel.png', [40, 61]);
            //                     vectorLayer = $AllParams.emergency_channelVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.person_security_check:
            //                     icon = new GL.Icon.Smart('assets/icons/person_security_check.png', [40, 61]);
            //                     vectorLayer = $AllParams.person_security_checkVectorLayer;
            //                     break;
            //                 case $AllParams.resouceType.vehicle_security_check:
            //                     icon = new GL.Icon.Smart('assets/icons/vehicle_security_check.png', [40, 61]);
            //                     vectorLayer = $AllParams.vehicle_security_checkVectorLayer;
            //                     break;
            //             }
            //             $.each(resourceList,function (i, cell) {
            //
            //             })
            //         }
            //       })
            //     }
            // })
            ///////////////////////////////////////
            // var result = resultData.result;
            // var parentArray  = [];
            // $.each(result,function (index, item) {
            //     var parentId = item.parentId;
            //     var parentName = item.parentName;
            //     var iconpath = item.iconpath;
            //     var resourceType = item.resourceType;//资源类型，作为键
            //     var resourceList = item.resourceList;
            //     var icon = '';
            //     var vectorLayer = '';
            //     // var childArray = [];
            //     var obj = {};
            //     parentArray.push();
            //
            //     icon = new GL.Icon.Smart('assets/icons/'+icon, [40, 61]);
            //     // var venueVectorLayer= new GL.VectorLayer();
            //     obj[resourceType] = new GL.VectorLayer();
            //     map.addLayer(obj[resourceType]);
            //     $.each(resourceList,function (i, cell) {
            //         var point = new GL.Point(cell.position.split(",")[0] + ',' + cell.position.split(",")[1], icon);
            //         point.attr.uuid = cell.uuid;
            //         point.attr.name = cell.name;
            //         point.on("click",function (e) {
            //          //click
            //         });
            //         obj[resourceType].addOverlay(point);
            //     })
            //
            // });

            var data = {};
            $.each(resultData.result, function (index, item) {
                /*var moduleId = item.moduleId;//防护基本
                 var parentId = item.parentId;//大类
                 var resourceType = item.resourceType;//小类
                 var resourceList = item.resourceList;//小类项目*/

                var moduleValue = item.moduleValue;
                var moduleId = item.moduleId;
                var parentName = item.parentName;
                var parentId = item.parentId;
                var resourceTypeValue = item.resourceTypeValue;
                var resourceType = item.resourceType; //资源类型，作为键
                var resourceList = item.resourceList;
                var icon = new GL.Icon.Smart('assets/icons/' + icon, [40, 61]);

                // if(data[moduleValue] == undefined){
                //     data[moduleValue] = {};
                //     if(data[moduleValue][parentName] == undefined){
                //         data[moduleValue][parentName] = {};
                //         if(data[moduleValue][parentName][resourceTypeValue] == undefined){
                //             data[moduleValue][parentName][resourceTypeValue] = resourceList;
                //         }
                //     }
                // }else{
                //     if(data[moduleValue][parentName] == undefined){
                //         data[moduleValue][parentName] = {};
                //         if(data[moduleValue][parentName][resourceTypeValue] == undefined){
                //             data[moduleValue][parentName][resourceTypeValue] = resourceList;
                //         }
                //     }
                // }
            });
            console.log(data);
        }
    },
    mounted: function () {
        // this.initMap();
        GL.ready(initMap, './conf.json');
        this.getLineList('LEVEL_ONE');
        this.getResourceList()
    }
});