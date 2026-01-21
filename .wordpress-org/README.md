# WordPress.org Plugin Assets

This folder contains assets for the WordPress.org plugin directory. These files are uploaded separately to the SVN `assets/` directory, NOT included in the plugin zip.

## Required Assets

### Plugin Icon (Required)
- `icon-128x128.png` - 128×128 pixels
- `icon-256x256.png` - 256×256 pixels (Retina)

Displayed on the plugin directory listing and search results.

### Plugin Banner (Recommended)
- `banner-772x250.png` - 772×250 pixels
- `banner-1544x500.png` - 1544×500 pixels (Retina)

Displayed at the top of your plugin page.

### Screenshots (Recommended)
Referenced in `readme.txt` under `== Screenshots ==` section:

- `screenshot-1.png` - The Donation QR Block in the Gutenberg editor with live preview
- `screenshot-2.png` - Block settings panel with bank details configuration
- `screenshot-3.png` - Frontend display of the donation QR code

Screenshots should be:
- PNG or JPEG format
- Maximum width: 1200px (will be resized if larger)
- Descriptive filenames matching readme.txt numbering

## How to Upload

1. After plugin approval, you'll get SVN access
2. Check out the SVN repository:
   ```bash
   svn co https://plugins.svn.wordpress.org/donation-qr-block
   ```
3. Add assets to the `assets/` folder (not `trunk/`)
4. Commit:
   ```bash
   svn add assets/*
   svn ci -m "Add plugin assets"
   ```

## Design Guidelines

- Icons should be simple and recognizable at small sizes
- Banners should not include the plugin name (it's displayed separately)
- Use consistent branding/colors
- Avoid text in banners (doesn't scale well)

## Suggested Icon Design

For a donation QR code plugin, consider:
- A stylized QR code
- A combination of QR code + Euro symbol
- A QR code with a heart symbol

## References

- [Plugin Assets Guide](https://developer.wordpress.org/plugins/wordpress-org/plugin-assets/)
- [How Your Plugin Assets Work](https://developer.wordpress.org/plugins/wordpress-org/how-your-readme-txt-works/)
