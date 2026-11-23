/** SplitText options shared by the title reveals: lines behind a mask that bleeds 0.15em past the
 *  line box (`.split-line-mask` in globals.css), so accents and cedillas are not cut. */
export const LINE_SPLIT = { type: 'lines', mask: 'lines', linesClass: 'split-line' } as const

/** yPercent a line travels to hide behind its mask: 100 + twice the bleed — the mask reaches 0.15em
 *  past the line box and an accent sticks out of the box by up to as much (0.3em ≈ 33% of a 0.92em line). */
export const MASK_TRAVEL = 135
