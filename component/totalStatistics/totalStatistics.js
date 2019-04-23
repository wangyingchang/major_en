/**
 * Created by dell on 2018/8/30.
 */

Vue.component('total-statistics',function (resolve, reject) {
    GL.Http.load('./component/totalStatistics/totalStatistics.html',function (responseText) {
        resolve({
            template: responseText,
            props:['level','venueid'],
            data: function (){
                return {
                    statisticsType: '',
                    totalpersonCharts: '',
                    totalCarCharts: '',
                    personOption: '',
                    carOption: '',
                    stuffDatas: [],
                    totalStuffCount: 0,
                    personDatas: [],
                    totalPersonCount: 0
                };
            },
            watch:{
                level:function (newl,old) {
                    // console.log("watched the new level value:"+newl);
                    this.queryTodaySuspectStatistics();
                },
                venueid:function (newl,old) {
                    // console.log("watched the new venueid value:"+newl);
                    this.queryTodaySuspectStatistics();
                }
            },
            methods:{
                changeTag:function (id) {
                    console.log(id);
                    $('#'+id).addClass('total-statistics-active').siblings().removeClass('total-statistics-active');

                    // if(id == 'statistics-stuff'){
                    //     $('.total-'+id).css('display','flex').css('display','webkit-flex').siblings().css("display",'none');
                    // }else{
                        $('.'+id).css('display','block').siblings().css("display",'none');
                    // }
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
                initCharts:function () {
                    var color = ['#00ffff','#f16f09','#f8ae00','#7fd30f','#019e22','#0095db','#29abe2','#2b82e0'];
                    this.totalpersonCharts = echarts.init(document.getElementById('total-statistics-person-echarts'));
                    this.personOption = {
                        color: color,
                        tooltip: {
                            trigger: 'item'
                        },
                        title:{
                            text:'',
                            left: '49%',
                            top: '50%',
                            textAlign: 'center',
                            textBaseline: 'middle',
                            textStyle: {
                                color: '#fff',
                                fontSize: '22',
                                lineHeight: 40,
                                rich:{
                                    lineHeight: 40
                                }
                            }
                        },
                        series:[{
                            type: 'pie',
                            radius:['58%','70%'],
                            label:{
                                show: false
                            },
                            data: []
                        }]
                    };
                    // totalpersonCharts.setOption(personOption);
                    //嫌疑车辆
                    this.totalCarCharts = echarts.init(document.getElementById('total-statistics-car-echarts'));
                    this.carOption = {
                        tooltip:{
                            trigger: 'item'
                        },
                        textStyle:{
                            color: '#fff'
                        },
                        xAxis:{

                            axisLabel:{
                                interval:0,//横轴信息全部显示
                                rotate:-30,//-30度角倾斜显示
                                fontSize:'20'
                            },
                            data:[]
                        },
                        yAxis:{
                            axisLabel:{
                                fontSize:'20'
                            },
                            splitLine:{
                                lineStyle:{
                                    type:'dashed',
                                    color:'#3b192f'
                                }
                            }
                        },
                        series:[{
                            type:'bar',
                            itemStyle:{
                                color:'#41dbff'
                            },
                            data:[]
                        }]
                    };
                    // this.carOption.series.barWidth="20";
                    // totalCarCharts.setOption(carOption);
                },
                queryTodaySuspectStatistics:function () {
                    var $this = this;
                    this.getStatisticsType();
                    var params = {};
                    params.statisticsType = this.statisticsType;
                    params.venueId = this.venueid;
                    callApi($AllParams.interfaces.todaySuspectStatistics,params,function (response) {
                        if(response.flag){
                            var result = response.result;
                            if(result.personSuspectType){
                                $this.totalPersonCount = result.personSuspectType.total;
                                $this.personDatas = result.personSuspectType.dataList;
                                $this.personOption.title.text= 'Suspicious People\n'+$this.totalPersonCount+'';
                                var data = [];
                                // var progressHtml = '';
                                $.each($this.personDatas,function (index, item) {
                                    var obj = {};
                                    obj.name = item.suspectTypeValue;
                                    obj.value = item.suspectTypeCount;
                                    data.push(obj);
                                    // var percent = (item.suspectTypeCount/total)*100;
                                    // progressHtml+= '<div class="progress-line">'+
                                    //     '<span class="statistic-type">'+item.suspectTypeValue+'</span>'+
                                    //     '<div class="progress-item progress-inner">'+
                                    //     '<div class="progress-bg" style="width: '+percent+'%; height: 10px;"></div>'+
                                    //     '</div>'+
                                    //     '<span class="statistic-value">'+item.suspectTypeCount+'</span>'+
                                    //     '</div>';
                                });
                                $this.personOption.series[0].data = data;
                                $this.totalpersonCharts.setOption($this.personOption);
                                // $('.total-statistics-progress').html(progressHtml);
                            }
                            if(result.vehicleSuspectType){
                                var dataList= result.vehicleSuspectType.dataList;
                                var xAxisData = [];
                                var seriesData = [];
                                var series = [];
                                var seriesItem = {
                                        type:'bar',
                                        barWidth: 10,
                                        itemStyle:{
                                        color:'#41dbff'
                                    }
                                };
                                $.each(dataList,function (index, item) {
                                    xAxisData.push(item.suspectTypeValue);
                                    seriesData.push(item.suspectTypeCount);
                                });
                                seriesItem.data = seriesData;
                                series.push(seriesItem);
                                $this.carOption.xAxis.data = xAxisData;
                                $this.carOption.series = series;
                                $this.totalCarCharts.setOption($this.carOption);
                            }
                            if(result.baggageSuspectMap){
                                $this.totalStuffCount = result.baggageSuspectMap.total;
                                $this.stuffDatas = result.baggageSuspectMap.dataList;

                            }
                        }
                    })
                }
            },
            mounted:function () {
                this.initCharts();
                this.queryTodaySuspectStatistics();
                /*setInterval(function () {
					this.queryTodaySuspectStatistics();
				}.bind(this),300000)*/
            }
        })
    })
});