//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}	 
//Include additional files here
serialInclude(['../lib/CGF.js', 'XMLscene.js', 'MySceneGraph.js', 'MyInterface.js', 'easingFuncs.js', 'Animation/Animation.js', 'Animation/KeyframeAnimation.js', 'Animation/KeyFrame.js', 'Animation/PieceTransporter.js', 'Primitives/MyTriangle.js', 'Primitives/MyRectangle.js', 'Primitives/MySphere.js', 'Primitives/MyTorus.js',  'Primitives/MyCylinder.js', 'Primitives/CylinderLid.js', 'Primitives/CylinderBody.js',  'Primitives/MyPrimitive.js', 'Primitives/Plane.js', 'Primitives/Patch.js', 'Primitives/Defbarrel.js', 'Primitives/Water.js', 'Primitives/TableScreen.js', 'MyNode.js', 'Spritesheet/MySpriteSheet.js', 'Spritesheet/MySpriteText.js', 'Spritesheet/MySpriteAnimation.js', 'Spritesheet/BlackText.js', 'Spritesheet/WhiteText.js',  'gameBoard/MyPiece.js', 'gameBoard/MyTile.js', 'gameBoard/MyGameBoard.js', 'game/MyGameOrchestrator.js', 'Primitives/MyUnitCubeQuad.js', 'Primitives/MyQuad.js', 'game/Client.js', 'game/MyAnimator.js', 'game/MyGameMove.js', 'Objs/CGFOBJModel.js', 'Objs/CGFResourceReader.js', 'Objs/Fish.js', 'Objs/Cannon.js', 'Objs/CannonExplosion.js', 'Objs/PieceExplosion.js', 'Objs/ScoreDisplay.js', 'Objs/MessageDisplay.js', 'Objs/TimerDisplay.js', 'Objs/Crate.js',

main=function()
{
	// Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myInterface = new MyInterface();
    var myScene = new XMLscene(myInterface);

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);

	// get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml 
	// or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor) 
	
    var filename=getUrlVars()['file'] || "roomScene.xml";

	// create and load graph, and associate it to scene. 
	// Check console for loading errors
	var myGraph = new MySceneGraph(filename, myScene);
	
	// start
    app.run();
}
]);
