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

        // Animation: NameMC is static by default on profile, but user asked for "middle of a walking position" before, 
        // but now says "dont want it moving".
        // I will set it to a static "Idle" or "Walk" pose frozen?
        // NameMC main view is just standing (Idle).
        // Let's use IdleAnimation but speed 0 to stand still naturally? Or just null (T-pose/A-pose defaults).
        // skinview3d default pose is A-pose which looks awkward.
        // NameMC uses a standing pose.
        viewer.animation = null; // No animation object = default pose (A-pose usually).
        // To get a nice standing pose, we can use IdleAnimation with speed 0? 
        // Or manually set rotation.
        // Let's try IdleAnimation with speed 0.
        // viewer.animation = new skinview3d.IdleAnimation();
        // viewer.animation.speed = 0; 

        // Actually, NameMC is just straight standing.
        // Let's leave animation null, but maybe adjust arms if it looks like A-pose.
        // skinview3d default is straight arms (Steve default).

        // Load skin
        viewer.loadSkin(skinUrl, {
            model: 'auto-detect'
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
