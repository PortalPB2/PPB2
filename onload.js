window.onload = () => {
	addInactiveButtons(document.getElementById('downloadButtonSet'));
	Slideshow.setupSlideShows();
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
	
	if(usecake) {
		/* shhhh... don't look over here! go away */
		
		const buttonSets = document.getElementsByClassName('buttonSet'),
			lastButtonArea = buttonSets[buttonSets.length - 1],
			cakeButton = makeButton('cake.png'),
			cakeLink = document.createElement('a');
		
		cakeLink.setAttribute('href', './cake');
		cakeLink.setAttribute('id', 'cake');
		cakeLink.appendChild(cakeButton);
		lastButtonArea.appendChild(cakeLink);
	}
}