import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeTracks({ type }: { type: "dev" | "aigc" }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 200;
    const height = container.clientHeight || 120;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    let cleanup = () => {};

    if (type === "dev") {
      const boxGeo = new THREE.BoxGeometry(2.2, 2.2, 2.2);
      const boxMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      });
      const boxMesh = new THREE.Mesh(boxGeo, boxMat);
      group.add(boxMesh);

      const innerGeo = new THREE.OctahedronGeometry(1.1, 0);
      const innerMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.2,
        metalness: 0.8,
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      group.add(innerMesh);

      cleanup = () => {
        boxGeo.dispose();
        boxMat.dispose();
        innerGeo.dispose();
        innerMat.dispose();
      };
    } else {
      const sphereGeo = new THREE.IcosahedronGeometry(1.8, 1);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphereMesh);

      const satGeo = new THREE.SphereGeometry(0.16, 12, 12);
      const satMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2 });
      const satGroup = new THREE.Group();
      for (let i = 0; i < 6; i++) {
        const m = new THREE.Mesh(satGeo, satMat);
        const angle = (i / 6) * Math.PI * 2;
        m.position.set(Math.cos(angle) * 2.6, Math.sin(angle * 2) * 0.6, Math.sin(angle) * 2.6);
        satGroup.add(m);
      }
      group.add(satGroup);

      cleanup = () => {
        sphereGeo.dispose();
        sphereMat.dispose();
        satGeo.dispose();
        satMat.dispose();
      };
    }

    const light1 = new THREE.DirectionalLight(0x38bdf8, 2.5);
    light1.position.set(5, 5, 5);
    scene.add(light1);
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      group.rotation.y += 0.008;
      group.rotation.x += 0.004;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      cleanup();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [type]);

  return <div ref={containerRef} className="h-full w-full pointer-events-none" />;
}
