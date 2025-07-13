import { createSignal, effect } from '../core/reactivity';

// Easing functions
export const easings = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInElastic: (t: number) => t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * ((2 * Math.PI) / 3)),
  easeOutElastic: (t: number) => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1,
  easeInBounce: (t: number) => 1 - easings.easeOutBounce(1 - t),
  easeOutBounce: (t: number) => {
    if (t < 1 / 2.75) return 7.5625 * t * t;
    if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  }
};

// Animation configuration
export interface AnimationConfig {
  duration: number;
  easing?: keyof typeof easings;
  delay?: number;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
}

// Animate a value over time
export function animate(
  from: number,
  to: number,
  config: AnimationConfig
): () => void {
  const { duration, easing = 'linear', delay = 0, onUpdate, onComplete } = config;
  const easingFn = easings[easing];
  
  let startTime: number | null = null;
  let animationId: number | null = null;
  let isCancelled = false;
  
  const animate = (currentTime: number) => {
    if (isCancelled) return;
    
    if (startTime === null) {
      startTime = currentTime + delay;
    }
    
    if (currentTime < startTime) {
      animationId = requestAnimationFrame(animate);
      return;
    }
    
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFn(progress);
    
    const currentValue = from + (to - from) * easedProgress;
    
    if (onUpdate) {
      onUpdate(currentValue);
    }
    
    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      if (onComplete) {
        onComplete();
      }
    }
  };
  
  animationId = requestAnimationFrame(animate);
  
  return () => {
    isCancelled = true;
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
    }
  };
}

// Animate multiple properties
export function animateProperties(
  element: HTMLElement,
  properties: Record<string, { from: number; to: number }>,
  config: AnimationConfig
): () => void {
  const { duration, easing = 'linear', delay = 0, onComplete } = config;
  const easingFn = easings[easing];
  
  let startTime: number | null = null;
  let animationId: number | null = null;
  let isCancelled = false;
  
  const animate = (currentTime: number) => {
    if (isCancelled) return;
    
    if (startTime === null) {
      startTime = currentTime + delay;
    }
    
    if (currentTime < startTime) {
      animationId = requestAnimationFrame(animate);
      return;
    }
    
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFn(progress);
    
    Object.entries(properties).forEach(([property, { from, to }]) => {
      const currentValue = from + (to - from) * easedProgress;
      element.style[property as any] = `${currentValue}px`;
    });
    
    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      if (onComplete) {
        onComplete();
      }
    }
  };
  
  animationId = requestAnimationFrame(animate);
  
  return () => {
    isCancelled = true;
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
    }
  };
}

// Keyframe animation
export interface Keyframe {
  offset: number; // 0 to 1
  properties: Record<string, string | number>;
}

export function animateKeyframes(
  element: HTMLElement,
  keyframes: Keyframe[],
  config: AnimationConfig
): () => void {
  const { duration, easing = 'linear', delay = 0, onComplete } = config;
  const easingFn = easings[easing];
  
  let startTime: number | null = null;
  let animationId: number | null = null;
  let isCancelled = false;
  
  const animate = (currentTime: number) => {
    if (isCancelled) return;
    
    if (startTime === null) {
      startTime = currentTime + delay;
    }
    
    if (currentTime < startTime) {
      animationId = requestAnimationFrame(animate);
      return;
    }
    
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFn(progress);
    
    // Find the current keyframe
    let currentKeyframe: Keyframe | null = null;
    let nextKeyframe: Keyframe | null = null;
    
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (easedProgress >= keyframes[i].offset && easedProgress <= keyframes[i + 1].offset) {
        currentKeyframe = keyframes[i];
        nextKeyframe = keyframes[i + 1];
        break;
      }
    }
    
    if (currentKeyframe && nextKeyframe) {
      const keyframeProgress = (easedProgress - currentKeyframe.offset) / 
        (nextKeyframe.offset - currentKeyframe.offset);
      
      Object.keys(currentKeyframe.properties).forEach(property => {
        const from = currentKeyframe!.properties[property];
        const to = nextKeyframe!.properties[property];
        
        if (typeof from === 'number' && typeof to === 'number') {
          const currentValue = from + (to - from) * keyframeProgress;
          element.style[property as any] = `${currentValue}px`;
                 } else {
           element.style[property as any] = keyframeProgress < 0.5 ? String(from) : String(to);
         }
      });
    }
    
    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      if (onComplete) {
        onComplete();
      }
    }
  };
  
  animationId = requestAnimationFrame(animate);
  
  return () => {
    isCancelled = true;
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
    }
  };
}

// Predefined animations
export const animations = {
  fadeIn: (element: HTMLElement, duration = 300) => {
    element.style.opacity = '0';
    return animateProperties(element, {
      opacity: { from: 0, to: 1 }
    }, { duration, easing: 'easeOutQuad' });
  },
  
  fadeOut: (element: HTMLElement, duration = 300) => {
    return animateProperties(element, {
      opacity: { from: 1, to: 0 }
    }, { duration, easing: 'easeInQuad' });
  },
  
  slideIn: (element: HTMLElement, direction: 'left' | 'right' | 'up' | 'down' = 'left', duration = 300) => {
    const properties: Record<string, { from: number; to: number }> = {};
    
    switch (direction) {
      case 'left':
        properties.transform = { from: -100, to: 0 };
        break;
      case 'right':
        properties.transform = { from: 100, to: 0 };
        break;
      case 'up':
        properties.transform = { from: -100, to: 0 };
        break;
      case 'down':
        properties.transform = { from: 100, to: 0 };
        break;
    }
    
    element.style.transform = `translate${direction === 'left' || direction === 'right' ? 'X' : 'Y'}(${properties.transform.from}px)`;
    
    return animateProperties(element, properties, { duration, easing: 'easeOutBounce' });
  },
  
  slideOut: (element: HTMLElement, direction: 'left' | 'right' | 'up' | 'down' = 'left', duration = 300) => {
    const properties: Record<string, { from: number; to: number }> = {};
    
    switch (direction) {
      case 'left':
        properties.transform = { from: 0, to: -100 };
        break;
      case 'right':
        properties.transform = { from: 0, to: 100 };
        break;
      case 'up':
        properties.transform = { from: 0, to: -100 };
        break;
      case 'down':
        properties.transform = { from: 0, to: 100 };
        break;
    }
    
    return animateProperties(element, properties, { duration, easing: 'easeInQuad' });
  },
  
  scale: (element: HTMLElement, from = 0, to = 1, duration = 300) => {
    element.style.transform = `scale(${from})`;
    return animateProperties(element, {
      transform: { from, to }
    }, { duration, easing: 'easeOutBounce' });
  },
  
  rotate: (element: HTMLElement, from = 0, to = 360, duration = 1000) => {
    element.style.transform = `rotate(${from}deg)`;
    return animateProperties(element, {
      transform: { from, to }
    }, { duration, easing: 'linear' });
  }
};

// Animation hooks for reactive components
export function useAnimation() {
  const [isAnimating, setIsAnimating] = createSignal(false);
  
  const animate = (animationFn: () => () => void) => {
    setIsAnimating(true);
    const cancel = animationFn();
    return () => {
      cancel();
      setIsAnimating(false);
    };
  };
  
  return { isAnimating, animate };
} 