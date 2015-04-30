function imageObject(id, x, y, alpha, cat) {
	var canDOMObj, imgDOMObj;
	
	canDOMObj = document.createElement('canvas');
	canDOMObj.ctx = canDOMObj.getContext("2d");
	canDOMObj.x = x;
	canDOMObj.y = y;
	canDOMObj.alpha = alpha;
	canDOMObj.id = id;
	canDOMObj.cat = cat;
	
	imgDOMObj = document.createElement('img');
	imgDOMObj.onload = function() {
		canDOMObj.width  = imgDOMObj.width;
		canDOMObj.height = imgDOMObj.height;
		canDOMObj.ctx.drawImage(imgDOMObj, 0, 0);
		imageLoadCount++;	
	};
	imgDOMObj.src = 'images/' + id + '.png';
               	
	return canDOMObj;
}
