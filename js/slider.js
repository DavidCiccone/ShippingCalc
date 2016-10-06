var element = document.getElementById("menu-button").innerHTML;
var menuOut = 0;
$("#menu-button").click(function() {
  if (menuOut === 0){
     menuOut++;
      $("#menu").animate({
        "left": "-=280px"
      }, "slow");
      $("#menu-button").animate({
        "right": "-=0px"
      }, "slow");
    element = "-";
  }else if(menuOut === 1){
      menuOut--;
      $("#menu").animate({
        "left": "+=280px"
      }, "slow");
      $("#menu-button").animate({
        "right": "+=0px"
      }, "slow");
   element = "+";
  }
});