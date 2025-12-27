import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'animate.css'
import AOS from 'aos'
import 'aos/dist/aos.css' // You can also use <link> for styles
// ..
AOS.init()
// Tạo router instance từ mảng routes
createRoot(document.getElementById('root')!).render(<App />)
