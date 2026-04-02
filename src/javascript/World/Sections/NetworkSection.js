import * as THREE from 'three'
import { createBox, createTextLabel, createInfoPanel } from './AkshayHelpers.js'

export default class NetworkSection
{
    constructor(_options)
    {
        this.objects = _options.objects
        this.time = _options.time
        this.x = _options.x
        this.y = _options.y

        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false
        this.container.updateMatrix()

        this.setLabels()
        this.setObjects()
        this.setDrone()
    }

    setLabels()
    {
        const title = createTextLabel('NETWORK VILLAGE', { fontSize: 64, color: '#009688', maxWidth: 8 })
        title.position.set(this.x, this.y + 8, 0.01)
        title.updateMatrix()
        this.container.add(title)

        const subtitle = createTextLabel('Square Root Consultancy | 2018-2021', { fontSize: 26, color: '#336655', maxWidth: 7 })
        subtitle.position.set(this.x, this.y + 6.5, 0.01)
        subtitle.updateMatrix()
        this.container.add(subtitle)

        const mainPanel = createInfoPanel(
            'Square Root Consultancy',
            'Founder | Enterprise Networking',
            'Sold & integrated enterprise networking:\nFortinet, WatchGuard firewalls,\nswitches, access points\n\nDesigned network architectures for SMBs:\nVLAN segmentation, VPN, security policies\n\nDeveloped autonomous drones for\nsurveillance and agriculture applications\n\nAligned IT strategies with business goals',
            { accentColor: '#009688', worldWidth: 7, height: 420 }
        )
        mainPanel.position.set(this.x - 4, this.y + 2, 0.01)
        mainPanel.updateMatrix()
        this.container.add(mainPanel)

        const earlyPanel = createInfoPanel(
            'Earlier Experience',
            'System Admin & IT Support',
            'Cupshup (SysAdmin, 2021-2023)\nManaged IT infra, Google Workspace\nCloud-first approach\n\nSNDT University (2017)\nWindows servers, campus network\nFirewalls, disaster recovery\n\nEducation:\nB.E. Electrical Engineering - Mumbai Univ\nDiploma Electronics - MSBTE',
            { accentColor: '#009688', worldWidth: 5, height: 420 }
        )
        earlyPanel.position.set(this.x + 5, this.y + 2, 0.01)
        earlyPanel.updateMatrix()
        this.container.add(earlyPanel)
    }

    setObjects()
    {
        const x = this.x
        const y = this.y

        // --- Firewall Appliances (Fortinet/WatchGuard style) ---
        for(const [fx, fy] of [[-8, -5], [8, -5]])
        {
            // Body (teal)
            const fwBody = createBox(1.0, 0.6, 0.4, 'emeraldGreen')
            this.objects.add({ ...fwBody, offset: new THREE.Vector3(x + fx, y + fy, 0.2), mass: 2, soundName: 'brick' })

            // Screen (black)
            const fwScreen = createBox(0.6, 0.06, 0.2, 'black')
            this.objects.add({ ...fwScreen, offset: new THREE.Vector3(x + fx, y + fy + 0.33, 0.25), mass: 0.3, soundName: 'brick' })

            // Status LED
            const fwLed = createBox(0.15, 0.06, 0.06, 'emeraldGreen')
            this.objects.add({ ...fwLed, offset: new THREE.Vector3(x + fx + 0.35, y + fy + 0.33, 0.12), mass: 0.1, soundName: 'brick' })
        }

        // --- Network Switches (flat rack switches) ---
        for(const [sx, sy] of [[-7, 0], [7, 0], [-5, 6], [5, 6]])
        {
            // Switch body (black)
            const swBody = createBox(1.2, 0.4, 0.15, 'black')
            this.objects.add({ ...swBody, offset: new THREE.Vector3(x + sx, y + sy, 0.08), mass: 1, soundName: 'brick' })

            // LED row (green dots)
            const swLed = createBox(0.8, 0.06, 0.05, 'emeraldGreen')
            this.objects.add({ ...swLed, offset: new THREE.Vector3(x + sx, y + sy + 0.23, 0.1), mass: 0.1, soundName: 'brick' })
        }

        // --- Access Points (white boxes with antenna) ---
        for(const [ax, ay] of [[-6, -7], [0, -7], [6, -7]])
        {
            // AP body
            const apBody = createBox(0.5, 0.5, 0.15, 'white')
            this.objects.add({ ...apBody, offset: new THREE.Vector3(x + ax, y + ay, 0.08), mass: 0.5, soundName: 'brick' })

            // Antenna
            const apAnt = createBox(0.08, 0.08, 0.6, 'gray')
            this.objects.add({ ...apAnt, offset: new THREE.Vector3(x + ax, y + ay, 0.45), mass: 0.2, soundName: 'brick' })
        }

        // --- Signal Towers (tall poles with antenna head) ---
        for(const [tx, ty] of [[-9, -3], [9, 4]])
        {
            // Pole (teal)
            const pole = createBox(0.3, 0.3, 3, 'emeraldGreen')
            this.objects.add({ ...pole, offset: new THREE.Vector3(x + tx, y + ty, 1.5), mass: 4, soundName: 'brick' })

            // Antenna head
            const head = createBox(0.8, 0.8, 0.3, 'gray')
            this.objects.add({ ...head, offset: new THREE.Vector3(x + tx, y + ty, 3.15), mass: 0.5, soundName: 'brick' })

            // Red light on top
            const light = createBox(0.15, 0.15, 0.15, 'red')
            this.objects.add({ ...light, offset: new THREE.Vector3(x + tx, y + ty, 3.38), mass: 0.1, soundName: 'brick' })
        }

        // --- Server Racks (managed infra) ---
        for(const [rx, ry] of [[-8, 5], [8, 5]])
        {
            const rackBody = createBox(0.7, 0.4, 1.5, 'gray')
            this.objects.add({ ...rackBody, offset: new THREE.Vector3(x + rx, y + ry, 0.75), mass: 2, soundName: 'brick' })

            const rackLed = createBox(0.45, 0.06, 0.12, 'emeraldGreen')
            this.objects.add({ ...rackLed, offset: new THREE.Vector3(x + rx, y + ry + 0.23, 1.2), mass: 0.1, soundName: 'brick' })

            const rackTop = createBox(0.75, 0.45, 0.06, 'metal')
            this.objects.add({ ...rackTop, offset: new THREE.Vector3(x + rx, y + ry, 1.53), mass: 0.2, soundName: 'brick' })
        }

        // --- Cable Spools (pushable scatter) ---
        for(const [cx, cy] of [[-3, -6], [3, -6], [-2, 7], [2, 7]])
        {
            const spool = createBox(0.25, 0.25, 0.25, 'yellow')
            this.objects.add({ ...spool, offset: new THREE.Vector3(x + cx, y + cy, 0.13), mass: 0.3, soundName: 'brick' })
        }
    }

    setDrone()
    {
        const x = this.x
        const y = this.y

        // Autonomous surveillance drone patrolling the village
        this.droneGroup = new THREE.Group()
        this.container.add(this.droneGroup)

        const coloredBox = (w, h, d, color) =>
        {
            const geo = new THREE.BoxGeometry(w, h, d)
            const mat = new THREE.MeshBasicMaterial({ color })
            return new THREE.Mesh(geo, mat)
        }

        // Drone body (gray center)
        const body = coloredBox(0.4, 0.4, 0.12, 0x555555)
        body.position.set(0, 0, 0)
        this.droneGroup.add(body)

        // 4 arms extending diagonally
        for(const [ax, ay] of [[0.35, 0.35], [-0.35, 0.35], [-0.35, -0.35], [0.35, -0.35]])
        {
            // Arm
            const arm = coloredBox(0.08, 0.08, 0.04, 0x333333)
            arm.position.set(ax, ay, 0)
            this.droneGroup.add(arm)

            // Propeller (dark disk)
            const prop = coloredBox(0.2, 0.2, 0.02, 0x222222)
            prop.position.set(ax, ay, 0.05)
            this.droneGroup.add(prop)
        }

        // Green LED on front
        const led = coloredBox(0.06, 0.06, 0.06, 0x00FF88)
        led.position.set(0, -0.22, 0.05)
        this.droneGroup.add(led)

        // Red LED on back
        const redLed = coloredBox(0.06, 0.06, 0.06, 0xFF2222)
        redLed.position.set(0, 0.22, 0.05)
        this.droneGroup.add(redLed)

        // Camera lens (small black dot underneath)
        const lens = coloredBox(0.08, 0.08, 0.04, 0x000000)
        lens.position.set(0, 0, -0.08)
        this.droneGroup.add(lens)

        this.droneAngle = 0

        // Patrol path: figure-8 around the village, floating at z=2.5
        this.time.on('tick', () =>
        {
            this.droneAngle += 0.01

            const r = 6
            const cx = x + r * Math.sin(this.droneAngle)
            const cy = y + r * Math.sin(this.droneAngle * 2) * 0.4

            // Slight hover wobble
            const wobble = Math.sin(this.droneAngle * 8) * 0.05

            this.droneGroup.position.set(cx, cy, 2.5 + wobble)

            // Face direction of travel
            const nextX = x + r * Math.sin(this.droneAngle + 0.02)
            const nextY = y + r * Math.sin((this.droneAngle + 0.02) * 2) * 0.4
            this.droneGroup.rotation.z = Math.atan2(nextY - cy, nextX - cx) + Math.PI / 2
        })
    }
}
