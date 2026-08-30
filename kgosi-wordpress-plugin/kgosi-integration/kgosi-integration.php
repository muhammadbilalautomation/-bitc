<?php
/**
 * Plugin Name: KGOSI Intelligence Portal
 * Plugin URI: https://example.com/kgosi
 * Description: Embeds the KGOSI/JARVIS enterprise intelligence portal into a WordPress page through a configurable secure portal URL.
 * Version: 1.0.0
 * Author: Senstar Software Systems
 * License: GPL-2.0-or-later
 * Text Domain: kgosi-integration
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'KGOSI_INTEGRATION_VERSION', '1.0.0' );
define( 'KGOSI_INTEGRATION_FILE', __FILE__ );
define( 'KGOSI_INTEGRATION_URL', plugin_dir_url( __FILE__ ) );

function kgosi_integration_register_settings() {
    register_setting(
        'kgosi_integration_settings_group',
        'kgosi_portal_url',
        array(
            'type'              => 'string',
            'sanitize_callback' => 'kgosi_integration_sanitize_portal_url',
            'default'           => '',
        )
    );
}
add_action( 'admin_init', 'kgosi_integration_register_settings' );

function kgosi_integration_sanitize_portal_url( $value ) {
    $value = trim( (string) $value );

    if ( '' === $value ) {
        return '';
    }

    $url = esc_url_raw( $value );
    $scheme = wp_parse_url( $url, PHP_URL_SCHEME );

    if ( ! in_array( strtolower( (string) $scheme ), array( 'https', 'http' ), true ) ) {
        add_settings_error(
            'kgosi_portal_url',
            'invalid_scheme',
            __( 'Enter a valid portal URL beginning with https:// or http://.', 'kgosi-integration' )
        );
        return '';
    }

    return untrailingslashit( $url );
}

function kgosi_integration_add_settings_page() {
    add_options_page(
        __( 'KGOSI Portal', 'kgosi-integration' ),
        __( 'KGOSI Portal', 'kgosi-integration' ),
        'manage_options',
        'kgosi-integration',
        'kgosi_integration_render_settings_page'
    );
}
add_action( 'admin_menu', 'kgosi_integration_add_settings_page' );

function kgosi_integration_enqueue_assets() {
    wp_enqueue_style(
        'kgosi-integration',
        KGOSI_INTEGRATION_URL . 'assets/kgosi.css',
        array(),
        KGOSI_INTEGRATION_VERSION
    );
    wp_enqueue_script(
        'kgosi-integration',
        KGOSI_INTEGRATION_URL . 'assets/kgosi.js',
        array(),
        KGOSI_INTEGRATION_VERSION,
        true
    );
}

function kgosi_integration_render_settings_page() {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }
    ?>
    <div class="wrap">
        <h1><?php esc_html_e( 'KGOSI Intelligence Portal', 'kgosi-integration' ); ?></h1>
        <p><?php esc_html_e( 'Connect this WordPress site to the separately hosted KGOSI/JARVIS portal. WordPress displays the portal; the intelligence backend remains hosted separately.', 'kgosi-integration' ); ?></p>

        <?php settings_errors(); ?>
        <form method="post" action="options.php">
            <?php settings_fields( 'kgosi_integration_settings_group' ); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="kgosi_portal_url"><?php esc_html_e( 'KGOSI portal URL', 'kgosi-integration' ); ?></label></th>
                    <td>
                        <input
                            name="kgosi_portal_url"
                            id="kgosi_portal_url"
                            type="url"
                            class="regular-text code"
                            value="<?php echo esc_attr( get_option( 'kgosi_portal_url', '' ) ); ?>"
                            placeholder="https://your-kgosi-portal.example.com"
                            inputmode="url"
                        />
                        <p class="description"><?php esc_html_e( 'Use the secure public URL of the separately hosted KGOSI portal. HTTPS is recommended for production.', 'kgosi-integration' ); ?></p>
                    </td>
                </tr>
            </table>
            <?php submit_button( __( 'Save portal URL', 'kgosi-integration' ) ); ?>
        </form>

        <hr />
        <h2><?php esc_html_e( 'Add KGOSI to a page', 'kgosi-integration' ); ?></h2>
        <p><?php esc_html_e( 'Create or edit a WordPress page and insert this shortcode:', 'kgosi-integration' ); ?></p>
        <p><code>[kgosi_portal]</code></p>
        <p><?php esc_html_e( 'Optional height:', 'kgosi-integration' ); ?> <code>[kgosi_portal height="900"]</code></p>
    </div>
    <?php
}

function kgosi_integration_shortcode( $atts ) {
    $atts = shortcode_atts(
        array(
            'height' => '780',
            'title'  => 'KGOSI Intelligence Portal',
        ),
        $atts,
        'kgosi_portal'
    );

    $portal_url = get_option( 'kgosi_portal_url', '' );
    $height = absint( $atts['height'] );
    $height = min( max( $height, 520 ), 1600 );
    $title = sanitize_text_field( $atts['title'] );

    kgosi_integration_enqueue_assets();

    ob_start();
    ?>
    <section class="kgosi-portal" aria-label="<?php echo esc_attr( $title ); ?>">
        <div class="kgosi-portal__bar">
            <div class="kgosi-portal__brand">
                <span class="kgosi-portal__mark" aria-hidden="true">K</span>
                <span>
                    <strong>KGOSI</strong>
                    <small>ENTERPRISE INTELLIGENCE PORTAL</small>
                </span>
            </div>
            <span class="kgosi-portal__status"><i aria-hidden="true"></i><?php esc_html_e( 'Secure portal link', 'kgosi-integration' ); ?></span>
        </div>
        <?php if ( $portal_url ) : ?>
            <div class="kgosi-portal__frame-wrap" style="min-height: <?php echo esc_attr( $height ); ?>px;">
                <div class="kgosi-portal__loading" data-kgosi-loading>
                    <span class="kgosi-portal__loading-mark" aria-hidden="true">K</span>
                    <span><?php esc_html_e( 'Opening KGOSI portal…', 'kgosi-integration' ); ?></span>
                </div>
                <iframe
                    class="kgosi-portal__frame"
                    src="<?php echo esc_url( $portal_url ); ?>"
                    title="<?php echo esc_attr( $title ); ?>"
                    loading="lazy"
                    allow="microphone; clipboard-read; clipboard-write"
                    referrerpolicy="strict-origin-when-cross-origin"
                    data-kgosi-frame
                ></iframe>
            </div>
        <?php else : ?>
            <div class="kgosi-portal__empty" role="status">
                <span class="kgosi-portal__empty-code">KGOSI / SETUP REQUIRED</span>
                <h2><?php esc_html_e( 'Connect the KGOSI portal URL', 'kgosi-integration' ); ?></h2>
                <p><?php esc_html_e( 'An administrator must open Settings → KGOSI Portal and save the URL of the separately hosted KGOSI/JARVIS system before this page can display the portal.', 'kgosi-integration' ); ?></p>
            </div>
        <?php endif; ?>
    </section>
    <?php
    return ob_get_clean();
}
add_shortcode( 'kgosi_portal', 'kgosi_integration_shortcode' );

function kgosi_integration_plugin_action_links( $links ) {
    $settings_link = '<a href="' . esc_url( admin_url( 'options-general.php?page=kgosi-integration' ) ) . '">' . esc_html__( 'Settings', 'kgosi-integration' ) . '</a>';
    array_unshift( $links, $settings_link );
    return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( KGOSI_INTEGRATION_FILE ), 'kgosi_integration_plugin_action_links' );
