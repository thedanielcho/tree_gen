# Tree Gen
## Background and overview
 Tree Gen is a tool to dynamically generate a 3D model of a tree based on specifications the user inputs. 
 You can set the height, width, branch number and color of the tree.
<br></br>
![tree-gen](/src/images//treegen.png)


 ## Functionality and MVPs
 * Create a base tree trunk and set it's width, height, tree color, background color, lean and how many branches the tree should have. 
 * You can also press "random" to randomize those settings.
<br></br>
![trunk-settings](/src/images/trunk-settings.gif)
<br></br>
![branch-num](/src/images/branch-num.gif)
<br></br>
![background](/src/images/background.gif)
<br></br>
 ### Randomize
![random](/src/images/random.gif)
<br></br>
 * For more customization, you can also edit individual branches themselves to get the tree to look exactly as you want it to.
<br></br>
![branch-settings](/src/images/branch-settings.gif)
 
 ## Architecture and Technologies
 * Javascript for basic logic to handle input and generate trees
 * three.js for 3D
 * dat.gui for tree settings
<b></br>
<b></br>
The code is fundamentally built using Object Oriented Programming where I have a Trunk class, a Branch class, and a Leaf class, where the trunk has many branches and the branch has many leaves.
``` Javascript
class Trunk {
  constructor(sizing, gui, requestRender){
    this.sizing = sizing;
    this.gui = gui;
    this.folder = gui.addFolder('Trunk');
    this.branchFolder = gui.addFolder(`Branches`);
    this.mesh = this.setupTrunkMesh()
    this.bones = this.mesh.skeleton.bones;
    this.requestRender = requestRender;
    this.params = {
      lean: 0.0,
      twist: false,
      straight: false,
      width: 1,
      height: 1,
      basePos: 0,
      color: 0x58433d,
      leafColor: 0x34822d,
      branchNum: 20.0,
      branches : {},
      random: false
    };
    this.branchSizing = {
      width: Math.floor(sizing.width / 4),
      segmentHeight: Math.floor(sizing.segmentHeight/1.5), 
      segmentCount: Math.floor(sizing.segmentCount/1.5),
      height: Math.floor(sizing.segmentHeight/1.5) * Math.floor(sizing.segmentCount/1.5),
      halfHeight: (Math.floor(sizing.segmentHeight/1.5) * Math.floor(sizing.segmentCount/1.5)) / 2,
    }
    this.branches = [];
    this.initialBranchPos = [];
    this.branchesFolders = [];
    this.leaves = [];
    this.setupTrunkFolder();
    this.setupBranches();
    this.setupLeaves();
  }

```
``` Javascript
class Branch {
  constructor(sizing, branchFolder, requestRender, color, leafColor){
    this.sizing = sizing;
    // this.branchFolder = branchFolder;
    this.folder = [];
    this.params = {
      lean: 0,
      twist: false,
      straight: false,
      width: 1,
      height: 1,
      basePos: 0,
      color: color,
      rotateY: (THREE.Math.radToDeg(1) % 360),
      rotateX: (THREE.Math.radToDeg(1) % 360),
      rotateZ: (THREE.Math.radToDeg(1) % 360),
      leafColor: leafColor
    };
    this.mesh = this.setupBranchMesh();
    this.bones = this.mesh.skeleton.bones;
    this.requestRender = requestRender;
    this.leaves = [];
    this.setupLeaves()
    // this.setupBranchFolder();
  }

```
``` Javascript
class Leaf {
  constructor(loader, requestRender){
    this.mesh = [];
    this.requestRender = requestRender;
    this.params = {
      color: 0x34822d
    }
    this.loader = loader;

  }

```
With this, I can tweak small settings and change how many branches or leaves a tree has very simply, or in the future, even allow for multiple trees to be generated at once.
## Wireframe
[Link to wireframe](https://wireframe.cc/pro/pp/04a36346e446595)
 
 ## Implementation timeline
 * Research three.js implementation and create trunk of tree - 2 days
 * Create branches - 1 day
 * Create leaves - 1 day

## Bonus
* Have the leaves fall and regrow on the tree
* Move a premade character around the tree to see it from any angle
