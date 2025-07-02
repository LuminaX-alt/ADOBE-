"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Sparkles } from "lucide-react"
import Link from "next/link"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Html, Text, Box, Plane } from "@react-three/drei"
import { Suspense } from "react"

interface DemoHotspot {
  id: string
  position: [number, number, number]
  title: string
  description: string
  mediaType: "image" | "video" | "audio"
  color: string
}

interface DemoComment {
  id: string
  user: { name: string; avatar: string }
  content: string
  position: [number, number, number]
  timestamp: string
}

interface SamplePhoto {
  id: string
  title: string
  description: string
  position: [number, number, number]
  color: string
  imageUrl: string
}

// Sample photos for the demo with real images
const DEMO_PHOTOS: SamplePhoto[] = [
  {
    id: "1",
    title: "Beach Sunset",
    description: "Beautiful sunset at the beach",
    position: [-4, 1.5, -2],
    color: "#f59e0b",
    imageUrl: "/images/beach-sunset.jpg",
  },
  {
    id: "2",
    title: "Mountain View",
    description: "Scenic mountain landscape",
    position: [0, 1.5, -2],
    color: "#10b981",
    imageUrl: "/images/mountain-view.jpg",
  },
  {
    id: "3",
    title: "City Lights",
    description: "Urban nighttime scene",
    position: [4, 1.5, -2],
    color: "#8b5cf6",
    imageUrl: "/images/city-lights.jpg",
  },
  {
    id: "4",
    title: "Forest Path",
    description: "Peaceful forest walkway",
    position: [-4, 1.5, -5],
    color: "#059669",
    imageUrl: "/images/forest-path.jpg",
  },
  {
    id: "5",
    title: "Ocean Waves",
    description: "Crashing waves on rocks",
    position: [0, 1.5, -5],
    color: "#0ea5e9",
    imageUrl: "/images/ocean-waves.jpg",
  },
  {
    id: "6",
    title: "Desert Dunes",
    description: "Golden sand dunes",
    position: [4, 1.5, -5],
    color: "#f97316",
    imageUrl: "/images/desert-dunes.jpg",
  },
]

// 3D Photo Frame Component for Demo
function DemoPhotoFrame({
  photo,
  onClick,
  isActive,
}: {
  photo: SamplePhoto
  onClick: () => void
  isActive: boolean
}) {
  return (
    <group position={photo.position} onClick={onClick}>
      {/* Frame background */}
      <Box args={[2.2, 1.6, 0.1]}>
        <meshStandardMaterial color="#2d3748" />
      </Box>

      {/* Photo area */}
      <Box args={[2, 1.4, 0.05]} position={[0, 0, 0.06]}>
        <meshStandardMaterial
          color={isActive ? "#ffffff" : photo.color}
          emissive={isActive ? "#6366f1" : photo.color}
          emissiveIntensity={isActive ? 0.3 : 0.1}
        />
      </Box>

      {/* Photo display with real images */}
      <Html position={[0, 0, 0.1]} distanceFactor={6} transform occlude>
        <div
          style={{
            width: "180px",
            height: "135px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "translate(-50%, -50%)",
          }}
        >
          <img
            src={photo.imageUrl || "/placeholder.svg"}
            alt={photo.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px",
              border: isActive ? "3px solid #6366f1" : "2px solid rgba(255,255,255,0.3)",
              backgroundColor: photo.color,
              boxShadow: isActive ? "0 0 20px rgba(99, 102, 241, 0.5)" : "0 4px 8px rgba(0,0,0,0.3)",
            }}
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.src = `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(photo.title)}`
            }}
          />
        </div>
      </Html>

      {/* Label */}
      <Html position={[0, -1.2, 0]} distanceFactor={8}>
        <div
          style={{
            background: isActive ? "rgba(99, 102, 241, 0.9)" : "rgba(0,0,0,0.8)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            whiteSpace: "nowrap",
            textAlign: "center",
            border: "1px solid rgba(255,255,255,0.2)",
            transform: "translate(-50%, 0)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ fontWeight: "bold" }}>📸 {photo.title}</div>
          <div style={{ fontSize: "10px", opacity: 0.8 }}>{photo.description}</div>
        </div>
      </Html>
    </group>
  )
}

// Replace the DemoScene function with this:
function DemoScene({
  activePhoto,
  onPhotoClick,
}: {
  activePhoto: string | null
  onPhotoClick: (photoId: string) => void
}) {
  return (
    <Canvas camera={{ position: [0, 3, 6], fov: 65 }}>
      <Suspense fallback={null}>
        <Environment preset="sunset" />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-10, 5, 3]} intensity={0.8} />
        <pointLight position={[10, 5, 3]} intensity={0.8} />

        {/* Ground */}
        <Plane args={[40, 40]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <meshStandardMaterial color="#1a202c" />
        </Plane>

        {/* Back wall */}
        <Plane args={[40, 20]} position={[0, 8, -8]}>
          <meshStandardMaterial color="#2d3748" />
        </Plane>

        {/* Gallery Title */}
        <Text fontSize={1.2} color="#6366f1" position={[0, 5, -6]} anchorX="center" anchorY="middle">
          MemoryScape XR Demo
        </Text>

        {/* Demo Photos */}
        {DEMO_PHOTOS.map((photo) => (
          <DemoPhotoFrame
            key={photo.id}
            photo={photo}
            onClick={() => onPhotoClick(photo.id)}
            isActive={activePhoto === photo.id}
          />
        ))}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={4}
          maxDistance={20}
          target={[0, 1, -3]}
        />
      </Suspense>
    </Canvas>
  )
}

export default function DemoPage() {
  const [selectedComment, setSelectedComment] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  // Update the main component to use the new photo system:
  // Replace the demoHotspots array and handleHotspotClick function with:

  const [activePhoto, setActivePhoto] = useState<string | null>(null)

  const handlePhotoClick = (photoId: string) => {
    setActivePhoto(activePhoto === photoId ? null : photoId)

    const photo = DEMO_PHOTOS.find((p) => p.id === photoId)
    if (photo) {
      alert(
        `🖼️ **${photo.title}**\n\n📸 ${photo.description}\n\nYou're experiencing this memory in 3D! In full VR:\n\n• Walk around and examine it closely\n• Leave voice comments floating in space\n• Share with friends in real-time\n• Experience memories at life size\n\n✨ This is the future of memory sharing!`,
      )
    }
  }

  const demoComments: DemoComment[] = [
    {
      id: "1",
      user: { name: "Sarah", avatar: "/placeholder.svg?height=32&width=32" },
      content: "This brings back so many beautiful memories! 😍",
      position: [-4.5, 2.8, -1.5],
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      user: { name: "Mike", avatar: "/placeholder.svg?height=32&width=32" },
      content: "I remember this day perfectly! The sunset was incredible.",
      position: [4.5, 3.2, -2.5],
      timestamp: "1 hour ago",
    },
    {
      id: "3",
      user: { name: "Emma", avatar: "/placeholder.svg?height=32&width=32" },
      content: "Can't believe how much we've grown since then! ❤️",
      position: [0.5, 3.5, -4.5],
      timestamp: "30 minutes ago",
    },
  ]

  const handleCommentClick = (comment: DemoComment) => {
    setSelectedComment(selectedComment === comment.id ? null : comment.id)
    alert(
      `💬 **${comment.user.name}** says:\n\n"${comment.content}"\n\n*Posted ${comment.timestamp}*\n\n🌟 In VR, this comment floats in 3D space exactly where ${comment.user.name} left it!\n\nYou could also:\n• Reply with voice or text\n• Leave your own spatial comments\n• See who else is viewing this memory\n• React with 3D emojis and gestures\n\n✨ Experience social memories like never before!`,
    )
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-white hover:text-purple-300 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">🎮 Interactive Demo</h1>
                <p className="text-sm text-gray-300">Experience MemoryScape XR with real photos</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Creating
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Demo Instructions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">🎯 How to Explore</h3>
                <p className="text-gray-300 text-sm">
                  Click photos to experience them • Drag to rotate • Scroll to zoom • Real images in 3D space!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex h-[calc(100vh-160px)]">
        {/* Main 3D Demo */}
        <div className="flex-1 relative">
          <DemoScene activePhoto={activePhoto} onPhotoClick={handlePhotoClick} />

          {/* Demo Controls */}
          <div className="absolute bottom-4 left-4 right-4">
            <Card className="bg-black/50 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-white/10 hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" onClick={() => setIsMuted(!isMuted)} className="bg-white/10 hover:bg-white/20">
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <span className="text-white text-sm">🎵 Ambient Demo Audio</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-500/20 text-green-300">✨ Real Images</Badge>
                    <Button size="sm" onClick={toggleFullscreen} className="bg-white/10 hover:bg-white/20">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Demo Info Sidebar */}
        <div className="w-80 border-l border-white/10 bg-black/20 backdrop-blur-sm p-4 space-y-4 overflow-y-auto">
          {/* Demo Stats */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-3">🎮 Demo Features</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Real Photos</span>
                  <Badge className="bg-purple-500/20 text-purple-300">{DEMO_PHOTOS.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Social Comments</span>
                  <Badge className="bg-green-500/20 text-green-300">{demoComments.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">3D Environment</span>
                  <Badge className="bg-blue-500/20 text-blue-300">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">VR Ready</span>
                  <Badge className="bg-yellow-500/20 text-yellow-300">Yes</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Elements */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-3">🎯 Click to Experience</h3>
              <div className="space-y-2">
                {DEMO_PHOTOS.map((photo) => (
                  <div
                    key={photo.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      activePhoto === photo.id
                        ? "bg-purple-500/20 border border-purple-500/50 scale-105"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => handlePhotoClick(photo.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: photo.color }}></div>
                      <div>
                        <div className="text-white text-sm font-medium">{photo.title}</div>
                        <div className="text-gray-400 text-xs">📸 {photo.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Demo Comments */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-3">💬 Social Comments</h3>
              <div className="space-y-3">
                {demoComments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedComment === comment.id
                        ? "bg-green-500/20 border border-green-500/50"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => handleCommentClick(comment)}
                  >
                    <div className="flex items-start space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={comment.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-white text-sm font-medium">{comment.user.name}</span>
                          <span className="text-gray-400 text-xs">{comment.timestamp}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <h3 className="text-white font-bold mb-2">✨ Ready to Create?</h3>
              <p className="text-gray-300 text-sm mb-4">
                Build your own immersive memory spaces with real photos and videos!
              </p>
              <Link href="/auth/register">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Creating Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
