import "./reports.html";

import Chart from "chart.js";
import moment from "moment";

const getDaylabels = (days) => {
  let date = moment();
  let result = [];
  while (days > 0) {
    result.unshift(date.format("MM-DD"));
    date = date.subtract(1, "days");
    days --;
  }
  return result;
};

Template.MessagesDailyChart.onRendered(function() {
  Meteor.call("getChartDay", (err, res) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(res);
      new Chart($("#message-day-chart"), {
        type: "bar",
        data: {
          labels: getDaylabels(res["internal"].length),
          datasets: [{
            label: I18n.t("message_internal"),
            data: res["internal"],
            backgroundColor: "rgba(200, 200, 200, 0.8)",
            borderWidth: 1
          }, {
            label: I18n.t("report_message_outgoing"),
            data: res["outgoing"],
            backgroundColor: "rgba(0, 0, 255, 0.8)",
            borderWidth: 1
          }, {
            label: I18n.t("report_message_incoming"),
            data: res["incoming"],
            backgroundColor: "rgba(0, 128, 0, 0.8)",
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
                beginAtZero: true,
                precision: 0
              }
            }]
          }
        }
      });
    }
  });
});

Template.MessagesHourlyChart.onRendered(function() {
  let days = moment().endOf("month").date();
  Meteor.call("getCharHour", (err, res) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(res);
      // UTC -> Local
      let offset = moment().utcOffset()/60;
      // console.log(offset);
      new Chart($("#message-hour-chart"), {
        type: "bar",
        data: {
          labels: _.range(1, 24),
          datasets: [{
            label: I18n.t("message_internal"),
            data: res["internal"],
            backgroundColor: "rgba(200, 200, 200, 0.8)",
            borderWidth: 1
          }, {
            label: I18n.t("report_message_outgoing"),
            data: res["outgoing"],
            backgroundColor: "rgba(0, 0, 255, 0.8)",
            borderWidth: 1
          }, {
            label: I18n.t("report_message_incoming"),
            data: res["incoming"],
            backgroundColor: "rgba(0, 128, 0, 0.8)",
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
                beginAtZero: true,
                precision: 0
              }
            }]
          }
        }
      });
    }
  });
});