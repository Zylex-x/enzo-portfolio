import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const canvas = document.querySelector("#hero-canvas");
const host = document.querySelector(".hero-visual");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && host && !reducedMotion) {
  try {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.z = 7;

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.IcosahedronGeometry(1.45, 5);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x9b4de8,
      metalness: 0.55,
      roughness: 0.22,
      transmission: 0.12,
      thickness: 1.2,
      clearcoat: 1,
      clearcoatRoughness: 0.15,
      emissive: 0x351052,
      emissiveIntensity: 0.45
    });
    const orb = new THREE.Mesh(geometry, material);
    group.add(orb);

    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.52, 2),
      new THREE.MeshBasicMaterial({ color: 0xd8b4fe, wireframe: true, transparent: true, opacity: 0.13 })
    );
    group.add(wire);

    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.65 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.008, 8, 180), ringMaterial);
    ring.rotation.x = 1.1;
    ring.rotation.y = 0.35;
    group.add(ring);

    const lightA = new THREE.PointLight(0xe5c2ff, 45, 12);
    lightA.position.set(2.5, 2.5, 3);
    scene.add(lightA);
    const lightB = new THREE.PointLight(0x7c3aed, 35, 10);
    lightB.position.set(-3, -2, 1);
    scene.add(lightB);
    scene.add(new THREE.AmbientLight(0x8d62b5, 1.1));

    const pointer = { x: 0, y: 0 };
    host.addEventListener("pointermove", event => {
      const rect = host.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    }, { passive: true });

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    new ResizeObserver(resize).observe(host);

    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      group.rotation.y += (pointer.x * 0.18 - group.rotation.y) * 0.025;
      group.rotation.x += (-pointer.y * 0.13 - group.rotation.x) * 0.025;
      orb.rotation.y += 0.0025;
      orb.rotation.z = Math.sin(t * 0.35) * 0.08;
      wire.rotation.y -= 0.0015;
      ring.rotation.z = t * 0.12;
      group.position.y = Math.sin(t * 0.7) * 0.08;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
  } catch (error) {
    console.warn("3D scene could not be initialized. The rest of the website remains available.", error);
  }
}
