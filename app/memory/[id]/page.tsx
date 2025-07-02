"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Share2, MessageCircle, Play, Pause, Volume2, VolumeX, Maximize, Settings } from "lucide-react"
import Link from "next/link"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { Suspense } from "react"
import { useRouter } from "next/navigation"

interface Comment {
  id: string
  user: {
    name: string
    avatar: string
  }
  content: string
  position: [number, number, number]
  timestamp: string
}

interface Collaborator {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  position?: [number, number, number]
}

function CommentMarker({
  comment,
  onClick,
}: {
  comment: Comment
  onClick: () => void
}) {
  return (
    <mesh position={comment.position} onClick={onClick}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.2} />
      <Html distanceFactor={10}>
        <div className="bg-green-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
          <MessageCircle className="h-3 w-3 inline mr-1" />
          {comment.user.name}
        </div>
      </Html>
    </mesh>
  )
}

function CollaboratorAvatar({
  collaborator,
}: {
  collaborator: Collaborator
}) {
  if (!collaborator.position) return null

  return (
    <mesh position={collaborator.position}>
      <cylinderGeometry args={[0.3, 0.3, 1.8]} />
      <meshStandardMaterial color="#6366f1" transparent opacity={0.7} />
      <Html distanceFactor={10}>
        <div className="flex flex-col items-center">
          <Avatar className="w-8 h-8 mb-1">
            <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
            <AvatarFallback>{collaborator.name[0]}</AvatarFallback>
          </Avatar>
          <div className="bg-black/80 text-white px-2 py-1 rounded text-xs">{collaborator.name}</div>
        </div>
      </Html>
    </mesh>
  )
}

function MemoryScene({
  comments,
  collaborators,
  onCommentClick,
}: {
  comments: Comment[]
  collaborators: Collaborator[]
  onCommentClick: (comment: Comment) => void
}) {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
      <Suspense fallback={null}>
        <Environment preset="sunset" />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />

        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>

        {/* Sample memory objects */}
        <mesh position={[-2, 0, -1]}>
          <boxGeometry args={[1, 0.6, 0.1]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>

        <mesh position={[2, 0.5, -2]}>
          <boxGeometry args={[0.8, 0.5, 0.1]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>

        <mesh position={[0, 1, -3]}>
          <boxGeometry args={[1.2, 0.8, 0.1]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>

        {/* Comments */}
        {comments.map((comment) => (
          <CommentMarker key={comment.id} comment={comment} onClick={() => onCommentClick(comment)} />
        ))}

        {/* Collaborators */}
        {collaborators.map((collaborator) => (
          <CollaboratorAvatar key={collaborator.id} collaborator={collaborator} />
        ))}

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Suspense>
    </Canvas>
  )
}

export default function MemoryViewPage({ params }: { params: { id: string } }) {
  const [memory, setMemory] = useState<any>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem("isAuthenticated")
    if (!isAuth) {
      router.push("/auth/login")
      return
    }

    // Simulate loading memory data with better UX
    setTimeout(() => {
      setMemory({
        id: params.id,
        title: "Summer Vacation 2024",
        description: "Beach memories with family and friends",
        createdBy: "John Doe",
        createdAt: "2024-07-15",
        isPublic: false,
      })

      setComments([
        {
          id: "1",
          user: { name: "Alice", avatar: "/placeholder.svg?height=32&width=32" },
          content: "This brings back so many memories! Love this photo.",
          position: [-1.8, 0.5, -0.8],
          timestamp: "2 hours ago",
        },
        {
          id: "2",
          user: { name: "Bob", avatar: "/placeholder.svg?height=32&width=32" },
          content: "The sunset was absolutely beautiful that day.",
          position: [1.8, 0.8, -1.8],
          timestamp: "1 hour ago",
        },
      ])

      setCollaborators([
        {
          id: "1",
          name: "Alice",
          avatar: "/placeholder.svg?height=32&width=32",
          isOnline: true,
          position: [-3, 0, 1],
        },
        {
          id: "2",
          name: "Bob",
          avatar: "/placeholder.svg?height=32&width=32",
          isOnline: true,
          position: [3, 0, 2],
        },
        {
          id: "3",
          name: "Carol",
          avatar: "/placeholder.svg?height=32&width=32",
          isOnline: false,
        },
      ])
    }, 1000)
  }, [params.id, router])

  const handleCommentClick = (comment: Comment) => {
    setSelectedComment(selectedComment?.id === comment.id ? null : comment)
    alert(`💬 ${comment.user.name}: "${comment.content}"\n\nIn VR, this would show an immersive comment overlay!`)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  if (!memory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading memory space...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-white hover:text-purple-300">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">{memory.title}</h1>
                <p className="text-sm text-gray-300">by {memory.createdBy}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main 3D View */}
        <div className="flex-1 relative">
          <MemoryScene comments={comments} collaborators={collaborators} onCommentClick={handleCommentClick} />

          {/* Media Controls */}
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
                    <span className="text-white text-sm">Ambient Audio</span>
                  </div>
                  <Button size="sm" onClick={toggleFullscreen} className="bg-white/10 hover:bg-white/20">
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l border-white/10 bg-black/20 backdrop-blur-sm p-4 space-y-4 overflow-y-auto">
          {/* Collaborators */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">Collaborators</h3>
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                  {collaborators.filter((c) => c.isOnline).length} online
                </Badge>
              </div>
              <div className="space-y-2">
                {collaborators.map((collaborator) => (
                  <div key={collaborator.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{collaborator.name[0]}</AvatarFallback>
                      </Avatar>
                      {collaborator.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm">{collaborator.name}</div>
                      <div className="text-gray-400 text-xs">{collaborator.isOnline ? "Online" : "Offline"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-3">Comments</h3>
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedComment?.id === comment.id
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

          {/* Memory Info */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-3">Memory Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="text-white">{new Date(memory.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Privacy</span>
                  <Badge variant={memory.isPublic ? "default" : "secondary"}>
                    {memory.isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Collaborators</span>
                  <span className="text-white">{collaborators.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
