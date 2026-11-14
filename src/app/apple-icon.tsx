import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          borderRadius: '44px',
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontSize: '112px',
            fontWeight: 800,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            lineHeight: 1,
            letterSpacing: '-5px',
            transform: 'translateY(-2px)',
          }}
        >
          L.
        </span>
      </div>
    ),
    { ...size }
  );
}
