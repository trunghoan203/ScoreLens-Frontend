import React from 'react';

export const ScoreLensLoading: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-[320px] h-[90px] flex items-center justify-center select-none">
        <div
          className="absolute left-[10px] bottom-[32px] origin-left"
          style={{
            width: '260px',
            height: '14px',
            zIndex: 1,
            bottom: '15px',
            background: 'linear-gradient(90deg, #8ADB10 60%, #8ADB10 100%)',
            clipPath: 'polygon(0% 0%, 98% 40%, 100% 50%, 98% 60%, 0% 100%)',
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
            boxShadow: '0 0 16px #8ADB10AA',
            transform: 'skew(-12deg) rotate(-6deg)',
          }}
        >
          <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shine" />
        </div>
        <span
          className="absolute left-4 top-2 text-white font-extrabold text-4xl tracking-tight drop-shadow-lg"
          style={{
            fontFamily: 'Arial Black, Arial, sans-serif',
            transform: 'skew(-12deg) rotate(-6deg)',
            letterSpacing: '0.5px',
            zIndex: 2,
            left: '35px',
          }}
        >
          ScoreLens
        </span>
        <div
          className="absolute"
          style={{
            left: '280px',
            bottom: '35px',
            zIndex: 3,
          }}
        >
          <div
            className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg"
            style={{
              boxShadow: '0 0 0 2px #ff0000AA, 0 0 16px #ff0000AA',
              animation: 'spinBall 1.6s linear infinite',
              position: 'relative',
            }}
          >
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                width: '26px',
                height: '26px',
                background: '#fff',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="text-black font-bold text-lg select-none" style={{ textShadow: '0 1px 2px #fff', zIndex: 3 }}>3</span>
            </div>
          </div>
        </div>
      </div>
      {text && (
        <div className="text-[24px] text-white font-semibold tracking-wide animate-pulse text-center">
          {text}
        </div>
      )}
      <style>{`
        @keyframes spinBall {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes shine {
          0% { left: -40%; opacity: 0; }
          30% { opacity: 1; }
          60% { left: 100%; opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .animate-shine {
          animation: shine 1.6s cubic-bezier(.6,.1,.4,1) infinite;
        }
      `}</style>
    </div>
  );
}; 