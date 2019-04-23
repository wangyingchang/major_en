/**
 * Created by dell on 2018/9/5.
 */
Vue.component('venue-plan',function (resolve, reject) {
    GL.Http.load('./component/venuePlan/venuePlan.html',function (responseText) {
        resolve({
           template: responseText,
            props:['level','venueid'],
            data:function () {
                return {
                    columns:[
                        {
                            title:'Time',
                            key:'startTime'
                        },
                        {
                            title:'Match/Event',
                            key:'gameName'
                        },
                        {
                            title:'Head of Security',
                            key:'dutyPerson'
                        }
                    ],
                    data:[]
                }
            },
            watch:{
                level:function (newl,old) {
                    // console.log("watched the new level value:"+newl);
                },
                venueid:function (newl,old) {
                    // console.log("watched the new venueid value:"+newl);
                    if(this.venueid!= ''){
                       this.queryVenueGameInfo();
                    }
                }
            },
            methods:{
                queryVenueGameInfo:function () {
                    var $this = this;
                    var params = {};
                    params.venueId = this.venueid;
                    // params.venueId = 5;
                    callApi($AllParams.interfaces.venueGameInfo,params,function (response) {
                        if(response.flag && response.result != null){
                            $this.data = response.result;
                        }
                    })
                }
            },
            mounted:function(){
                this.data = [
                    {
                        time:'2018.09.06',
                        name:'决赛 法国VS德国',
                        charger:'张三'
                    },
                    {
                        time:'2018.09.06',
                        name:'决赛 法国1VS德国1',
                        charger:'李四'
                    },
                    {
                        time:'2018.09.06',
                        name:'决赛 法国2VS德国2',
                        charger:'王五'
                    },
                    {
                        time:'2018.09.06',
                        name:'决赛 法国3VS德国3',
                        charger:'张三'
                    }
                ]
            }
        })
    });
});