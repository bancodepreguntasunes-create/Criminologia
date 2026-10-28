import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Crosshair, RotateCcw, Info } from 'lucide-react';

export default function Scene3D({ scene, discovered, onDiscover }) {
  const mountRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;
    let renderer, scene3d, camera, frame, resizeObserver;
    const root = mountRef.current;
    const hitTargets = [];
    const materials = [];
    try {
      scene3d = new THREE.Scene();
      scene3d.background = new THREE.Color('#101b28');
      scene3d.fog = new THREE.Fog('#101b28', 9, 22);
      camera = new THREE.PerspectiveCamera(48, root.clientWidth / Math.max(root.clientHeight, 280), 0.1, 100);
      camera.position.set(6.7, 5.5, 8.2);
      camera.lookAt(0, 0.8, 0);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(root.clientWidth, root.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      root.appendChild(renderer.domElement);

      scene3d.add(new THREE.HemisphereLight('#b8d9ee', '#26313a', 2.1));
      const key = new THREE.DirectionalLight('#fff0d6', 3.2);
      key.position.set(4, 8, 5);
      key.castShadow = true;
      scene3d.add(key);
      const fill = new THREE.PointLight('#56b9df', 20, 15);
      fill.position.set(-4, 3, -2);
      scene3d.add(fill);

      const mat = (color, roughness = 0.82) => {
        const m = new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.04 });
        materials.push(m);
        return m;
      };
      const floorMat = mat('#243647');
      const wallMat = mat('#34495b');
      const trimMat = mat('#61788a');
      const deskMat = mat('#795d45');
      const metalMat = mat('#8aa5b5', 0.38);
      const glassMat = new THREE.MeshStandardMaterial({ color: '#4e8ca8', roughness: 0.25, metalness: 0.1, transparent: true, opacity: 0.42 });
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 10), floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene3d.add(floor);
      const addBox = (w,h,d,x,y,z,material, cast=true) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), material);
        mesh.position.set(x,y,z); mesh.castShadow = cast; mesh.receiveShadow = true; scene3d.add(mesh); return mesh;
      };
      // Open-front room to keep the scene legible from the camera.
      addBox(12, 0.18, 0.18, 0, 2.6, -4.8, trimMat);
      addBox(0.18, 2.6, 9.6, -5.9, 1.3, 0, wallMat);
      addBox(12, 2.6, 0.18, 0, 1.3, -4.9, wallMat);
      addBox(0.18, 2.6, 9.6, 5.9, 1.3, 0, wallMat);
      // ceiling beams / light
      addBox(0.12, 0.12, 8, -2.6, 2.55, 0, trimMat, false);
      addBox(0.12, 0.12, 8, 2.6, 2.55, 0, trimMat, false);
      const ceilingLight = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.5), new THREE.MeshBasicMaterial({ color: '#d9f0ff' }));
      ceilingLight.position.set(0, 2.48, -2.2); scene3d.add(ceilingLight);
      // central table and two chairs
      addBox(3.1, 0.18, 1.5, 0, 0.95, -0.4, deskMat);
      for (const x of [-1.2, 1.2]) {
        addBox(0.14, 0.92, 0.14, x, 0.46, -0.9, metalMat, false);
        addBox(0.14, 0.92, 0.14, x, 0.46, 0.1, metalMat, false);
      }
      addBox(0.8, 0.5, 0.7, 0, 0.38, 1.35, deskMat);
      addBox(0.8, 0.12, 0.8, 0, 0.8, 1.35, metalMat);
      // wall display, framed caseboard
      addBox(2.1, 1.05, 0.12, 0, 1.65, -4.68, metalMat);
      addBox(1.92, 0.88, 0.06, 0, 1.65, -4.59, mat('#1b2c39'), false);
      const noteColors = ['#e8bd75','#8bc3d8','#d7e0e6','#8bb79c'];
      noteColors.forEach((c,i) => {
        const note = new THREE.Mesh(new THREE.PlaneGeometry(0.28,0.24), new THREE.MeshBasicMaterial({color:c, side:THREE.DoubleSide}));
        note.position.set(-0.65 + (i%2)*0.82, 1.82 - Math.floor(i/2)*0.38, -4.54);
        scene3d.add(note);
      });
      // generic evidence props to evoke a working investigation scene
      addBox(0.62,0.035,0.44,-0.7,1.07,-0.35,mat('#d7e2e8'),false);
      addBox(0.32,0.06,0.22,0.45,1.08,-0.45,mat('#c49a65'),false);
      const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.11,0.45,16), glassMat);
      bottle.position.set(0.9, 1.22, -0.25); scene3d.add(bottle);

      // Highlightable evidence objects, connected to hotspot selection.
      scene.hotspots.forEach((spot, i) => {
        const group = new THREE.Group();
        group.position.set(spot.x, 0.15, spot.z);
        const ringMat = new THREE.MeshStandardMaterial({ color: spot.color, emissive: spot.color, emissiveIntensity: 0.65, transparent: true, opacity: 0.9 });
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.035, 8, 36), ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.04;
        group.add(ring);
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018,0.018,0.42,8), ringMat);
        stem.position.y = 0.28; group.add(stem);
        const orb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), ringMat);
        orb.position.y = 0.52; group.add(orb);
        group.userData.hotspotId = spot.id;
        scene3d.add(group); hitTargets.push(group);
      });

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const handleClick = (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(hitTargets, true);
        if (hits.length) {
          let obj = hits[0].object;
          while (obj && !obj.userData.hotspotId) obj = obj.parent;
          if (obj?.userData.hotspotId) {
            const spot = scene.hotspots.find(s => s.id === obj.userData.hotspotId);
            if (spot) { setSelected(spot); onDiscover(spot); }
          }
        }
      };
      renderer.domElement.addEventListener('click', handleClick);
      renderer.domElement.style.cursor = 'crosshair';
      const animate = () => {
        frame = requestAnimationFrame(animate);
        hitTargets.forEach((obj, i) => {
          obj.children[0].rotation.z += 0.004 + i * 0.0004;
          obj.children[2].position.y = 0.52 + Math.sin(Date.now() * 0.002 + i) * 0.045;
        });
        renderer.render(scene3d, camera);
      };
      animate();
      resizeObserver = new ResizeObserver(() => {
        if (!renderer || !camera) return;
        const w = root.clientWidth, h = root.clientHeight;
        if (w && h) { camera.aspect = w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h); }
      });
      resizeObserver.observe(root);
      root._cleanup = () => {
        cancelAnimationFrame(frame);
        resizeObserver?.disconnect();
        renderer.domElement.removeEventListener('click', handleClick);
        renderer.dispose();
        materials.forEach(m => m.dispose());
        if (root.contains(renderer.domElement)) root.removeChild(renderer.domElement);
        scene3d.traverse(o => { if (o.geometry) o.geometry.dispose(); });
      };
      setError('');
    } catch (e) {
      setError('No se pudo iniciar WebGL en este dispositivo. Puedes explorar las pistas con la lista de la derecha.');
    }
    return () => { root._cleanup?.(); };
  }, [scene, onDiscover]);

  return (
    <div className="scene-layout">
      <div className="scene-viewport" ref={mountRef}>
        {error && <div className="scene-fallback"><Info size={18}/>{error}</div>}
        <div className="scene-overlay top"><span><Crosshair size={14}/> ESCENA DE INSPECCIÓN</span><span>ARRASTRA / GIRA CON EL RATÓN</span></div>
        <div className="scene-overlay bottom"><span>ESCANEA LOS MARCADORES LUMINOSOS</span><span>{discovered.length}/{scene.hotspots.length} PUNTOS EXPLORADOS</span></div>
      </div>
      <div className="scene-sidebar">
        <div className="scene-side-title"><div><span className="eyebrow">ENTORNO INTERACTIVO</span><h3>{scene.title}</h3></div><button className="icon-button" onClick={() => {setSelected(null); setRotation(v=>v+1)}} title="Restablecer selección"><RotateCcw size={16}/></button></div>
        <p className="muted small">{scene.description}</p>
        <div className="hotspot-list">
          {scene.hotspots.map((spot, i) => (
            <button key={spot.id} className={`hotspot-row ${selected?.id===spot.id?'active':''} ${discovered.includes(spot.id)?'found':''}`} onClick={() => {setSelected(spot);onDiscover(spot);}}>
              <span className="hotspot-index">{discovered.includes(spot.id)?'✓':String(i+1).padStart(2,'0')}</span>
              <span className="hotspot-name">{spot.label}<small>{discovered.includes(spot.id)?'Inspeccionado':'Punto de interés'}</small></span>
              <span className="hotspot-dot" style={{background:spot.color}}/>
            </button>
          ))}
        </div>
        {selected ? <div className="evidence-note"><span className="eyebrow">NOTA DE INSPECCIÓN</span><h4>{selected.label}</h4><p>{selected.detail}</p></div> : <div className="scene-hint"><Info size={16}/><span>Selecciona un marcador en la escena o en la lista para abrir una pista.</span></div>}
      </div>
    </div>
  );
}
