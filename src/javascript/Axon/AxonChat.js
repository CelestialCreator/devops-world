import '../../style/axon.css'
import AxonFallback from './AxonFallback.js'
import { AXON_SYSTEM_PROMPT } from './axonSystemPrompt.js'
import { FAQ_DATA, DEFAULT_ANSWER, getFaqById } from './axonFaqData.js'

export default class AxonChat
{
    constructor(_options)
    {
        this.config = _options.config

        // State
        this.isOpen = false
        this.isReady = false
        this.isGenerating = false
        this.isFallbackMode = false
        this.worker = null
        this.fallback = null
        this.conversationHistory = []
        this.sessionMessageCount = 0
        this.rateLimit = { count: 0, windowStart: Date.now() }

        // Constants
        this.MAX_INPUT_LENGTH = 300
        this.MAX_MESSAGES_PER_MINUTE = 10
        this.MAX_SESSION_MESSAGES = 30
        this.MAX_HISTORY_TURNS = 4

        this.createDOM()
        this.bindEvents()
    }

    // --- DOM Creation ---

    createDOM()
    {
        this.$container = document.createElement('div')
        this.$container.className = 'axon-chat'

        // Bubble
        this.$bubble = document.createElement('button')
        this.$bubble.className = 'axon-bubble'
        this.$bubble.innerHTML = '<span class="axon-bubble-icon">&#x2B22;</span><span class="axon-bubble-label">Ask Axon</span>'

        // Panel
        this.$panel = document.createElement('div')
        this.$panel.className = 'axon-panel'

        // Header
        const $header = document.createElement('div')
        $header.className = 'axon-header'
        $header.innerHTML = `
            <div class="axon-header-info">
                <span class="axon-title">Axon</span>
                <span class="axon-subtitle">Akshay's AI Assistant</span>
            </div>
        `
        this.$close = document.createElement('button')
        this.$close.className = 'axon-close'
        this.$close.textContent = '\u00D7'
        $header.appendChild(this.$close)

        // Fallback banner (hidden by default)
        this.$fallbackBanner = document.createElement('div')
        this.$fallbackBanner.className = 'axon-fallback-banner'
        this.$fallbackBanner.textContent = 'Running in offline mode \u2014 showing pre-written answers'
        this.$fallbackBanner.style.display = 'none'

        // Messages
        this.$messages = document.createElement('div')
        this.$messages.className = 'axon-messages'

        // Loading
        this.$loading = document.createElement('div')
        this.$loading.className = 'axon-loading'
        this.$loading.innerHTML = `
            <div class="axon-progress-bar"><div class="axon-progress-fill"></div></div>
            <span class="axon-progress-text">Loading Axon's brain...</span>
        `
        this.$progressFill = this.$loading.querySelector('.axon-progress-fill')
        this.$progressText = this.$loading.querySelector('.axon-progress-text')

        // Quick actions
        this.$quickActions = document.createElement('div')
        this.$quickActions.className = 'axon-quick-actions'
        const quickButtons = ['Experience', 'Skills', 'Projects', 'Contact']
        for(const label of quickButtons)
        {
            const btn = document.createElement('button')
            btn.className = 'axon-quick-btn'
            btn.textContent = label
            btn.dataset.query = `Tell me about Akshay's ${label.toLowerCase()}`
            btn.dataset.faqId = label.toLowerCase()
            this.$quickActions.appendChild(btn)
        }

        // Input row
        this.$inputRow = document.createElement('div')
        this.$inputRow.className = 'axon-input-row'

        this.$input = document.createElement('input')
        this.$input.className = 'axon-input'
        this.$input.placeholder = "Ask about Akshay's work..."
        this.$input.maxLength = this.MAX_INPUT_LENGTH

        this.$send = document.createElement('button')
        this.$send.className = 'axon-send'
        this.$send.innerHTML = '&#x27A4;'

        this.$inputRow.appendChild(this.$input)
        this.$inputRow.appendChild(this.$send)

        // Assemble panel
        this.$panel.appendChild($header)
        this.$panel.appendChild(this.$fallbackBanner)
        this.$panel.appendChild(this.$messages)
        this.$panel.appendChild(this.$loading)
        this.$panel.appendChild(this.$quickActions)
        this.$panel.appendChild(this.$inputRow)

        // Assemble container
        this.$container.appendChild(this.$bubble)
        this.$container.appendChild(this.$panel)

        document.body.appendChild(this.$container)
    }

    // --- Event Binding ---

    bindEvents()
    {
        this.$bubble.addEventListener('click', () => this.open())
        this.$close.addEventListener('click', () => this.close())
        this.$send.addEventListener('click', () => this.handleSend())
        this.$input.addEventListener('keydown', (e) =>
        {
            if(e.key === 'Enter' && !e.shiftKey)
            {
                e.preventDefault()
                this.handleSend()
            }
        })

        this.$quickActions.addEventListener('click', (e) =>
        {
            const btn = e.target.closest('.axon-quick-btn')
            if(btn)
            {
                this.$input.value = btn.dataset.query
                // Preset buttons use hardcoded FAQ looked up by ID (fast, reliable)
                this.handleSend({ faqId: btn.dataset.faqId })
            }
        })
    }

    // --- Open/Close ---

    open()
    {
        this.isOpen = true
        this.$bubble.classList.add('is-hidden')
        this.$panel.classList.add('is-open')
        this.$input.focus()

        if(!this.isReady && !this.isFallbackMode)
        {
            this.initModel()
        }
    }

    close()
    {
        this.isOpen = false
        this.$bubble.classList.remove('is-hidden')
        this.$panel.classList.remove('is-open')
    }

    // --- Model Initialization ---

    initModel()
    {
        const hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator

        if(!hasWebGPU)
        {
            this.initFallback()
            return
        }

        // Show loading state
        this.$loading.classList.add('is-active')
        this.$inputRow.style.display = 'none'
        this.addMessage("Downloading Axon's brain (~700MB, one-time only)...", 'system')

        // Spawn web worker
        this.worker = new Worker(
            new URL('./AxonWorker.js', import.meta.url),
            { type: 'module' }
        )

        this.worker.onmessage = ({ data }) =>
        {
            switch(data.type)
            {
                case 'progress':
                    this.handleProgress(data)
                    break
                case 'ready':
                    this.handleReady()
                    break
                case 'token':
                    this.handleToken(data.text)
                    break
                case 'done':
                    this.handleDone(data.full)
                    break
                case 'error':
                    this.handleError(data.message)
                    break
            }
        }

        this.worker.onerror = (e) =>
        {
            console.error('Axon worker error:', e)
            this.handleError(e.message || 'Worker failed to start')
        }

        this.worker.postMessage({ type: 'init' })
    }

    initFallback()
    {
        this.isFallbackMode = true
        this.isReady = true
        this.fallback = new AxonFallback()
        this.$fallbackBanner.style.display = 'block'
        this.addMessage("Hi! I'm Axon, Akshay's portfolio assistant. Ask me about his work, skills, or projects!", 'axon')
    }

    // --- Progress & Ready ---

    handleProgress(data)
    {
        if(data.total && data.loaded)
        {
            const pct = Math.round(data.progress || (data.loaded / data.total * 100))
            this.$progressFill.style.width = pct + '%'
            const loadedMB = (data.loaded / 1024 / 1024).toFixed(0)
            const totalMB = (data.total / 1024 / 1024).toFixed(0)
            this.$progressText.textContent = `Downloading... ${loadedMB}MB / ${totalMB}MB`
        }
    }

    handleReady()
    {
        this.isReady = true
        this.$loading.classList.remove('is-active')
        this.$inputRow.style.display = 'flex'

        // Clear system messages
        const systemMsgs = this.$messages.querySelectorAll('.is-system')
        for(const msg of systemMsgs) msg.remove()

        this.addMessage("Hi! I'm Axon, Akshay's AI assistant. Ask me about his DevOps experience, skills, or projects!", 'axon')
    }

    // --- Sending Messages ---

    handleSend(options = {})
    {
        const raw = this.$input.value.trim()
        if(!raw || this.isGenerating) return

        const text = this.sanitizeInput(raw)
        if(!text) return

        if(!this.canSend())
        {
            this.addMessage("Slow down! Try again in a moment.", 'system')
            return
        }

        this.$input.value = ''
        this.sessionMessageCount++
        this.rateLimit.count++

        this.addMessage(text, 'user')

        // Check off-topic / jailbreak
        if(this.isOffTopic(text))
        {
            this.streamFaqResponse("I'm Axon, Akshay's portfolio assistant. I can help with questions about his work and experience. What would you like to know?")
            return
        }

        // Preset buttons: look up FAQ by exact id (fast, reliable, no keyword matching)
        if(options.faqId)
        {
            const faqResult = getFaqById(options.faqId)
            this.streamFaqResponse(faqResult || DEFAULT_ANSWER)
            return
        }

        // Pure fallback mode (no WebGPU / model failed): use FAQ keyword match
        if(this.isFallbackMode)
        {
            const faqResult = this.tryFaq(text)
            this.streamFaqResponse(faqResult || DEFAULT_ANSWER)
            return
        }

        if(!this.isReady)
        {
            this.addMessage("Still loading... please wait a moment.", 'system')
            return
        }

        // Send free-form text to fine-tuned LLM
        this.generateResponse(text)
    }

    generateResponse(userText)
    {
        this.isGenerating = true
        this.$send.disabled = true

        // Build conversation for the model
        this.conversationHistory.push({ role: 'user', content: userText })

        // Trim to last N messages
        if(this.conversationHistory.length > this.MAX_HISTORY_TURNS)
        {
            this.conversationHistory = this.conversationHistory.slice(-this.MAX_HISTORY_TURNS)
        }

        const messages = [
            { role: 'system', content: AXON_SYSTEM_PROMPT },
            ...this.conversationHistory
        ]

        // Show typing indicator
        this.$typingEl = this.addTypingIndicator()

        this.worker.postMessage({ type: 'generate', messages })
        this.currentStreamText = ''
        this.currentStreamEl = null
    }

    // --- Streaming Tokens ---

    handleToken(token)
    {
        // Remove typing indicator on first token
        if(this.$typingEl)
        {
            this.$typingEl.remove()
            this.$typingEl = null
        }

        this.currentStreamText += token

        if(!this.currentStreamEl)
        {
            this.currentStreamEl = this.addMessage('', 'axon')
        }

        this.currentStreamEl.textContent = this.currentStreamText
        this.scrollToBottom()
    }

    handleDone(fullText)
    {
        // Remove typing indicator if still present
        if(this.$typingEl)
        {
            this.$typingEl.remove()
            this.$typingEl = null
        }

        // Ensure final text is displayed
        if(this.currentStreamEl)
        {
            this.currentStreamEl.textContent = fullText || this.currentStreamText
        }
        else if(fullText)
        {
            this.addMessage(fullText, 'axon')
        }

        this.conversationHistory.push({ role: 'assistant', content: fullText || this.currentStreamText })

        this.isGenerating = false
        this.$send.disabled = false
        this.currentStreamEl = null
        this.currentStreamText = ''
        this.scrollToBottom()
    }

    handleError(message)
    {
        // Remove typing indicator
        if(this.$typingEl)
        {
            this.$typingEl.remove()
            this.$typingEl = null
        }

        console.warn('Axon error:', message)

        // Fall back to FAQ mode on error
        if(!this.isFallbackMode && !this.isReady)
        {
            this.$loading.classList.remove('is-active')
            this.$inputRow.style.display = 'flex'
            this.initFallback()
            this.addMessage("Switched to offline mode due to a loading issue.", 'system')
        }
        else
        {
            this.addMessage("Something went wrong. Try asking again!", 'system')
        }

        this.isGenerating = false
        this.$send.disabled = false
    }

    // --- Simulated Streaming for FAQ ---

    streamFaqResponse(text)
    {
        this.isGenerating = true
        this.$send.disabled = true

        // Show typing dots first
        const $typing = this.addTypingIndicator()

        // Small delay before starting to "type"
        const startDelay = 300 + Math.random() * 400

        window.setTimeout(() =>
        {
            $typing.remove()

            const $msg = this.addMessage('', 'axon')
            let index = 0

            // Stream characters in chunks of 2-4 for natural feel
            const streamInterval = window.setInterval(() =>
            {
                const chunkSize = 2 + Math.floor(Math.random() * 3)
                const chunk = text.slice(index, index + chunkSize)
                index += chunkSize

                $msg.textContent = text.slice(0, index)
                this.scrollToBottom()

                if(index >= text.length)
                {
                    window.clearInterval(streamInterval)
                    $msg.textContent = text
                    this.isGenerating = false
                    this.$send.disabled = false
                }
            }, 18)
        }, startDelay)
    }

    // --- DOM Helpers ---

    addMessage(text, type)
    {
        const $msg = document.createElement('div')
        $msg.className = `axon-msg is-${type}`
        $msg.textContent = text
        this.$messages.appendChild($msg)
        this.scrollToBottom()
        return $msg
    }

    addTypingIndicator()
    {
        const $typing = document.createElement('div')
        $typing.className = 'axon-typing'
        $typing.innerHTML = '<span class="axon-typing-dot"></span><span class="axon-typing-dot"></span><span class="axon-typing-dot"></span>'
        this.$messages.appendChild($typing)
        this.scrollToBottom()
        return $typing
    }

    scrollToBottom()
    {
        this.$messages.scrollTop = this.$messages.scrollHeight
    }

    // --- Guardrails ---

    sanitizeInput(text)
    {
        return text
            .trim()
            .slice(0, this.MAX_INPUT_LENGTH)
            .replace(/<[^>]*>/g, '')
    }

    canSend()
    {
        const now = Date.now()

        // Reset window
        if(now - this.rateLimit.windowStart > 60000)
        {
            this.rateLimit = { count: 0, windowStart: now }
        }

        if(this.rateLimit.count >= this.MAX_MESSAGES_PER_MINUTE) return false
        if(this.sessionMessageCount >= this.MAX_SESSION_MESSAGES) return false

        return true
    }

    tryFaq(input)
    {
        const lower = input.toLowerCase()
        const words = lower.split(/\s+/).filter(w => w.length > 2)
        let bestScore = 0
        let bestAnswer = null

        for(const entry of FAQ_DATA)
        {
            let score = 0
            for(const keyword of entry.keywords)
            {
                // Exact word match
                if(lower.includes(keyword))
                {
                    score += 2
                }
                // Partial match
                for(const word of words)
                {
                    if(word.includes(keyword) || keyword.includes(word))
                    {
                        score += 1
                    }
                }
            }

            if(score > bestScore)
            {
                bestScore = score
                bestAnswer = entry.answer
            }
        }

        // Only return FAQ answer if confidence is high enough (score >= 3)
        // Lower scores go to the LLM for a better answer
        if(bestScore >= 3)
        {
            return bestAnswer
        }

        return null
    }

    isOffTopic(input)
    {
        const patterns = [
            /write\s+(a\s+|me\s+)?code/i,
            /generate\s+(a\s+)?script/i,
            /ignore\s+(all\s+)?previous/i,
            /forget\s+(your\s+)?prompt/i,
            /system\s*prompt/i,
            /pretend\s+(you|to\s+be)/i,
            /act\s+as\s+(a|an)/i,
            /jailbreak/i,
            /\bDAN\b/,
            /you\s+are\s+now/i
        ]
        return patterns.some(p => p.test(input))
    }
}
