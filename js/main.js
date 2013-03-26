var log = function(key, val){ console.log(key+" : "+val); }
var default_interval = 1;
var default_notify = 3000;
var interval = default_interval;
var notify = default_notify;
var timer;

function getSetting() {
  interval = localStorage["interval"];
  if(interval == null) {
    interval = default_interval;
    localStorage["interval"] = interval;
  }
  interval = parseInt(interval);
log("getSetting", interval);

  notify = localStorage["notify"];
  if(notify == null) {
    notify = default_notify;
    localStorage["notify"] = notify;
  }
  notify = parseInt(notify);
}
