attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;		// texture

uniform float timeFactor;


void main() {

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.x, aVertexPosition.y, aVertexPosition.z, 1.0);

	// gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0) + vec4(texturePosColor.x, texturePosColor.y*normScale, 0.0, 0.0);	
	// gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0) + texturePosColor;


	vTextureCoord = aTextureCoord;
	
}