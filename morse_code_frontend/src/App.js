import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// Morse code dictionaries
const TEXT_TO_MORSE = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "'": ".----.",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  "_": "..--.-",
  "\"": ".-..-.",
  "$": "...-..-",
  "@": ".--.-.",
  " ": "/"
};

const MORSE_TO_TEXT = {};
Object.keys(TEXT_TO_MORSE).forEach(key => {
  MORSE_TO_TEXT[TEXT_TO_MORSE[key]] = key;
});

// PUBLIC_INTERFACE
function textToMorse(text) {
  /**
   * Convert plain text to Morse code.
   *
   * @param {string} text - The input text.
   * @returns {string} Morse code representation.
   */
  return text
    .toUpperCase()
    .split("")
    .map(char => TEXT_TO_MORSE[char] || "")
    .filter(Boolean)
    .join(" ");
}

// PUBLIC_INTERFACE
function morseToText(morse) {
  /**
   * Convert Morse code to plain text.
   *
   * @param {string} morse - The Morse code input.
   * @returns {string} Decoded plain text.
   */
  return morse
    .replace(/\//g, " / ")
    .split(" ")
    .map(code => MORSE_TO_TEXT[code] === "/" ? " " : MORSE_TO_TEXT[code] || "")
    .join("")
    .replace(/  +/g, " ")
    .trim();
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Morse Code Converter main React component.
   *
   * Features:
   * - Converts text <--> Morse code
   * - Copy-to-clipboard
   * - Keeps a history of conversions
   * - Responsive modern minimalistic UI (card centered)
   */
  const [conversionMode, setConversionMode] = useState("text-to-morse");
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [history, setHistory] = useState([]);
  const [copyFeedback, setCopyFeedback] = useState("");
  const [theme] = useState("light"); // Light only per requirements; keep theme constant.
  const outputRef = useRef();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  function handleConvert() {
    /**
     * Converts the input according to selected mode and logs to history.
     */
    if (!inputValue.trim()) {
      setOutputValue("");
      return;
    }

    let result = "";
    if (conversionMode === "text-to-morse") {
      result = textToMorse(inputValue);
    } else {
      result = morseToText(inputValue);
    }
    setOutputValue(result);

    if (result.trim() !== "") {
      setHistory(prev =>
        [
          {
            mode: conversionMode,
            input: inputValue,
            output: result,
            date: new Date()
          },
          ...prev
        ].slice(0, 10)
      );
    }
  }

  // PUBLIC_INTERFACE
  function handleSwap() {
    /**
     * Switches conversion direction and swaps input and output fields.
     */
    setConversionMode(prev =>
      prev === "text-to-morse" ? "morse-to-text" : "text-to-morse"
    );
    setInputValue(outputValue);
    setOutputValue(inputValue);
  }

  // PUBLIC_INTERFACE
  function handleInputChange(e) {
    setInputValue(e.target.value);
    setOutputValue("");
  }

  // PUBLIC_INTERFACE
  function handleCopy() {
    /**
     * Copies output to clipboard.
     */
    if (!outputValue) return;
    navigator.clipboard.writeText(outputValue.trim());
    setCopyFeedback("Copied!");
    setTimeout(() => setCopyFeedback(""), 1200);
  }

  // PUBLIC_INTERFACE
  function handleKeyDown(e) {
    // Allow pressing Enter+Ctrl to convert in textarea.
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleConvert();
    }
  }

  // Render helpers
  const inputLabel =
    conversionMode === "text-to-morse" ? "Text Input" : "Morse Input";
  const inputPlaceholder =
    conversionMode === "text-to-morse"
      ? "Type your message here"
      : "Type your Morse code here (use . and -)";
  const outputLabel =
    conversionMode === "text-to-morse" ? "Morse Code" : "Text Output";
  const outputPlaceholder =
    conversionMode === "text-to-morse"
      ? "Translated message in Morse code"
      : "Translated message in Text";

  // App Layout: centered card, top logo/title, conversion fields, controls, history.
  return (
    <div className="App" style={{ background: "var(--bg-primary)" }}>
      <main className="morse-main-card">
        {/* Logo/title */}
        <div className="morse-logo-bar">
          <img
            src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f42ba67b-7e61-481e-90a0-2c5ea363fcdf"
            alt="Logo"
            className="morse-logo"
            draggable={false}
          />
          <span className="morse-title">Morse Code Converter</span>
        </div>
        {/* Card */}
        <section className="morse-card">
          <div className="morse-fields">
            <div className="morse-input-area">
              <label className="morse-label" htmlFor="morse-input">
                {inputLabel}
              </label>
              <textarea
                id="morse-input"
                className="morse-textarea"
                rows={conversionMode === "text-to-morse" ? 3 : 4}
                placeholder={inputPlaceholder}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
            <div className="morse-arrows-bar">
              <button
                className="morse-action-btn"
                aria-label="Switch conversion direction"
                title="Swap conversion direction"
                onClick={handleSwap}
              >
                <span style={{ fontWeight: 500, fontSize: 15 }}>⇄</span>
              </button>
            </div>
            <div className="morse-output-area">
              <label className="morse-label" htmlFor="morse-output">
                {outputLabel}
              </label>
              <textarea
                id="morse-output"
                className="morse-textarea morse-output"
                placeholder={outputPlaceholder}
                value={outputValue}
                readOnly
                ref={outputRef}
              />
            </div>
          </div>
          <div className="morse-button-row">
            <button
              className="morse-convert-btn"
              aria-label="Convert"
              onClick={handleConvert}
              disabled={!inputValue.trim()}
            >
              Convert
            </button>
            <button
              className="morse-copy-btn"
              aria-label="Copy output"
              onClick={handleCopy}
              disabled={!outputValue}
              title="Copy result to clipboard"
            >
              {copyFeedback || "Copy"}
            </button>
          </div>
        </section>
        {/* History */}
        <section className="morse-history-section">
          <h3 className="morse-history-title">Conversion History</h3>
          {history.length === 0 ? (
            <div className="morse-history-placeholder">No history yet.</div>
          ) : (
            <ul className="morse-history-list">
              {history.map((entry, idx) => (
                <li className="morse-history-item" key={idx}>
                  <span className="morse-history-mode">
                    {entry.mode === "text-to-morse"
                      ? "T→M"
                      : "M→T"}
                  </span>
                  <span className="morse-history-in">{entry.input}</span>
                  <span className="morse-history-arrow">→</span>
                  <span className="morse-history-out">{entry.output}</span>
                  <span className="morse-history-date">
                    {entry.date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit"
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <footer className="morse-footer">
          <span>
            &copy; {new Date().getFullYear()} Morse Code Converter. Modern minimal UI inspired by Figma.
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
