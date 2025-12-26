import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DeviceFrameProps {
  imageUrl: string;
  imageUrls?: string[];
  deviceType: "monitor" | "phone" | "tablet";
  alt: string;
}

export default function DeviceFrame({ imageUrl, imageUrls, deviceType, alt }: DeviceFrameProps) {
  const images = imageUrls && imageUrls.length > 0 ? imageUrls : [imageUrl];
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultipleImages = images.length > 1;

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const NavigationArrows = () => {
    if (!hasMultipleImages) return null;
    return (
      <>
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white transition-all duration-200 backdrop-blur-sm shadow-lg"
          data-testid="button-device-prev"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white transition-all duration-200 backdrop-blur-sm shadow-lg"
          data-testid="button-device-next"
        >
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`rounded-full transition-all duration-200 shadow-sm ${
                idx === currentIndex 
                  ? "bg-white w-2 h-1 sm:w-2.5 sm:h-1.5" 
                  : "bg-white/50 w-1 h-1 sm:w-1.5 sm:h-1.5"
              }`}
            />
          ))}
        </div>
      </>
    );
  };

  if (deviceType === "phone") {
    return (
      <div className="relative mx-auto w-[100px] sm:w-[140px] md:w-[180px]">
        {/* Outer glow/shadow for depth */}
        <div 
          className="absolute -inset-3 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] opacity-50 blur-xl"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.7), transparent 70%)"
          }}
        />
        
        {/* Main phone body - sleek black frame */}
        <div 
          className="relative rounded-[1.4rem] sm:rounded-[1.8rem] md:rounded-[2.2rem]"
          style={{
            background: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 25%, #000000 50%, #0a0a0a 75%, #151515 100%)",
            padding: "6px",
            boxShadow: `
              0 40px 80px -15px rgba(0,0,0,0.7),
              0 25px 50px -20px rgba(0,0,0,0.6),
              inset 0 1px 2px rgba(255,255,255,0.08),
              inset 0 -1px 2px rgba(0,0,0,0.5),
              0 0 0 0.5px rgba(60,60,60,0.3)
            `
          }}
        >
          {/* Side buttons - volume (black) */}
          <div 
            className="absolute -left-[2px] top-[18%] w-[3px] h-4 sm:h-5 md:h-6 rounded-l-sm"
            style={{ 
              background: "linear-gradient(90deg, #000 0%, #1a1a1a 50%, #252525 100%)",
              boxShadow: "-1px 0 3px rgba(0,0,0,0.5)"
            }} 
          />
          <div 
            className="absolute -left-[2px] top-[28%] w-[3px] h-4 sm:h-5 md:h-6 rounded-l-sm"
            style={{ 
              background: "linear-gradient(90deg, #000 0%, #1a1a1a 50%, #252525 100%)",
              boxShadow: "-1px 0 3px rgba(0,0,0,0.5)"
            }} 
          />
          {/* Power button (black) */}
          <div 
            className="absolute -right-[2px] top-[22%] w-[3px] h-6 sm:h-7 md:h-9 rounded-r-sm"
            style={{ 
              background: "linear-gradient(90deg, #252525 0%, #1a1a1a 50%, #000 100%)",
              boxShadow: "1px 0 3px rgba(0,0,0,0.5)"
            }} 
          />

          {/* Inner bezel - the actual screen area */}
          <div 
            className="relative rounded-[1.1rem] sm:rounded-[1.4rem] md:rounded-[1.8rem] overflow-hidden"
            style={{
              background: "#000",
              boxShadow: "inset 0 0 15px rgba(0,0,0,0.9)"
            }}
          >
            {/* Dynamic Island - realistic pill shape */}
            <div className="absolute top-1.5 sm:top-2 md:top-2.5 left-1/2 -translate-x-1/2 z-30">
              <div 
                className="w-12 sm:w-14 md:w-18 h-3 sm:h-3.5 md:h-4 rounded-full flex items-center justify-center gap-1.5"
                style={{ 
                  background: "#000",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.6)"
                }}
              >
                {/* Camera */}
                <div className="w-1.5 sm:w-2 md:w-2.5 h-1.5 sm:h-2 md:h-2.5 rounded-full relative overflow-hidden"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, #2a2a30, #0a0a10)",
                    boxShadow: "inset 0 0.5px 1px rgba(255,255,255,0.08)"
                  }}
                >
                  <div 
                    className="absolute inset-[1px] rounded-full"
                    style={{ background: "radial-gradient(circle at 40% 40%, #1a2a40, #050a15)" }}
                  />
                </div>
              </div>
            </div>

            {/* Screen with project image */}
            <div className="aspect-[9/19.5] overflow-hidden relative bg-black">
              <img
                src={images[currentIndex]}
                alt={alt}
                className="w-full h-full object-cover object-top transition-opacity duration-300"
              />
              
              {/* Enhanced realistic glass reflection overlay */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                    linear-gradient(
                      118deg, 
                      rgba(255,255,255,0.18) 0%, 
                      rgba(255,255,255,0.08) 15%,
                      rgba(255,255,255,0.02) 35%,
                      transparent 50%
                    )
                  `
                }}
              />
              {/* Secondary subtle reflection for depth */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                    linear-gradient(
                      200deg, 
                      transparent 60%,
                      rgba(255,255,255,0.03) 80%,
                      rgba(255,255,255,0.06) 100%
                    )
                  `
                }}
              />
              {/* Edge highlight for glass effect */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-[1rem] sm:rounded-[1.3rem] md:rounded-[1.6rem]"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08)"
                }}
              />
              
              <NavigationArrows />
            </div>

            {/* Home indicator bar */}
            <div 
              className="absolute bottom-1 sm:bottom-1.5 md:bottom-2 left-1/2 -translate-x-1/2 w-8 sm:w-10 md:w-12 h-0.5 sm:h-1 rounded-full z-20"
              style={{
                background: "rgba(255,255,255,0.3)",
                boxShadow: "0 0 3px rgba(255,255,255,0.15)"
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (deviceType === "tablet") {
    return (
      <div className="relative mx-auto w-[160px] sm:w-[240px] md:w-[340px]">
        {/* Outer shadow for depth */}
        <div 
          className="absolute -inset-5 rounded-[1.8rem] opacity-35 blur-2xl"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.7), transparent 70%)"
          }}
        />
        
        {/* iPad-style aluminum frame */}
        <div 
          className="relative rounded-[1rem] sm:rounded-[1.4rem] md:rounded-[1.8rem]"
          style={{
            background: "linear-gradient(145deg, #e0e0e4 0%, #d0d0d4 15%, #c0c0c4 35%, #b0b0b4 50%, #c0c0c4 65%, #d0d0d4 85%, #e0e0e4 100%)",
            padding: "5px",
            boxShadow: `
              0 45px 90px -15px rgba(0,0,0,0.45),
              0 25px 50px -20px rgba(0,0,0,0.35),
              inset 0 2px 3px rgba(255,255,255,0.9),
              inset 0 -2px 3px rgba(0,0,0,0.12),
              0 0 0 0.5px rgba(255,255,255,0.4)
            `
          }}
        >
          {/* Inner screen bezel */}
          <div 
            className="relative rounded-[0.7rem] sm:rounded-[1.1rem] md:rounded-[1.4rem] overflow-hidden"
            style={{
              background: "#000",
              boxShadow: "inset 0 0 12px rgba(0,0,0,0.6)"
            }}
          >
            {/* Front camera */}
            <div className="absolute top-1.5 sm:top-2 md:top-2.5 left-1/2 -translate-x-1/2 z-20">
              <div 
                className="w-1.5 sm:w-2 md:w-2.5 h-1.5 sm:h-2 md:h-2.5 rounded-full"
                style={{
                  background: "radial-gradient(circle at 30% 30%, #3a3a45, #1a1a20)",
                  boxShadow: "inset 0 0.5px 1.5px rgba(255,255,255,0.12), 0 1px 2px rgba(0,0,0,0.4)"
                }}
              />
            </div>

            {/* Screen */}
            <div className="aspect-[3/4] overflow-hidden relative bg-black">
              <img
                src={images[currentIndex]}
                alt={alt}
                className="w-full h-full object-cover object-top transition-opacity duration-300"
              />
              
              {/* Enhanced glass reflection - primary */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                    linear-gradient(
                      125deg, 
                      rgba(255,255,255,0.14) 0%, 
                      rgba(255,255,255,0.06) 20%,
                      rgba(255,255,255,0.02) 40%,
                      transparent 55%
                    )
                  `
                }}
              />
              {/* Secondary reflection for realism */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                    linear-gradient(
                      210deg, 
                      transparent 55%,
                      rgba(255,255,255,0.02) 75%,
                      rgba(255,255,255,0.05) 100%
                    )
                  `
                }}
              />
              {/* Edge glow */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-[0.6rem] sm:rounded-[1rem] md:rounded-[1.3rem]"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)"
                }}
              />
              
              <NavigationArrows />
            </div>

            {/* Home indicator */}
            <div 
              className="absolute bottom-1 sm:bottom-1.5 md:bottom-2 left-1/2 -translate-x-1/2 w-10 sm:w-14 md:w-20 h-0.5 sm:h-1 rounded-full z-20"
              style={{ background: "rgba(255,255,255,0.25)" }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Monitor - Professional desktop display
  return (
    <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[380px] md:max-w-[520px]">
      {/* Large ambient shadow */}
      <div 
        className="absolute -inset-6 opacity-30 blur-3xl"
        style={{
          background: "radial-gradient(ellipse at center bottom, rgba(0,0,0,0.8), transparent 70%)"
        }}
      />
      
      {/* Monitor housing - premium slim bezel design */}
      <div 
        className="relative rounded-md sm:rounded-lg overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #222228 0%, #1a1a20 30%, #141418 70%, #0c0c10 100%)",
          padding: "5px 5px 8px 5px",
          boxShadow: `
            0 50px 100px -15px rgba(0,0,0,0.55),
            0 25px 50px -8px rgba(0,0,0,0.45),
            inset 0 1px 1px rgba(255,255,255,0.06),
            inset 0 -1px 1px rgba(0,0,0,0.4),
            0 0 0 0.5px rgba(255,255,255,0.02)
          `
        }}
      >
        {/* Top bezel with centered webcam */}
        <div 
          className="flex items-center justify-center py-1 sm:py-1.5 md:py-2 relative"
          style={{
            background: "linear-gradient(180deg, #181820 0%, #131318 100%)"
          }}
        >
          {/* Webcam module */}
          <div className="flex items-center gap-1">
            {/* Camera lens with realistic glass effect */}
            <div 
              className="w-1.5 sm:w-2 md:w-2.5 h-1.5 sm:h-2 md:h-2.5 rounded-full relative overflow-hidden"
              style={{
                background: "radial-gradient(circle at 30% 30%, #3a3a45, #1a1a20)",
                boxShadow: "inset 0 0.5px 1.5px rgba(255,255,255,0.12), 0 1px 2px rgba(0,0,0,0.6)"
              }}
            >
              <div 
                className="absolute inset-[1.5px] rounded-full"
                style={{ background: "radial-gradient(circle at 35% 35%, #1e3a5f, #0a1525)" }}
              />
            </div>
            {/* LED indicator */}
            <div 
              className="w-0.5 sm:w-1 h-0.5 sm:h-1 rounded-full"
              style={{ background: "#181820" }}
            />
          </div>
        </div>

        {/* Screen panel */}
        <div 
          className="aspect-[16/9] overflow-hidden relative rounded-sm"
          style={{ 
            background: "#000",
            boxShadow: "inset 0 0 25px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(0,0,0,0.9)"
          }}
        >
          <img
            src={images[currentIndex]}
            alt={alt}
            className="w-full h-full object-cover object-top transition-opacity duration-300"
          />
          
          {/* Enhanced realistic screen glass reflection - primary */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(
                  128deg, 
                  rgba(255,255,255,0.10) 0%, 
                  rgba(255,255,255,0.04) 25%,
                  rgba(255,255,255,0.01) 45%,
                  transparent 55%
                )
              `
            }}
          />
          {/* Secondary reflection for depth */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(
                  215deg, 
                  transparent 50%,
                  rgba(255,255,255,0.015) 70%,
                  rgba(255,255,255,0.04) 100%
                )
              `
            }}
          />
          {/* Screen edge highlight */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)"
            }}
          />
          
          <NavigationArrows />
        </div>

        {/* Bottom bezel with brand indicator */}
        <div 
          className="flex items-center justify-center py-1 sm:py-1.5 md:py-2"
          style={{
            background: "linear-gradient(180deg, #131318 0%, #181820 100%)"
          }}
        >
          {/* Subtle brand logo placeholder */}
          <div 
            className="w-6 sm:w-8 md:w-10 h-0.5 sm:h-1 rounded-full"
            style={{ 
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" 
            }}
          />
        </div>
      </div>

      {/* Monitor stand - modern slim design */}
      <div className="relative flex flex-col items-center">
        {/* Neck/arm - tapered aluminum look */}
        <div 
          className="w-3 sm:w-4 md:w-5 h-8 sm:h-12 md:h-16 relative"
          style={{
            background: "linear-gradient(90deg, #222228 0%, #32323a 30%, #40404a 50%, #32323a 70%, #222228 100%)",
            boxShadow: "0 0 8px rgba(0,0,0,0.4), inset 0 0 4px rgba(255,255,255,0.04)"
          }}
        >
          {/* Subtle highlight on neck */}
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.06) 50%, transparent 80%)"
            }}
          />
        </div>
        
        {/* Base - oval shaped with proper depth */}
        <div 
          className="w-20 sm:w-30 md:w-40 h-2 sm:h-3 md:h-4 rounded-full relative"
          style={{
            background: "linear-gradient(180deg, #35353d 0%, #28282f 40%, #1a1a20 100%)",
            boxShadow: `
              0 6px 12px -3px rgba(0,0,0,0.45),
              0 3px 6px -2px rgba(0,0,0,0.35),
              inset 0 1px 1px rgba(255,255,255,0.08),
              inset 0 -1px 1px rgba(0,0,0,0.25)
            `
          }}
        >
          {/* Top highlight */}
          <div 
            className="absolute inset-x-4 top-0 h-px rounded-full"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
          />
        </div>
        
        {/* Base shadow on surface */}
        <div 
          className="w-24 sm:w-34 md:w-48 h-1 sm:h-1.5 md:h-2 rounded-full mt-0.5 opacity-45"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, transparent 70%)"
          }}
        />
      </div>
    </div>
  );
}
