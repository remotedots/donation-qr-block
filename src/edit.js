/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

/**
 * External dependencies
 */
import QRCode from 'qrcode';

/**
 * Build EPC QR code data string.
 *
 * @param {Object} params Bank details.
 * @return {string} EPC formatted data string.
 */
function buildEpcData( { recipient, iban, bic, reference, amount } ) {
	// Clean IBAN (remove spaces)
	const ibanClean = iban.replace( /\s+/g, '' );

	// BIC must be 8 or 11 characters
	const bicFull = bic.length === 8 ? bic + 'XXX' : bic;

	// Clean recipient name (remove special chars that might cause issues)
	const recipientClean = recipient.replace( /[^\w\s\-]/g, '' );

	// Format amount (EUR + amount with 2 decimals, or empty if 0)
	const amountStr = amount > 0 ? `EUR${ amount.toFixed( 2 ) }` : '';

	// Build EPC QR code data (GiroCode format)
	return [
		'BCD',
		'001',
		'1',
		'SCT',
		bicFull,
		recipientClean,
		ibanClean,
		amountStr,
		'',
		'',
		reference,
	].join( '\n' );
}

/**
 * Editor component for the Donation QR Block.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update attributes.
 * @return {JSX.Element} Block editor component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		title,
		description,
		recipient,
		bankName,
		iban,
		bic,
		reference,
		amount,
		backgroundColor,
	} = attributes;

	const [ qrCodeUrl, setQrCodeUrl ] = useState( '' );
	const hasBankDetails = recipient && iban && bic;

	// Generate QR code when bank details change
	useEffect( () => {
		if ( ! hasBankDetails ) {
			setQrCodeUrl( '' );
			return;
		}

		const epcData = buildEpcData( { recipient, iban, bic, reference, amount } );

		QRCode.toDataURL( epcData, {
			width: 200,
			margin: 2,
			errorCorrectionLevel: 'M',
		} )
			.then( ( url ) => setQrCodeUrl( url ) )
			.catch( ( err ) => console.error( 'QR Code generation failed:', err ) );
	}, [ recipient, iban, bic, reference, amount, hasBankDetails ] );

	const blockProps = useBlockProps( {
		className: 'donation-qr-block',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Content', 'donation-qr-block' ) }>
					<TextControl
						label={ __( 'Title', 'donation-qr-block' ) }
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						help={ __( 'Optional heading above the QR code', 'donation-qr-block' ) }
					/>
					<TextareaControl
						label={ __( 'Description', 'donation-qr-block' ) }
						value={ description }
						onChange={ ( value ) => setAttributes( { description: value } ) }
						help={ __( 'Optional text below the title', 'donation-qr-block' ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Bank Details', 'donation-qr-block' ) } initialOpen={ ! hasBankDetails }>
					<TextControl
						label={ __( 'Recipient', 'donation-qr-block' ) }
						value={ recipient }
						onChange={ ( value ) => setAttributes( { recipient: value } ) }
					/>
					<TextControl
						label={ __( 'Bank Name', 'donation-qr-block' ) }
						value={ bankName }
						onChange={ ( value ) => setAttributes( { bankName: value } ) }
					/>
					<TextControl
						label={ __( 'IBAN', 'donation-qr-block' ) }
						value={ iban }
						onChange={ ( value ) => setAttributes( { iban: value } ) }
					/>
					<TextControl
						label={ __( 'BIC', 'donation-qr-block' ) }
						value={ bic }
						onChange={ ( value ) => setAttributes( { bic: value } ) }
					/>
					<TextControl
						label={ __( 'Reference', 'donation-qr-block' ) }
						value={ reference }
						onChange={ ( value ) => setAttributes( { reference: value } ) }
						help={ __( 'Payment reference text (e.g., "Donation")', 'donation-qr-block' ) }
					/>
					<NumberControl
						label={ __( 'Amount (EUR)', 'donation-qr-block' ) }
						value={ amount }
						onChange={ ( value ) => setAttributes( { amount: parseFloat( value ) || 0 } ) }
						min={ 0 }
						step={ 1 }
						help={ __( 'Default amount in EUR (0 = donor chooses)', 'donation-qr-block' ) }
					/>
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Color', 'donation-qr-block' ) }
					colorSettings={ [
						{
							value: backgroundColor,
							onChange: ( value ) => setAttributes( { backgroundColor: value } ),
							label: __( 'Background', 'donation-qr-block' ),
						},
					] }
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="donation-qr-block__inner" style={ { backgroundColor } }>
					{ title && (
						<h2 className="donation-qr-block__title">{ title }</h2>
					) }
					{ description && (
						<p className="donation-qr-block__description">{ description }</p>
					) }
					<div className="donation-qr-block__qr-wrapper">
						{ qrCodeUrl ? (
							<img
								src={ qrCodeUrl }
								alt={ __( 'QR code for bank transfer', 'donation-qr-block' ) }
								width="200"
								height="200"
							/>
						) : (
							<div className="donation-qr-block__qr-placeholder">
								<span>{ hasBankDetails ? __( 'Generating...', 'donation-qr-block' ) : __( 'Configure bank details', 'donation-qr-block' ) }</span>
							</div>
						) }
					</div>
					<dl className="donation-qr-block__details">
						<div className="donation-qr-block__detail">
							<dt>{ __( 'Recipient:', 'donation-qr-block' ) }</dt>
							<dd>{ recipient }</dd>
						</div>
						<div className="donation-qr-block__detail">
							<dt>{ __( 'Bank:', 'donation-qr-block' ) }</dt>
							<dd>{ bankName }</dd>
						</div>
						<div className="donation-qr-block__detail">
							<dt>{ __( 'IBAN:', 'donation-qr-block' ) }</dt>
							<dd><code>{ iban }</code></dd>
						</div>
						<div className="donation-qr-block__detail">
							<dt>{ __( 'BIC:', 'donation-qr-block' ) }</dt>
							<dd><code>{ bic }</code></dd>
						</div>
					</dl>
				</div>
			</div>
		</>
	);
}
