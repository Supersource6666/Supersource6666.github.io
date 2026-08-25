import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const mount = document.querySelector("#vehicle-canvas");

if (mount) {
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(8.8, 5.2, 9.8);
    camera.lookAt(0, 0.9, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.setAttribute("aria-hidden", "true");
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xe8f3ff, 0x526f92, 2.5));
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.1);
    keyLight.position.set(5, 10, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x4a9dff, 3.0);
    rimLight.position.set(-7, 4, -6);
    scene.add(rimLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
    fillLight.position.set(0, 3, 8);
    scene.add(fillLight);

    const grid = new THREE.GridHelper(20, 40, 0x72aaf0, 0xc7dbf4);
    grid.material.transparent = true;
    grid.material.opacity = 0.44;
    scene.add(grid);

    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(8.5, 5.2),
      new THREE.ShadowMaterial({ color: 0x174f91, opacity: 0.18 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.012;
    shadow.receiveShadow = true;
    scene.add(shadow);

    const modelRoot = new THREE.Group();
    modelRoot.rotation.y = -0.58;
    scene.add(modelRoot);

    let targetYaw = -0.58;
    let targetPitch = 0.02;
    let dragging = false;
    let previousX = 0;
    let previousY = 0;
    let lastInteraction = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const loadingLabel = mount.querySelector(".vehicle-loading b");
    const loader = new GLTFLoader();
    loader.load(
      "./index_files/train.glb",
      (gltf) => {
        const model = gltf.scene;
        model.traverse((node) => {
          if (!node.isMesh) return;
          node.castShadow = true;
          node.receiveShadow = true;
          if (node.material) {
            const materials = Array.isArray(node.material) ? node.material : [node.material];
            materials.forEach((material) => {
              material.envMapIntensity = 0.85;
              material.needsUpdate = true;
            });
          }
        });

        const initialBox = new THREE.Box3().setFromObject(model);
        const initialSize = initialBox.getSize(new THREE.Vector3());
        const largestSide = Math.max(initialSize.x, initialSize.y, initialSize.z) || 1;
        model.scale.setScalar(8.2 / largestSide);

        const fittedBox = new THREE.Box3().setFromObject(model);
        const center = fittedBox.getCenter(new THREE.Vector3());
        model.position.set(-center.x, -fittedBox.min.y + 0.08, -center.z);
        modelRoot.add(model);
        mount.classList.add("vehicle-ready");
      },
      (event) => {
        if (!loadingLabel || !event.total) return;
        const percent = Math.min(99, Math.round((event.loaded / event.total) * 100));
        loadingLabel.textContent = `LOADING TRAIN.GLB · ${percent}%`;
      },
      (error) => {
        mount.classList.add("vehicle-no-webgl");
        const fallback = mount.querySelector(".vehicle-fallback");
        if (fallback) fallback.textContent = "train.glb 模型加载失败，请刷新页面重试。";
        console.warn("The train GLB model could not be loaded.", error);
      }
    );

    mount.addEventListener("pointerdown", (event) => {
      dragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      lastInteraction = performance.now();
      mount.setPointerCapture(event.pointerId);
    });
    mount.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      targetYaw += (event.clientX - previousX) * 0.009;
      targetPitch = THREE.MathUtils.clamp(targetPitch + (event.clientY - previousY) * 0.0035, -0.12, 0.16);
      previousX = event.clientX;
      previousY = event.clientY;
      lastInteraction = performance.now();
    });
    const stopDragging = () => { dragging = false; lastInteraction = performance.now(); };
    mount.addEventListener("pointerup", stopDragging);
    mount.addEventListener("pointercancel", stopDragging);
    mount.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      targetYaw += event.key === "ArrowLeft" ? -0.18 : 0.18;
      lastInteraction = performance.now();
    });

    const resize = () => {
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    renderer.setAnimationLoop((time) => {
      if (!reducedMotion && !dragging && time - lastInteraction > 5000) targetYaw += 0.0006;
      modelRoot.rotation.y += (targetYaw - modelRoot.rotation.y) * 0.075;
      modelRoot.rotation.x += (targetPitch - modelRoot.rotation.x) * 0.075;
      renderer.render(scene, camera);
    });

    window.addEventListener("pagehide", () => {
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);
      renderer.dispose();
    }, { once: true });
  } catch (error) {
    mount.classList.add("vehicle-no-webgl");
    console.warn("Three.js train preview could not start.", error);
  }
}
