import { useEffect } from 'react';
import { motion } from 'framer-motion';

const SplashScreen = ({ onComplete, mediaUrl, duration = 2.0 }: { onComplete: () => void, mediaUrl?: string, duration?: number }) => {

    // Default video
    const defaultMedia = "/assets/genmedai/images/genmedai_intro_logo.mp4";
    // Check if mediaUrl is valid (not null/empty), else use default
    const src = (mediaUrl && mediaUrl.trim() !== "") ? mediaUrl : defaultMedia;

    const isVideo = src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov');

    // Duration in ms
    const durationMs = duration * 1000;

    useEffect(() => {
        // Fallback: Max wait time based on duration setting
        // For video: it acts as a "max timeout" if video stalls or is infinite loop
        // For image: it acts as the display time
        const effectiveDuration = isVideo ? Math.max(durationMs, 2500) : durationMs;

        const timer = setTimeout(() => {
            onComplete();
        }, effectiveDuration);

        return () => clearTimeout(timer);
    }, [onComplete, durationMs, isVideo]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-black overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <div className="relative w-full h-full flex items-center justify-center">
                {isVideo ? (
                    <video
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover scale-105"
                        onEnded={onComplete}
                        onError={onComplete}
                    >
                        <source src={src} type="video/mp4" />
                    </video>
                ) : (
                    <img
                        src={src}
                        alt="Splashing..."
                        className="w-full h-full object-cover animate-pulse"
                        onLoad={() => {
                            // Let the main useEffect timer handle the close for consistency with duration setting
                        }}
                        onError={onComplete}
                    />
                )}
            </div>
        </motion.div>
    );
};

export default SplashScreen;
