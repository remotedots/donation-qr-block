<?php
/**
 * Plugin Name:       Donation QR Block
 * Plugin URI:        https://github.com/remotedots/donation-qr-block
 * Description:       Display an EPC/GiroCode QR code for SEPA bank donations.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            remotedots
 * Author URI:        https://remotedots.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       donation-qr-block
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Load bundled Composer dependencies
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
    require_once __DIR__ . '/vendor/autoload.php';
}

define( 'DONATION_QR_BLOCK_VERSION', '1.0.0' );
define( 'DONATION_QR_BLOCK_PATH', plugin_dir_path( __FILE__ ) );
define( 'DONATION_QR_BLOCK_URL', plugin_dir_url( __FILE__ ) );

/**
 * Register the block.
 */
function donation_qr_block_init() {
    register_block_type( DONATION_QR_BLOCK_PATH . 'build', array(
        'render_callback' => 'donation_qr_block_render',
    ) );

    // Set script translations for the editor
    wp_set_script_translations(
        'donation-qr-block-editor-script',
        'donation-qr-block',
        DONATION_QR_BLOCK_PATH . 'languages'
    );
}
add_action( 'init', 'donation_qr_block_init' );

/**
 * Render the block on the frontend.
 *
 * @param array $attributes Block attributes.
 * @return string HTML output.
 */
function donation_qr_block_render( $attributes ) {
    $title            = $attributes['title'] ?? '';
    $description      = $attributes['description'] ?? '';
    $recipient        = $attributes['recipient'] ?? '';
    $bank_name        = $attributes['bankName'] ?? '';
    $iban             = $attributes['iban'] ?? '';
    $bic              = $attributes['bic'] ?? '';
    $amount           = $attributes['amount'] ?? 5;
    $background_color = $attributes['backgroundColor'] ?? '#f9fafb';

    // Generate QR code or use cached version
    $qr_image_url = donation_qr_block_get_qr_image( $attributes );

    ob_start();
    ?>
    <section <?php echo get_block_wrapper_attributes( array( 'class' => 'donation-qr-block' ) ); ?>>
        <div class="donation-qr-block__inner" style="background-color: <?php echo esc_attr( $background_color ); ?>">
            <?php if ( ! empty( $title ) ) : ?>
                <h2 class="donation-qr-block__title"><?php echo esc_html( $title ); ?></h2>
            <?php endif; ?>

            <?php if ( ! empty( $description ) ) : ?>
                <p class="donation-qr-block__description"><?php echo esc_html( $description ); ?></p>
            <?php endif; ?>

            <?php if ( $qr_image_url ) : ?>
                <div class="donation-qr-block__qr-wrapper">
                    <img src="<?php echo esc_url( $qr_image_url ); ?>"
                         alt="<?php echo esc_attr__( 'QR code for bank transfer', 'donation-qr-block' ); ?>"
                         width="200"
                         height="200"
                         loading="lazy">
                </div>
            <?php endif; ?>

            <dl class="donation-qr-block__details">
                <div class="donation-qr-block__detail">
                    <dt><?php echo esc_html__( 'Recipient:', 'donation-qr-block' ); ?></dt>
                    <dd><?php echo esc_html( $recipient ); ?></dd>
                </div>
                <div class="donation-qr-block__detail">
                    <dt><?php echo esc_html__( 'Bank:', 'donation-qr-block' ); ?></dt>
                    <dd><?php echo esc_html( $bank_name ); ?></dd>
                </div>
                <div class="donation-qr-block__detail">
                    <dt><?php echo esc_html__( 'IBAN:', 'donation-qr-block' ); ?></dt>
                    <dd><code><?php echo esc_html( $iban ); ?></code></dd>
                </div>
                <div class="donation-qr-block__detail">
                    <dt><?php echo esc_html__( 'BIC:', 'donation-qr-block' ); ?></dt>
                    <dd><code><?php echo esc_html( $bic ); ?></code></dd>
                </div>
            </dl>

            <?php if ( $qr_image_url ) : ?>
                <p class="donation-qr-block__hint">
                    <?php echo esc_html__( 'Scan the QR code with your banking app to prepare a transfer.', 'donation-qr-block' ); ?>
                </p>
            <?php endif; ?>
        </div>
    </section>
    <?php
    return ob_get_clean();
}

/**
 * Get or generate the QR code image URL.
 *
 * @param array $attributes Block attributes.
 * @return string|false URL to the QR code image, or false if generation failed.
 */
function donation_qr_block_get_qr_image( $attributes ) {
    $recipient  = $attributes['recipient'] ?? '';
    $iban       = $attributes['iban'] ?? '';
    $bic        = $attributes['bic'] ?? '';
    $reference  = $attributes['reference'] ?? __( 'Donation', 'donation-qr-block' );
    $amount     = $attributes['amount'] ?? 5;

    // Require minimum data
    if ( empty( $recipient ) || empty( $iban ) || empty( $bic ) ) {
        return false;
    }

    // Clean IBAN (remove spaces)
    $iban_clean = preg_replace( '/\s+/', '', $iban );

    // BIC must be 8 or 11 characters
    $bic_full = strlen( $bic ) === 8 ? $bic . 'XXX' : $bic;

    // Clean recipient name (remove special chars that might cause issues)
    $recipient_clean = preg_replace( '/[^\w\s\-]/', '', $recipient );

    // Format amount (EUR + amount with 2 decimals, or empty if 0)
    $amount_str = $amount > 0 ? sprintf( 'EUR%.2f', $amount ) : '';

    // Build EPC QR code data
    $epc_data = implode( "\n", array(
        'BCD',
        '001',
        '1',
        'SCT',
        $bic_full,
        $recipient_clean,
        $iban_clean,
        $amount_str,
        '',
        '',
        $reference,
    ) );

    // Generate hash for caching
    $hash = md5( $epc_data );
    $upload_dir = wp_upload_dir();
    $qr_dir = $upload_dir['basedir'] . '/donation-qr-codes';
    $qr_file = $qr_dir . '/' . $hash . '.png';
    $qr_url = $upload_dir['baseurl'] . '/donation-qr-codes/' . $hash . '.png';

    // Return cached version if exists
    if ( file_exists( $qr_file ) ) {
        return $qr_url;
    }

    // Create directory if needed
    if ( ! file_exists( $qr_dir ) ) {
        wp_mkdir_p( $qr_dir );
    }

    // Try to generate QR code with endroid/qr-code if available
    if ( class_exists( '\Endroid\QrCode\QrCode' ) ) {
        try {
            $qr_code = new \Endroid\QrCode\QrCode( $epc_data );
            $writer = new \Endroid\QrCode\Writer\PngWriter();
            $result = $writer->write( $qr_code );
            $result->saveToFile( $qr_file );
            return $qr_url;
        } catch ( \Exception $e ) {
            return false;
        }
    }

    return false;
}
