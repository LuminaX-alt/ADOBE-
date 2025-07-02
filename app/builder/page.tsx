"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Eye, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Html, Text, Box, Plane } from "@react-three/drei"
import { Suspense } from "react"
import { useRouter } from "next/navigation"

interface SamplePhoto {
  id: string
  title: string
  description: string
  position: [number, number, number]
  color: string
  imageUrl: string
}

// Sample photos already in the 3D space with real images
const SAMPLE_PHOTOS: SamplePhoto[] = [
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

// 3D Photo Frame Component
function PhotoFrame({
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

// Environment
function GalleryEnvironment() {
  return (
    <>
      {/* Ground with subtle pattern */}
      <Plane args={[40, 40]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#1a202c" />
      </Plane>

      {/* Back wall */}
      <Plane args={[40, 20]} position={[0, 8, -8]}>
        <meshStandardMaterial color="#2d3748" />
      </Plane>

      {/* Side walls for depth */}
      <Plane args={[20, 20]} rotation={[0, Math.PI / 2, 0]} position={[-15, 8, -4]}>
        <meshStandardMaterial color="#374151" />
      </Plane>
      <Plane args={[20, 20]} rotation={[0, -Math.PI / 2, 0]} position={[15, 8, -4]}>
        <meshStandardMaterial color="#374151" />
      </Plane>

      {/* Ambient lighting orbs */}
      <mesh position={[-8, 6, -6]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[8, 6, -6]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.5} />
      </mesh>
    </>
  )
}

// Main 3D Gallery Scene
function MemoryGallery3D({
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

        <GalleryEnvironment />

        {/* Gallery Title */}
        <Text fontSize={1.2} color="#6366f1" position={[0, 5, -6]} anchorX="center" anchorY="middle">
          Memory Gallery
        </Text>

        {/* Sample Photos */}
        {SAMPLE_PHOTOS.map((photo) => (
          <PhotoFrame
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

export default function BuilderPage() {
  const [projectTitle, setProjectTitle] = useState("My Memory Gallery")
  const [projectDescription, setProjectDescription] = useState("A beautiful collection of memories in 3D space")
  const [activePhoto, setActivePhoto] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated")
    if (!isAuth) {
      router.push("/auth/login")
    }
  }, [router])

  const handlePhotoClick = (photoId: string) => {
    setActivePhoto(activePhoto === photoId ? null : photoId)

    const photo = SAMPLE_PHOTOS.find((p) => p.id === photoId)
    if (photo) {
      alert(
        `🖼️ **${photo.title}**\n\n📸 ${photo.description}\n\nYou're now viewing this memory in 3D! In the full experience, visitors can:\n\n• Walk around and examine it closely\n• Leave voice comments\n• Share with friends in real-time\n• Experience it in VR\n\n✨ This is what your uploaded photos would look like!`,
      )
    }
  }

  const saveProject = async () => {
    if (!projectTitle.trim()) {
      alert("📝 Please enter a title for your memory gallery!")
      return
    }

    setIsSaving(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const projectData = {
        id: Date.now().toString(),
        title: projectTitle,
        description: projectDescription,
        photos: SAMPLE_PHOTOS.length,
        createdAt: new Date().toISOString(),
      }

      const existingProjects = JSON.parse(localStorage.getItem("memoryProjects") || "[]")
      existingProjects.push(projectData)
      localStorage.setItem("memoryProjects", JSON.stringify(existingProjects))

      setShowSuccess(true)

      setTimeout(() => {
        alert(
          `🎉 **Memory Gallery Saved!**\n\n✅ "${projectTitle}" is ready\n🖼️ ${SAMPLE_PHOTOS.length} photos in your gallery\n🎯 Fully interactive 3D experience\n\n🚀 This shows what your uploaded photos would look like!\n\nReturning to dashboard...`,
        )
        router.push("/dashboard")
      }, 1000)
    } catch (error) {
      alert("❌ Failed to save project. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-white hover:text-purple-300 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
                <span className="text-xl font-bold text-white">Memory Gallery</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                onClick={() =>
                  alert(
                    "🥽 **VR Preview**\n\nIn full VR mode, you would:\n• Walk through the gallery naturally\n• Reach out and touch photos\n• Leave 3D voice comments\n• Share the space with friends\n• Experience memories at life size\n\n🚀 Connect a VR headset for the full experience!",
                  )
                }
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview VR
              </Button>
              <Button
                onClick={saveProject}
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : showSuccess ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Gallery
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">✨ Gallery Settings</CardTitle>
                <CardDescription className="text-gray-300">Customize your memory gallery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">
                    Gallery Title
                  </Label>
                  <Input
                    id="title"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">🖼️ Sample Photos</CardTitle>
                <CardDescription className="text-gray-300">
                  Click photos in the 3D gallery to interact with them
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {SAMPLE_PHOTOS.map((photo) => (
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
                          <div className="text-gray-400 text-xs">{photo.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
              <CardContent className="p-4">
                <h3 className="text-white font-bold mb-2">✅ Real Images!</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Beautiful real photos now displayed in your 3D memory space!
                </p>
                <div className="text-xs text-green-300">
                  • 6 stunning landscape photos
                  <br />• Fully interactive 3D gallery
                  <br />• VR-ready experience
                  <br />• Professional presentation
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-[700px]">
              <CardHeader>
                <CardTitle className="text-white">🌟 3D Memory Gallery</CardTitle>
                <CardDescription className="text-gray-300">
                  A working sample with real photos - click to interact!
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[600px] p-0">
                <MemoryGallery3D activePhoto={activePhoto} onPhotoClick={handlePhotoClick} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
