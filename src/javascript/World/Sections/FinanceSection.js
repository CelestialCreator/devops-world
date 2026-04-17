import * as THREE from 'three'
import { createBox, createTextLabel, createInfoPanel, createKenneyObject } from './AkshayHelpers.js'

export default class FinanceSection
{
    constructor(_options)
    {
        this.objects = _options.objects
        this.resources = _options.resources
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
        const title = createTextLabel('FINANCE DISTRICT', { fontSize: 64, color: '#00C853', maxWidth: 8 })
        title.position.set(this.x, this.y + 8, 0.01)
        title.updateMatrix()
        this.container.add(title)

        const subtitle = createTextLabel('Mavonic Technology | Apr 2023 - Jul 2025', { fontSize: 26, color: '#338844', maxWidth: 7 })
        subtitle.position.set(this.x, this.y + 6.5, 0.01)
        subtitle.updateMatrix()
        this.container.add(subtitle)

        const panel = createInfoPanel(
            'Mavonic - Fintech & AI Platforms',
            'DevOps Engineer | PCI-DSS Compliance',
            'Architected scalable cloud infrastructure\nfor Fintech and AI platforms with rapid\ndeployment capabilities\n\nStreamlined CI/CD pipelines with security\n& compliance checks for PCI-DSS regulated\nfintech environments\n\nEngineered IaC with Terraform, Terragrunt,\nand OpenTofu for reproducible environments\n\nOrchestrated K8s clusters with Crossplane\nfor multi-cloud resource provisioning (POC)\n\nImplemented service mesh (Istio, Linkerd)\nand Emissary Ingress API gateway\n\nChaos engineering & load testing with\nk6 and Locust for resilience validation',
            { accentColor: '#00C853', worldWidth: 7, height: 520 }
        )
        panel.position.set(this.x - 4, this.y + 2, 0.01)
        panel.updateMatrix()
        this.container.add(panel)

        const projectPanel = createInfoPanel(
            'NBFC Co-Lending Platform',
            'AWS → GCP Migration | Platform Eng',
            'Led cloud-agnostic migration from AWS\nto GCP, architecting multi-cloud infra\nfor an NBFC co-lending platform\n\nDrove platform engineering: enabled\ndeveloper DevOps adoption, new tooling,\nand mentored junior DevOps engineers\n\nCollaborated with Google Cloud partner\nfor credits & implementation; delivered\nper SOW',
            { accentColor: '#FFD700', worldWidth: 5, height: 450 }
        )
        projectPanel.position.set(this.x + 5, this.y + 2, 0.01)
        projectPanel.updateMatrix()
        this.container.add(projectPanel)

        const qaPanel = createInfoPanel(
            'LLM-Powered QA Automation',
            'Playwright + MCP | Q1 2024',
            'Pioneered LLM-powered QA automation\nframework at Mavonic using Playwright\nand MCP\n\n70-90% cost reduction in browser\ntesting through AI-driven test\ngeneration and self-healing agents\n\nIntegrated into PCI-DSS compliant CI/CD\nfor fintech release pipelines',
            { accentColor: '#00C853', worldWidth: 5, height: 420 }
        )
        qaPanel.position.set(this.x, this.y - 4, 0.01)
        qaPanel.updateMatrix()
        this.container.add(qaPanel)

        const b2bPanel = createInfoPanel(
            'PCI-DSS B2B Payment Platform',
            'Cross-Border | 140+ Currencies',
            'Implemented PCI-DSS compliant infra\nfor a B2B cross-border payment\nmiddleware platform operating across\n140+ currencies\n\nNetwork segmentation, strong access\ncontrols, encryption at rest / transit\n\nAutomated vulnerability scanning\nwith Trivy across the CI/CD pipeline',
            { accentColor: '#00C853', worldWidth: 5, height: 420 }
        )
        b2bPanel.position.set(this.x - 6, this.y - 4, 0.01)
        b2bPanel.updateMatrix()
        this.container.add(b2bPanel)
    }

    setObjects()
    {
        const x = this.x
        const y = this.y

        // --- Big Fixed Landmark Towers (static, scale 1.0+, far from text) ---
        const landmarks = [
            { name: 'kenneySkyscraperA', pos: [9, -7], scale: 1.2 },
            { name: 'kenneySkyscraperC', pos: [-9, -7], scale: 1.0 },
            { name: 'kenneySkyscraperE', pos: [9, 7], scale: 1.1 },
        ]
        for(const l of landmarks)
        {
            const model = this.resources.items[l.name]
            if(model)
            {
                const obj = createKenneyObject(model, { scale: l.scale })
                this.objects.add({
                    ...obj,
                    offset: new THREE.Vector3(x + l.pos[0], y + l.pos[1], 0),
                    mass: 0
                })
            }
        }

        // --- Medium Pushable Skyscrapers ---
        const skyscrapers = [
            { name: 'kenneySkyscraperB', pos: [8, -6], scale: 0.6, mass: 10 },
            { name: 'kenneySkyscraperD', pos: [8, 5], scale: 0.65, mass: 11 },
        ]
        for(const s of skyscrapers)
        {
            const model = this.resources.items[s.name]
            if(model)
            {
                const obj = createKenneyObject(model, { scale: s.scale })
                this.objects.add({
                    ...obj,
                    offset: new THREE.Vector3(x + s.pos[0], y + s.pos[1], 0),
                    mass: s.mass,
                    soundName: 'brick'
                })
            }
        }

        // --- Smaller Pushable Buildings ---
        const buildings = [
            { name: 'kenneyBuildingA', pos: [-7, -1], scale: 0.5, mass: 6 },
            { name: 'kenneyBuildingB', pos: [7, -2], scale: 0.5, mass: 6 },
            { name: 'kenneyBuildingC', pos: [-6, -5], scale: 0.45, mass: 5 },
            { name: 'kenneyBuildingD', pos: [6, -5], scale: 0.45, mass: 5 },
            { name: 'kenneyBuildingE', pos: [-5, 6], scale: 0.5, mass: 6 },
            { name: 'kenneyBuildingF', pos: [5, 6], scale: 0.5, mass: 6 },
        ]
        for(const b of buildings)
        {
            const model = this.resources.items[b.name]
            if(model)
            {
                const obj = createKenneyObject(model, { scale: b.scale })
                this.objects.add({
                    ...obj,
                    offset: new THREE.Vector3(x + b.pos[0], y + b.pos[1], 0),
                    mass: b.mass,
                    soundName: 'brick'
                })
            }
        }

        // --- ATMs (green body + black screen + gray keypad) ---
        const atmPositions = [[-5, 7], [5, 7], [-8, 2], [8, -2]]
        for(const [ax, ay] of atmPositions)
        {
            // ATM body
            const atmBody = createBox(0.5, 0.4, 0.8, 'emeraldGreen')
            this.objects.add({ ...atmBody, offset: new THREE.Vector3(x + ax, y + ay, 0.4), mass: 2, soundName: 'brick' })

            // Screen
            const screen = createBox(0.35, 0.06, 0.25, 'black')
            this.objects.add({ ...screen, offset: new THREE.Vector3(x + ax, y + ay + 0.23, 0.55), mass: 0.3, soundName: 'brick' })

            // Keypad
            const keypad = createBox(0.2, 0.06, 0.12, 'gray')
            this.objects.add({ ...keypad, offset: new THREE.Vector3(x + ax, y + ay + 0.23, 0.25), mass: 0.2, soundName: 'brick' })
        }

        // --- Vault / Safe (heavy, pushable) ---
        const vaultBody = createBox(1.5, 1.5, 1.2, 'gray')
        this.objects.add({ ...vaultBody, offset: new THREE.Vector3(x + 7, y + 2, 0.6), mass: 8, soundName: 'brick' })

        // Vault door
        const vaultDoor = createBox(0.8, 0.06, 0.8, 'black')
        this.objects.add({ ...vaultDoor, offset: new THREE.Vector3(x + 7, y + 2 + 0.78, 0.6), mass: 2, soundName: 'brick' })

        // Vault handle
        const vaultHandle = createBox(0.3, 0.08, 0.06, 'metal')
        this.objects.add({ ...vaultHandle, offset: new THREE.Vector3(x + 7, y + 2 + 0.82, 0.7), mass: 0.5, soundName: 'brick' })

        // --- Money stacks & coins (fun pushable loot) ---
        const loot = [
            // Cash bundles (green)
            [-3, -7, 'emeraldGreen', 0.3, 0.2, 0.15],
            [-2, -7, 'emeraldGreen', 0.3, 0.2, 0.15],
            [-1, -7, 'emeraldGreen', 0.3, 0.2, 0.15],
            [1, -7, 'emeraldGreen', 0.3, 0.2, 0.15],
            // Gold coins (yellow)
            [2, -7, 'yellow', 0.2, 0.2, 0.1],
            [3, -7, 'yellow', 0.2, 0.2, 0.1],
            [0, -6, 'yellow', 0.2, 0.2, 0.1],
            [-2, -6, 'yellow', 0.2, 0.2, 0.1],
            [2, -6, 'yellow', 0.2, 0.2, 0.1],
        ]
        for(const [lx, ly, color, w, d, h] of loot)
        {
            const item = createBox(w, d, h, color)
            this.objects.add({ ...item, offset: new THREE.Vector3(x + lx, y + ly, h / 2), mass: 0.3, soundName: 'brick' })
        }
    }
}
