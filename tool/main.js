import * as THREE from '../build/three.module.js';

import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { Rhino3dmLoader } from './jsm/loaders/3DMLoader.js';

import { GUI } from './jsm/libs/dat.gui.module.js';

let container, controls;
let camera, scene, renderer;
let gui;

let allColors = [];
let allLayerAreas = [];

init();
animate();

function init() {

  THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);

  container = document.getElementById('c');

  camera = new THREE.PerspectiveCamera(30, container.clientWidth / container.clientHeight, 1, 1000);
  camera.position.set(-280, - 280, 310);

  camera.layers.enable(0); // enabled by default
  camera.layers.enable(1);

  scene = new THREE.Scene();

  scene.background = new THREE.Color(0xffffff);

  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(.2, 10, 2);
  directionalLight.castShadow = true;
  directionalLight.intensity = 0.4;
  scene.add(directionalLight);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff);
  directionalLight2.position.set(-10, -.2, 2);
  directionalLight2.castShadow = true;
  directionalLight2.intensity = 0.3;
  scene.add(directionalLight2);


  let hemiLight = new THREE.HemisphereLight(0xffffff, 0x080808, 1);
  hemiLight.position.set(0, 0, 400);
  scene.add(hemiLight);

  scene.add(new THREE.AmbientLight(0xffffff, 0.2));

  // sceneBox = new THREE.Box3();

  const loader = new Rhino3dmLoader();
  loader.setLibraryPath('jsm/libs/rhino3dm/');

  loader.load('models/3dm/RhinoTemplate6.3dm', function (object) {
    // sceneBox.setFromObject(object);
    // let boxHelper = new THREE.Box3Helper(sceneBox, 0x0000ff);
    // scene.add(boxHelper);
    // Name to identify rhino object node
    object.name = 'rhinoDoc';
    object.children.map(child => {
      // Access attributes from the Rhino document
      let col = child.userData.attributes.drawColor;
      // console.log(child.userData.attributes.drawColor)
      let color = new THREE.Color(col.r / 255, col.g / 255, col.b / 255);
      let mat = new THREE.MeshLambertMaterial({
        color: color,
      });
      // Set mesh material
      child.material = mat;
      child.layers.set(1)
    });
    object.traverse(function (obj) {
      obj.layers.set(1);
    });
    object.layers.set(1);
    scene.add(object);
    // initGUI( object.userData.layers );

    initGUI(object.userData.layers);
  });

  loader.load('models/3dm/RhinoTemplate7.3dm', function (object) {
    // sceneBox.setFromObject(object);
    // let boxHelper = new THREE.Box3Helper(sceneBox, 0x0000ff);
    // scene.add(boxHelper);
    // Name to identify rhino object node
    object.name = 'rhinoDoc1';
    object.children.map(child => {
      // Access attributes from the Rhino document
      let col = child.userData.attributes.drawColor;
      // console.log(child.userData.attributes.drawColor)
      let color = new THREE.Color(col.r / 255, col.g / 255, col.b / 255);
      let mat = new THREE.MeshLambertMaterial({
        color: color,
      });
      // Set mesh material
      child.material = mat;
      child.layers.set(2)
      // scene.add(child)
    });

    object.traverse(function (obj) {
      obj.layers.set(2);
    });
    object.layers.set(2);
    scene.add(object);
    // initGUI( object.userData.layers );
  });

  loader.load('models/3dm/RhinoTemplate8.3dm', function (object) {
    // sceneBox.setFromObject(object);
    // let boxHelper = new THREE.Box3Helper(sceneBox, 0x0000ff);
    // scene.add(boxHelper);
    // Name to identify rhino object node
    object.name = 'rhinoDoc1';
    object.children.map(child => {
      // Access attributes from the Rhino document
      let col = child.userData.attributes.drawColor;
      // console.log(child.userData.attributes.drawColor)
      let color = new THREE.Color(col.r / 255, col.g / 255, col.b / 255);
      let mat = new THREE.MeshLambertMaterial({
        color: color,
      });
      // Set mesh material
      child.material = mat;
      child.layers.set(3)
      // scene.add(child)
    });

    object.traverse(function (obj) {
      obj.layers.set(3);
    });
    object.layers.set(3);
    scene.add(object);
  });

  renderer = new THREE.WebGLRenderer({ canvas: container, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  // container.appendChild( renderer.domElement );

  controls = new OrbitControls(camera, container);

  window.addEventListener('resize', resize, false);

}





function resize() {
  const width = container.clientWidth * .5;
  const heigth = container.clientHeigth

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);

}

function animate() {

  controls.update();
  renderer.render(scene, camera);
  // console.log(camera.position)

  requestAnimationFrame(animate);
}

function initGUI(layers) {

  gui = new GUI({ width: 300 });
  const layersControl = gui.addFolder('layers');
  // layersControl.open();
  gui.hide();

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    let eachLayerArea = 0;
    scene.traverse(function (child) {
      if (child.userData.hasOwnProperty('attributes')) {
        if ('layerIndex' in child.userData.attributes) {
          const layerName = layers[child.userData.attributes.layerIndex].name;
          if (layerName === layer.name) {

            //CREATE ARRAY OF VECTOR3
            let vector3Array = []
            for (let i = 0; i < child.children[0].geometry.attributes.position.array.length / 3; i++) {
              let myVectorArray = []
              for (let j = 0; j < 3; j++) {
                myVectorArray.push(child.children[0].geometry.attributes.position.array[i * 3 + j])
              }
              var a = new THREE.Vector3(myVectorArray[0], myVectorArray[1], myVectorArray[2]);
              vector3Array.push(a)
            }


            //CREATE FACE ARRAY
            for (let i = 0; i < child.children[0].geometry.index.array.length / 3; i++) {

              let myFaceArray = []
              for (let j = 0; j < 3; j++) {
                myFaceArray.push(child.children[0].geometry.index.array[i * 3 + j])
              }
              var t = new THREE.Triangle(vector3Array[myFaceArray[0]], vector3Array[myFaceArray[1]], vector3Array[myFaceArray[2]]);
              var area = t.getArea();
              eachLayerArea += area;

            }
          }
        }
      }

    });
    allLayerAreas.push(eachLayerArea);
    var rgbToHex = function (rgb) {
      var hex = Number(rgb).toString(16);
      if (hex.length < 2) {
        hex = "0" + hex;
      } return hex;
    };

    let myCol = rgbToHex(layers[i].color.r)
    myCol += rgbToHex(layers[i].color.g)
    myCol += rgbToHex(layers[i].color.b)

    allColors.push("#" + myCol);

    allLayers.push({
      variantId: layers[i].name,
      variantColor: "rgb(" + layers[i].color.r + ", " + layers[i].color.g + ", " + layers[i].color.b + ")",
      variantArea: eachLayerArea.toFixed(2),
      variantGWP: (eachLayerArea * 18.285).toFixed(2)
    })

    layersControl.add(layer, 'visible').name(layer.name).onChange(function (val) {
      const name = this.object.name;
      scene.traverse(function (child) {
        if (child.userData.hasOwnProperty('attributes')) {
          if ('layerIndex' in child.userData.attributes) {
            const layerName = layers[child.userData.attributes.layerIndex].name;
            if (layerName === name) {
              child.visible = val;
              layer.visible = val;
            }
          }
        }
      });
    });
  }
  // console.log(allLayers)
  // console.log(allLayerAreas)
  // console.log(allColors)
}

var app = new Vue({
  el: '#app',
  data: {
    product: 'Socks',
    image: 'https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg',
    inStock: true,
    details: ['80% cotton', '20% polyester', 'Gender-neutral'],
    variants: allLayers,

    sizes: allLayers
  }, computed: {
    sum() {
      let tot = 0;
      for (let i = 0; i < this.variants.length; i++) {
        tot += parseInt(this.variants[i].variantGWP)
      }
      return tot
    }
  }
})

document.getElementById("myBtn").addEventListener("click", function () {
  camera.layers.enable(1);
  camera.layers.disable(2);
  camera.layers.disable(3);
});

document.getElementById("myBtn2").addEventListener("click", function () {
  camera.layers.disable(1);
  camera.layers.enable(2);
  camera.layers.disable(3);
});

document.getElementById("myBtn3").addEventListener("click", function () {
  camera.layers.disable(1);
  camera.layers.disable(2);
  camera.layers.enable(3);
});


data = allLayers

// set the color scale

var alphabet = "abdef".split("");

var margin = { top: 10, bottom: 10, left: 10, right: 10 },
  width = window.innerWidth - margin.left - margin.right,
  height = window.innerHeight - margin.top - margin.bottom,
  radius = 300 / 2;

var svg = d3.select("span").append("svg")
  .attr("width", 300)
  .attr("height", 300)
  .append("g")
  .attr("transform", "translate(" + ((300 / 2)) + "," + ((300 / 2)) + ")");
console.log(allColors)

var pie = d3.pie()
  .sort(null)
  .value(function (d) { return d.value; });

var arc = d3.arc()
  .outerRadius(radius)
  .innerRadius(radius - 80);

redraw(randomData(allLayers));

d3.interval(function () {
  data = allLayers
  redraw(randomData(allLayers));
}, 2000)

function redraw(data) {

  // join
  var arcs = svg.selectAll(".arc")
    .data(pie(data), function (d) { return d.data.name; });

  // update
  arcs
    .transition()
    .duration(1500)
    .attrTween("d", arcTween);

  // enter
  arcs.enter().append("path")
    .attr("class", "arc")
    .attr("fill", function (d) { return d.data.color; })
    .attr("d", arc)
    .each(function (d) { this._current = d; });

}

// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
function arcTween(a) {
  // console.log(this._current);
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function (t) {
    return arc(i(t));
  };
}

function randomData(data) {
  return data.map(function (d) {
    return {
      name: d.variantId,
      value: d.variantGWP,
      color: d.variantColor
    }
  });
}
