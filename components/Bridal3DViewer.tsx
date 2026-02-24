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

class BridalMaterialPass extends SPLAT.ShaderPass {
  private program: SPLAT.ShaderProgram | null = null;
  private gl: WebGL2RenderingContext | null = null;
  private alphaTestUniform: WebGLUniformLocation | null = null;
  private shinePhaseUniform: WebGLUniformLocation | null = null;
  private shineStrengthUniform: WebGLUniformLocation | null = null;
  private shinePowerUniform: WebGLUniformLocation | null = null;

  constructor(
    private readonly alphaTest: number,
    private readonly shineStrength: number,
    private readonly shinePower: number
  ) {
    super();
  }

  initialize(program: SPLAT.ShaderProgram) {
    this.program = program;
    this.gl = program.renderer.gl;
    this.alphaTestUniform = this.gl.getUniformLocation(program.program, "uAlphaTest");
    this.shinePhaseUniform = this.gl.getUniformLocation(program.program, "uShinePhase");
    this.shineStrengthUniform = this.gl.getUniformLocation(program.program, "uShineStrength");
    this.shinePowerUniform = this.gl.getUniformLocation(program.program, "uShinePower");
  }

  render() {
    if (!this.gl || !this.program) {
      return;
    }

    const gl = this.gl;
    gl.useProgram(this.program.program);

    // Keep depth writes disabled for translucent splats, then use alpha test in shader.
    gl.depthMask(false);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.ONE_MINUS_DST_ALPHA, gl.ONE, gl.ONE_MINUS_DST_ALPHA, gl.ONE);

    const forward = this.program.camera?.forward;
    const cameraPhase = forward ? forward.x * 0.33 + forward.y * 0.62 + forward.z : 0;
    const shinePhase = performance.now() * 0.001 + cameraPhase * 3;

    if (this.alphaTestUniform) {
      gl.uniform1f(this.alphaTestUniform, this.alphaTest);
    }
    if (this.shinePhaseUniform) {
      gl.uniform1f(this.shinePhaseUniform, shinePhase);
    }
    if (this.shineStrengthUniform) {
      gl.uniform1f(this.shineStrengthUniform, this.shineStrength);
    }
    if (this.shinePowerUniform) {
      gl.uniform1f(this.shinePowerUniform, this.shinePower);
    }
  }

  dispose() {
    if (this.gl) {
      this.gl.depthMask(true);
    }
    this.program = null;
    this.gl = null;
  }
}

class BridalShineRenderProgram extends SPLAT.RenderProgram {
  protected _getFragmentSource() {
    return `#version 300 es
precision highp float;

uniform float outlineThickness;
uniform vec4 outlineColor;
uniform float uAlphaTest;
uniform float uShinePhase;
uniform float uShineStrength;
uniform float uShinePower;

in vec4 vColor;
in vec2 vPosition;
in float vSize;
in float vSelected;

out vec4 fragColor;

float sparkleNoise(vec2 uv, float phase) {
    return fract(sin(dot(uv + vec2(phase, phase * 0.37), vec2(12.9898, 78.233))) * 43758.5453123);
}

vec4 shadeSplat(vec4 color, float gaussianWeight) {
    float alpha = gaussianWeight * clamp(color.a, 0.0, 1.0);

    // Critical for translucent tulle/veil rendering:
    // alpha test trims tiny low-energy splats while depth writes remain disabled.
    if (alpha < uAlphaTest) {
        discard;
    }

    vec3 rgb = gaussianWeight * color.rgb;
    vec2 sparkleUv = gl_FragCoord.xy * 0.015 + vPosition * 2.25;
    float sparkleMask = pow(sparkleNoise(sparkleUv, uShinePhase), uShinePower);
    float edgeBoost = smoothstep(0.2, 1.0, 1.0 - abs(vPosition.x * vPosition.y));
    vec3 shine = vec3(1.0, 0.97, 0.92) * sparkleMask * edgeBoost * uShineStrength * alpha;

    return vec4(rgb + shine, alpha);
}

void main () {
    float A = -dot(vPosition, vPosition);
    if (A < -4.0) discard;

    float gaussianWeight = exp(A);

    if (vSelected < 0.5) {
        fragColor = shadeSplat(vColor, gaussianWeight);
        return;
    }

    float outlineThreshold = -4.0 + (outlineThickness / max(vSize, 0.0001));
    if (A < outlineThreshold) {
        fragColor = outlineColor;
        return;
    }

    fragColor = shadeSplat(vColor, gaussianWeight);
}
`;
  }
}

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

    const materialPass = new BridalMaterialPass(0.02, 0.28, 10);
    const renderPasses = [new SPLAT.FadeInPass(1.4), materialPass];
    const renderer = new SPLAT.WebGLRenderer(canvas, renderPasses);
    renderer.backgroundColor = new SPLAT.Color32(0, 0, 0, 0);

    const customProgram = new BridalShineRenderProgram(renderer, renderPasses);
    renderer.removeProgram(renderer.renderProgram);
    renderer.renderProgram.dispose();
    renderer.addProgram(customProgram);

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
      const tick = () => {
        if (disposed) {
          return;
        }
        controls.update();
        renderer.render(scene, camera);

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
            ? await SPLAT.PLYLoader.LoadAsync(modelUrl, scene, onProgress, "", true)
            : await SPLAT.Loader.LoadAsync(modelUrl, scene, onProgress, true);

        if (disposed) {
          return;
        }

        setLoadingPercent(100);
        const bounds = splat.bounds;
        const center = bounds.center();
        const size = bounds.size();
        const radius = Math.max(size.x, size.y, size.z, 1);

        controls.setCameraTarget(center);
        controls.minZoom = Math.max(0.9, radius * 0.25);
        controls.maxZoom = Math.max(12, radius * 8);
        camera.position = new SPLAT.Vector3(center.x, center.y + radius * 0.24, center.z + radius * 1.7);

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
