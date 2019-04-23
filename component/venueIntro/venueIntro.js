/**
 * Created by dell on 2018/9/5.
 */
Vue.component('venue-intro',function (resolve, reject) {
    GL.Http.load('./component/venueIntro/venueIntro.html',function (responseText) {
        resolve({
            template: responseText,
            props:['level','venueid'],
            data:function () {
                return {
                    venueInfo: null,
                    name: "",
                    description: "",
                    gameAlloc: '',
                    picture: "assets/ic_venue_img.png",//ftp://58.210.98.62/mess/suzhou/6
                    //$baseImageUrl
                    numMap:[]
                }
            },
            watch:{
                level:function (newl,old) {
                    // console.log("watched the new level value:"+newl);
                },
                venueid:function (newl,old) {
                    // console.log("watched the new venueid value:"+newl);
                    if(newl == ''){
						$('#venueIntro').css('display','none');
                    }
                    this.queryVenueDetailInfo()
                }
            },
            methods:{
                closeVenueIntro:function () {
					this.$emit('reset_venue');
                    $('#venueIntro').css('display','none');
                },
                queryVenueDetailInfo:function () {
                    var $this =this;
                    var params = {};
                    params.uuid = this.venueid;
                    callApi($AllParams.interfaces.venueDetailInfo,params,function (response) {
                        // console.info(response);
                        if(response.flag && response.result!= null){
                            var result = response.result;
                            $this.name= result.name;
                            $this.description = result.description;
                            $this.gameAlloc = result.gameAlloc;
                            $this.picture =$baseImageUrl +  result.picture;
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