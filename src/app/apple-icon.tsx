import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0e',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '38px',
          border: '3px solid rgba(124,58,237,0.5)',
          boxShadow: '0 0 40px rgba(124,58,237,0.25)',
        }}
      >
        <span
          style={{
            color: '#8b5cf6',
            fontSize: '100px',
            fontWeight: '900',
            fontFamily: 'monospace',
            lineHeight: 1,
            letterSpacing: '-4px',
          }}
        >
          L·
        </span>
      </div>
    ),
    { ...size }
  );
}
