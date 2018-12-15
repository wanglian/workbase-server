import './message-day-chart.html';

import Chart from 'chart.js';
import moment from 'moment';

Template.MessageDayChart.onRendered(function() {
  let days = moment().endOf("month").date();
  Meteor.call("getChartDay", (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
      new Chart($('#message-day-chart'), {
        type: 'bar',
        data: {
          labels: Array.from(Array(days).keys()).map(i => i+1),
          datasets: [{
            label: '内部',
            data: res["internal"],
            backgroundColor: 'rgba(200, 200, 200, 0.8)',
            borderWidth: 1
          }, {
            label: '发出',
            data: res["outgoing"],
            backgroundColor: 'rgba(0, 0, 255, 0.8)',
            borderWidth: 1
          }, {
            label: '接收',
            data: res["incoming"],
            backgroundColor: 'rgba(0, 128, 0, 0.8)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            xAxes: [{
              stacked: true
            }],
            yAxes: [{
              stacked: true,
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    }
  });

  Meteor.call("getCharHour", (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
      new Chart($('#message-hour-chart'), {
        type: 'bar',
        data: {
          labels: Array.from(Array(24).keys()).map(i => i+1),
          datasets: [{
            label: '内部',
            data: res["internal"],
            backgroundColor: 'rgba(200, 200, 200, 0.8)',
            borderWidth: 1
          }, {
            label: '发出',
            data: res["outgoing"],
            backgroundColor: 'rgba(0, 0, 255, 0.8)',
            borderWidth: 1
          }, {
            label: '接收',
            data: res["incoming"],
            backgroundColor: 'rgba(0, 128, 0, 0.8)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            xAxes: [{
              stacked: true
            }],
            yAxes: [{
              stacked: true,
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    }
  });
});