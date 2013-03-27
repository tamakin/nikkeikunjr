//http://blog.monoweb.info/blog/2012/11/08/chrome-event-pages/
$(function() {
  getSetting();
  log("interval", interval);
  log("notify", notify);
});

chrome.runtime.onInstalled.addListener(function() {
  chrome.runtime.getBackgroundPage(function() { background(true) });
});

function Timer(callback) {
  var timerId;
  var start = function() {
    if(timerId !== null) {
      getSetting();
      callback()
      log("Timer", "start")
      timerId = setTimeout(start, interval * 1000 * 60);
    }
  };
  start();
  return function() {
    if(timerId !== null) {
      log("Timer", "stop")
      clearTimeout(timerId);
      timerId = null;
    }
  }
}

var timer;
function background(mode) {
  if (mode) {
    timer = Timer(getNikkei);
  } else {
    timer.stop();
  }
}

function getNikkei() {
  var colors = [
    [0, 0, 255, 255],
    [255, 0, 0, 255]
  ];
  log("getNikkei", "in");
  $.ajax({
    url: "http://indexes.nikkei.co.jp/nkave",
    type: 'GET',
  }).then(
    function(res){
      var $data = $(res);
      var $price = $data.find(".cmn-index_value");
      var price = $price.text().trim();
      log("price", price);
      var change = $data.find(".cmn-index_border")[1].innerHTML;
      var permatch = change.match(/<b>(.*)\((.*)%\)<\/b>/);
      var per1 = parseFloat(permatch[1]);
      var per2 = parseFloat(permatch[2]);
      var delay = $data.find(".ttl-01").text();
      log("delay", delay);
      log("per1", per1);
      log("per2", per2);
      var per = "前日比 : " + per1 + " (" + per2 + "%)"
      chrome.browserAction.setBadgeText({text : per2.toString()});
      chrome.browserAction.setBadgeBackgroundColor({color : per2 >= 0 ? colors[1] : colors[0]})
      chrome.browserAction.setTitle({title : delay + "\r\n" + price + " " + per});

      var color = per2 >= 0 ? "red" : "blue";
      var notification = window.webkitNotifications.createHTMLNotification(
        chrome.extension.getURL("popup.html?price=" + encodeURI(price)
                               + "&per=" + encodeURI(per)
                               + "&delay=" + encodeURI(delay)
                               + "&color=" + encodeURI(color)
                               )
      );
      notification.ondisplay = function(){
        setTimeout(function(){ notification.cancel(); }, notify);
      }
      notification.show();
    },
    function(res){
      chrome.browserAction.setBadgeText({text : "NG"});
      chrome.browserAction.setBadgeBackgroundColor({color : colors[1] })
      console.log(res)
    }
  );

}
