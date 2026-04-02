import * as THREE from 'three'
import { createBox, createTextLabel, createInfoPanel } from './AkshayHelpers.js'

export default class AILabSection
{
    constructor(_options)
    {
        this.objects = _options.objects
        this.x = _options.x
        this.y = _options.y

        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false
        this.container.updateMatrix()

        this.setLabels()
        this.setObjects()
    }

    setLabels()
    {
        const title = createTextLabel('AI RESEARCH LAB', { fontSize: 64, color: '#FF1744', maxWidth: 8 })
        title.position.set(this.x, this.y + 8, 0.01)
        title.updateMatrix()
        this.container.add(title)

        const subtitle = createTextLabel('GPU Infrastructure | Voice AI | Agents', { fontSize: 26, color: '#993333', maxWidth: 7 })
        subtitle.position.set(this.x, this.y + 6.5, 0.01)
        subtitle.updateMatrix()
        this.container.add(subtitle)

        const gpuPanel = createInfoPanel(
            'GPU Bare Metal Home Lab',
            'K8s 1.35 | NVIDIA | Cilium | 50GB VRAM',
            '3-GPU cluster on single Debian server:\nRTX 5090 + RTX 3080 + RTX 2070 Super\n\n6 ML projects: LoRA training,\nmusic generation, GRPO reasoning,\nmulti-token prediction (1.8x speedup)\n\nNVIDIA Container Toolkit\nGPU scheduling & device plugin\nvLLM inference serving',
            { accentColor: '#FF1744', worldWidth: 7, height: 400 }
        )
        gpuPanel.position.set(this.x - 4, this.y + 2, 0.01)
        gpuPanel.updateMatrix()
        this.container.add(gpuPanel)

        const voicePanel = createInfoPanel(
            'AI Voice Agent',
            'LiveKit | Chatterbox TTS | WhatsApp | SIP',
            'Real-time voice AI agent built on\nLiveKit with WebRTC streaming\n\nMulti-channel: SIP telephony,\nWhatsApp calls, web dashboard\n\nChatterbox Streaming: 23-language TTS\nzero-shot voice cloning\n\nIndic Parler-TTS: 21 Indian languages\n69 voices, emotion support\n\nFull pipeline: STT → LLM → TTS',
            { accentColor: '#FF1744', worldWidth: 5, height: 450 }
        )
        voicePanel.position.set(this.x + 5, this.y + 2, 0.01)
        voicePanel.updateMatrix()
        this.container.add(voicePanel)

        const agentPanel = createInfoPanel(
            'OpenZosma - AI Agent Platform',
            'Hierarchical Agents | Multi-Channel',
            'Self-hosted AI agent platform\nfor organizational automation\n\nMulti-channel: WhatsApp, Slack, Web\nAgent-to-agent via Google A2A\n\nSandboxed execution (NemoClaw)\nHuman-in-the-loop approval\n\nK8s-native coding agent:\nGitHub issues → PRs autonomously',
            { accentColor: '#FF1744', worldWidth: 6 }
        )
        agentPanel.position.set(this.x, this.y - 4, 0.01)
        agentPanel.updateMatrix()
        this.container.add(agentPanel)
    }

    setObjects()
    {
        const x = this.x
        const y = this.y

        // --- 1. Raised floor tiles (data center raised floor) ---
        for(let fx = -4; fx <= 4; fx += 2)
        {
            for(let fy = -5; fy <= -1; fy += 2)
            {
                const tile = createBox(1.8, 1.8, 0.08, 'gray')
                this.objects.add({ ...tile, offset: new THREE.Vector3(x + fx, y + fy, 0.04), mass: 0 })
            }
        }

        // --- 2. Server Rack Row A (south, facing north) ---
        for(let i = 0; i < 5; i++)
        {
            const rx = -4 + i * 2

            // Rack body
            const body = createBox(0.8, 0.5, 1.8, 'black')
            this.objects.add({ ...body, offset: new THREE.Vector3(x + rx, y - 4, 0.9), mass: 0 })

            // LED indicators (green, front face)
            const led = createBox(0.5, 0.06, 0.15, 'emeraldGreen')
            this.objects.add({ ...led, offset: new THREE.Vector3(x + rx, y - 4 + 0.28, 1.4), mass: 0 })

            // Top rail (metal)
            const rail = createBox(0.85, 0.55, 0.06, 'metal')
            this.objects.add({ ...rail, offset: new THREE.Vector3(x + rx, y - 4, 1.83), mass: 0 })
        }

        // --- 3. Server Rack Row B (north, facing south) ---
        for(let i = 0; i < 5; i++)
        {
            const rx = -4 + i * 2

            // Rack body
            const body = createBox(0.8, 0.5, 1.8, 'black')
            this.objects.add({ ...body, offset: new THREE.Vector3(x + rx, y - 2, 0.9), mass: 0 })

            // LED indicators (blue, south face)
            const led = createBox(0.5, 0.06, 0.15, 'blue')
            this.objects.add({ ...led, offset: new THREE.Vector3(x + rx, y - 2 - 0.28, 1.4), mass: 0 })

            // Top rail (metal)
            const rail = createBox(0.85, 0.55, 0.06, 'metal')
            this.objects.add({ ...rail, offset: new THREE.Vector3(x + rx, y - 2, 1.83), mass: 0 })
        }

        // --- 4. Central GPU Compute Cluster (centerpiece) ---
        // Main body
        const gpuMain = createBox(1.5, 1.0, 2.2, 'black')
        this.objects.add({ ...gpuMain, offset: new THREE.Vector3(x, y - 3, 1.1), mass: 0 })

        // Red accent strips (front and back)
        const gpuAccentF = createBox(1.2, 0.08, 0.4, 'red')
        this.objects.add({ ...gpuAccentF, offset: new THREE.Vector3(x, y - 3 + 0.54, 1.5), mass: 0 })

        const gpuAccentB = createBox(1.2, 0.08, 0.4, 'red')
        this.objects.add({ ...gpuAccentB, offset: new THREE.Vector3(x, y - 3 - 0.54, 1.5), mass: 0 })

        // Metal top plate
        const gpuTop = createBox(1.55, 1.05, 0.08, 'metal')
        this.objects.add({ ...gpuTop, offset: new THREE.Vector3(x, y - 3, 2.24), mass: 0 })

        // Status LEDs (green power, orange activity)
        const gpuLed1 = createBox(0.12, 0.06, 0.12, 'emeraldGreen')
        this.objects.add({ ...gpuLed1, offset: new THREE.Vector3(x - 0.4, y - 3 + 0.54, 1.0), mass: 0 })

        const gpuLed2 = createBox(0.12, 0.06, 0.12, 'emeraldGreen')
        this.objects.add({ ...gpuLed2, offset: new THREE.Vector3(x + 0.4, y - 3 + 0.54, 1.0), mass: 0 })

        const gpuLed3 = createBox(0.12, 0.06, 0.12, 'orange')
        this.objects.add({ ...gpuLed3, offset: new THREE.Vector3(x, y - 3 + 0.54, 0.7), mass: 0 })

        // --- 5. Network Switches (row ends) ---
        for(const sx of [-5.5, 5.5])
        {
            const swBody = createBox(0.6, 0.4, 0.5, 'black')
            this.objects.add({ ...swBody, offset: new THREE.Vector3(x + sx, y - 3, 0.25), mass: 0 })

            const swLed = createBox(0.35, 0.06, 0.08, 'emeraldGreen')
            this.objects.add({ ...swLed, offset: new THREE.Vector3(x + sx, y - 3 + 0.23, 0.35), mass: 0 })
        }

        // --- 6. Cooling Units (CRAC) ---
        for(const cx of [-5.5, 5.5])
        {
            const cracBody = createBox(1.2, 0.8, 1.4, 'blue')
            this.objects.add({ ...cracBody, offset: new THREE.Vector3(x + cx, y - 1, 0.7), mass: 0 })

            const cracVent = createBox(0.8, 0.06, 0.6, 'gray')
            this.objects.add({ ...cracVent, offset: new THREE.Vector3(x + cx, y - 1 + 0.43, 1.0), mass: 0 })
        }

        // --- 7. Cable Trays (overhead) ---
        // Long runs over each rack row
        const cableA = createBox(10, 0.15, 0.06, 'orange')
        this.objects.add({ ...cableA, offset: new THREE.Vector3(x, y - 4, 2.1), mass: 0 })

        const cableB = createBox(10, 0.15, 0.06, 'orange')
        this.objects.add({ ...cableB, offset: new THREE.Vector3(x, y - 2, 2.1), mass: 0 })

        // Cross-connectors
        for(const ccx of [-4, 0, 4])
        {
            const cross = createBox(0.15, 2.2, 0.06, 'yellow')
            this.objects.add({ ...cross, offset: new THREE.Vector3(x + ccx, y - 3, 2.1), mass: 0 })
        }

        // --- 8. Monitor Workstation ---
        // Desk surface
        const desk = createBox(2.5, 1.0, 0.08, 'beige')
        this.objects.add({ ...desk, offset: new THREE.Vector3(x, y + 5, 0.7), mass: 0 })

        // Desk legs
        for(const [lx, ly] of [[-1.1, -0.4], [1.1, -0.4], [-1.1, 0.4], [1.1, 0.4]])
        {
            const leg = createBox(0.1, 0.1, 0.65, 'gray')
            this.objects.add({ ...leg, offset: new THREE.Vector3(x + lx, y + 5 + ly, 0.325), mass: 0 })
        }

        // Monitors
        for(const mx of [-0.5, 0.5])
        {
            const mon = createBox(0.8, 0.08, 0.6, 'black')
            this.objects.add({ ...mon, offset: new THREE.Vector3(x + mx, y + 5 - 0.3, 1.08), mass: 0 })

            const stand = createBox(0.15, 0.08, 0.3, 'metal')
            this.objects.add({ ...stand, offset: new THREE.Vector3(x + mx, y + 5 - 0.3, 0.88), mass: 0 })
        }

        // Keyboard
        const keyboard = createBox(0.6, 0.25, 0.04, 'gray')
        this.objects.add({ ...keyboard, offset: new THREE.Vector3(x, y + 5 + 0.2, 0.76), mass: 0 })

        // --- 9. Pushable GPU Card Boxes (interactive) ---
        const gpuCards = [
            [5, -5, 'emeraldGreen'],   // NVIDIA
            [-5, -5, 'red'],           // AMD
            [5, 5, 'blue'],            // Intel
            [-5, 5, 'orange']          // Spare
        ]
        for(const [gx, gy, color] of gpuCards)
        {
            const gpu = createBox(0.5, 0.3, 0.5, color)
            this.objects.add({ ...gpu, offset: new THREE.Vector3(x + gx, y + gy, 0.25), mass: 1, soundName: 'brick' })
        }

        // --- 10. UPS Power Unit ---
        const ups = createBox(0.8, 0.6, 1.0, 'brown')
        this.objects.add({ ...ups, offset: new THREE.Vector3(x + 5.5, y - 5, 0.5), mass: 0 })

        const upsLed = createBox(0.3, 0.06, 0.1, 'emeraldGreen')
        this.objects.add({ ...upsLed, offset: new THREE.Vector3(x + 5.5, y - 5 + 0.33, 0.75), mass: 0 })
    }
}
