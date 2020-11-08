precision mediump float;

uniform sampler2D u_texture;
uniform vec2 texCoords;

varying vec2 vTextureCoord;

void main(){
    gl_FragColor = texture2D(u_texture, (vTextureCoord + texCoords)/16.0);
    //gl_FragColor = texture2D(u_texture, vTextureCoord);

    //gl_FragColor = vec4(vTextureCoord, 0.0, 1.0);
}