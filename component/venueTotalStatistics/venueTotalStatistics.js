/**
 * Created by dell on 2018/8/30.
 */

Vue.component('venue-total-statistics',function (resolve, reject) {
    GL.Http.load('./component/venueTotalStatistics/venueTotalStatistics.html',function (responseText) {
        resolve({
            template: responseText,
            props:['level','venueid'],
            data: function (){
                return {

                };
            },
            watch:{
                level:function (newl,old) {
                    // console.log("watched the new level value:"+newl);
                },
                venueid:function (newl,old) {
                    // console.log("watched the new venueid value:"+newl);
                    if(newl == ''){
                        this.queryTotalSuspectStatistics();
                    }
                }
            },
            methods:{
                queryTotalSuspectStatistics:function () {
                    var $this = this;
                    callApi($AllParams.interfaces.totalSuspectStatistics,{},function (response) {
                        if(response.flag && response.result!= null){
                            var result = response.result;
                            var suspectPersonList= result.suspectPersonList;
                            var nameList= result.nameList;
                            var suspectVehicleList= result.suspectVehicleList;
                            var suspectBaggageList= result.suspectBaggageList;
                            $this.initCharts(nameList,suspectPersonList,suspectVehicleList,suspectBaggageList);
                        }
                    })
                },
                initCharts:function (nameList,suspectPersonList,suspectVehicleList,suspectBaggageList) {
                    var color = ['#00e7ff','#646ef9','#d6b757'];
                    var veneuEchart = echarts.init(document.getElementById('venue-total-echarts'));
                    var option = {
                        color: color,
                        legend:{
                            textStyle:{
                                color:'#fff',
                                fontSize:14
                            }
                        },
                        tooltip:{
                            trigger: 'item',
                            formatter:'{a}:{c}'
                        },
                        textStyle:{
                            color: '#fff'
                        },
                        xAxis:{
                            axisLabel:{
                                interval:0,//横轴信息全部显示
                                rotate:-20,//-30度角倾斜显示
                                fontSize:'20'
                            },
                            data: nameList
                        },
                        yAxis:{
                            axisLabel:{
                                fontSize:'20'
                            },
                            splitLine:{
                                lineStyle: {
                                    type:'dashed',
                                    color:'#3b192f'
                                }
                            }
                        },
                        series:[{
                            name: 'Suspicious People',
                            type: 'bar',
                            barWidth: 17,
                            data:suspectPersonList
                        },{
                            name: 'Suspicious Vehicles',
                            type: 'bar',
                            barWidth: 17,
                            data:suspectVehicleList
                        },{
                            name: 'Suspicious Items',
                            type: 'bar',
                            barWidth: 17,
                            data:suspectBaggageList
                        }]
                    };
                    veneuEchart.setOption(option);
                }
            },
            mounted:function () {
                this.queryTotalSuspectStatistics();
            }
        })
    })
});