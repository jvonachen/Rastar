var
	aIO,         // array of image objects
	frame,       // current frame
	loopHandle,  // for controlling the interval 
	images,      // "table" of images
	transitions, // "table" of trasnision
	animation,   // animation object
	imageLoadCount; // counts how many images have loaded

// This function only gets called once a load time
function init() {
	var i, j, thisIO, tsio, newIO, playButton, nextButton, allButton,
		appliedAlpha;
	
	UIInit();
/*
	aIO = new Array(); // array of image objects
	imageLoadCount = 0;
	for(i = 0; i < images.length; i++) {
		// load images into raster objects
		thisIO = images[i];
		if(thisIO.images != undefined) { // batch category record
			for(j = 0; j < thisIO.images.length; j++) {
				tsio = thisIO.images[j];
				if(tsio.alpha != undefined) appliedAlpha = tsio.alpha;
				else appliedAlpha = thisIO.alpha;
				newIO = new imageObject(tsio.id, tsio.x, tsio.y, appliedAlpha,
					thisIO.cat);
				aIO.push(newIO);
			}
		} else { // a non batch category record
			newIO = new imageObject(thisIO.id, thisIO.x, thisIO.y, thisIO.alpha,
				thisIO.cat);
			aIO.push(newIO);
		}
	}

	aIO.sort(compare);
	function compare(a, b) {
		if(a.id < b.id) return -1;
		if(a.id > b.id) return 1;
		return 0;
	}

	frame = 0;

	function readyToGo() {
		if(imageLoadCount < images.length) return;
		playButton.disabled = false;
		nextButton.disabled = false;
		allButton.disabled = false;
		clearInterval(loopHandle);
	}
	
	loopHandle = setInterval(readyToGo, 1); // 1 millisecond!
*/
};

function newAnimation() {
	var newAnimation;
	
	newAnimation = prompt('Enter new name.', 'unnamed');
	alert('Creating new animation called ' + newAnimation);
}

function rename() {
	var newName;
	
	newName = prompt('Enter new name.');
	alert('renaming current animation ' + newName);
}

function open() {
	var animName;
	
	animName = prompt('Open');
	openAnimation(animName);
}

// This is separate because eventually there will be a file loaded that will
//  load a last used animation.
function openAnimation(name) {
	load('animationModel.js');
	load('imagesModel.js');
	load('transitionsModel.js');
}

function load(model) {
	
}

// This is the engine that reads the model and makes the animation.  Nothing
//  here should be hard coded.  Everything needed to make any defined animation
//  should be contained in the model.
function animationLoop(save) {
	var i, j, thisIO, thisTran, xmlhttp, tdurl,
		fid, // from image data
		tid; // to image data
	
	for(i = 0; i < aIO.length; i++) {
		thisIO = aIO[i];
		for(j = 0; j < transitions.length; j++) {
			thisTran = transitions[j];
			if(
				(frame >= thisTran.from && frame < thisTran.to) &&
				(
					(thisTran.id != undefined && thisTran.id === thisIO.id) ||
					(thisTran.cat != undefined && thisTran.cat === thisIO.cat)
				)
			) {
				// alpha transitions
				if(thisTran.alpha != undefined) {
					thisIO.alpha += thisTran.alpha;
					if(thisIO.alpha > 1) thisIO.alpha = 1;
					if(thisIO.alpha < 0) thisIO.alpha = 0;
				}
				// x position transitions
				if(thisTran.x != undefined) thisIO.x += thisTran.x;
				// y position transitions
				if(thisTran.y != undefined) thisIO.y += thisTran.y;
				// image data map transitions
				if(thisTran.idMap != undefined) {
					fid = thisIO.ctx.getImageData(0, 0, thisIO.width,
						thisIO.height);
					
					tid = paislyCanvas.ctx.getImageData(thisle.locX,
						thisle.locY, thisle.width, thisle.height);
					for(j = 0; j < lid.data.length; j += 4) {
						for(k = 0; k < 3; k++) {
							if(lid.data[j + k] < pid.data[j + k]) {
								lid.data[j + k] += (pid.data[j + k] - lid.data[j + k]) / 24;
							} else {
								lid.data[j + k] -= (lid.data[j + k] - pid.data[j + k]) / 24;						
							}
						}
					}
					thisle.ctx.putImageData(lid, 0, 0);
				}
			}
		}
		// change and draw this canvas DOM object
		mainCanvas.ctx.globalAlpha = thisIO.alpha;
		mainCanvas.ctx.drawImage(thisIO, thisIO.x, thisIO.y);
	}
	
	if(save) {
		tdurl = mainCanvas.toDataURL(); // png
		var is = frame.toString;
  		is = is.length >= 3 ? is : new Array(3 - is.length + 1).join('0') + is;
		// send image data
		xmlhttp = new XMLHttpRequest();
		/*
		xmlhttp.onreadystatechange = function() {
			if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				responseSpan.innerHTML = xmlhttp.responseText;
	    	}
	 	};*/
	  xmlhttp.open('POST', '/', true);
		xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xmlhttp.send(tdurl);
	}
	
	frame++;
	if(frame > animation.frames) {
		clearInterval(loopHandle);
		frame = 0;		
		//mainCanvas.ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
	}
	framesSpan.innerHTML = frame;
};
