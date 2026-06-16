import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: '7px',
          border: '1px solid rgba(124,58,237,0.4)',
        }}
      >
        <span
          style={{
            color: '#7c3aed',
            fontSize: '18px',
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
