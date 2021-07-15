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
![random](/src/images/random.gif)
<br></br>
![branch-num](/src/images/branch-num.gif)
<br></br>
![background](/src/images/background.gif)
 * For more customization, you can also edit individual branches themselves to get the tree to look exactly as you want it to.
<br></br>
![branch-settings](/src/images/branch-settings.gif)
 
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
