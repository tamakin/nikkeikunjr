var log = function(key, val){ console.log(key+" : "+val); }
var default_interval = 1;
var default_notify = 3000;
var interval = default_interval;
var notify = default_notify;
var holiday;
var template = "%YYYY%/%MM%/%DD%";

function getSetting() {
  interval = localStorage["interval"];
  if(interval == null) {
    interval = default_interval;
    localStorage["interval"] = interval;
  }
  interval = parseInt(interval);

  notify = localStorage["notify"];
  if(notify == null) {
    notify = default_notify;
    localStorage["notify"] = notify;
  }
  notify = parseInt(notify);

  var date = new Date();
  var year = date.getFullYear();
  getHoliday(year, function() {
    var today = new Date();
    log("today", today);
    var mydate = template.evaluate({YYYY:today.getFullYear(), MM:today.getMonth(), DD:today.getDate()});
    var res1 = isHoliday(mydate);
    log("isHoliday", res1);
    var res2 = isWeekEnd(today);
    log("isWeekEnd", res2);
    localStorage["isStocksHoliday"] = res1 || res2;
  });
}


// http://kaathemachine.com/javascript/2011/04/06/%E3%83%A1%E3%83%B3%E3%83%86%E3%83%8A%E3%83%B3%E3%82%B9%E3%83%95%E3%83%AA%E3%83%BC%E3%81%A7%E7%A5%9D%E6%97%A5%E4%B8%80%E8%A6%A7%E3%82%92%E3%82%B2%E3%83%83%E3%83%88%E3%83%B3/
String.prototype.evaluate = function(o){return this.replace(/%([a-zA-Z0-9]+)%/g,function(m,$1){return o[$1];});}

var holiday_url = "http://www.google.com/calendar/feeds/outid3el0qkcrsuf89fltf7a4qbacgt9@import.calendar.google.com/public/full-noattendees?start-min=%YEAR%-01-01&start-max=%YEAR%-12-31&max-results=100&alt=json"
function getHoliday(year, callback) {
  if (localStorage["Holiday"] != null) {
    holiday = JSON.parse(localStorage["Holiday"]);
    if(callback) callback();
    return;
  }
  holiday = [];
  $.get(holiday_url.evaluate({YEAR:year}),function(r) {
    log("getHoliday", "in");
    $(r.feed.entry).each(function() {
      holiday.push({date:new Date(this.gd$when[0].startTime),name:this.title.$t});
    });
    holiday.sort(function(a,b){return a.date < b.date ? -1 : 1});
    localStorage["Holiday"] = JSON.stringify(holiday);
    if(callback) callback();
  });
}

function isHoliday(date) {
  var today = new Date();
  for (var i = 0; i < holiday.length; i++) {
    var val = new Date(holiday[i]["date"]);
    var mydate = template.evaluate({YYYY:val.getFullYear(), MM:val.getMonth(), DD:val.getDate()});
    if (mydate == date) return true;
  };
  return false;
}

function isWeekEnd(date) {
  var weekday = date.getDay();
  if (weekday == 0 || weekday == 6) return true;
  var hour = date.getHours();
  if (hour >= 9 && hour < 15) return false;
  return true;
}
