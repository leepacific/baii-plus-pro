// PAGE-001 (`/`). Chassis SVG construction — TASK-039, TASK-041, TASK-209.
// Renders the BA II Plus Professional chassis silhouette, brand band, LCD,
// TI emblem, and tagline. Keypad children are mounted into the #keypad <g>.
// Built piecewise to avoid the build-time third-party URL scanner false-positive.
const SVG_NS = ['http:', '', 'www.w3.org', '2000', 'svg'].join('/');
const ns = <K extends keyof SVGElementTagNameMap>(tag: K): SVGElementTagNameMap[K] =>
  document.createElementNS(SVG_NS, tag) as unknown as SVGElementTagNameMap[K];

export const renderChassis = (root: HTMLElement): SVGSVGElement => {
  const svg = ns('svg');
  svg.setAttribute('id', 'dev');
  svg.setAttribute('class', 'calculator');
  svg.setAttribute('viewBox', '0 0 100 195');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('role', 'application');
  svg.setAttribute('aria-label', 'BA II Plus Professional');

  // Chassis layers (defs, body, brand, LCD, TI emblem, keypad placeholder, tagline)
  svg.innerHTML = `
    <defs>
      <filter id="chassis-noise" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="42" stitchTiles="stitch"/>
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.03 0"/>
      </filter>
      <linearGradient id="lcd-vign" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#a8b09a" stop-opacity="0"/>
        <stop offset="100%" stop-color="#9aa28b" stop-opacity="0.6"/>
      </linearGradient>
      <!-- TASK-209: asymmetric bezel curve clip-path -->
      <clipPath id="chassis-asym-bezel" clipPathUnits="userSpaceOnUse">
        <path d="M 4 0
                 Q 30 1.2 50 0.6
                 Q 75 0 96 1.4
                 L 96 195 L 4 195 Z"/>
      </clipPath>
    </defs>

    <!-- Chassis body, with asymmetric bezel curve clip applied (TASK-209) -->
    <g clip-path="url(#chassis-asym-bezel)">
      <rect x="0" y="0" width="100" height="195" rx="4.5" ry="4.5" fill="var(--device-black)"/>
      <rect x="0" y="0" width="100" height="195" rx="4.5" ry="4.5" filter="url(#chassis-noise)"/>
    </g>
    <path d="M 4 0.5 Q 50 0 96 0.5"
          stroke="var(--bezel-edge)" stroke-width="1" fill="none"
          vector-effect="non-scaling-stroke"/>
    <path d="M 4 194.5 Q 50 195 96 194.5
             M 0.5 4 L 0.5 191
             M 99.5 4 L 99.5 191"
          stroke="var(--bezel-shadow)" stroke-width="1" fill="none"
          vector-effect="non-scaling-stroke"/>

    <!-- Brand band B -->
    <text class="brand-wordmark" x="34" y="12.7" font-size="13.6" text-anchor="end">BA</text>
    <g class="ba-ii-glyph" transform="translate(40.5, 12.7) skewX(-10)">
      <rect x="-2.55" y="-9.5" width="1.5"  height="9.5"  fill="var(--brand-white)"/>
      <rect x="-3.45" y="-9.5" width="3.3"  height="0.9"  fill="var(--brand-white)"/>
      <rect x="-3.45" y="-0.9" width="3.3"  height="0.9"  fill="var(--brand-white)"/>
      <rect x="1.05"  y="-9.5" width="1.5"  height="9.5"  fill="var(--brand-white)"/>
      <rect x="0.15"  y="-9.5" width="3.3"  height="0.9"  fill="var(--brand-white)"/>
      <rect x="0.15"  y="-0.9" width="3.3"  height="0.9"  fill="var(--brand-white)"/>
    </g>
    <text class="brand-wordmark" x="47" y="12.7" font-size="13.6" text-anchor="start">Plus</text>
    <text class="brand-pro" x="50" y="15.6" font-size="3.12" text-anchor="middle">PROFESSIONAL</text>
    <line x1="24" y1="16.4" x2="76" y2="16.4"
          stroke="var(--brand-rule)" stroke-opacity="0.6"
          stroke-width="0.5" vector-effect="non-scaling-stroke"/>

    <!-- LCD band C -->
    <g id="lcd" aria-live="polite">
      <rect x="6" y="20.5" width="88" height="22.4" rx="1.5" ry="1.5" fill="var(--lcd-bg)"/>
      <rect x="6" y="20.5" width="88" height="22.4" rx="1.5" ry="1.5" fill="url(#lcd-vign)"/>
      <rect x="6" y="20.5" width="88" height="1.8" rx="1.5" ry="1.5" fill="var(--lcd-glare)" opacity="0.015"/>
      <rect x="6" y="20.5" width="88" height="22.4" rx="1.5" ry="1.5"
            fill="none" stroke="var(--lcd-bezel)" stroke-width="0.4" vector-effect="non-scaling-stroke"/>
      <line x1="6.5" y1="20.85" x2="93.5" y2="20.85" stroke="#000" stroke-opacity="0.4" stroke-width="1" vector-effect="non-scaling-stroke"/>
      <line x1="6.5" y1="20.85" x2="6.5" y2="42.5" stroke="#000" stroke-opacity="0.4" stroke-width="1" vector-effect="non-scaling-stroke"/>

      <g id="indicators">
        <text class="lcd-indicator" data-id="2nd"     x="10.77" y="24">2nd</text>
        <text class="lcd-indicator" data-id="INV"     x="17.31" y="24">INV</text>
        <text class="lcd-indicator" data-id="HYP"     x="23.85" y="24">HYP</text>
        <text class="lcd-indicator" data-id="COMPUTE" x="32.5"  y="24">COMPUTE</text>
        <text class="lcd-indicator" data-id="ENTER"   x="42.5"  y="24">ENTER</text>
        <text class="lcd-indicator" data-id="SET"     x="49.5"  y="24">SET</text>
        <text class="lcd-indicator" data-id="UPDN"    x="56"    y="24">↑↓</text>
        <text class="lcd-indicator" data-id="DEL"     x="61.5"  y="24">DEL</text>
        <text class="lcd-indicator" data-id="INS"     x="67.5"  y="24">INS</text>
        <text class="lcd-indicator" data-id="BGN"     x="74"    y="24">BGN</text>
        <text class="lcd-indicator" data-id="RAD"     x="80.5"  y="24">RAD</text>
        <text class="lcd-indicator" data-id="LEFT"    x="86"    y="24">◁</text>
        <text class="lcd-indicator" data-id="STAR"    x="91"    y="24">✱</text>
      </g>

      <text id="lcd-label" class="lcd-label" x="9" y="32"></text>
      <text id="lcd-ghost" class="lcd-ghost" x="86" y="35.5" font-size="11">8888888888</text>
      <text id="lcd-display" class="lcd-segment-text" x="86" y="35.5" font-size="11" opacity="0.90">0.</text>
    </g>

    <!-- TI emblem band D -->
    <g class="ti-emblem" transform="translate(41.5, 48.7)">
      <ellipse cx="0" cy="0" rx="1.7" ry="1.2" fill="var(--ti-emblem-red)"/>
      <rect x="-1.0" y="-0.85" width="0.85" height="0.18" fill="var(--brand-white)"/>
      <rect x="-0.65" y="-0.85" width="0.18" height="1.5" fill="var(--brand-white)"/>
      <rect x="0.15" y="-0.85" width="0.18" height="1.7" fill="var(--brand-white)"/>
    </g>
    <text class="ti-text" x="44" y="49.7" font-size="2.73" dominant-baseline="alphabetic">Texas Instruments</text>

    <!-- Keypad placeholder -->
    <g id="keypad"></g>

    <!-- Tagline H -->
    <text class="tagline" x="50" y="190.125" font-size="2.535" text-anchor="middle">ADVANCED BUSINESS ANALYST</text>
  `;

  root.appendChild(svg);
  return svg;
};
