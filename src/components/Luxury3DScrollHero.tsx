import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { motion, AnimatePresence } from 'motion/react';
import { LiveMarketRates } from '../types';
import { formatNumberFa } from '../mockData';
import { ArrowDown } from 'lucide-react';

interface Luxury3DScrollHeroProps {
  rates: LiveMarketRates;
  onExploreCatalog: (category?: 'all' | 'jewelry_18k' | 'bullion_24k' | 'coin') => void;
  onOpenInstallmentGuide: () => void;
  onOpenBranchesModal: () => void;
}

// Pre-allocated math helpers outside render loop (Zero-GC rule)
const _targetCameraPos = new THREE.Vector3();

export const Luxury3DScrollHero: React.FC<Luxury3DScrollHeroProps> = ({
  rates,
  onExploreCatalog,
  onOpenInstallmentGuide,
  onOpenBranchesModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<number>(0);
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const activeChapterRef = useRef<number>(1);
  const [activeChapter, setActiveChapter] = React.useState<number>(1);

  useEffect(() => {
    const mountEl = canvasMountRef.current;
    if (!mountEl) return;

    // 1. Software WebGL detection
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Scene, Fog & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x051f18); // Deep Royal Emerald-Obsidian
    scene.fog = new THREE.FogExp2(0x051f18, 0.045);

    const camera = new THREE.PerspectiveCamera(
      45,
      mountEl.clientWidth / mountEl.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 11);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mountEl.clientWidth, mountEl.clientHeight);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountEl.appendChild(renderer.domElement);

    // 4. Studio Environment Map (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Controlled Rich Gold Studio Lighting Rig (no harsh washout)
    const hemiLight = new THREE.HemisphereLight(0xffe082, 0x2b1700, 0.75);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffb700, 1.5);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const frontWarmLight = new THREE.DirectionalLight(0xd99b26, 0.9);
    frontWarmLight.position.set(-5, 3, 7);
    scene.add(frontWarmLight);

    const fillLight = new THREE.DirectionalLight(0xb87700, 0.7);
    fillLight.position.set(-6, -5, 4);
    scene.add(fillLight);

    const rimLight = new THREE.SpotLight(0xffaa00, 1.6, 30, Math.PI / 3, 0.5);
    rimLight.position.set(0, 6, -6);
    scene.add(rimLight);

    // 6. Deep Saturated 24K / 18K Royal Gold PBR Materials
    const polishedGoldMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xd49b27), // Deep rich royal gold (prevents pale washout under light)
      emissive: new THREE.Color(0x241300),
      emissiveIntensity: 0.12,
      metalness: 0.98,
      roughness: 0.18,
      clearcoat: 0.35,
      clearcoatRoughness: 0.15,
      reflectivity: 0.9,
      specularIntensity: 0.75,
      specularColor: new THREE.Color(0xffc845),
      envMapIntensity: 1.15,
    });

    const brushedGoldMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xc58b1e),
      emissive: new THREE.Color(0x1f1000),
      emissiveIntensity: 0.1,
      metalness: 0.96,
      roughness: 0.28,
      anisotropy: 0.65,
      clearcoat: 0.25,
      envMapIntensity: 1.0,
    });

    const darkEmeraldStoneMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x0b3b2e),
      metalness: 0.15,
      roughness: 0.08,
      transmission: isSoftwareGl ? 0 : 0.7,
      transparent: true,
      opacity: isSoftwareGl ? 0.9 : 1.0,
      ior: 1.65,
      thickness: 1.4,
      clearcoat: 1.0,
      envMapIntensity: 1.8,
    });

    const diamondCrystalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf8fafc),
      metalness: 0.05,
      roughness: 0.02,
      transmission: isSoftwareGl ? 0 : 0.92,
      transparent: true,
      opacity: isSoftwareGl ? 0.85 : 1.0,
      ior: 2.4,
      thickness: 2.0,
      clearcoat: 1.0,
      envMapIntensity: 2.5,
    });

    // 7. Ambient Golden Dust Field (InstancedMesh)
    const particleCount = 120;
    const particleGeo = new THREE.OctahedronGeometry(0.035, 0);
    const particleMat = new THREE.MeshStandardMaterial({
      color: 0xffe484,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x8f6800,
      emissiveIntensity: 0.6,
    });
    const particleSystem = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    const dummyMatrix = new THREE.Matrix4();
    const dummyPos = new THREE.Vector3();
    const dummyScale = new THREE.Vector3();
    const dummyQuat = new THREE.Quaternion();

    for (let i = 0; i < particleCount; i++) {
      dummyPos.set(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 10 - 2
      );
      const s = 0.5 + Math.random() * 1.2;
      dummyScale.set(s, s, s);
      dummyQuat.setFromEuler(new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0));
      dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
      particleSystem.setMatrixAt(i, dummyMatrix);
    }
    particleSystem.instanceMatrix.needsUpdate = true;
    particleSystem.computeBoundingSphere();
    scene.add(particleSystem);

    // =========================================================================
    // COMPOSITE 3D MODELS FOR EACH SCROLL CHAPTER
    // =========================================================================
    const stlLoader = new STLLoader();

    // CHAPTER 1: Twin Sculptural Gold Rings (Split from assets/ring2.stl)
    const chapter1Group = new THREE.Group();
    scene.add(chapter1Group);

    // Left Ring Container (Men's / Larger Ring or Left Split)
    const leftBangleGroup = new THREE.Group();
    leftBangleGroup.position.set(-3.3, 0.25, 0.6);
    leftBangleGroup.rotation.set(0.5, 0.6, -0.3);
    chapter1Group.add(leftBangleGroup);

    // Right Ring Container (Women's / Smaller Ring or Right Split)
    const rightBangleGroup = new THREE.Group();
    rightBangleGroup.position.set(3.3, -0.25, 0.6);
    rightBangleGroup.rotation.set(-0.4, -0.7, 0.4);
    chapter1Group.add(rightBangleGroup);

    // Subtle Center Orbital Filigree Ring
    const centerHaloGeo = new THREE.TorusGeometry(3.2, 0.015, 16, 100);
    const centerHalo = new THREE.Mesh(centerHaloGeo, brushedGoldMat);
    centerHalo.rotation.x = Math.PI / 2.3;
    chapter1Group.add(centerHalo);

    // Load & Automatically Split ring2.stl into two independent 3D rings!
    const ring2StlUrl = `${import.meta.env.BASE_URL || './'}assets/ring2.stl`.replace('//', '/');
    stlLoader.load(
      ring2StlUrl,
      (fullRingGeo) => {
        const posAttr = fullRingGeo.attributes.position;
        const vertexCount = posAttr.count;
        const leftPositions: number[] = [];
        const rightPositions: number[] = [];

        // Split triangles based on centroid X (gap is around X = 0.03)
        for (let i = 0; i < vertexCount; i += 3) {
          const x1 = posAttr.getX(i), y1 = posAttr.getY(i), z1 = posAttr.getZ(i);
          const x2 = posAttr.getX(i + 1), y2 = posAttr.getY(i + 1), z2 = posAttr.getZ(i + 1);
          const x3 = posAttr.getX(i + 2), y3 = posAttr.getY(i + 2), z3 = posAttr.getZ(i + 2);
          const cx = (x1 + x2 + x3) / 3;

          if (cx < 0.03) {
            leftPositions.push(x1, y1, z1, x2, y2, z2, x3, y3, z3);
          } else {
            rightPositions.push(x1, y1, z1, x2, y2, z2, x3, y3, z3);
          }
        }

        if (leftPositions.length > 0 && rightPositions.length > 0) {
          const leftGeo = new THREE.BufferGeometry();
          leftGeo.setAttribute('position', new THREE.Float32BufferAttribute(leftPositions, 3));
          leftGeo.computeVertexNormals();
          leftGeo.center();
          leftGeo.computeBoundingBox();

          const rightGeo = new THREE.BufferGeometry();
          rightGeo.setAttribute('position', new THREE.Float32BufferAttribute(rightPositions, 3));
          rightGeo.computeVertexNormals();
          rightGeo.center();
          rightGeo.computeBoundingBox();

          // Compute shared scale so their relative size difference (men's vs women's) is preserved!
          const sizeL = new THREE.Vector3();
          const sizeR = new THREE.Vector3();
          leftGeo.boundingBox?.getSize(sizeL);
          rightGeo.boundingBox?.getSize(sizeR);
          const maxOverallDim = Math.max(sizeL.x, sizeL.y, sizeL.z, sizeR.x, sizeR.y, sizeR.z);
          const sharedScale = maxOverallDim > 0 ? 3.85 / maxOverallDim : 1;

          const leftCustomRing = new THREE.Mesh(leftGeo, polishedGoldMat);
          leftCustomRing.scale.setScalar(sharedScale);

          const rightCustomRing = new THREE.Mesh(rightGeo, polishedGoldMat);
          rightCustomRing.scale.setScalar(sharedScale);

          leftBangleGroup.add(leftCustomRing);
          rightBangleGroup.add(rightCustomRing);
        }
      },
      undefined,
      (err) => {
        console.warn('Could not load ring2.stl, keeping fallback rings:', err);
      }
    );

    // CHAPTER 2: Custom User Uploaded 3D Gold Model (assets/gold2.stl)
    const chapter2Group = new THREE.Group();
    chapter2Group.position.set(0, -10, 0);
    scene.add(chapter2Group);

    // Load the user's real CAD jewelry STL file (public/assets/gold2.stl)
    const stlUrl = `${import.meta.env.BASE_URL || './'}assets/gold2.stl`.replace('//', '/');
    stlLoader.load(
      stlUrl,
      (stlGeometry) => {
        stlGeometry.computeVertexNormals();
        stlGeometry.center();
        stlGeometry.computeBoundingBox();

        const bbox = stlGeometry.boundingBox;
        let normalizeScale = 1;
        if (bbox) {
          const size = new THREE.Vector3();
          bbox.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            // Normalize model to fit nicely at ~4.4 world units in the stage
            normalizeScale = 4.4 / maxDim;
          }
        }

        const customGoldMesh = new THREE.Mesh(stlGeometry, polishedGoldMat);
        customGoldMesh.scale.setScalar(normalizeScale);
        // Most jewelry CAD (Matrix/Rhino) STL models are Z-up; tilt slightly towards camera
        customGoldMesh.rotation.x = -Math.PI / 6;

        chapter2Group.add(customGoldMesh);
      },
      undefined,
      (err) => {
        console.warn('Could not load gold2.stl, keeping fallback geometry:', err);
      }
    );

    // CHAPTER 3: 24K Swiss Gold Bullion Bar Assembly (Beveled Ingot + Seal Frame + Stamps)
    const chapter3Group = new THREE.Group();
    chapter3Group.position.set(0, -10, 0);
    scene.add(chapter3Group);

    // Extruded Beveled Gold Bar
    const barShape = new THREE.Shape();
    const bw = 1.9;
    const bh = 3.1;
    const br = 0.22;
    barShape.moveTo(-bw / 2 + br, -bh / 2);
    barShape.lineTo(bw / 2 - br, -bh / 2);
    barShape.quadraticCurveTo(bw / 2, -bh / 2, bw / 2, -bh / 2 + br);
    barShape.lineTo(bw / 2, bh / 2 - br);
    barShape.quadraticCurveTo(bw / 2, bh / 2, bw / 2 - br, bh / 2);
    barShape.lineTo(-bw / 2 + br, bh / 2);
    barShape.quadraticCurveTo(-bw / 2, bh / 2, -bw / 2, bh / 2 - br);
    barShape.lineTo(-bw / 2, -bh / 2 + br);
    barShape.quadraticCurveTo(-bw / 2, -bh / 2, -bw / 2 + br, -bh / 2);

    const barExtrudeGeo = new THREE.ExtrudeGeometry(barShape, {
      depth: 0.38,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    });
    barExtrudeGeo.center();
    const mainBullionMesh = new THREE.Mesh(barExtrudeGeo, polishedGoldMat);
    chapter3Group.add(mainBullionMesh);

    // Embossed Stamp Plate on Front
    const stampPlateGeo = new THREE.BoxGeometry(1.4, 2.3, 0.04);
    const stampPlateMesh = new THREE.Mesh(stampPlateGeo, brushedGoldMat);
    stampPlateMesh.position.z = 0.26;
    chapter3Group.add(stampPlateMesh);

    // Circular Assay Medallion on Bullion
    const medallionGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.06, 32);
    medallionGeo.rotateX(Math.PI / 2);
    const medallionMesh = new THREE.Mesh(medallionGeo, polishedGoldMat);
    medallionMesh.position.set(0, 0.45, 0.28);
    chapter3Group.add(medallionMesh);

    // Emerald Certicard Outer Frame
    const frameRingGeo = new THREE.TorusGeometry(2.3, 0.05, 24, 64);
    const frameRing = new THREE.Mesh(frameRingGeo, polishedGoldMat);
    chapter3Group.add(frameRing);

    // CHAPTER 4: Persian Emami Gold Coin (Reeded Edge + Relief + Halo)
    const chapter4Group = new THREE.Group();
    chapter4Group.position.set(0, -10, 0);
    scene.add(chapter4Group);

    const coinDiscGeo = new THREE.CylinderGeometry(1.85, 1.85, 0.18, 64);
    coinDiscGeo.rotateX(Math.PI / 2);
    const coinDiscMesh = new THREE.Mesh(coinDiscGeo, brushedGoldMat);
    chapter4Group.add(coinDiscMesh);

    const coinRimGeo = new THREE.TorusGeometry(1.85, 0.11, 24, 96);
    const coinRimMesh = new THREE.Mesh(coinRimGeo, polishedGoldMat);
    chapter4Group.add(coinRimMesh);

    const innerReliefGeo = new THREE.TorusGeometry(1.42, 0.04, 16, 64);
    const innerReliefMesh = new THREE.Mesh(innerReliefGeo, polishedGoldMat);
    innerReliefMesh.position.z = 0.1;
    chapter4Group.add(innerReliefMesh);

    const centerEmblemGeo = new THREE.OctahedronGeometry(0.65, 1);
    centerEmblemGeo.scale(1, 1, 0.25);
    const centerEmblemMesh = new THREE.Mesh(centerEmblemGeo, polishedGoldMat);
    centerEmblemMesh.position.z = 0.08;
    chapter4Group.add(centerEmblemMesh);

    // CHAPTER 5: Custom User Uploaded 3D Gold Model (assets/foot.stl)
    const chapter5Group = new THREE.Group();
    chapter5Group.position.set(0, -10, 0);
    scene.add(chapter5Group);

    const footStlUrl = `${import.meta.env.BASE_URL || './'}assets/foot.stl`.replace('//', '/');
    stlLoader.load(
      footStlUrl,
      (footGeometry) => {
        footGeometry.computeVertexNormals();
        footGeometry.center();
        footGeometry.computeBoundingBox();

        const bbox = footGeometry.boundingBox;
        let normalizeScale = 1;
        if (bbox) {
          const size = new THREE.Vector3();
          bbox.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            normalizeScale = 4.2 / maxDim;
          }
        }

        const customFootMesh = new THREE.Mesh(footGeometry, polishedGoldMat);
        customFootMesh.scale.setScalar(normalizeScale);
        customFootMesh.rotation.x = -Math.PI / 6;

        chapter5Group.add(customFootMesh);
      },
      undefined,
      (err) => {
        console.warn('Could not load foot.stl, keeping fallback geometry:', err);
      }
    );

    // Pre-compile shaders
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 8. Scroll & Mouse Event Listeners
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;
      const currentScrolled = -rect.top;
      const progress = THREE.MathUtils.clamp(currentScrolled / totalScrollable, 0, 1);
      scrollProgressRef.current = progress;

      // Determine active chapter (1 to 5)
      const chap = Math.min(5, Math.max(1, Math.floor(progress * 4.99) + 1));
      if (chap !== activeChapterRef.current) {
        activeChapterRef.current = chap;
        setActiveChapter(chap);
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    // Responsive mobile detection & scale calculation
    let isMobile = false;
    let responsiveScale = 1.0;
    let baseCameraZ = 11.0;
    let ringSpacingX = 3.3;

    const updateResponsiveParams = () => {
      if (!mountEl) return;
      const w = mountEl.clientWidth;
      const h = mountEl.clientHeight;
      const aspect = w / h;

      // Detect mobile screens or portrait orientations
      isMobile = w < 768 || aspect < 0.85;

      if (isMobile) {
        // Dynamic scale factor based on screen aspect ratio
        responsiveScale = Math.min(0.65, Math.max(0.42, aspect * 1.1));
        // On mobile, camera moves slightly back to give comfortable breathing room
        baseCameraZ = 13.0;
        // The two luxury rings in chapter 1 come closer to center so neither overflows
        ringSpacingX = Math.min(1.4, Math.max(1.0, aspect * 2.6));
      } else {
        responsiveScale = 1.0;
        baseCameraZ = 11.0;
        ringSpacingX = 3.3;
      }

      // Apply scale to all 5 3D chapters
      chapter1Group.scale.setScalar(responsiveScale);
      chapter2Group.scale.setScalar(responsiveScale);
      chapter3Group.scale.setScalar(responsiveScale);
      chapter4Group.scale.setScalar(responsiveScale);
      chapter5Group.scale.setScalar(responsiveScale);

      // Adjust rings spacing
      leftBangleGroup.position.x = -ringSpacingX;
      rightBangleGroup.position.x = ringSpacingX;
    };

    const handleResize = () => {
      if (!mountEl) return;
      const w = mountEl.clientWidth;
      const h = mountEl.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      updateResponsiveParams();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('resize', handleResize);
    handleScroll();
    updateResponsiveParams();

    // 9. Animation Loop with Smooth Exponential Damping
    const clock = new THREE.Clock();
    let frameId = 0;
    let smoothedProgress = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      smoothedProgress = THREE.MathUtils.damp(
        smoothedProgress,
        scrollProgressRef.current,
        4.5,
        delta
      );

      // Subtle camera parallax with pointer
      _targetCameraPos.set(
        pointerRef.current.x * (isMobile ? 0.2 : 0.45),
        pointerRef.current.y * (isMobile ? 0.15 : 0.35),
        baseCameraZ
      );
      camera.position.lerp(_targetCameraPos, 0.05);
      camera.lookAt(0, 0, 0);

      // Rotate ambient particles slowly
      particleSystem.rotation.y = elapsed * 0.04 + smoothedProgress * 1.2;
      particleSystem.rotation.x = smoothedProgress * 0.6;

      // Continuous sculptural rotation + scroll choreography for each 3D chapter
      // Continuous normalized phase: s in [0, 4] across 5 chapters
      const s = smoothedProgress * 4.0;
      const chapterSpacing = isMobile ? 11.0 : 9.5;

      // Chapter 1: Twin Split Gold Rings (s = 0..1) - Independent organic 3D rotation & float
      const c1Offset = (0 - s) * chapterSpacing;
      chapter1Group.position.y = c1Offset;
      leftBangleGroup.position.y = 0.25 + Math.sin(elapsed * 0.9) * 0.22;
      leftBangleGroup.rotation.x = 0.55 + elapsed * 0.42 + s * 2.1;
      leftBangleGroup.rotation.y = 0.65 + elapsed * 0.31 - s * 1.4;
      leftBangleGroup.rotation.z = -0.3 + Math.cos(elapsed * 0.6) * 0.25;

      rightBangleGroup.position.y = -0.25 + Math.cos(elapsed * 0.8 + 1.2) * 0.22;
      rightBangleGroup.rotation.x = -0.45 - elapsed * 0.36 - s * 1.9;
      rightBangleGroup.rotation.y = -0.75 + elapsed * 0.48 + s * 1.7;
      rightBangleGroup.rotation.z = 0.4 + Math.sin(elapsed * 0.55) * 0.28;

      centerHalo.rotation.z = elapsed * 0.15;
      chapter1Group.visible = Math.abs(0 - s) < 1.35;

      // Chapter 2: Cartier Helix Chain (s = 1)
      const c2Offset = (1 - s) * chapterSpacing;
      chapter2Group.position.y = c2Offset;
      chapter2Group.rotation.y = elapsed * 0.6 + s * 2.5;
      chapter2Group.rotation.z = Math.sin(elapsed * 0.5) * 0.12;
      chapter2Group.visible = Math.abs(1 - s) < 1.35;

      // Chapter 3: 24K Bullion Ingot (s = 2)
      const c3Offset = (2 - s) * chapterSpacing;
      chapter3Group.position.y = c3Offset;
      chapter3Group.rotation.y = Math.sin(elapsed * 0.65) * 0.55 + (s - 2) * 1.5;
      chapter3Group.rotation.x = Math.cos(elapsed * 0.45) * 0.18;
      frameRing.rotation.z = -elapsed * 0.3;
      chapter3Group.visible = Math.abs(2 - s) < 1.35;

      // Chapter 4: Persian Gold Coin (s = 3)
      const c4Offset = (3 - s) * chapterSpacing;
      chapter4Group.position.y = c4Offset;
      chapter4Group.rotation.y = elapsed * 0.75 + (s - 3) * 2.2;
      chapter4Group.rotation.x = Math.sin(elapsed * 0.5) * 0.2;
      chapter4Group.visible = Math.abs(3 - s) < 1.35;

      // Chapter 5: Custom Foot Gold Model (s = 4)
      const c5Offset = (4 - s) * chapterSpacing;
      chapter5Group.position.y = c5Offset;
      chapter5Group.rotation.y = elapsed * 0.55;
      chapter5Group.visible = Math.abs(4 - s) < 1.35;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mountEl.contains(renderer.domElement)) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, []);

  const scrollToChapter = (chapterIndex: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerTop = window.scrollY + rect.top;
    const totalScrollable = rect.height - window.innerHeight;
    const targetScroll = containerTop + ((chapterIndex - 1) / 4) * totalScrollable;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  const heroChapters = [
    {
      num: '01',
      overline: '۰۱ · خزانه سلطنتی طلا و جواهر اهواز',
      titleLine1: 'درخشش ابدی اصالت،',
      titleLine2: 'در تلالو طلای ناب خلیلاوی',
      description:
        'تلفیق هنر دست استادکاران جواهرسازی با اصالت طلای ۱۸ عیار، شمش‌های استاندارد سوئیسی و مسکوکات بانکی در قلب بازار نادری اهواز.',
      primaryAction: {
        label: 'ورود به ویترین کلکسیون‌ها ←',
        onClick: () => onExploreCatalog('all'),
      },
      secondaryAction: {
        label: 'شرایط خرید اقساطی',
        onClick: onOpenInstallmentGuide,
      },
    },
    {
      num: '02',
      overline: '۰۲ · ظرافت بی‌مرز در طلای ۱۸ عیار',
      titleLine1: 'تراش‌های الماسی؛',
      titleLine2: 'شکوهِ هنر دست‌ساز و ماندگار',
      description:
        'خلق ظریف‌ترین سرویس‌های مجلسی، النگو و زنجیرهای طلای استاندارد ۷۵۰ با درخشش خیره‌کننده و تاییدیه رسمی ری‌گیری اتحادیه.',
      primaryAction: {
        label: 'مشاهده کلکسیون طلای ۱۸ عیار ←',
        onClick: () => onExploreCatalog('jewelry_18k'),
      },
    },
    {
      num: '03',
      overline: '۰۳ · خلوص مطلق ۹۹۹.۹ بین‌المللی',
      titleLine1: 'پشتوانه‌ای زرین،',
      titleLine2: 'برای آینده‌ای امن و مطمئن',
      description:
        'عرضه مستقیم شمش‌های پلمپ ۲۴ عیار استاندارد و گلدیس با هولوگرام امنیتی، معاف از مالیات بر ارزش افزوده و با تضمین بازخرید نقدی آنی.',
      primaryAction: {
        label: 'مشاهده شمش‌های ۲۴ عیار ←',
        onClick: () => onExploreCatalog('bullion_24k'),
      },
    },
    {
      num: '04',
      overline: '۰۴ · اصالت ضرب بانک مرکزی',
      titleLine1: 'گنجینه مسکوکات؛',
      titleLine2: 'اعتبار و نقدشوندگی در لحظه',
      description:
        'معاملات امن و شفاف انواع سکه تمام بهار آزادی امامی، نیم، ربع و سکه پارسیان با پلمپ معتبر وکیوم در شعبه تخصصی شمش و سکه خلیلاوی.',
      primaryAction: {
        label: 'مشاهده مسکوکات و سکه بانکی ←',
        onClick: () => onExploreCatalog('coin'),
      },
    },
    {
      num: '05',
      overline: '۰۵ · کلکسیون‌های خاص و تسهیلات ویژه',
      titleLine1: 'رویای طلایی شما،',
      titleLine2: 'با شرایط اقساطی آسان و محترمانه',
      description:
        'تجربه خرید دلخواهترین مصنوعات طلا و جواهر با اقساط ۳ تا ۱۲ ماهه؛ با ضمانت چک صیادی یا امانت‌گذاری طلا در دو شعبه حضوری اهواز.',
      primaryAction: {
        label: 'مشاهده ویترین و ثبت سفارش ←',
        onClick: () => onExploreCatalog('all'),
      },
      secondaryAction: {
        label: 'نشانی شعب حضوری اهواز',
        onClick: onOpenBranchesModal,
      },
    },
  ];

  const currentChapterData = heroChapters[activeChapter - 1] || heroChapters[0];

  const chapterContainerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.13,
        delayChildren: 0.04,
      },
    },
    exit: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        staggerDirection: 1,
      },
    },
  };

  const chapterItemVariants = {
    hidden: {
      opacity: 0,
      y: 42,
      filter: 'blur(8px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.68,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      y: -46,
      filter: 'blur(6px)',
      transition: {
        duration: 0.36,
        ease: [0.4, 0, 1, 1] as const,
      },
    },
  };

  return (
    <div id="hero-3d-section" ref={containerRef} className="relative w-full h-[460vh] bg-[#051F18] text-[#FAF7F2] select-none">
      {/* Sticky Full-Screen 3D WebGL Canvas Stage (100vh edge-to-edge) */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        
        {/* Dedicated WebGL Mount Container */}
        <div ref={canvasMountRef} className="absolute inset-0 w-full h-full" />

        {/* Subtle Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(5,31,24,0.75)_100%)] pointer-events-none" />

        {/* Soft Boxless Atmospheric Backdrop Behind Center Typography for Crisp Legibility */}
        <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(5,31,24,0.62)_0%,transparent_85%)] pointer-events-none" />

        {/* CENTERED BOXLESS EDITORIAL TYPOGRAPHY (Staggered Fade-In-Up & Fade-Out-Up) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-8 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChapter}
              variants={chapterContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-3xl mx-auto text-center space-y-3.5 sm:space-y-6 pointer-events-auto px-2"
            >
              {/* 1. Chapter Overline */}
              <motion.div
                variants={chapterItemVariants}
                className="inline-flex items-center gap-2.5 text-[11px] sm:text-sm font-bold tracking-normal text-[#E6C987] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
              >
                <span className="text-[#C5A059]">✦</span>
                <span>{currentChapterData.overline}</span>
                <span className="text-[#C5A059]">✦</span>
              </motion.div>

              {/* 2. Main Title Line 1 */}
              <motion.h1
                variants={chapterItemVariants}
                className="font-persian-title text-2xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF7] via-[#F5E0B5] to-[#C5A059] leading-tight py-1 drop-shadow-[0_6px_28px_rgba(0,0,0,0.9)]"
              >
                {currentChapterData.titleLine1}
              </motion.h1>

              {/* 3. Main Title Line 2 */}
              <motion.div
                variants={chapterItemVariants}
                className="font-persian-title font-extrabold text-lg sm:text-4xl lg:text-5xl text-white leading-snug drop-shadow-[0_6px_28px_rgba(0,0,0,0.9)]"
              >
                {currentChapterData.titleLine2}
              </motion.div>

              {/* 4. Poetic Description */}
              <motion.p
                variants={chapterItemVariants}
                className="font-persian-title text-xs sm:text-sm lg:text-base text-[#D4E2DC] max-w-xl mx-auto leading-relaxed font-medium drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] line-clamp-3 sm:line-clamp-none px-2"
              >
                {currentChapterData.description}
              </motion.p>

              {/* 5. Action Buttons */}
              <motion.div
                variants={chapterItemVariants}
                className="pt-3 flex flex-wrap items-center justify-center gap-4"
              >
                <button
                  onClick={currentChapterData.primaryAction.onClick}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#DFBF76] via-[#C5A059] to-[#A67F32] text-[#051F18] font-extrabold text-xs sm:text-sm tracking-wide hover:brightness-110 transition-all cursor-pointer shadow-[0_10px_30px_rgba(197,160,89,0.35)] min-h-[46px]"
                >
                  {currentChapterData.primaryAction.label}
                </button>
                {currentChapterData.secondaryAction && (
                  <button
                    onClick={currentChapterData.secondaryAction.onClick}
                    className="px-7 py-3.5 rounded-full border border-[#E6C987]/60 bg-[#051F18]/50 backdrop-blur-xs text-[#F7E7C4] font-bold text-xs sm:text-sm hover:border-[#E6C987] hover:bg-[#0B3B2E]/80 transition-all cursor-pointer min-h-[46px]"
                  >
                    {currentChapterData.secondaryAction.label}
                  </button>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Zalore-Inspired Fixed HUD Frame Overlay (padded below transparent header) */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between pt-28 sm:pt-34 pb-20 md:pb-8 px-5 sm:px-10 z-20">
          
          {/* Top HUD Bar */}
          <div className="flex items-center justify-between text-[11px] tracking-widest uppercase text-[#C5A059]">
            <div className="font-brand text-sm sm:text-base tracking-[0.25em] font-semibold">
              KHALILAVI ROYAL ATELIER
            </div>
            <div className="hidden sm:flex items-center gap-6 text-[#A3B8B0]">
              <span>18K FINE JEWELRY</span>
              <span>·</span>
              <span>24K SWISS BULLION</span>
              <span>·</span>
              <span>CENTRAL BANK COINS</span>
            </div>
          </div>

          {/* Left / Right Side Chapter Scrubber Bars */}
          <div className="hidden md:flex flex-col items-center gap-3 absolute left-8 top-1/2 -translate-y-1/2 pointer-events-auto">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => scrollToChapter(num)}
                className="group py-1.5 px-2 flex items-center gap-2 cursor-pointer focus:outline-hidden"
                title={`بخش ۰${formatNumberFa(num)}`}
              >
                <span
                  className={`block h-0.5 transition-all duration-300 ${
                    activeChapter === num
                      ? 'w-8 bg-[#E6C987]'
                      : 'w-3 bg-[#C5A059]/35 group-hover:w-5 group-hover:bg-[#C5A059]'
                  }`}
                />
                <span
                  className={`font-brand text-xs transition-opacity ${
                    activeChapter === num ? 'opacity-100 text-[#E6C987] font-bold' : 'opacity-0 group-hover:opacity-70 text-[#C5A059]'
                  }`}
                >
                  0{num}
                </span>
              </button>
            ))}
          </div>

          {/* Bottom HUD Counter & Scroll Prompt (18K live rate text removed as requested) */}
          <div className="flex items-end justify-between">
            <div className="font-brand text-sm sm:text-base tracking-widest text-[#E6C987]">
              <span className="font-bold text-white">0{activeChapter}</span>
              <span className="mx-1.5 text-[#C5A059]/50">/</span>
              <span className="text-[#C5A059]/70">05</span>
            </div>

            <button
              onClick={() => onExploreCatalog('all')}
              className="pointer-events-auto flex flex-col items-center gap-1.5 text-[10px] tracking-[0.2em] text-[#E6C987] hover:text-white transition-colors cursor-pointer group"
            >
              <span>اسکرول برای تماشای کلکسیون ۳ بعدی</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#C5A059] group-hover:translate-y-1 transition-transform" />
            </button>

            <div className="hidden sm:block w-12" />
          </div>
        </div>
      </div>
    </div>
  );
};
