import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '700',
            fontFamily: 'monospace',
            lineHeight: 1,
            letterSpacing: '-1px',
          }}
        >
          L·
        </span>
      </div>
    ),
    { ...size }
  );
}
