import type { Variants, Transition } from 'framer-motion';

// Easing functions
export const easings = {
  smooth: [0.4, 0, 0.2, 1] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  elastic: [0.175, 0.885, 0.32, 1.275] as const,
  gentle: [0.25, 0.1, 0.25, 1] as const,
  snappy: [0.7, 0, 0.3, 1] as const,
  luxury: [0.16, 1, 0.3, 1] as const,
};

// Default transition
export const defaultTransition: Transition = {
  duration: 0.5,
  ease: easings.smooth,
};

// Fade variants
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: defaultTransition,
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

// Fade up variants
export const fadeUpVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: easings.luxury,
    },
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 },
  },
};

// Fade down variants
export const fadeDownVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -30,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: easings.luxury,
    },
  },
};

// Fade left variants
export const fadeLeftVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -50,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: easings.luxury,
    },
  },
};

// Fade right variants
export const fadeRightVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: 50,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: easings.luxury,
    },
  },
};

// Scale variants
export const scaleVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easings.elastic,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

// Scale up variants
export const scaleUpVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easings.elastic,
    },
  },
};

// Slide up variants
export const slideUpVariants: Variants = {
  hidden: { 
    y: '100%',
  },
  visible: { 
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.luxury,
    },
  },
  exit: { 
    y: '100%',
    transition: {
      duration: 0.4,
      ease: easings.snappy,
    },
  },
};

// Slide down variants
export const slideDownVariants: Variants = {
  hidden: { 
    y: '-100%',
  },
  visible: { 
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.luxury,
    },
  },
};

// Stagger container variants
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Stagger item variants
export const staggerItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.luxury,
    },
  },
};

// Card hover variants
export const cardHoverVariants: Variants = {
  initial: { 
    y: 0, 
    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
  },
  hover: { 
    y: -8, 
    boxShadow: '0 20px 60px -8px rgba(0, 0, 0, 0.15)',
    transition: {
      duration: 0.4,
      ease: easings.luxury,
    },
  },
};

// Image zoom variants
export const imageZoomVariants: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.08,
    transition: {
      duration: 0.6,
      ease: easings.smooth,
    },
  },
};

// Button tap variants
export const buttonTapVariants: Variants = {
  tap: { scale: 0.97 },
};

// Page transition variants
export const pageTransitionVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 20,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.luxury,
    },
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

// Modal variants
export const modalVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: easings.elastic,
    },
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

// Backdrop variants
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// Drawer variants
export const drawerVariants: Variants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0,
    transition: {
      duration: 0.4,
      ease: easings.luxury,
    },
  },
  exit: { 
    x: '100%',
    transition: {
      duration: 0.3,
      ease: easings.snappy,
    },
  },
};

// Dropdown variants
export const dropdownVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -10,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: easings.smooth,
    },
  },
  exit: { 
    opacity: 0, 
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
    },
  },
};

// Accordion variants
export const accordionVariants: Variants = {
  collapsed: { 
    height: 0, 
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
  expanded: { 
    height: 'auto', 
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
};

// Rotate variants
export const rotateVariants: Variants = {
  initial: { rotate: 0 },
  animate: { 
    rotate: 180,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
};

// Pulse variants
export const pulseVariants: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Floating variants
export const floatingVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// 3D tilt effect
export const tilt3DVariants = {
  initial: { 
    rotateX: 0, 
    rotateY: 0,
    transformPerspective: 1000,
  },
  hover: (values: { rotateX: number; rotateY: number }) => ({
    rotateX: values.rotateX,
    rotateY: values.rotateY,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  }),
};

// Reveal text variants (character by character)
export const revealTextVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

export const revealCharVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.luxury,
    },
  },
};

// Loading skeleton shimmer
export const shimmerVariants: Variants = {
  initial: { 
    backgroundPosition: '-200% 0',
  },
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Cart item add animation
export const cartItemAddVariants: Variants = {
  initial: { 
    scale: 0, 
    opacity: 0,
  },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 25,
    },
  },
  exit: { 
    scale: 0, 
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// Notification popup variants
export const notificationVariants: Variants = {
  initial: { 
    x: '100%', 
    opacity: 0,
  },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: easings.elastic,
    },
  },
  exit: { 
    x: '100%', 
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

// Scroll indicator bounce
export const scrollIndicatorVariants: Variants = {
  animate: {
    y: [0, 10, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Hero text reveal
export const heroTextVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    filter: 'blur(10px)',
  },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: easings.luxury,
    },
  },
};

// Product card 3D tilt
export const productCard3DVariants = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
};

// Gallery image transition
export const galleryImageVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easings.luxury,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.4,
      ease: easings.snappy,
    },
  }),
};
