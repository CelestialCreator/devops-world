import * as THREE from 'three'
import { createBox, createTextLabel, createInfoPanel, createLogoTile } from './AkshayHelpers.js'

export default class CloudSection
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
        this.setArgoOctopus()
    }

    setLabels()
    {
        const title = createTextLabel('CLOUD KINGDOM', { fontSize: 72, color: '#00BCD4', maxWidth: 8 })
        title.position.set(this.x, this.y + 8, 0.01)
        title.updateMatrix()
        this.container.add(title)

        const subtitle = createTextLabel('CNCF Ecosystem | Kubernetes Native', { fontSize: 28, color: '#006677', maxWidth: 7 })
        subtitle.position.set(this.x, this.y + 6.5, 0.01)
        subtitle.updateMatrix()
        this.container.add(subtitle)

        const iacPanel = createInfoPanel(
            'Cloud-Native Architecture',
            'IaC | GitOps | Multi-Cloud',
            'Infrastructure as Code:\nTerraform, OpenTofu, Terragrunt\n\nGitOps with ArgoCD\nfor drift-free deployments\n\nMulti-cloud: AWS, GCP, Azure\nCrossplane for resource provisioning\n\nKubernetes orchestration\nwith Helm & containerd',
            { accentColor: '#00BCD4', worldWidth: 7, height: 400 }
        )
        iacPanel.position.set(this.x - 4, this.y + 2, 0.01)
        iacPanel.updateMatrix()
        this.container.add(iacPanel)

        const meshPanel = createInfoPanel(
            'Service Mesh & Observability',
            'Networking | Monitoring | Alerting',
            'Service Mesh: Istio, Linkerd, Traefik\nCilium CNI, Emissary Ingress\n\nMetrics: Prometheus, VictoriaMetrics\nDashboards: Grafana\nTracing: OpenTelemetry\nLogs: FluentBit, VictoriaLogs\n\nAlerting: AlertManager, Zenduty\nChaos Engineering: k6, Locust',
            { accentColor: '#00BCD4', worldWidth: 5 }
        )
        meshPanel.position.set(this.x + 5, this.y + 2, 0.01)
        meshPanel.updateMatrix()
        this.container.add(meshPanel)
    }

    setObjects()
    {
        const x = this.x
        const y = this.y
        const res = this.resources.items

        // --- Kubernetes Logo (STATIC centerpiece, big) ---
        const k8sTex = res.logoKubernetesTexture
        if(k8sTex)
        {
            const k8s = createLogoTile(k8sTex, 2.5)
            this.objects.add({ ...k8s, offset: new THREE.Vector3(x, y + 5, 0.05), mass: 0 })
        }

        // --- Tool Logo Tiles (pushable, spread around edges) ---
        const logos = [
            { tex: 'logoDockerTexture',     pos: [-7, -5],  size: 1.8 },
            { tex: 'logoHelmTexture',       pos: [7, -5],   size: 1.8 },
            { tex: 'logoPrometheusTexture', pos: [-7, 6],   size: 1.8 },
            { tex: 'logoTerraformTexture',  pos: [7, 6],    size: 1.8 },
            { tex: 'logoGrafanaTexture',    pos: [-5, -7],  size: 1.5 },
            { tex: 'logoArgoTexture',       pos: [5, -7],   size: 1.5 },
        ]

        for(const logo of logos)
        {
            const tex = res[logo.tex]
            if(tex)
            {
                const tile = createLogoTile(tex, logo.size)
                this.objects.add({
                    ...tile,
                    offset: new THREE.Vector3(x + logo.pos[0], y + logo.pos[1], 0.05),
                    mass: 0.8,
                    soundName: 'brick'
                })
            }
        }

        // --- K8s Pod cubes (pushable, scattered at corners) ---
        for(const [px, py, color] of [[-9, -7, 'blue'], [9, -7, 'blue'], [-9, 7, 'emeraldGreen'], [9, 0, 'yellow'], [0, -7, 'purple'], [-4, 7, 'orange']])
        {
            const pod = createBox(0.4, 0.4, 0.4, color)
            this.objects.add({ ...pod, offset: new THREE.Vector3(x + px, y + py, 0.2), mass: 0.3, soundName: 'brick' })
        }
    }

    setArgoOctopus()
    {
        const x = this.x
        const y = this.y

        // ArgoCD mascot = orange octopus walking around the village
        this.argoGroup = new THREE.Group()
        this.container.add(this.argoGroup)

        const coloredBox = (w, h, d, color) =>
        {
            const geo = new THREE.BoxGeometry(w, h, d)
            const mat = new THREE.MeshBasicMaterial({ color })
            return new THREE.Mesh(geo, mat)
        }

        // Head (round-ish = big orange box)
        const head = coloredBox(0.6, 0.6, 0.5, 0xEF6C00)
        head.position.set(0, 0, 0.5)
        this.argoGroup.add(head)

        // Eyes (two white dots with black pupils)
        const eyeL = coloredBox(0.12, 0.06, 0.12, 0xFFFFFF)
        eyeL.position.set(-0.15, -0.33, 0.55)
        this.argoGroup.add(eyeL)

        const eyeR = coloredBox(0.12, 0.06, 0.12, 0xFFFFFF)
        eyeR.position.set(0.15, -0.33, 0.55)
        this.argoGroup.add(eyeR)

        const pupilL = coloredBox(0.06, 0.06, 0.06, 0x111111)
        pupilL.position.set(-0.15, -0.36, 0.55)
        this.argoGroup.add(pupilL)

        const pupilR = coloredBox(0.06, 0.06, 0.06, 0x111111)
        pupilR.position.set(0.15, -0.36, 0.55)
        this.argoGroup.add(pupilR)

        // 6 tentacles (small orange boxes fanning out below)
        for(let i = 0; i < 6; i++)
        {
            const angle = (i / 6) * Math.PI - Math.PI / 2
            const tx = Math.cos(angle) * 0.35
            const ty = Math.sin(angle) * 0.35
            const tentacle = coloredBox(0.08, 0.08, 0.3, 0xE65100)
            tentacle.position.set(tx, ty, 0.15)
            this.argoGroup.add(tentacle)
        }

        // Animate — wander in a figure-8 path around the village
        this.argoAngle = 0

        this.time.on('tick', () =>
        {
            this.argoAngle += 0.006

            // Figure-8 (lemniscate) path, radius ~5
            const r = 5
            const cx = x + r * Math.sin(this.argoAngle)
            const cy = y + r * Math.sin(this.argoAngle * 2) * 0.5

            this.argoGroup.position.set(cx, cy, 0)

            // Face direction of travel
            const nextX = x + r * Math.sin(this.argoAngle + 0.01)
            const nextY = y + r * Math.sin((this.argoAngle + 0.01) * 2) * 0.5
            this.argoGroup.rotation.z = Math.atan2(nextY - cy, nextX - cx) + Math.PI / 2
        })
    }
}
