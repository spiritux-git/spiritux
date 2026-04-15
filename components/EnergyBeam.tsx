
import React, { useEffect, useRef } from 'react';

interface EnergyBeamProps {
    projectId?: string;
    className?: string;
}

declare global {
    interface Window {
        UnicornStudio?: any;
    }
}

const EnergyBeam: React.FC<EnergyBeamProps> = ({
    projectId = "hRFfUymDGOHwtFe7evR2",
    className = ""
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scriptLoadedRef = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadScript();
                observer.disconnect();
            }
        }, { threshold: 0.1 });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        const loadScript = () => {
            if (scriptLoadedRef.current) return;

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.5.2/dist/unicornStudio.umd.js';
            script.async = true;

            script.onload = () => {
                scriptLoadedRef.current = true;
                if (window.UnicornStudio && containerRef.current) {
                    window.UnicornStudio.init();
                }
            };

            document.head.appendChild(script);
        };

        return () => {
            observer.disconnect();
        };
    }, [projectId]);

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            <div
                ref={containerRef}
                data-us-project={projectId}
                className="w-full h-full"
            />
        </div>
    );
};

export default EnergyBeam;
