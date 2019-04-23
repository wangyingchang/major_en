/**
 * Created by dell on 2018/9/7.
 */
var map;
function initMap() {
    // let self = this;
    // GL.ready(function (success) {
    this.map = new GL.Map('map', {
        zoomControl: false,
        scaleControl: false,
        attributionControl: false
    });
    //var url = 'http://192.168.3.209:8399/arcgis/rest/services/FS_ZH/MapServer';
    var url = $mapUrl;
    // var url = 'http://58.210.98.62:8399/arcgis/rest/services/FS_ZH/MapServer';
    var orginal = '119.75,32.25';

    var resolutions = [0.0011718797884108384, 5.859398942054192E-4, 1.464849735513548E-4, 3.662124338860013E-5, 9.155310847530746E-6, 2.2888277122633999E-6];
    var maxBounds = '119.89,30.75;121.406,32.08';
    var crs = {
        origin: orginal,
        resolutions: resolutions,
        code: '4326'
    };
    var baseLayer = GL.LayerLookup.createEsriTiledLayer(
        url, {
            maxBounds: maxBounds
        },
        crs
    );
    self.map.addBaseLayer(baseLayer);
    // }, './conf.json');
    //场馆图层
    // $AllParams.venueVectorLayer = new GL.VectorLayer();
    // map.addLayer($AllParams.venueVectorLayer);
    // $AllParams.venueVectorLayer= new GL.VectorLayer();
    //     $AllParams.fireengineVectorLayer= new GL.VectorLayer();
    //     $AllParams.ambulanceVectorLayer= new GL.VectorLayer();
    //     $AllParams.command_vehicleVectorLayer= new GL.VectorLayer();
    //     $AllParams.check_vehicleVectorLayer= new GL.VectorLayer();
    //     $AllParams.policecarVectorLayer= new GL.VectorLayer();
    //     $AllParams.airportVectorLayer= new GL.VectorLayer();
    //     $AllParams.cargo_stationVectorLayer= new GL.VectorLayer();
    //     $AllParams.portVectorLayer= new GL.VectorLayer();
    //     $AllParams.landportVectorLayer= new GL.VectorLayer();
    //     $AllParams.railwayStationVectorLayer= new GL.VectorLayer();
    //     $AllParams.hotelVectorLayer= new GL.VectorLayer();
    //     $AllParams.nearbyStoreVectorLayer= new GL.VectorLayer();
    //     $AllParams.checkstationVectorLayer= new GL.VectorLayer();
    //     $AllParams.highwayCheckstationVectorLayer= new GL.VectorLayer();
    //     $AllParams.security_bayonetVectorLayer= new GL.VectorLayer();
    //     $AllParams.main_intersectionVectorLayer= new GL.VectorLayer();
    //     $AllParams.intelligence_bayonetVectorLayer= new GL.VectorLayer();
    //     $AllParams.policemanVectorLayer= new GL.VectorLayer();
    //     $AllParams.sucuritypersonVectorLayer= new GL.VectorLayer();
    //     $AllParams.volunteerVectorLayer= new GL.VectorLayer();
    //     $AllParams.staffVectorLayer= new GL.VectorLayer();
    //     $AllParams.welkin_detectorVectorLayer= new GL.VectorLayer();
    //     $AllParams.uavVectorLayer= new GL.VectorLayer();
    //     $AllParams.cameraVectorLayer= new GL.VectorLayer();
    //     $AllParams.fireplugVectorLayer= new GL.VectorLayer();
    //     $AllParams.robotVectorLayer= new GL.VectorLayer();
    //     $AllParams.importandexport_product_channelVectorLayer= new GL.VectorLayer();
    //     $AllParams.emergency_channelVectorLayer= new GL.VectorLayer();
    //     $AllParams.person_security_checkVectorLayer= new GL.VectorLayer();
    //     $AllParams.vehicle_security_checkVectorLayer= new GL.VectorLayer();
}