/* Original environment illustrations (no characters) used behind service and
   video cards until the official scene renders are dropped into public/zaghalil/scenes. */
import type { ReactNode } from "react";

const K = "#1f1f1f";
const s = { stroke: K, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const spin = { transformBox: "fill-box" as const, transformOrigin: "center", animation: "spin 1.2s linear infinite" };
const bob = (d = 0) => ({ transformBox: "fill-box" as const, animation: `float 4s ease-in-out ${d}s infinite` });

function Frame({ children, viewBox, title }: { children: ReactNode; viewBox: string; title: string }) {
  return (
    <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-label={title}>
      {children}
    </svg>
  );
}

export function StudioScene() {
  return (
    <Frame viewBox="0 0 400 250" title="استوديو تصوير">
      <rect width="400" height="250" fill="#CFE6F2" />
      {/* skyline window */}
      <rect x="40" y="40" width="320" height="120" rx="10" fill="#9FCBE3" {...s} />
      {[60, 95, 130, 250, 285, 320].map((x, i) => (
        <rect key={x} x={x} y={160 - (i % 3) * 18 - 40} width="26" height={(i % 3) * 18 + 40} fill="#7FB2D1" />
      ))}
      <rect x="170" y="88" width="50" height="72" fill="#86B9D6" />
      {[0, 1, 2].map((i) => (
        <line key={i} x1={40 + i * 107} y1="40" x2={40 + i * 107} y2="160" stroke={K} strokeWidth="3" />
      ))}
      {/* ceiling rig + lights */}
      <rect x="0" y="0" width="400" height="22" fill="#3B3B46" />
      {[80, 200, 320].map((x, i) => (
        <g key={x}>
          <path d={`M${x - 26} 30 L${x + 26} 30 L${x + 70} 250 L${x - 70} 250Z`} fill="#FFF6C9" opacity=".35" style={{ animation: `pulse 3s ease-in-out ${i * 0.6}s infinite` }} />
          <rect x={x - 16} y="16" width="32" height="18" rx="5" fill="#55555F" {...s} />
          <ellipse cx={x} cy="34" rx="11" ry="4" fill="#FFE27A" />
        </g>
      ))}
      {/* floor */}
      <path d="M0 170 H400 V250 H0Z" fill="#9AA6B8" />
      <ellipse cx="200" cy="205" rx="150" ry="22" fill="#B7C1D0" />
      {/* camera on tripod */}
      <g>
        <path d="M70 230 L95 150 L120 230 M95 150 V232" fill="none" {...s} />
        <rect x="58" y="118" width="80" height="44" rx="8" fill="#4A4A55" {...s} />
        <rect x="130" y="126" width="26" height="28" rx="5" fill="#2F2F38" {...s} />
        <circle cx="74" cy="112" r="10" fill="#4A4A55" {...s} />
        <circle cx="104" cy="112" r="10" fill="#4A4A55" {...s} />
        <circle cx="128" cy="140" r="5" fill="#E8483B" style={{ animation: "pulse 1.2s ease-in-out infinite" }} />
      </g>
      {/* megaphone */}
      <g style={bob(0.4)}>
        <path d="M262 120 L320 92 L320 166 L262 140Z" fill="#F7953E" {...s} />
        <rect x="244" y="118" width="22" height="26" rx="5" fill="#fff" {...s} />
        <path d="M330 110 q12 18 0 36 M342 100 q20 28 0 56" fill="none" {...s} strokeWidth={4} stroke="#F7953E" />
      </g>
      <rect x="166" y="54" width="70" height="22" rx="11" fill="#E8483B" {...s} />
      <text x="201" y="70" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily="sans-serif">ON AIR</text>
    </Frame>
  );
}

export function RecordingScene() {
  const notes = [
    [70, 70, "#F7953E"], [120, 46, "#A874A4"], [290, 54, "#40A42F"], [340, 84, "#E8483B"], [210, 30, "#3BA6D9"],
  ] as const;
  return (
    <Frame viewBox="0 0 400 250" title="استوديو تسجيل">
      <rect width="400" height="250" fill="#B98454" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={i * 45} y="0" width="42" height="150" fill={i % 2 ? "#C9955F" : "#B17C4C"} />
      ))}
      {/* acoustic foam */}
      {[40, 300].map((x) => (
        <g key={x}>
          <rect x={x} y="24" width="62" height="74" rx="6" fill="#5A4A6B" {...s} />
          {[0, 1, 2].map((r) => <line key={r} x1={x + 4} x2={x + 58} y1={44 + r * 18} y2={44 + r * 18} stroke="#433553" strokeWidth="4" />)}
        </g>
      ))}
      {notes.map(([x, y, c], i) => (
        <g key={i} style={bob(i * 0.5)}>
          <circle cx={x} cy={y + 16} r="7" fill={c} {...s} strokeWidth={2.5} />
          <path d={`M${x + 7} ${y + 16} V${y} l12 4`} fill="none" {...s} strokeWidth={2.5} />
        </g>
      ))}
      {/* mic */}
      <g>
        <path d="M200 150 V108" {...s} strokeWidth={5} />
        <circle cx="200" cy="92" r="26" fill="#2E2E36" {...s} />
        <rect x="186" y="66" width="28" height="44" rx="14" fill="#C7C7D1" {...s} />
        {[76, 86, 96].map((y) => <line key={y} x1="190" x2="210" y1={y} y2={y} stroke={K} strokeWidth="2" />)}
      </g>
      {/* headphones */}
      <g transform="translate(300 118)">
        <path d="M0 22 a26 26 0 0 1 52 0" fill="none" {...s} strokeWidth={5} />
        <rect x="-6" y="16" width="14" height="22" rx="6" fill="#A874A4" {...s} />
        <rect x="44" y="16" width="14" height="22" rx="6" fill="#A874A4" {...s} />
      </g>
      {/* mixing console */}
      <path d="M0 160 L400 160 L400 250 L0 250Z" fill="#3A3A44" {...s} />
      <path d="M10 170 H390 V244 H10Z" fill="#4C4C58" />
      {Array.from({ length: 18 }, (_, i) => (
        <g key={i}>
          <line x1={24 + i * 20.5} x2={24 + i * 20.5} y1="200" y2="238" stroke="#2A2A31" strokeWidth="4" strokeLinecap="round" />
          <rect x={18 + i * 20.5} y={206 + ((i * 7) % 22)} width="12" height="8" rx="2" fill="#E9E9EF" style={{ animation: `float ${2 + (i % 4) * 0.4}s ease-in-out ${i * 0.1}s infinite` }} />
          {[178, 190].map((y) => <circle key={y} cx={24 + i * 20.5} cy={y} r="4" fill={["#F7953E", "#4FCB3B", "#A7D9EC", "#FFCC1A"][(i + y) % 4]} />)}
        </g>
      ))}
    </Frame>
  );
}

export function TheatreScene() {
  return (
    <Frame viewBox="0 0 400 250" title="مسرح">
      <rect width="400" height="250" fill="#1E2340" />
      {[["#FFD84D", 120, -18], ["#B98BE8", 200, 0], ["#62D3F0", 280, 18]].map(([c, x, r], i) => (
        <path
          key={i}
          d={`M${x} 0 L${Number(x) - 50} 190 L${Number(x) + 50} 190Z`}
          fill={c as string}
          opacity=".33"
          style={{ transformBox: "fill-box", transformOrigin: "top", animation: `sway 4s ease-in-out ${i * 0.7}s infinite alternate`, rotate: `${r}deg` }}
        />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={(i * 53) % 400} cy={20 + ((i * 37) % 120)} r="2" fill="#fff" style={{ animation: `pulse ${1.5 + (i % 3)}s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
      {/* stage */}
      <path d="M30 175 H370 L392 205 H8Z" fill="#B66A34" {...s} />
      <path d="M8 205 H392 V214 H8Z" fill="#8E4F23" {...s} />
      {/* curtains */}
      <path d="M0 0 H70 C66 70 80 140 58 214 H0Z" fill="#C2263A" {...s} />
      <path d="M400 0 H330 C334 70 320 140 342 214 H400Z" fill="#C2263A" {...s} />
      <path d="M0 0 H400 V28 C330 44 270 30 200 40 C130 30 70 44 0 28Z" fill="#A81E31" {...s} />
      {[18, 36, 364, 382].map((x) => <path key={x} d={`M${x} 30 C${x - 4} 90 ${x + 6} 150 ${x} 210`} stroke="#8F1828" strokeWidth="4" fill="none" />)}
      <circle cx="62" cy="120" r="7" fill="#FFCC1A" {...s} />
      <circle cx="338" cy="120" r="7" fill="#FFCC1A" {...s} />
      {/* audience */}
      <path d="M0 250 V226 Q400 212 400 226 V250Z" fill="#141729" />
      {Array.from({ length: 13 }, (_, i) => (
        <g key={i} style={{ transformBox: "fill-box", animation: `float ${1.6 + (i % 3) * 0.3}s ease-in-out ${i * 0.15}s infinite` }}>
          <circle cx={16 + i * 31} cy={226 + (i % 2) * 6} r="13" fill={["#3A2E4F", "#4A3A5E", "#2E2640"][i % 3]} />
        </g>
      ))}
    </Frame>
  );
}

/* ───────── 9:16 video backdrops ───────── */
export function VideoBackdrop({ scene }: { scene: "room" | "night" | "living" | "fan" }) {
  if (scene === "night")
    return (
      <Frame viewBox="0 0 270 480" title="ليل وقمر">
        <rect width="270" height="480" fill="#1E2A63" />
        <circle cx="196" cy="112" r="58" fill="#FFF3B0" opacity=".12" />
        <path d="M196 66 a46 46 0 1 0 40 70 a38 38 0 1 1 -40 -70Z" fill="#FFF3B0" />
        {[[40, 50], [90, 120], [150, 40], [230, 220], [60, 200], [120, 260]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y - 7} l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2Z`} fill="#fff" style={{ transformBox: "fill-box", transformOrigin: "center", animation: `pulse ${1.4 + i * 0.3}s ease-in-out infinite` }} />
        ))}
        <path d="M0 330 H270 V480 H0Z" fill="#6E4C6F" />
        <rect x="0" y="318" width="270" height="18" fill="#57405C" {...s} />
        {[30, 110, 190].map((x) => (
          <rect key={x} x={x} y="370" width="52" height="66" rx="4" fill="#F6D27C" {...s} />
        ))}
      </Frame>
    );
  if (scene === "living")
    return (
      <Frame viewBox="0 0 270 480" title="أوضة المعيشة">
        <rect width="270" height="480" fill="#F2B7A3" />
        <rect y="0" width="270" height="40" fill="#C6C3EE" />
        <ellipse cx="80" cy="150" rx="34" ry="44" fill="#DDEFF7" {...s} />
        <path d="M60 160 a20 20 0 0 1 40 0Z" fill="#E8483B" {...s} />
        <path d="M60 160 h40" stroke="#4FCB3B" strokeWidth="5" />
        <path d="M0 330 H270 V480 H0Z" fill="#D9E3F5" />
        <path d="M150 300 h110 v70 h-110Z" fill="#3E7CC9" {...s} />
        <path d="M140 290 q0 -40 30 -40 h60 q30 0 30 40 v20 h-120Z" fill="#5B97E0" {...s} />
        <ellipse cx="80" cy="330" rx="34" ry="8" fill="#3BA383" {...s} />
        <path d="M80 330 V392" {...s} strokeWidth={5} />
        <path d="M70 330 q10 -40 0 -70 M88 330 q4 -30 16 -60" fill="none" stroke="#3BA383" strokeWidth="4" />
        {[[70, 258], [104, 268], [86, 244]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="8" fill="#E8607A" {...s} strokeWidth={2} />)}
      </Frame>
    );
  if (scene === "fan")
    return (
      <Frame viewBox="0 0 270 480" title="أوضة فيها مروحة">
        <rect width="270" height="480" fill="#A9A6D9" />
        {Array.from({ length: 7 }, (_, i) => <rect key={i} x={150 + i * 18} y="0" width="9" height="300" fill="#C2BFEA" />)}
        <circle cx="70" cy="120" r="22" fill="#fff" {...s} />
        <path d="M70 108 v12 l8 6" {...s} fill="none" />
        <path d="M0 340 H270 V480 H0Z" fill="#8FB6C9" />
        <ellipse cx="135" cy="410" rx="120" ry="34" fill="#A7D9EC" {...s} />
        <path d="M120 400 q-40 -90 40 -100 q80 0 50 100 q-40 20 -90 0Z" fill="#FFB52E" {...s} />
        <g>
          <path d="M58 380 V250" {...s} strokeWidth={6} />
          <ellipse cx="58" cy="384" rx="26" ry="8" fill="#D9C7A6" {...s} />
          <circle cx="58" cy="230" r="44" fill="#F3E2B9" {...s} />
          <g style={spin}>
            {[0, 120, 240].map((r) => (
              <ellipse key={r} cx="58" cy="208" rx="11" ry="22" fill="#D6B97C" transform={`rotate(${r} 58 230)`} />
            ))}
          </g>
          <circle cx="58" cy="230" r="8" fill="#B88F4C" {...s} />
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1="58" y1="230" x2={58 + Math.cos((i / 8) * Math.PI * 2) * 44} y2={230 + Math.sin((i / 8) * Math.PI * 2) * 44} stroke={K} strokeWidth="1.5" />
          ))}
        </g>
      </Frame>
    );
  return (
    <Frame viewBox="0 0 270 480" title="أوضة فيها تليفزيون">
      <rect width="270" height="480" fill="#E5BFCB" />
      <rect x="150" y="80" width="100" height="70" rx="6" fill="#BFE6F5" {...s} />
      <path d="M150 115 h100 M200 80 v70" stroke={K} strokeWidth="3" />
      <rect x="18" y="170" width="120" height="78" rx="6" fill="#2D2D2D" {...s} />
      <rect x="26" y="178" width="104" height="62" rx="3" fill="#5E6F8A" style={{ animation: "pulse 2.5s ease-in-out infinite" }} />
      <path d="M0 300 H270 V480 H0Z" fill="#C79BAF" />
      <rect x="10" y="260" width="140" height="18" fill="#8E5C46" {...s} />
      <rect x="160" y="250" width="100" height="16" rx="3" fill="#8E5C46" {...s} />
      <path d="M170 266 V330 M250 266 V330" {...s} strokeWidth={5} />
      <ellipse cx="135" cy="400" rx="110" ry="30" fill="#D58FA8" {...s} />
    </Frame>
  );
}

/** Warm living-room backdrop (no characters) used behind the cast lineup on inner pages. */
export function RoomBackdrop() {
  return (
    <svg viewBox="0 0 1200 520" preserveAspectRatio="xMidYMax slice" className="h-full w-full" aria-hidden>
      <rect width="1200" height="520" fill="#F7DFA6" />
      {Array.from({ length: 13 }, (_, i) => (
        <rect key={i} x={i * 96} y="0" width="48" height="330" fill="#F3D493" opacity=".55" />
      ))}
      {/* window */}
      <g>
        <rect x="700" y="46" width="330" height="210" rx="14" fill="#CFEAF6" stroke="#E2A35A" strokeWidth="14" />
        <path d="M865 46v210M700 151h330" stroke="#E2A35A" strokeWidth="10" />
        <circle cx="960" cy="104" r="26" fill="#FFF3B0" />
        <path d="M730 210c40-30 80-30 120 0M880 220c40-26 80-26 120 0" stroke="#fff" strokeWidth="10" strokeLinecap="round" fill="none" opacity=".8" />
      </g>
      {/* frame + shelf */}
      <rect x="150" y="70" width="150" height="110" rx="10" fill="#FCE3DC" stroke="#E2A35A" strokeWidth="10" />
      <path d="M190 150l30-36 26 26 18-16 22 26z" fill="#A7D9EC" />
      <rect x="360" y="190" width="200" height="14" rx="7" fill="#C98547" />
      <rect x="380" y="146" width="26" height="44" rx="5" fill="#F7953E" />
      <rect x="412" y="156" width="22" height="34" rx="5" fill="#A874A4" />
      <circle cx="510" cy="170" r="20" fill="#4FCB3B" />
      {/* skirting + floor */}
      <rect y="330" width="1200" height="18" fill="#E2A35A" />
      <rect y="348" width="1200" height="172" fill="#E8B477" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${-200 + i * 190} 520 L${60 + i * 150} 348`} stroke="#D89C5E" strokeWidth="4" />
      ))}
      <ellipse cx="600" cy="452" rx="470" ry="54" fill="#F3C98F" opacity=".7" />
    </svg>
  );
}
