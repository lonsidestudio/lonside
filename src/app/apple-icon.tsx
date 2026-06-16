import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#050505',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '40px',
        }}
      >
        <span
          style={{
            color: '#7c3aed',
            fontSize: '110px',
            fontWeight: '900',
            fontFamily: 'monospace',
            lineHeight: 1,
          }}
        >
          L
        </span>
      </div>
    ),
    { ...size }
  );
}
