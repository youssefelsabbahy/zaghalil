"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { characters } from "@/content/site";
import { asset } from "@/lib/assets";
import { cn } from "@/lib/format";
import { CharacterArt } from "@/components/ui/primitives";
import { RoomBackdrop } from "@/components/ui/Scenes";

/**
 * Wide "whole cast in a room" scene from the characters page.
 * Uses scenes/characters-group when exported; otherwise an original room backdrop
 * with each character slot lined up on the floor.
 */
export function CastLineup({ className, sceneKey = "scenes/characters-group" }: { className?: string; sceneKey?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const castY = useTransform(scrollYProgress, [0, 1], ["8%", "-4%"]);
  const scene = asset(sceneKey);

  return (
    <div ref={ref} className={cn("relative overflow-hidden rounded-[1.8rem] border-2 border-ink/10 bg-[#F7DFA6]", className)}>
      {scene ? (
        <motion.div style={{ y: bgY }} className="absolute inset-[-6%_0]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={scene} alt="شلة زغاليل" className="h-full w-full object-cover" />
        </motion.div>
      ) : (
        <>
          <motion.div style={{ y: bgY }} className="absolute inset-[-6%_0]">
            <RoomBackdrop />
          </motion.div>
          <motion.ul
            style={{ y: castY }}
            className="absolute inset-x-[4%] bottom-[8%] flex items-end justify-center gap-[1.5%]"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ staggerChildren: 0.07 }}
          >
            {characters.map((c, i) => (
              <motion.li
                key={c.id}
                className="w-[12.5%]"
                style={{ marginBottom: i % 2 ? "2%" : 0 }}
                variants={{ hidden: { y: 80, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                transition={{ type: "spring", stiffness: 220, damping: 16 }}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
                  whileHover={{ y: -16, rotate: -6 }}
                >
                  <CharacterArt id={c.id} className="w-full" />
                </motion.div>
              </motion.li>
            ))}
          </motion.ul>
        </>
      )}
    </div>
  );
}
