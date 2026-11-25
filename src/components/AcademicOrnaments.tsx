import React from 'react';

/**
 * Subtle, low-opacity repeating SVG pattern of faint lines and nodes
 * representing communication networks for the Dashboard Hero background.
 * Confined strictly to the hero container with a soft fade mask so headline
 * prose and downstream data tables remain unobstructed.
 */
export const CommunicationNetworkHeroPattern: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const uid = React.useId().replace(/:/g, '');
  const patternId = `seek-network-pattern-${uid}`;
  const fadeMaskId = `seek-network-fade-${uid}`;
  const fadeGradId = `seek-network-grad-${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <pattern
          id={patternId}
          width="180"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          {/* Faint communication network lines */}
          <path
            d="M14 92 L68 38 L132 62 L176 22"
            stroke="#8FC4EA"
            strokeWidth="0.9"
            strokeOpacity="0.34"
            fill="none"
          />
          <path
            d="M68 38 L104 16 L166 88 L132 62"
            stroke="#B8D9F5"
            strokeWidth="0.85"
            strokeOpacity="0.48"
            fill="none"
          />
          <path
            d="M0 44 L68 38 M132 62 L180 68"
            stroke="#8FC4EA"
            strokeWidth="0.75"
            strokeDasharray="2 4"
            strokeOpacity="0.28"
            fill="none"
          />
          <path
            d="M28 112 Q92 84 166 88"
            stroke="#34495E"
            strokeWidth="0.7"
            strokeDasharray="2 5"
            strokeOpacity="0.12"
            fill="none"
          />

          {/* Subtle signal ring around primary hub node */}
          <circle
            cx="68"
            cy="38"
            r="14"
            stroke="#B8D9F5"
            strokeWidth="0.8"
            strokeOpacity="0.45"
            fill="none"
          />
          <circle
            cx="132"
            cy="62"
            r="10"
            stroke="#8FC4EA"
            strokeWidth="0.75"
            strokeDasharray="2 3"
            strokeOpacity="0.32"
            fill="none"
          />

          {/* Faint network nodes (soft blue primary + subtle navy accent) */}
          <circle cx="14" cy="92" r="2" fill="#8FC4EA" fillOpacity="0.32" />
          <circle
            cx="68"
            cy="38"
            r="2.6"
            fill="#FFFEF8"
            stroke="#34495E"
            strokeWidth="1"
            strokeOpacity="0.22"
          />
          <circle cx="68" cy="38" r="1.1" fill="#8FC4EA" fillOpacity="0.55" />
          <circle cx="104" cy="16" r="1.8" fill="#8FC4EA" fillOpacity="0.35" />
          <circle
            cx="132"
            cy="62"
            r="2.4"
            fill="#DCEEFF"
            stroke="#8FC4EA"
            strokeWidth="0.9"
            strokeOpacity="0.48"
          />
          <circle cx="166" cy="88" r="1.8" fill="#34495E" fillOpacity="0.16" />
          <circle cx="176" cy="22" r="1.6" fill="#8FC4EA" fillOpacity="0.35" />
        </pattern>

        <linearGradient id={fadeGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0.18" />
          <stop offset="45%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0.95" />
        </linearGradient>

        <mask id={fadeMaskId}>
          <rect width="100%" height="100%" fill={`url(#${fadeGradId})`} />
        </mask>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill={`url(#${patternId})`}
        mask={`url(#${fadeMaskId})`}
      />
    </svg>
  );
};

/**
 * Abstract geometric & communication-network focal accent for the Dashboard header.
 * Uses soft blue (#8FC4EA / #B8D9F5) as primary ornament color and restrained
 * navy (#34495E) as minimal structural accent. No logos or emblems invented.
 */
export const CommunicationNetworkHeroAccent: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <svg
      viewBox="0 0 360 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Subtle concentric communication signal arcs */}
      <circle
        cx="275"
        cy="68"
        r="54"
        stroke="#B8D9F5"
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      <circle
        cx="275"
        cy="68"
        r="34"
        stroke="#8FC4EA"
        strokeWidth="1"
        opacity="0.7"
      />
      <circle
        cx="275"
        cy="68"
        r="16"
        stroke="#B8D9F5"
        strokeWidth="1"
      />

      {/* Stakeholder & public communication network lines */}
      <path
        d="M42 96 L116 54 L196 82 L275 68 L334 34"
        stroke="#8FC4EA"
        strokeWidth="1.15"
        opacity="0.8"
      />
      <path
        d="M116 54 L168 24 L275 68 L318 112"
        stroke="#B8D9F5"
        strokeWidth="1"
      />
      <path
        d="M68 118 Q170 98 275 68"
        stroke="#34495E"
        strokeWidth="0.9"
        strokeDasharray="2 4"
        opacity="0.28"
      />

      {/* Geometric alignment rule */}
      <line
        x1="12"
        y1="68"
        x2="348"
        y2="68"
        stroke="#B8D9F5"
        strokeWidth="0.75"
        opacity="0.6"
      />

      {/* Network nodes (soft blue primary + subtle navy focal nodes) */}
      <circle cx="42" cy="96" r="3" fill="#B8D9F5" stroke="#8FC4EA" strokeWidth="1" />
      <circle cx="116" cy="54" r="3.5" fill="#FFFEF8" stroke="#34495E" strokeWidth="1.2" opacity="0.6" />
      <circle cx="168" cy="24" r="2.5" fill="#8FC4EA" />
      <circle cx="196" cy="82" r="3" fill="#DCEEFF" stroke="#8FC4EA" strokeWidth="1" />
      <circle cx="275" cy="68" r="4.5" fill="#FFFEF8" stroke="#34495E" strokeWidth="1.4" opacity="0.72" />
      <circle cx="275" cy="68" r="1.8" fill="#8FC4EA" />
      <circle cx="334" cy="34" r="3" fill="#8FC4EA" opacity="0.85" />
      <circle cx="318" cy="112" r="2.5" fill="#34495E" opacity="0.35" />
    </svg>
  );
};

/**
 * Quiet editorial section divider with a minimal 3-node communication arc.
 */
export const EditorialSectionDivider: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center gap-3 ${className}`}
    >
      <div className="h-px flex-1 bg-[#DCEEFF]" />
      <svg
        width="44"
        height="12"
        viewBox="0 0 44 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M4 6 Q22 1 40 6"
          stroke="#8FC4EA"
          strokeWidth="1"
        />
        <circle cx="4" cy="6" r="2" fill="#B8D9F5" />
        <circle cx="22" cy="3.5" r="2.2" fill="#34495E" opacity="0.45" />
        <circle cx="40" cy="6" r="2" fill="#8FC4EA" />
      </svg>
      <div className="h-px flex-1 bg-[#DCEEFF]" />
    </div>
  );
};

/**
 * Thin geometric connection-line background pattern for the top application header.
 * Uses consistent soft blue (#8FC4EA / #B8D9F5 / #DCEEFF) at low opacity so
 * header typography and controls remain crisp and unobstructed.
 */
export const HeaderConnectionPattern: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const uid = React.useId().replace(/:/g, '');
  const patternId = `seek-header-conn-${uid}`;
  const maskId = `seek-header-mask-${uid}`;
  const gradId = `seek-header-grad-${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <pattern
          id={patternId}
          width="240"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          {/* Thin geometric communication connection lines */}
          <path
            d="M0 42 L56 18 L124 38 L184 14 L240 42"
            stroke="#8FC4EA"
            strokeWidth="0.8"
            strokeOpacity="0.34"
            fill="none"
          />
          <path
            d="M56 18 L92 50 L184 14"
            stroke="#B8D9F5"
            strokeWidth="0.75"
            strokeOpacity="0.52"
            fill="none"
          />
          <line
            x1="16"
            y1="14"
            x2="224"
            y2="14"
            stroke="#DCEEFF"
            strokeWidth="0.7"
            strokeDasharray="3 5"
            strokeOpacity="0.8"
          />

          {/* Subtle connection nodes */}
          <circle cx="56" cy="18" r="2" fill="#FFFEF8" stroke="#8FC4EA" strokeWidth="0.9" strokeOpacity="0.65" />
          <circle cx="92" cy="50" r="1.5" fill="#B8D9F5" fillOpacity="0.65" />
          <circle cx="124" cy="38" r="2" fill="#DCEEFF" stroke="#8FC4EA" strokeWidth="0.85" strokeOpacity="0.55" />
          <circle cx="184" cy="14" r="2.2" fill="#FFFEF8" stroke="#8FC4EA" strokeWidth="0.9" strokeOpacity="0.65" />
          <circle cx="184" cy="14" r="0.9" fill="#8FC4EA" fillOpacity="0.6" />
        </pattern>

        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0.22" />
          <stop offset="50%" stopColor="white" stopOpacity="0.75" />
          <stop offset="100%" stopColor="white" stopOpacity="0.35" />
        </linearGradient>

        <mask id={maskId}>
          <rect width="100%" height="100%" fill={`url(#${gradId})`} />
        </mask>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill={`url(#${patternId})`}
        mask={`url(#${maskId})`}
      />
    </svg>
  );
};
