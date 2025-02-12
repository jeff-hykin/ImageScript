const wasm_name = 'png';
const wasm_path = process.env.IMAGESCRIPT_WASM_SIMD ? 'simd' : 'any';

import uint8ArrayForPngWasm from "../any/png.wasm.binaryified.js"

let mod = null;
module.exports = {
  async init() {
    if (!mod) mod = new WebAssembly.Module(uint8ArrayForPngWasm);

    return this.new();
  },

  new() {
    let u8;

    const {
      wfree, walloc, decode, memory,
      width: wwidth, height: wheight,
    } = new WebAssembly.Instance(mod, {
      env: {
        emscripten_notify_memory_growth() {
          u8 = new Uint8Array(memory.buffer);
        },
      },
    }).exports;
  
    u8 = new Uint8Array(memory.buffer);
  
    return {
      decode(buffer) {
        const ptr = walloc(buffer.length);
  
        u8.set(buffer, ptr);
        const status = decode(ptr, buffer.length);
  
        wfree(ptr);
        if (0 > status) throw new Error(`png: failed to decode (${status})`);
  
        const width = wwidth();
        const height = wheight();
        const framebuffer = u8.slice(status, status + 4 * width * height);
  
        wfree(status);
        return { width, height, framebuffer };
      },
    };
  }
}
