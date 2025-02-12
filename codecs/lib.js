let codecs;

if (process.env.CODECS_FORCE_WASM) codecs = require('./wasm/index.js')/* FIXME: can't auto handle deep require (await import('./wasm/index.js')) */;
else try { codecs = require('./node/index.js')/* FIXME: can't auto handle deep require (await import('./node/index.js')) */; } catch { codecs = require('./wasm/index.js')/* FIXME: can't auto handle deep require (await import('./wasm/index.js')) */; }

throw new Error('todo!');