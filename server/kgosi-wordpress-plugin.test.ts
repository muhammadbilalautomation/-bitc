import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const pluginRoot = resolve(process.cwd(), "kgosi-wordpress-plugin/kgosi-integration");
const pluginFile = resolve(pluginRoot, "kgosi-integration.php");

function read(relativePath: string) {
  return readFileSync(resolve(pluginRoot, relativePath), "utf8");
}

describe("KGOSI WordPress integration package", () => {
  it("contains the plugin entry point and all distributable assets", () => {
    expect(existsSync(pluginFile)).toBe(true);
    expect(existsSync(resolve(pluginRoot, "assets/kgosi.css"))).toBe(true);
    expect(existsSync(resolve(pluginRoot, "assets/kgosi.js"))).toBe(true);
    expect(existsSync(resolve(pluginRoot, "README.txt"))).toBe(true);
    expect(existsSync(resolve(pluginRoot, "uninstall.php"))).toBe(true);
  });

  it("registers the KGOSI settings page and portal shortcode", () => {
    const php = read("kgosi-integration.php");
    expect(php).toContain("add_options_page");
    expect(php).toContain("register_setting");
    expect(php).toContain("add_shortcode( 'kgosi_portal'");
    expect(php).toContain("esc_url( $portal_url )");
  });

  it("keeps the backend URL configurable instead of hardcoding a client system", () => {
    const php = read("kgosi-integration.php");
    expect(php).toContain("get_option( 'kgosi_portal_url'");
    expect(php).not.toContain("bitcassist-hub2b6w6hr.manus.space");
  });
});
