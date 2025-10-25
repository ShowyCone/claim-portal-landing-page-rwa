"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface SparkleEffectProps {
  width?: number
  height?: number
}

export function SparkleEffect({ width = 400, height = 600 }: SparkleEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create particles
    const particleCount = 150
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10
      positions[i + 1] = (Math.random() - 0.5) * 10
      positions[i + 2] = (Math.random() - 0.5) * 10

      velocities[i] = (Math.random() - 0.5) * 0.1
      velocities[i + 1] = (Math.random() - 0.5) * 0.1
      velocities[i + 2] = (Math.random() - 0.5) * 0.1
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: 0x00d4ff,
      size: 0.15,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)
    particlesRef.current = particles

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      const positionAttribute = geometry.getAttribute("position") as THREE.BufferAttribute
      const positions = positionAttribute.array as Float32Array

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] += velocities[i]
        positions[i + 1] += velocities[i + 1]
        positions[i + 2] += velocities[i + 2]

        // Wrap around
        if (positions[i] > 5) positions[i] = -5
        if (positions[i] < -5) positions[i] = 5
        if (positions[i + 1] > 5) positions[i + 1] = -5
        if (positions[i + 1] < -5) positions[i + 1] = 5
      }

      positionAttribute.needsUpdate = true
      particles.rotation.x += 0.0001
      particles.rotation.y += 0.0002

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [width, height])

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none" />
}

