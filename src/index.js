/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

/**
 * Register the block.
 * The block is rendered server-side (dynamic block), so no save function needed.
 */
registerBlockType( metadata.name, {
	edit: Edit,
	save: () => null,
} );
