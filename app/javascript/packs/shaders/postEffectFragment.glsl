precision mediump float;

uniform float time;
uniform sampler2D tex;
uniform vec2 resolution;

varying vec2 vUv;

float randomish(vec2 c) {
    return fract(sin(dot(c.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float randomNoise(vec2 p) {
    return (randomish(p - vec2(sin(time))) * 2.0 - 1.0) * 0.04;
}

void main() {
    vec2 p = vUv * 2.0 - 1.0;
    vec2 ratio = 1.0 / resolution;

    float rNoise = randomNoise(vUv);

    float textColorR = texture2D(texture, vUv - vec2((2.0 * abs(p.x) + 1.0) * ratio.x, 0.0)).r;
    float textColorG = texture2D(texture, vUv + vec2((2.0 * abs(p.x) + 1.0) * ratio.x, 0.0)).g;
    float textColorB = texture2D(texture, vUv).b;

    vec3 color = vec3(textColorR, textColorG, textColorB) + rNoise;

    gl_FragColor = vec4(color, 1.0)
}