import './message-day-chart.html';

import Chart from 'chart.js';
import moment from 'moment';

const rotateArray = (array, n) => {
  let a = _.clone(array);
  if (n === 0) return;
  if (n < 0) {
    _.times(-n, () => {
      a.push(a.shift());
    });
  } else {
    _.times(n, () => {
      a.unshift(a.pop());
    });
  }
  return a;
};

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
          labels: _.range(1, days),
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
      // UTC -> 本地时间
      let offset = moment().utcOffset()/60;
      // console.log(offset);
      new Chart($('#message-hour-chart'), {
        type: 'bar',
        data: {
          labels: _.range(1, 24),
          datasets: [{
            label: '内部',
            data: rotateArray(res["internal"], offset),
            backgroundColor: 'rgba(200, 200, 200, 0.8)',
            borderWidth: 1
          }, {
            label: '发出',
            data: rotateArray(res["outgoing"], offset),
            backgroundColor: 'rgba(0, 0, 255, 0.8)',
            borderWidth: 1
          }, {
            label: '接收',
            data: rotateArray(res["incoming"], offset),
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