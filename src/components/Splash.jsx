export default function Splash({ saindo }) {
  return (
    <div className={`splash ${saindo ? 'splash-exit' : ''}`}>
      <div className="splash-glow" style={{ width: 250, height: 250, background: '#5B21B6', top: '20%', right: '-20%' }} />
      <div className="splash-glow" style={{ width: 180, height: 180, background: '#0EA5E9', bottom: '20%', left: '-15%', animationDelay: '0.5s' }} />
      <div className="splash-glow" style={{ width: 120, height: 120, background: '#F59E0B', top: '50%', left: '60%', animationDelay: '1s' }} />
      <div className="splash-logo">
        Impulse<br />
        <span className="splash-logo-gradient">Experience</span>
      </div>
      <div className="splash-bar splash-loader">
        <div className="splash-loader-bar" />
      </div>
    </div>
  )
}
