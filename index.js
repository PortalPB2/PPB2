const db = {
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
};

const barcelona = new Slideshow(db.barcelona.path, db.barcelona.images),
	leipzig = new Slideshow(db.leipzig.path, db.leipzig.images),
	trailer = new Slideshow(db.trailer.path, db.trailer.images);

usecake = true;