import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
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
          borderRadius: '8px',
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: 800,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            lineHeight: 1,
            letterSpacing: '-1px',
            transform: 'translateY(-0.5px)',
          }}
        >
          L.
        </span>
      </div>
    ),
    { ...size }
  );
}
