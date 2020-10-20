let allModels = [];
let currentModel = 0;
let allLayers = [];

allModels.push(allLayers)

let myGWPMaterials = [
  {
    "material": "Granite",
    "value": 18.28514101
  }, {
    "material": "Limestone",
    "value": 11.54573152
  }, {
    "material": "Brick",
    "value": 8.629073875
  }, {
    "material": "InsMetalPanel",
    "value": 9.171245913
  }, {
    "material": "Spandrel",
    "value": 15.90686277
  }, {
    "material": "UHPC",
    "value": 15.19133007
  }, {
    "material": "GFRC",
    "value": 14.88696287
  }, {
    "material": "ACM",
    "value": 11.07734591
  }, {
    "material": "Terracotta",
    "value": 8.107280922
  }, {
    "material": "PhenResin",
    "value": 8.364346902
  }, {
    "material": "FiberCement",
    "value": 8.046661497
  }, {
    "material": "Zinc",
    "value": 6.813886863
  }, {
    "material": "Granite1",
    "value": 6.532641113
  }, {
    "material": "Limestone1",
    "value": 8.107280922
  }, {
    "material": "Steel",
    "value": 4.78009599
  }, {
    "material": "Wood",
    "value": 5.322936027
  }, {
    "material": "GlazTA",
    "value": 5.481279
  }, {
    "material": "GlazTT",
    "value": 8.723595
  }, {
    "material": "GlazDA",
    "value": 3.67896
  }, {
    "material": "GlazDT",
    "value": 5.044635
  }, {
    "material": "Mull",
    "value": 17.577
  }, {
    "material": "Slab",
    "value": 15
  }, {
    "material": "Struct",
    "value": 26
  }
];

let data = [];
let prev = 0;
let next = 0;

function getData() {
  // vm.$forceUpdate();
  // currentModel = 0;
  // allLayers = allModels[currentModel];
  allLayers = [];

  for(let i = 0; i < allModels[currentModel].length; i++){
    allLayers.push(allModels[currentModel][i])
  }
  for (let i = 0; i < allModels[currentModel].length; i++) {
    let cur = allModels[currentModel][i].variantId;
    let currentSelect = document.getElementById(cur);
    let theCurrentMat = (currentSelect.options[currentSelect.selectedIndex].value);
    for (let j = 0; j < myGWPMaterials.length; j++) {
      if (myGWPMaterials[j].material == theCurrentMat) {
        let myMult = myGWPMaterials[j].value
        let num = parseInt(allModels[currentModel][i].variantArea)
        console.log(myMult * num)
        allModels[currentModel][i].variantGWP = (num * myMult).toFixed(2);

      }
    }
  }
}