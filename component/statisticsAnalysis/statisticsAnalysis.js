/**
 * Created by dell on 2018/8/30.
 */

Vue.component('statistics-analysis',function (resolve, reject) {
    GL.Http.load('./component/statisticsAnalysis/statisticsAnalysis.html',function (responseText) {
        resolve({
            template: responseText,
            props:['level','venueid'],
            data: function (){
                return {
                    currentTag: 'all'
                };
            },
            watch:{
                level:function (newl,old) {
					if(newl == 'LEVEL_ONE'){
						if('all' == this.currentTag){
							this.queryVenueSuspectStatistics();
						}else{
							this.venueSuspectClassifyStatistics();
						}
					}
                },
                venueid:function (newl,old) {
                    if(this.level == 'LEVEL_ONE'){
						if('all' == this.currentTag){
							this.queryVenueSuspectStatistics();
						}else{
							this.venueSuspectClassifyStatistics();
						}
                    }
                }
            },
            methods:{
                switchStatisticTag:function(id){
                    $('#statistics-analysis-'+id).addClass('statistics_tag_active').siblings().removeClass('statistics_tag_active');
                    $('#statistics-analysis-'+id+'-echarts').css('display','block').siblings().css('display','none');
                    if(id == 'all'){//statistics-analysis-all
                        this.currentTag= 'all';
                        this.queryVenueSuspectStatistics();
                    }else{
                        this.currentTag= id;
                        this.venueSuspectClassifyStatistics();
                        // this.initSubCharts('statistic-analysiss-'+id+'-echarts');
                    }
                },
                queryVenueSuspectStatistics:function () {
                    var params = {};
                    params.venueId = this.venueid;
                    var $this = this;
                    callApi($AllParams.interfaces.venueSuspectStatistics,params,function (response) {
                        // console.log(response);
                        if(response.flag){
                            var result = response.result;
                            var dateList  = result.dateList;
                            var packageSuspectList  = result.packageSuspectList;//物品
                            var personSuspectList  = result.personSuspectList;//人员
                            var vehicleSuspectList  = result.vehicleSuspectList;//车辆
                            $this.initEchart(dateList,personSuspectList,vehicleSuspectList,packageSuspectList);
                        }
                    })
                },
                venueSuspectClassifyStatistics:function () {
                    var $this = this;
                    var params = {};
                    params.venueId = this.venueid;
                    params.susType = this.currentTag;
                    callApi($AllParams.interfaces.venueSuspectClassifyStatistics,params,function (response) {
                        // console.log(response);
                        if (response.flag) {
                            var result = response.result;
                            var dataList = [];
                            if($this.currentTag == 'SUSTYPE_PERSON'){
                                dataList = result.personDataList;
                            }else if($this.currentTag == 'SUSTYPE_VEHICLE'){
                                dataList = result.vehicleDataList;
                            }else if($this.currentTag == 'SUSTYPE_GOODS'){
                                dataList = result.bagDataList;
                            }
                            $this.initSubCharts('statistics-analysis-'+$this.currentTag+'-echarts',result.dateList,dataList);
                        }
                    })
                },
                initEchart:function(xAxisData,personSuspectList,vehicleSuspectList,packageSuspectList){
                    var colors1 = ['#d89d2e', '#7326a5', '#a4207d'];
                    var myChart =  echarts.init(document.getElementById('statistics-analysis-all-echarts'));
                    var option = {
                        color:colors1,//调色盘颜色
                        legend:{
                            textStyle:{
                                color:'#fff',
								fontSize:'14'
                            },
                            data:['People','Vehicles','Items']
                        },
                        tooltip:{
                            trigger: 'item',
                            formatter:'{a} {c}'
                        },
                        textStyle:{
                            color:'#fff'
                        },
                        xAxis:{
                            axisLabel:{
                                    // fontSize:'20'
								textStyle: {
									fontSize: 18
								}
                            },
                            // data: ["2018-09-04", "2018-09-05", "2018-09-06", "2018-09-07", "2018-09-08", "2018-09-09", "2018-09-10"]
                            data: []
                        },
                        yAxis:{
                            axisLabel:{
                                // fontSize:'20'
                            },
                            splitLine: {
                                show: false
                            }
                        },
                        series:[{
                            type:'line',
                            name:'People',
                            smooth:true,
                            lineStyle:{
                                color: '#d89d2e'
                            },
                            tooltip:{
                                backgroundColor: '#d89d2e'
                            },
                            symbolSize: 10,
                            data:[]
                        },
                            {
                                type:'line',
                                name:'Vehicles',
                                smooth:true,
                                lineStyle:{
                                    color: '#7326a5'
                                },
                                tooltip:{
                                    backgroundColor: '#7326a5'
                                },
                                symbolSize: 10,
                                data:[]
                            },
                            {
                                type:'line',
                                name:'Items',
                                smooth:true,
                                lineStyle:{
                                    color: '#a4207d'
                                },
                                tooltip:{
                                    backgroundColor: '#a4207d'
                                },
                                symbolSize: 10,
                                data:[]
                            }]
                    };

                    /*for (var i = 0; i < xAxisData.length; i++) {
                        xAxisData[i] = xAxisData[i].substring(5, 10).replace("-", "");
                    }*/
                    option.xAxis.data = xAxisData;
                    option.series[0].data = personSuspectList;
                    option.series[1].data =vehicleSuspectList;
                    option.series[2].data =packageSuspectList;
                    // console.log(option);
                    myChart.setOption(option);
                },
                initSubCharts:function(id,dateList,personDataList){
                    // console.log(id);
                    var colors = ['#c49a2d','#1e5a32','#772f13','#4a90a8','#521766','#312277','#1b5a76','#841963','#741951'];
                    var subEchart = echarts.init(document.getElementById(id));
                    var subOption = {
                        color: colors,
                        legend:{
                            textStyle:{
                                color:'#ffffff',
								fontSize:'14'
                            }
                        },
                        tooltip:{
                          trigger: 'item',
                          formatter:'{a} {c}'
						},
                        textStyle:{
                            color: '#fff'
                        },
                        xAxis:{
                            data: dateList,
							axisLabel:{
								textStyle: {
									fontSize: 18
								}
							}
                        },
                        yAxis:{
                            splitLine: {
                                show: false
                            }
                        },
                        series:[]
                    };
                    var series = [];
                    $.each(personDataList,function (index, item) {
                        var obj = {};
                        obj.type = 'line';
                        obj.name = item.name;
                        obj.data = item.data;
                        obj.smooth = true;
                        obj.tooltip = {backgroundColor: colors[index]};
                        obj.symbolSize = 10;
                        series.push(obj);
                    });
                    subOption.series = series;
                    subEchart.setOption(subOption);
                }
            },
            mounted:function () {
                this.queryVenueSuspectStatistics();
                // this.initEchart();
                /*setInterval(function () {
					if(this.level == 'LEVEL_ONE'){
						if('all' == this.currentTag){
							this.queryVenueSuspectStatistics();
						}else{
							this.venueSuspectClassifyStatistics();
						}
					}
				}.bind(this),300000);*/
            }
        })
    })
});