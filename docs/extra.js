/* 外部リンクは新規ウィンドウで開く */
$(function(){
  $("a[href^='http://']").attr("target","_blank");
  $("a[href^='https://']").attr("target","_blank");
});
