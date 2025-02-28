import { Mat3, Mat4, Vec3, Vec4 } from "../lib/TSM.js";

/* A potential interface that students should implement */
interface IMengerSponge {
  setLevel(level: number): void;
  isDirty(): boolean;
  setClean(): void;
  normalsFlat(): Float32Array;
  indicesFlat(): Uint32Array;
  positionsFlat(): Float32Array;
}

/**
 * Represents a Menger Sponge
 */
export class MengerSponge implements IMengerSponge {

  // TODO: sponge data structures
  positions: number[] = [];
  normals: number[] = [];
  indices: number[] = [];
  level = 0;
  dirty: boolean = true;
  constructor(level: number) {
	  this.setLevel(level);
	  // TODO: other initialization	
  }

  /**
   * Returns true if the sponge has changed.
   */
  public isDirty(): boolean {
    return this.dirty;
  }

  public setClean(): void {
    this.dirty = false;
  }
  
  public setLevel(level: number)
  {
    this.level = level;
    this.positions = [];
    this.normals = [];
    this.indices = [];
    this.dirty = true;
    let identity = new Mat4().setIdentity();
    this.generateSponge(identity, level);
  }

  private startingPos() {
    return [
      // -Z
      -0.5, -0.5, -0.5, 1.0,   0.5, -0.5, -0.5, 1.0,   0.5,  0.5, -0.5, 1.0,  -0.5,  0.5, -0.5, 1.0,  
      // +Z
      -0.5, -0.5,  0.5, 1.0,   0.5, -0.5,  0.5, 1.0,   0.5,  0.5,  0.5, 1.0,  -0.5,  0.5,  0.5, 1.0,
      // +X
      0.5, -0.5, -0.5, 1.0,   0.5, -0.5,  0.5, 1.0,   0.5,  0.5,  0.5, 1.0,   0.5,  0.5, -0.5, 1.0,
      // -X
      -0.5, -0.5, -0.5, 1.0,  -0.5, -0.5,  0.5, 1.0,  -0.5,  0.5,  0.5, 1.0,  -0.5,  0.5, -0.5, 1.0,
      // +Y
      -0.5,  0.5, -0.5, 1.0,   0.5,  0.5, -0.5, 1.0,   0.5,  0.5,  0.5, 1.0,  -0.5,  0.5,  0.5, 1.0,
      // -Y
      -0.5, -0.5, -0.5, 1.0,   0.5, -0.5, -0.5, 1.0,   0.5, -0.5,  0.5, 1.0,  -0.5, -0.5,  0.5, 1.0
  ];
  }
  private startingNormals() {
    return [
        // -Z Normals
        0.0,0.0,-1.0,0.0,   0.0,0.0,-1.0,0.0,    0.0,0.0,-1.0,0.0,    0.0,0.0,-1.0,0.0,
        // +Z Normals
        0.0,0.0,1.0,0.0,    0.0,0.0,1.0,0.0,     0.0,0.0,1.0,0.0,     0.0,0.0,1.0,0.0,
        // +X Normals
        1.0,0.0,0.0,0.0,    1.0,0.0,0.0,0.0,     1.0,0.0,0.0,0.0,     1.0,0.0,0.0,0.0,
        // -X Normals
       -1.0,0.0,0.0,0.0,   -1.0,0.0,0.0,0.0,    -1.0,0.0,0.0,0.0,    -1.0,0.0,0.0,0.0,
        // +Y Normals
        0.0,1.0,0.0,0.0,    0.0,1.0,0.0,0.0,     0.0,1.0,0.0,0.0,     0.0,1.0,0.0,0.0,
        // -Y Normals
        0.0,-1.0,0.0,0.0,   0.0,-1.0,0.0,0.0,    0.0,-1.0,0.0,0.0,    0.0,-1.0,0.0,0.0
    ];
  }

  private generateSponge(transform: Mat4, level: number) {
    if (level === 0) {
      for(let p = 0; p < 6; p++) {
        let vecOff = p*16;
        let v1 = new Vec4([this.startingPos()[(vecOff)], this.startingPos()[(vecOff)+1], this.startingPos()[(vecOff)+2], this.startingPos()[(vecOff)+3]]);
        let v2 = new Vec4([this.startingPos()[(vecOff)+4], this.startingPos()[(vecOff)+5], this.startingPos()[(vecOff)+6], this.startingPos()[(vecOff)+7]]);
        let v3 = new Vec4([this.startingPos()[(vecOff)+8], this.startingPos()[(vecOff)+9], this.startingPos()[(vecOff)+10], this.startingPos()[(vecOff)+11]]);
        let v4 = new Vec4([this.startingPos()[(vecOff)+12], this.startingPos()[(vecOff)+13], this.startingPos()[(vecOff)+14], this.startingPos()[(vecOff)+15]]);

        let t1 = transform.multiplyVec4(v1);
        let t2 = transform.multiplyVec4(v2);
        let t3 = transform.multiplyVec4(v3);
        let t4 = transform.multiplyVec4(v4);
        
        let offset = this.positions.length / 4;
        this.positions.push(t1.x, t1.y, t1.z, t1.w);
        this.positions.push(t2.x, t2.y, t2.z, t2.w);
        this.positions.push(t3.x, t3.y, t3.z, t3.w);
        this.positions.push(t4.x, t4.y, t4.z, t4.w);
        
        this.normals.push(...this.startingNormals().slice(p * 16, p * 16 + 16));
        if (p%2 === 1) {
          this.indices.push(offset, offset + 1, offset + 2, offset + 2, offset + 3, offset);
        } else {
          this.indices.push(offset + 2, offset + 1, offset, offset, offset + 3, offset + 2);
        }
      
      }
      return;
    }
    const newScale = 1 / 3;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        for (let k = -1; k < 2; k++) {
          let count = (i === 0 ? 1 : 0) + (j === 0 ? 1 : 0) + (k === 0 ? 1 : 0);
          if (count >= 2) {
            continue; // Skip 
          }
          let scalex = i * newScale;
          let scaley = j * newScale;
          let scalez = k * newScale;
          let translation = new Mat4().setIdentity();
          translation.translate(new Vec3([scalex, scaley, scalez]));
          let newTransform = transform.copy().multiply(translation);
          newTransform.scale(new Vec3([newScale, newScale, newScale]));
          this.generateSponge(newTransform, level - 1);
        }
      }
    }
  }

  /* Returns a flat Float32Array of the sponge's vertex positions */
  public positionsFlat(): Float32Array {
    //return new Float32Array(this.startingPos());
    return new Float32Array(this.positions);
  }

  /**
   * Returns a flat Uint32Array of the sponge's face indices
   */
  public indicesFlat(): Uint32Array {
    //return new Uint32Array(this.startingVertices());
    return new Uint32Array(this.indices);
}

  /**
   * Returns a flat Float32Array of the sponge's normals
   */
  public normalsFlat(): Float32Array {
    //return new Float32Array(this.startingNormals());
    return new Float32Array(this.normals);
}


  /**
   * Returns the model matrix of the sponge
   */
  public uMatrix(): Mat4 {

    // TODO: change this, if it's useful
    const ret : Mat4 = new Mat4().setIdentity();

    return ret;    
  }
  
}