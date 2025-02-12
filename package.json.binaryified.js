let output = `{
  "name": "imagescript",
  "version": "1.3.0",
  "description": "zero-dependency javascript image manipulation",
  "main": "ImageScript.js",
  "types": "ImageScript.d.ts",
  "scripts": {
    "test": "node ./tests/run.js",
    "coverage": "nyc --reporter=html npm test"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/matmen/ImageScript.git"
  },
  "keywords": [
    "image",
    "image processing",
    "image manipulation",
    "png",
    "jpeg",
    "jpg",
    "scale",
    "resize",
    "crop",
    "webp",
    "svg",
    "bitmap",
    "gif",
    "picture",
    "thumbnail"
  ],
  "author": "Mathis Mensing <mathis@matmen.dev>",
  "license": "(AGPL-3.0-or-later OR MIT)",
  "bugs": {
    "url": "https://github.com/matmen/ImageScript/issues"
  },
  "homepage": "https://github.com/matmen/ImageScript#readme",
  "engines": {
    "node": ">=14.0.0"
  }
}
`
const relativePathToOriginal = "package.json"
try {
    if (relativePathToOriginal && globalThis?.Deno?.readFileSync instanceof Function) {
        const { FileSystem } = await import("https://deno.land/x/quickr@0.6.72/main/file_system.js")
        // equivlent to: import.meta.resolve(relativePathToOriginal)
        // but more bundler-friendly
        const path = `${FileSystem.thisFolder}/${relativePathToOriginal}`
        const current = await Deno.readTextFile(path)
        const original = output
        output = current

        // update the file whenever (no await)
        const thisFile = FileSystem.thisFile // equivlent to: import.meta.filename, but more bundler-friendly
        setTimeout(async () => {
            try {
                const changeOccured = !(current.length == original.length && current.every((value, index) => value == original[index]))
                // update this file
                if (changeOccured) {
                    const { binaryify } = await import("https://deno.land/x/binaryify@2.5.4.1/binaryify_api.js")
                    await binaryify({
                        pathToBinary: path,
                        pathToBinarified: thisFile,
                        forceExportString: true,
                    })
                }
            } catch (e) {
            }
        }, 0)
    }
} catch (e) {
    
}
        
export default output