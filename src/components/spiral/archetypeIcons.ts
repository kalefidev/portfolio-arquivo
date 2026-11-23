// The 2D stand-in of each 3D object, for the grid without 3D (StaticCourses): Phosphor `regular`,
// inlined as SVG source (`regular` rule in next.config.ts). A new archetype does not compile without one.
import browser from '@phosphor-icons/core/assets/regular/browser.svg'
import certificate from '@phosphor-icons/core/assets/regular/certificate.svg'
import chartBar from '@phosphor-icons/core/assets/regular/chart-bar.svg'
import cloud from '@phosphor-icons/core/assets/regular/cloud.svg'
import code from '@phosphor-icons/core/assets/regular/code.svg'
import cpu from '@phosphor-icons/core/assets/regular/cpu.svg'
import database from '@phosphor-icons/core/assets/regular/database.svg'
import gear from '@phosphor-icons/core/assets/regular/gear.svg'
import gitBranch from '@phosphor-icons/core/assets/regular/git-branch.svg'
import graph from '@phosphor-icons/core/assets/regular/graph.svg'
import hardDrives from '@phosphor-icons/core/assets/regular/hard-drives.svg'
import lightbulb from '@phosphor-icons/core/assets/regular/lightbulb.svg'
import lock from '@phosphor-icons/core/assets/regular/lock.svg'
import pkg from '@phosphor-icons/core/assets/regular/package.svg'
import palette from '@phosphor-icons/core/assets/regular/palette.svg'
import shieldCheck from '@phosphor-icons/core/assets/regular/shield-check.svg'
import terminalWindow from '@phosphor-icons/core/assets/regular/terminal-window.svg'
import type { Archetype } from '@/types'

export const archetypeIcons: Record<Archetype, string> = {
  cloud,
  shield: shieldCheck,
  lock,
  brackets: code,
  browser,
  database,
  gears: gear,
  neural: graph,
  terminal: terminalWindow,
  containers: pkg,
  server: hardDrives,
  chart: chartBar,
  'git-branch': gitBranch,
  chip: cpu,
  palette,
  bulb: lightbulb,
  icon: certificate,
}
