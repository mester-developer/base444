import { Link } from 'react-router-dom'
import SceneImage from '../components/SceneImage.jsx'

export default function NotFound() {
  return (
    <section className="container notfound" style={{ paddingBlockStart: 140 }}>
      <span className="label">ERROR / 404</span>
      <h1 className="display display--md">این مسیر در سیستم نیست</h1>
      <p className="lead" style={{ textAlign: 'center' }}>
        صفحه‌ای که دنبالش هستید پیدا نشد. می‌توانید از فروشگاه یا کالکشن‌ها شروع کنید.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBlockEnd: 40 }}>
        <Link className="btn" to="/shop">
          فروشگاه
        </Link>
        <Link className="btn btn--ghost" to="/">
          صفحه اصلی
        </Link>
      </div>
      <div style={{ width: 'min(760px, 100%)' }}>
        <SceneImage variant="ice" seed={30} ratio="16/9" alt="سطح یخی" />
      </div>
    </section>
  )
}
