KGOSI Intelligence Portal — WordPress Integration
====================================================

Purpose
-------
This plugin places the separately hosted KGOSI/JARVIS intelligence portal inside a WordPress page. WordPress provides the page shell and access point; the KGOSI/JARVIS intelligence backend, authentication, databases, reports and integrations remain on the dedicated portal server.

Requirements
------------
- WordPress 6.0 or later
- PHP 7.4 or later
- A public URL for the KGOSI/JARVIS portal
- HTTPS on the WordPress site and the KGOSI portal for production use

Installation
------------
1. In WordPress, open Plugins → Add New Plugin → Upload Plugin.
2. Upload kgosi-integration.zip and choose Install Now.
3. Activate KGOSI Intelligence Portal.
4. Open Settings → KGOSI Portal.
5. Enter the public URL of the separately hosted KGOSI/JARVIS portal and save it.
6. Create or edit a page and add the shortcode below.

Shortcode
---------
[kgosi_portal]

Optional height, in pixels:
[kgosi_portal height="900"]

Important deployment note
-------------------------
The portal URL must allow itself to be displayed in an iframe. If the KGOSI server sends X-Frame-Options: DENY or a restrictive Content-Security-Policy frame-ancestors rule, WordPress will not be able to display it. Configure the KGOSI server to permit framing only from the approved WordPress domain.

The plugin does not copy company databases into WordPress. Live Accounting, ERP, CRM, mail, document, GIS and other systems should connect to the KGOSI backend through approved APIs, read-only database views, secure service accounts or other client-approved methods.

Voice and browser permissions
-----------------------------
The embedded portal is allowed to request microphone access. The browser will still ask the user for permission, and the WordPress site must use HTTPS for reliable microphone access.

Security checklist
------------------
- Use HTTPS on both sites.
- Restrict the portal's frame-ancestors policy to the approved WordPress domain.
- Use role-based access in the KGOSI portal; do not rely on the WordPress shortcode as the only security boundary.
- Keep company data and credentials on the KGOSI backend, not in WordPress page content.
- Use human approval for sensitive actions such as payments, procurement changes, record deletion or external communications.
- Test login, report loading, microphone permission and logout after installation.

Support
-------
This is the WordPress connection layer for the KGOSI/JARVIS prototype. The actual intelligence, data connectors and enterprise workflows must be implemented and hosted in the KGOSI/JARVIS backend.
