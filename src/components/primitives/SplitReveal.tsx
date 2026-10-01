import { m } from 'framer-motion';
import { Fragment, useMemo } from 'react';
import { useReducedMotion } from '../../hooks/useMediaQuery';
import { EASE_OUT_EXPO } from '../../lib/motion';
import { cn } from '../../lib/utils';

type Tag = 'h1' | 'h2' | 'h3' | 'p';

interface SplitRevealProps {
  /** Lines split on "\n"; wrap words in *asterisks* for the serif italic accent. */
  text: string;
  as?: Tag;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Controlled playback; omit to play when scrolled into view. */
  play?: boolean;
  id?: string;
}

interface Word {
  text: string;
  em: boolean;
}

function parse(text: string): Word[][] {
  return text.split('\n').map((line) => {
    const words: Word[] = [];
    line.split('*').forEach((chunk, i) => {
      chunk
        .split(' ')
        .filter(Boolean)
        .forEach((w) => words.push({ text: w, em: i % 2 === 1 }));
    });
    return words;
  });
}

const tags = { h1: m.h1, h2: m.h2, h3: m.h3, p: m.p };

/** Masked word-by-word reveal. The full sentence stays available to assistive tech. */
export function SplitReveal({ text, as = 'h2', className, delay = 0, stagger = 0.06, play, id }: SplitRevealProps) {
  const reduced = useReducedMotion();
  const lines = useMemo(() => parse(text), [text]);
  const plain = text.replace(/\*/g, '').replace(/\n/g, ' ');
  const Comp = tags[as];

  const controlled = play !== undefined;
  const motionProps = reduced
    ? {}
    : controlled
      ? { initial: 'hidden', animate: play ? 'visible' : 'hidden' }
      : { initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.4 } };

  return (
    <Comp
      id={id}
      className={className}
      {...motionProps}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      <span className="sr-only">{plain}</span>
      <span aria-hidden="true">
        {lines.map((words, li) => (
          <span key={li} className="block">
            {words.map((word, wi) => (
              <Fragment key={`${li}-${wi}`}>
                <span className="-mb-[0.14em] inline-block overflow-hidden pr-[0.04em] pb-[0.14em] align-top">
                    <m.span
                      className={cn('inline-block', word.em && 'serif-em')}
                      variants={
                        reduced
                          ? undefined
                          : {
                              hidden: { y: '115%', rotate: 4 },
                              visible: { y: '0%', rotate: 0, transition: { duration: 1.05, ease: EASE_OUT_EXPO } },
                            }
                      }
                    >
                      {word.text}
                    </m.span>
                  </span>
                  {wi < words.length - 1 && ' '}
                </Fragment>
            ))}
          </span>
        ))}
      </span>
    </Comp>
  );
}
