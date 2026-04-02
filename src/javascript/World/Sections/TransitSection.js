import * as THREE from 'three'
import { createBox, createTextLabel, createInfoPanel, createKenneyObject } from './AkshayHelpers.js'

export default class TransitSection
{
    constructor(_options)
    {
        this.objects = _options.objects
        this.resources = _options.resources
        this.time = _options.time
        this.x = _options.x
        this.y = _options.y

        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false
        this.container.updateMatrix()

        this.setLabels()
        this.setObjects()
        this.setMetroTrain()
    }

    setLabels()
    {
        // Zone title
        const title = createTextLabel('TRANSIT HUB', { fontSize: 72, color: '#FFD600', maxWidth: 8 })
        title.position.set(this.x, this.y + 8, 0.01)
        title.updateMatrix()
        this.container.add(title)

        const subtitle = createTextLabel('Billeasy | Jul 2025 - Present', { fontSize: 28, color: '#B8A000', maxWidth: 6 })
        subtitle.position.set(this.x, this.y + 6.5, 0.01)
        subtitle.updateMatrix()
        this.container.add(subtitle)

        // Main info panel
        const panel = createInfoPanel(
            'Billeasy - Transit Ticketing',
            'Sole DevOps Contributor | 15L+ Daily Riders',
            'Scaled infrastructure for 5 metros:\nMumbai, Hyderabad, Pune, Nagpur, Noida\n+ MSRTC, Neeta, Purple inter-city buses\n\n80% egress cost reduction via Traefik\nbehind CloudFront + IaC with OpenTofu\n\nLed GitOps with ArgoCD, built observability\nstack with VictoriaMetrics, Prometheus,\nGrafana, OpenTelemetry\n\nDeveloped AI-powered Log Agent for\nautomated troubleshooting (reduced MTTR)',
            { accentColor: '#FFD600', worldWidth: 7, height: 450 }
        )
        panel.position.set(this.x - 4, this.y + 2, 0.01)
        panel.updateMatrix()
        this.container.add(panel)

        // Tech stack
        const techPanel = createInfoPanel(
            'Tech Stack',
            'Transit Infrastructure',
            'Kubernetes | ArgoCD | Traefik\nCloudFront | OpenTofu | VictoriaMetrics\nPrometheus | Grafana | OpenTelemetry\nFluentBit | Gupshup | Route Mobile\nWhatsApp/SMS Messaging',
            { accentColor: '#FFD600', worldWidth: 5 }
        )
        techPanel.position.set(this.x + 5, this.y + 2, 0.01)
        techPanel.updateMatrix()
        this.container.add(techPanel)

        // Metrics
        const metricsLabel = createTextLabel('15L+ Daily Riders  |  5 Cities  |  80% Cost Cut', { fontSize: 30, color: '#FFD600', maxWidth: 10 })
        metricsLabel.position.set(this.x, this.y - 3, 0.01)
        metricsLabel.updateMatrix()
        this.container.add(metricsLabel)
    }

    setObjects()
    {
        const x = this.x
        const y = this.y

        // --- MSRTC Laal Dabba Buses (spread wide, all parts pushable) ---
        const busPositions = [
            [8, -6], [8, -2], [8, 4], [-8, -5], [-8, 0], [-8, 5]
        ]
        for(const [bx, by] of busPositions)
        {
            // Red body (the Laal Dabba)
            const body = createBox(0.8, 1.8, 0.8, 'red')
            this.objects.add({ ...body, offset: new THREE.Vector3(x + bx, y + by, 0.5), mass: 4, soundName: 'brick' })

            // Cream/beige horizontal stripe (signature MSRTC band)
            const stripe = createBox(0.82, 1.82, 0.08, 'beige')
            this.objects.add({ ...stripe, offset: new THREE.Vector3(x + bx, y + by, 0.65), mass: 1, soundName: 'brick' })

            // Cream/beige roof
            const busRoof = createBox(0.8, 1.8, 0.08, 'beige')
            this.objects.add({ ...busRoof, offset: new THREE.Vector3(x + bx, y + by, 0.93), mass: 1, soundName: 'brick' })

            // Windshield (front)
            const windshield = createBox(0.55, 0.06, 0.35, 'blue')
            this.objects.add({ ...windshield, offset: new THREE.Vector3(x + bx, y + by + 0.93, 0.6), mass: 0.5, soundName: 'brick' })

            // Rear window
            const rearWin = createBox(0.55, 0.06, 0.25, 'blue')
            this.objects.add({ ...rearWin, offset: new THREE.Vector3(x + bx, y + by - 0.93, 0.6), mass: 0.5, soundName: 'brick' })

            // Black bumper (front)
            const bumperF = createBox(0.7, 0.06, 0.15, 'black')
            this.objects.add({ ...bumperF, offset: new THREE.Vector3(x + bx, y + by + 0.93, 0.17), mass: 0.5, soundName: 'brick' })

            // Black bumper (rear)
            const bumperR = createBox(0.7, 0.06, 0.15, 'black')
            this.objects.add({ ...bumperR, offset: new THREE.Vector3(x + bx, y + by - 0.93, 0.17), mass: 0.5, soundName: 'brick' })

            // Tyres (black, 4 wheels)
            for(const [wx, wy] of [[-0.4, -0.55], [0.4, -0.55], [-0.4, 0.55], [0.4, 0.55]])
            {
                const tyre = createBox(0.15, 0.2, 0.25, 'black')
                this.objects.add({ ...tyre, offset: new THREE.Vector3(x + bx + wx, y + by + wy, 0.13), mass: 0.3, soundName: 'brick' })
            }
        }

        // --- Kenney Construction Cones (pushable) ---
        const coneModel = this.resources.items.kenneyConstructionCone
        if(coneModel)
        {
            for(const [cx, cy] of [[-5, -7], [-2, -7], [2, -7], [5, -7]])
            {
                const cone = createKenneyObject(coneModel, { scale: 0.8 })
                this.objects.add({
                    ...cone,
                    offset: new THREE.Vector3(x + cx, y + cy, 0),
                    mass: 0.5,
                    soundName: 'brick'
                })
            }
        }

        // --- Kenney Traffic Lights (pushable) ---
        const trafficLight = this.resources.items.kenneyTrafficLight
        if(trafficLight)
        {
            for(const [tx, ty] of [[6, 6], [-6, 6]])
            {
                const tl = createKenneyObject(trafficLight, { scale: 0.8 })
                this.objects.add({
                    ...tl,
                    offset: new THREE.Vector3(x + tx, y + ty, 0),
                    mass: 2,
                    soundName: 'brick'
                })
            }
        }

        // --- Kenney Highway Sign (pushable) ---
        const signModel = this.resources.items.kenneySignHighway
        if(signModel)
        {
            const sign = createKenneyObject(signModel, { scale: 0.8 })
            this.objects.add({
                ...sign,
                offset: new THREE.Vector3(x, y + 6, 0),
                mass: 3,
                soundName: 'brick'
            })
        }

        // --- Ticket Kiosk (pushable) ---
        const booth = createBox(0.8, 0.6, 1.0, 'beige')
        this.objects.add({ ...booth, offset: new THREE.Vector3(x + 4, y + 6, 0.5), mass: 3, soundName: 'brick' })

        const boothWin = createBox(0.5, 0.06, 0.3, 'blue')
        this.objects.add({ ...boothWin, offset: new THREE.Vector3(x + 4, y + 6 + 0.33, 0.65), mass: 0.5, soundName: 'brick' })

        const boothRoof = createBox(0.9, 0.7, 0.06, 'orange')
        this.objects.add({ ...boothRoof, offset: new THREE.Vector3(x + 4, y + 6, 1.03), mass: 0.5, soundName: 'brick' })
    }

    setMetroTrain()
    {
        const x = this.x
        const y = this.y

        // Mumbai Metro — each coach is its own group on the circle
        // so they independently bend around the curve like a real train

        const coloredBox = (w, h, d, color) =>
        {
            const geo = new THREE.BoxGeometry(w, h, d)
            const mat = new THREE.MeshBasicMaterial({ color })
            return new THREE.Mesh(geo, mat)
        }

        const r = 7
        const gap = 0.13  // angle gap between coaches on the circle

        // Build 4 coach groups (loco + 3 coaches), each added to container
        this.metroCoaches = []

        for(let i = 0; i < 4; i++)
        {
            const group = new THREE.Group()

            // Coach body
            const isLoco = i === 0
            const body = coloredBox(isLoco ? 0.5 : 0.45, 0.8, 0.35, 0xCCCCCC)
            body.position.set(0, 0, 0)
            group.add(body)

            // Orange stripe
            const stripe = coloredBox(isLoco ? 0.52 : 0.47, 0.8, 0.06, 0xFF9933)
            stripe.position.set(0, 0, 0.1)
            group.add(stripe)

            // Windshield on locomotive only
            if(isLoco)
            {
                const ws = coloredBox(0.35, 0.06, 0.2, 0x336699)
                ws.position.set(0, -0.43, 0.0)
                group.add(ws)
            }

            this.container.add(group)
            this.metroCoaches.push(group)
        }

        this.metroAngle = 0

        // Each coach follows the circle at its own angle offset
        this.time.on('tick', () =>
        {
            this.metroAngle += 0.007

            for(let i = 0; i < this.metroCoaches.length; i++)
            {
                const coachAngle = this.metroAngle - i * gap
                const cx = x + Math.cos(coachAngle) * r
                const cy = y + Math.sin(coachAngle) * r

                this.metroCoaches[i].position.set(cx, cy, 2.0)

                // Each coach faces its own tangent direction
                this.metroCoaches[i].rotation.z = coachAngle - Math.PI
            }
        })
    }
}
