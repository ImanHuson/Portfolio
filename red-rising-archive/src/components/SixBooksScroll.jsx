import { useEffect, useRef, useState } from 'react'
import { Renderer, Camera, Transform, Plane, Program, Mesh, Texture } from 'ogl'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { BOOKS } from '../data/books.js'

const COUNT = BOOKS.length
const RADIUS = 3.4

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec3 position;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D tMap;
  uniform float uFacing;
  varying vec2 vUv;
  void main() {
    vec4 tex = texture2D(tMap, vUv);
    // slabs facing the camera read slightly brighter — cheap depth cue
    float boost = 0.75 + max(uFacing, 0.0) * 0.35;
    gl_FragColor = vec4(tex.rgb * boost, tex.a);
  }
`

/** Draws one book's slab face (numeral + title) onto an offscreen 2D canvas
 * used as a WebGL texture. Plain Canvas2D text — no remote font-shaping
 * fetch, no three.js material pipeline, just what already renders reliably
 * elsewhere in this repo (see Particles.jsx, same ogl approach). */
function makeSlabCanvas(book) {
  const w = 512
  const h = 760
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  const grad = ctx.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, '#1b1616')
  grad.addColorStop(1, '#111317')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  ctx.strokeStyle = 'rgba(183,154,97,0.5)'
  ctx.lineWidth = 4
  ctx.strokeRect(2, 2, w - 4, h - 4)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#7E1018'
  ctx.font = '700 160px Georgia, "Times New Roman", serif'
  ctx.fillText(book.numeral, w / 2, h * 0.42)

  ctx.fillStyle = '#D8C38A'
  ctx.font = '700 30px "Arial Narrow", Arial, sans-serif'
  wrapText(ctx, book.title.toUpperCase(), w / 2, h * 0.58, w - 80, 36)

  return canvas
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  let lineY = y
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, lineY)
      line = word
      lineY += lineHeight
    } else {
      line = test
    }
  }
  ctx.fillText(line, x, lineY)
}

export default function SixBooksScroll() {
  const scrollHostRef = useRef(null)
  const canvasHostRef = useRef(null)
  const progressRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: scrollHostRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          progressRef.current = self.progress
          setActiveIndex(Math.min(COUNT - 1, Math.round(self.progress * (COUNT - 1))))
        },
      })
    },
    { scope: scrollHostRef },
  )

  useEffect(() => {
    const host = canvasHostRef.current
    if (!host) return

    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 1.5), alpha: false })
    const gl = renderer.gl
    gl.clearColor(0.03, 0.02, 0.02, 1)
    host.appendChild(gl.canvas)

    const camera = new Camera(gl, { fov: 42 })
    camera.position.set(0, 0.4, 6)
    camera.lookAt([0, 0, -RADIUS * 0.4])

    const scene = new Transform()

    const geometry = new Plane(gl, { width: 1.15, height: 1.7 })
    const meshes = BOOKS.map((book) => {
      const texture = new Texture(gl, { generateMipmaps: false })
      texture.image = makeSlabCanvas(book)
      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: { tMap: { value: texture }, uFacing: { value: 1 } },
        transparent: false,
      })
      const mesh = new Mesh(gl, { geometry, program })
      mesh.setParent(scene)
      return mesh
    })

    function resize() {
      const w = host.clientWidth
      const h = host.clientHeight
      renderer.setSize(w, h)
      camera.perspective({ aspect: w / h })
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    let raf
    function frame() {
      const progress = progressRef.current
      const carouselAngle = progress * Math.PI * 2
      meshes.forEach((mesh, i) => {
        const angle = (i / COUNT) * Math.PI * 2
        const a = angle - carouselAngle
        mesh.position.set(Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS - RADIUS)
        mesh.rotation.y = a
        const facing = Math.cos(a)
        mesh.program.uniforms.uFacing.value = facing
        const scale = 0.85 + Math.max(facing, 0) * 0.3
        mesh.scale.set(scale, scale, scale)
      })
      renderer.render({ scene, camera })
      raf = requestAnimationFrame(frame)
    }
    frame()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      host.removeChild(gl.canvas)
    }
  }, [])

  const book = BOOKS[activeIndex]

  return (
    <div ref={scrollHostRef} className="books-3d-scrollhost">
      <div className="books-3d">
        <div ref={canvasHostRef} style={{ position: 'absolute', inset: 0 }} aria-hidden="true" />
        <div className="book-caption">
          <div className="num">{book.numeral}</div>
          <h3>{book.title}</h3>
          <p>{book.subtitle}</p>
        </div>
        <div className="books-scrub" role="tablist" aria-label="Book selector">
          {BOOKS.map((b, i) => (
            <button key={b.numeral} aria-current={i === activeIndex} aria-label={b.title} role="tab" tabIndex={-1} />
          ))}
        </div>
      </div>
    </div>
  )
}
