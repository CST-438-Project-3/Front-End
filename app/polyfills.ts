// // app/polyfills.ts
// import 'whatwg-fetch';
// import { Platform } from 'react-native';
// import 'react-native-url-polyfill/auto';

// // Polyfill URL and URLSearchParams for React Native
// if (Platform.OS !== 'web') {
//   require('react-native-url-polyfill/auto');
// }

// // Polyfill TextEncoder for React Native
// if (typeof TextEncoder === 'undefined') {
//   global.TextEncoder = require('text-encoding').TextEncoder;
// }


// // Polyfill TextDecoder for React Native
// if (typeof TextDecoder === 'undefined') {
//   global.TextDecoder = require('text-encoding').TextDecoder;
// }

// // Polyfill atob and btoa for React Native
// if (typeof global.atob === 'undefined') {
//   global.atob = require('base-64').decode;
// }

// if (typeof global.btoa === 'undefined') {
//   global.btoa = require('base-64').encode;
// }

// // Add any other required polyfills here
// export {};