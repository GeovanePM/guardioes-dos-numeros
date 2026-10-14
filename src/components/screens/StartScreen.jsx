export default function StartScreen({ onStart }) {
  return (
    <div className="screen screen-start">
      <div className="start-stars">
        {Array.from({ length: 20 }, (_, i) => (
          <span key={i} className="star-bg" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            fontSize: `${8 + Math.random() * 12}px`
          }}>✦</span>
        ))}
      </div>

      <div className="start-content">
        <div className="start-logo">
          <img
            src="/assets/logo.jpg"
            alt="Guardiões dos Números — Heróis da Escola"
            className="start-logo-img"
          />
          <h1 className="logo-title">
            <span className="logo-line1">Guardiões</span>
            <span className="logo-line2">dos Números</span>
          </h1>
        </div>

        <p className="start-subtitle">
          O Comandante Caos embaralhou os números do Reino da Matemática!<br />
          Escolha seu herói e restaure a ordem!
        </p>

        <div className="start-badges">
          <span className="badge badge-blue">⚡ Frações</span>
          <span className="badge badge-yellow">🔍 Problemas</span>
          <span className="badge badge-purple">⭐ Lógica</span>
        </div>

        <button className="btn btn-start" onClick={onStart}>
          Jogar Agora!
        </button>

        <p className="start-footer">
          PWA para as Turmas 11.501 · 11.502 · 11.503 · 11.504
        </p>
      </div>
    </div>
  )
}
