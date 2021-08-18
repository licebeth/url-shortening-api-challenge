$(".copy-button").click(function(){
  $(this).css("background-color","hsl(257, 27%, 26%)");
  $(this).text("Copied!");
  let textCopied = $(this).parent().find(".short-url p").text().trim();
  let $temp = $("<input>");
  $("body").append($temp);
  $temp.val(textCopied).select();
  document.execCommand("copy");
  $temp.remove();
});

$(".input-button").click(function(){
  let input = $(".input-field").val();
  if (input === "") {
    $(".input-field").addClass("input-not-valid");
    $(".input-warning").css("visibility", "visible");
  } else {
    $(".input-field").removeClass("input-not-valid");
    $(".input-warning").css("visibility", "hidden");
    $(".input-form").submit();
  }
})
