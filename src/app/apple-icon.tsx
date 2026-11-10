import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '36px',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontSize: '96px',
            fontWeight: '700',
            fontFamily: 'monospace',
            lineHeight: 1,
            letterSpacing: '-2px',
          }}
        >
          L·
        </span>
      </div>
    ),
    { ...size }
  );
}
