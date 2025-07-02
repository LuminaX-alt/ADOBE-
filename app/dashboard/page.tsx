"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Search, Filter, MoreHorizontal, Users, Eye, Share2, Calendar, ImageIcon, Video, Mic } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface Memory {
  id: string
  title: string
  description: string
  thumbnail: string
  createdAt: string
  isPublic: boolean
  collaborators: number
  views: number
  mediaCount: {
    images: number
    videos: number
    audio: number
  }
}

export default function DashboardPage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem("isAuthenticated")
    if (!isAuth) {
      router.push("/auth/login")
      return
    }

    // Load user data
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      // You can set user state here if needed
    }

    // Simulate loading memories with better UX
    setTimeout(() => {
      setMemories([
        {
          id: "1",
          title: "Summer Vacation 2024",
          description: "Beach memories with family and friends",
          thumbnail: "/placeholder.svg?height=200&width=300",
          createdAt: "2024-07-15",
          isPublic: false,
          collaborators: 3,
          views: 24,
          mediaCount: { images: 45, videos: 8, audio: 2 },
        },
        {
          id: "2",
          title: "Wedding Day",
          description: "The most beautiful day of our lives",
          thumbnail: "/placeholder.svg?height=200&width=300",
          createdAt: "2024-06-20",
          isPublic: true,
          collaborators: 8,
          views: 156,
          mediaCount: { images: 120, videos: 15, audio: 5 },
        },
        {
          id: "3",
          title: "Childhood Home",
          description: "Recreating memories from where I grew up",
          thumbnail: "/placeholder.svg?height=200&width=300",
          createdAt: "2024-05-10",
          isPublic: false,
          collaborators: 1,
          views: 8,
          mediaCount: { images: 32, videos: 3, audio: 12 },
        },
      ])
      setIsLoading(false)
    }, 800)
  }, [router])

  const filteredMemories = memories.filter(
    (memory) =>
      memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Memory Spaces</h1>
            <p className="text-gray-300">Create and manage your immersive memory worlds</p>
          </div>
          <Link href="/builder">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 mt-4 sm:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Create New Memory
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search your memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Memory Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-sm animate-pulse">
                <div className="h-48 bg-white/10 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemories.map((memory) => (
              <Card
                key={memory.id}
                className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group"
              >
                <div className="relative">
                  <img
                    src={memory.thumbnail || "/placeholder.svg"}
                    alt={memory.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="bg-black/50 hover:bg-black/70">
                          <MoreHorizontal className="h-4 w-4 text-white" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant={memory.isPublic ? "default" : "secondary"}>
                      {memory.isPublic ? "Public" : "Private"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {memory.title}
                    </h3>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{memory.description}</p>

                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <ImageIcon className="h-3 w-3 mr-1" />
                        {memory.mediaCount.images}
                      </div>
                      <div className="flex items-center">
                        <Video className="h-3 w-3 mr-1" />
                        {memory.mediaCount.videos}
                      </div>
                      <div className="flex items-center">
                        <Mic className="h-3 w-3 mr-1" />
                        {memory.mediaCount.audio}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(memory.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {memory.collaborators}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {memory.views}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Link href={`/memory/${memory.id}`}>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </Link>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredMemories.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No memories found</h3>
            <p className="text-gray-300 mb-6">
              {searchQuery ? "Try adjusting your search terms" : "Create your first memory space to get started"}
            </p>
            <Link href="/builder">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Memory
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
