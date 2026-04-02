import * as THREE from 'three'

/**
 * Create an object from a Kenney GLTF model that works with the Objects.add() system.
 * Clones the scene, applies Y-up to Z-up rotation, scales it, and generates box collision.
 *
 * @param {object} gltfData - The loaded GLTF data from resources.items
 * @param {object} options
 * @param {number} options.scale - Uniform scale factor (default 1)
 */
export function createKenneyObject(gltfData, options = {})
{
    const scale = options.scale || 1
    const scene = gltfData.scene.clone()

    // Convert MeshStandardMaterial → MeshBasicMaterial (no lights in this scene)
    const tint = options.tint ? new THREE.Color(options.tint) : null
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material)
        {
            const oldMat = child.material
            const newMat = new THREE.MeshBasicMaterial()

            if(tint)
            {
                // Apply solid tint color, ignore texture
                newMat.color.copy(tint)
            }
            else
            {
                if(oldMat.map) newMat.map = oldMat.map
                if(oldMat.color) newMat.color.copy(oldMat.color)
            }
            if(oldMat.transparent) newMat.transparent = oldMat.transparent
            if(oldMat.opacity !== undefined) newMat.opacity = oldMat.opacity
            newMat.side = THREE.DoubleSide

            child.material = newMat
        }
    })

    // Wrap in a group that handles Y-up → Z-up conversion + scaling
    const wrapper = new THREE.Group()
    wrapper.rotation.x = Math.PI / 2  // Y-up → Z-up (positive rotation: Y maps to +Z)
    wrapper.scale.setScalar(scale)
    wrapper.add(scene)
    wrapper.updateMatrixWorld(true)

    // Compute bounding box after transforms for collision
    const bbox = new THREE.Box3().setFromObject(wrapper)
    const size = bbox.getSize(new THREE.Vector3())

    // Create collision box matching bounding box
    const collisionMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1))
    collisionMesh.name = 'box'
    collisionMesh.scale.set(size.x, size.y, size.z)

    const collisionScene = new THREE.Object3D()
    collisionScene.add(collisionMesh)

    // Use the wrapper as a single child — preserves full GLTF hierarchy + materials
    const baseContainer = new THREE.Object3D()
    baseContainer.add(wrapper)

    return {
        base: { children: baseContainer.children },
        collision: { children: collisionScene.children },
        keepMaterial: true,
        duplicated: true
    }
}

/**
 * Create a flat tile with a logo texture mapped onto it.
 * Uses a thin box for collision so it works with physics.
 *
 * @param {THREE.Texture} texture - The loaded texture from resources.items
 * @param {number} size - Width/height in world units (default 1.5)
 */
export function createLogoTile(texture, size = 1.5)
{
    // Textured plane (logo face)
    const geometry = new THREE.PlaneGeometry(size, size)
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
    })
    const plane = new THREE.Mesh(geometry, material)

    const baseContainer = new THREE.Object3D()
    baseContainer.add(plane)

    // Thin box collision
    const collisionMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1))
    collisionMesh.name = 'box'
    collisionMesh.scale.set(size, size, 0.1)

    const collisionScene = new THREE.Object3D()
    collisionScene.add(collisionMesh)

    return {
        base: { children: baseContainer.children },
        collision: { children: collisionScene.children },
        keepMaterial: true,
        duplicated: true
    }
}

/**
 * Create a simple box object that works with the Objects.add() system.
 */
export function createBox(width, height, depth, shadeName = 'white')
{
    const baseMesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        new THREE.MeshBasicMaterial()
    )
    baseMesh.name = `shade${shadeName.charAt(0).toUpperCase() + shadeName.slice(1)}`

    const baseScene = new THREE.Object3D()
    baseScene.add(baseMesh)

    const collisionMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1))
    collisionMesh.name = 'box'
    collisionMesh.scale.set(width, height, depth)

    const collisionScene = new THREE.Object3D()
    collisionScene.add(collisionMesh)

    return { base: { children: baseScene.children }, collision: { children: collisionScene.children } }
}

/**
 * Create a text label as a plane mesh with canvas texture.
 * Returns a THREE.Mesh positioned flat on the ground (rotated to face up).
 *
 * @param {string} text - The text to display
 * @param {object} options
 * @param {number} options.fontSize - Font size in pixels (default 48)
 * @param {string} options.color - Text color (default '#ffffff')
 * @param {string} options.bgColor - Background color (default 'transparent')
 * @param {number} options.maxWidth - Max width in world units (default 6)
 */
export function createTextLabel(text, options = {})
{
    const fontSize = options.fontSize || 64
    const color = options.color || '#ffffff'
    const bgColor = options.bgColor || null
    const maxWidth = options.maxWidth || 8
    const lines = text.split('\n')

    // Measure text
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.font = `bold ${fontSize}px Arial, sans-serif`

    let maxLineWidth = 0
    for(const line of lines)
    {
        const m = ctx.measureText(line)
        if(m.width > maxLineWidth) maxLineWidth = m.width
    }

    const padding = fontSize * 0.5
    canvas.width = Math.ceil(maxLineWidth + padding * 2)
    canvas.height = Math.ceil((fontSize * 1.3 * lines.length) + padding * 2)

    // Draw
    ctx.font = `bold ${fontSize}px Arial, sans-serif`

    if(bgColor)
    {
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    for(let i = 0; i < lines.length; i++)
    {
        ctx.fillText(lines[i], canvas.width / 2, padding + i * fontSize * 1.3)
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    const aspect = canvas.width / canvas.height
    const width = Math.min(maxWidth, maxWidth)
    const height = width / aspect

    const geometry = new THREE.PlaneGeometry(width, height)
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.matrixAutoUpdate = false

    return mesh
}

/**
 * Create a multi-line info panel as a plane mesh.
 */
export function createInfoPanel(title, subtitle, details, options = {})
{
    const width = options.width || 512
    const height = options.height || 400
    const accentColor = options.accentColor || '#326CE5'

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    // Background
    ctx.fillStyle = 'rgba(10, 10, 26, 0.85)'
    ctx.fillRect(0, 0, width, height)

    // Accent bar
    ctx.fillStyle = accentColor
    ctx.fillRect(0, 0, 4, height)

    // Title
    ctx.fillStyle = accentColor
    ctx.font = 'bold 32px Arial, sans-serif'
    ctx.fillText(title, 20, 40)

    // Subtitle
    ctx.fillStyle = '#8899bb'
    ctx.font = '18px Arial, sans-serif'
    ctx.fillText(subtitle, 20, 68)

    // Details
    ctx.fillStyle = '#99aabb'
    ctx.font = '16px Arial, sans-serif'
    const detailLines = details.split('\n')
    for(let i = 0; i < detailLines.length; i++)
    {
        ctx.fillText(detailLines[i], 20, 100 + i * 24)
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    const aspect = width / height
    const worldWidth = options.worldWidth || 6
    const worldHeight = worldWidth / aspect

    const geometry = new THREE.PlaneGeometry(worldWidth, worldHeight)
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.matrixAutoUpdate = false

    return mesh
}
