import { server as GridLayout } from './elements/GridLayout';
import { server as LinearLayout } from './elements/LinearLayout';
import { server as ColumnLayout } from './elements/ColumnLayout';

import { server as Float } from './elements/Float';
import { server as Section } from './elements/Section';
import { server as Container } from './elements/Container';
import { server as ImageCarousel } from './elements/ImageCarousel';

import { server as FAQ } from './elements/FAQ';
import { server as Button } from './elements/Button';
import { server as HTMLView } from './elements/HTMLView';
import { server as TextView } from './elements/TextView';
import { server as ImageView } from './elements/ImageView';
import { server as Navigation } from './elements/Navigation';
import { server as MarkdownView } from './elements/MarkdownView';

import { server as Calendar } from './elements/CalendarServer';
import { server as PersonCard } from './elements/PersonCard';
import { server as ImageGallery } from './elements/ImageGallery';


export default function(serve: any) {
	[ GridLayout,
		LinearLayout,
		ColumnLayout,

		Float,
		Section,
		Container,
		ImageCarousel,

		FAQ,
		Button,
		HTMLView,
		TextView,
		ImageView,
		Navigation,
		MarkdownView,

		Calendar,
		PersonCard,
		ImageGallery
	].forEach(serve.registerElement);
}