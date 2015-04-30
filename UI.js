// DR select -> final res
//           -> based on final res changes AR
// Can't change AR or final res or working res directly
// working res adjusts based on AR and % of window width and height maximizing
// for one or the other whichever is bigger.

// Katelin

// Animaiton independent model variables
var displayResolutions = [
	{'name':'8K UHD',  'x':7680, 'y':4320},
	{'name':'4K UHD',  'x':3840, 'y':2160},
	{'name':'Full HD', 'x':1920, 'y':1080, 'default':true},
	{'name':'720p',    'x':1280, 'y':720},
	{'name':'HD',      'x':1366, 'y':768},
	{'name':'SXGA',    'x':1280, 'y':1024},
	{'name':'WXGA',    'x':1280, 'y':768},
	{'name':'XGA',     'x':1024, 'y':768},
	{'name':'SVGA',    'x':800,  'y':600}
],
DEFAULT_FPS = 24,
DUMMY_ANIMATION_NAME = 'Agado S03E23',
mainCanvas, ctx;

// Animation dependent model variables
var ar1, ar2, resX, resY, fps, totalTime /* in seconds */, frames;

// UI DOM variables assigned in init
var newButton, renameButton, openButton, drSelect, arSpan, resSpan, fpsInput,
	lenTimeSpan, framesSpan, worResSpan, worFPSInput, seqTitle, mainCanvasDiv,
	edTA, splashDialog, closeSplashButton;

function UIInit() {
	var i, newOption;
	
	mainCanvas = document.getElementById('mainCanvas');
	ctx = mainCanvas.getContext('2d');

	function ge(s) { return document.getElementById(s); };
	newButton     = ge('newButton');
	renameButton  = ge('renameButton');
	openButton    = ge('openButton');
	arSpan        = ge('arSpan');
	resSpan       = ge('resSpan');
	lenTimeSpan   = ge('lenTimeSpan');
	worResSpan    = ge('worResSpan');
	fpsInput      = ge('fpsInput');
	worFPSInput   = ge('worFPSInput');
	seqTitle      = ge('seqTitle');
	drSelect      = ge('drSelect');
	mainCanvasDiv = ge('mainCanvasDiv');
	edTA          = ge('edTA');
	splashDialog  = ge('splashDialog');
	closeSplashButton = ge('closeSplashButton');

	splashDialog.open = true;
	closeSplashButton.onclick = closeSplash;
	newButton.onclick    = newAnimation;
	renameButton.onclick = rename;
	openButton.onclick   = open;

	seqTitle.innerHTML = DUMMY_ANIMATION_NAME; // eventually will be loaded
	fpsInput.value = DEFAULT_FPS;
	worFPSInput.value = DEFAULT_FPS;
	
	// Set total time display
	totalTime = 0;
	updateTotalTimeDisplay();

	for(i = 0; i < displayResolutions.length; i++) {
		newOption = document.createElement('option');
		newOption.value = '' + displayResolutions[i].x + ',' +
			displayResolutions[i].y;
		newOption.innerHTML = displayResolutions[i].name;
		if(displayResolutions[i].default) newOption.selected = 'selected';
		drSelect.appendChild(newOption);
	}
	drSelect.onchange = drChosen;
	drSelect.onchange();
	worFPSInput.value = fpsInput.value;
	window.onresize = updateWorkingResolution;
	updateWorkingResolution();
};

function updateTotalTimeDisplay() {
	var hours = parseInt(totalTime / 3600) % 24;
	var minutes = parseInt(totalTime / 60) % 60;
	var seconds = totalTime % 60;
	lenTimeSpan.innerHTML = (hours < 10 ? '0' + hours : hours) + ':' +
		(minutes < 10 ? '0' + minutes : minutes) + ':' +
		(seconds < 10 ? '0' + seconds : seconds);
};

// Euclid's Algorithm - for finding the smallest whole number ratio of any two
//  numbers
function smallestWholeNumberRatio(numerator, denominator) {
	var gcd, temp, divisor, term1, term2;
	
	gcd = function (a, b) {
		if(b === 0) return a;
		return gcd(b, a % b);
	};
	
	if(numerator === denominator) term1 = term2 = 1; else {
		if(+numerator < +denominator) {
			temp = numerator;
			numerator = denominator;
			denominator = temp;
		}
		divisor = gcd(+numerator, +denominator);
		if('undefined' === typeof temp) {
			term1 = numerator / divisor;
			term2 = denominator / divisor;
		} else {
			term1 = denominator / divisor;
			term2 = numerator / divisor;
		}
	}
	return term1 + ',' + term2;
};

function drChosen() {
	var res, ar, ara;
	
	res = this.value.split(',');
	resX = res[0];
	resY = res[1];
	resSpan.innerHTML = resX + 'x' + resY;
	ar = smallestWholeNumberRatio(resX, resY);
	ara = ar.split(',');
	ar1 = ara[0];
	ar2 = ara[1];
	arSpan.innerHTML = ar1 + ':' + ar2;
	updateWorkingResolution();
};

function updateWorkingResolution() {
	var MARGIN_SCALE, widthLimit, heightLimit, wxr, wyr;

	MARGIN_SCALE = 0.78;
	widthLimit = parseInt(window.innerWidth * MARGIN_SCALE);
	heightLimit = parseInt(window.innerHeight * MARGIN_SCALE);
	
	wxr = widthLimit;
	wyr = parseInt(widthLimit * (ar2 / ar1)); 
	if(wyr > heightLimit) {
		wyr = heightLimit;
		wxr = parseInt(heightLimit * (ar1 / ar2)); 
	}
	mainCanvas.width = wxr;
	mainCanvas.height = wyr;
	mainCanvasDiv.style.height = wyr + 100 + 'px'; 
	ctx.fillStyle = '#FFFFFF';
	ctx.fillRect(0, 0, wxr, wyr);

	worResSpan.innerHTML = wxr + 'x' + wyr;
	edTA.style.width = window.innerWidth - 38 + 'px';
};

function closeSplash() {
	splashDialog.open = false;
}
