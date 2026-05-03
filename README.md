# @crewone/lighting-diagram

> Top-down SVG lighting setup diagram component for React. Built and used in production by [CrewOne](https://crewone.ai/), the AI pre-production SaaS for indie filmmakers.

![npm](https://img.shields.io/npm/v/@crewone/lighting-diagram)
![license](https://img.shields.io/npm/l/@crewone/lighting-diagram)

A drop-in React component that renders a top-down view of a photography lighting setup — subject in the centre, camera at the bottom, key / fill / rim / hair / background / accent lights placed by angle and distance, with reflectors and modifiers.

## Why

Pre-production for commercial photography typically describes lighting in dense English text ("120cm Octa key 45° camera-right, 60×90 softbox fill camera-left low, strip rim camera-back-right…"). Verbal descriptions are easy to misread on set. This component takes a structured lighting plan and draws an unambiguous overhead diagram.

## Install

```bash
npm install @crewone/lighting-diagram
```

Peer dependency: React 18+.

## Usage

```tsx
import { LightingDiagram, type LightingDiagramData } from '@crewone/lighting-diagram'

const data: LightingDiagramData = {
  style_name: 'Clamshell 夾光',
  background: 'white seamless 2.7m',
  lights: [
    {
      role: 'key',
      modifier: '120cm Octa',
      angle_deg: 45,        // 0=behind camera, 90=camera-right, 180=behind subject, 270=camera-left
      elevation: 'high',    // low / eye / high / top
      distance: 'mid',      // near / mid / far
      power: '1/1',
      color: '5500K',
    },
    {
      role: 'fill',
      modifier: '60×90 softbox',
      angle_deg: 315,
      elevation: 'low',
      distance: 'mid',
      power: '1/4',
      color: '',
    },
  ],
  modifiers: [
    { type: 'white V-flat', angle_deg: 270, note: 'fill shadow side' },
  ],
}

export default function App() {
  return <LightingDiagram data={data} locale="en" />
}
```

## Angle convention

The component uses a strict, on-set-friendly angle convention:

```
                     180° (rim / back-light)
                          ▲
                          │
   270° (camera-left) ────●──── 90° (camera-right)
                          │
                          ▼
                       0° (camera, on-axis with lens)
```

- 0° — directly behind the camera, on-axis with the lens
- 45° — camera-right front (classic Rembrandt key position)
- 90° — directly camera-right (side light)
- 135° — camera-right back
- 180° — directly behind the subject (rim / back-light)
- 225° — camera-left back
- 270° — directly camera-left
- 315° — camera-left front

Increases clockwise from the camera's perspective.

## Props

```ts
type LightingDiagramData = {
  style_name?: string                  // e.g. '蝶光 / Butterfly', 'Rembrandt'
  lights?: LightEntry[]                // 1-5 typical
  modifiers?: ModifierEntry[]          // reflectors / flags / scrims; can be empty
  background?: string                  // e.g. 'white seamless', 'black velvet', 'natural — beach golden hour'
}

type LightEntry = {
  role?: 'key' | 'fill' | 'rim' | 'hair' | 'background' | 'accent' | 'kicker' | 'practical'
  modifier?: string                    // '120cm Octa', 'beauty dish + grid', 'bare bulb'
  angle_deg?: number                   // 0-359, see convention above
  elevation?: 'low' | 'eye' | 'high' | 'top'
  distance?: 'near' | 'mid' | 'far'    // near < 1m, mid 1-2m, far > 2m
  power?: string                       // '1/1', '1/2', 'f/8', etc.
  color?: string                       // '5500K', '1/2 CTO', 'blue gel'
}

type ModifierEntry = {
  type?: string                        // 'white V-flat', 'silver reflector', 'black flag'
  angle_deg?: number
  note?: string                        // 'fill shadow side', 'control spill'
}
```

Component props:

```ts
<LightingDiagram
  data={data}                          // LightingDiagramData | null
  locale="zh-TW" | "en"                // optional, default 'zh-TW'
/>
```

## Role colours

The component assigns a consistent colour per light role for quick visual parsing on set:

- **key** — amber (#fbbf24)
- **fill** — blue (#60a5fa)
- **rim** — pink (#f472b6)
- **hair** — violet (#a78bfa)
- **background** — green (#34d399)
- **accent** — rose (#fb7185)
- **kicker** — cyan (#22d3ee)
- **practical** — yellow (#facc15)

## CSS variables

The component reads several CSS custom properties for theming. Define in your app's global CSS:

```css
:root {
  --violet: #8b5cf6;
  --violet-2: #a78bfa;
  --violet-dim: rgba(139, 92, 246, 0.15);
  --border: rgba(255, 255, 255, 0.1);
  --text: #fff;
  --text-2: rgba(255, 255, 255, 0.7);
  --text-3: rgba(255, 255, 255, 0.5);
  --text-4: rgba(255, 255, 255, 0.4);
}
```

Defaults assume a dark UI. Adjust to taste.

## Real-world use

This component drives the lighting setup view in [CrewOne](https://crewone.ai/) commercial photography pre-production. Users select photographer style anchors (Tim Walker, Annie Leibovitz, Mika Ninagawa, Chen Man, etc.) and receive a generated `LightingDiagramData` object that this component renders.

If you want the upstream pipeline (LLM-generated `LightingDiagramData` from a brief), check out CrewOne directly. This package is the rendering layer only.

## License

MIT — © Way Directs.
