import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: '7px',
          border: '1.5px solid rgba(124,58,237,0.5)',
          boxShadow: '0 0 8px rgba(124,58,237,0.3)',
        }}
      >
        <span
          style={{
            color: '#8b5cf6',
            fontSize: '17px',
            fontWeight: '900',
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
