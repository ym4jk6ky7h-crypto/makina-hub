/** JSX compartido para iconos PWA (ImageResponse / next/og). */
export function AppIconImage({ size, fontSize }: { size: number; fontSize: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: size * 0.18,
        background: "linear-gradient(135deg, #ff2d6a, #8b5cf6)",
        color: "white",
        fontSize,
        fontWeight: 800,
        fontFamily: "system-ui, sans-serif",
        letterSpacing: "-0.04em",
      }}
    >
      MH
    </div>
  );
}
