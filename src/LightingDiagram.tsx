'use client'

import React from 'react'

// Top-down lighting diagram. Subject sits at center, camera implicit at the
// bottom. Angle convention (degrees) — used everywhere on screen + in the LLM
// schema:
//   0   = behind camera, on-axis with the lens (light appears at the bottom)
//   90  = directly camera-right
//   180 = directly behind subject (rim / backlight; appears at top)
//   270 = directly camera-left
// Increases clockwise from camera viewpoint.

export type LightEntry = {
  role?: string
  modifier?: string
  angle_deg?: number
  elevation?: string
  distance?: string
  power?: string
  color?: string
}

export type ModifierEntry = {
  type?: string
  angle_deg?: number
  note?: string
}

export type LightingDiagramData = {
  style_name?: string
  lights?: LightEntry[]
  modifiers?: ModifierEntry[]
  background?: string
}

const ROLE_COLORS: Record<string, string> = {
  key:        '#fbbf24',  // amber
  fill:       '#60a5fa',  // blue
  rim:        '#f472b6',  // pink
  hair:       '#a78bfa',  // violet
  background: '#34d399',  // green
  accent:     '#fb7185',  // rose
  kicker:     '#22d3ee',  // cyan
  practical:  '#facc15',  // yellow
}

const ROLE_LABELS_ZH: Record<string, string> = {
  key:        '主燈',
  fill:       '補光',
  rim:        '輪廓',
  hair:       '髮燈',
  background: '背景',
  accent:     '重點',
  kicker:     '側後',
  practical:  '實用',
}

function distanceRadius(d?: string, maxR = 130): number {
  switch ((d || '').toLowerCase()) {
    case 'near': return maxR * 0.55
    case 'far':  return maxR * 1.0
    case 'mid':
    default:     return maxR * 0.78
  }
}

function elevationGlyph(e?: string): string {
  switch ((e || '').toLowerCase()) {
    case 'low':  return '↓'
    case 'high': return '↑'
    case 'top':  return '⤒'
    case 'eye':
    default:     return '·'
  }
}

function angleToXY(angleDeg: number, r: number, cx: number, cy: number) {
  // 0° = +y (camera side, down on screen); rotates clockwise.
  const theta = (angleDeg * Math.PI) / 180
  return {
    x: cx + r * Math.sin(theta),
    y: cy + r * Math.cos(theta),
  }
}

export function LightingDiagram({
  data,
  locale = 'zh-TW',
}: {
  data?: LightingDiagramData | null
  locale?: string
}) {
  const isZh = locale === 'zh-TW'

  if (!data || (!data.lights?.length && !data.modifiers?.length)) {
    return (
      <div style={{
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(139,92,246,0.04)',
        border: '1px dashed var(--border)',
        borderRadius: 10,
        color: 'var(--text-4)',
        fontSize: 12,
      }}>
        {isZh ? '燈光配置圖生成中…' : 'Generating lighting diagram…'}
      </div>
    )
  }

  const W = 420
  const H = 340
  const cx = W / 2
  const cy = H / 2 - 6  // bias subject slightly up so camera fits cleanly
  const subjectR = 16
  const cameraY = H - 30
  const ringMaxR = 130

  const lights = data.lights ?? []
  const modifiers = data.modifiers ?? []
  const labelZh = (role?: string) => ROLE_LABELS_ZH[(role || '').toLowerCase()] || role || ''

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {/* Style name + background label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="eyebrow-mono" style={{ fontSize: 10, color: 'var(--violet-2)' }}>
            {isZh ? '燈光配置 · LIGHTING DIAGRAM' : 'LIGHTING DIAGRAM'}
          </span>
          {data.style_name && (
            <span className="chip-product violet font-mono" style={{ height: 20, fontSize: 10 }}>{data.style_name}</span>
          )}
        </div>
        {data.background && (
          <span style={{ fontSize: 10.5, color: 'var(--text-4)', fontFamily: 'var(--font-geist-mono)' }}>
            {isZh ? '背景：' : 'BG: '}{data.background}
          </span>
        )}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="auto"
        style={{ background: 'rgba(20,18,40,0.4)', borderRadius: 10, border: '1px solid var(--border)' }}
        role="img"
        aria-label={isZh ? '燈光配置俯視圖' : 'Top-down lighting diagram'}
      >
        {/* Distance reference rings */}
        {[0.55, 0.78, 1.0].map((f, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={ringMaxR * f}
            fill="none"
            stroke="rgba(139,92,246,0.12)"
            strokeWidth={1}
            strokeDasharray="2 4"
          />
        ))}

        {/* Camera-subject axis line */}
        <line x1={cx} y1={cy} x2={cx} y2={cameraY} stroke="rgba(139,92,246,0.25)" strokeWidth={1} strokeDasharray="3 3" />

        {/* Subject at center */}
        <circle cx={cx} cy={cy} r={subjectR} fill="rgba(139,92,246,0.18)" stroke="#8b5cf6" strokeWidth={1.5} />
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fontFamily="var(--font-geist-mono)" fill="#c4b5fd" fontWeight={600}>
          {isZh ? '主體' : 'SUBJ'}
        </text>

        {/* Camera at bottom */}
        <g>
          <rect x={cx - 18} y={cameraY - 10} width={36} height={20} rx={3} fill="rgba(255,255,255,0.06)" stroke="#94a3b8" strokeWidth={1} />
          <circle cx={cx} cy={cameraY} r={5} fill="none" stroke="#94a3b8" strokeWidth={1.2} />
          <text x={cx} y={cameraY + 26} textAnchor="middle" fontSize={9} fontFamily="var(--font-geist-mono)" fill="#94a3b8">
            {isZh ? '相機' : 'CAM'}
          </text>
        </g>

        {/* Modifiers (passive shapers) — render under lights */}
        {modifiers.map((m, i) => {
          const angle = (typeof m.angle_deg === 'number' ? m.angle_deg : 0) % 360
          const r = ringMaxR * 0.65
          const { x, y } = angleToXY(angle, r, cx, cy)
          const isFlag = (m.type || '').toLowerCase().includes('flag')
          const fill = isFlag ? '#1f2937' : 'rgba(226, 232, 240, 0.55)'
          const stroke = isFlag ? '#475569' : '#cbd5e1'
          // Render modifier as a small rectangle rotated to face the subject.
          return (
            <g key={`m${i}`} transform={`translate(${x} ${y}) rotate(${angle})`}>
              <rect x={-14} y={-3} width={28} height={6} fill={fill} stroke={stroke} strokeWidth={1} rx={1} />
              <text x={0} y={-8} textAnchor="middle" fontSize={9} fontFamily="var(--font-geist-mono)" fill="#cbd5e1" transform={`rotate(${-angle})`}>
                {(m.type || '').replace(/^(white |silver |black |gold )/i, '').slice(0, 10)}
              </text>
            </g>
          )
        })}

        {/* Lights */}
        {lights.map((l, i) => {
          const angle = (typeof l.angle_deg === 'number' ? l.angle_deg : 0) % 360
          const r = distanceRadius(l.distance, ringMaxR)
          const { x, y } = angleToXY(angle, r, cx, cy)
          const color = ROLE_COLORS[(l.role || '').toLowerCase()] || '#fbbf24'
          const dotR = 9
          // Beam cone toward subject
          const beamLen = 22
          const inner = angleToXY(angle, r - beamLen, cx, cy)
          return (
            <g key={`l${i}`}>
              <line x1={x} y1={y} x2={inner.x} y2={inner.y} stroke={color} strokeWidth={2} strokeLinecap="round" opacity={0.55} />
              <circle cx={x} cy={y} r={dotR} fill={color} stroke="#0f0a1e" strokeWidth={1.5} />
              <text x={x} y={y + 3.5} textAnchor="middle" fontSize={10} fontFamily="var(--font-geist-mono)" fill="#0f0a1e" fontWeight={700}>
                {elevationGlyph(l.elevation)}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Legend / light list */}
      {lights.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
          {lights.map((l, i) => {
            const color = ROLE_COLORS[(l.role || '').toLowerCase()] || '#fbbf24'
            const roleLabel = isZh ? labelZh(l.role) : (l.role || '').toUpperCase()
            return (
              <div key={`leg${i}`} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                padding: '8px 10px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border)',
                borderRadius: 8,
              }}>
                <span style={{
                  width: 10,
                  height: 10,
                  marginTop: 4,
                  borderRadius: '50%',
                  background: color,
                  flexShrink: 0,
                }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)' }}>{roleLabel}</span>
                    {l.power && <span className="font-mono" style={{ fontSize: 10, color: 'var(--text-4)' }}>{l.power}</span>}
                  </div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-2)', marginTop: 2, lineHeight: 1.5, fontFamily: 'var(--font-geist-mono)', wordBreak: 'break-word' }}>
                    {l.modifier || '--'}
                  </div>
                  <div style={{ fontSize: 9.5, color: 'var(--text-4)', marginTop: 2, fontFamily: 'var(--font-geist-mono)' }}>
                    {(typeof l.angle_deg === 'number' ? `${l.angle_deg}°` : '')}
                    {l.elevation ? ` · ${l.elevation}` : ''}
                    {l.distance ? ` · ${l.distance}` : ''}
                    {l.color ? ` · ${l.color}` : ''}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modifier list (separate, below lights) */}
      {modifiers.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {modifiers.map((m, i) => (
            <span
              key={`mleg${i}`}
              className="chip-product font-mono"
              style={{ fontSize: 10, height: 22 }}
              title={m.note}
            >
              {m.type}{typeof m.angle_deg === 'number' ? ` · ${m.angle_deg}°` : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
