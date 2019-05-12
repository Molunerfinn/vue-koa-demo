// 显示弹出信息 如成绩，游戏信息
HdGame.changePoup = function(flag, index, isAnimation) {
  if (!_manage && g_config.showSkillSup) {
    switch (flag) {
    case 1:
      HdGame.logDog(1000200, 4);
      g_config.localPoupPage = 4;
      break;
    case 3:
      HdGame.logDog(1000200, 2);
      g_config.localPoupPage = 2;
      break;
    case 4:
      HdGame.logDog(1000200, 3);
      g_config.localPoupPage = 3;
      break;
    case 2:
      HdGame.logDog(1000200, 1);
      g_config.localPoupPage = 1;
      break
    }
  }
  if (index == 0) {
    if (g_config.isAOpenId == 0) {
      HdGame.logDog(1000115, 5)
    } else {
      HdGame.logDog(1000115, 6)
    }
  }
  rankAjax.isClose = false;
  var silkBag = $("#ruleImg");
  var popupX = silkBag.offset().left + silkBag.width() / 2 + "px ";
  var popupY = silkBag.offset().top + silkBag.height() / 2 + "px";
  $("#poupInfoBox").css({
    "transform-origin": popupX + popupY,
    "-webkit-transform-origin": popupX + popupY
  });
  $("#poupInfoBox").show();
  $(".poupTitleMune").removeClass("checked");
  if (flag == 5 && arg.hasReport == true) {
    $("#informResultBox h2").text("你已经投诉过了！");
    $("#informResultBox").show()
  } else {
    if (typeof index === "number") {
      var nowItem = $(".poupTitleMune").filter(":visible").eq(index);
      nowItem.addClass("checked");
      flag = parseInt(nowItem.attr("_flag"))
    } else {
      $(".poupTitleBox .poupTitleMune").filter(":visible").each(function(i, value) {
        if ($.trim($(this).attr("_flag")) == flag) {
          index = i;
          $(this).addClass("checked")
        }
      })
    }
  }

  if (poupTopMune.marginLeft) {
    $(".poupSlideBar .slideBarTip").css("left", ((13.25 / poupTopMune.menuLen) * index + (poupTopMune.slideBarWidth - poupTopMune.slideBarMaxWidth) / 40) + "rem")
  } else {
    $(".poupSlideBar .slideBarTip").css("left", (13.25 / poupTopMune.menuLen) * index + "rem")
  }
  setSlideBar(flag, isAnimation);
  $(".popTabBox").css("left", -$(window).width() * index)
};
