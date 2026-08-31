const video = document.getElementById("bannerVideo");

video.addEventListener("loadedmetadata", function () {
    // Bắt đầu từ giây 1
    video.currentTime = 1;
    video.play();
});

video.addEventListener("timeupdate", function () {
    // Khi đến giây 35 thì quay lại giây 1
    if (video.currentTime >= 35) {
        video.currentTime = 1;
        video.play();
    }
});