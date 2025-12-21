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

        // Lighting: Much brighter to fix "super low" brightness
        viewer.globalLight.intensity = 3.0;
        viewer.cameraLight.intensity = 0.8;

        viewer.controls.enableZoom = true;
        viewer.controls.enableRotate = true;
        // viewer.controls.enablePan = false;

        // Animation: None (we want frozen pose)
        viewer.animation = null;

        // Apply "Frozen Mid-Walk" pose when skin loads
        viewer.addEventListener("skinLoaded", () => {
            const player = viewer.playerObject;
            if (player) {
                // Legs (Swing)
                player.skin.leftLeg.rotation.x = 0.5;
                player.skin.rightLeg.rotation.x = -0.5;

                // Arms (Counter-swing)
                player.skin.leftArm.rotation.x = -0.5;
                player.skin.rightArm.rotation.x = 0.5;

                // Slight body rotation/bob if desired, but "frozen mid-walk" implies just limbs.
            }
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
