import * as THREE from '../build/three.module.js';

			import { OrbitControls } from './jsm/controls/OrbitControls.js';
			import { Rhino3dmLoader } from './jsm/loaders/3DMLoader.js';

			import { GUI } from './jsm/libs/dat.gui.module.js';

			let container, controls;
			let camera, scene, renderer;
			let gui;
			
			let allColors = [];
			let allLayerAreas = [];

			// let currentContainer = 'c';

			init();
			animate();

			function init() {

				THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 0, 1 );
				// container = document.createElement( 'div' );
				// container = document.querySelector('#c');
				container = document.getElementById( currentContainer );
				// document.body.appendChild( container );

				// renderer = new THREE.WebGLRenderer( { canvas: container, antialias: true } );

				// aspect = canvas.clientWidth / canvas.clientHeight;

				camera = new THREE.PerspectiveCamera( 60, container.clientWidth / container.clientHeight, 1, 1000 );
				camera.position.set( -28, - 28, 31 );
				

				scene = new THREE.Scene();

				scene.background = new THREE.Color( 0xffffff );

				const directionalLight = new THREE.DirectionalLight( 0xffffff );
				directionalLight.position.set( .2, 1, 2 );
				directionalLight.castShadow = true;
				directionalLight.intensity = 0.3;
				scene.add( directionalLight );

				const directionalLight2 = new THREE.DirectionalLight( 0xffffff );
				directionalLight2.position.set( -1, -.2, 2 );
				directionalLight2.castShadow = true;
				directionalLight2.intensity = 0.2;
				scene.add( directionalLight2 );


				let hemiLight = new THREE.HemisphereLight( 0xffffff, 0x080808, 0.75 );
    hemiLight.position.set( 0, 0, 400 );
		scene.add( hemiLight );
		
		scene.add( new THREE.AmbientLight( 0xffffff, 0.125 ) );

				// sceneBox = new THREE.Box3();

				const loader = new Rhino3dmLoader();
				loader.setLibraryPath( 'jsm/libs/rhino3dm/' );

				loader.load( 'models/3dm/Tower4.3dm', function ( object ) {

					// sceneBox.setFromObject(object);
    // let boxHelper = new THREE.Box3Helper(sceneBox, 0x0000ff);
    // scene.add(boxHelper);

    // Name to identify rhino object node
    object.name = 'rhinoDoc';

					object.children.map(child => {
      // Access attributes from the Rhino document
			let col = child.userData.attributes.drawColor;
			// console.log(child.userData.attributes.drawColor)
      let color = new THREE.Color(col.r/255, col.g/255, col.b/255);

      let mat = new THREE.MeshLambertMaterial( {
        color: color,
      } );
        
        // Set mesh material
				child.material = mat;
		});
      

					scene.add( object );
					initGUI( object.userData.layers );

				} );

				// const width = window.innerWidth;
				// const height = window.innerHeight;

				// renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer = new THREE.WebGLRenderer( { canvas: container, antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( container.clientWidth,  container.clientHeight );
				// container.appendChild( renderer.domElement );

				controls = new OrbitControls( camera, container );

				window.addEventListener( 'resize', resize, false );

			}

			function resize() {

				// const width = window.innerWidth;
				// const height = window.innerHeight;
				const width = container.clientWidth*.5;
				const heigth = container.clientHeigth

				camera.aspect = width / height;
				camera.updateProjectionMatrix();

				renderer.setSize( width, height );

			}

			function animate() {

				controls.update();
				renderer.render( scene, camera );
				// console.log(camera.position)

				requestAnimationFrame( animate );

	// 			if(prev != next){
	// 	prev++;
	// 	console.log(prev)
	// 	updateData();
	// }

			}

			function initGUI( layers ) {

				gui = new GUI( { width: 300 } );
				const layersControl = gui.addFolder( 'layers' );
				// layersControl.open();
				gui.hide();

				

				for ( let i = 0; i < layers.length; i ++ ) {
					// console.log(layers[i])
					// console.log( "rgb(" + layers[i].color.r + ", " + layers[i].color.g + ", " + layers[i].color.b +")")
					// allLayers.push(layers[i].name)

					

					const layer = layers[ i ];

					let eachLayerArea = 0;

					scene.traverse( function ( child ) {

					if ( child.userData.hasOwnProperty( 'attributes' ) ) {

						if ( 'layerIndex' in child.userData.attributes ) {

							const layerName = layers[ child.userData.attributes.layerIndex ].name;
							// console.log(layerName)

							if ( layerName === layer.name ) {
								// console.log(layerName)

								//CREATE ARRAY OF VECTOR3
								let vector3Array = []
										for(let i = 0; i < child.children[0].geometry.attributes.position.array.length/3; i++){
											let myVectorArray = []
											for(let j = 0; j<3; j++){
												myVectorArray.push(child.children[0].geometry.attributes.position.array[i*3 + j])
											}
											var a = new THREE.Vector3( myVectorArray[0], myVectorArray[1], myVectorArray[2] );
											vector3Array.push(a)
										}

				
										//CREATE FACE ARRAY
										// console.log((child.children[0].geometry.index.array.length)/3)

										for(let i = 0; i < child.children[0].geometry.index.array.length/3; i++){

											let myFaceArray = []
											for(let j = 0; j<3; j++){
												myFaceArray.push(child.children[0].geometry.index.array[i*3 + j])
												
											}
											var t = new THREE.Triangle(vector3Array[myFaceArray[0]],vector3Array[myFaceArray[1]],vector3Array[myFaceArray[2]]);
											var area = t.getArea();
											// console.log("hi")
											console.log(area)
											eachLayerArea += area;

										}
							}
						}
					}
					
				});
				allLayerAreas.push(eachLayerArea);

				var rgbToHex = function (rgb) { 
					var hex = Number(rgb). toString(16); 
					if (hex. length < 2) { 
						hex = "0" + hex; 
					} return hex; 
				};

				let myCol = rgbToHex(layers[i].color.r)
				myCol += rgbToHex(layers[i].color.g)
				myCol += rgbToHex(layers[i].color.b)

				allColors.push("#"+myCol);

				allLayers.push({
						variantId: layers[i].name,
						variantColor: "rgb(" + layers[i].color.r + ", " + layers[i].color.g + ", " + layers[i].color.b +")",
						variantArea: eachLayerArea.toFixed(2), 
						variantGWP: (eachLayerArea * 18.285).toFixed(2)
					})






					layersControl.add( layer, 'visible' ).name( layer.name ).onChange( function ( val ) {
						console.log("does this run?")

						const name = this.object.name;

						scene.traverse( function ( child ) {

							if ( child.userData.hasOwnProperty( 'attributes' ) ) {

								if ( 'layerIndex' in child.userData.attributes ) {

									const layerName = layers[ child.userData.attributes.layerIndex ].name;

									if ( layerName === name ) {

										child.visible = val;
										// console.log(child.children[0].geometry.attributes.position.array)
										// console.log(child.children[0].geometry.index.array)
										// console.log(child)

										
										layer.visible = val;

									}

								}

							}

						} );

					} );

					

				}

				console.log(allLayers)
				console.log(allLayerAreas)
				console.log(allColors)
			}

			// var data = [13, 21, 34, 55, 89,2];
	data = allLayers

	// set the color scale

	var alphabet = "abdef".split("");

    var margin = {top: 10, bottom: 10, left: 10, right: 10},
      width = window.innerWidth - margin.left - margin.right,
      height = window.innerHeight - margin.top - margin.bottom,
      radius = 300/ 2;

    var svg = d3.select("span").append("svg")
        .attr("width", 300)
        .attr("height", 300)
      .append("g")
        .attr("transform", "translate(" + ((300 / 2) ) + "," + ((300 / 2) ) + ")");
console.log(allColors)

		// var color = d3.scaleOrdinal(["#b3b3b3", "#001488", "#4169e1", "#c7e9b7", "#85e2bd"])
// 		var color = d3.scaleOrdinal()
// 		// var color = d3.scaleBand()
// .domain(allLayers)
// .range([allColors])
		
		// var color = d3.scaleOrdinal(allColors)

    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.value; });

    var arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius-80);

    redraw(randomData(allLayers));

    d3.interval(function(){
			data = allLayers
      redraw(randomData(allLayers));  
    }, 2000)

    function redraw(data){

      // join
      var arcs = svg.selectAll(".arc")
          .data(pie(data), function(d){ return d.data.name; });

      // update
      arcs 
        .transition()
          .duration(1500)
          .attrTween("d", arcTween);

      // enter
      arcs.enter().append("path")
        .attr("class", "arc")
        .attr("fill", function(d) { return d.data.color; })
        .attr("d", arc)
        .each(function(d) { this._current = d; });

    }

    // Store the displayed angles in _current.
    // Then, interpolate from _current to the new angles.
    // During the transition, _current is updated in-place by d3.interpolate.
    function arcTween(a) {
      // console.log(this._current);
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    }

    function randomData(data){
      return data.map(function(d){
        return {
          name: d.variantId,
					value: d.variantGWP,
					color: d.variantColor
        }
      });
		}