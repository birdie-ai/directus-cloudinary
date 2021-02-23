import DisplayComponent from './display.vue';

export default {
	id: 'cloudinary-image-display',
	name: 'Cloudinary Image',
	description: 'Display to show a Cloudinary image',
	icon: 'image',
	handler: DisplayComponent,
	types: ['string'],
};