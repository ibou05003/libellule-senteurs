"use client";

export default function BrandMarquee() {
  const line1 = "Libellule Senteurs \u00B7 Parfums d\u2019int\u00E9rieur \u00B7 ";
  const line2 = "Haut de Gamme \u00B7 Dakar \u00B7 Fait Main \u00B7 ";
  const repeated1 = Array(8).fill(line1).join("");
  const repeated2 = Array(8).fill(line2).join("");

  const strokeStyle = {
    WebkitTextStroke: "1px #C99700",
    WebkitTextFillColor: "transparent",
  } as React.CSSProperties;

  const filledStyle = {
    color: "#C99700",
  };

  return (
    <section className="relative flex flex-col justify-center gap-3 overflow-hidden bg-noir-profond py-12 md:gap-6 md:py-24 lg:gap-8 lg:py-32">
      {/* Line 1 — scrolls left */}
      <div className="animate-marquee flex whitespace-nowrap">
        <span className="font-heading text-[6vw] leading-none md:text-[5vw]" style={strokeStyle}>
          {repeated1}
        </span>
        <span className="font-heading text-[6vw] leading-none md:text-[5vw]" style={strokeStyle}>
          {repeated1}
        </span>
      </div>

      {/* Line 2 — scrolls right (reverse) */}
      <div className="animate-marquee-reverse flex whitespace-nowrap">
        <span className="font-heading text-[6vw] leading-none md:text-[5vw]" style={filledStyle}>
          {repeated2}
        </span>
        <span className="font-heading text-[6vw] leading-none md:text-[5vw]" style={filledStyle}>
          {repeated2}
        </span>
      </div>
    </section>
  );
}
