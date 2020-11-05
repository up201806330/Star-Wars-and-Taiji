precision mediump float;

uniform sampler2D u_texture;
uniform vec2 texCoords;

void main(){
    vec2 texcoord = vec2(0.5, 0.5);  // get a value from the middle of the texture
    gl_FragColor = texture2D(u_texture, texcoord);
}