	var isPlaying = false;

	async function init()
	{
		//let lineup = await loadLineup();
		let lineup = loadTestLineup();

		updateDateTime();
		setInterval(updateDateTime, 1000);

		tryBeginVideo(lineup);
		setInterval(() => tryBeginVideo(lineup), 1000);
	}

	function loadTestLineup() {
		var startTime1 = new Date();
		var startTime2 = new Date((new Date().getTime() + 30*1000));
		return [
			{
            "startTime": startTime1,
            "lengthSeconds": 25,
			"endTime": new Date((startTime1).getTime() + (25 * 1000)),
            "fileName": "earth-25s.mp4"
			},
			{
            "startTime": startTime2,
			"endTime": new Date((startTime2).getTime() + (25 * 1000)),
            "lengthSeconds": 25,
            "fileName": "forest-25s.mp4"
			}
		]
	}

	async function loadLineup() {
		return await fetch("lineup.json")
		.then((res) => {
			if (!res.ok) {
				throw new Error("Error reading lineup " + res.status);
			}
			return res.json();
		})
		.then((file) => {
			for(var idx in file["lineup"]) {
				var episode = file["lineup"][idx];
				episode.startTime = new Date(episode.startTime)
				var endTimeEpoch = episode.startTime.getTime() + (episode.lengthSeconds * 1000);
				episode.endTime = new Date(endTimeEpoch);
			}
			return file["lineup"];
		})
		.catch((e) => console.error(e))
	}

	// Function to create and play a video
	function playVideo(episode) {
		isPlaying = true;
		var seekTime = Math.abs(new Date() - episode.startTime) / 1000;

		// Create a new video element
		var video = document.createElement("video");
		video.controls = true;
		video.autoplay = true;
		video.muted = true;
		video.currentTime = seekTime;

		// Create a source element for the video
		var source = document.createElement("source");
		source.src = "assets/" + episode.fileName;
		source.type = "video/mp4";

		// Append the source element to the video element
		video.appendChild(source);

		// Append the video element to the video container
		var fileName = document.getElementById("fileName");
		fileName.innerHTML = episode.fileName;

		var videoContainer = document.getElementById("videoContainer");
		videoContainer.innerHTML = '';
		videoContainer.appendChild(video);

		video.addEventListener("play", () => handleVideoPlay(video, episode));
		video.addEventListener("ended", handleVideoEnd);

		// Play the video
		video.play();
	}

	function tryBeginVideo(lineup) {
		if (isPlaying) {
			return;
		}

		var maybeEpisode = getEpisode(lineup);

		if (maybeEpisode) {
			playVideo(maybeEpisode);
		}
	}

	function getEpisode(lineup) {
		var d = new Date();
		for (var idx in lineup) {
			if (lineup[idx].startTime.getTime() < d.getTime() && d.getTime() < lineup[idx].endTime.getTime()) {
				return lineup[idx];
			}
		}

		return null;
	}

	function handleVideoPlay(video, episode) {
		var seekTime = Math.abs(new Date() - episode.startTime) / 1000;

		if (seekTime > episode.lengthSeconds) {
			isPlaying = false;
		} else {
			video.currentTime = seekTime;
		}
	}

	function handleVideoEnd() {
		isPlaying = false;

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

	init();
