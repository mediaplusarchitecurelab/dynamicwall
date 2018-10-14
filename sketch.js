var layout, sound, att, gui, bt;
var attXfactor = 7;
var attYfactor = 9;

var addDiameter = 40;
var addName = "新姓名";
var exportJSON = false;

// object
var voxelmap = {};
var voxellayout; 

// spreadsheet url
var ssurl = "https://spreadsheets.google.com/feeds/list/1zrnd9KFyOtJ2ckW8WoxNEqXKoGJfm31e7m8eaOKZQWw/od6/public/values?alt=json";
var exeurl = "https://script.google.com/macros/s/AKfycbz-nu15UEEN4xoEcdOigexX_2SnJQS7vqryIt-Ivp923oiKXsI/exec";
// preload
function preload() {
  soundFormats("mp3", "ogg");
  sound = [ loadSound("./assets/Mixdown_CE.ogg"),
            loadSound("./assets/Mixdown_CF.ogg"),
            loadSound("./assets/Mixdown_EG.ogg"),
            loadSound("./assets/Mixdown_CCC.ogg")
          ];
  loadJSON(ssurl, encodejson);

}
// 輸入spread的工作表名稱
function encodejson(voxels){
  let vs = [];

  for (let i = 0; i < voxels.feed.entry.length; i+=1) {
    let p = {   "x": int(voxels.feed.entry[i].gsx$positionx.$t),
                "y": int(voxels.feed.entry[i].gsx$positiony.$t)
            }
    let  v= {
                "position": p,
                "diameter": int(voxels.feed.entry[i].gsx$diameter.$t),
                "label": voxels.feed.entry[i].gsx$label.$t
            }
    vs.push(v);
  }
  voxelmap.voxels=vs;
}

function setup() {
    createCanvas(1920, 768);
    print(voxelmap.voxels);
    voxellayout = new VoxelScape(importData(voxelmap));
    
    att = new Attrator();


    //GUI
    gui = createGui("新渦點");

    sliderRange(35, 90, 1);
    gui.addGlobals("addDiameter");

    gui.addGlobals("addName");

    gui.addGlobals("exportJSON")
  /*  
    sliderRange(3, 12, 1);
    gui.addGlobals('attXfactor');
    sliderRange(3, 12, 1);
    gui.addGlobals('attYfactor');
  */
      // Don't loop automatically
    //noLoop();
}

function draw() {
  background(225, 225, 225, 75);
  //clear();
      voxellayout.display();
      //att.display();
  //push();
      
    //GUI
/*    
      noStroke();
      fill(0);
      textAlign(CENTER);
      text(label, x, y + radius + 15);
  //pop();
*/
}

// import data from JSON
function importData(voxelmap) {
  let vm=[];
  let dataMap = voxelmap["voxels"];
  for (let i = 0; i < dataMap.length; i+=1) {
    // Get each object in the array
    let vp = dataMap[i];

    // Get a position object
    let position = vp["position"];
    // Get x,y from position
    let x = position["x"];
    let y = position["y"];

    // Get diameter and label
    let diameter = vp["diameter"];
    let label = vp["label"];

    // Put object in array
    vm.push(new Voxel(x, y, diameter, label)); 
  }

  return vm;
}


// 渦點
function Voxel(x,y,d, l) {
  
  this.x = x;
  this.y = y;
  this.diameter = d;
  this.name=l;

  this.speed = 0.15;
  this.life = this.diameter;

  this.triggered = false;
  this.over = false;
  this.dingdong = sound[0];

  // 滑鼠移入
  this.rollover = function(px, py) {
    let d = dist(px, py, this.x, this.y);
    if (d < this.diameter) {
      this.over = true;
    } else {
      this.over = false;
    }
  };

  // 顯示
  this.display = function() {
    //原有
    noStroke();
    fill(d,d,d,50);
    ellipse(this.x, this.y, this.diameter, this.diameter); 
    if (this.over) {
      fill(0);
      textAlign(CENTER);
      text(this.name, this.x, this.y + 15);
    }

    //若制動
    if (this.triggered){
      if (this.life >0){
        this.life -= this.speed;  
      }else{
        this.triggered=false;
      }
      fill(70*i,255-(70*i),255,this.life);
      ellipse(this.x, this.y, this.diameter-this.life, this.diameter-this.life);
    // 若未制動 
    }else{
      //若撞擊則制動
      
      if(collideCircleCircle(att.x,att.y,20,this.x,this.y,this.diameter)){
        //若其餘有聲響則不出聲
        var voxelcheck=false;
        for(let i=0; i< layout.voxels.length;i+=1){
          if (layout.voxels[i].triggered){voxelcheck=true; break;}
        }
        if (voxelcheck){
        }else{
          this.triggered = true;
          this.life = this.diameter;
          this.dingdong.play();
        }
      }
    }
    //fill(70*i,255-(70*i),255,this.life);
    //ellipse(this.x, this.y, this.diameter-this.life, this.diameter-this.life);
    //若輸出
    
  }
}
 // !!!!!!! important !!!!!!! need to remove cache

// !!!!!!! important

// Scape
function VoxelScape(vs){
  this.voxels = vs;

  this.add =function(px,py,d,l){
    this.voxels.push(new Voxel(px,py,d,l));
  };
  this.count =function(){
    return this.voxels.length;
  };

  //輸出Json
  this.export = function(){
    if (exportJSON) {
      let vsjson ={};
      let vsarray = [];
      let vsstr = "";

      for (let i=0;i<this.voxels.length;i+=1) {
        vsstr+= this.voxels[i].x+","+this.voxels[i].y+","+this.voxels[i].diameter+","+this.voxels[i].name;
        if (i!=this.voxels.length-1){
          vsstr+=";"
        }
        /*
        let vjson = {};
        let vjp={};
          vjp.positionx= this.voxels[i].x;
          vjp.positiony= this.voxels[i].y;
        vjson.position = vjp;
        vjson.diameter = this.voxels[i].diameter;
        vjson.label = this.voxels[i].name;

        vsarray.push(vjson);
        */
      }
      //vsjson.voxels = vsarray;

// send data out
      var exportout = {
              data: vsstr,
              sheetUrl: 'https://docs.google.com/spreadsheets/d/1zrnd9KFyOtJ2ckW8WoxNEqXKoGJfm31e7m8eaOKZQWw/edit?usp=sharing',
              sheetTag: 'voxels'
          };
          $.get('https://script.google.com/macros/s/AKfycbz-nu15UEEN4xoEcdOigexX_2SnJQS7vqryIt-Ivp923oiKXsI/exec', exportout);
/*
      $.get(exeurl, {
          mode: "no-cors"
          data: "2,33,44,55,fad",
          sheetUrl: "https://docs.google.com/spreadsheets/d/1zrnd9KFyOtJ2ckW8WoxNEqXKoGJfm31e7m8eaOKZQWw/edit?usp=sharing",
          sheetTag: "voxels"
        } 
        );
      //$(function() {
*/
      //});
/*
      httpDo(exeurl, 
            {
              method: "POST", // *GET, POST, PUT, DELETE, etc.
              body: JSON.stringify(vsjson), // data can be `string` or {object}!
              headers:{
                "Content-Type": "application/json"
              }
            },
            function(res){
              alert('v');
            } 
      );
*/
/*
       $.ajax({
        url: exeurl,
        method: "GET",
        dataType: "json",
        data: vsjson
        });
      //saveJSON(vsjson, 'voxelmap.json');
      /*
      let url = "./assets/dataupload.js";
      httpDo(url, 
            {
              method: "POST", // *GET, POST, PUT, DELETE, etc.
              body: JSON.stringify(vsjson), // data can be `string` or {object}!
              headers:{
                "Content-Type": "application/json"
              }
            },
            function(res){
              alert('v');
            } 
      );
      */
      exportJSON=false;

    }
  }

  this.display =function(){
    for (let i=0;i<this.voxels.length;i+=1) {
      this.voxels[i].display();
      this.voxels[i].rollover(mouseX,mouseY);
    }
    this.export(); 
  };
}
function Attrator(){
  this.t=0;
  this.x=0;
  this.y=0;

  this.display=function(){
    
    fill(250,50,50,50);
    
    this.x = (cos(attXfactor*this.t)*width*2/5)+(width/2);
    this.y = (sin(attYfactor*this.t)*height*2/5)+(height/2);
    ellipse(this.x,this.y,20,20);
    this.t += 0.003;
  }
}

// 滑鼠事件
function mousePressed() {
  // Add diameter and label to bubble
  //let diameter = random(40, 80);
  //let label = 'New Label';

  // Append the new JSON bubble object to the array
  if (mouseX<220 && mouseY<200){}
  else{
    voxellayout.add(mouseX, mouseY, addDiameter, addName);
  }

}


