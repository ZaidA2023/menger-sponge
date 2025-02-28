export let defaultVSText = `
    precision mediump float;

    attribute vec3 vertPosition;
    attribute vec3 vertColor;
    attribute vec4 aNorm;
    
    varying vec4 lightDir;
    varying vec4 normal;   
 
    uniform vec4 lightPosition;
    uniform mat4 mWorld;
    uniform mat4 mView;
	uniform mat4 mProj;

    void main () {
		//  Convert vertex to camera coordinates and the NDC
        gl_Position = mProj * mView * mWorld * vec4 (vertPosition, 1.0);
        
        //  Compute light direction (world coordinates)
        lightDir = lightPosition - vec4(vertPosition, 1.0);
		
        //  Pass along the vertex normal (world coordinates)
        normal = aNorm;
    }
`;

// TODO: Write the fragment shader

export let defaultFSText = `
    precision mediump float;

    varying vec4 lightDir;
    varying vec4 normal;
	
    
    void main () {
      float dotp = clamp(dot(lightDir.xyz, normal.xyz), 0.0, 1.0);

      if(dotp < 0.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      } else {
        gl_FragColor = vec4(dotp, dotp, dotp, 1.0) * vec4(abs(normal.xyz), 1.0);
      }
    }
`;

// TODO: floor shaders
export let floorVSText = `
    precision mediump float;

    attribute vec3 vertPosition;

    uniform mat4 mView;
	uniform mat4 mProj;

    varying vec3 worldPosition;

    void main() {
        gl_Position = mProj * mView * vec4 (vertPosition, 1.0);
        worldPosition = vertPosition;
    }
`;
export let floorFSText = `
    precision mediump float;

    varying vec3 worldPosition;

    void main () {
        if (mod(worldPosition.x, 10.0) < 5.0 ^^ mod(worldPosition.z, 10.0) < 5.0) {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        } else {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        }
    }
`;

