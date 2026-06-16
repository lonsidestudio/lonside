import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Design & Ingénierie Digitale Augmentés';
  const description =
    searchParams.get('description') ||
    'Sites internet haut de gamme & applications sur-mesure par des experts augmentés par l\'IA.';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#050505',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '64px',
          position: 'relative',
          fontFamily: 'system-ui, sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Purple glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
          }}
        />
        {/* Bottom gradient bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(to right, #7c3aed, #a855f7, #7c3aed)',
          }}
        />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '48px' }}>
          <div
            style={{
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.4)',
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
              fontSize: '24px',
              fontWeight: '900',
              color: '#7c3aed',
              fontFamily: 'monospace',
            }}
          >
            L
          </div>
          <span style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
            lonside
            <span style={{ color: '#7c3aed' }}>.</span>
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            color: '#ffffff',
            fontSize: title.length > 50 ? '44px' : '54px',
            fontWeight: '700',
            lineHeight: '1.1',
            marginBottom: '20px',
            maxWidth: '900px',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            color: '#94a3b8',
            fontSize: '22px',
            maxWidth: '800px',
            lineHeight: '1.5',
          }}
        >
          {description}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
