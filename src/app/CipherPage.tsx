"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { caesarEncrypt, vigenereEncrypt, playfairEncrypt, caesarDecrypt, vigenereDecrypt, playfairDecrypt } from "@/lib/ciphers";
import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt";

const CipherPage = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [algorithm, setAlgorithm] = useState("caesar");
  const [shift, setShift] = useState(3);
  const [key, setKey] = useState("КЛЮЧ");
  const [rsaPublicKey, setRsaPublicKey] = useState('');
  const [rsaPrivateKey, setRsaPrivateKey] = useState('');

  // Загрузка файла
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text);
    };
    reader.readAsText(file);
  };

  const aesEncrypt = (text: string, secretKey: string) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
  };

  const aesDecrypt = (ciphertext: string, secretKey: string) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const rsaEncrypt = (text: string, publicKey: string) => {
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey);
    const encrypted = encryptor.encrypt(text);
    return encrypted || "Ошибка шифрования";
  };
  
  const rsaDecrypt = (ciphertext: string, privateKey: string) => {
    const decryptor = new JSEncrypt();
    decryptor.setPrivateKey(privateKey);
    const decrypted = decryptor.decrypt(ciphertext);
    return decrypted || "Ошибка дешифрования";
  };

  // Скачивание результата
  const downloadOutput = () => {
    const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "output.txt";
    link.click();
  };

  const encrypt = () => {
    if (algorithm === "caesar") {
      setOutputText(caesarEncrypt(inputText, shift));
    } else if (algorithm === "vigenere") {
      setOutputText(vigenereEncrypt(inputText, key));
    } else if (algorithm === "playfair") {
      setOutputText(playfairEncrypt(inputText, key));
    } else if (algorithm === "aes") {
      setOutputText(aesEncrypt(inputText, key));
    } else if (algorithm === "rsa") {
      setOutputText(rsaEncrypt(inputText, rsaPublicKey));
    }
  };

  const decrypt = () => {
    if (algorithm === "caesar") {
      setOutputText(caesarDecrypt(inputText, shift));
    } else if (algorithm === "vigenere") {
      setOutputText(vigenereDecrypt(inputText, key));
    } else if (algorithm === "playfair") {
      setOutputText(playfairDecrypt(inputText, key));
    } else if (algorithm === "aes") {
      setOutputText(aesDecrypt(inputText, key));
    } else if (algorithm === "rsa") {
      setOutputText(rsaDecrypt(inputText, rsaPrivateKey));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Шифратор текстов</h1>
  
      <Select onValueChange={(value) => setAlgorithm(value)} defaultValue="caesar">
        <SelectTrigger className="w-[240px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
        <SelectItem value="caesar">Цезарь</SelectItem>
          <SelectItem value="vigenere">Виженер</SelectItem>
          <SelectItem value="playfair">Плейфер</SelectItem>
          <SelectItem value="aes">AES</SelectItem>
          <SelectItem value="rsa">RSA</SelectItem>
        </SelectContent>
      </Select>
  
      {algorithm === "caesar" && (
        <Input
          type="number"
          placeholder="Введите сдвиг"
          value={shift}
          onChange={(e) => setShift(Number(e.target.value))}
          className="w-[240px]"
        />
      )}
  
  {(algorithm === "vigenere" || algorithm === "playfair" || algorithm === "aes") && (
        <Input
          placeholder="Введите ключ"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="w-[240px]"
        />
      )}
{algorithm === "rsa" && (
  <>
    <Textarea
      placeholder="Публичный ключ (для шифрования)"
      value={rsaPublicKey}
      onChange={(e) => setRsaPublicKey(e.target.value)}
      className="w-full max-w-2xl"
    />
    <Textarea
      placeholder="Приватный ключ (для расшифровки)"
      value={rsaPrivateKey}
      onChange={(e) => setRsaPrivateKey(e.target.value)}
      className="w-full max-w-2xl"
    />
  </>
)}
    <div className="my-[20]">
    <input
      className="hidden"
        type="file"
        accept=".txt"
        id="files"
        placeholder="Загрузить файл"
        onChange={handleFileUpload}
      />
      <label className="border hover:cursor-pointer" htmlFor="files">Загрузить файл</label>
    </div>

  
      <Textarea
        placeholder="Введите или загрузите текст"
        className="min-h-[150px] w-full max-w-2xl"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
  
      <div className="flex space-x-4">
        <Button onClick={encrypt}>Зашифровать</Button>
        <Button variant="outline" onClick={decrypt}>Расшифровать</Button>
      </div>
  
      <Textarea
        placeholder="Результат"
        className="min-h-[150px] w-full max-w-2xl"
        value={outputText}
        readOnly
      />
  
      <Button className="p-[10px]" onClick={downloadOutput}>Скачать результат</Button>
    </div>
  );
  
};

export default CipherPage;
