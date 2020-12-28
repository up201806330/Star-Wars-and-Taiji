#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;		// texture
uniform sampler2D uSampler2; 	// map

uniform float timeFactor;

void main() {
	
	vec4 color = texture2D(uSampler, vTextureCoord + vec2(timeFactor*.01,timeFactor*.01));
	// vec4 filter = texture2D(uSampler2, vec2(0.0,0.1)+vTextureCoord);
	
	gl_FragColor = color;

}