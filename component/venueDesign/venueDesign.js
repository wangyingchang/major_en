/**
 * Created by dell on 2018/8/30.
 */

Vue.component('venue-design',function (resolve, reject) {
    GL.Http.load('./component/venueDesign/venueDesign.html',function (responseText) {
        resolve({
            template: responseText,
            props:['level','venueid'],
            data: function (){
                return {
                    personCurrent: 0,
                    personCapacity: 0,
                    vehicleCurrent: 0,
                    vehicleCapacity: 0,
                    venuePoliceAndCapacity:[],
                    allVenuePoliceList:[],//全部场馆的图表
                    allVenueCapacity: null,
                    venueChart: '',
                    venueOption: '',
                    currentVenueType:'',
                    radarMax:0,
                    currentVenueName:''
                };
            },
            watch:{
                level:function (newl,old) {
                    // console.log("watched the new level value:"+newl);
                },
                venueid:function (newl,old) {
                    // console.log("watched the new venueid value:"+newl);
                    this.queryVenueCapacityStatistics();
                }
            },
            methods:{
                switchVenueTag:function (e,id) {
                    var $this = this;
                    var el =e.currentTarget;
                    $(el).parent().find('li').removeClass('venue-tag-active');
                    $(el).addClass('venue-tag-active');
                    this.currentVenueType = id;
                    this.currentVenueName = $(el).text();
                    if(id =='all'){
                        this.personCurrent = this.allVenueCapacity.personCurrent;
                        this.personCapacity = this.allVenueCapacity.personCapacity;
                        this.vehicleCurrent = this.allVenueCapacity.vehicleCurrent;
                        this.vehicleCapacity = this.allVenueCapacity.vehicleCapacity;
                        this.resetEchartData('全部',$this.allVenuePoliceList);
						$this.$emit('set_venue_center','');
                    }else{
                        $.each(this.venuePoliceAndCapacity,function (index, item) {
                            if(id == index){
                                $this.personCurrent = item.personCurrent;
                                $this.personCapacity = item.personCapacity;
                                $this.vehicleCurrent = item.vehicleCurrent;
                                $this.vehicleCapacity = item.vehicleCapacity;
                                $this.resetEchartData(item.name,item.venuePoliceList);
                               // console.log("select",item.venueId);
                                $this.$emit('set_venue_center',item.venueId);
                            }
                        })
                    }
                },
                queryVenueCapacityStatistics:function () {
                    this.resetData();
                    if(this.venueid == ''){
						$(".venue-tag:eq(0)").addClass('venue-tag-active');
                        $('.venue-tag-content').css('visibility','visible');
                        this.queryVenuePoliceAndCapacityStatistics();
                    }else{
                        //查询单个场馆数据
                        $('.venue-tag-content').css('visibility','hidden');
                        this.queryVenuePoliceAndCapacityAndOtherStatistics();
                    }
                },
                resetData:function () {
                    this.personCurrent = 0;
                    this.personCapacity= 0;
                    this.vehicleCurrent= 0;
                    this.vehicleCapacity= 0;
                    this.venuePoliceAndCapacity=[];
                    this.allVenuePoliceList=[];
                    this.allVenueCapacity= null;
                    this.venueChart= '';
                    this.venueOption= '';
                    this.currentVenueType='';
                    this.radarMax=0  ;
                },
                resetEchartData:function (name,list) {
                    var $this = this;
                    var indicatorArray = [];
                    var dataArray = [];

                    $.each(list,function (index, item) {
                        var obj = {};
                        obj.name = item.policeTypeValue;
                        obj.max = $this.radarMax;
                        obj.color = 'white';
                        indicatorArray.push(obj);
                        dataArray.push(item.policeCount);
                    });
                    var data=[];
                    var dataObj={};
                    dataObj.name = name;
                    dataObj.value = dataArray;
                    data.push(dataObj);
                    this.initVenueChart(indicatorArray,data);
                },
                queryVenuePoliceAndCapacityStatistics:function () {
                    var $this = this;
                    callApi($AllParams.interfaces.venuePoliceAndCapacityStatistics,{},function (response) {
                        if(response.flag && response.result != null){
                            var result = response.result;
                            $this.venuePoliceAndCapacity = result.venuePoliceAndCapacity;//各个场馆数据
                            $this.allVenuePoliceList = result.allVenuePoliceList;//所有场馆
                            $this.allVenueCapacity = result.allVenueCapacity;
                            $this.personCurrent = $this.allVenueCapacity.personCurrent;
                            $this.personCapacity = $this.allVenueCapacity.personCapacity;
                            $this.vehicleCurrent = $this.allVenueCapacity.vehicleCurrent;
                            $this.vehicleCapacity = $this.allVenueCapacity.vehicleCapacity;
                            $this.radarMax = 0;
							$.each($this.allVenuePoliceList,function (index, item) {
                                if(item.policeCount > $this.radarMax){
                                    $this.radarMax = item.policeCount;
                                }
                            });
                            var venusHtml = '<li class="venue-tag swiper-slide venue-tag-active" id="all">All</li>';
							$.each($this.venuePoliceAndCapacity,function (index, item) {
								venusHtml+='<li class="venue-tag swiper-slide" id="'+index+'">'+item.name+'</li>';
							});
							$('.swiper-wrapper').html(venusHtml);
							$this.swiper.update();

							// console.log('---',$this.currentVenueName);
                            $this.resetEchartData($this.currentVenueName,$this.allVenuePoliceList);
                        }
                    })
                },
                queryVenuePoliceAndCapacityAndOtherStatistics:function () {
                    var $this = this;
                    var params = {};
                    params.venueId = this.venueid;
                    callApi($AllParams.interfaces.venuePoliceAndCapacityAndOtherStatistics,params,function (response) {
                        if(response.flag && response.result != null){
                            var result = response.result;
                            $this.allVenuePoliceList = result.venuePoliceList;
                            $this.allVenueCapacity = result.venueCapacity;
                            $this.personCurrent = $this.allVenueCapacity.currentPerson;
                            $this.personCapacity = $this.allVenueCapacity.personCapacity;
                            $this.vehicleCurrent = $this.allVenueCapacity.currentVehicle;
                            $this.vehicleCapacity = $this.allVenueCapacity.vehicleCapacity;
                            $this.radarMax = 0;
                            $.each($this.allVenuePoliceList,function (index, item) {
                                if(item.policeCount > $this.radarMax){
                                    $this.radarMax = item.policeCount;
                                }
                            });
                            $this.resetEchartData('全部',$this.allVenuePoliceList);
                        }
                    })
                },
                initSwiper:function () {
					this.swiper = new Swiper('.swiper-container', {
						slidesPerView: 4,
						spaceBetween: 22,
						// freeMode: true,
						navigation: {
							nextEl: '.swiper-button-next',
							prevEl: '.swiper-button-prev',
						}
					});
                },
                initVenueChart:function (indicator,data) {
                    this.venueChart = echarts.init(document.getElementById('venue-chart'));
                    this.venueOption = {
                        radar:{
                            indicator:indicator
                        },
                        series:[{
                            type: 'radar',
                            itemStyle: {
                                normal: {
                                    color: '#f4a811'
                                }
                            },
                            areaStyle:{
                                normal: {
                                    opcity:0.5
                                }
                            },
                            data:data
                        }]
                    };
                    this.venueChart.setOption(this.venueOption);
                    // console.log(this.venueOption);
                },
				triggerVenue: function (e) {
					var el =e.currentTarget;
					console.log($(el).text());

				}
            },
            mounted:function () {
                this.initSwiper();
                // this.initVenueChart();
                this.queryVenueCapacityStatistics();

				$(document).on("click",".swiper-slide",function(e){
					var el =e.currentTarget;
					var id = $(el).attr('id');
                    this.switchVenueTag(e,id);
				}.bind(this))

            }
        })
    })
});