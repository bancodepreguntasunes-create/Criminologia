import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Crosshair, RotateCcw, Info, MousePointer2 } from 'lucide-react';

export default function Scene3D({ scene, image, caseTitle, discovered, onDiscover }) {
  const mountRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const root = mountRef.current;
    if (!root) return;
    let renderer, world, camera, frame, observer;
    const targets = [];
    const resources = [];
    const makeMat = (color, roughness=0.8, metalness=0) => {
      const material = new THREE.MeshStandardMaterial({ color, roughness, metalness });
      resources.push(material);
      return material;
    };
    try {
      world = new THREE.Scene();
      world.background = new THREE.Color('#101b28');
      world.fog = new THREE.Fog('#101b28', 17, 34);
      camera = new THREE.PerspectiveCamera(42, root.clientWidth / Math.max(root.clientHeight, 300), 0.1, 100);
      camera.position.set(9.5, 8.2, 11.5);
      camera.lookAt(0, 1.1, 0);
      renderer = new THREE.WebGLRenderer({ antialias:true, alpha:false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
      renderer.setSize(root.clientWidth, root.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      root.appendChild(renderer.domElement);

      world.add(new THREE.HemisphereLight('#d6eaff','#273442',2.0));
      const key = new THREE.DirectionalLight('#fff0d7',3.1);
      key.position.set(-4,11,7); key.castShadow=true; key.shadow.mapSize.set(1024,1024); world.add(key);
      const fill = new THREE.PointLight('#4dbce8',22,22); fill.position.set(5,5,-3); world.add(fill);

      const floorMat=makeMat('#354653'), wallMat=makeMat('#526575'), trim=makeMat('#8ba0ad',.55,.15);
      const wood=makeMat('#936c49'), woodLight=makeMat('#b18a60'), dark=makeMat('#172631');
      const metal=makeMat('#687e8c',.35,.65), paper=makeMat('#e5e0d2'), screen=makeMat('#183b4d',.25,.25);
      const glass=makeMat('#6bb7d0',.2,.1);
      const box=(w,h,d,x,y,z,m,cast=true)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=cast;o.receiveShadow=true;world.add(o);return o;};
      const cylinder=(rt,rb,h,x,y,z,m)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,20),m);o.position.set(x,y,z);o.castShadow=true;world.add(o);return o;};

      // Habitación abierta al frente: suelo, paredes y zócalos claramente definidos.
      const floor=new THREE.Mesh(new THREE.PlaneGeometry(12,10),floorMat);floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;world.add(floor);
      box(12,.18,.18,0,2.9,-4.9,trim); box(.18,2.9,9.8,-5.9,1.45,0,wallMat); box(.18,2.9,9.8,5.9,1.45,0,wallMat);
      box(12,.12,.12,0,.08,-4.82,trim); box(.12,.12,9.5,-5.78,.08,0,trim); box(.12,.12,9.5,5.78,.08,0,trim);
      // Puerta de acceso y lector electrónico en pared izquierda.
      box(.12,2.35,1.55,-5.78,1.22,.25,dark);
      box(.08,2.2,1.38,-5.68,1.2,.25,wood);
      box(.12,.28,.2,-5.55,1.15,-.35,metal);
      box(.07,.12,.04,-5.48,1.2,-.35,screen);
      // Ventanal frontal y vista simple del estacionamiento exterior.
      box(3.3,1.55,.09,1.4,2.05,-4.78,metal);
      box(3.08,1.34,.035,1.4,2.05,-4.71,glass);
      box(.07,1.38,.08,1.4,2.05,-4.65,trim); box(3.12,.07,.08,1.4,2.05,-4.65,trim);
      // Franjas del aparcamiento visibles tras el ventanal.
      for(let i=0;i<3;i++){box(.55,.018,.08,.55+i*.85,.93,-4.55,paper,false);}
      // Escritorio con patas, silla y equipo informático.
      box(2.8,.16,1.35,0,.95,-1.15,wood);
      for(const x of [-1.15,1.15]) for(const z of [-1.62,-.68]) box(.12,.9,.12,x,.46,z,metal);
      box(.85,.12,.78,0,.78,.15,metal); box(.72,.62,.12,0,1.35,-1.55,dark);
      box(.64,.48,.035,0,1.36,-1.47,screen);
      box(.85,.055,.42,0,1.06,-.65,dark);
      box(.38,.018,.25,-.65,1.05,-1.15,paper,false);
      box(.32,.025,.22,.48,1.06,-1.18,paper,false);
      cylinder(.28,.3,.12,0,.07,.85,dark); cylinder(.2,.2,.72,0,.45,.85,metal); box(.72,.85,.16,0,1.12,.98,dark);
      // Archivador con carpetas a la derecha.
      box(1.05,1.5,.72,4.25,.75,-2.15,metal);
      for(let i=0;i<3;i++){box(.92,.035,.64,4.25,.35+i*.43,-1.77,dark);box(.2,.06,.035,4.25,.35+i*.43,-1.42,trim);}
      // Cámara CCTV instalada en pared derecha, carcasa y lente orientados al escritorio.
      const camBody=box(.55,.22,.28,5.55,2.25,.55,metal);
      const lens=cylinder(.11,.11,.18,5.28,2.2,.55,dark); lens.rotation.z=Math.PI/2;
      const camLed=new THREE.Mesh(new THREE.SphereGeometry(.045,12,12),makeMat('#e65c5c',.3));camLed.position.set(5.23,2.28,.55);world.add(camLed);
      // Lámpara de techo y señalización ambiental.
      box(2.0,.07,.42,0,2.72,-1.6,paper,false);
      // Marcadores colocados al lado del objeto real, no flotando en el centro de la habitación.
      const positions={
        door:new THREE.Vector3(-4.95,.08,.25),
        desk:new THREE.Vector3(-1.25,.08,-1.05),
        camera:new THREE.Vector3(4.85,.08,.55),
        window:new THREE.Vector3(1.5,.08,-3.95),
        terminal:new THREE.Vector3(-1.25,.08,-1.05),
        cabinet:new THREE.Vector3(4.0,.08,-2.1),
        board:new THREE.Vector3(1.5,.08,-3.95),
        meeting:new THREE.Vector3(0,.08,2.1)
      };
      scene.hotspots.forEach((spot,i)=>{
        const group=new THREE.Group();
        const pos=positions[spot.id] || new THREE.Vector3(spot.x||0,.08,spot.z||0);
        group.position.copy(pos);
        const markerMat=makeMat(spot.color||'#55c9f2',.35,.15);
        markerMat.emissive=new THREE.Color(spot.color||'#55c9f2');markerMat.emissiveIntensity=.35;
        const ring=new THREE.Mesh(new THREE.TorusGeometry(.28,.035,8,32),markerMat);ring.rotation.x=-Math.PI/2;ring.position.y=.04;group.add(ring);
        const stem=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.42,8),markerMat);stem.position.y=.25;group.add(stem);
        const orb=new THREE.Mesh(new THREE.SphereGeometry(.105,16,16),markerMat);orb.position.y=.5;group.add(orb);
        // Placa numerada bajo el punto para que cada marcador tenga una referencia estable.
        const plate=new THREE.Mesh(new THREE.CircleGeometry(.18,24),makeMat('#122b3b',.45));plate.rotation.x=-Math.PI/2;plate.position.y=.012;group.add(plate);
        group.userData.hotspotId=spot.id;world.add(group);targets.push(group);
      });

      const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2();
      const click=(event)=>{
        const rect=renderer.domElement.getBoundingClientRect();
        pointer.x=((event.clientX-rect.left)/rect.width)*2-1;
        pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;
        raycaster.setFromCamera(pointer,camera);
        const hit=raycaster.intersectObjects(targets,true)[0];
        if(!hit)return;
        let node=hit.object;while(node && !node.userData.hotspotId)node=node.parent;
        const spot=scene.hotspots.find(s=>s.id===node?.userData.hotspotId);
        if(spot){setSelected(spot);onDiscover(spot);}
      };
      renderer.domElement.addEventListener('click',click);
      renderer.domElement.style.cursor='crosshair';
      const animate=()=>{frame=requestAnimationFrame(animate);targets.forEach((g,i)=>{g.children[0].rotation.z+=.003;g.children[2].position.y=.5+Math.sin(Date.now()*.0018+i)*.025;});renderer.render(world,camera);};
      animate();
      observer=new ResizeObserver(()=>{if(!renderer)return;const w=root.clientWidth,h=root.clientHeight;if(w&&h){camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);}});
      observer.observe(root);
      root._cleanup=()=>{cancelAnimationFrame(frame);observer?.disconnect();renderer.domElement.removeEventListener('click',click);renderer.dispose();world.traverse(o=>{o.geometry?.dispose();});resources.forEach(m=>m.dispose());if(root.contains(renderer.domElement))root.removeChild(renderer.domElement);};
      setError('');
    } catch(e) {
      setError('No se pudo iniciar la escena 3D en este dispositivo. Puedes inspeccionar los mismos indicios desde la lista.');
    }
    return ()=>root._cleanup?.();
  },[scene,onDiscover]);

  return (
    <section className="scene-investigation">
      <div className="scene-visual-brief">
        <img src={image} alt={`Referencia visual del caso: ${caseTitle || scene.title}`} />
        <div className="scene-visual-copy">
          <span className="eyebrow">CONTEXTO DEL CASO</span>
          <h3>{caseTitle || scene.title}</h3>
          <p>La escena representa una oficina real: puerta y lector a la izquierda, escritorio al centro, cámara y ventanal al fondo. Selecciona un marcador para inspeccionar cada elemento.</p>
          <div className="scene-progress-line"><span style={{width:`${Math.round((discovered.length/Math.max(scene.hotspots.length,1))*100)}%`}} /></div>
          <small>{discovered.length} DE {scene.hotspots.length} INDICIOS EXPLORADOS</small>
        </div>
      </div>
      <div className="scene-clue-gallery">
        {scene.hotspots.map((spot,i)=>(
          <button key={spot.id} className={`scene-clue-card ${selected?.id===spot.id?'active':''} ${discovered.includes(spot.id)?'found':''}`} onClick={()=>{setSelected(spot);onDiscover(spot);}}>
            <span className="scene-clue-number">{discovered.includes(spot.id)?'✓':String(i+1).padStart(2,'0')}</span>
            <span className="scene-clue-mark" style={{background:spot.color}} />
            <strong>{spot.label}</strong>
            <small>{discovered.includes(spot.id)?'HALLAZGO REGISTRADO':'PULSA PARA INSPECCIONAR'}</small>
          </button>
        ))}
      </div>
      <div className="scene-layout">
        <div className="scene-viewport" ref={mountRef}>
          {error && <div className="scene-fallback"><Info size={18}/>{error}</div>}
          <div className="scene-overlay top"><span><Crosshair size={14}/> MAPA 3D · VISTA GENERAL</span><span><MousePointer2 size={13}/> SELECCIONA UN MARCADOR</span></div>
          <div className="scene-overlay bottom"><span>LOS MARCADORES ESTÁN JUNTO A LOS OBJETOS</span><span>{discovered.length}/{scene.hotspots.length} INSPECCIONADOS</span></div>
        </div>
        <div className="scene-sidebar">
          <div className="scene-side-title"><div><span className="eyebrow">GUÍA DE INSPECCIÓN</span><h3>{scene.title}</h3></div><button className="icon-button" onClick={()=>setSelected(null)} title="Quitar selección"><RotateCcw size={16}/></button></div>
          <p className="muted small">{scene.description}</p>
          <div className="hotspot-list">
            {scene.hotspots.map((spot,i)=>(
              <button key={spot.id} className={`hotspot-row ${selected?.id===spot.id?'active':''} ${discovered.includes(spot.id)?'found':''}`} onClick={()=>{setSelected(spot);onDiscover(spot);}}>
                <span className="hotspot-index">{discovered.includes(spot.id)?'✓':String(i+1).padStart(2,'0')}</span>
                <span className="hotspot-name">{spot.label}<small>{discovered.includes(spot.id)?'Inspeccionado':'Busca este objeto en la escena'}</small></span>
                <span className="hotspot-dot" style={{background:spot.color}}/>
              </button>
            ))}
          </div>
          {selected ? <div className="evidence-note"><span className="eyebrow">NOTA DE INSPECCIÓN</span><h4>{selected.label}</h4><p>{selected.detail}</p></div> : <div className="scene-hint"><Info size={16}/><span>Empieza por la puerta, el escritorio, la cámara o el ventanal. También puedes elegir un elemento desde esta lista.</span></div>}
        </div>
      </div>
    </section>
  );
}
