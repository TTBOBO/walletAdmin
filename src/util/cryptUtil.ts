// import CryptoJS from "crypto-js";
//
// /**
//  * 加密（需要先加载lib/aes/aes.min.js文件）
//  */
// export const encrypt = (word: string): string => {
//     let key = CryptoJS.enc.Utf8.parse("46cc793c53dc451b");
//     let srcs = CryptoJS.enc.Utf8.parse(word);
//     let encrypted = CryptoJS.AES.encrypt(srcs, key, {
//         mode: CryptoJS.mode.ECB,
//         paddilng: CryptoJS.pad.Pkcs7
//     });
//     return encrypted.toString();
// };
// /**
//  * 解密
//  */
// export const decrypt = (word: string): string => {
//     let key = CryptoJS.enc.Utf8.parse("46cc793c53dc451b");
//     let decrypt = CryptoJS.AES.decrypt(word, key, {
//         mode: CryptoJS.mode.ECB,
//         padding: CryptoJS.pad.Pkcs7
//     });
//     return CryptoJS.enc.Utf8.stringify(decrypt).toString();
// };
