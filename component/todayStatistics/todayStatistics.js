/**
 * Created by dell on 2018/8/30.
 */

Vue.component('today-statistics',function (resolve, reject) {
    GL.Http.load('./component/todayStatistics/todayStatistics.html',function (responseText) {
        resolve({
            template: responseText,
            props:['level','venueid','socketdata'],
            watch:{
                level:function (newl,old) {
                    this.getStatisticsType();
                    this.queryTodayStatistics();
                },
                venueid:function (newl,old) {
                },
				socketdata: function (newl,old) {
                    var result = null;
                    if(this.statisticsType == 'STATISTICSTYPE_VENUE'){
						result = newl.allVenueData;
                    }else if(this.statisticsType == 'STATISTICSTYPE_BAYONET'){
						result = newl.allBayonetData;
                    }else if(this.statisticsType == 'STATISTICSTYPE_CHECKSTATION'){
						result = newl.allCheckStationData;
					}
					if(result !=null && newl !=null){
						this.person_allow_count = result.personCheckNum;
						this.person_doubt_count = result.personSusNum;
						this.person_flow_count = result.personTotalNum;
						this.police_count = result.policeNum;
						this.venue_count = result.statisticsTypeNum;
						this.allow_car_count = result.vehicleCheckNum;
						this.doubt_car_count = result.vehicleSusNum;
						this.car_count = result.vehicleTotalNum;
                    }
				}
            },
            data: function (){
                return {
                    venue_count:0,
                    police_count:0,
                    person_flow_count :0,
                    person_allow_count:0,
                    person_doubt_count:0,
                    car_count:0,
                    allow_car_count:0,
                    doubt_car_count: 0,
                    statisticsType: '',
					statisticsName: 'Venues',
					today_img: 'assets/ic_venue.svg'
                };
            },
            methods:{
                getStatisticsType:function () {
                    switch (this.level){
                        case 'LEVEL_ONE':
                            this.statisticsType = 'STATISTICSTYPE_VENUE';
							this.statisticsName = 'Venues';
							this.today_img = "assets/ic_venue.svg";
                            break;
                        case 'LEVEL_TWO':
                            this.statisticsType = 'STATISTICSTYPE_BAYONET';
							this.statisticsName = 'Gates';
							this.today_img = "assets/kk_icon.svg";
                            break;
                        case 'LEVEL_THREE':
                            this.statisticsType = 'STATISTICSTYPE_CHECKSTATION';
							this.statisticsName = 'Checkpoints';
							this.today_img = "assets/check_icon.svg";
                            break;
                    }
                },
                queryTodayStatistics:function () {
                    var params = {};
                    var $this = this;
                    params.statisticsType = this.statisticsType;
                    callApi($AllParams.interfaces.todayStatisticUrl,params,function (response) {
                        if(response.flag){
                            var result = response.result;
                            $this.person_allow_count = result.personCheckNum;
                            $this.person_doubt_count = result.personSusNum;
                            $this.person_flow_count = result.personTotalNum;
                            $this.police_count = result.policeNum;
                            $this.venue_count = result.statisticsTypeNum;
                            $this.allow_car_count = result.vehicleCheckNum;
                            $this.doubt_car_count = result.vehicleSusNum;
                            $this.car_count = result.vehicleTotalNum;
                        }
                    });
                }
            },
            mounted:function () {
                this.getStatisticsType();
                this.queryTodayStatistics();
            }
        })
    })
});