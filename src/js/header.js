// Fixing the header on scroll
var body = $("#body");

body.on("scroll", function(e) {

  if (this.scrollTop > 50) {
    body.addClass("fix-header");
  } else {
    body.removeClass("fix-header");
  }

});
