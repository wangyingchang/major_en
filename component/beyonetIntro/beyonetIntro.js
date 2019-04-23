/**
 * Created by dell on 2018/9/5.
 */
Vue.component('bayonet-intro',function (resolve, reject) {
    GL.Http.load('./component/beyonetIntro/beyonetIntro.html',function (responseText) {
        resolve({
            template: responseText,
            props:['level','venueid'],
            data:function () {
                return {
                    // titleName: '卡口简介',
                    venueInfo: null,
                    name: "",
                    description: "",
                    numMap:[],
					picture:''
                }
            },
            watch:{
                level:function (newl,old) {
                    // console.log("watched the new level value:"+newl);
                    // if('' == this.titleName){
                    //
                    // }
                },
                venueid:function (newl,old) {
                    // console.log("watched the new venueid value:"+newl);
                }
            },
            methods:{
                closeBeyonetIntro:function () {
                    $('#beyonetIntro').css('display','none');
                },
                queryBeyonetDetailInfo:function () {
                    var $this =this;
                    var params = {};
                    params.uuid = this.venueid;
                    callApi($AllParams.interfaces.checkStationlInfo,params,function (response) {
                        if(response.flag && response.result!= null){
                            var result = response.result;
                            $this.name= result.name;
                            $this.description = result.address;
                            $this.numMap = result.numMap;
                        }
                    })
                }
            },
            mounted:function () {
                // console.log(this.venueid);
            }
        })
    })
});