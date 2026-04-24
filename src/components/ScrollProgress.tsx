import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed left-0 top-0 z-[99] h-0.5 w-full origin-left bg-amber-burst"
      style={{ scaleX }}
    />
  );
}
