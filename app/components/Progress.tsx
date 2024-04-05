/*
 * Shout-out to Gustavo Guichard (gustavoguichard on Twitter) for this awesome progress bar!
 * You can find the original blog post here: https://dev.to/gugaguichard/creating-a-github-like-progress-bar-for-your-remix-app-153l
 * and the BOOK: Full Stack Web Dev with REMIX   : Andre Landgraf
*/

import { useNavigation } from '@remix-run/react';
import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';

function Progress() {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimationCompleted, setHasAnimationCompleted] = useState(true);

  const navigation = useNavigation();
  const isTransitioning = navigation.state !== 'idle';
  //console.log("Progress naviation state ",navigation.state)
  useEffect(() => {
    if (!isTransitioning) {
      return;
    }

    async function awaitAnimationCompletion() {
      if (!ref.current) return;
      const runningAnimations = ref.current.getAnimations();
      const animationPromises = runningAnimations.map((animation) => animation.finished);
      await Promise.allSettled(animationPromises);
      setHasAnimationCompleted(true);
    }

    setHasAnimationCompleted(false);
    awaitAnimationCompletion();
  }, [isTransitioning]);

  return (
    <div
      role="progressbar"
      aria-hidden={!isTransitioning}
      aria-valuetext={isTransitioning ? 'Loading' : undefined}
      className="fixed inset-x-0 top-0 left-0 z-50 h-1 animate-pulse"
    >
      <div
        ref={ref}
        className={clsx(
          'h-full bg-gradient-to-r from-purple-950 to-red-600  dark:from-white  dark:to-yellow-400 transition-all duration-1000 ease-in-out',
          navigation.state === 'idle' && hasAnimationCompleted && 'w-0 opacity-0 transition-none',
          navigation.state === 'submitting' && 'w-6/12',
          navigation.state === 'loading' && 'w-12/12',
          navigation.state === 'idle' && !hasAnimationCompleted && 'w-full',
        )}
      />
    </div>
  );
}

export { Progress };