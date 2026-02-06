const db = {
	classicScreens: {
		path: 'classicScreens',
		images: [
			'testchmb_a_1.jpg',
			'testchmb_a_2.jpg',
			'testchmb_a_3.jpg',
			'testchmb_a_4.jpg',
			'testchmb_a_5.jpg',
			'x06_demo0007.jpg',
		]
	}
};

const classicScreens = new Slideshow(db.classicScreens.path, db.classicScreens.images);

usecake = true;