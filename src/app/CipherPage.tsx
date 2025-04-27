"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { caesarEncrypt, vigenereEncrypt, playfairEncrypt, vigenereDecrypt, playfairDecrypt, caesarDecrypt } from "@/lib/ciphers";

const CipherPage = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [algorithm, setAlgorithm] = useState("caesar");
  const [shift, setShift] = useState(3); // Сдвиг для Цезаря
  const [key, setKey] = useState("КЛЮЧ"); // Ключ для Виженера и Плейфера

  const encrypt = () => {
    if (algorithm === "caesar") {
      setOutputText(caesarEncrypt(inputText, shift));
    } else if (algorithm === "vigenere") {
      setOutputText(vigenereEncrypt(inputText, key));
    } else if (algorithm === "playfair") {
      setOutputText(playfairEncrypt(inputText, key));
    }
  };

  const decrypt = () => {
    if (algorithm === "caesar") {
      setOutputText(caesarDecrypt(inputText, shift));
    } else if (algorithm === "vigenere") {
      setOutputText(vigenereDecrypt(inputText, key));
    } else if (algorithm === "playfair") {
      setOutputText(playfairDecrypt(inputText, key));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-black text-white space-y-4">
      <Select onValueChange={(value) => setAlgorithm(value)} defaultValue="caesar">
        <SelectTrigger className="w-[240px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="caesar">Цезарь</SelectItem>
          <SelectItem value="vigenere">Виженер</SelectItem>
          <SelectItem value="playfair">Плейфер</SelectItem>
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

      {(algorithm === "vigenere" || algorithm === "playfair") && (
        <Input
          placeholder="Введите ключ"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="w-[240px]"
        />
      )}

      <Textarea
        placeholder="Введите текст"
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
    </div>
  );
};

export default CipherPage;
