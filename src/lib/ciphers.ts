export const caesarEncrypt = (text: string, shift: number): string => {
    return text.replace(/[a-zа-яё]/gi, (char) => {
      const isUpper = char === char.toUpperCase();
      const alphabet = /[а-яё]/i.test(char) ? "абвгдеёжзийклмнопрстуфхцчшщъыьэюя" : "abcdefghijklmnopqrstuvwxyz";
      const index = alphabet.indexOf(char.toLowerCase());
      if (index === -1) return char;
      const newIndex = (index + shift + alphabet.length) % alphabet.length;
      const newChar = alphabet[newIndex];
      return isUpper ? newChar.toUpperCase() : newChar;
    });
  }

export const caesarDecrypt = (text: string, shift: number): string =>{
    return caesarEncrypt(text, -shift);
  }
  
export const vigenereEncrypt = (text: string, key: string): string =>{
    let result = "";
    const alphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяabcdefghijklmnopqrstuvwxyz";
    const len = alphabet.length;
    key = key.toLowerCase().replace(/[^а-яa-zё]/g, "");
  
    let keyIndex = 0;
    for (const char of text) {
      const lowerChar = char.toLowerCase();
      const idx = alphabet.indexOf(lowerChar);
      if (idx === -1) {
        result += char;
        continue;
      }
  
      const keyChar = key[keyIndex % key.length];
      const keyShift = alphabet.indexOf(keyChar);
      const shiftedChar = alphabet[(idx + keyShift) % len];
      result += char === lowerChar ? shiftedChar : shiftedChar.toUpperCase();
      keyIndex++;
    }
  
    return result;
  }
  
  export const vigenereDecrypt = (text: string, key: string): string =>{
    let result = "";
    const alphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяabcdefghijklmnopqrstuvwxyz";
    const len = alphabet.length;
    key = key.toLowerCase().replace(/[^а-яa-zё]/g, "");
  
    let keyIndex = 0;
    for (const char of text) {
      const lowerChar = char.toLowerCase();
      const idx = alphabet.indexOf(lowerChar);
      if (idx === -1) {
        result += char;
        continue;
      }
  
      const keyChar = key[keyIndex % key.length];
      const keyShift = alphabet.indexOf(keyChar);
      const shiftedChar = alphabet[(idx - keyShift + len) % len];
      result += char === lowerChar ? shiftedChar : shiftedChar.toUpperCase();
      keyIndex++;
    }
  
    return result;
  }

  function generatePlayfairMatrix(key: string): string[] {
    key = key.toUpperCase().replace(/[^A-Z]/g, "").replace(/J/g, "I");
    const seen = new Set<string>();
    let matrix = "";
  
    for (const char of key + "ABCDEFGHIKLMNOPQRSTUVWXYZ") {
      if (!seen.has(char)) {
        seen.add(char);
        matrix += char;
      }
    }
  
    return matrix.split("");
  }
  
  export const playfairEncrypt = (text: string, key: string): string=> {
    const matrix = generatePlayfairMatrix(key);
    text = text.toUpperCase().replace(/[^A-Z]/g, "").replace(/J/g, "I");
  
    // Разбиваем на биграммы
    const bigrams: string[] = [];
    for (let i = 0; i < text.length; i += 2) {
      const first = text[i];
      const second = text[i + 1] || "X";
      bigrams.push(first + (first === second ? "X" + second : second));
    }
  
    let result = "";
  
    for (const bigram of bigrams) {
      const a = matrix.indexOf(bigram[0]);
      const b = matrix.indexOf(bigram[1]);
  
      const rowA = Math.floor(a / 5);
      const colA = a % 5;
      const rowB = Math.floor(b / 5);
      const colB = b % 5;
  
      if (rowA === rowB) {
        result += matrix[rowA * 5 + (colA + 1) % 5];
        result += matrix[rowB * 5 + (colB + 1) % 5];
      } else if (colA === colB) {
        result += matrix[((rowA + 1) % 5) * 5 + colA];
        result += matrix[((rowB + 1) % 5) * 5 + colB];
      } else {
        result += matrix[rowA * 5 + colB];
        result += matrix[rowB * 5 + colA];
      }
    }
  
    return result;
  }
  
export const playfairDecrypt = (text: string, key: string): string =>{
    const matrix = generatePlayfairMatrix(key);
    text = text.toUpperCase().replace(/[^A-Z]/g, "").replace(/J/g, "I");
  
    let result = "";
  
    for (let i = 0; i < text.length; i += 2) {
      const a = matrix.indexOf(text[i]);
      const b = matrix.indexOf(text[i + 1]);
  
      const rowA = Math.floor(a / 5);
      const colA = a % 5;
      const rowB = Math.floor(b / 5);
      const colB = b % 5;
  
      if (rowA === rowB) {
        result += matrix[rowA * 5 + (colA + 4) % 5];
        result += matrix[rowB * 5 + (colB + 4) % 5];
      } else if (colA === colB) {
        result += matrix[((rowA + 4) % 5) * 5 + colA];
        result += matrix[((rowB + 4) % 5) * 5 + colB];
      } else {
        result += matrix[rowA * 5 + colB];
        result += matrix[rowB * 5 + colA];
      }
    }
  
    return result;
  }
  
  