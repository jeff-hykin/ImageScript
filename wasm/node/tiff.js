const wasm_name = 'tiff';
const wasm_path = process.env.IMAGESCRIPT_WASM_SIMD ? 'simd' : 'any';

import uint8ArrayForTiffWasm from "../any/tiff.wasm.binaryified.js"

let mod = null;
module.exports = {
  async init() {
    if (!mod) mod = new WebAssembly.Module(
        uint8ArrayForTiffWasm
    );

    return this.new();
  },

  new() {
    const wasm = new WebAssembly.Instance(mod).exports;

    class mem {
      static length() { return wasm.wlen(); }
      static alloc(size) { return wasm.walloc(size); }
      static free(ptr, size) { return wasm.wfree(ptr, size); }
      static u8(ptr, size) { return new Uint8Array(wasm.memory.buffer, ptr, size); }
      static u32(ptr, size) { return new Uint32Array(wasm.memory.buffer, ptr, size); }

      static copy_and_free(ptr, size) {
        let slice = mem.u8(ptr, size).slice();
        return (wasm.wfree(ptr, size), slice);
      }
    }

    function decode(buffer) {
      const bptr = mem.alloc(buffer.length);
      mem.u8(bptr, buffer.length).set(buffer);
      const ptr = wasm.decode(bptr, buffer.length);
      if (0 === ptr) throw new Error('tiff: failed to decode');

      const framebuffer = {
        width: wasm.decode_width(ptr),
        height: wasm.decode_height(ptr),
        buffer: mem.u8(wasm.decode_buffer(ptr), mem.length()).slice(),
      }

      return (wasm.decode_free(ptr), framebuffer);
    }

    return { decode, load: decode };
  }
}