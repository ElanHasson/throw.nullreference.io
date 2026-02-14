import * as PIXI from 'pixi.js'
import { createSystem, queryComponents, Write, Read, WriteResource } from 'sim-ecs'
import { Tree, Transform, PixiSprite, SceneContainer } from '../../components'

function shadeColor(col: number, factor: number): number {
  const r = Math.min(255, Math.max(0, ((col >> 16) & 0xff) * factor)) | 0
  const g = Math.min(255, Math.max(0, ((col >> 8) & 0xff) * factor)) | 0
  const b = Math.min(255, Math.max(0, (col & 0xff) * factor)) | 0
  return (r << 16) | (g << 8) | b
}

export const TreeRenderSystem = createSystem({
  sceneContainer: WriteResource(SceneContainer),
  treeQuery: queryComponents({
    tree: Read(Tree),
    transform: Read(Transform),
    pixiSprite: Write(PixiSprite)
  })
})
  .withRunFunction(({ sceneContainer, treeQuery }) => {
    treeQuery.execute(({ tree, transform, pixiSprite }) => {
      if (!pixiSprite.sprite || !(pixiSprite.sprite instanceof PIXI.Graphics)) {
        pixiSprite.sprite = new PIXI.Graphics()
        sceneContainer.container.addChild(pixiSprite.sprite)
      }
      
      const graphics = pixiSprite.sprite as PIXI.Graphics
      graphics.clear()
      graphics.position.set(transform.x, transform.y)
      
      // Conifer variant
      if (!tree.hasBranches) {
        const trunk = tree.trunkColor ?? 0x4a3c28
        const h = tree.trunkHeight
        const baseW = Math.max(6, tree.trunkWidth * 0.8)
        // Trunk
        graphics.rect(-baseW/2, -h * 0.2, baseW, h * 0.2)
        graphics.fill({ color: trunk })
        // Layered foliage (triangular segments)
        const baseR = tree.foliageRadius
        const layers = 4
        for (let i = 0; i < layers; i++) {
          const t = i / (layers - 1)
          const y = -h * 0.2 - baseR * 0.6 - i * (baseR * 0.45)
          const half = baseR * (1.3 - t * 0.7)
          const col = shadeColor(tree.foliageColor ?? 0x2e5d2e, 0.9 + (layers - 1 - i) * 0.06)
          graphics.moveTo(0, y - baseR * 0.25)
          graphics.lineTo(-half, y + baseR * 0.25)
          graphics.lineTo(half, y + baseR * 0.25)
          graphics.closePath()
          graphics.fill({ color: col, alpha: 0.98 })
        }
        return
      }
      
      // Normalize colors to a realistic palette
      const foliage = tree.foliageColor ?? 0x2e5d2e
      const trunk = tree.trunkColor ?? 0x4a3c28
      const foliageDark = shadeColor(foliage, 0.85)
      const foliageLight = shadeColor(foliage, 1.15)

      // Trunk with gentle taper
      const baseW = tree.trunkWidth
      const h = tree.trunkHeight
      graphics.moveTo(-baseW/2, 0)
      graphics.lineTo(-baseW*0.35, -h*0.55)
      graphics.lineTo(-baseW*0.18, -h)
      graphics.lineTo(baseW*0.18, -h)
      graphics.lineTo(baseW*0.35, -h*0.55)
      graphics.lineTo(baseW/2, 0)
      graphics.closePath()
      graphics.fill({ color: trunk })
      // Trunk shadow
      graphics.moveTo(-baseW*0.1, -h)
      graphics.lineTo(-baseW*0.18, -h)
      graphics.lineTo(-baseW*0.35, -h*0.55)
      graphics.lineTo(-baseW*0.2, -h*0.55)
      graphics.closePath()
      graphics.fill({ color: shadeColor(trunk, 0.8), alpha: 0.6 })

      // Multi-lobe canopy (rounded clusters)
      const r = tree.foliageRadius
      const canopyY = -h
      const lobes = [
        { x: 0, y: canopyY - r*0.1, rr: r*1.0, color: foliage },
        { x: -r*0.6, y: canopyY + r*0.1, rr: r*0.75, color: foliageDark },
        { x: r*0.6, y: canopyY + r*0.1, rr: r*0.75, color: foliageDark },
        { x: 0, y: canopyY - r*0.55, rr: r*0.6, color: foliageLight },
      ]
      // Canopy shadow layer
      for (const l of lobes) {
        graphics.circle(l.x + 3, l.y + 6, l.rr)
        graphics.fill({ color: 0x0a1f0a, alpha: 0.15 })
      }
      // Canopy fill
      for (const l of lobes) {
        graphics.circle(l.x, l.y, l.rr)
        graphics.fill({ color: l.color, alpha: 0.95 })
      }
      // Highlights
      graphics.circle(-r*0.25, canopyY - r*0.2, r*0.35)
      graphics.fill({ color: foliageLight, alpha: 0.25 })
    })
  })
  .build()

export class TreeRenderSystemLegacy {
  private container: PIXI.Container | null = null
  constructor(private app: PIXI.Application) {}

  update(world: World): void {
    if (!this.container) {
      this.container = new PIXI.Container()
      this.container.name = 'trees'
      this.app.stage.addChild(this.container)
    }
    this.container.removeChildren()

    const trees = world.getEntitiesWithComponents(Tree, Transform, PixiSprite)
    for (const e of trees) {
      const t = e.getComponent(Tree)!
      const tr = e.getComponent(Transform)!
      const g = new PIXI.Graphics()
      g.x = tr.x
      g.y = tr.y
      this.renderTree(g, t)
      this.container.addChild(g)
    }
  }

  private renderTree(graphics: PIXI.Graphics, tree: Tree): void {
    if (!tree.hasBranches) {
      const trunk = tree.trunkColor ?? 0x4a3c28
      const h = tree.trunkHeight
      const baseW = Math.max(6, tree.trunkWidth * 0.8)
      graphics.rect(-baseW/2, -h * 0.2, baseW, h * 0.2)
      graphics.fill({ color: trunk })
      const baseR = tree.foliageRadius
      const layers = 4
      for (let i = 0; i < layers; i++) {
        const y = -h * 0.2 - baseR * 0.6 - i * (baseR * 0.45)
        const half = baseR * (1.3 - (i / (layers - 1)) * 0.7)
        const col = shadeColor(tree.foliageColor ?? 0x2e5d2e, 0.9 + (layers - 1 - i) * 0.06)
        graphics.moveTo(0, y - baseR * 0.25)
        graphics.lineTo(-half, y + baseR * 0.25)
        graphics.lineTo(half, y + baseR * 0.25)
        graphics.closePath()
        graphics.fill({ color: col, alpha: 0.98 })
      }
      return
    }
    const foliage = tree.foliageColor ?? 0x2e5d2e
    const trunk = tree.trunkColor ?? 0x4a3c28
    const foliageDark = shadeColor(foliage, 0.85)
    const foliageLight = shadeColor(foliage, 1.15)
    const baseW = tree.trunkWidth
    const h = tree.trunkHeight
    graphics.moveTo(-baseW/2, 0)
    graphics.lineTo(-baseW*0.35, -h*0.55)
    graphics.lineTo(-baseW*0.18, -h)
    graphics.lineTo(baseW*0.18, -h)
    graphics.lineTo(baseW*0.35, -h*0.55)
    graphics.lineTo(baseW/2, 0)
    graphics.closePath()
    graphics.fill({ color: trunk })
    graphics.moveTo(-baseW*0.1, -h)
    graphics.lineTo(-baseW*0.18, -h)
    graphics.lineTo(-baseW*0.35, -h*0.55)
    graphics.lineTo(-baseW*0.2, -h*0.55)
    graphics.closePath()
    graphics.fill({ color: shadeColor(trunk, 0.8), alpha: 0.6 })

    const r = tree.foliageRadius
    const canopyY = -h
    const lobes = [
      { x: 0, y: canopyY - r*0.1, rr: r*1.0, color: foliage },
      { x: -r*0.6, y: canopyY + r*0.1, rr: r*0.75, color: foliageDark },
      { x: r*0.6, y: canopyY + r*0.1, rr: r*0.75, color: foliageDark },
      { x: 0, y: canopyY - r*0.55, rr: r*0.6, color: foliageLight },
    ]
    for (const l of lobes) {
      graphics.circle(l.x + 3, l.y + 6, l.rr)
      graphics.fill({ color: 0x0a1f0a, alpha: 0.15 })
    }
    for (const l of lobes) {
      graphics.circle(l.x, l.y, l.rr)
      graphics.fill({ color: l.color, alpha: 0.95 })
    }
    graphics.circle(-r*0.25, canopyY - r*0.2, r*0.35)
    graphics.fill({ color: foliageLight, alpha: 0.25 })
  }
}


