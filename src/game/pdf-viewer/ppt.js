navigator.getUserMedia =
        navigator.webkitGetUserMedia || navigator.getUserMedia;
      $("#share_screen").click(function () {
        navigator.getUserMedia(
          {
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: "screen",
                maxWidth: 1280,
                maxHeight: 720,
              },
              optional: [],
            },
          },
          function (stream) {
            document.getElementById("video").src =
              window.URL.createObjectURL(stream);
            $("#share_screen").hide();
          },
          function () {
            alert(
              "Error, my friend. Screen stream is not available. Try in latest Chrome with Screen sharing enabled in about:flags."
            );
          }
        );
      });