import{D as at,u as le,a as ut,c as H,i as lt,k as ct,n as ce,w as dt,__tla as ft}from"./index-fdc77110.js";let de,w,M,fe,me,N,he,K,pe,T,$,A,ge,X,xe,ve,be,ye,Pe,_e,we,Me,mt=Promise.all([(()=>{try{return ft}catch{}})()]).then(async()=>{const U=Object.create(null),Y=Object.create(null);T=function(t,e){let r=Y[t];return r===void 0&&(U[e]===void 0&&(U[e]=1),Y[t]=r=U[e]++),r};let b;function Ce(){return(!b||b!=null&&b.isContextLost())&&(b=at.get().createCanvas().getContext("webgl",{})),b}let C;function Se(){if(!C){C="mediump";const t=Ce();t&&t.getShaderPrecisionFormat&&(C=t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision?"highp":"mediump")}return C}function ze(t,e,r){return e?t:r?(t=t.replace("out vec4 finalColor;",""),`
        
        #ifdef GL_ES // This checks if it is WebGL1
        #define in varying
        #define finalColor gl_FragColor
        #define texture texture2D
        #endif
        ${t}
        `):`
        
        #ifdef GL_ES // This checks if it is WebGL1
        #define in attribute
        #define out varying
        #endif
        ${t}
        `}function Ae(t,e,r){const n=r?e.maxSupportedFragmentPrecision:e.maxSupportedVertexPrecision;if(t.substring(0,9)!=="precision"){let i=r?e.requestedFragmentPrecision:e.requestedVertexPrecision;return i==="highp"&&n!=="highp"&&(i="mediump"),`precision ${i} float;
${t}`}else if(n!=="highp"&&t.substring(0,15)==="precision highp")return t.replace("precision highp","precision mediump");return t}function Ue(t,e){return e?`#version 300 es
${t}`:t}const Ge={},Oe={};function Re(t,{name:e="pixi-program"},r=!0){e=e.replace(/\s+/g,"-"),e+=r?"-fragment":"-vertex";const n=r?Ge:Oe;return n[e]?(n[e]++,e+=`-${n[e]}`):n[e]=1,t.indexOf("#define SHADER_NAME")!==-1?t:`${`#define SHADER_NAME ${e}`}
${t}`}function Ee(t,e){return e?t.replace("#version 300 es",""):t}const G={stripVersion:Ee,ensurePrecision:Ae,addProgramDefines:ze,setProgramName:Re,insertVersion:Ue},O=Object.create(null),Z=class q{constructor(e){e={...q.defaultOptions,...e};const r=e.fragment.indexOf("#version 300 es")!==-1,n={stripVersion:r,ensurePrecision:{requestedFragmentPrecision:e.preferredFragmentPrecision,requestedVertexPrecision:e.preferredVertexPrecision,maxSupportedVertexPrecision:"highp",maxSupportedFragmentPrecision:Se()},setProgramName:{name:e.name},addProgramDefines:r,insertVersion:r};let i=e.fragment,a=e.vertex;Object.keys(G).forEach(o=>{const u=n[o];i=G[o](i,u,!0),a=G[o](a,u,!1)}),this.fragment=i,this.vertex=a,this._key=T(`${this.vertex}:${this.fragment}`,"gl-program")}destroy(){this.fragment=null,this.vertex=null,this._attributeData=null,this._uniformData=null,this._uniformBlockData=null,this.transformFeedbackVaryings=null}static from(e){const r=`${e.vertex}:${e.fragment}`;return O[r]||(O[r]=new q(e)),O[r]}};Z.defaultOptions={preferredVertexPrecision:"highp",preferredFragmentPrecision:"mediump"},A=Z;const J={uint8x2:{size:2,stride:2,normalised:!1},uint8x4:{size:4,stride:4,normalised:!1},sint8x2:{size:2,stride:2,normalised:!1},sint8x4:{size:4,stride:4,normalised:!1},unorm8x2:{size:2,stride:2,normalised:!0},unorm8x4:{size:4,stride:4,normalised:!0},snorm8x2:{size:2,stride:2,normalised:!0},snorm8x4:{size:4,stride:4,normalised:!0},uint16x2:{size:2,stride:4,normalised:!1},uint16x4:{size:4,stride:8,normalised:!1},sint16x2:{size:2,stride:4,normalised:!1},sint16x4:{size:4,stride:8,normalised:!1},unorm16x2:{size:2,stride:4,normalised:!0},unorm16x4:{size:4,stride:8,normalised:!0},snorm16x2:{size:2,stride:4,normalised:!0},snorm16x4:{size:4,stride:8,normalised:!0},float16x2:{size:2,stride:4,normalised:!1},float16x4:{size:4,stride:8,normalised:!1},float32:{size:1,stride:4,normalised:!1},float32x2:{size:2,stride:8,normalised:!1},float32x3:{size:3,stride:12,normalised:!1},float32x4:{size:4,stride:16,normalised:!1},uint32:{size:1,stride:4,normalised:!1},uint32x2:{size:2,stride:8,normalised:!1},uint32x3:{size:3,stride:12,normalised:!1},uint32x4:{size:4,stride:16,normalised:!1},sint32:{size:1,stride:4,normalised:!1},sint32x2:{size:2,stride:8,normalised:!1},sint32x3:{size:3,stride:12,normalised:!1},sint32x4:{size:4,stride:16,normalised:!1}};X=function(t){return J[t]??J.float32};const Fe={f32:"float32","vec2<f32>":"float32x2","vec3<f32>":"float32x3","vec4<f32>":"float32x4",vec2f:"float32x2",vec3f:"float32x3",vec4f:"float32x4",i32:"sint32","vec2<i32>":"sint32x2","vec3<i32>":"sint32x3","vec4<i32>":"sint32x4",u32:"uint32","vec2<u32>":"uint32x2","vec3<u32>":"uint32x3","vec4<u32>":"uint32x4",bool:"uint32","vec2<bool>":"uint32x2","vec3<bool>":"uint32x3","vec4<bool>":"uint32x4"};function Ve({source:t,entryPoint:e}){const r={},n=t.indexOf(`fn ${e}`);if(n!==-1){const i=t.indexOf("->",n);if(i!==-1){const a=t.substring(n,i),o=/@location\((\d+)\)\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)(?:,|\s|$)/g;let u;for(;(u=o.exec(a))!==null;){const s=Fe[u[3]]??"float32";r[u[2]]={location:parseInt(u[1],10),format:s,stride:X(s).stride,offset:0,instance:!1,start:0}}}}return r}function R(t){var f,g;const e=/(^|[^/])@(group|binding)\(\d+\)[^;]+;/g,r=/@group\((\d+)\)/,n=/@binding\((\d+)\)/,i=/var(<[^>]+>)? (\w+)/,a=/:\s*(\w+)/,o=/struct\s+(\w+)\s*{([^}]+)}/g,u=/(\w+)\s*:\s*([\w\<\>]+)/g,s=/struct\s+(\w+)/,l=(f=t.match(e))==null?void 0:f.map(d=>({group:parseInt(d.match(r)[1],10),binding:parseInt(d.match(n)[1],10),name:d.match(i)[2],isUniform:d.match(i)[1]==="<uniform>",type:d.match(a)[1]}));if(!l)return{groups:[],structs:[]};const c=((g=t.match(o))==null?void 0:g.map(d=>{const h=d.match(s)[1],x=d.match(u).reduce((v,y)=>{const[m,P]=y.split(":");return v[m.trim()]=P.trim(),v},{});return x?{name:h,members:x}:null}).filter(({name:d})=>l.some(h=>h.type===d)))??[];return{groups:l,structs:c}}var _=(t=>(t[t.VERTEX=1]="VERTEX",t[t.FRAGMENT=2]="FRAGMENT",t[t.COMPUTE=4]="COMPUTE",t))(_||{});function je({groups:t}){const e=[];for(let r=0;r<t.length;r++){const n=t[r];e[n.group]||(e[n.group]=[]),n.isUniform?e[n.group].push({binding:n.binding,visibility:_.VERTEX|_.FRAGMENT,buffer:{type:"uniform"}}):n.type==="sampler"?e[n.group].push({binding:n.binding,visibility:_.FRAGMENT,sampler:{type:"filtering"}}):n.type==="texture_2d"&&e[n.group].push({binding:n.binding,visibility:_.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d",multisampled:!1}})}return e}function Ie({groups:t}){const e=[];for(let r=0;r<t.length;r++){const n=t[r];e[n.group]||(e[n.group]={}),e[n.group][n.name]=n.binding}return e}function ke(t,e){const r=new Set,n=new Set,i=[...t.structs,...e.structs].filter(o=>r.has(o.name)?!1:(r.add(o.name),!0)),a=[...t.groups,...e.groups].filter(o=>{const u=`${o.name}-${o.binding}`;return n.has(u)?!1:(n.add(u),!0)});return{structs:i,groups:a}}const E=Object.create(null);w=class{constructor(t){var o,u;this._layoutKey=0;const{fragment:e,vertex:r,layout:n,gpuLayout:i,name:a}=t;if(this.name=a,this.fragment=e,this.vertex=r,e.source===r.source){const s=R(e.source);this.structsAndGroups=s}else{const s=R(r.source),l=R(e.source);this.structsAndGroups=ke(s,l)}this.layout=n??Ie(this.structsAndGroups),this.gpuLayout=i??je(this.structsAndGroups),this.autoAssignGlobalUniforms=((o=this.layout[0])==null?void 0:o.globalUniforms)!==void 0,this.autoAssignLocalUniforms=((u=this.layout[1])==null?void 0:u.localUniforms)!==void 0,this._generateProgramKey()}_generateProgramKey(){const{vertex:t,fragment:e}=this,r=t.source+e.source+t.entryPoint+e.entryPoint;this._layoutKey=T(r,"program")}get attributeData(){return this._attributeData??(this._attributeData=Ve(this.vertex)),this._attributeData}destroy(){this.gpuLayout=null,this.layout=null,this.structsAndGroups=null,this.fragment=null,this.vertex=null}static from(t){const e=`${t.vertex.source}:${t.fragment.source}:${t.fragment.entryPoint}:${t.vertex.entryPoint}`;return E[e]||(E[e]=new w(t)),E[e]}};function Be(t,e){switch(t){case"f32":return 0;case"vec2<f32>":return new Float32Array(2*e);case"vec3<f32>":return new Float32Array(3*e);case"vec4<f32>":return new Float32Array(4*e);case"mat2x2<f32>":return new Float32Array([1,0,0,1]);case"mat3x3<f32>":return new Float32Array([1,0,0,0,1,0,0,0,1]);case"mat4x4<f32>":return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}return null}const Q=class Te{constructor(e,r){this._touched=0,this.uid=le("uniform"),this._resourceType="uniformGroup",this._resourceId=le("resource"),this.isUniformGroup=!0,this._dirtyId=0,this.destroyed=!1,r={...Te.defaultOptions,...r},this.uniformStructures=e;const n={};for(const i in e){const a=e[i];a.name=i,a.size=a.size??1,a.value??(a.value=Be(a.type,a.size)),n[i]=a.value}this.uniforms=n,this._dirtyId=1,this.ubo=r.ubo,this.isStatic=r.isStatic,this._signature=T(Object.keys(n).map(i=>`${i}-${e[i].type}`).join("-"),"uniform-group")}update(){this._dirtyId++}};Q.defaultOptions={ubo:!1,isStatic:!1},N=Q,M=(t=>(t[t.WEBGL=1]="WEBGL",t[t.WEBGPU=2]="WEBGPU",t[t.BOTH=3]="BOTH",t))(M||{}),K=class extends ut{constructor(t){super(),this._uniformBindMap=Object.create(null),this._ownedBindGroups=[];let{gpuProgram:e,glProgram:r,groups:n,resources:i,compatibleRenderers:a,groupMap:o}=t;this.gpuProgram=e,this.glProgram=r,a===void 0&&(a=0,e&&(a|=M.WEBGPU),r&&(a|=M.WEBGL)),this.compatibleRenderers=a;const u={};if(!i&&!n&&(i={}),i&&n)throw new Error("[Shader] Cannot have both resources and groups");if(!e&&n&&!o)throw new Error("[Shader] No group map or WebGPU shader provided - consider using resources instead.");if(!e&&n&&o)for(const s in o)for(const l in o[s]){const c=o[s][l];u[c]={group:s,binding:l,name:c}}else if(e&&n&&!o){const s=e.structsAndGroups.groups;o={},s.forEach(l=>{o[l.group]=o[l.group]||{},o[l.group][l.binding]=l.name,u[l.name]=l})}else if(i){if(e){const s=e.structsAndGroups.groups;o={},s.forEach(l=>{o[l.group]=o[l.group]||{},o[l.group][l.binding]=l.name,u[l.name]=l})}else{o={},n={99:new H},this._ownedBindGroups.push(n[99]);let s=0;for(const l in i)u[l]={group:99,binding:s,name:l},o[99]=o[99]||{},o[99][s]=l,s++}n={};for(const s in i){const l=s;let c=i[s];!c.source&&!c._resourceType&&(c=new N(c));const f=u[l];f&&(n[f.group]||(n[f.group]=new H,this._ownedBindGroups.push(n[f.group])),n[f.group].setResource(c,f.binding))}}this.groups=n,this._uniformBindMap=o,this.resources=this._buildResourceAccessor(n,u)}addResource(t,e,r){var n,i;(n=this._uniformBindMap)[e]||(n[e]={}),(i=this._uniformBindMap[e])[r]||(i[r]=t),this.groups[e]||(this.groups[e]=new H,this._ownedBindGroups.push(this.groups[e]))}_buildResourceAccessor(t,e){const r={};for(const n in e){const i=e[n];Object.defineProperty(r,i.name,{get(){return t[i.group].getResource(i.binding)},set(a){t[i.group].setResource(a,i.binding)}})}return r}destroy(t=!1){var e,r;this.emit("destroy",this),t&&((e=this.gpuProgram)==null||e.destroy(),(r=this.glProgram)==null||r.destroy()),this.gpuProgram=null,this.glProgram=null,this.removeAllListeners(),this._uniformBindMap=null,this._ownedBindGroups.forEach(n=>{n.destroy()}),this._ownedBindGroups=null,this.resources=null,this.groups=null}static from(t){const{gpu:e,gl:r,...n}=t;let i,a;return e&&(i=w.from(e)),r&&(a=A.from(r)),new K({gpuProgram:i,glProgram:a,...n})}};const De={normal:0,add:1,multiply:2,screen:3,overlay:4,erase:5,"normal-npm":6,"add-npm":7,"screen-npm":8},F=0,V=1,j=2,I=3,k=4,B=5,D=class $e{constructor(){this.data=0,this.blendMode="normal",this.polygonOffset=0,this.blend=!0,this.depthMask=!0}get blend(){return!!(this.data&1<<F)}set blend(e){!!(this.data&1<<F)!==e&&(this.data^=1<<F)}get offsets(){return!!(this.data&1<<V)}set offsets(e){!!(this.data&1<<V)!==e&&(this.data^=1<<V)}set cullMode(e){if(e==="none"){this.culling=!1;return}this.culling=!0,this.clockwiseFrontFace=e==="front"}get cullMode(){return this.culling?this.clockwiseFrontFace?"front":"back":"none"}get culling(){return!!(this.data&1<<j)}set culling(e){!!(this.data&1<<j)!==e&&(this.data^=1<<j)}get depthTest(){return!!(this.data&1<<I)}set depthTest(e){!!(this.data&1<<I)!==e&&(this.data^=1<<I)}get depthMask(){return!!(this.data&1<<B)}set depthMask(e){!!(this.data&1<<B)!==e&&(this.data^=1<<B)}get clockwiseFrontFace(){return!!(this.data&1<<k)}set clockwiseFrontFace(e){!!(this.data&1<<k)!==e&&(this.data^=1<<k)}get blendMode(){return this._blendMode}set blendMode(e){this.blend=e!=="none",this._blendMode=e,this._blendModeId=De[e]||0}get polygonOffset(){return this._polygonOffset}set polygonOffset(e){this.offsets=!!e,this._polygonOffset=e}toString(){return`[pixi.js/core:State blendMode=${this.blendMode} clockwiseFrontFace=${this.clockwiseFrontFace} culling=${this.culling} depthMask=${this.depthMask} polygonOffset=${this.polygonOffset}]`}static for2d(){const e=new $e;return e.depthTest=!1,e.blend=!0,e}};D.default2d=D.for2d();let ee;fe=D,ee=0;class Le{constructor(e){this._poolKeyHash=Object.create(null),this._texturePool={},this.textureOptions=e||{},this.enableFullScreen=!1}createTexture(e,r,n){const i=new lt({...this.textureOptions,width:e,height:r,resolution:1,antialias:n,autoGarbageCollect:!0});return new ct({source:i,label:`texturePool_${ee++}`})}getOptimalTexture(e,r,n=1,i){let a=Math.ceil(e*n-1e-6),o=Math.ceil(r*n-1e-6);a=ce(a),o=ce(o);const u=(a<<17)+(o<<1)+(i?1:0);this._texturePool[u]||(this._texturePool[u]=[]);let s=this._texturePool[u].pop();return s||(s=this.createTexture(a,o,i)),s.source._resolution=n,s.source.width=a/n,s.source.height=o/n,s.source.pixelWidth=a,s.source.pixelHeight=o,s.frame.x=0,s.frame.y=0,s.frame.width=e,s.frame.height=r,s.updateUvs(),this._poolKeyHash[s.uid]=u,s}getSameSizeTexture(e,r=!1){const n=e.source;return this.getOptimalTexture(e.width,e.height,n._resolution,r)}returnTexture(e){const r=this._poolKeyHash[e.uid];this._texturePool[r].push(e)}clear(e){if(e=e!==!1,e)for(const r in this._texturePool){const n=this._texturePool[r];if(n)for(let i=0;i<n.length;i++)n[i].destroy(!0)}this._texturePool={}}}me=new Le;function te(t,e,r){if(t)for(const n in t){const i=n.toLocaleLowerCase(),a=e[i];if(a){let o=t[n];n==="header"&&(o=o.replace(/@in\s+[^;]+;\s*/g,"").replace(/@out\s+[^;]+;\s*/g,"")),r&&a.push(`//----${r}----//`),a.push(o)}else dt(`${n} placement hook does not exist in shader`)}}const We=/\{\{(.*?)\}\}/g;function re(t){var r;const e={};return(((r=t.match(We))==null?void 0:r.map(n=>n.replace(/[{()}]/g,"")))??[]).forEach(n=>{e[n]=[]}),e}function ne(t,e){let r;const n=/@in\s+([^;]+);/g;for(;(r=n.exec(t))!==null;)e.push(r[1])}function ie(t,e,r=!1){const n=[];ne(e,n),t.forEach(u=>{u.header&&ne(u.header,n)});const i=n;r&&i.sort();const a=i.map((u,s)=>`       @location(${s}) ${u},`).join(`
`);let o=e.replace(/@in\s+[^;]+;\s*/g,"");return o=o.replace("{{in}}",`
${a}
`),o}function oe(t,e){let r;const n=/@out\s+([^;]+);/g;for(;(r=n.exec(t))!==null;)e.push(r[1])}function He(t){const e=/\b(\w+)\s*:/g.exec(t);return e?e[1]:""}function Ne(t){const e=/@.*?\s+/g;return t.replace(e,"")}function Ke(t,e){const r=[];oe(e,r),t.forEach(s=>{s.header&&oe(s.header,r)});let n=0;const i=r.sort().map(s=>s.indexOf("builtin")>-1?s:`@location(${n++}) ${s}`).join(`,
`),a=r.sort().map(s=>`       var ${Ne(s)};`).join(`
`),o=`return VSOutput(
                ${r.sort().map(s=>` ${He(s)}`).join(`,
`)});`;let u=e.replace(/@out\s+[^;]+;\s*/g,"");return u=u.replace("{{struct}}",`
${i}
`),u=u.replace("{{start}}",`
${a}
`),u=u.replace("{{return}}",`
${o}
`),u}function se(t,e){let r=t;for(const n in e){const i=e[n];i.join(`
`).length?r=r.replace(`{{${n}}}`,`//-----${n} START-----//
${i.join(`
`)}
//----${n} FINISH----//`):r=r.replace(`{{${n}}}`,"")}return r}const p=Object.create(null),L=new Map;let Xe=0;function qe({template:t,bits:e}){const r=ae(t,e);if(p[r])return p[r];const{vertex:n,fragment:i}=Ze(t,e);return p[r]=ue(n,i,e),p[r]}function Ye({template:t,bits:e}){const r=ae(t,e);return p[r]||(p[r]=ue(t.vertex,t.fragment,e)),p[r]}function Ze(t,e){const r=e.map(o=>o.vertex).filter(o=>!!o),n=e.map(o=>o.fragment).filter(o=>!!o);let i=ie(r,t.vertex,!0);i=Ke(r,i);const a=ie(n,t.fragment,!0);return{vertex:i,fragment:a}}function ae(t,e){return e.map(r=>(L.has(r)||L.set(r,Xe++),L.get(r))).sort((r,n)=>r-n).join("-")+t.vertex+t.fragment}function ue(t,e,r){const n=re(t),i=re(e);return r.forEach(a=>{te(a.vertex,n,a.name),te(a.fragment,i,a.name)}),{vertex:se(t,n),fragment:se(e,i)}}const Je=`
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;
        var uv = aUV;

        {{start}}
        
        vColor = vec4<f32>(1., 1., 1., 1.);

        {{main}}

        vUV = uv;

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);
       
        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`,Qe=`
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;
   
    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {
        
        {{start}}

        var outColor:vec4<f32>;
      
        {{main}}
        
        return outColor * vColor;
      };
`,et=`
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;
        vec2 uv = aUV;
        
        {{start}}
        
        vColor = vec4(1.);
        
        {{main}}
        
        vUV = uv;
        
        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`,tt=`
   
    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {
        
        {{start}}

        vec4 outColor;
      
        {{main}}
        
        finalColor = outColor * vColor;
    }
`,rt={name:"global-uniforms-bit",vertex:{header:`
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `}},nt={name:"global-uniforms-bit",vertex:{header:`
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `}};pe=function({bits:t,name:e}){const r=qe({template:{fragment:Qe,vertex:Je},bits:[rt,...t]});return w.from({name:e,vertex:{source:r.vertex,entryPoint:"main"},fragment:{source:r.fragment,entryPoint:"main"}})},ve=function({bits:t,name:e}){return new A({name:e,...Ye({template:{vertex:et,fragment:tt},bits:[nt,...t]})})};let S;he={name:"color-bit",vertex:{header:`
            @in aColor: vec4<f32>;
        `,main:`
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `}},be={name:"color-bit",vertex:{header:`
            in vec4 aColor;
        `,main:`
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `}},S={};function it(t){const e=[];if(t===1)e.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"),e.push("@group(1) @binding(1) var textureSampler1: sampler;");else{let r=0;for(let n=0;n<t;n++)e.push(`@group(1) @binding(${r++}) var textureSource${n+1}: texture_2d<f32>;`),e.push(`@group(1) @binding(${r++}) var textureSampler${n+1}: sampler;`)}return e.join(`
`)}function ot(t){const e=[];if(t===1)e.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");else{e.push("switch vTextureId {");for(let r=0;r<t;r++)r===t-1?e.push("  default:{"):e.push(`  case ${r}:{`),e.push(`      outColor = textureSampleGrad(textureSource${r+1}, textureSampler${r+1}, vUV, uvDx, uvDy);`),e.push("      break;}");e.push("}")}return e.join(`
`)}ge=function(t){return S[t]||(S[t]={name:"texture-batch-bit",vertex:{header:`
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `},fragment:{header:`
                @in @interpolate(flat) vTextureId: u32;
    
                ${it(16)}
            `,main:`
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);
    
                ${ot(16)}
            `}}),S[t]};const W={};function st(t){const e=[];for(let r=0;r<t;r++)r>0&&e.push("else"),r<t-1&&e.push(`if(vTextureId < ${r}.5)`),e.push("{"),e.push(`	outColor = texture(uTextures[${r}], vUV);`),e.push("}");return e.join(`
`)}Pe=function(t){return W[t]||(W[t]={name:"texture-batch-bit",vertex:{header:`
                in vec2 aTextureIdAndRound;
                out float vTextureId;
              
            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `},fragment:{header:`
                in float vTextureId;
    
                uniform sampler2D uTextures[${t}];
              
            `,main:`
    
                ${st(16)}
            `}}),W[t]},Me={name:"round-pixels-bit",vertex:{header:`
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32> 
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},_e={name:"round-pixels-bit",vertex:{header:`   
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {       
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},$={name:"local-uniform-bit",vertex:{header:`

            struct LocalUniforms {
                uTransformMatrix:mat3x3<f32>,
                uColor:vec4<f32>,
                uRound:f32,
            }

            @group(1) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `}},ye={...$,vertex:{...$.vertex,header:$.vertex.header.replace("group(1)","group(2)")}},we={name:"local-uniform-bit",vertex:{header:`

            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix = uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `}},de=class{constructor(){this.vertexSize=4,this.indexSize=6,this.location=0,this.batcher=null,this.batch=null,this.roundPixels=0}get blendMode(){return this.renderable.groupBlendMode}packAttributes(t,e,r,n){const i=this.renderable,a=this.texture,o=i.groupTransform,u=o.a,s=o.b,l=o.c,c=o.d,f=o.tx,g=o.ty,d=this.bounds,h=d.maxX,x=d.minX,v=d.maxY,y=d.minY,m=a.uvs,P=i.groupColorAlpha,z=n<<16|this.roundPixels&65535;t[r+0]=u*x+l*y+f,t[r+1]=c*y+s*x+g,t[r+2]=m.x0,t[r+3]=m.y0,e[r+4]=P,e[r+5]=z,t[r+6]=u*h+l*y+f,t[r+7]=c*y+s*h+g,t[r+8]=m.x1,t[r+9]=m.y1,e[r+10]=P,e[r+11]=z,t[r+12]=u*h+l*v+f,t[r+13]=c*v+s*h+g,t[r+14]=m.x2,t[r+15]=m.y2,e[r+16]=P,e[r+17]=z,t[r+18]=u*x+l*v+f,t[r+19]=c*v+s*x+g,t[r+20]=m.x3,t[r+21]=m.y3,e[r+22]=P,e[r+23]=z}packIndex(t,e,r){t[e]=r+0,t[e+1]=r+1,t[e+2]=r+2,t[e+3]=r+0,t[e+4]=r+2,t[e+5]=r+3}reset(){this.renderable=null,this.texture=null,this.batcher=null,this.batch=null,this.bounds=null}},xe=function(t,e,r){const n=(t>>24&255)/255;e[r++]=(t&255)/255*n,e[r++]=(t>>8&255)/255*n,e[r++]=(t>>16&255)/255*n,e[r++]=n}});export{de as B,w as G,M as R,fe as S,me as T,N as U,mt as __tla,he as a,K as b,pe as c,T as d,$ as e,A as f,ge as g,X as h,xe as i,ve as j,be as k,ye as l,Pe as m,_e as n,we as o,Me as r};
