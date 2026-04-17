import * as THREE from 'three'
import { createBox, createTextLabel, createInfoPanel } from './AkshayHelpers.js'

export default class SpawnSection
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
        // Name - big title
        const nameLabel = createTextLabel('AKSHAY MHASKAR', { fontSize: 80, color: '#326CE5', maxWidth: 10 })
        nameLabel.position.set(this.x, this.y + 4, 0.01)
        nameLabel.updateMatrix()
        this.container.add(nameLabel)

        // Subtitle
        const roleLabel = createTextLabel('DevOps Engineer | SRE | CNCF Enthusiast', { fontSize: 36, color: '#8899bb', maxWidth: 10 })
        roleLabel.position.set(this.x, this.y + 2.5, 0.01)
        roleLabel.updateMatrix()
        this.container.add(roleLabel)

        // About panel
        const aboutPanel = createInfoPanel(
            'About Me',
            'Mumbai, India | github.com/CelestialCreator',
            'Building cloud-native infrastructure with\nopen-source tools and AI-driven automation.\n\nCNCF-native DevOps Engineer with proven\ntrack record in secure, PCI-DSS compliant\nfintech platforms and GPU-accelerated AI\ninference clusters.\n\nPolyglot technologist — from bare-metal\nhardware to production cloud deployments.\nCurrently focused on autonomous AI agents,\nLLM infrastructure, and edge computing.',
            { accentColor: '#326CE5', worldWidth: 7 }
        )
        aboutPanel.position.set(this.x + 5, this.y - 2, 0.01)
        aboutPanel.updateMatrix()
        this.container.add(aboutPanel)

        // Skills panel
        const skillsPanel = createInfoPanel(
            'Technical Skills',
            'Cloud-Native & AI Infrastructure',
            'Cloud & IaC: AWS, GCP, Azure, Terraform, OpenTofu\nContainers: Kubernetes, Docker, Helm, ArgoCD\nService Mesh: Istio, Linkerd, Traefik, Cilium\nObservability: Prometheus, Grafana, OpenTelemetry\nSecurity: PCI-DSS, Trivy, Terrascan\nAI: Python, vLLM, TTS/STT, Open-Source LLMs\nHardware: NVIDIA CUDA, AMD ROCm, Bare Metal',
            { accentColor: '#00BCD4', worldWidth: 7 }
        )
        skillsPanel.position.set(this.x - 5, this.y - 2, 0.01)
        skillsPanel.updateMatrix()
        this.container.add(skillsPanel)

        // Direction signs
        const dirs = [
            { text: '→ TRANSIT HUB', x: 8, y: 0 },
            { text: '← FINANCE DISTRICT', x: -8, y: 0 },
            { text: '↓ CLOUD KINGDOM', x: 0, y: -8 },
        ]
        for(const d of dirs)
        {
            const sign = createTextLabel(d.text, { fontSize: 28, color: '#556677', maxWidth: 4 })
            sign.position.set(this.x + d.x, this.y + d.y, 0.01)
            sign.updateMatrix()
            this.container.add(sign)
        }
    }

    setObjects()
    {
        // Pushable K8s pods
        const podPositions = [
            [3, 2], [-3, 2], [5, -1], [-5, -1],
            [2, -4], [-2, 5], [7, 3], [-7, -2]
        ]

        for(const [px, py] of podPositions)
        {
            const pod = createBox(0.6, 0.6, 0.6, 'white')
            this.objects.add({
                ...pod,
                offset: new THREE.Vector3(this.x + px, this.y + py, 0.3),
                mass: 1.5,
                soundName: 'brick'
            })
        }
    }
}
