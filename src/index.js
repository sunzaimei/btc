import * as Highcharts from 'highcharts';
import dailyForecast from './data';
import dailyForecastSent from './data2';

(function(){
    let isShiftPressed=false;
    let lastPressed=null;
    function shiftPressed(){
      if(isShiftPressed){
        return;
      }
      const now=new Date();
      if((!lastPressed)||(now.getTime()-lastPressed.getTime())>1000){
        lastPressed=new Date();
      }else{
        isShiftPressed=true;
      }
    }
    document.addEventListener('keydown',function(event){
      if(event.keyCode===16){
        shiftPressed();
      }
    });
    (res => {
        const res_sorted=res.sort((left,right)=>{
          if(left.time==right.time){
            return 0;
          }
          return left.time<right.time?-1:1
        });
        const length=res_sorted.length;
        
        const maxLength=Math.floor(length*0.7);

        const res_sorted_history=res_sorted.slice(0,maxLength);
        const res_sorted_future=res_sorted.slice(maxLength);

        
        const realPriceSerise=res_sorted_history.map(item=>[item.time,item.true_price]);
        const predicatdPriceSerice=res_sorted_history.map(item=>[item.time,item.predicted_price]);
        
        Highcharts.chart('canvas', {
          chart: {
              zoomType: 'x',
              events: {
                load: function(){
                  var series=this.series[0];
                  setInterval(()=>{
                    if(res_sorted_future.length===0||!isShiftPressed){
                      return;
                    }
                    for(let i=0;i<10;i++){
                      if(res_sorted_future.length===0){
                        break;
                      }
                      const data=res_sorted_future.shift();
                      const data1=[data.time,data.true_price];
                      const data2=[data.time,data.predicted_price];
                      this.series[0].addPoint(data1,false,true)
                      this.series[1].addPoint(data2,false,true)
                    }
                    this.redraw();
                  },1000);
                }
              },
          },
          title: {
              text: 'Bitcoin price prediction vs Real price'
          },
          subtitle: {
              text: document.ontouchstart === undefined ?
                      'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
          },
          xAxis: {
              type: 'datetime'
          },
          yAxis: {
              title: {
                  text: 'Bitcoin Price (USD)'
              }
          },
          legend: {
              enabled: true
          },
          plotOptions: {
              series: {
                  marker: {
                      radius: 3
                  },
                  lineWidth: 1,
                  states: {
                      hover: {
                          lineWidth: 1
                      }
                  },
                  threshold: null
              }
          },
          series: [{
            type: 'area',
            name: 'Real Price',
            data: realPriceSerise,
            fillColor: {
                      linearGradient: {
                          x1: 0,
                          y1: 0,
                          x2: 0,
                          y2: 1
                      },
                      stops: [
                          [0, Highcharts.getOptions().colors[0]],
                          [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                      ]
                  },
          },{
            // type: 'scatter',
            name: 'Predicated Price',
            data: predicatdPriceSerice,
            color: '#FD3412'
          }]
        //   series: [{
        //       type: 'area',
        //       name: 'True Price',
        //       data: [time,true_price]
        //   },{
        //     type: 'area',
        //     name: 'Predicted Price',
        //     data: [time,predicted_price]
        // }]
      });
  })(dailyForecast);

  (res => {
    const res_sorted=res.sort((left,right)=>{
      if(left.time==right.time){
        return 0;
      }
      return left.time<right.time?-1:1
    });
    const length=res_sorted.length;
    
    const maxLength=Math.floor(length*0.7);

    const res_sorted_history=res_sorted.slice(0,maxLength);
    const res_sorted_future=res_sorted.slice(maxLength);

    
    const sentimentSeries=res_sorted_history.map(item=>[item.time,item.sentiment]);
    const priceSeries=res_sorted_history.map(item=>[item.time,item.price]);
    
    Highcharts.chart('canvas2', {
      chart: {
          zoomType: 'x',
          events: {
            load: function(){
              var series=this.series[0];
              setInterval(()=>{
                if(res_sorted_future.length===0||!isShiftPressed){
                  return;
                }
                for(let i=0;i<10;i++){
                  if(res_sorted_future.length===0){
                    break;
                  }
                  const data=res_sorted_future.shift();
                  const data1=[data.time,data.sentiment];
                  const data2=[data.time,data.price];
                  this.series[0].addPoint(data1,false,true)
                  this.series[1].addPoint(data2,false,true)
                }
                this.redraw();
              },1000);
            }
          },
      },
      title: {
          text: 'Bitcoin price vs Sentiment from twitter'
      },
      subtitle: {
          text: document.ontouchstart === undefined ?
                  'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
      },
      xAxis: {
          type: 'datetime'
      },
      yAxis: {
          title: {
              text: 'Bitcoin Price vs Sentiment (Scaled)'
          }
      },
      legend: {
          enabled: true
      },
      plotOptions: {
          series: {
              marker: {
                  radius: 3
              },
              lineWidth: 1,
              states: {
                  hover: {
                      lineWidth: 1
                  }
              },
              threshold: null
          }
      },
      series: [{
        type: 'area',
        name: 'Bitcoin Price',
        data: sentimentSeries,
        fillColor: {
                  linearGradient: {
                      x1: 0,
                      y1: 0,
                      x2: 0,
                      y2: 1
                  },
                  stops: [
                      [0, Highcharts.getOptions().colors[0]],
                      [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                  ]
              },
      },{
        // type: 'scatter',
        name: 'Twitter Sentiment',
        data: priceSeries,
        color: '#FD3412'
      }]
    //   series: [{
    //       type: 'area',
    //       name: 'True Price',
    //       data: [time,true_price]
    //   },{
    //     type: 'area',
    //     name: 'Predicted Price',
    //     data: [time,predicted_price]
    // }]
  });
})(dailyForecastSent);
})();
