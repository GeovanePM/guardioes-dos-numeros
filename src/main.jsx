import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// When a new Service Worker activates (skipWaiting), reload the page
// so browsers never serve stale assets (images, JS, CSS) from the old cache.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload()
  })
}

createRoot(document.getElementById('root')).render(<App />)
