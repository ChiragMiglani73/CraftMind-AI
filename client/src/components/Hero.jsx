import React from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate()

  return (
    <section
  className="
    relative
    h-screen
    flex items-center justify-center
    px-4 sm:px-20 xl:px-32
    bg-gradient-to-b from-[#0b0b16] via-[#12122a] to-[#0b0b16]
    overflow-hidden
  "
>
  {/* Glow */}
  <div className="absolute inset-0 flex justify-center -z-10">
    <div className="w-[420px] sm:w-[600px] h-[420px] sm:h-[600px]
                    bg-primary/25 rounded-full blur-[160px]" />
  </div>

  <div className="relative z-10 text-center max-w-3xl">

    {/* Headline */}
    <h1
      className="text-3xl sm:text-6xl md:text-7xl
                 font-medium text-white leading-tight"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      Create content{' '}
      <span className="text-primary font-semibold">
        faster
      </span>{' '}
      with intelligent AI
    </h1>

    {/* Subtext */}
    <p className="mt-4 sm:mt-6 max-w-xl mx-auto
                  text-gray-400 text-sm sm:text-lg leading-relaxed">
      Craft blogs, generate images, and build social content using
      context-aware AI that understands intent.
    </p>

    {/* CTA */}
    <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row
                    items-center justify-center gap-4 sm:gap-5">
      <button
        onClick={() => navigate('/ai')}
        className="w-full sm:w-auto
                   bg-primary text-white px-10 py-3 rounded-xl font-medium
                   shadow-xl shadow-primary/40
                   hover:scale-105 active:scale-95 transition-all"
      >
        Start creating free
      </button>

      <button
        onClick={() =>
          document
            .getElementById('ai-tools')
            ?.scrollIntoView({ behavior: 'smooth' })
        }
        className="w-full sm:w-auto
                   text-white/80 px-10 py-3 rounded-xl
                   border border-white/20
                   hover:bg-white/10 transition-all"
      >
        Explore AI tools
      </button>
    </div>

    {/* Footer text */}
    <div className="mt-8 sm:mt-12 text-xs sm:text-sm text-gray-500">
      Built for creators, students, and developers
    </div>

  </div>
</section>

  )
}

export default Hero
