import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ParticleCanvas() {
  const mountRef = useRef(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    if (isMobile || !mountRef.current) return;

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    camera.position.y = 10;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: window.innerWidth > 768 });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1 : 2));
    mountRef.current.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.innerWidth < 768 ? 600 : 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    const color1 = new THREE.Color("#D4AF37"); 
    const color2 = new THREE.Color("#C0392B"); 
    const color3 = new THREE.Color("#8E44AD"); 

    for(let i = 0; i < particlesCount * 3; i+=3) {
      const radius = 20 + Math.random() * 40;
      const angle = Math.random() * Math.PI * 2;
      posArray[i] = Math.cos(angle) * radius; 
      posArray[i+1] = -10 + Math.random() * 50; 
      posArray[i+2] = Math.sin(angle) * radius; 

      const mixedColor = [color1, color2, color3][Math.floor(Math.random() * 3)];
      colorsArray[i] = mixedColor.r;
      colorsArray[i+1] = mixedColor.g;
      colorsArray[i+2] = mixedColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const segments = window.innerWidth < 768 ? 20 : 50;
    const oceanGeometry = new THREE.PlaneGeometry(100, 100, segments, segments);
    const oceanMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x1A0E24, 
      wireframe: true, 
      colorWrite: true,
      transparent: true,
      opacity: 0.2
    });
    const oceanMesh = new THREE.Mesh(oceanGeometry, oceanMaterial);
    oceanMesh.rotation.x = -Math.PI / 2;
    oceanMesh.position.y = -10;
    scene.add(oceanMesh);

    let clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      particlesMesh.rotation.y = elapsedTime * 0.05;
      
      const positionAttribute = oceanGeometry.getAttribute('position');
      for ( let i = 0; i < positionAttribute.count; i ++ ) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        const z = Math.sin(x * 0.2 + elapsedTime) * Math.cos(y * 0.2 + elapsedTime) * 2;
        positionAttribute.setZ(i, z);
      }
      positionAttribute.needsUpdate = true;

      camera.position.x = Math.sin(elapsedTime * 0.5) * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [isMobile]);

  if (isMobile) {
    return <div className="absolute inset-0 z-0 bg-radial-gradient from-transparent via-bg-dark/50 to-bg-dark opacity-60 pointer-events-none" />;
  }

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-60 mix-blend-screen" />;
}
