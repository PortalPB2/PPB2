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
}, URLify = function(string) { return "url('" + string + "')"; };

class Slideshow {
	
	static #currentOverlaySlideshow = null;
	
	static setOverlayVisibility(visible, slideShow = false) {
		const showOverlay = !!visible;
		document.body.style.zoom = 1.0;
		document.getElementById('overlay').style.display = showOverlay ? 'flex' : 'none';
		// document.getElementById('theLayout').style.filter = showOverlay ? 'blur(12px)' : 'none';
		if(slideShow) {
			this.#currentOverlaySlideshow = slideShow;
			this.#updateOverlayPicture();
		}
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
	}
	
	static #slideShows = [];
	
	/** Array of filenames of image files located within the path directory.
	 * @type {string[]}
	 */
	#images = [];
	
	/** Integer representing the current slide within the array.
	 * @type {number}
	 */
	#currentSlide = 0;
	
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
	
	static setupSlideShows() {
		for(const slideshow of this.#slideShows) slideshow.#setup();
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
	
	/** Construct the path of the current slideshow image.
	 * @return {string} A string representing the file path.
	 */
	#constructPath(n) {
		return basePath + delimiter + this.#path + delimiter + this.#images[n];
	}
	
	/** Update the image of the slideshow within the html
	 */
	#updateImage() {
		//update source with path of current image file
		this.#slideshowImageDiv.style.backgroundImage = URLify(this.#constructPath(this.#currentSlide));
	}
	
	/** Go to the previous image.
	 */
	prev() {
		this.#currentSlide = this.#clamp(this.#currentSlide-1);
		this.#updateImage();
	}
	
	/** Go to the next image.
	 */
	next() {
		this.#currentSlide = this.#clamp(this.#currentSlide+1);
		this.#updateImage();
	}
	
	/** Get the current image path.
	 * @return {string}
	 */
	getCurrentImage() { return this.#constructPath(this.#currentSlide); }
	
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
			buttonSetPaddingL = document.createElement('div'),
			buttonSetPaddingR = document.createElement('div');
		
		buttonSet.setAttribute('class','buttonSet');
		buttonSetPaddingL.setAttribute('class','buttonSetPadding');
		buttonSetPaddingR.setAttribute('class','buttonSetPadding buttonSetPaddingWithLine');
		
		const fs = document.createElement('div'),
			next = document.createElement('div'),
			prev = document.createElement('div');
		
		fs.setAttribute('class', 'displayButton fullscreenButton');
		prev.setAttribute('class', 'displayButton prevButton');
		next.setAttribute('class', 'displayButton nextButton');
		
		prev.onclick = () => this.prev();
		next.onclick = () => this.next();
		fs.onclick = () => Slideshow.setOverlayVisibility(true, this);
		this.#slideshowImageDiv.onclick = () => Slideshow.setOverlayVisibility(true, this);
		this.#slideshowImageDiv.addEventListener('contextmenu', e => e.preventDefault(), { passive: false});
		
		buttonSet.append(prev, next, fs);
		buttonContainer.append(buttonSetPaddingL, buttonSet, buttonSetPaddingR);
		this.#element.append(this.#slideshowImageDiv, buttonContainer);
		
		this.#currentSlide = this.#clamp(Math.floor(Math.random() * this.#images.length));
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