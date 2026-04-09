import './style/main.css'
import { inject } from '@vercel/analytics'
import Application from './javascript/Application.js'

inject()

window.application = new Application({
    $canvas: document.querySelector('.js-canvas'),
    useComposer: true
})
