# Tree Gen
## Background and overview
 Tree Gen is a tool to dynamically generate a 3D model of a tree based on specifications the user inputs. 
 You can set the height, width, branch number and color of the tree.
<br></br>
![tree-gen](/app/assets/images/readme/treegen.png)

 ## Functionality and MVPs
 * Create a base tree trunk and set it's width, height, tree color, background color, lean and how many branches the tree should have. 
 * You can also press "random" to randomize those settings.
<br></br>
![trunk-settings](/app/assets/images/readme/trunk-settings.gif)
<br></br>
![random](/app/assets/images/readme/random.gif)
<br></br>
![branch-num](/app/assets/images/readme/branch-num.gif)
<br></br>
![background](/app/assets/images/readme/background.gif)
 * For more customization, you can also edit individual branches themselves to get the tree to look exactly as you want it to.
<br></br>
![branch-settings](/app/assets/images/readme/branch-settings.gif)
 
 ## Architecture and Technologies
 * Javascript for basic logic to handle input and generate trees
 * three.js for 3D
 * dat.gui for tree settings

## Wireframe
[Link to wireframe](https://wireframe.cc/pro/pp/04a36346e446595)
 
 ## Implementation timeline
 * Research three.js implementation and create trunk of tree - 2 days
 * Create branches - 1 day
 * Create leaves - 1 day

## Bonus
* Have the leaves fall and regrow on the tree
* Move a premade character around the tree to see it from any angle
