/**
 * Created by dell on 2018/8/30.
 */
var personCharts='';
Vue.component('trend-analysis',function (resolve, reject) {
    GL.Http.load('./component/trendAnalysis/trendAnalysis.html',function (responseText) {
        resolve({
            template: responseText,
            props:['level','venueid'],
            data: function (){
                return {
                    currentType: '',
                    currentSubType: 'trend-person-flow',
                    currentInterfaceType:'personTotalNumList',
                    zyn:'STATISTICSCYCLE_WEEK'
                };
            },
            methods:{
                changeTag:function (id) {
                    $('#'+id).addClass('trend-analysis-active').siblings().removeClass('trend-analysis-active');
                    $('.analysis-'+id).css('display','block').siblings().css("display",'none');
                    if(id=="trend-week"){
                        this.zyn="STATISTICSCYCLE_WEEK";
                    }else if(id=="trend-month"){
                        this.zyn="STATISTICSCYCLE_MONTH";
                    }else if(id=="trend-year"){
                        this.zyn="STATISTICSCYCLE_YEAR";
                    }
                    initlineCharts(this.currentInterfaceType,vue.currentLevel,this.zyn);
                },
                changeSubTag:function($event){
                    var el = $event.currentTarget;
                    $(el).addClass('trend-sub-active').siblings().removeClass('trend-sub-active');
                    this.currentSubType = $(el).attr('id');
                    if(this.currentSubType=="trend-person-flow"){
                        this.currentInterfaceType='personTotalNumList';
                    }else if(this.currentSubType=="trend-allow-person"){
                        this.currentInterfaceType='personCheckNumList';
                    }else if(this.currentSubType=="trend-doubt-person"){
                        this.currentInterfaceType='personSusNumList';
                    }else if(this.currentSubType=="trend-car-flow"){
                        this.currentInterfaceType='vehicleTotalNumList';
                    }else if(this.currentSubType=="trend-allow-car"){
                        this.currentInterfaceType='vehicleCheckNumList';
                    }else if(this.currentSubType=="trend-doubt-car"){
                        this.currentInterfaceType='vehicleSusNumList';
                    }
                    initlineCharts(this.currentInterfaceType,vue.currentLevel,this.zyn);
                }
            },
            mounted:function () {
                /*setInterval(function () {
                    var currentInterfaceType = this.currentInterfaceType;
                    var currentLevel = this.level;
                    var zyn = 'STATISTICSCYCLE_WEEK';
					initlineCharts(currentInterfaceType,currentLevel,zyn);
				}.bind(this),300000)*/
                    /*var $currentInterfaceType = this.currentInterfaceType;
                    callApi($AllParams.interfaces.IntelligentEntrySevendayTrendStatistics, [], function (weekdata) {
                        var datelist = weekdata.result.dateList;
                        var color = ['#00ffff', '#616f09', '#f8ae00', '#0095db'];
                        personCharts = echarts.init(document.getElementById('trend-week-echarts'));
                        var personOption = {
                            tooltip: {
                                trigger: 'axis',
                                formatter: '{c}',
                                /!*
                                 b -- 类目名（可以理解为x轴信息）
                                 a--系列名字（理解为y轴对应的name属性）
                                 c--数值（理解为y轴对应的数据）
                                 *!/
                                backgroundColor: 'transparent',
                                textStyle: {
                                    color: "#ffd683",
                                    fontSize: 40,
                                }

                            },
                            grid: {
                                left: '10%',
                                right: '10%',
                                bottom: '15%',
                                top: '1%',
                                containLabel: false
                            },
                            xAxis: [
                                {
                                    axisPointer: {lineStyle: {width: 0}},
                                    type: 'category',
                                    //axisLine: {onZero: true},   //x轴是不是显示在y=0处
                                    boundaryGap: false,
                                    data: datelist,
                                    axisLabel: {
                                        show: true,
                                        textStyle: {
                                            color: 'white',
                                            fontSize: 25
                                        }
                                    }
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    show: false,     //是否显示Y轴
                                    axisLabel: {
                                        show: true,
                                        textStyle: {
                                            color: 'white'
                                        }
                                    }
                                }

                            ],
                            series: [

                                {
                                    name: '',
                                    type: 'line',
                                    stack: '',
                                    symbolSize: 15,
                                    symbol: "circle",    //默认是空心圆（中间是白色的），改成实心圆
                                    label: {
                                        normal: {
                                            textStyle: {
                                                fontSize: "50",
                                                fontWeight: "normal",
                                            }
                                        }
                                    },

                                    areaStyle: {
                                        normal: {
                                            color: new echarts.graphic.LinearGradient(
                                                0, 0, 0, 1,
                                                [
                                                    {offset: 0, color: '#5D478B'},   //控制域颜色渐变

                                                    {offset: 1, color: 'black'}
                                                ]
                                            )
                                        }
                                    },
                                    itemStyle: {
                                        normal: {

                                            lineStyle: {
                                                color: '#ffd683'      //线的颜色
                                            },
                                            color: "#ffd683"

                                        }
                                    },
                                    data: weekdata.result[$currentInterfaceType]
                                }
                            ]
                        };
                        personCharts.setOption(personOption);
                    })*/
            }
        })
    })
});

function initlineCharts(currentInterfaceType,currentLevel,zyn) {
    if(zyn==""||zyn==null){
        zyn="STATISTICSCYCLE_WEEK";
    }
    var $currentInterfaceType =currentInterfaceType;
    var $currentLevel=currentLevel;
    if($currentLevel=="LEVEL_TWO") {
        callApi($AllParams.interfaces.IntelligentEntrySevendayTrendStatistics,[],function(weekdata){
            // console.info(weekdata);
            var datelist=weekdata.result.dateList;
            if($currentInterfaceType=="personTotalNumList"||$currentInterfaceType=="personCheckNumList"||$currentInterfaceType=="personSusNumList"){
                var sumlist=weekdata.result.personTotalNumList;
                $("#count_title").html("Weekly Total Amount (People):");
            }else if($currentInterfaceType=="vehicleTotalNumList"||$currentInterfaceType=="vehicleCheckNumList"||$currentInterfaceType=="vehicleSusNumList"){
                var sumlist=weekdata.result.vehicleTotalNumList;
                $("#count_title").html("Weekly Total Amount (Vehicles):");
            }
            var sum=0;
            for(var j=0;j<sumlist.length;j++){
                sum+=sumlist[j];
            }
            $("#people-week-sum").html(sum);
            /*for(var i=0;i<datelist.length;i++){
                datelist[i]=datelist[i].substring(5,10).replace("-","");
            }*/
            var color = ['#00ffff','#616f09','#f8ae00','#0095db'];
            personCharts = echarts.init(document.getElementById('trend-week-echarts'));
            var personOption = {
                tooltip: {
                    trigger: 'axis',
                    formatter: '{c}',
                    /*
                     b -- 类目名（可以理解为x轴信息）
                     a--系列名字（理解为y轴对应的name属性）
                     c--数值（理解为y轴对应的数据）
                     */
                    backgroundColor: 'transparent',
                    textStyle: {
                        color: "#ffd683",
                        fontSize: 40,
                    }

                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '15%',
                    top: '1%',
                    containLabel: false
                },
                xAxis: [
                    {
                        axisPointer: {lineStyle: {width: 0}},
                        type: 'category',
                        //axisLine: {onZero: true},   //x轴是不是显示在y=0处
                        boundaryGap: false,
                        data: datelist,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white',
                                fontSize: 18,
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        show: false,     //是否显示Y轴
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white'
                            }
                        }
                    }

                ],
                series: [

                    {
                        name: '',
                        type: 'line',
                        stack: '',
                        symbolSize: 15,
                        symbol: "circle",    //默认是空心圆（中间是白色的），改成实心圆
                        label: {
                            normal: {
                                textStyle: {
                                    fontSize: "50",
                                    fontWeight: "normal",
                                }
                            }
                        },

                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#5D478B'},   //控制域颜色渐变

                                        {offset: 1, color: 'black'}
                                    ]
                                )
                            }
                        },
                        itemStyle: {
                            normal: {

                                lineStyle: {
                                    color: '#ffd683'      //线的颜色
                                },
                                color: "#ffd683"

                            }
                        },
                        data: weekdata.result[$currentInterfaceType]
                    }
                ]
            };
            personCharts.setOption(personOption);
            showYuanTip();

            if($currentInterfaceType=="")
            $("#")
        })
    }
    else if($currentLevel=="LEVEL_THREE"){
        callApi($AllParams.interfaces.checkstationTrendStatistics,{"statisticsCycle": zyn},function(data){
            // console.info(data);
            var mark="";
            if($currentInterfaceType=="personTotalNumList"||$currentInterfaceType=="personCheckNumList"||$currentInterfaceType=="personSusNumList"){
                var sumlist=data.result.personTotalNumList;
                // $("#count_title").html("本周人员总数:");
                mark="person";
            }else if($currentInterfaceType=="vehicleTotalNumList"||$currentInterfaceType=="vehicleCheckNumList"||$currentInterfaceType=="vehicleSusNumList"){
                var sumlist=data.result.vehicleTotalNumList;
                // $("#count_title").html("本周车辆总数:");
                mark="vehicle";
            }
            var sum=0;
            for(var j=0;j<sumlist.length;j++){
                sum+=sumlist[j];
            }
            $("#people-week-sum").html(sum);
            var datelist = data.result.dateList;
            if (zyn=="STATISTICSCYCLE_WEEK"){
                /*for (var i = 0; i < datelist.length; i++) {
                    datelist[i] = datelist[i].substring(5, 10).replace("-", "");
                }*/
                personCharts = echarts.init(document.getElementById('trend-week-echarts'));
                if(mark=="person"){
                    $("#count_title").html("Weekly Total Amount (People):");
                }else if(mark=="vehicle"){
                    $("#count_title").html("Weekly Total Amount (Vehicles):");
                }
            }else if (zyn=="STATISTICSCYCLE_MONTH"){
                /*for (var i = 0; i < datelist.length; i++) {
                    datelist[i] = datelist[i].substring(5, 10).replace("-", "");
                }*/
                personCharts = echarts.init(document.getElementById('trend-month-echarts'));
                if(mark=="person"){
                    $("#count_title").html("Monthly Total Amount (People):");
                }else if(mark=="vehicle"){
                    $("#count_title").html("Monthly Total Amount (Vehicles):");
                }
            }else if (zyn=="STATISTICSCYCLE_YEAR"){
                /*for (var i = 0; i < datelist.length; i++) {
                    datelist[i] = datelist[i].substring(5);
                }*/
                personCharts = echarts.init(document.getElementById('trend-year-echarts'));
                if(mark=="person"){
                    $("#count_title").html("Yearly Total Amount (People):");
                }else if(mark=="vehicle"){
                    $("#count_title").html("Yearly Total Amount (Vehicles):");
                }
            }
            var color = ['#00ffff', '#616f09', '#f8ae00', '#0095db'];
            var personOption = {
                tooltip: {
                    trigger: 'axis',
                    formatter: '{c}',
                    /*
                     b -- 类目名（可以理解为x轴信息）
                     a--系列名字（理解为y轴对应的name属性）
                     c--数值（理解为y轴对应的数据）
                     */
                    backgroundColor: 'transparent',
                    textStyle: {
                        color: "#ffd683",
                        fontSize: 40,
                    }

                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '15%',
                    top: '1%',
                    containLabel: false
                },
                xAxis: [
                    {
                        axisPointer: {lineStyle: {width: 0}},
                        type: 'category',
                        //axisLine: {onZero: true},   //x轴是不是显示在y=0处
                        boundaryGap: false,
                        data: datelist,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white',
                                fontSize: 18,
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        show: false,     //是否显示Y轴
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white'
                            }
                        }
                    }

                ],
                series: [

                    {
                        name: '',
                        type: 'line',
                        stack: '',
                        symbolSize: 15,
                        symbol: "circle",    //默认是空心圆（中间是白色的），改成实心圆
                        label: {
                            normal: {
                                textStyle: {
                                    fontSize: "50",
                                    fontWeight: "normal",
                                }
                            }
                        },

                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#5D478B'},   //控制域颜色渐变

                                        {offset: 1, color: 'black'}
                                    ]
                                )
                            }
                        },
                        itemStyle: {
                            normal: {

                                lineStyle: {
                                    color: '#ffd683'      //线的颜色
                                },
                                color: "#ffd683"

                            }
                        },
                        data: data.result[$currentInterfaceType]
                    }
                ]
            };
            personCharts.setOption(personOption);
        })
    }


}

//获取折线图点位坐标
function getMarkPoints() {
    var curTempSeries = personCharts.getModel().getSeries()[0];
    for (var i in curTempSeries) {
        if (i.indexOf('ec_') > -1 && i.indexOf('data') > -1 && i.indexOf('Before') < 0) {
            return curTempSeries[i]._itemLayouts;
        }
    }
    return '';
}


//产生周对应的圆
function makeWeekYuan(index) {
    var xingQi = ['一', '二', '三', '四', '五', '六', '七'];
    var yuan = "<li id='modle4L_ul_li" + index + "'><div class='outWeekYuan outYuan' onmouseout='outYuanOut(this)'  onmouseover ='outYuanOver(this)'><div class='innerWeekYuan innerYuan'><span class='weekYuanSpan'>" + xingQi[index] + "</span></div><div id='modle4L_ul_li_shuxian" + index + "' class='shuxian'></div></div></li>"
    return yuan;
}
//产生年对应的圆
function makeYearYuan(index) {
    var yuan = "<li id='modle4L_ul_li" + index + "'><div class='outYearYuan outYuan' onmouseout='outYuanOut(this)' onmouseover='outYuanOver(this)'><div class='innerYearYuan innerYuan'><span class='YearYuanSpan'>" + (index + 1) + "</span></div><div id='modle4L_ul_li_shuxian" + index + "' class='shuxian'></div></div></li>"
    return yuan;
}
//产生月对应的圆
function makeMonthYuan(index) {
    var yuan = "<li id='modle4L_ul_li" + index + "'><div class='outMonthYuan outYuan' onmouseout='outYuanOut(this)' onmouseover='outYuanOver(this)'><div class='innerMonthYuan innerYuan'><span class='monthYuanSpan'>" + (index + 1) + "</span></div><div id='modle4L_ul_li_shuxian" + index + "' class='shuxian'></div></div></li>"
    return yuan;
}


function showYuanTip() {
    var points = getMarkPoints();

    var allYuan = "";

    if (rgbToHex($("#weekL").css("color")) == "#ffffff") {
        for (var i = 0; i < points.length; i++) {
            allYuan = allYuan + makeWeekYuan(i);
        }
        $("#modle4L_ul").html(allYuan);

        //圆的位置
        var lastpoint = 0;
        for (var i = 0; i < points.length; i++) {
            var point = points[i][0];
            if (i == 0) {
                $("#modle4L_ul_li" + i).css("margin-left", (point - 50) + "px");
            } else {
                $("#modle4L_ul_li" + i).css("margin-left", (point - lastpoint - 100) + "px");
            }
            lastpoint = point;
        }


        //竖线的位置和大小
        var o = document.getElementById("modle4L");
        var h = o.offsetHeight; //高度

        var marginTop = $("#modle4L_ul_li0  .outYuan").css("margin-top");    //0px
        var idx = marginTop.indexOf('p');
        marginTop = marginTop.substr(0, idx);

        for (var i = 0; i < points.length; i++) {
            var lw = points[i][0];
            var lh = points[i][1];

            $("#modle4L_ul_li_shuxian" + i).css("height", (h - marginTop - 80 + lh - 10) + 'px');
            $("#modle4L_ul_li_shuxian" + i).css("margin-left", "47px")
        }


    }
    else if (rgbToHex($("#monthL").css("color")) == "#ffffff") {
        for (var i = 0; i < points.length; i++) {
            allYuan = allYuan + makeMonthYuan(i);
        }
        $("#modle4L_ul").html(allYuan);

        var lastpoint = 0;

        for (var i = 0; i < points.length; i++) {
            var point = points[i][0];
            if (i == 0) {
                $("#modle4L_ul_li" + i).css("margin-left", (point - 20) + "px");
            } else {
                $("#modle4L_ul_li" + i).css("margin-left", (point - lastpoint - 40) + "px");
            }
            lastpoint = point;
        }

        //竖线的位置和大小
        var o = document.getElementById("modle4L");
        var h = o.offsetHeight; //高度
        var marginTop = $("#modle4L_ul_li0  .outYuan").css("margin-top");
        var idx = marginTop.indexOf('p');
        marginTop = marginTop.substr(0, idx);
        //  console.info("marginTop:"+marginTop)

        for (var i = 0; i < points.length; i++) {
            var lw = points[i][0];
            var lh = points[i][1];
            // console.info("lh:"+lh);

            $("#modle4L_ul_li_shuxian" + i).css("height", (h - marginTop - 40 + lh - 5) + 'px');
            $("#modle4L_ul_li_shuxian" + i).css("margin-left", "17px")
        }

    }
    else if (rgbToHex($("#yearL").css("color")) == "#ffffff") {
        for (var i = 0; i < points.length; i++) {
            allYuan = allYuan + makeYearYuan(i);
        }
        $("#modle4L_ul").html(allYuan);

        var lastpoint = 0;

        for (var i = 0; i < points.length; i++) {
            var point = points[i][0];
            if (i == 0) {
                $("#modle4L_ul_li" + i).css("margin-left", (point - 50) + "px");
            } else {
                $("#modle4L_ul_li" + i).css("margin-left", (point - lastpoint - 100) + "px");
            }
            lastpoint = point;
        }

        //竖线的位置和大小
        var o = document.getElementById("modle4L");
        var h = o.offsetHeight; //高度
        var marginTop = $("#modle4L_ul_li0  .outYuan").css("margin-top");
        var idx = marginTop.indexOf('p');
        marginTop = marginTop.substr(0, idx);
        // console.info("marginTop:"+marginTop)

        for (var i = 0; i < points.length; i++) {
            var lw = points[i][0];
            var lh = points[i][1];
            //    console.info("lh:"+lh);

            $("#modle4L_ul_li_shuxian" + i).css("height", (h - marginTop - 80 + lh - 10) + 'px');
            $("#modle4L_ul_li_shuxian" + i).css("margin-left", "47px")
        }

    }

}

//鼠标移动到相应位置显示 外圆和竖线
function outYuanOver(t) {
    $(t).css("border-color", "#F1A053");
    $(t).children("div").eq(1).css("border-color", "#F1A053");

    if (rgbToHex($("#weekL").css("color")) == "#ffffff") {
        var days = ['一', '二', '三', '四', '五', '六', '七'];

        var nums = [0, 1, 2, 3, 4, 5, 6];

        var num = $(t).find("div:eq(0) span:eq(0)").text();
        for (var i = 0; i < 7; i++) {
            if (num == days[i]) {
                leftViewData.lineChart.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 0,
                        dataIndex: nums[i]
                    }
                );
            }
        }

    }
    else if (rgbToHex($("#monthL").css("color")) == "#ffffff" || rgbToHex($("#yearL").css("color")) == "#ffffff") {
        var num = $(t).find("div:eq(0) span:eq(0)").text();

        leftViewData.lineChart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: num - 1
            }
        );

    }
}

//鼠标移出相应位置隐藏 外圆和竖线
function outYuanOut(t) {
    $(t).css("border-color", "transparent");
    $(t).children("div").eq(1).css("border-color", "transparent");

    if (rgbToHex($("#weekL").css("color")) == "#ffffff") {
        var days = ['一', '二', '三', '四', '五', '六', '七'];

        var nums = [0, 1, 2, 3, 4, 5, 6];

        var num = $(t).find("div:eq(0) span:eq(0)").text();
        for (var i = 0; i < 7; i++) {
            if (num == days[i]) {
                leftViewData.lineChart.dispatchAction({
                        type: 'hideTip',
                        seriesIndex: 0,
                        dataIndex: nums[i]
                    }
                );
            }
        }

    } else if (rgbToHex($("#monthL").css("color")) == "#ffffff" || rgbToHex($("#yearL").css("color")) == "#ffffff") {
        var num = $(t).find("div:eq(0) span:eq(0)").text();

        leftViewData.lineChart.dispatchAction({
                type: 'hideTip',
                seriesIndex: 0,
                dataIndex: num - 1
            }
        );

    }
}

//RGB颜色转换16进制颜色
function rgbToHex(rgb) {
    var that = rgb;
    //十六进制颜色值的正则表达式
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是rgb颜色表示
    if (/^(rgb|RGB)/.test(that)) {
        var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        var strHex = "#";
        for (var i = 0; i < aColor.length; i++) {
            var hex = Number(aColor[i]).toString(16);
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = that;
        }
        return strHex;
    } else if (reg.test(that)) {
        var aNum = that.replace(/#/, "").split("");
        if (aNum.length === 6) {
            return that;
        } else if (aNum.length === 3) {
            var numHex = "#";
            for (var i = 0; i < aNum.length; i += 1){
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    }
    return that;
}