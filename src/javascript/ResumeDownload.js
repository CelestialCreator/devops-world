const PDF_URL = '/Akshay_Mhaskar.pdf'
const DOWNLOAD_FILENAME = 'Akshay_Mhaskar.pdf'
const SEQUENCE = 'cv'

function triggerDownload()
{
    const link = document.createElement('a')
    link.href = PDF_URL
    link.download = DOWNLOAD_FILENAME
    link.rel = 'noopener'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

function shouldIgnoreKeystroke(event)
{
    if(event.ctrlKey || event.metaKey || event.altKey) return true
    const target = event.target
    if(!target) return false
    const tag = target.tagName
    if(tag === 'INPUT' || tag === 'TEXTAREA') return true
    if(target.isContentEditable) return true
    return false
}

export default function setupResumeDownload()
{
    const button = document.querySelector('.js-resume-download')
    if(button)
    {
        button.addEventListener('click', (event) =>
        {
            event.preventDefault()
            triggerDownload()
        })
    }

    let buffer = ''
    window.addEventListener('keydown', (event) =>
    {
        if(shouldIgnoreKeystroke(event)) return
        if(event.key.length !== 1) return

        buffer = (buffer + event.key.toLowerCase()).slice(-SEQUENCE.length)

        if(buffer === SEQUENCE)
        {
            buffer = ''
            triggerDownload()
        }
    })
}
