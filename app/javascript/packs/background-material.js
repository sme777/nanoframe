import * as THREE from 'three'
 
export class DnaHelix extends THREE.Points {
    constructor() {
        const geometry = new THREE.BufferGeometry()

        const numHelix = 6000
        const numLineSpace = 60
        const numLine = 100
        const numAmount = numHelix + numLineSpace * numLine

        const baPositions = new THREE.BufferAttribute(new Float32Array(numAmount * 3), 3)
        const baRadians = new THREE.BufferAttribute(new Float32Array(numAmount), 1)
        const baRadiuses = new THREE.BufferAttribute(new Float32Array(numAmount), 1)
        const baDelays = new THREE.BufferAttribute(new Float32Array(numAmount), 1)
        // possible bug in the loop
        for (let i = 0; i < numHelix; i++) {
            const random = Math.random()
            const diff = {
                x: (Math.random() * 2 - 1) * random * 6,
                y: (Math.random() * 2 - 1) * random * 6,
                z: (Math.random() * 2 - 1) * random * 6,
            }
            baPositions.setXYZ(
                i,
                ((i / numHelix) * 2 - 1) * 150 + diff.x,
                diff.y,
                diff.z
            )
            baRadians.setX(i, (i / numHelix * 900 + i % 2 * 180)* Math.PI / 180)
            baRadiuses.setX(i, 18)
            baDelays.setX(i, (Math.random() * 360)* Math.PI / 180)
        }

        for (var j = 0; j < numLineSpace; j++) {
            const radians = (j / numLineSpace * 900)* Math.PI / 180
            for (var k = 0; k < numLine; k++) {
                const index = j * numLine + k + numHelix
                const random = Math.random()
                const diff = {
                x: (Math.random() * 2 - 1) * random * 1,
                y: (Math.random() * 2 - 1) * random * 1,
                z: (Math.random() * 2 - 1) * random * 1,
                }
                baPositions.setXYZ(
                index,
                ((j / numLineSpace) * 2 - 1) * 150 + diff.x,
                diff.y,
                diff.z
                )
                baRadians.setX(index, radians)
                baRadiuses.setX(index, (k / numLine * 2 - 1) * 18)
                baDelays.setX(index, (Math.random() * 360)* Math.PI / 180)
            }
        }
        geometry.setAttribute('positions', baPositions)
        geometry.setAttribute('radian', baRadians)
        geometry.setAttribute('radius', baRadiuses)
        geometry.setAttribute('delay', baDelays)

        // Define Material
        let material = new THREE.RawShaderMaterial({
            uniforms: {
                time: {
                    type: 'f',
                    value: 0
                },
            },
            vertexShader: `
            attribute vec3 position;
            attribute float radian;
            attribute float radius;
            attribute float delay;

            uniform mat4 projectionMatrix;
            uniform mat4 viewMatrix;
            uniform mat4 modelMatrix;
            uniform float time;

            varying vec3 vColor;

            void main() {
            // coordinate transformation
            vec3 updatePosition = position + vec3(
                sin(time * 4.0 + delay),
                sin(radian + time * 0.4) * (radius + sin(time * 4.0 + delay)),
                cos(radian + time * 0.4) * (radius + sin(time * 4.0 + delay))
                );
            vec4 mvPosition = viewMatrix * modelMatrix * vec4(updatePosition, 1.0);
            float distanceFromCamera = length(mvPosition.xyz);
            float pointSize = 1000.0 / distanceFromCamera * 1.6;

            vColor = vec3(0.8 - delay * 0.1, 0.6, 0.6);

            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = pointSize;
            }
            `,
            fragmentShader: `
            precision mediump float;

            varying vec3 vColor;

            void main() {
            // Convert PointCoord to the other vec2 has a range from -1.0 to 1.0.
            vec2 p = gl_PointCoord * 2.0 - 1.0;

            // Draw circle
            float radius = length(p);
            float opacity1 = (1.0 - smoothstep(0.5, 0.7, radius));
            float opacity2 = smoothstep(0.8, 1.0, radius) * (1.0 - smoothstep(1.0, 1.2, radius));

            gl_FragColor = vec4(vColor, (opacity1 + opacity2) * 0.5);
            }
            `,
            transparent: true,
            depthWrite: false,
        })
        //console.log(WebGLRenderingContext.getShaderInfoLog(material.vertexShader))
        // let f = material.compileShader(material.vertexShader)
        // console.log(f)
        super(geometry, material)
        this.name = 'DNA Helix'
    }

    render(time) {
        this.material.uniforms.time.value += time;
    }

}


export class PostEffect {
    constructor(texture) {
        this.uniforms = {
            time: {
                type: 'f',
                value: 0,
            },
            texture: {
                type: 't',
                value: texture,
            },
            resolution: {
                type: 'v2',
                value: new THREE.Vector2(),
            },
        }
        this.obj
    }

    createObj() {
        const geometry = new THREE.PlaneGeometry(2, 2)

        let material = new THREE.RawShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: `
            attribute vec3 position;
            attribute vec2 uv;

            varying vec2 vUv;

            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
            `,
            fragmentShader: `
            precision mediump float;

            uniform float time;
            uniform sampler2D texture;
            uniform vec2 resolution;

            varying vec2 vUv;

            float random2(vec2 c){
            return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
            }
            float randomNoise(vec2 p) {
            return (random2(p - vec2(sin(time))) * 2.0 - 1.0) * 0.04;
            }

            void main() {
            // Convert uv to the other vec2 has a range from -1.0 to 1.0.
            vec2 p = vUv * 2.0 - 1.0;
            vec2 ratio = 1.0 / resolution;

            // Random Noise
            float rNoise = randomNoise(vUv);

            // RGB Shift
            float texColorR = texture2D(texture, vUv - vec2((2.0 * abs(p.x) + 1.0) * ratio.x, 0.0)).r;
            float texColorG = texture2D(texture, vUv + vec2((2.0 * abs(p.x) + 1.0) * ratio.x, 0.0)).g;
            float texColorB = texture2D(texture, vUv).b;

            // Sum total of colors.
            vec3 color = vec3(texColorR, texColorG, texColorB) + rNoise;

            gl_FragColor = vec4(vec3(texColorR, texColorG, texColorB) + rNoise, 1.0);
            }
            `,
        })

        this.obj = new THREE.Mesh(geometry, material)
        this.obj.name = "PostEffect" 
    }

    resize(x, y) {
        this.uniforms.resolution.value.set(x, y)
    }

    render(time) {
        this.uniforms.time.value += time
    }
}
