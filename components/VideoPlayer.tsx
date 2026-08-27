'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

interface VideoPlayerProps {
  title: string
  description: string
  duration: string
  thumbnail?: string
}

export default function VideoPlayer({ title, description, duration, thumbnail }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="relative rounded-2xl overflow-hidden group">
      <div className="aspect-video bg-sv-navy border border-white/10 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-sv-blue/5 to-sv-green/5" />
          <div className="relative z-10 text-center">
            <p className="text-xs text-white/30 font-cw-regular max-w-sm">{description}</p>
          </div>
          {!isPlaying && (
            <button onClick={() => setIsPlaying(true)} className="absolute inset-0 flex items-center justify-center group/play">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all group-hover/play:scale-110 group-hover/play:bg-white/20">
                <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
              </div>
            </button>
          )}
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-white/20 border-t-sv-blue animate-spin" />
                <p className="text-sm text-white/50 font-cw-regular">Video wird geladen...</p>
              </div>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            <div><h4 className="text-sm font-cw-bold text-white">{title}</h4></div>
            <span className="text-xs text-white/50 bg-black/50 px-2 py-1 rounded">{duration}</span>
          </div>
          <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full bg-sv-gradient rounded-full transition-all duration-[3000ms] ${isPlaying ? 'w-1/3' : 'w-0'}`} />
          </div>
        </div>
      </div>
    </div>
  )
}