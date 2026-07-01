import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Compass } from 'lucide-react';

const NotFound = () => {
  useEffect(() => {
    document.title = '404 - Page Not Found | Aarovi';
  }, []);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FBF7F3] py-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8 bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-secondary/10 relative overflow-hidden">

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#4F200D]/5 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#AF8255]/5 to-transparent rounded-tr-full" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Animated/Styled Icon Container */}
          <div className="w-20 h-20 bg-[#4F200D]/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Compass className="text-[#4F200D]" size={36} />
          </div>

          {/* Big Elegent 404 Header */}
          <h1 className="text-8xl font-serif font-bold text-text tracking-tight mb-2" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
            404
          </h1>

          <h2 className="text-2xl font-serif font-bold text-text mb-4" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
            Lost in Style
          </h2>

          <p className="text-text/60 font-light text-sm leading-relaxed mb-8 max-w-sm">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-secondary/25 text-text hover:border-secondary hover:bg-secondary/5 font-semibold text-sm rounded-full transition-all duration-300 w-full sm:w-auto"
            >
              <ArrowLeft size={16} />
              <span>Go Back</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#4F200D] text-white hover:bg-[#4F200D]/90 font-semibold text-sm rounded-full transition-all duration-300 shadow-lg shadow-[#4F200D]/20 hover:shadow-xl hover:shadow-[#4F200D]/30 w-full sm:w-auto"
            >
              <Home size={16} />
              <span>Return Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
