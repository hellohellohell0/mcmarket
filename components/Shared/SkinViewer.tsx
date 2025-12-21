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

        // Patch: If skinUrl contains '/helm/', replace with '/skin/' to fix legacy data
        // This handles the "horrid" look if the user views old listings created with the bug
        const fullSkinUrl = skinUrl.replace('/helm/', '/skin/').replace('/100.png', '');

        // Ensure skin loads correctly (force 64x64 model or auto)
        // skinview3d usually auto-detects from image dimensions if loaded via loadSkin
        viewer.loadSkin(fullSkinUrl, {
            model: 'auto-detect'
        });

        // NameMC-like settings
        // Camera: Slightly zoomed out, angled
        viewer.camera.position.set(15, 10, 40);
        viewer.fov = 50;
        viewer.zoom = 0.9;

        // Lighting: Default is usually fine, but NameMC is bright.
        viewer.globalLight.intensity = 0.8;
        viewer.cameraLight.intensity = 0.6;

        viewer.controls.enableZoom = true;
        viewer.controls.enableRotate = true;
        // viewer.controls.enablePan = false;

        // Animation: Idle for natural standing
        viewer.animation = new skinview3d.IdleAnimation();
        viewer.animation.speed = 1;

        viewerRef.current = viewer;

        return () => {
            viewer.dispose();
        };
    }, [skinUrl, width, height]);

    return (
        <canvas ref={canvasRef} style={{ width, height, cursor: 'move' }} />
    );
}
