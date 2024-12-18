import CryptoJS from 'crypto-js';

class GuidConverter {
  static convertToGuid(input: string) {
    return CryptoJS.MD5(input).toString();
  }
}

export default GuidConverter;
