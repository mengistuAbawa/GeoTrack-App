import{Platform}from'react-native';const host=Platform.OS==='android'?'10.0.2.2':'localhost';export const API_BASE_URL=__DEV__?`http://${host}:5000/api`:'https://YOUR_BACKEND_DOMAIN/api';
