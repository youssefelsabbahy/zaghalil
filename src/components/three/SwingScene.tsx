"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Sparkles, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type SeatSpec = { id: string; name: string; plush: string; texture?: string };

const INK = "#1f1f1f";
const inkMat = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });
const cloudInk = new THREE.MeshBasicMaterial({ color: "#A9D6EA", side: THREE.BackSide });
const L = 9; // rope length (pivot height above the seat)

/* ───────────── shared toon gradient + procedural textures ───────────── */
function useToonGradient() {
  return useMemo(() => {
    const data = new Uint8Array([185, 228, 255]);
    const tex = new THREE.DataTexture(data, 3, 1, THREE.RedFormat);
    tex.minFilter = tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);
}

function canvasTexture(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, repeat?: [number, number]) {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(...repeat);
  }
  return t;
}

function useRopeTexture() {
  return useMemo(
    () =>
      canvasTexture(
        64,
        64,
        (c) => {
          c.fillStyle = "#E9A25B";
          c.fillRect(0, 0, 64, 64);
          c.strokeStyle = "#B8662E";
          c.lineWidth = 9;
          for (let i = -64; i < 128; i += 22) {
            c.beginPath();
            c.moveTo(i, 0);
            c.lineTo(i + 64, 64);
            c.stroke();
          }
          c.strokeStyle = "#F8C48A";
          c.lineWidth = 3;
          for (let i = -60; i < 128; i += 22) {
            c.beginPath();
            c.moveTo(i, 0);
            c.lineTo(i + 64, 64);
            c.stroke();
          }
        },
        [2, 26]
      ),
    []
  );
}

function useWoodTexture() {
  return useMemo(
    () =>
      canvasTexture(512, 128, (c) => {
        const g = c.createLinearGradient(0, 0, 0, 128);
        g.addColorStop(0, "#D88A4A");
        g.addColorStop(1, "#B9693A");
        c.fillStyle = g;
        c.fillRect(0, 0, 512, 128);
        c.strokeStyle = "rgba(90,40,10,0.35)";
        c.lineWidth = 3;
        for (let y = 14; y < 128; y += 22) {
          c.beginPath();
          c.moveTo(0, y);
          for (let x = 0; x <= 512; x += 32) c.lineTo(x, y + Math.sin(x * 0.02 + y) * 4);
          c.stroke();
        }
        c.fillStyle = "rgba(90,40,10,0.45)";
        [[120, 60], [360, 40], [430, 90]].forEach(([x, y]) => {
          c.beginPath();
          c.ellipse(x, y, 16, 6, 0, 0, Math.PI * 2);
          c.fill();
        });
      }),
    []
  );
}

function useShadowTexture() {
  return useMemo(
    () =>
      canvasTexture(256, 64, (c) => {
        const g = c.createRadialGradient(128, 32, 4, 128, 32, 128);
        g.addColorStop(0, "rgba(60,50,40,0.38)");
        g.addColorStop(0.5, "rgba(60,50,40,0.14)");
        g.addColorStop(1, "rgba(60,50,40,0)");
        c.fillStyle = g;
        c.save();
        c.scale(1, 0.5);
        c.fillRect(0, 0, 256, 128);
        c.restore();
      }),
    []
  );
}

/* ───────────── pieces ───────────── */
function Rope({ x, z, tex, grad }: { x: number; z: number; tex: THREE.Texture; grad: THREE.Texture }) {
  return (
    <group position={[x, (L + 2) / 2, z]}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, L + 2, 12, 1]} />
        <meshToonMaterial map={tex} gradientMap={grad} />
      </mesh>
      <mesh material={inkMat}>
        <cylinderGeometry args={[0.128, 0.128, L + 2, 12, 1]} />
      </mesh>
    </group>
  );
}

function Cloud({ position, scale = 1, speed = 0.2, grad }: { position: [number, number, number]; scale?: number; speed?: number; grad: THREE.Texture }) {
  const ref = useRef<THREE.Group>(null);
  const seed = useMemo(() => Math.random() * 10, []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed + seed;
    ref.current.position.x = position[0] + Math.sin(t) * 0.4;
    ref.current.position.y = position[1] + Math.cos(t * 1.3) * 0.12;
  });
  const puffs: [number, number, number, number][] = [
    [0, 0, 0, 0.62],
    [0.62, -0.1, 0, 0.48],
    [-0.62, -0.12, 0, 0.46],
    [0.25, 0.36, 0, 0.45],
    [-0.28, 0.3, 0, 0.4],
  ];
  return (
    <group ref={ref} position={position} scale={scale}>
      {puffs.map(([px, py, pz, r], i) => (
        <group key={i} position={[px, py, pz]} scale={[1, 0.82, 0.7]}>
          <mesh>
            <sphereGeometry args={[r, 20, 16]} />
            <meshBasicMaterial color="#F3FAFD" />
          </mesh>
          <mesh material={cloudInk} scale={1 + 0.05 / r}>
            <sphereGeometry args={[r, 20, 16]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Soft plush stand-in shown until the official character export exists. */
function Plush({ spec, x, grad, index }: { spec: SeatSpec; x: number; grad: THREE.Texture; index: number }) {
  const ref = useRef<THREE.Group>(null);
  const jump = useRef(0);
  const [hover, setHover] = useState(false);
  useFrame(({ clock }, dt) => {
    if (!ref.current) return;
    jump.current = Math.max(0, jump.current - dt * 2.2);
    const j = Math.sin((1 - jump.current) * Math.PI) * (jump.current > 0 ? 0.55 : 0);
    const bob = Math.sin(clock.elapsedTime * 2 + index) * 0.03;
    ref.current.position.y = 0.72 + bob + j;
    const squash = 1 + Math.sin(clock.elapsedTime * 2 + index) * 0.025;
    ref.current.scale.set(1 / squash, squash, 1 / squash);
    ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, hover ? 0.12 : 0, 0.15);
  });
  const light = spec.plush.toLowerCase() === "#ffffff";
  return (
    <group
      ref={ref}
      position={[x, 0.72, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        jump.current = 1;
      }}
    >
      <mesh scale={[0.5, 0.62, 0.46]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshToonMaterial color={spec.plush} gradientMap={grad} />
      </mesh>
      <mesh scale={[0.54, 0.66, 0.5]} material={inkMat}>
        <sphereGeometry args={[1, 32, 24]} />
      </mesh>
      {[-0.15, 0.15].map((ex) => (
        <mesh key={ex} position={[ex, 0.12, 0.43]}>
          <sphereGeometry args={[0.045, 12, 10]} />
          <meshBasicMaterial color={INK} />
        </mesh>
      ))}
      {[-0.27, 0.27].map((bx) => (
        <mesh key={bx} position={[bx, -0.02, 0.38]} rotation={[0, bx > 0 ? 0.55 : -0.55, 0]}>
          <circleGeometry args={[0.08, 20]} />
          <meshBasicMaterial color="#F7A9C2" transparent opacity={light ? 0.9 : 0.75} />
        </mesh>
      ))}
    </group>
  );
}

function SeatArt({ spec, x }: { spec: SeatSpec; x: number }) {
  const tex = useTexture(spec.texture!);
  tex.colorSpace = THREE.SRGBColorSpace;
  const img = tex.image as HTMLImageElement;
  const aspect = img.width / img.height;
  const h = 2.1;
  return (
    <mesh position={[x, h / 2 - 0.05, 0.02]}>
      <planeGeometry args={[h * aspect, h]} />
      <meshBasicMaterial map={tex} transparent alphaTest={0.02} toneMapped={false} />
    </mesh>
  );
}

/* ───────────── swing rig with pendulum physics ───────────── */
function Swing({ seats, perch, scrollVel }: { seats: SeatSpec[]; perch?: SeatSpec; scrollVel: React.MutableRefObject<number> }) {
  const grad = useToonGradient();
  const rope = useRopeTexture();
  const wood = useWoodTexture();
  const shadowTex = useShadowTexture();
  const pivot = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const state = useRef({ theta: 0.05, omega: 0, drag: false, lastX: 0 });
  const { pointer, camera, size } = useThree();

  useFrame(({ clock }, delta) => {
    const s = state.current;
    const dt = Math.min(delta, 1 / 30);
    const t = clock.elapsedTime;
    // gentle idle push + scroll momentum + damping
    const drive = Math.sin(t * 1.05) * 0.06;
    const scrollKick = THREE.MathUtils.clamp(scrollVel.current, -40, 40) * 0.0016;
    scrollVel.current *= 0.9;
    s.omega += (-(9.8 / L) * Math.sin(s.theta) - 0.55 * s.omega + drive + scrollKick) * dt;
    s.theta = THREE.MathUtils.clamp(s.theta + s.omega * dt, -0.38, 0.38);
    if (pivot.current) {
      pivot.current.rotation.z = s.theta;
      pivot.current.rotation.x = Math.sin(t * 0.7) * 0.015;
    }
    if (shadow.current) {
      shadow.current.position.x = Math.sin(s.theta) * L * 0.98;
      const k = 1 - Math.abs(s.theta) * 0.6;
      shadow.current.scale.set(7.2 * k, 1.6 * k, 1);
      (shadow.current.material as THREE.MeshBasicMaterial).opacity = 0.9 * k;
    }
    // subtle camera parallax following the pointer
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.6, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.1 + pointer.y * 0.35, 0.04);
    camera.lookAt(0, 1.1, 0);
  });

  const onDown = (e: { stopPropagation: () => void; clientX: number }) => {
    e.stopPropagation();
    state.current.drag = true;
    state.current.lastX = e.clientX;
    document.body.style.cursor = "grabbing";
  };
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const s = state.current;
      if (!s.drag) return;
      s.omega += ((e.clientX - s.lastX) / size.width) * 2.4;
      s.lastX = e.clientX;
    };
    const up = () => {
      state.current.drag = false;
      document.body.style.cursor = "";
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [size.width]);

  const seatX = (i: number) => (i - (seats.length - 1) / 2) * 0.98;
  const half = 3.25;

  return (
    <>
      <mesh ref={shadow} position={[0, -2.15, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
      </mesh>
      <group ref={pivot} position={[0, L - 1.2, 0]}>
        <group position={[0, -L, 0]}>
          {/* ropes: back pair behind the cast, front pair in front */}
          <Rope x={-half} z={-0.42} tex={rope} grad={grad} />
          <Rope x={half} z={-0.42} tex={rope} grad={grad} />
          <Rope x={-half - 0.06} z={0.42} tex={rope} grad={grad} />
          <Rope x={half + 0.06} z={0.42} tex={rope} grad={grad} />
          {/* rope knots wrapping the plank */}
          {[-half, half].map((x) => (
            <group key={x} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <mesh>
                <torusGeometry args={[0.4, 0.11, 10, 28]} />
                <meshToonMaterial map={rope} gradientMap={grad} />
              </mesh>
              <mesh material={inkMat}>
                <torusGeometry args={[0.4, 0.138, 10, 28]} />
              </mesh>
            </group>
          ))}
          {/* plank */}
          <group onPointerDown={onDown}>
            <RoundedBox args={[7.3, 0.5, 1.45]} radius={0.2} smoothness={4}>
              <meshToonMaterial map={wood} gradientMap={grad} />
            </RoundedBox>
            <RoundedBox args={[7.36, 0.56, 1.51]} radius={0.23} smoothness={4} material={inkMat} />
          </group>
          {/* cast */}
          {seats.map((s, i) =>
            s.texture ? (
              <Suspense key={s.id} fallback={null}>
                <SeatArt spec={s} x={seatX(i)} />
              </Suspense>
            ) : (
              <Plush key={s.id} spec={s} x={seatX(i)} grad={grad} index={i} />
            )
          )}
          {perch &&
            (perch.texture ? (
              <Suspense fallback={null}>
                <group position={[half - 0.2, 2.2, 0.5]} scale={0.62}>
                  <SeatArt spec={perch} x={0} />
                </group>
              </Suspense>
            ) : (
              <group position={[half - 0.35, 2.35, 0.55]} scale={0.7} rotation={[0, 0, 0.18]}>
                <Plush spec={perch} x={0} grad={grad} index={9} />
              </group>
            ))}
        </group>
      </group>
      <Cloud position={[-3.2, 3.4, -3]} scale={1} grad={grad} speed={0.18} />
      <Cloud position={[1.6, 4.3, -4.5]} scale={0.9} grad={grad} speed={0.14} />
      <Cloud position={[4.1, 2.9, -3.8]} scale={0.8} grad={grad} speed={0.22} />
      <Cloud position={[-4.3, 0.5, -5]} scale={0.7} grad={grad} speed={0.12} />
      <Sparkles count={26} scale={[12, 6, 3]} position={[0, 1.6, -1]} size={4} speed={0.35} color="#FFCC1A" opacity={0.8} />
    </>
  );
}

function Rig({ fit }: { fit: number }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    const pc = camera as THREE.PerspectiveCamera;
    const tan = Math.tan(THREE.MathUtils.degToRad(pc.fov / 2));
    const needH = 8.2 / (2 * tan);
    const needW = (8.6 * fit) / (2 * tan * aspect);
    pc.position.z = Math.max(needH, needW);
    pc.updateProjectionMatrix();
  }, [camera, size, fit]);
  return null;
}

export default function SwingScene({ seats, perch, active }: { seats: SeatSpec[]; perch?: SeatSpec; active: boolean }) {
  const scrollVel = useRef(0);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      scrollVel.current += y - last;
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Canvas
      flat
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 30, position: [0, 1.1, 16], near: 0.1, far: 60 }}
      style={{ touchAction: "pan-y" }}
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[-4, 8, 6]} intensity={1.4} />
      <Rig fit={1} />
      <Swing seats={seats} perch={perch} scrollVel={scrollVel} />
    </Canvas>
  );
}

