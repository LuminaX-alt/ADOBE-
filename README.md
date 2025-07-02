# MemoryScape XR - Immersive Social VR Platform

A full-stack VR platform for creating immersive memory spaces from photos, videos, and audio files with real-time collaboration features.

## Features

- **AI-Powered Scene Generation**: Upload media and let AI create 3D environments
- **Real-time Collaboration**: Multiple users can explore and edit memory spaces together
- **Interactive Hotspots**: Clickable elements that trigger media playback
- **Social Features**: Comments, sharing, and live sessions
- **VR Compatible**: Full VR support with Meta Horizon integration
- **Media Management**: Support for photos, videos, and audio files
- **Spatial Audio**: 3D positioned audio and voice comments

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **3D Graphics**: React Three Fiber, Three.js
- **UI Components**: shadcn/ui, Radix UI
- **Authentication**: JWT, Meta OAuth (placeholder)
- **Real-time**: Socket.IO (client-side setup)
- **AI Integration**: Placeholder for Replicate/Stability AI
- **Database**: In-memory storage (demo), ready for Supabase/Neon
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd memoryscape-xr
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Add the following environment variables:
\`\`\`env
JWT_SECRET=your-jwt-secret-key
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
# Add AI service keys when ready
# REPLICATE_API_TOKEN=your-replicate-token
# STABILITY_API_KEY=your-stability-key
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
memoryscape-xr/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── memories/      # Memory CRUD operations
│   │   ├── ai/            # AI scene generation
│   │   └── upload/        # File upload handling
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── builder/           # Memory builder interface
│   ├── memory/            # Memory viewer
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
│   └── socket.ts         # Socket.IO client manager
└── public/               # Static assets
\`\`\`

## Key Features Implementation

### 1. Memory Builder
- Drag-and-drop media upload
- AI-powered 3D scene generation
- Interactive hotspot placement
- Real-time 3D preview

### 2. 3D Memory Viewer
- Immersive 3D environments
- Interactive media hotspots
- Real-time collaboration
- Spatial audio support

### 3. Real-time Collaboration
- Multi-user presence
- Live cursor/position tracking
- Real-time comments
- Synchronized media playback

### 4. AI Integration
- Scene generation from photos
- Intelligent hotspot placement
- Environment suggestions
- Spatial arrangement optimization

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/meta` - Meta OAuth (placeholder)

### Memories
- `GET /api/memories` - List user memories
- `POST /api/memories` - Create new memory
- `GET /api/memories/[id]` - Get memory details
- `PUT /api/memories/[id]` - Update memory
- `DELETE /api/memories/[id]` - Delete memory

### AI & Media
- `POST /api/ai/generate-scene` - Generate 3D scene
- `POST /api/upload` - Upload media files

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production

\`\`\`env
JWT_SECRET=your-production-jwt-secret
NEXT_PUBLIC_SOCKET_URL=your-socket-server-url
DATABASE_URL=your-database-connection-string
REPLICATE_API_TOKEN=your-replicate-token
STABILITY_API_KEY=your-stability-key
\`\`\`

## Database Setup (Production)

### Option 1: Supabase
1. Create a Supabase project
2. Set up authentication
3. Create tables for users, memories, comments
4. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to environment variables

### Option 2: Neon
1. Create a Neon database
2. Set up connection string
3. Run database migrations
4. Add `DATABASE_URL` to environment variables

## Real-time Server Setup

For production real-time features, set up a Socket.IO server:

\`\`\`javascript
// server.js
const io = require('socket.io')(3001, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  socket.on('join-memory', ({ memoryId }) => {
    socket.join(memoryId);
  });
  
  socket.on('user-position', ({ memoryId, position }) => {
    socket.to(memoryId).emit('user-position-update', {
      userId: socket.id,
      position
    });
  });
});
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub or contact the development team.
