/**
 * Created by dell on 2018/9/6.
 */
$baseUrl = 'http://192.168.3.224:18080/mess-server'; // $baseUrl=  'http://58.210.98.62:19090/mess-server';
$baseImageUrl = 'http://192.168.3.224:8085'; // $baseImageUrl = 'ftp://58.210.98.62';
$socketUrl = 'ws://58.210.98.62:19090/mess-server';
$mapUrl = "http://192.168.3.209:8399/arcgis/rest/services/FS_ZH/MapServer";

$AllParams = {
    interfaces: {
        getLineList: $baseUrl + '/mess/statistics/getLineList', //获取防护圈列表
        resourceList: $baseUrl + '/mess/resource/resourceList', //获取地图上要展示的资源
        todayStatisticUrl: $baseUrl + '/mess/statistics/populationStatistics',
        venueSuspectStatistics: $baseUrl + '/mess/statistics/venueSuspectStatistics', //统计分析中的'全部'分类
        venueSuspectClassifyStatistics: $baseUrl + '/mess/statistics/venueSuspectClassifyStatistics', //统计分析中的人车物分类
        todaySuspectStatistics: $baseUrl + '/mess/statistics/todaySuspectStatistics', //今日嫌疑人车物统计
        venueDetailInfo: $baseUrl + '/mess/resource/venueDetailInfo', //查询场馆详情
        alarmList: $baseUrl + '/mess/statistics/alarmList', //智能预警列表
        totalSuspectStatistics: $baseUrl + '/mess/statistics/totalSuspectStatistics', //按场馆人车物统计
        venuePoliceAndCapacityStatistics: $baseUrl + '/mess/statistics/venuePoliceAndCapacityStatistics', //各场馆警力分类统计
        venuePoliceAndCapacityAndOtherStatistics: $baseUrl + '/mess/statistics/venuePoliceAndCapacityAndOtherStatistics', //当前场馆警力分类统计
        venueGameInfo: $baseUrl + '/mess/statistics/venueGameInfo', //场馆赛事安排
        checkStationlInfo: $baseUrl + '/mess/resource/checkStationlInfo', //卡口与检查站详情
        IntelligentEntrySevendayTrendStatistics: $baseUrl + '/mess/statistics/IntelligentEntrySevendayTrendStatistics', //卡口七天统计
        checkstationTrendStatistics: $baseUrl + '/mess/statistics/checkstationTrendStatistics', //检查站周月年统计
        alarmNum: $baseUrl + '/mess/statistics/alarmNum', //预警数量,
        getLines: $baseUrl + '/mess/securityline/getLines',
        websocketUrl: $socketUrl + '/websocket/web/0/web1'
    }
    // resouceType: {
    //     venue: 'MESS_MODULETYPE:FIRST_LINE_OF_DEFENSE:VENUE',
    //     fireengine: 'MESS_MODULETYPE:VENUE:FIREENGINE',//消防车
    //     ambulance: 'MESS_MODULETYPE:VENUE:AMBULANCE',
    //     command_vehicle: 'MESS_MODULETYPE:VENUE:COMMAND_VEHICLE',
    //     check_vehicle: 'MESS_MODULETYPE:VENUE:SEC_CHECK_VEHICLE',//安检车
    //     policecar: 'MESS_MODULETYPE:VENUE:POLICECAR',
    //     airport: 'MESS_MODULETYPE:THIRD_LINE_OF_DEFENSE:AIRPORT',//机场
    //     cargo_station: 'MESS_MODULETYPE:THIRD_LINE_OF_DEFENSE:CARGO_STATION',//货站
    //     port: 'MESS_MODULETYPE:THIRD_LINE_OF_DEFENSE:PORT',
    //     landport: 'MESS_MODULETYPE:THIRD_LINE_OF_DEFENSE:LANDPORT',
    //     railway_station: 'MESS_MODULETYPE:THIRD_LINE_OF_DEFENSE:RAILWAY_STATION',//火车站
    //     hotel: 'MESS_MODULETYPE:SECOND_LINE_OF_DEFENSE:HOTEL',
    //     nearby_store: 'MESS_MODULETYPE:FIRST_LINE_OF_DEFENSE:NEARBY_STORE',
    //     checkstation: 'MESS_MODULETYPE:CHECKSTATION',
    //     highway_checkstation: 'MESS_MODULETYPE:THIRD_LINE_OF_DEFENSE:HIGHWAY_CHECKPOINT',//公路检查站
    //     security_bayonet: 'MESS_MODULETYPE:THIRD_LINE_OF_DEFENSE:SECURITY_BAYONET',//安保卡口
    //     main_intersection: 'MESS_MODULETYPE:SECOND_LINE_OF_DEFENSE:MAIN_INTERSECTION',//主要路口
    //     intelligence_bayonet: 'MESS_MODULETYPE:SECOND_LINE_OF_DEFENSE:INTELLIGENCE_BAYONET',//智能卡口
    //     policeman: 'MESS_MODULETYPE:VENUE:POLICEMAN',
    //     sucurityperson: 'MESS_MODULETYPE:VENUE:SUCURITYPERSON',//保安
    //     volunteer: 'MESS_MODULETYPE:VENUE:VOLUNTEER',
    //     staff: 'MESS_MODULETYPE:VENUE:STAFF',//工作人员
    //     welkin_detector: 'MESS_MODULETYPE:SECOND_LINE_OF_DEFENSE:WELKIN_DETECTOR',//高空探头
    //     uav: 'MESS_MODULETYPE:VENUE:UAV',//无人机
    //     camera: 'MESS_MODULETYPE:VENUE:CAMERA',
    //     fireplug: 'SS_MODULETYPE:VENUE:FIREPLUG',//消防栓
    //     robot: 'MESS_MODULETYPE:VENUE:ROBOT',//机器人
    //     importandexport_product_channel: 'MESS_MODULETYPE:FIRST_LINE_OF_DEFENSE:IMPORTANDEXPORT_PRODUCT_CHANNEL',//进出口货物通道
    //     emergency_channel: 'MESS_MODULETYPE:FIRST_LINE_OF_DEFENSE:EMERGENCY_CHANNEL',//紧急通道
    //     person_security_check: 'MESS_MODULETYPE:FIRST_LINE_OF_DEFENSE:PERSON_SECURITY_CHECK',//人员安检通道
    //     vehicle_security_check: 'MESS_MODULETYPE:FIRST_LINE_OF_DEFENSE:VEHICLE_SECURITY_CHECK'//车辆安检通道
    // },
    // venueVectorLayer: '',
    // fireengineVectorLayer: '',
    // ambulanceVectorLayer: '',
    // command_vehicleVectorLayer: '',
    // check_vehicleVectorLayer: '',
    // policecarVectorLayer: '',
    // airportVectorLayer: '',
    // cargo_stationVectorLayer: '',
    // portVectorLayer: '',
    // landportVectorLayer: '',
    // railwayStationVectorLayer: '',
    // hotelVectorLayer: '',
    // nearbyStoreVectorLayer: '',
    // checkstationVectorLayer: '',
    // highwayCheckstationVectorLayer: '',
    // security_bayonetVectorLayer: '',
    // main_intersectionVectorLayer: '',
    // intelligence_bayonetVectorLayer: '',
    // policemanVectorLayer: '',
    // sucuritypersonVectorLayer: '',
    // volunteerVectorLayer: '',
    // staffVectorLayer: '',
    // welkin_detectorVectorLayer: '',
    // uavVectorLayer: '',
    // cameraVectorLayer: '',
    // fireplugVectorLayer: '',
    // robotVectorLayer: '',
    // importandexport_product_channelVectorLayer: '',
    // emergency_channelVectorLayer: '',
    // person_security_checkVectorLayer: '',
    // vehicle_security_checkVectorLayer: ''
};

function callApi(url, data, callback, callErrorBack) {
    $.ajax({
        type: 'get',
        url: url,
        cache: false,
        data: data,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            callback(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (callErrorBack instanceof Function) {
                callErrorBack();
            }
            console.log("error:---", url);
            console.log('!!!error:' + errorThrown);
        }
    });
}