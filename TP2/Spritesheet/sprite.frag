precision mediump float;

uniform sampler2D u_texture;
uniform vec2 texCoords;
uniform vec2 size;

varying vec2 vTextureCoord;

void main(){
    gl_FragColor = texture2D(u_texture, (vTextureCoord + texCoords) / size);
}