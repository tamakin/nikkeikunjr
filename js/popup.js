$(function() {
  $("#delay").text($.url().param("delay"));
  $("#stock").text($.url().param("price") + " " + $.url().param("per"));
  $("body").css("background-color", $.url().param("color"));
  $("body").css("color", "white");
  $("body").css("font-size", "80%");
});
