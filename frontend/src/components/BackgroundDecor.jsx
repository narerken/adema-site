import { Butterfly, Flower } from './Doodles'

// Лёгкий декоративный слой: бабочки и цветочки, разбросанные по фону.
// pointer-events: none — не мешает кликам.
export default function BackgroundDecor() {
  const items = [
    { Comp: Butterfly, top: '8%', left: '6%', size: 46, delay: 0, color: '#bcd6ea' },
    { Comp: Butterfly, top: '18%', left: '88%', size: 36, delay: 1.2, color: '#f6c9d0' },
    { Comp: Flower, top: '70%', left: '4%', size: 40, delay: 0.4, color: '#f6c9d0' },
    { Comp: Flower, top: '85%', left: '92%', size: 34, delay: 0.8, color: '#bcd6ea' },
    { Comp: Butterfly, top: '55%', left: '95%', size: 30, delay: 2, color: '#f6e2a8' },
    { Comp: Flower, top: '30%', left: '95%', size: 26, delay: 1.6, color: '#ec9fb0' },
  ]
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <div className="absolute inset-0 bg-dots opacity-40" />
      {items.map(({ Comp, top, left, size, delay, color }, i) => (
        <div
          key={i}
          className="absolute animate-[float_7s_ease-in-out_infinite]"
          style={{ top, left, animationDelay: `${delay}s` }}
        >
          <Comp className="opacity-70" color={color} style={{ width: size, height: size }} width={size} height={size} />
        </div>
      ))}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(6deg); }
        }
      `}</style>
    </div>
  )
}
