var video1Info = {
	"file": "videos/forest-25s.mp4",
	"length": 24.9,
	"position": 0
}
var video2Info = {
	"file": "videos/earth-25s.mp4",
	"length": 25,
	"position": 1
}

var videos = [video1Info, video2Info];

// Function to create and play a video
function playVideo(videoSrc, seekTime) {
	if (!seekTime) seekTime = 0;
    // Create a new video element
    var video = document.createElement("video");
    video.controls = true;
	video.autoplay = true;
	video.muted = true;
	video.currentTime = seekTime;

    // Create a source element for the video
    var source = document.createElement("source");
    source.src = videoSrc;
    source.type = "video/mp4";

    // Append the source element to the video element
    video.appendChild(source);

    // Append the video element to the video container
	var fileName = document.getElementById("fileName");
	fileName.innerHTML = videoSrc;

	var videoContainer = document.getElementById("videoContainer");
	videoContainer.innerHTML = '';
	videoContainer.appendChild(video);

	video.addEventListener("play", handleVideoPlay);
	video.addEventListener("ended", handleVideoEnd);

    // Play the video
    video.play();
}

function tryPlayVideo() {
	var d = new Date();
	var seconds = d.getSeconds();

	if (seconds % 30 === 0) {
		selectVideo();
	}
}

function selectVideo() {
	var d = new Date();
	var secondsPastMinute = d.getSeconds();
	
	var whichVideo = 0;
	if (secondsPastMinute >= 30) whichVideo = 1;
	
	var currVideo = videos[0]
	for (const video of videos) {
		if (video["position"] === whichVideo) {
			currVideo = video;
			break;
		}
	}

	playVideo(currVideo["file"], secondsPastMinute % 30);
}

function handleVideoPlay() {
}

function handleVideoEnd() {
	var fileName = document.getElementById("fileName");
	fileName.innerHTML = "Now Loading";

	var videoContainer = document.getElementById("videoContainer");
	videoContainer.innerHTML = '';
}

function updateDateTime() {
	var currentDateTime = new Date();
	var formattedDateTime = currentDateTime.toLocaleString();
	
	document.getElementById("datetime").innerHTML = formattedDateTime;
}

updateDateTime();
setInterval(updateDateTime, 1000);

setInterval(tryPlayVideo, 1000);

selectVideo();

