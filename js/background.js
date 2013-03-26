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
    [0, 255, 0, 255],
    [255, 0, 0, 255]
  ];
  log("getNikkei", "in");
  $.ajax({
    url: "http://stocks.finance.yahoo.co.jp/stocks/detail/?code=998407.O",
    type: 'GET',
  }).then(
    function(res){
      var $data = $(res);
      var $price = $data.find(".stoksPrice")[1];
      var price = $price.innerHTML;
      var change = $data.find(".yjMSt").text();
      var per = parseFloat(change.match(/(.*)（(.*)%）/)[2]);
      var delay = $data.find(".real").text();
      var real = $data.find(".real span").text();
      delay = delay.replace(real, "");
      chrome.browserAction.setBadgeText({text : per.toString()});
      chrome.browserAction.setBadgeBackgroundColor({color : per >= 0 ? colors[0] : colors[1]})
      chrome.browserAction.setTitle({title : price});
      log("price", price);
      log("per", per);

      var color = per >= 0 ? "green" : "red";
      var notification = window.webkitNotifications.createHTMLNotification(
        chrome.extension.getURL("popup.html?price=" + encodeURI(price)
                               + "&per=" + encodeURI(changestr)
                               + "&delay=" + encodeURI(delay)
                               + "&real=" + encodeURI(real)
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
