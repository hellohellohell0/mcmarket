'use client';

import { useEffect, useRef } from 'react';
import * as skinview3d from 'skinview3d';

interface SkinViewerProps {
    skinUrl: string;
    width?: number;
    height?: number;
    staticModel?: boolean;
}

export default function SkinViewer({ skinUrl, width = 300, height = 400, staticModel = false }: SkinViewerProps) {
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

        // NameMC-like settings
        viewer.camera.position.set(15, 10, 40);
        viewer.fov = 50;
        viewer.zoom = 0.9;

        // Lighting
        viewer.globalLight.intensity = 3.0;
        viewer.cameraLight.intensity = 0.8;

        if (!staticModel) {
            viewer.controls.enableZoom = true;
            viewer.controls.enableRotate = true;
        } else {
            viewer.controls.enableZoom = false;
            viewer.controls.enableRotate = false;
        }

        // Animation: None
        viewer.animation = null;

        // Patch URL and Load
        const fullSkinUrl = skinUrl.replace('/helm/', '/skin/').replace('/100.png', '');

        viewer.loadSkin(fullSkinUrl, {
            model: 'auto-detect'
        })
            .then(() => {
                // Apply "Frozen Mid-Walk" pose
                const player = viewer.playerObject;
                if (player) {
                    // Legs (Swing)
                    player.skin.leftLeg.rotation.x = 0.5;
                    player.skin.rightLeg.rotation.x = -0.5;

                    // Arms (Counter-swing)
                    player.skin.leftArm.rotation.x = -0.5;
                    player.skin.rightArm.rotation.x = 0.5;
                }
            });

        viewerRef.current = viewer;

        return () => {
            viewer.dispose();
        };
    }, [skinUrl, width, height, staticModel]);

    return (
        <canvas ref={canvasRef} style={{ width, height, cursor: staticModel ? 'default' : 'move' }} />
    );
}
