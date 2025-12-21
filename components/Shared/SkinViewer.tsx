'use client';

import { useEffect, useRef } from 'react';
import * as skinview3d from 'skinview3d';

interface SkinViewerProps {
    skinUrl: string;
    width?: number;
    height?: number;
}

export default function SkinViewer({ skinUrl, width = 300, height = 400 }: SkinViewerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const viewerRef = useRef<skinview3d.SkinViewer | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const viewer = new skinview3d.SkinViewer({
            canvas: canvasRef.current,
            width: width,
            height: height,
            skin: skinUrl,
        });

        // Angle: Top-right angling down
        // skinview3d coordinates: 
        // globalLight.position...
        // camera position...

        // Set initial camera position for "top-right angling down"
        // Rotate slightly
        viewer.camera.position.set(20, 20, 40); // x, y, z - experiment for "top right down"
        viewer.controls.enableZoom = true;
        viewer.controls.enableRotate = true;
        // viewer.controls.enablePan = false;

        // Disable animation
        viewer.animation = null;

        // Ensure skin loads correctly (force 64x64 model or auto)
        // skinview3d usually auto-detects from image dimensions if loaded via loadSkin
        viewer.loadSkin(skinUrl, {
            model: 'auto-detect' // Attempt auto-detection
        });

        viewerRef.current = viewer;

        return () => {
            viewer.dispose();
        };
    }, [skinUrl, width, height]);

    return (
        <canvas ref={canvasRef} style={{ width, height, cursor: 'move' }} />
    );
}
