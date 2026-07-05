import Image from "next/image";

export function Logo({
  size = 24,
  wordSize = 17,
  light = false,
}: {
  size?: number;
  wordSize?: number;
  light?: boolean;
}) {
  return (
    <div className="flex items-center gap-[10px]">
      <Image
        src="/framis-mark.png"
        alt="Framis logo"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        priority
      />
      <span
        className="font-inter font-bold tracking-[-0.02em]"
        style={{ fontSize: wordSize, color: light ? "#fff" : "#1F2937" }}
      >
        Framis
      </span>
    </div>
  );
}

/** The checkmark used across checkboxes and success states. */
export function Check({
  size = 11,
  stroke = "#fff",
  width = 3.4,
  opacity = 1,
}: {
  size?: number;
  stroke?: string;
  width?: number;
  opacity?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
      <path
        d="M4 12.5l5 5L20 6.5"
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
