/* Timer */

function updateTimer() {
    future  = Date.parse("May 28, 2022 13:00:00");
    now     = new Date();
    diff    = future - now;
  
    days  = Math.floor( diff / (1000*60*60*24) );
    hours = Math.floor( diff / (1000*60*60) );
    mins  = Math.floor( diff / (1000*60) );
    secs  = Math.floor( diff / 1000 );
  
    d = days;
    h = hours - days  * 24;
    m = mins  - hours * 60;
    s = secs  - mins  * 60;
  
    document.getElementById("timer")
      .innerHTML =
        '<div>' + d + '<span>gün</span></div>' +
        '<div>' + h + '<span>saat</span></div>' +
        '<div>' + m + '<span>dakika</span></div>' +
        '<div>' + s + '<span>saniye</span></div>' ;
  }
  setInterval('updateTimer()', 1000 );


  /* Timeline */
  
  // data
const timeline = [
	{
		year: 2017,
		month: 05,
		month_name: "Mayıs 2017",
		title: "Oyun başlıyor"
	},
	{
		year: 2017,
		month: 06,
		month_name: "Haziran 2017",
		title: "Amerika sevdası"
	},
	{
		year: 2018,
		month: 05,
		month_name: "Mayıs 2018",
		title: "Erkeğin okula vedası"
	},
	{
		year: 2019,
		month: 05,
		month_name: "Mayıs 2019",
		title: "Kızın okula vedası"
	},
	{
		year: 2020,
		month: 06,
		month_name: "Haziran 2020",
		title: "Mamak sevdası"
	},
	{
		year: 2021,
		month: 05,
		month_name: "Haziran 2021",
		title: "Reddedemeyeceği teklif"
	},
	{
		year: 2021,
		month: 07,
		month_name: "Temmuz 2021",
		title: "Ballı kahve"
	},
	{
		year: 2021,
		month: 11,
		month_name: "Kasım 2021",
		title: "Nişan halayı"
	},
	{
		year: 2022,
		month: 05,
		month_name: "Mayıs 2022",
		title: "Yüksek tepeler"
	},
	{
		year: 2022,
		month: 05,
		month_name: "Mayıs 2022",
		title: "Prensese kavuşma <3"
	}
];

//
const mario = document.getElementById("mario");
const ground = document.getElementById("ground");
const grass = document.getElementById("grass");
const eventsContainer = document.getElementById("events");
let currentIndex = -1;
let currentPipe;
let int1;

// click handler
const pipeHandler = (event) => {
	clearInterval(int1);

	// clear old
	!currentPipe || currentPipe.classList.remove("active");

	// get index
	const index = parseInt(event.currentTarget.dataset.index);

	// walk
	const xpos = -100 - index * 150 - 25;
	const curXpos = -100 - currentIndex * 150 - 25;
	const distance = curXpos - xpos;
	const duration = Math.abs(distance) * 3;
	// console.log(distance);
	eventsContainer.style.transitionDuration = `${duration}ms`;
	eventsContainer.style.transform = `translateX(${xpos}px)`;
	ground.style.transitionDuration = `${duration}ms`;
	ground.style.backgroundPosition = `${xpos}px 32px`;
	grass.style.transitionDuration = `${duration}ms`;
	grass.style.backgroundPosition = `${xpos}px 0`;

	//
	playSfx("jump");

	// walk style
	const dir = distance < 0 ? "left" : "right";
	mario.classList.remove(
		"idle",
		"walk-left",
		"walk-right",
		"search-left",
		"search-right"
	);
	mario.classList.add(`walk-${dir}`);
	int1 = setTimeout(
		(dir, target) => {
			mario.classList.remove(`walk-${dir}`);
			mario.classList.add(`search-${dir}`);
			target.classList.add("active");
			playSfx("pipe");
		},
		duration,
		dir,
		event.currentTarget
	);

	// store position
	currentIndex = index;
	currentPipe = event.currentTarget;
};

// setup timeline
timeline.forEach((event, index) => {
	const e = document.createElement("div");
	e.classList.add("event");
	e.dataset.index = index;
	e.dataset.title = event.title;
	e.dataset.month = event.month_name;
	eventsContainer.appendChild(e);
	e.addEventListener("click", pipeHandler.bind(this));
});

/**
 * Audio handling
 */
const canAudio = "AudioContext" in window || "webkitAudioContext" in window;
const buffers = {};
let context = void 0;

if (canAudio) {
	var AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext(); // Make it crossbrowser
	var gainNode = context.createGain();
	gainNode.gain.value = 1; // set volume to 100%
}

const playSfx = function play(id) {
	if (!canAudio || !buffers.hasOwnProperty(id)) return;
	const buffer = buffers[id];
	const source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(context.destination);
	source.start();
};

const loadBuffers = (urls, ids) => {
	if (typeof urls == "string") urls = [urls];
	if (typeof ids == "string") ids = [ids];
	urls.forEach((url, index) => {
		window
			.fetch(url)
			.then((response) => response.arrayBuffer())
			.then((arrayBuffer) =>
				context.decodeAudioData(
					arrayBuffer,
					(audioBuffer) => {
						buffers[ids[index]] = audioBuffer;
					},
					(error) => console.log(error)
				)
			);
	});
};

loadBuffers(
	[
		"https://assets.codepen.io/439000/jump.mp3",
		"https://assets.codepen.io/439000/smb_pipe.mp3"
	],
	["jump", "pipe"]
);
