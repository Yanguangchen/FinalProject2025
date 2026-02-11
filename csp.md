# ----------------------------------------------------------------------
# Content Security Policy (CSP) Configuration
# ----------------------------------------------------------------------
# Architecture: React Native for Web (SPA) served via Nginx
# Objective: Restrict execution of unauthorized scripts and remote assets.
# ----------------------------------------------------------------------

add_header Content-Security-Policy "
    # 1. Default Fallback
    # Block everything by default unless explicitly allowed.
    default-src 'self';

    # 2. JavaScript Execution
    # - 'self': Allow app bundle.
    # - maps.googleapis.com: Required for Google Maps SDK.
    # - 'unsafe-inline': Required for React Native Web's hydration process.
    script-src 'self' 
        'unsafe-inline' 
        https://maps.googleapis.com 
        https://maps.gstatic.com;

    # 3. Data Connectivity (XHR/Fetch)
    # - maps.googleapis.com: For Geocoding and Elevation APIs.
    # - rss.app: For fetching standardized RSS JSON feeds.
    # - facebook.com: For parsing SCDF public feed data.
    connect-src 'self' 
        https://maps.googleapis.com 
        https://maps.gstatic.com 
        https://rss.app 
        https://www.facebook.com;

    # 4. Styling
    # - 'unsafe-inline': React Native Web relies on CSS-in-JS injection.
    # - fonts.googleapis.com: For external typography.
    style-src 'self' 
        'unsafe-inline' 
        https://fonts.googleapis.com;

    # 5. Images & Tiles
    # - data:/blob: Required for React Native Image components.
    # - fbcdn.net: To display images parsed from the SCDF Facebook feed.
    img-src 'self' 
        data: 
        blob: 
        https://maps.googleapis.com 
        https://maps.gstatic.com 
        https://*.fbcdn.net 
        https://scontent.facebook.com;

    # 6. Typography
    font-src 'self' 
        data: 
        https://fonts.gstatic.com;

    # 7. Embedding & Objects
    # - Prevent <object> or <embed> tags (Flash/Java vectors).
    object-src 'none';
    
    # - Only allow embedding IFrames from trusted widgets (Google).
    frame-src 'self' 
        https://www.google.com;

    # 8. Security Hardening
    # - Block pages from loading if they contain mixed (HTTP) content.
    block-all-mixed-content;
" always;

# ----------------------------------------------------------------------
# Supplementary Security Headers
# ----------------------------------------------------------------------

# Prevent Clickjacking by disallowing the app to be embedded in iframes
add_header X-Frame-Options "DENY" always;

# Prevent MIME-type sniffing (forcing browser to stick to declared content-type)
add_header X-Content-Type-Options "nosniff" always;

# Strict Referrer Policy to prevent leaking user data in URL headers
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
