chrome.browserAction.setBadgeText({text : ""});
$(function() {
  chrome.extension.getBackgroundPage().getSetting();
  $("#interval").val(interval);
  $("#interval").change(function() {
    localStorage["interval"] = $(this).val();
    log("interval put", localStorage["interval"]);
  });
  $("#notify").val(notify);
  $("#notify").change(function() {
    localStorage["notify"] = $(this).val();
    log("notify put", localStorage["notify"]);
  });
});
