import './style/main.css'
import { inject } from '@vercel/analytics'
import Application from './javascript/Application.js'
import setupResumeDownload from './javascript/ResumeDownload.js'

inject()

window.application = new Application({
    $canvas: document.querySelector('.js-canvas'),
    useComposer: true
})

setupResumeDownload()
