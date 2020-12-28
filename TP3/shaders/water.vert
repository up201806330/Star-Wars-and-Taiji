attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;		// texture
uniform sampler2D uSampler2;	// map

uniform float normScale;
uniform float timeFactor;


void main() {

	vec4 texturePosColor = texture2D(uSampler2, aTextureCoord + vec2(timeFactor*0.05, timeFactor * 0.04));
	float offset = texturePosColor.r * normScale * 0.005;
	
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.x, aVertexPosition.y, aVertexPosition.z  + offset, 1.0);

	// gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0) + vec4(texturePosColor.x, texturePosColor.y*normScale, 0.0, 0.0);	
	// gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0) + texturePosColor;


	vTextureCoord = aTextureCoord;
	
}