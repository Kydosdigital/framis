"use client";

import { config, type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faBookOpen,
  faTerminal,
  faLaptop,
  faCode,
  faUsers,
  faUserTie,
  faFolderOpen,
  faNetworkWired,
  faGraduationCap,
  faHandshake,
  faComments,
  faCheck,
  faCircleCheck,
  faXmark,
  faCircleXmark,
  faArrowRight,
  faPlay,
  faFlask,
  faBox,
  faArrowTrendUp,
  faDollarSign,
  faClock,
  faBullseye,
  faChartColumn,
  faRocket,
  faBolt,
  faFileLines,
  faPenNib,
  faImage,
  faBroom,
  faUserGear,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faSlack } from "@fortawesome/free-brands-svg-icons";

// Next.js App Router: we import the FA stylesheet ourselves above, so stop the
// library from injecting its own <style> at runtime (which causes a flash of
// huge icons before hydration).
config.autoAddCss = false;

/**
 * Curated Font Awesome (solid + brands) icon set for Framis. Use string names
 * so data files (e.g. CAPSTONE_TEMPLATES) can reference icons without importing
 * React. Add new icons here as needed — keep it a small, deliberate set.
 */
const ICONS: Record<string, IconDefinition> = {
  book: faBook,
  "book-open": faBookOpen,
  terminal: faTerminal,
  laptop: faLaptop,
  code: faCode,
  users: faUsers,
  "user-tie": faUserTie,
  folder: faFolderOpen,
  network: faNetworkWired,
  "graduation-cap": faGraduationCap,
  handshake: faHandshake,
  comments: faComments,
  slack: faSlack,
  check: faCheck,
  "circle-check": faCircleCheck,
  xmark: faXmark,
  "circle-xmark": faCircleXmark,
  "arrow-right": faArrowRight,
  play: faPlay,
  flask: faFlask,
  box: faBox,
  "trending-up": faArrowTrendUp,
  "dollar-sign": faDollarSign,
  clock: faClock,
  bullseye: faBullseye,
  "chart-bar": faChartColumn,
  rocket: faRocket,
  bolt: faBolt,
  "file-lines": faFileLines,
  "pen-nib": faPenNib,
  image: faImage,
  broom: faBroom,
  "user-gear": faUserGear,
  "list-check": faListCheck,
};

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  className,
  size,
}: {
  name: IconName | string;
  className?: string;
  /** pixel size; falls back to 1em (inherits font-size) when omitted */
  size?: number;
}) {
  const def = ICONS[name];
  if (!def) return null;
  return (
    <FontAwesomeIcon
      icon={def}
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-hidden
    />
  );
}
