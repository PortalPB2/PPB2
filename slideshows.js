"use strict";
/* Portal Project Beta 2 Slideshow code */

const delimiter = '/',
	basePath = 'slideshows', db = {
	barcelona: {
		path: 'barcelona',
		images: [
			'b01.jpg',
			'b02.jpg',
			'b03.jpg',
			'b04.jpg',
		]
	}, trailer: {
		path: 'trailer',
		images: [
			't01.jpg',
			't02.jpg',
			't03.jpg',
			't04.jpg',
		]
	}, leipzig: {
		path: 'leipzig',
		images: [
			'l01.jpg',
			'l02.jpg',
			'l03.jpg',
			'l04.jpg',
			'l05.jpg',
		]
	}
}, URLify = function(string) { return "url('" + string + "')"; },
	additionalHazardIcons = [
		'ball.svg',
		'box.svg',
		'catcher.svg',
		'fly 1.svg',
		'fly 2.svg',
		'fountain.svg',
		'shocking.svg',
		'toxic.svg',
		'trash.svg',
	];

/** Add inactive elements to a DOM element.
 * @param parentElement An element in the DOM to add the inactive icons to.
 */
function addInactiveButtons(parentElement) {
	/* add inactive icons randomly */
	const number = additionalHazardIcons.length, indices = [], shuffled = [];
	for(let i = 0; i < number; i++) indices.push(i);
	//splice random indices into the shuffled array
	while(indices.length > 0) shuffled.push(indices.splice(Math.floor(Math.random() * indices.length), 1)[0])
	
	for(const index of shuffled) {
		const icon = document.createElement('div');
		icon.setAttribute('class','displayButton displayIcon inactiveIcon');
		icon.style.backgroundImage = URLify('images/buttons/' + additionalHazardIcons[index]);
		parentElement.append(icon);
	}
}

class Slideshow {
	
	/** Last saved vertical scroll position.
	 * @type {number}
	 */
	static #scrollCoordinate = 0;
	
	/** The current slideshow being used by the overlay.
	 * @type {null|Slideshow}
	 */
	static #currentOverlaySlideshow = null;
	
	/** Show or hide the overlay.
	 * @param visible A boolean indicating if the overlay will be made visible.
	 * @param slideShow A Slideshow object to display on the overlay.
	 */
	static setOverlayVisibility(visible, slideShow = false) {
		const showOverlay = !!visible;
		document.getElementById('overlay').style.display = showOverlay ? 'flex' : 'none';
		
		if(slideShow) {
			this.#currentOverlaySlideshow = slideShow;
			this.#updateOverlayPicture();
		}
		//save scroll coordinate
		if(showOverlay) this.#scrollCoordinate = window.scrollY;
		
		//show or hide body elements
		for(const ID of ['header', 'footer', 'content']) document.getElementById(ID).style.display = showOverlay ? 'none' : 'flex';
		
		//restore scroll coordinate
		if(!showOverlay) window.scrollTo(0, this.#scrollCoordinate);
	}
	
	static currentOverlayPrev() {
		this.#currentOverlaySlideshow.prev();
		this.#updateOverlayPicture();
	}
	
	static currentOverlayNext() {
		this.#currentOverlaySlideshow.next();
		this.#updateOverlayPicture();
	}
	
	static #updateOverlayPicture() {
		document.getElementById('overlayImage').style.backgroundImage =  URLify(this.#currentOverlaySlideshow.getCurrentImage());
		this.updateDie(document.getElementById('overlayDie'), this.#currentOverlaySlideshow.getCurrentIndex() + 1);
		this.updateDie(document.getElementById('overlayHoriDie'), this.#currentOverlaySlideshow.getCurrentIndex() + 1);
	}
	
	static #slideShows = [];
	
	/** Array of filenames of image files located within the path directory.
	 * @type {string[]}
	 */
	#images = [];
	
	/** Integer representing the current slide within the array.
	 * @type {number}
	 */
	#currentIndex = 0;
	
	/** Path of the slideshow folder within the folder indicated by the basePath variable.
	 * @type {string}
	 */
	#path = '';
	
	/** Element ID of the div element in the DOM where the slideshow is set up. This may be the same as #path for convenience.
	 * @type {string}
	 */
	#elementID = '';
	
	/** The element in the DOM corresponding to #elementID
	 */
	#element;
	
	/** The element containing the actual image from the slideshow.
	 */
	#slideshowImageDiv;
	
	/** An element containing the die image, which indicates which slide is active.
	 */
	#dieElement;
	
	/** Sets up all the slideshows.
	 */
	static setupSlideShows() {
		for(const slideshow of this.#slideShows) slideshow.#setup();
		// document.addEventListener('scroll', this.#scrollStopper, {capture: true});
	}
	
	/** Create a
	 * @param path A string representing the name of the folder inside the base slideshow path where the images are contained
	 * @param imageFiles An array of strings representing the file names of the images inside the path folder.
	 * @param elementID A string representing the ID of the page element where the slideshow is being displayed.
	 */
	constructor(path, imageFiles, elementID) {
		/* invalid path or array */
		if(typeof path !== 'string' || path.length === 0 || !Array.isArray(imageFiles)) {
			this.#path = typeof path === 'string' ? path : 'invalid';
			this.#images = ['slideshow error.jpg'];
		} else {
			this.#path = path;
			this.#images = imageFiles;
		}
		
		this.#elementID = typeof elementID === 'string' && elementID.length > 0 ? elementID : path;
		
		Slideshow.#slideShows.push(this);
	}
	
	/** Clamp an index value to fit within the array bounds.
	 * @param n An integer representing the index to clamp.
	 * @return {number} An integer representing the new index value.
	 */
	#clamp(n) {
		if(this.#images.length === 0) return 0;
		if(n < 0) return this.#images.length - 1;
		return n % this.#images.length;
	}
	
	/*
	As it happens, I bet you weren't expecting to find this text!
	Not that you will listen, but there's nothing more to see here.
	Did you really expect something? Like, maybe an ARG, or a puzzle, or a mystery?
	Really? Surely, you realize that not every single Portal-adjacent game is going to have that.
	Excruciating, I know, but try to remember that this mod is being released for free.
	We're not getting paid for this, and creating elaborate plots and puzzles takes time.
	
	You should know, I feel your pain. I was also hoping for a Portal Project Beta 2 ARG.
	Anyway... what do you think of this website? Presumably you liked it enough to browse the source code...
	Rummaging through it, you will find some CSS styles and the JS code used to make the slideshows work.
	Only a true genius like myself is smart enough to create a beautiful website like this one!
	Someone ought to pay me to do this for a living... OK. That's enough text for now. Bye bye!
	*/
	
	/** Construct the path of the current slideshow image.
	 * @return {string} A string representing the file path.
	 */
	#constructPath(n) {
		return basePath + delimiter + this.#path + delimiter + this.#images[n];
	}
	
	/** Update the image of a die element.
	 * @param element An element in the DOM.
	 * @param integer An integer representing the 1-indexed number to display for the die.
	 */
	static updateDie(element, integer) {
		if(integer > 0 && integer <= 7) {
			element.innerText = '';
			element.style.backgroundImage = URLify('images/die/' + String(Math.trunc(integer)) + '.svg')
		}
		else {
			element.style.backgroundImage = 'unset';
			element.innerText = String(integer);
		}
	}
	
	/** Update the image of the slideshow within the html
	 */
	#updateImage() {
		//update source with path of current image file
		this.#slideshowImageDiv.style.backgroundImage = URLify(this.#constructPath(this.#currentIndex));
		Slideshow.updateDie(this.#dieElement, this.#currentIndex + 1);
	}
	
	/** Go to the previous image.
	 */
	prev() {
		this.#currentIndex = this.#clamp(this.#currentIndex-1);
		this.#updateImage();
	}
	
	/** Go to the next image.
	 */
	next() {
		this.#currentIndex = this.#clamp(this.#currentIndex+1);
		this.#updateImage();
	}
	
	/** Get the index of the current slide.
	 * @return {number} The index of the current slide.
	 */
	getCurrentIndex() { return this.#currentIndex; }
	
	/** Get the current image path.
	 * @return {string}
	 */
	getCurrentImage() { return this.#constructPath(this.#currentIndex); }
	
	/** Set up the html elements.
	 */
	#setup() {
		this.#element = document.getElementById(this.#elementID);
		this.#element.innerText = '';
		this.#element.setAttribute('class', 'slideshow');
		
		this.#slideshowImageDiv = document.createElement('div');
		this.#slideshowImageDiv.setAttribute('class', 'slideshowImage');
		
		const buttonContainer = document.createElement('div');
		buttonContainer.setAttribute('class', 'buttonContainer');
		
		
		const buttonSet = document.createElement('div'),
			buttonSetPadding = document.createElement('div');
		
		buttonSet.setAttribute('class','buttonSet');
		buttonSetPadding.setAttribute('class','buttonSetPadding');
		
		const fs = document.createElement('div'),
			next = document.createElement('div'),
			prev = document.createElement('div');
		this.#dieElement = document.createElement('div');
		
		fs.setAttribute('class', 'displayButton fullscreenButton');
		prev.setAttribute('class', 'displayButton prevButton');
		next.setAttribute('class', 'displayButton nextButton');
		this.#dieElement.setAttribute('class', 'displayButton displayIcon die');
		
		prev.onclick = () => this.prev();
		next.onclick = () => this.next();
		fs.onclick = () => Slideshow.setOverlayVisibility(true, this);
		this.#slideshowImageDiv.onclick = () => Slideshow.setOverlayVisibility(true, this);
		this.#slideshowImageDiv.addEventListener('contextmenu', e => e.preventDefault(), { passive: false});
		buttonSet.append(prev, next, this.#dieElement, fs);
		addInactiveButtons(buttonSet);
		buttonContainer.append(buttonSet, buttonSetPadding);
		
		this.#element.append(this.#slideshowImageDiv, buttonContainer);
		
		this.#currentIndex = this.#clamp(Math.floor(Math.random() * this.#images.length));
		this.#updateImage();
		
		//preload images
		for(let i = 0; i < this.#images.length; i++) {
			const preloaded = new Image();
			preloaded.src = this.#constructPath(i);
		}
	}
}

const barcelona = new Slideshow(db.barcelona.path, db.barcelona.images),
	leipzig = new Slideshow(db.leipzig.path, db.leipzig.images),
	trailer = new Slideshow(db.trailer.path, db.trailer.images);

window.onload = () => {
	Slideshow.setupSlideShows();
	Slideshow.setOverlayVisibility(false);
	document.getElementById('overlayImage').addEventListener('contextmenu', e => e.preventDefault(), { passive: false});
	document.getElementById('overlay').addEventListener('contextmenu', e => e.preventDefault(), { passive: false});
	addInactiveButtons(document.getElementById('downloadButtonSet'));
	window.addEventListener('keydown', e => {
		if(document.getElementById('overlay').style.display !== 'none') switch (e.key) {
			case "ArrowLeft":
				Slideshow.currentOverlayPrev();
				break;
			case "ArrowRight":
				Slideshow.currentOverlayNext();
				break;
			case "Escape":
				Slideshow.setOverlayVisibility(false);
				break;
		}
	});
}