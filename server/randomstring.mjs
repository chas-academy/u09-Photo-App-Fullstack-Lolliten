import crypto from "crypto";

/* GENERATES A RANDOM STRING OF 256 LETTER TO USE FOR JWT_SECRET */

console.log(crypto.randomBytes(128).toString("hex"))