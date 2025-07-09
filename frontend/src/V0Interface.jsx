import {
  Search,
  Grid3X3,
  Clock,
  Users,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Camera,
  Upload,
  FileText,
  UserPlus,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function V0Interface() {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-white rounded text-black flex items-center justify-center text-sm font-bold">
              v0
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Personal</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white border-gray-700">New Chat</Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2">
          <div className="flex items-center gap-3 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded cursor-pointer">
            <Search className="w-4 h-4" />
            <span className="text-sm">Search</span>
          </div>
          <div className="flex items-center gap-3 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded cursor-pointer">
            <Grid3X3 className="w-4 h-4" />
            <span className="text-sm">Projects</span>
          </div>
          <div className="flex items-center gap-3 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded cursor-pointer">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Recents</span>
          </div>
          <div className="flex items-center gap-3 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded cursor-pointer">
            <Users className="w-4 h-4" />
            <span className="text-sm">Community</span>
          </div>

          {/* Collapsible Sections */}
          <div className="pt-4 space-y-2">
            <div className="flex items-center gap-2 p-2 text-gray-400 hover:text-white cursor-pointer">
              <ChevronRight className="w-4 h-4" />
              <span className="text-sm">Favorite Projects</span>
            </div>
            <div className="flex items-center gap-2 p-2 text-gray-400 hover:text-white cursor-pointer">
              <ChevronRight className="w-4 h-4" />
              <span className="text-sm">Favorite Chats</span>
            </div>
            <div className="flex items-center gap-2 p-2 text-gray-400 hover:text-white cursor-pointer">
              <ChevronDown className="w-4 h-4" />
              <span className="text-sm">Recents</span>
            </div>
          </div>

          {/* Empty State */}
          <div className="pt-8 text-center text-gray-500 text-sm">
            <p>You haven't created any</p>
            <p>chats yet.</p>
          </div>
        </div>

        {/* New Feature Banner */}
        <div className="p-4 border-t border-gray-800">
          <div className="bg-gray-800 rounded-lg p-3 relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-1 right-1 h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </Button>
            <div className="text-sm">
              <div className="font-medium mb-1">New Feature</div>
              <div className="text-gray-400 text-xs leading-relaxed">
                v0 will now sync across tabs and browsers while messages stream in
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-gray-800 p-4 flex justify-between items-center">
          <div></div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 bg-transparent">
              Upgrade
            </Button>
            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 bg-transparent">
              Feedback
            </Button>
            <div className="w-8 h-8 bg-green-500 rounded-full"></div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {/* GitHub Sync Banner */}
          <div className="mb-12 flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-full px-4 py-2">
            <Badge variant="secondary" className="bg-green-600 text-white text-xs">
              New
            </Badge>
            <span className="text-sm">Sync your generation with GitHub</span>
            <span className="text-blue-400 text-sm cursor-pointer hover:underline">Try it now</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl font-bold mb-12 text-center">What can I help you build?</h1>

          {/* Input Area */}
          <div className="w-full max-w-2xl mb-8">
            <div className="relative">
              <Input
                placeholder="Ask v0 to build..."
                className="w-full bg-gray-900 border-gray-700 text-white placeholder-gray-400 h-12 pr-20"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
                  <Sparkles className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
              <span>v0-1.5-md</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mb-16 justify-center">
            <Button
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800 flex items-center gap-2 bg-transparent"
            >
              <Camera className="w-4 h-4" />
              Clone a Screenshot
            </Button>
            <Button
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800 flex items-center gap-2 bg-transparent"
            >
              <FileText className="w-4 h-4" />
              Import from Figma
            </Button>
            <Button
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800 flex items-center gap-2 bg-transparent"
            >
              <Upload className="w-4 h-4" />
              Upload a Project
            </Button>
            <Button
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800 flex items-center gap-2 bg-transparent"
            >
              <FileText className="w-4 h-4" />
              Landing Page
            </Button>
            <Button
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800 flex items-center gap-2 bg-transparent"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up Form
            </Button>
          </div>

          {/* Community Section */}
          <div className="w-full max-w-6xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">From the Community</h2>
                <p className="text-gray-400 text-sm">Explore what the community is building with v0.</p>
              </div>
              <Button variant="ghost" className="text-gray-400 hover:text-white flex items-center gap-1">
                Browse All
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Community Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Project 1 - Cyberpunk Dashboard */}
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-orange-500 to-red-600 relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-xs text-white/80 mb-1">DASHBOARD</div>
                    <div className="text-sm text-white font-medium">Cyberpunk-style interface</div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2">Cyberpunk dashboard design</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      E
                    </div>
                    <span>2.1K Forks</span>
                  </div>
                </div>
              </div>

              {/* Project 2 - Financial Dashboard */}
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-xs text-white/80 mb-1">ANALYTICS</div>
                    <div className="text-sm text-white font-medium">Financial data visualization</div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2">Financial Dashboard</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      F
                    </div>
                    <span>2.02K Forks</span>
                  </div>
                </div>
              </div>

              {/* Project 3 - Login Card */}
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-gray-600 to-gray-800 relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-xs text-white/80 mb-1">AUTHENTICATION</div>
                    <div className="text-sm text-white font-medium">Clean login interface</div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2">Two-column Login Card</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      T
                    </div>
                    <span>7.3K Forks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 