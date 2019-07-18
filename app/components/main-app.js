import Component from '@ember/component';
import { get, set } from '@ember/object';
import cleanArray from '../utils/array';

export default Component.extend({

  selected: 'latlong',

  apiKey: '8c598ad4edbe6f22a7831932000c4a61',

  apiUrl: 'http://api.openweathermap.org/data/2.5/weather', // "/assets/forecast.json",

  lat: 0,

  lon: 0,

  charts: {
    temperature: {
      chartOptions: null,
      chartData: []
    },
    pressure: {
      chartOptions: null,
      chartData: []
    },
    humidity: {
      chartOptions: null,
      chartData: []
    }
  },

  chartData: null,

  chartOptions: {
    chart: {
        type: 'line'
    },
    subtitle: {
        text: 'Source: OpenWeatherMap.com'
    },
    xAxis: {
      title: {
          text: 'Month'
      },
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
        title: {
            text: 'Level'
        }
    },
    plotOptions: {
        line: {
            dataLabels: {
                enabled: true
            },
            enableMouseTracking: true
        }
    }
  },

  theme: {
    colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
             '#FF9655', '#FFF263', '#6AF9C4'],
    chart: {
        backgroundColor: {
            linearGradient: [0, 0, 500, 500],
            stops: [
                [0, 'rgb(255, 255, 255)'],
                [1, 'rgb(240, 240, 255)']
            ]
        },
    },
    title: {
        style: {
            color: '#000',
            font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
        }
    },
    subtitle: {
        style: {
            color: '#666666',
            font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
        }
    },

    legend: {
        itemStyle: {
            font: '9pt Trebuchet MS, Verdana, sans-serif',
            color: 'black'
        },
        itemHoverStyle:{
            color: 'gray'
        }
    },


  },

  init() {
    this._super(...arguments);

    set(this, 'charts.temperature.chartOptions', get(this, 'chartOptions'));
    set(this, 'charts.temperature.chartOptions.title', 'Temperature');
    set(this, 'charts.temperature.chartData', []);

    set(this, 'charts.pressure.chartOptions', get(this, 'chartOptions'));
    set(this, 'charts.pressure.chartOptions.title', 'Pressure');
    set(this, 'charts.pressure.chartData', []);

    set(this, 'charts.humidity.chartOptions', get(this, 'chartOptions'));
    set(this, 'charts.humidity.chartOptions.title', 'Humidity');
    set(this, 'charts.humidity.chartData', []);
  },

  processWeatherData(data) {

    let avgTemps = [];
    let avgPressures = [];
    let avgHumidities = [];
    const defaultDataItem = { x: 0, y: 0}

    data.list && data.list.forEach((item) => {
      const { temp, humidity, pressure } = item.main;

      // Create monthly averages
      let date = item.dt_txt.split("-");

      // Note: parseInt(date[1] is the month value
      let month = parseInt(date[1]);

      avgTemps[month] = (avgTemps[month] + temp) || 0;
      avgPressures[month] = (avgPressures[month] + pressure) || 0;
      avgHumidities[month] = (avgHumidities[month] + humidity) || 0;
    });

    avgTemps.forEach( (item) => {
      item = item / (data.list.length + 1);
    });

    avgPressures.forEach( (item) => {
      item = item / (data.list.length + 1);
    });

    avgHumidities.forEach( (item) => {
      item = item / (data.list.length + 1);
    });

    set(this, 'charts.temperature.chartData', [defaultDataItem]);

    set(this, 'charts.temperature.chartData',
      [{
        name: "Temperature",
        data: cleanArray(avgTemps)
      }]
    );

    set(this, 'charts.pressure.chartData', [defaultDataItem]);

    set(this, 'charts.pressure.chartData',
      [{
        name: "Pressure",
        data: cleanArray(avgPressures)
      }]
    );

    set(this, 'charts.humidity.chartData', [defaultDataItem]);

    set(this, 'charts.humidity.chartData',
      [{
        name: "Humidity",
        data: cleanArray(avgHumidities)
      }]
    );

  },

  actions: {
    fetchData() {
      const selected = get(this, "selected");
      const apiUrl = get(this, "apiUrl");
      const apiKey = get(this, "apiKey");
      const data = {
        lat: get(this, 'lat'),
        lon: get(this, 'lon')
      };

      const makeRequest = async(data) => {

        let url = `${apiUrl}&APPID=${apiKey}`;

        if (data.lat != null) {
          url += '&lat=${data.lat}';
        }

        if (data.lon != null) {
          url += '&lat=${data.lon}';
        }

        const response = await fetch(url);

          const responseData = await response.json();

          this.processWeatherData(responseData);
        }

        makeRequest(data);

    }

}});
