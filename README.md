# Donation QR Block

Display an EPC/GiroCode QR code for SEPA bank donations. Scannable by banking apps to pre-fill transfer details.

## Description

Donation QR Block adds a Gutenberg block that displays an EPC/GiroCode QR code for accepting SEPA bank donations. When scanned with a banking app, the QR code pre-fills all transfer details (recipient, IBAN, BIC, reference) - making it easy for supporters to donate.

### Features

- **Native Gutenberg block** - No shortcodes, works seamlessly with the block editor
- **Live preview** - QR code updates in real-time as you edit bank details
- **Fully customizable** - Edit recipient name, bank, IBAN, BIC, amount, and payment reference
- **No external services** - QR codes are generated locally, your bank details never leave your server
- **Privacy-friendly** - No tracking, no API calls, no external dependencies
- **Customizable appearance** - Change background color to match your theme
- **Graceful fallback** - Shows bank details even if QR generation is unavailable

### What is an EPC QR Code?

The EPC QR code (European Payments Council Quick Response Code) is a standard for encoding SEPA credit transfer data. In Germany, it's known as "GiroCode". When scanned with a compatible banking app, it automatically fills in all payment details, reducing errors and making donations effortless.

Supported in 36 SEPA countries including: Germany, Austria, Belgium, Netherlands, France, Spain, Italy, and more.

### Use Cases

- Non-profit organizations accepting donations
- Churches and religious organizations
- Sports clubs and associations
- Crowdfunding campaigns
- Event organizers collecting fees
- Any organization accepting SEPA bank transfers

## Installation

1. Upload the `donation-qr-block` folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Edit any page or post with the block editor
4. Add the "Donation QR Code" block
5. Configure your bank details in the block sidebar

### Requirements

- WordPress 6.0 or higher
- PHP 7.4 or higher
- For frontend QR code display: `endroid/qr-code` Composer package (recommended)

> **Note:** Without the QR code library, the block will display bank details only (no QR code). The editor preview always shows the QR code.

## Development

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Watch for changes during development
npm run start
```

## FAQ

### Which banking apps support EPC QR codes?

Most European banking apps support EPC/GiroCode scanning, including:

- Sparkasse
- Volksbank
- Deutsche Bank
- ING
- N26
- Revolut
- And many more...

### Is my bank data sent to external servers?

No. All QR codes are generated locally - in your browser (editor) and on your server (frontend). Your bank details never leave your infrastructure.

### Can I customize the appearance?

Yes. You can change the background color via the block settings. For further customization, you can add custom CSS targeting the `.donation-qr-block` class.

### Does it work without JavaScript?

Yes. The QR code is rendered server-side as a static image, so it works even if visitors have JavaScript disabled.

### What if the QR code doesn't appear on the frontend?

The QR code requires the `endroid/qr-code` PHP library. Install it via Composer:

```bash
composer require endroid/qr-code
```

Without this library, the block displays bank details only. The editor preview always works regardless.

### Can I set a default donation amount?

Yes. You can set a default amount in EUR via the block settings. The default is 5 EUR. Set it to 0 if you want donors to choose their own amount.

## Changelog

### 1.0.0
- Initial release
- Native Gutenberg block with live QR code preview
- Customizable bank details (recipient, IBAN, BIC, reference, amount)
- Background color customization
- Server-side QR code generation for frontend
- Client-side QR code generation for editor preview

## Privacy Policy

This plugin does not collect, store, or transmit any personal data. All QR code generation happens locally on your server and in users' browsers. No external API calls are made.

## Disclaimer

This plugin is provided as-is without any warranty. The author is not responsible for any financial losses, incorrect transfers, or other damages resulting from the use of this plugin. Users are solely responsible for verifying that all bank details (IBAN, BIC, recipient name, amount) are correct before publishing. Always test QR codes with your banking app before making them publicly available.

## License

GPL-2.0-or-later
