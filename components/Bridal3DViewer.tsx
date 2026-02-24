"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import * as SPLAT from "gsplat";

const SPLAT_URL_PATTERN = /\.(splat|ply)(\?.*)?$/i;
const PLY_URL_PATTERN = /\.ply(\?.*)?$/i;
const SKETCHFAB_EMBED_PATTERN = /^https?:\/\/(www\.)?sketchfab\.com\/models\/[^/]+\/embed(\?.*)?$/i;

type SplatAssetType = "splat" | "ply" | "unsupported";

const getAssetType = (url: string): SplatAssetType => {
  if (!SPLAT_URL_PATTERN.test(url)) {
    return "unsupported";
  }

  return PLY_URL_PATTERN.test(url) ? "ply" : "splat";
};

const clampProgress = (value: number) => Math.round(Math.max(0, Math.min(1, value)) * 100);

export const Bridal3DViewer = ({ modelUrl }: { modelUrl: string }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderedOnceRef = useRef(false);

  const [isRendered, setIsRendered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  const assetType = useMemo(() => getAssetType(modelUrl), [modelUrl]);
  const isSketchfabEmbed = useMemo(() => SKETCHFAB_EMBED_PATTERN.test(modelUrl), [modelUrl]);

  useEffect(() => {
    setIsRendered(false);
    setIsLoading(false);
    setLoadingPercent(0);
    setLoadError(null);
  }, [modelUrl]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) {
      return;
    }

    if (assetType === "unsupported") {
      setLoadError("3DGS viewer supports only .splat or .ply URLs.");
      return;
    }

    let disposed = false;
    let frameHandle: number | null = null;
    renderedOnceRef.current = false;

    const scene = new SPLAT.Scene();
    const camera = new SPLAT.Camera();
    camera.data.near = 0.01;
    camera.data.far = 500;
    camera.position = new SPLAT.Vector3(0, 1.15, 4.3);

    const renderer = new SPLAT.WebGLRenderer(canvas, [new SPLAT.FadeInPass(0.8)]);
    renderer.backgroundColor = new SPLAT.Color32(0, 0, 0, 0);

    const controls = new SPLAT.OrbitControls(camera, renderer.canvas, -0.3, -0.22, 4.5);
    controls.minZoom = 1.1;
    controls.maxZoom = 24;
    controls.minAngle = -Math.PI * 0.48;
    controls.maxAngle = Math.PI * 0.48;
    controls.orbitSpeed = 0.7;
    controls.dampening = 0.14;

    const resize = () => {
      if (!containerRef.current) {
        return;
      }
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    setIsLoading(true);
    setLoadingPercent(0);
    setLoadError(null);
    setIsRendered(false);

    const startRenderLoop = () => {
      let lastFrameTime = 0;
      const tick = () => {
        if (disposed) {
          return;
        }
        const now = performance.now();
        if (now - lastFrameTime >= 1000 / 30) {
          controls.update();
          renderer.render(scene, camera);
          lastFrameTime = now;
        }

        if (!renderedOnceRef.current) {
          renderedOnceRef.current = true;
          setIsRendered(true);
          setIsLoading(false);
        }

        frameHandle = requestAnimationFrame(tick);
      };

      frameHandle = requestAnimationFrame(tick);
    };

    const load = async () => {
      try {
        const onProgress = (progress: number) => {
          if (!disposed) {
            setLoadingPercent(clampProgress(progress));
          }
        };

        const splat =
          assetType === "ply"
            ? await SPLAT.PLYLoader.LoadAsync(modelUrl, scene, onProgress)
            : await SPLAT.Loader.LoadAsync(modelUrl, scene, onProgress);

        if (disposed) {
          return;
        }

        setLoadingPercent(100);
        const bounds = splat.bounds;
        const center = bounds.center();
        const size = bounds.size();
        const isFiniteBounds = [center.x, center.y, center.z, size.x, size.y, size.z].every((value) =>
          Number.isFinite(value)
        );

        if (isFiniteBounds) {
          const radius = Math.min(50, Math.max(size.x, size.y, size.z, 1));
          controls.setCameraTarget(center);
          controls.minZoom = Math.max(0.9, radius * 0.25);
          controls.maxZoom = Math.max(12, radius * 8);
          camera.position = new SPLAT.Vector3(center.x, center.y + radius * 0.24, center.z + radius * 1.7);
        } else {
          const fallbackTarget = new SPLAT.Vector3(0, 0, 0);
          controls.setCameraTarget(fallbackTarget);
          controls.minZoom = 0.9;
          controls.maxZoom = 12;
          camera.position = new SPLAT.Vector3(0, 0.3, 3.2);
        }

        // Force an initial draw so opacity can transition even on slower devices.
        controls.update();
        renderer.render(scene, camera);
        setIsRendered(true);
        setIsLoading(false);

        startRenderLoop();
      } catch (error) {
        if (disposed) {
          return;
        }
        setIsLoading(false);
        setLoadError(error instanceof Error ? error.message : "Failed to load Gaussian Splat file.");
      }
    };

    void load();

    return () => {
      disposed = true;
      if (frameHandle !== null) {
        cancelAnimationFrame(frameHandle);
      }
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
    };
  }, [assetType, modelUrl]);

  return (
    <div ref={containerRef} className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-champagne/55 bg-transparent shadow-luxe sm:h-[560px]">
      {isSketchfabEmbed ? (
        <>
          <iframe
            title="Bridal 3D Prototype"
            src={`${modelUrl}${modelUrl.includes("?") ? "&" : "?"}ui_infos=0&ui_watermark_link=0`}
            className="h-full w-full"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
          />
          <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-ivory">
            3D Prototype
          </div>
        </>
      ) : null}

      {!isSketchfabEmbed ? (
        <>
      <motion.div
        initial={false}
        animate={{ opacity: isRendered ? 1 : 0 }}
        transition={{ duration: 0.85, ease: [0.21, 0.61, 0.35, 1] }}
        className="h-full w-full"
      >
        <canvas ref={canvasRef} className="h-full w-full bg-transparent" />
      </motion.div>

      {isLoading ? (
        <div className="absolute inset-x-6 bottom-6 rounded-xl border border-champagne/70 bg-[#fffaf2]/88 p-3 backdrop-blur">
          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-charcoal/75">
            <span>Loading Splat</span>
            <span>{loadingPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-champagne/35">
            <div className="h-full rounded-full bg-charcoal transition-[width] duration-300" style={{ width: `${loadingPercent}%` }} />
          </div>
        </div>
      ) : null}

      {loadError ? (
        <div className="absolute inset-x-6 top-6 rounded-xl border border-red-300 bg-white/92 p-3 text-sm text-red-700">
          {loadError}
        </div>
      ) : null}
        </>
      ) : null}
    </div>
  );
};
