'use client';

import { useEffect, useRef } from 'react';
import * as skinview3d from 'skinview3d';

interface SkinViewerProps {
    skinUrl: string;
    width?: number | string;
    height?: number | string;
    staticModel?: boolean;
}

export default function SkinViewer({ skinUrl, width = 300, height = 400, staticModel = false }: SkinViewerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<skinview3d.SkinViewer | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Determine initial size
        let w = typeof width === 'number' ? width : 300;
        let h = typeof height === 'number' ? height : 400;

        // If width/height are strings (e.g. '100%'), we rely on ResizeObserver,
        // but we need an initial number for the viewer constructor.
        if (wrapperRef.current) {
            w = wrapperRef.current.clientWidth;
            h = wrapperRef.current.clientHeight;
        }

        const viewer = new skinview3d.SkinViewer({
            canvas: canvasRef.current,
            width: w,
            height: h,
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

        viewer.animation = null;

        const fullSkinUrl = skinUrl.replace('/helm/', '/skin/').replace('/100.png', '');

        viewer.loadSkin(fullSkinUrl, { model: 'auto-detect' })
            .then(() => {
                const player = viewer.playerObject;
                if (player) {
                    player.skin.leftLeg.rotation.x = 0.5;
                    player.skin.rightLeg.rotation.x = -0.5;
                    player.skin.leftArm.rotation.x = -0.5;
                    player.skin.rightArm.rotation.x = 0.5;
                }
            });

        viewerRef.current = viewer;

        // Resize Observer for responsive sizing
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.target === wrapperRef.current && viewerRef.current) {
                    // entry.contentRect doesn't include padding/border, which is usually fine
                    const { width: newW, height: newH } = entry.contentRect;
                    // Only resize if significantly changed to avoid loops
                    viewerRef.current.setSize(newW, newH);
                }
            }
        });

        if (wrapperRef.current && (typeof width === 'string' || typeof height === 'string')) {
            resizeObserver.observe(wrapperRef.current);
        }

        return () => {
            viewer.dispose();
            resizeObserver.disconnect();
        };
    }, [skinUrl, staticModel]); // removed width/height from dep array to avoid re-init on resize, logic handled by observer

    return (
        <div ref={wrapperRef} style={{ width, height, position: 'relative' }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
        </div>
    );
}
