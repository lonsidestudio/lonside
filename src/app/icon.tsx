import { ImageResponse } from 'next/og';

// Google Search Central exige un multiple de 48px carré (48x48, 96x96, etc.)
export const size = { width: 48, height: 48 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '11px',
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontSize: '30px',
            fontWeight: 800,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            lineHeight: 1,
            letterSpacing: '-1.5px',
            transform: 'translateY(-1px)',
          }}
        >
          L.
        </span>
      </div>
    ),
    { ...size }
  );
}
