$(function() {
  $("#delay").text($.url().param("real") + " " + $.url().param("delay"));
  $("#stock").text($.url().param("price") + " " + $.url().param("per"));
  $("body").css("background-color", $.url().param("color"));
  $("body").css("color", "white");
});
