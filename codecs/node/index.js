var module = module||{};module.exports=module.exports||{};
import { arch, platform } from "node:os"
try { module.exports = require(`./bin/${arch()}-${platform()}.node`)/* FIXME: can't auto handle deep require (await import(`./bin/${arch()}-${platform()}.node`)) */; }
catch (err) { throw new Error('unsupported arch/platform: ' + err.message); }
;export default module.exports