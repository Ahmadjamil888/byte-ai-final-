'use client';

interface BlackHoleBackgroundProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
}

export default function BlackHoleBackground({ 
  children, 
  className = '', 
  intensity = 'medium' 
}: BlackHoleBackgroundProps) {
  const getIntensityStyles = () => {
    switch (intensity) {
      case 'light':
        return {
          background: `
            radial-gradient(ellipse 60% 40% at 50% -10%, rgba(255, 140, 0, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(255, 140, 0, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(255, 140, 0, 0.04) 0%, transparent 40%),
            linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)
          `,
          overlayOpacity: 0.15
        };
      case 'heavy':
        return {
          background: `
            radial-gradient(ellipse 100% 60% at 50% -30%, rgba(255, 140, 0, 0.2) 0%, transparent 70%),
            radial-gradient(ellipse 80% 100% at 50% 130%, rgba(0, 0, 0, 0.95) 0%, transparent 60%),
            radial-gradient(circle at 20% 80%, rgba(255, 140, 0, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 80% 20%, rgba(255, 140, 0, 0.12) 0%, transparent 60%),
            radial-gradient(circle at 40% 40%, rgba(0, 0, 0, 0.98) 0%, transparent 80%),
            linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)
          `,
          overlayOpacity: 0.4
        };
      default: // medium
        return {
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255, 140, 0, 0.15) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 50% 120%, rgba(0, 0, 0, 0.9) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(255, 140, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 140, 0, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(0, 0, 0, 0.95) 0%, transparent 70%),
            linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)
          `,
          overlayOpacity: 0.3
        };
    }
  };

  const styles = getIntensityStyles();

  return (
    <div className={`min-h-screen relative overflow-hidden ${className}`} style={styles}>
      {/* Black hole effect overlay */}
      <div className="absolute inset-0" style={{ opacity: styles.overlayOpacity }}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full" 
             style={{
               background: `
                 radial-gradient(circle, transparent 30%, rgba(255, 140, 0, 0.1) 40%, rgba(0, 0, 0, 0.8) 70%, black 100%)
               `,
               filter: 'blur(1px)'
             }}>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}