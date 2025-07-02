"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Upload, Users, Sparkles, VolumeX, Share2, Eye } from "lucide-react"
import Link from "next/link"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Text } from "@react-three/drei"
import { Suspense } from "react"

function FloatingMemory({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={position}>
        <boxGeometry args={[0.5, 0.3, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </Float>
  )
}

function Hero3D() {
  return (
    <div className="w-full h-[400px] relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />

          <Text
            fontSize={0.8}
            color="#6366f1"
            position={[0, 0.5, 0]}
            anchorX="center"
            anchorY="middle"
            font="https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap"
          >
            MemoryScape XR
          </Text>

          <FloatingMemory position={[-1, 1, -1]} color="#f59e0b" />
          <FloatingMemory position={[1, -0.5, -0.5]} color="#10b981" />
          <FloatingMemory position={[2, 1, -1.5]} color="#ef4444" />
          <FloatingMemory position={[-2, -1, -0.8]} color="#8b5cf6" />

          <OrbitControls enableZoom={false} enablePan={false} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
              <span className="text-xl font-bold text-white">MemoryScape XR</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Transform Your
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}
                Memories
              </span>
              <br />
              Into VR Worlds
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Create immersive 3D memory spaces from your photos and videos. Collaborate with friends in real-time and
              experience your memories like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Start Creating <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  🎮 Try Live Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 3D Hero Scene */}
        <Hero3D />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features for Memory Creation</h2>
            <p className="text-xl text-gray-300">Everything you need to build immersive memory experiences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <Upload className="h-8 w-8 text-purple-400 mb-2" />
                <CardTitle className="text-white">AI Scene Generation</CardTitle>
                <CardDescription className="text-gray-300">
                  Upload photos and let AI automatically generate 3D environments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  AI Powered
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <Users className="h-8 w-8 text-blue-400 mb-2" />
                <CardTitle className="text-white">Real-time Collaboration</CardTitle>
                <CardDescription className="text-gray-300">
                  Invite friends to explore and edit memory spaces together
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                  Live Sync
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <Sparkles className="h-8 w-8 text-yellow-400 mb-2" />
                <CardTitle className="text-white">Interactive Hotspots</CardTitle>
                <CardDescription className="text-gray-300">
                  Add clickable elements that trigger media playback and stories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                  Interactive
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <VolumeX className="h-8 w-8 text-green-400 mb-2" />
                <CardTitle className="text-white">Spatial Audio</CardTitle>
                <CardDescription className="text-gray-300">
                  Immersive 3D audio with voice comments and ambient soundscapes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                  3D Audio
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <Share2 className="h-8 w-8 text-pink-400 mb-2" />
                <CardTitle className="text-white">Social Sharing</CardTitle>
                <CardDescription className="text-gray-300">
                  Share memory spaces with custom privacy controls and invitations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-pink-500/20 text-pink-300">
                  Social
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <Eye className="h-8 w-8 text-indigo-400 mb-2" />
                <CardTitle className="text-white">VR Compatible</CardTitle>
                <CardDescription className="text-gray-300">
                  Full VR support with Meta Horizon integration for immersive experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-300">
                  VR Ready
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Memories?</h2>
          <p className="text-xl text-gray-300 mb-8">Join thousands of users creating immersive memory experiences</p>
          <Link href="/auth/register">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
              <span className="text-white font-semibold">MemoryScape XR</span>
            </div>
            <p className="text-gray-400 text-sm">© 2025 MemoryScape XR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
