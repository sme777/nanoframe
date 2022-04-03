$(document).ready(function () {
  $(".sidebarSearchField").on("input", () => {
    if ($(".sidebarSearchField").val().length > 0) {
      $(".exitSearchBar").show();
    } else {
      $(".exitSearchBar").hide();
    }
  });

  $(".exitSearchBar").click(() => {
    $(".sidebarSearchField").val("");
    $(".exitSearchBar").hide();
  });
});

$(document).ready(function () {
  $(".createCustomButton").click(() => {
    $(".createCustomFieldContainer").css({ display: "block" });
  });

  $(".formCloseButton").click(() => {
    $(".createCustomFieldContainer").css({ display: "none" });
  });

  $(".fullscreen").click(() => {
    toggleFullscreen();
  });

  function toggleFullscreen(elem) {
    elem = elem || document.documentElement;
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }
});
