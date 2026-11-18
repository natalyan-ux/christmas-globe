import * as T from './assets/three.js';
import {GLTFLoader} from './assets/GLTFLoader.js';
// Only the cat visual is replaced. Placement and the public group name stay unchanged.
export function createSleepingCat(){
 const cat=new T.Group();cat.name='cat';cat.position.set(-2.25,-1.18,-.7);cat.scale.setScalar(2.1);cat.rotation.y=-.12;
 let body,head,headRestY=0;const loader=new GLTFLoader();
 function attach(gltf,asset){const model=gltf.scene;const nextBody=model.getObjectByName('cat-body'),nextHead=model.getObjectByName('cat-head');if(!nextBody||!nextHead)throw new Error('Cat model is missing breathing groups');model.traverse(object=>{if(!object.isMesh)return;const thin=/whisker|eyelid|mouth/i.test(object.name);object.castShadow=!thin&&!object.name.includes('fibers');object.receiveShadow=!thin;const materials=Array.isArray(object.material)?object.material:[object.material];for(const material of materials){const nose=/nose/i.test(material.name),eye=/eyes|whiskers/i.test(material.name);material.envMapIntensity=nose?.8:.58;material.roughness=nose?.5:Math.max(.85,material.roughness??.9);material.normalMap=null;material.bumpMap=null;material.flatShading=false;if(material.isMeshPhysicalMaterial){material.sheen=nose||eye?0:.12;material.sheenColor.set('#ffd499');material.sheenRoughness=.85}}});cat.clear();cat.add(model);body=nextBody;head=nextHead;body.name='cat-breathing-body';head.name='cat-face';headRestY=head.position.y;cat.userData.asset=asset;cat.userData.authoredBody=body;cat.userData.authoredHead=head;cat.userData.authoredHeadY=headRestY;}
 function loadOriginal(){loader.load(new URL('./assets/sleeping-cat.glb',import.meta.url).href,gltf=>attach(gltf,'sleeping-cat.glb'),undefined,()=>{cat.userData.assetError=true})}
 loader.load(new URL('./assets/sleeping-cat-refined.glb?v=cat-mouth-26',import.meta.url).href,gltf=>{try{attach(gltf,'sleeping-cat-refined.glb')}catch{loadOriginal()}},undefined,loadOriginal);
 return {cat,update(t){if(!body||!head)return;body.scale.y=1+Math.sin(t*1.5)*(.008/.47);head.position.y=headRestY+Math.sin(t*1.5)*.004;}};
}
