/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/imageinsert/ui/imageinsertpanelview
 */

import {
	View,
	ViewCollection,
	submitHandler,
	FocusCycler,
	FocusCyclerForwardCycleEvent,
	FocusCyclerBackwardCycleEvent
} from 'ckeditor5/src/ui';
import { FocusTracker, KeystrokeHandler, type Locale } from 'ckeditor5/src/utils';

import '../../../theme/imageinsert.css';

/**
 * The insert an image via URL view controller class.
 *
 * See {@link module:image/imageinsert/ui/imageinsertpanelview~ImageInsertPanelView}.
 */
export default class ImageInsertPanelView extends View {
	/**
	 * Tracks information about DOM focus in the form.
	 */
	public readonly focusTracker: FocusTracker;

	/**
	 * An instance of the {@link module:utils/keystrokehandler~KeystrokeHandler}.
	 */
	public readonly keystrokes: KeystrokeHandler;

	/**
	 * A collection of views that can be focused in the form.
	 */
	protected readonly _focusables: ViewCollection;

	/**
	 * Helps cycling over {@link #_focusables} in the form.
	 */
	protected readonly _focusCycler: FocusCycler;

	/**
	 * A collection of the defined integrations for inserting the images.
	 */
	private readonly children: ViewCollection;

	/**
	 * Creates a view for the dropdown panel of {@link module:image/imageinsert/imageinsertui~ImageInsertUI}.
	 *
	 * @param locale The localization services instance.
	 * @param integrations An integrations object that contains components (or tokens for components) to be shown in the panel view.
	 */
	constructor( locale: Locale, integrations: Array<View> = [] ) {
		super( locale );

		this.focusTracker = new FocusTracker();
		this.keystrokes = new KeystrokeHandler();
		this._focusables = new ViewCollection();
		this.children = this.createCollection();

		this._focusCycler = new FocusCycler( {
			focusables: this._focusables,
			focusTracker: this.focusTracker,
			keystrokeHandler: this.keystrokes,
			actions: {
				// Navigate form fields backwards using the Shift + Tab keystroke.
				focusPrevious: 'shift + tab',

				// Navigate form fields forwards using the Tab key.
				focusNext: 'tab'
			}
		} );

		this.children.addMany( integrations );

		// for ( const view of this.children ) {
		// 	if ( 'focusCycler' in view ) {
		// 		view.focusCycler.on<FocusCyclerForwardCycleEvent>( 'forwardCycle', evt => {
		// 			this._focusCycler.focusNext();
		// 			evt.stop();
		// 		} );
		//
		// 		view.focusCycler.on<FocusCyclerBackwardCycleEvent>( 'backwardCycle', evt => {
		// 			this._focusCycler.focusPrevious();
		// 			evt.stop();
		// 		} );
		// 	}
		// }

		this.setTemplate( {
			tag: 'form',

			attributes: {
				class: [
					'ck',
					'ck-image-insert-form'
				]
			},

			children: this.children
		} );
	}

	/**
	 * @inheritDoc
	 */
	public override render(): void {
		super.render();

		submitHandler( {
			view: this
		} );

		this.children.forEach( view => {
			// Register the view as focusable.
			this._focusables.add( view );

			// Register the view in the focus tracker.
			this.focusTracker.add( view.element! );
		} );

		// Start listening for the keystrokes coming from #element.
		this.keystrokes.listenTo( this.element! );
	}

	/**
	 * @inheritDoc
	 */
	public override destroy(): void {
		super.destroy();

		this.focusTracker.destroy();
		this.keystrokes.destroy();
	}

	/**
	 * Focuses the first {@link #_focusables focusable} in the form.
	 */
	public focus(): void {
		this._focusCycler.focusFirst();
	}
}

/**
 * TODO
 *
 * @eventName ~ImageInsertPanelView#submit
 */
export type SubmitEvent = {
	name: 'submit';
	args: [];
};

/**
 * TODO
 *
 * @eventName ~ImageInsertPanelView#cancel
 */
export type CancelEvent = {
	name: 'cancel';
	args: [];
};
