import React from "react";
import { T } from "./theme";
import { W, C, clamp01, ease3, hash, toBn } from "./motion";
import { Scene } from "./components";
import {
  useTime, Pop, Move, Pulse, Glow, Txt, Chip, Tag, Cross, Check, Stamp, Star, Heart, Smile, Eye, Coin, CoinBag, Plate, Mask, Gavel, Crest, Crown, Bubble,
  Person, Bust, Palace, Prison, Skyline, Ground, Firework, Table, Bunting, Planet, Telescope, Spot, Arrow, Stream, PersonProps,
} from "./art";

// ───────── চরিত্র-প্রিসেট (একই জগৎ, একই রূপ) ─────────
const FOUQUET: PersonProps = { hat: "wig", acc: ["sash"], cloth: T.navy2, cloth2: T.wall, skin: T.skin1, hair: T.hairBrown };
const KING: PersonProps = { hat: "crown", acc: ["cape"], cloth: T.royal, cloth2: T.wall, skin: T.skin1 };
const GUARD: PersonProps = { hat: "helmet", cloth: T.steel, cloth2: T.stone, skin: T.skin3 };
const BOSS: PersonProps = { acc: ["tie"], cloth: T.steel, cloth2: T.wall, skin: T.skin2, hair: T.hairDark };
const EMP: PersonProps = { cloth: T.teal, cloth2: T.wall, skin: T.skin3, hair: T.hairDark };
const COSIMO: PersonProps = { hat: "crown", cloth: T.crimson, cloth2: T.wall, skin: T.skin1 };
const BROTHER: PersonProps = { cloth: T.flow, cloth2: T.wall, skin: T.skin2, hair: T.hairBrown };
const GALILEO: PersonProps = { hat: "cap", acc: ["beard"], cloth: T.teal, cloth2: T.wall, skin: T.skin2 };
const COLBERT: PersonProps = { acc: ["glasses"], cloth: T.gray, cloth2: T.stone, skin: T.skin2, hair: T.steel };
const ARCH: PersonProps = { hat: "cap", cloth: T.flow, cloth2: T.wall, skin: T.skin1 };
const DECOR: PersonProps = { hat: "bun", cloth: T.crimson, cloth2: T.wall, skin: T.skin3, hair: T.hairDark };
const SKINS = [T.skin1, T.skin2, T.skin3];
const CLOTHS = [T.navy2, T.crimson, T.teal, T.royal, T.gray, T.flow];
const HAIRS = [T.hairDark, T.hairBrown, T.steel];

const cnt = (t: number, a: number, b: number, from: number, to: number) => Math.round(from + (to - from) * ease3((t - a) / (b - a)));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const Sparkle: React.FC<{ x: number; y: number; at: number; s?: number }> = ({ x, y, at, s = 1 }) => (
  <Pop at={at} x={x} y={y} s={s} rise={0}><Star r={26} /><Pulse x={0} y={0} r={40} at={at} /></Pop>
);

// ═════════ ক: হুক ═════════
const SceneA: React.FC = () => {
  const { t } = useTime();
  const show = t >= C(9);
  return (
    <Scene from={0} to={W(11) - 0.05}>
      <Skyline y={1150} o={0.4} /><Ground y={1150} />
      <Pop at={C(1)} x={720} y={560} rise={30}>
        <g><ellipse rx={170} ry={92} fill={T.text} stroke={T.ink} strokeWidth={4} /><circle cx={-110} cy={70} r={46} fill={T.text} stroke={T.ink} strokeWidth={4} /><ellipse rx={168} ry={90} fill={T.text} />
          <circle cx={-60} cy={150} r={22} fill={T.text} stroke={T.ink} strokeWidth={4} /><circle cx={-20} cy={190} r={12} fill={T.text} stroke={T.ink} strokeWidth={3} />
          <g transform="translate(-60 -4)"><Star r={46} /></g><g transform="translate(60 -4)"><Smile r={38} /></g></g>
      </Pop>
      <Pop at={C(2)} x={790} y={1150}><Person {...BOSS} s={1.7} flip face={t >= C(10) ? "smile" : "neutral"} phase={1} /></Pop>
      <Pop at={C(10)} x={790} y={640} rise={20}><Bubble x={0} y={0} w={150} h={110}><path d="M -34 2 L -10 28 L 36 -26" stroke={T.good} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" fill="none" /></Bubble></Pop>
      <Pop at={C(3)} x={0} y={0} rise={40}>
        <Move from={[260, 1150]} to={[470, 1150]} at={C(10)} dur={0.9} bob={7}>
          <Person {...EMP} s={1.7} pose={show ? "cheer" : "stand"} />
          <Pop at={C(9)} y={-500} rise={30}><Glow x={0} y={0} r={120} /><Star r={54} /></Pop>
        </Move>
      </Pop>
    </Scene>
  );
};

// ═════════ খ১: মন্ত্রী → জেল ═════════
const SceneB1: React.FC = () => {
  const { t } = useTime();
  const pal = 1 - clamp01((t - (W(19) - 0.1)) / 0.5);
  return (
    <Scene from={C(11)} to={C(24)}>
      <Pop at={C(11)} x={540} y={350} rise={20}><Chip x={0} y={0} w={380} text="১৭" unit="শতক" color={T.data} /></Pop>
      <g opacity={pal}>
        <Ground y={1090} color={T.surface} />
        <Pop at={C(13)} x={540} y={1090} rise={160}><Palace s={1.45} lit={0.55} /></Pop>
        <Pop at={C(15)} x={540} y={1250}><Person {...FOUQUET} s={1.7} pose={t >= C(16) ? "cheer" : "stand"} /></Pop>
        <Pop at={C(16)} x={540} y={750} rise={30}><Glow x={0} y={0} r={130} /><Star r={54} /></Pop>
      </g>
      <Pop at={C(19)} x={540} y={1260} rise={180}><Prison s={1.15} glow /></Pop>
      <Pop at={C(22)} x={540} y={420} rise={20}><Tag x={0} y={0} w={400} text="পাহাড়ি জেল" color={T.bad} size={40} h={70} /></Pop>
    </Scene>
  );
};

// ═════════ খ২: ফুকে ও রাজা ═════════
const SceneB2: React.FC = () => {
  const { t } = useTime();
  const bow = clamp01((t - C(34)) / 0.5) * (1 - clamp01((t - (C(34) + 1.3)) / 0.5));
  return (
    <Scene from={C(24)} to={C(36)}>
      <Ground y={1150} />
      <Pop at={C(24)} x={540} y={1150} rise={100}><Palace s={1.2} lit={t >= C(33) ? 0.85 : 0.35} dim={t >= C(33) ? 0.95 : 0.55} /></Pop>
      <Pop at={C(26)} x={320} y={1200}><Person {...FOUQUET} s={1.6} tilt={bow * 22} /></Pop>
      <Pop at={C(28)} x={760} y={1200}><Person {...KING} s={1.6} flip phase={2} /></Pop>
      <Pop at={W(26)} x={320} y={1262} rise={20}><Tag x={0} y={0} w={200} text="ফুকে" color={T.data} size={36} /></Pop>
      <Pop at={W(29)} x={760} y={1262} rise={20}><Tag x={0} y={0} w={400} text="রাজা চতুর্দশ লুই" color={T.accent} size={34} /></Pop>
      <Pop at={C(34)} x={330} y={760} rise={20}><Heart s={1.5} fill={T.crimson} /></Pop>
      <Arrow x1={400} y1={780} x2={680} y2={780} at={C(35)} color={T.crimson} dash />
    </Scene>
  );
};

// ═════════ গ: পার্টি ═════════
const ScenePartyC: React.FC = () => {
  const { t } = useTime();
  const guestX = [110, 240, 370, 500, 630, 760, 890, 1000];
  const bubbleAt = [W(48), W(49), W(50), W(52)];
  return (
    <Scene from={C(36)} to={C(55)}>
      <Firework x={190} y={470} at={C(43)} color={T.accent} /><Firework x={540} y={400} at={C(43) + 0.5} color={T.data} r={130} /><Firework x={890} y={480} at={C(43) + 1.0} color={T.text} />
      <Pop at={C(36)} x={0} y={0} rise={0}><Bunting x1={50} x2={1030} y={590} sag={50} /></Pop>
      <Ground y={950} />
      <Pop at={C(36)} x={540} y={950} rise={120}><Palace s={1.15} lit={0.95} /></Pop>
      <Pop at={C(38)} x={540} y={1050} rise={30}><Table w={760} /></Pop>
      {Array.from({ length: 7 }, (_, i) => <Pop key={i} at={W(39) + 0.2 * i} x={540 - 270 + 90 * i} y={1052} rise={60}><Plate s={1.1} /></Pop>)}
      <Pop at={W(39)} x={200} y={350} rise={20}><Chip x={0} y={0} w={280} text="৭" unit="পদ" color={T.accent} /></Pop>
      <Pop at={C(42)} x={130} y={760} rot={-10}><Mask s={1.25} /></Pop><Pop at={C(42) + 0.2} x={950} y={760} rot={10}><Mask s={1.25} /></Pop>
      {guestX.map((x, i) => (
        <Pop key={i} at={W(44) + 0.15 * i} x={x} y={1285} rise={70}>
          <Bust s={1.55} cloth={CLOTHS[i % 6]} skin={SKINS[i % 3]} hair={HAIRS[(i + 1) % 3]} face={t > bubbleAt[0] ? "wow" : "smile"} />
        </Pop>
      ))}
      {[1, 3, 5, 7].map((gi, i) => (
        <Pop key={i} at={bubbleAt[i]} x={guestX[gi]} y={1100} rise={30}><Bubble x={0} y={0} w={120} h={86}><Star r={30} /></Bubble></Pop>
      ))}
    </Scene>
  );
};

// ═════════ ঘ১: গ্রেফতার ═════════
const SceneD1: React.FC = () => {
  const { t } = useTime();
  const sunP = ease3((t - C(55)) / 1.6);
  return (
    <Scene from={C(55)} to={C(59)}>
      <g transform={`translate(540 ${lerp(980, 640, sunP)})`}>
        <Glow x={0} y={0} r={360} color={T.warn} />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-110} x2={0} y2={-150 - 14 * Math.sin(t * 3 + i)} stroke={T.warn} strokeWidth={8} strokeLinecap="round" transform={`rotate(${i * 30 + t * 8})`} />)}
        <circle r={86} fill={T.warn} stroke={T.ink} strokeWidth={5} />
      </g>
      <Ground y={1060} />
      <Pop at={C(55)} x={540} y={1060} rise={20}><Palace s={1.1} lit={0.1} dim={0.7} /></Pop>
      <Pop at={C(56)} x={540} y={1250}><Person {...FOUQUET} s={1.7} face={t >= C(57) ? "wow" : "smile"} /></Pop>
      <Move from={[-120, 1250]} to={[340, 1250]} at={C(57)} dur={0.9} bob={7}><Person {...GUARD} s={1.7} pose="point" /></Move>
      <Move from={[1200, 1250]} to={[740, 1250]} at={C(57)} dur={0.9} bob={7}><Person {...GUARD} s={1.7} flip pose="point" /></Move>
      <Stamp x={540} y={480} text="গ্রেফতার" at={W(58)} size={70} w={440} />
    </Scene>
  );
};

// ═════════ ঘ২: কুড়ি বছর, জেল, প্রশ্ন ═════════
const SceneD2: React.FC = () => {
  const { t } = useTime();
  const years = cnt(t, C(60) - 0.2, C(60) + 0.6, 0, 20);
  const left = t < C(64);
  return (
    <Scene from={C(59)} to={C(73)}>
      <Pop at={C(59)} x={770} y={1260} rise={180}><Prison s={1.1} glow /></Pop>
      <Scene from={C(59)} to={C(64) - 0.1}>
        <Pop at={C(60)} x={250} y={420} rise={20}><Chip x={0} y={0} w={400} h={120} text={toBn(years)} unit="বছর" color={T.bad} size={76} /></Pop>
        {Array.from({ length: 20 }, (_, i) => (
          <rect key={i} x={70 + (i % 5) * 76} y={520 + Math.floor(i / 5) * 76} width={62} height={62} rx={12} fill={i < years ? T.bad : T.surface} opacity={i < years ? 0.9 : 0.6} stroke={T.border} strokeWidth={2} />
        ))}
        <Pop at={W(62)} x={770} y={400} rise={20}><Tag x={0} y={0} w={170} text="একা" color={T.muted} size={36} /></Pop>
      </Scene>
      {!left && <>
        <Pop at={C(64)} x={230} y={560}><Crown s={2.2} /></Pop>
        <Pop at={W(66)} x={230} y={800}><Plate s={1.8} /></Pop>
        <Pop at={W(67)} x={230} y={990}><Mask s={1.4} /></Pop>
        <Pop at={W(68)} x={230} y={1190}><Heart s={1.4} fill={T.accent} /></Pop>
        <Arrow x1={330} y1={880} x2={560} y2={940} at={C(69)} color={T.bad} dash w={8} />
        <Pop at={W(72)} x={770} y={520} rise={30}><Txt x={0} y={0} size={260} fill={T.accent}>?</Txt></Pop>
      </>}
    </Scene>
  );
};

// ═════════ ঙ১: নিয়ম ═════════
const SceneE1: React.FC = () => {
  const { t } = useTime();
  const over = ease3((t - C(78)) / 0.9);
  return (
    <Scene from={C(73)} to={C(81)}>
      <Pop at={W(74)} x={540} y={400} rise={20}><Txt x={0} y={0} size={84} fill={T.accent}>একটা নিয়ম</Txt></Pop>
      <Glow x={540} y={820} r={340} o={1 - 0.7 * over} />
      <Pop at={C(73)} x={540} y={1270}><Person {...KING} s={2.0} dim={1 - 0.65 * over} /></Pop>
      <Pop at={W(76)} x={830} y={800} rise={20}><Tag x={0} y={0} w={200} text="মনিব" color={T.accent} size={40} h={64} /></Pop>
      <g transform={`translate(${lerp(-120, 640, ease3((t - C(77)) / 1.0))} 1270)`} opacity={t >= C(77) ? 1 : 0}>
        <Glow x={0} y={-160 * (1.5 + over)} r={230 + 160 * over} color={T.data} o={over} />
        <Person {...EMP} s={1.5 + 1.0 * over} pose={over > 0.5 ? "cheer" : "stand"} />
      </g>
      <Cross x={540} y={700} s={2.4} at={C(80)} />
    </Scene>
  );
};

// ═════════ ঙ২: তিন ধাপ কার্ড ═════════
const SceneE2: React.FC = () => {
  const items = [
    { at: C(85), y: 600, text: "মনিবের জায়গা চেনা" },
    { at: C(88), y: 860, text: "ছাপিয়ে যাওয়া" },
    { at: C(93), y: 1120, text: "উল্টো পথ" },
  ];
  return (
    <Scene from={C(81)} to={C(95)}>
      {items.map((it, i) => (
        <Pop key={i} at={it.at} x={0} y={it.y} rise={60}>
          <rect x={80} y={-100} width={920} height={200} rx={30} fill={T.surface} stroke={T.border} strokeWidth={2} />
          <g transform="translate(200 0)">
            {i === 0 && <><ellipse cx={0} cy={50} rx={70} ry={14} fill={T.surfaceHi} stroke={T.ink} strokeWidth={3} /><g transform="translate(0 10)"><Crown s={1.6} /></g></>}
            {i === 1 && <><circle cx={-18} r={54} fill={T.accent} stroke={T.ink} strokeWidth={4} /><circle cx={22} r={54} fill={T.data} stroke={T.ink} strokeWidth={4} /></>}
            {i === 2 && <><g transform="translate(-48 0)"><Star r={36} /></g><Arrow x1={-6} y1={0} x2={34} y2={0} at={it.at + 0.3} w={6} color={T.accent} /><g transform="translate(76 4)"><Crown s={1.2} /></g></>}
          </g>
          <Txt x={330} y={4} size={58} anchor="start">{it.text}</Txt>
        </Pop>
      ))}
    </Scene>
  );
};

// ═════════ চ১: রাজা চান সবাই তাকাক ═════════
const SceneF1: React.FC = () => {
  const guests = [[120, 840], [180, 1030], [130, 1220], [960, 840], [900, 1030], [950, 1220]];
  return (
    <Scene from={C(95)} to={C(106)}>
      <Glow x={540} y={900} r={330} />
      <Pop at={C(98)} x={540} y={1280} rise={30}><rect x={-170} y={-100} width={340} height={110} rx={14} fill={T.hairBrown} stroke={T.ink} strokeWidth={4} /></Pop>
      <Pop at={C(100)} x={540} y={1180}><Person {...KING} s={1.7} /></Pop>
      {guests.map(([x, y], i) => (
        <g key={i}>
          <Pop at={C(101) + i * 0.1} x={x} y={y} rise={50}><Bust s={1.5} cloth={CLOTHS[i]} skin={SKINS[i % 3]} hair={HAIRS[i % 3]} face="neutral" /></Pop>
          <Pop at={C(104)} x={x + (x < 540 ? 20 : -20)} y={y - 170} rise={10}><Eye s={0.8} look={x < 540 ? 1 : -1} /></Pop>
          <Arrow x1={x < 540 ? x + 80 : x - 80} y1={y - 120} x2={x < 540 ? 420 : 660} y2={880} at={C(103) + i * 0.06} color={T.accent} dash w={5} />
        </g>
      ))}
    </Scene>
  );
};

// ═════════ চ২+চ৩: একশো অতিথি, হাজার হাসি ═════════
const SceneF2: React.FC = () => {
  const { t } = useTime();
  const N = 100;
  const hi = 4 * 10 + 4; // হাইলাইট অতিথি
  const hx = 90 + 4 * 100, hy = 560 + 4 * 74;
  const dim = 1 - 0.85 * clamp01((t - C(119)) / 0.5);
  const guests = cnt(t, W(108) - 0.1, W(109) + 0.5, 0, 100);
  const total = cnt(t, C(120), W(121) + 0.9, 0, 1000);
  return (
    <Scene from={C(106)} to={C(131)}>
      <g opacity={dim}>
        {Array.from({ length: N }, (_, i) => {
          const c = i % 10, r = Math.floor(i / 10);
          if (i === hi) return null;
          return <Pop key={i} at={W(108) + (r * 0.025 + c * 0.03)} x={90 + c * 100} y={560 + r * 74} rise={30}><Bust s={0.62} cloth={CLOTHS[Math.floor(hash(i) * 6)]} skin={SKINS[Math.floor(hash(i + 5) * 3)]} hair={HAIRS[Math.floor(hash(i + 9) * 3)]} /></Pop>;
        })}
        <Pop at={W(111)} x={hx} y={hy} rise={20}><Glow x={0} y={-50} r={140} /><Bust s={1.35} cloth={T.flow} skin={T.skin2} face="smile" /></Pop>
        {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2 - Math.PI / 2; return <Pop key={i} at={W(113) + 0.14 * i} x={hx + Math.cos(a) * 130} y={hy - 60 + Math.sin(a) * 110} rise={0}><Smile r={20} /></Pop>; })}
      </g>
      <Pop at={W(108)} x={540} y={400} rise={20}><Chip x={0} y={0} w={400} text={toBn(guests)} unit="অতিথি" color={T.data} /></Pop>
      <Scene from={W(114) - 0.1} to={C(119)}><Pop at={W(114)} x={540} y={1262} rise={20}><Chip x={0} y={0} w={380} text="× ১০" unit="হাসি" color={T.accent} /></Pop></Scene>
      {/* হাজার হাসি */}
      <Scene from={C(119)} to={C(131)}>
        {Array.from({ length: 18 }, (_, i) => <Stream key={i} x1={90 + (i % 9) * 110} y1={1150} x2={540} y2={720} at={C(119) + i * 0.05} n={1} speed={0.7} token r={18} />)}
        <Pop at={C(120)} x={540} y={700} rise={50}>
          <rect x={-290} y={-150} width={580} height={300} rx={34} fill={T.surface} stroke={T.data} strokeWidth={5} />
          <Glow x={0} y={0} r={330} color={T.data} o={0.5} />
          <Txt x={0} y={-24} size={150} fill={T.text}>{toBn(total)}</Txt><Txt x={0} y={96} size={52} fill={T.muted}>হাসি</Txt>
        </Pop>
        <Pop at={C(125)} x={270} y={1250}><Person {...KING} s={1.4} /></Pop>
        <Pop at={C(125) + 0.15} x={810} y={1250}><Person {...FOUQUET} s={1.4} flip /></Pop>
        <Arrow x1={440} y1={860} x2={290} y2={950} at={C(127)} color={T.data} dash w={6} /><Arrow x1={640} y1={860} x2={790} y2={950} at={C(127)} color={T.data} dash w={6} />
        <Pop at={W(129)} x={540} y={1060} rise={30}><Txt x={0} y={0} size={220} fill={T.accent}>?</Txt></Pop>
      </Scene>
    </Scene>
  );
};

// ═════════ ছ: ছাপিয়ে যাওয়া ═════════
const SceneG: React.FC = () => {
  const { t } = useTime();
  const gp = ease3((t - C(137)) / 0.8);
  const kS = lerp(1.4, 1.2, gp), fS = lerp(1.4, 1.9, gp);
  const bars = ease3((t - C(137)) / 0.9);
  const crackShake = t > C(160) && t < C(163) ? Math.sin(t * 40) * 4 : 0;
  const watchers = [[470, 1180], [570, 1215], [670, 1180]];
  return (
    <Scene from={C(131)} to={C(176)}>
      <Ground y={1100} />
      <Glow x={810} y={1000} r={330 * gp} />
      <g transform="translate(270 1250)" opacity={t < C(163) ? 1 : 1}>
        <Person {...KING} s={kS} face={t >= C(145) ? "frown" : "smile"} dim={1 - 0.3 * gp} pose={t >= C(169) && t < C(176) ? "point" : "stand"} />
      </g>
      <g transform="translate(810 1250)"><Person {...FOUQUET} s={fS} flip pose={gp > 0.5 ? "cheer" : "stand"} /></g>
      {/* বার */}
      <Scene from={C(137)} to={C(145)}>
        <Tag x={150} y={470} w={180} text="ফুকে" color={T.data} size={32} h={54} /><Tag x={150} y={600} w={180} text="রাজা" color={T.accent} size={32} h={54} />
        <rect x={260} y={448} width={760 * bars} height={44} rx={22} fill={T.data} /><rect x={260} y={578} width={85 * bars} height={44} rx={22} fill={T.accent} />
        <Pop at={C(137)} x={900} y={400} rise={20}><Chip x={0} y={0} w={220} h={70} text="৯০০" color={T.data} size={46} /></Pop>
        <Pop at={W(144)} x={480} y={700} rise={20}><Chip x={0} y={0} w={220} h={70} text="১০০" color={T.accent} size={46} /></Pop>
        <Stream x1={540} y1={760} x2={790} y2={1020} at={C(137)} until={C(145)} n={14} arc={30} speed={0.5} />
        <Stream x1={540} y1={760} x2={290} y2={1020} at={W(141)} until={C(145)} n={2} arc={30} speed={0.4} />
      </Scene>
      {/* লোকেরা মুগ্ধ */}
      <Scene from={C(148)} to={C(163)}>
        {watchers.map(([x, y], i) => (
          <g key={i}>
            <Pop at={C(149) + i * 0.15} x={x} y={y} rise={40}><Bust s={1.2} cloth={CLOTHS[i + 1]} skin={SKINS[i]} hair={HAIRS[i]} face="wow" /></Pop>
            <Arrow x1={x + 40} y1={y - 90} x2={760} y2={920} at={C(150) + i * 0.1} color={T.accent} dash w={5} />
            <Pop at={W(151) + i * 0.12} x={x} y={y - 170} rise={0}><Star r={28} /></Pop>
          </g>
        ))}
        <Pop at={W(153)} x={810} y={560} rise={20}><Sparkle x={0} y={0} at={W(153)} s={1.2} /></Pop>
      </Scene>
      {/* আত্মমর্যাদা */}
      <Scene from={C(158)} to={C(164)}>
        <Pop at={W(160)} x={270} y={480} rise={20}><Tag x={0} y={0} w={360} text="আত্মমর্যাদা" color={T.warn} size={38} /></Pop>
        <g transform={`translate(270 720) rotate(${crackShake})`}>
          <Pop at={C(158)} rise={40}><Crest s={0.9}><g transform="translate(0 -10)"><Crown s={2.2} /></g></Crest>
            {t > C(161) && <path d="M 10 -130 L -14 -50 L 22 -10 L -10 60 L 8 130" stroke={T.bad} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />}</Pop>
        </g>
      </Scene>
      {/* মুখে স্বীকার করলেন না + চুরির বিচার */}
      <Scene from={C(163)} to={C(176)}>
        <Pop at={C(164)} x={270} y={800} rise={20}><Bubble x={0} y={0} w={220} h={100}><Txt x={0} y={-6} size={64} fill={T.ink}>…</Txt></Bubble></Pop>
        <Cross x={270} y={800} s={1.1} at={C(167)} />
        <Pop at={C(173)} x={560} y={650} rise={30}><g transform={`rotate(${-14 + 22 * Math.abs(Math.sin(t * 5))})`}><Gavel s={1.4} /></g></Pop>
        <Pop at={W(174)} x={870} y={640} rise={30}><CoinBag s={1.5} /></Pop>
        <Pop at={W(174)} x={600} y={860} rise={20}><Chip x={0} y={0} w={520} h={96} text="চুরির বিচার" color={T.warn} size={52} /></Pop>
      </Scene>
    </Scene>
  );
};

// ═════════ জ: ইচ্ছা বনাম ফল ═════════
const SceneH: React.FC = () => {
  const { t } = useTime();
  return (
    <Scene from={C(176)} to={C(190)}>
      <Pop at={C(176)} x={540} y={1250} rise={40}><Person {...KING} s={1.6} face="neutral" /></Pop>
      <Pop at={C(178)} x={265} y={600} rise={30}>
        <rect x={-200} y={-230} width={400} height={440} rx={32} fill={T.surface} stroke={T.border} strokeWidth={2} />
        <g transform="translate(0 130)"><Palace s={0.5} lit={0.7} /></g><g transform="translate(0 -70)"><Heart s={2.0} fill={T.crimson} /></g>
        <Txt x={0} y={-170} size={52} fill={T.muted}>ইচ্ছা</Txt>
      </Pop>
      <Pop at={C(184)} x={815} y={600} rise={30}>
        <rect x={-200} y={-230} width={400} height={440} rx={32} fill={T.surface} stroke={T.accent} strokeWidth={3} />
        <Txt x={0} y={-170} size={52} fill={T.accent}>ফল</Txt>
        <rect x={-150} y={-70} width={300 * ease3((t - C(188)) / 0.8)} height={44} rx={22} fill={T.data} /><rect x={-150} y={40} width={34 * ease3((t - C(188)) / 0.8)} height={44} rx={22} fill={T.accent} />
        <Txt x={-150} y={140} size={36} fill={T.data} anchor="start">৯০০</Txt><Txt x={150} y={140} size={36} fill={T.accent} anchor="end">১০০</Txt>
      </Pop>
      <Pop at={C(180)} x={540} y={1010} rise={20}><Eye s={1.5} look={t < W(188) ? -1 : 1} /></Pop>
      <Arrow x1={500} y1={960} x2={290} y2={840} at={C(186)} color={T.muted} dash w={6} />
      <Cross x={400} y={900} s={1} at={W(187)} />
      <Arrow x1={580} y1={960} x2={790} y2={840} at={C(188)} color={T.accent} dash w={8} />
      <Pulse x={815} y={840} r={50} at={C(188)} />
    </Scene>
  );
};

// ═════════ ঝ১: কলবের ═════════
const SceneI1: React.FC = () => {
  return (
    <Scene from={C(190)} to={C(202)}>
      <Pop at={W(191)} x={540} y={380} rise={20}><Txt x={0} y={0} size={90} fill={T.accent}>প্রমাণ</Txt></Pop>
      <Ground y={1120} />
      <Move from={[330, 1250]} to={[-200, 1250]} at={C(193)} dur={1.3} bob={5}><Person {...FOUQUET} s={1.4} dim={0.6} flip /></Move>
      <Pop at={C(195)} x={0} y={0}><Move from={[1300, 1250]} to={[700, 1250]} at={C(195)} dur={1.0} bob={6}><Person {...COLBERT} s={1.6} flip face="neutral" /></Move></Pop>
      <Pop at={W(196)} x={700} y={800} rise={20}><Tag x={0} y={0} w={220} text="কলবের" color={T.steel} size={38} h={62} /></Pop>
      <Pop at={C(197)} x={0} y={0} rise={30}>
        <Bunting x1={60} x2={460} y={700} sag={30} colors={[T.gray, T.stone]} n={5} />
        <g transform="translate(260 1120)"><Table w={380} color={T.stone} /><g transform="translate(-60 -2)"><Plate s={1} color={T.gray} /></g><g transform="translate(60 -2)"><Plate s={1} color={T.gray} /></g></g>
      </Pop>
      <Pop at={W(198)} x={300} y={540} rise={20}><Chip x={0} y={0} w={500} h={90} text="নিরামিষ পার্টি" color={T.muted} size={46} /></Pop>
      <Pop at={W(201)} x={820} y={540} rise={20}><Tag x={0} y={0} w={240} text="বিখ্যাত" color={T.accent} size={40} h={64} /></Pop>
      <Pop at={W(201)} x={820} y={620} rise={0}><Star r={36} /></Pop>
    </Scene>
  );
};

// ═════════ ঝ২+ঝ৩: ভার্সাই, মধ্যমণি ═════════
const SceneI2: React.FC = () => {
  const { t } = useTime();
  const spot = ease3((t - C(223)) / 0.7);
  return (
    <Scene from={C(202)} to={C(226)}>
      <Ground y={1040} />
      <Pop at={C(211)} x={540} y={1040} rise={220}><Palace s={1.55} gold lit={0.95} /></Pop>
      <Pop at={W(212)} x={540} y={330} rise={20}><Tag x={0} y={0} w={260} text="ভার্সাই" color={T.accent} size={44} h={66} /></Pop>
      <Pop at={C(203)} x={540} y={1260}><Person {...KING} s={1.5} /></Pop>
      <Pop at={C(206)} x={290} y={1260}><Person {...ARCH} s={1.4} pose="hold" /></Pop>
      <Pop at={C(208)} x={790} y={1260}><Person {...DECOR} s={1.4} flip pose="hold" /></Pop>
      <Pop at={C(207)} x={330} y={1170} rot={-30}><rect x={-34} y={-12} width={68} height={24} rx={8} fill={T.cream} stroke={T.ink} strokeWidth={3} /></Pop>
      <Pop at={C(209)} x={750} y={1170}><ellipse rx={40} ry={26} fill={T.hairBrown} stroke={T.ink} strokeWidth={3} />{[-18, 0, 18].map((x, i) => <circle key={i} cx={x} cy={i === 1 ? -8 : 6} r={7} fill={[T.bad, T.data, T.good][i]} />)}</Pop>
      <Pop at={W(207)} x={290} y={880} rise={20}><Tag x={0} y={0} w={190} text="স্থপতি" color={T.data} size={34} /></Pop>
      <Pop at={W(209)} x={790} y={880} rise={20}><Tag x={0} y={0} w={330} text="সাজসজ্জাকারী" color={T.data} size={34} /></Pop>
      <Pop at={C(205)} x={150} y={470} rise={20}><Palace s={0.28} lit={0.5} /><Tag x={0} y={40} w={150} text="একই" color={T.muted} size={32} h={50} /></Pop>
      <Arrow x1={170} y1={560} x2={260} y2={850} at={W(207)} color={T.muted} dash w={4} /><Arrow x1={190} y1={560} x2={740} y2={850} at={W(209)} color={T.muted} dash w={4} />
      {/* জমকালো পার্টি */}
      <Firework x={200} y={440} at={W(215)} /><Firework x={540} y={400} at={W(215) + 0.5} color={T.data} r={130} /><Firework x={880} y={450} at={W(215) + 1.0} color={T.text} />
      <Pop at={W(214)} x={0} y={0} rise={0}><Bunting x1={40} x2={1040} y={620} sag={60} n={10} /></Pop>
      <Pop at={W(215)} x={540} y={520} rise={20}><Chip x={0} y={0} w={560} h={92} text="আরও জমকালো" color={T.accent} size={48} /></Pop>
      {/* ✓ পার্টি সমস্যা নয় */}
      {t > W(219) && t < C(223) + 0.2 && <Check x={540} y={780} s={2} at={W(219)} />}
      {/* মধ্যমণি: ফোকাস */}
      <rect x={0} y={280} width={1080} height={1040} fill={T.bg} opacity={0.72 * spot} />
      {t >= C(223) && <g opacity={spot}>
        <Spot x={540} y={300} w={640} h={960} o={0.18} /><Glow x={540} y={1000} r={330} />
        <g transform="translate(540 1260)"><Person {...KING} s={1.5} /></g>
        <Pulse x={540} y={1000} r={150} at={C(223)} />
      </g>}
      <Pop at={W(225)} x={540} y={760} rise={20}><Txt x={0} y={0} size={96} fill={T.accent}>মধ্যমণি</Txt></Pop>
    </Scene>
  );
};

// ═════════ ঞ: গ্যালিলিও ও মেডিচি ═════════
const SceneJ: React.FC = () => {
  const { t } = useTime();
  const xs = [190, 440, 690, 920];
  const orbit = [[120, 0.55, 1.6], [150, 0.5, 1.1], [185, 0.45, 0.8], [220, 0.42, 0.55]];
  const jx = lerp(770, 540, ease3((t - C(239)) / 0.9));
  const jy = lerp(560, 690, ease3((t - C(241)) / 0.8));
  const toBro = ease3((t - W(263)) / 1.0);
  const j4 = ease3((t - C(272)) / 0.7);
  const throwP = ease3((t - W(275)) / 0.9);
  return (
    <Scene from={C(226)} to={C(282)}>
      <rect x={0} y={280} width={1080} height={1040} fill={T.ink} opacity={0.5} />
      {Array.from({ length: 34 }, (_, i) => <circle key={i} cx={hash(i) * 1080} cy={300 + hash(i + 3) * 700} r={2 + hash(i + 7) * 2.5} fill={T.text} opacity={0.35 + 0.4 * Math.abs(Math.sin(t * 1.5 + i))} />)}
      <Ground y={1250} color={T.mount1} />
      {/* গ্যালিলিও + দূরবিন */}
      <g opacity={1 - clamp01((t - C(239)) / 0.4)}>
        <Pop at={C(229)} x={230} y={1280}><Person {...GALILEO} s={1.6} pose="point" /></Pop>
        <Pop at={C(231)} x={470} y={1190}><Telescope s={1.6} ang={-52} /></Pop>
        <Arrow x1={700} y1={900} x2={760} y2={650} at={C(233)} color={T.accent} dash w={5} />
      </g>
      <Scene from={W(230) - 0.1} to={C(239)}><Pop at={W(230)} x={300} y={400} rise={20}><Chip x={0} y={0} w={400} text="১৬১০" unit="সাল" color={T.data} /></Pop></Scene>
      <g opacity={1 - j4}>
      {/* মেডিচি-প্রতীক */}
      <Pop at={C(242)} x={540} y={700} rise={40}><Crest s={0.95} /></Pop>
      <Pop at={W(241)} x={540} y={400} rise={20}><Tag x={0} y={0} w={260} text="মেডিচি" color={T.accent} size={42} h={66} /></Pop>
      {/* বৃহস্পতি ও চাঁদ */}
      <Pop at={C(234)} x={jx} y={jy} rise={60} s={t >= C(242) ? 0.8 : 1}><Glow x={0} y={0} r={200} color={T.warn} o={0.7} /><Planet r={90} /></Pop>
      {orbit.map(([r, sq, sp], i) => {
        const a = t * sp + i * 1.7;
        const ox = jx + Math.cos(a) * r * 1.2, oy = jy + Math.sin(a) * r * sq * 1.2;
        const tx = xs[i], ty = 1000;
        const x = lerp(ox, tx, toBro), y = lerp(oy, ty, toBro);
        return <Pop key={i} at={W(235) + 0.18 * i} x={x} y={y} rise={0}><circle r={19} fill={T.cream} stroke={T.ink} strokeWidth={4} /></Pop>;
      })}
      <Pop at={W(235)} x={780} y={340} rise={20}><Chip x={0} y={0} w={320} text="৪" unit="চাঁদ" color={T.accent} /></Pop>
      <Sparkle x={jx + 130} y={jy - 110} at={W(237)} />
      </g>
      {/* চার ভাই */}
      <Pop at={W(249)} x={xs[0] + (330 - xs[0]) * j4} y={1280}><Person {...COSIMO} s={1.5} glow={t >= C(267) ? T.accent : undefined} /></Pop>
      {[1, 2, 3].map((i) => <g key={i} opacity={1 - 0.75 * j4}><Pop at={W(252) + 0.3 * (i - 1)} x={xs[i]} y={1280}><Person {...BROTHER} s={1.25} phase={i} glow={t >= C(267) ? T.accent : undefined} /></Pop></g>)}
      <g opacity={1 - j4}>
      <Pop at={W(255)} x={540} y={900} rise={20}><Chip x={0} y={0} w={240} h={76} text="৪" unit="জন" color={T.data} size={46} /></Pop>
      {/* চাঁদ ↔ ভাই */}
      {xs.map((x, i) => <Arrow key={i} x1={x} y1={1020} x2={x} y2={1090} at={W(264) + 0.1 * i} color={T.accent} dash w={5} />)}
      <Pop at={C(256)} x={140} y={420}><Bust s={1.7} cloth={T.teal} skin={T.skin2} hair={T.wig} /></Pop>
      <Pop at={C(256)} x={640} y={450} rise={20}><Bubble x={0} y={0} w={420} h={110} tail="d"><Txt x={0} y={-4} size={44} fill={T.ink}>চার চাঁদ = চার ভাই</Txt></Bubble></Pop>
      {t >= C(267) && <Glow x={540} y={620} r={540} o={0.5 * clamp01((t - C(267)) / 0.6)} />}
      </g>
      {/* বেতন */}
      <g opacity={clamp01(j4)}>
        <g transform={`translate(${lerp(1250, 760, ease3((t - C(273)) / 0.9))} 1280)`}><Person {...GALILEO} s={1.6} flip /></g>
        {t >= W(275) && <g transform={`translate(${lerp(400, 730, throwP)} ${1060 - Math.sin(throwP * Math.PI) * 130})`}><CoinBag s={1.3} /></g>}
        <Pop at={W(275)} x={540} y={470} rise={20}><Chip x={0} y={0} w={440} h={90} text="পুরো বেতন" color={T.good} size={48} /></Pop>
        <Pop at={W(277)} x={540} y={640} rise={30}>
          <rect x={-440} y={-80} width={880} height={160} rx={30} fill={T.surface} stroke={T.accent} strokeWidth={4} />
          <g transform="translate(-380 0)"><Star r={34} /></g>
          <Txt x={20} y={-4} size={44}>দরবারের দার্শনিক ও গণিতবিদ</Txt>
        </Pop>
        <Check x={440} y={560} s={0.9} at={W(281)} />
      </g>
    </Scene>
  );
};

// ═════════ ট: দুজনের তুলনা ═════════
const SceneK: React.FC = () => {
  const { t } = useTime();
  return (
    <Scene from={C(282)} to={C(293)}>
      <Ground y={1130} />
      <Glow x={240} y={1000} r={300 * clamp01((t - W(287)) / 0.5)} />
      <Spot x={240} y={290} w={420} h={840} o={0.16 * clamp01((t - W(287)) / 0.5)} />
      <Pop at={C(282)} x={440} y={1230}><Person {...KING} s={1.1} dim={t >= W(287) ? 0.4 : 0.9} face={t >= W(287) ? "frown" : "smile"} /></Pop>
      <Pop at={C(283)} x={240} y={1260}><Person {...FOUQUET} s={1.6} pose="cheer" /></Pop>
      <Pop at={C(284)} x={240} y={760} rise={30}><Star r={50} /></Pop>
      <Cross x={440} y={800} s={1.1} at={W(288)} />
      <Glow x={650} y={1000} r={300 * clamp01((t - W(290)) / 0.5)} />
      <Pop at={C(282)} x={650} y={1230}><Person {...COSIMO} s={1.1} flip /></Pop>
      <Pop at={C(283)} x={850} y={1260}><Person {...GALILEO} s={1.6} flip pose="cheer" /></Pop>
      <Pop at={C(284)} x={850} y={760} rise={30}><Star r={50} /></Pop>
      <Arrow x1={800} y1={800} x2={680} y2={920} at={W(290)} color={T.accent} dash w={7} />
      <Check x={650} y={780} s={1.1} at={W(292)} />
    </Scene>
  );
};

// ═════════ ঠ১: রিক্যাপ ═════════
const SceneL1: React.FC = () => {
  const { t } = useTime();
  const rows = [
    { at: W(296), y: 560, text: "মনিবের জায়গা চেনা" },
    { at: W(299), y: 830, text: "ছাপিয়ে যাওয়ার হিসাব" },
    { at: W(303), y: 1100, text: "মনিবকে উজ্জ্বল করা" },
  ];
  return (
    <Scene from={C(293)} to={C(306)}>
      {rows.map((r, i) => {
        const on = t >= r.at - 0.08;
        return (
          <Pop key={i} at={C(293) + i * 0.12} x={0} y={r.y} rise={50}>
            <rect x={70} y={-110} width={940} height={220} rx={30} fill={T.surface} stroke={on ? T.accent : T.border} strokeWidth={on ? 5 : 2} opacity={on ? 1 : 0.6} />
            {on && <rect x={70} y={-110} width={940} height={220} rx={30} fill={T.accent} opacity={0.08} />}
            <rect x={105} y={-75} width={150} height={150} rx={26} fill={on ? T.accent : T.surfaceHi} />
            <Txt x={180} y={-2} size={100} fill={on ? T.onAccent : T.muted}>{["১", "২", "৩"][i]}</Txt>
            <Txt x={300} y={0} size={52} anchor="start" fill={on ? T.text : T.muted}>{r.text}</Txt>
          </Pop>
        );
      })}
    </Scene>
  );
};

// ═════════ ঠ২: ফুকের উত্তর ═════════
const SceneL2: React.FC = () => {
  const { t } = useTime();
  const dimK = 1 - 0.85 * ease3((t - W(317)) / 0.9);
  return (
    <Scene from={C(306)} to={C(319)}>
      <Pop at={C(306)} x={770} y={1260} rise={150}><Prison s={1.1} glow /></Pop>
      <Pop at={W(309)} x={300} y={480} rise={20}><Chip x={0} y={0} w={420} h={96} text="ভালো কাজ" color={T.good} size={52} /></Pop>
      <Arrow x1={520} y1={500} x2={680} y2={820} at={W(313)} color={T.good} dash w={6} />
      <Cross x={600} y={660} s={1.1} at={W(314)} />
      <Pop at={W(316)} x={300} y={700} rise={20}><Chip x={0} y={0} w={560} h={96} text="রাজাকে ম্লান করে" color={T.bad} size={50} /></Pop>
      <Arrow x1={580} y1={730} x2={690} y2={840} at={W(317)} color={T.bad} dash w={8} />
      <Glow x={300} y={1010} r={300} o={dimK} />
      <Pop at={C(306)} x={300} y={1250}><Person {...KING} s={1.5} dim={0.35 + 0.65 * dimK} face={dimK < 0.6 ? "frown" : "smile"} /></Pop>
    </Scene>
  );
};

// ═════════ ড১: হাততালি কার দিকে ═════════
const SceneM1: React.FC = () => {
  const { t } = useTime();
  return (
    <Scene from={C(319)} to={C(332)}>
      <Skyline y={1150} o={0.4} seed={3} /><Ground y={1150} />
      <Pop at={C(320)} x={780} y={1150}><Person {...BOSS} s={1.7} flip pose={t >= W(325) - 0.1 ? "clap" : "stand"} /></Pop>
      <Pop at={C(321)} x={300} y={1150}><Person {...EMP} s={1.5} pose="cheer" /></Pop>
      <Pop at={C(321)} x={300} y={730} rise={20}><Star r={48} /></Pop>
      <Pulse x={700} y={950} r={60} at={W(325)} period={0.9} />
      <Stream x1={650} y1={930} x2={400} y2={880} at={W(325)} n={9} arc={60} speed={0.7} token={false} r={26} />
      <Pop at={W(327)} x={540} y={560} rise={20}><Eye s={2} look={-1} /></Pop>
      <Arrow x1={520} y1={640} x2={400} y2={840} at={W(328)} color={T.accent} dash w={6} />
      <Pop at={W(330)} x={300} y={580} rise={20}><Txt x={0} y={0} size={200} fill={T.accent}>?</Txt></Pop>
    </Scene>
  );
};

// ═════════ ড২: বন্ধুকে পাঠান ═════════
const SceneM2: React.FC = () => {
  const { t } = useTime();
  const fp = ease3((t - W(338)) / 0.9);
  const fy = lerp(1170, 1270, fp), fs = lerp(1.2, 2.0, fp);
  const pp = ease3((t - W(336)) / 0.9);
  const back = [150, 330, 750, 930];
  return (
    <Scene from={C(332)} to={999} fout={0.01}>
      <Ground y={1130} />
      <Glow x={540} y={fy - 250 * fs / 1.5} r={380 * fp} />
      {back.map((x, i) => <Pop key={i} at={C(333) + i * 0.1} x={x} y={1170} rise={40}><Person {...(i % 2 ? EMP : BOSS)} s={1.35} dim={0.55} phase={i} /></Pop>)}
      <Pop at={C(333)} x={0} y={0}>
        <g transform={`translate(540 ${fy})`}><Person {...EMP} cloth={T.flow} s={fs} pose="cheer" /></g>
      </Pop>
      <Pop at={W(339)} x={540} y={fy - 255 * fs - 40} rise={20}><Glow x={0} y={0} r={140} /><Star r={60} rot={Math.sin(t * 2) * 8} /></Pop>
      {t >= W(336) && (
        <g transform={`translate(${lerp(1000, 640, pp)} ${lerp(1280, 800, pp) - Math.sin(pp * Math.PI) * 120}) rotate(${lerp(-20, -35, pp)})`} opacity={1 - clamp01((t - (W(336) + 1.1)) / 0.4)}>
          <path d="M -60 0 L 70 -30 L -10 40 L -14 8 Z" fill={T.accent} stroke={T.ink} strokeWidth={5} strokeLinejoin="round" /><path d="M -14 8 L 70 -30" stroke={T.ink} strokeWidth={4} />
        </g>
      )}
      {t >= W(336) + 0.9 && <Pulse x={540} y={fy - 200} r={110} at={W(336) + 0.9} period={1.3} />}
      <Pop at={W(336)} x={830} y={480} rise={20}><Chip x={0} y={0} w={280} h={90} text="পাঠান" color={T.accent} size={52} /></Pop>
    </Scene>
  );
};

export const AllScenes: React.FC = () => (
  <>
    <SceneA /><SceneB1 /><SceneB2 /><ScenePartyC /><SceneD1 /><SceneD2 />
    <SceneE1 /><SceneE2 /><SceneF1 /><SceneF2 /><SceneG /><SceneH />
    <SceneI1 /><SceneI2 /><SceneJ /><SceneK /><SceneL1 /><SceneL2 /><SceneM1 /><SceneM2 />
  </>
);
