const setupForm = document.getElementById("setup-form");
const styledTypedText = document.getElementById("typed-text");
const typingTextLive = document.getElementById("typing-text-live");
const modeSelect = document.getElementById("mode-select");
const timerSelect = document.getElementById("timer");
const customTimerInput = document.getElementById("custom-timer");
const customText = document.getElementById("custom-text");
const saveTextBtn = document.getElementById("save-text-btn");
const viewSavedBtn = document.getElementById("view-saved-btn");
const predefinedTextRadio = document.getElementById("predefined-text-radio");
const customTextRadio = document.getElementById("custom-text-radio");
const wordLimitGroup = document.getElementById("word-limit-group");
const wordCountDiv = document.getElementById("word-count");
const uploadContainer = document.getElementById("upload-container");
const wordLimitSelect = document.getElementById("wordLimit");
const customWordLimitInput = document.getElementById("customWordLimit");
const typingTest = document.getElementById("typing-test");
let typingInput = document.getElementById("typing-input");
const testResults = document.getElementById("test-results");
const testAnalysis = document.getElementById("test-analysis");
const timerDisplay = document.getElementById("timer-display");
const endTest = document.getElementById("end-test");
const bottomSection = document.querySelector(".bottom-section");
const endTestContainer = document.querySelector(".end-test-container");
const websiteHeading = document.getElementById("website-heading");
const reloadButton = document.getElementById("reload-button");
const generateTextButton = document.getElementById("generate-btn");
const aiContainer = document.getElementById("ai-container");
const noLimitOption = document.getElementById("no-limit-option");
const typingMode = document.getElementById("mode-select").value;
// Add these global variables
let interval;
let startTime;
let elapsedTime;
let remainingTime;
let timerStarted = false;
// let excessCharacters = '';

// Show/hide sections based on initial selection
if (predefinedTextRadio.checked) {
  wordLimitGroup.style.display = "flex"; // Changed from 'block' to 'flex'
  uploadContainer.style.display = "none";
}
predefinedTextRadio.addEventListener("change", () => {
  noLimitOption.style.display = "none";
  wordLimitSelect.value = "100";
  wordLimitGroup.style.display = "flex"; // Changed from 'block' to 'flex'
  uploadContainer.style.display = "none";
  customWordLimitInput.disabled = false;
  aiContainer.style.display = "none";
});

customTextRadio.addEventListener("change", () => {
  // wordLimitSelect.value = noLimitOption.value;
  // noLimitOption.style.display = '';
  wordLimitSelect.value = "100";
  customWordLimitInput.value = "";
  customWordLimitInput.disabled = true;
  // Keep word limit group visible for custom text too
  wordLimitGroup.style.display = "flex";
  uploadContainer.style.display = "block";
  aiContainer.style.display = "block";
  // Update word count against limit
  updateWordCount();
  // NEW: Check if saved texts exist and toggle the View Saved Texts button
  let saved = JSON.parse(localStorage.getItem("savedTexts") || "[]");
  if (saved.length > 0) {
    viewSavedBtn.style.display = "inline-block";
  } else {
    viewSavedBtn.style.display = "none";
  }
});

// Toggle custom word count input
wordLimitSelect.addEventListener("change", () => {
  if (wordLimitSelect.value === "custom") {
    customWordLimitInput.style.display = "inline-block";
    customWordLimitInput.required = true;
    customWordLimitInput.disabled = false;
  } else {
    customWordLimitInput.style.display = "none";
    customWordLimitInput.required = false;
    customWordLimitInput.disabled = true;
  }
});

document.getElementById("upload-btn").addEventListener("click", () => {
  document.getElementById("file-input").click();
});

document.getElementById("file-input").addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    const reader = new FileReader();
    reader.onload = (event) => {
      // Process file content through our comprehensive text cleaning function
      cleanAndPasteText(event.target.result, customText);
      e.target.value = ""; // clear file input to avoid conflicts
    };
    reader.readAsText(e.target.files[0]);
  }
});

/**
 * Comprehensive function to clean and paste text into a contenteditable element
 * Handles: non-English characters removal, converting formatting (superscript/subscript) to normal text,
 * quote/dash normalization, and proper cursor positioning
 */
function cleanAndPasteText(text, targetElement) {
  if (!text || !targetElement) return;

  // Step 1: Clean the text
  let cleanedText = text;

  // Convert HTML superscript/subscript to normal text instead of removing
  cleanedText = cleanedText.replace(
    /<sup>(.*?)<\/sup>/gi,
    function (match, group) {
      // Convert superscript numbers to normal numbers
      return group;
    }
  );

  cleanedText = cleanedText.replace(
    /<sub>(.*?)<\/sub>/gi,
    function (match, group) {
      // Convert subscript numbers to normal numbers
      return group;
    }
  );

  // Convert Unicode superscript characters to normal characters
  const superscriptMap = {
    // Numbers
    "⁰": "0",
    "¹": "1",
    "²": "2",
    "³": "3",
    "⁴": "4",
    "⁵": "5",
    "⁶": "6",
    "⁷": "7",
    "⁸": "8",
    "⁹": "9",

    // Operators and symbols
    "⁺": "+",
    "⁻": "-",
    "⁼": "=",
    "⁽": "(",
    "⁾": ")",
    "⁄": "/",
    "⁎": "*",
    "˙": ".",
    "‸": "^",
    "˚": "°",
    "∗": "*",
    "□": "#",
    "⁀": "~",
    "´": "'",
    "˝": '"',
    "˂": "<",
    "˃": ">",
    "˄": "^",
    "˅": "v",
    "˜": "~",
    "˟": "x",
    "‍ᵏ": "k",
    "˒": ",",
    "˓": "!",
    "˔": "?",
    "˕": ";",
    "˖": "+",
    "˗": "-",
    "˘": "`",
    ᵉⁿ: "en",

    // Lowercase letters
    ᵃ: "a",
    ᵇ: "b",
    ᶜ: "c",
    ᵈ: "d",
    ᵉ: "e",
    ᶠ: "f",
    ᵍ: "g",
    ʰ: "h",
    ⁱ: "i",
    ʲ: "j",
    ᵏ: "k",
    ˡ: "l",
    ᵐ: "m",
    ⁿ: "n",
    ᵒ: "o",
    ᵖ: "p",
    ᵠ: "q",
    ʳ: "r",
    ˢ: "s",
    ᵗ: "t",
    ᵘ: "u",
    ᵛ: "v",
    ʷ: "w",
    ˣ: "x",
    ʸ: "y",
    ᶻ: "z",

    // Uppercase letters
    ᴬ: "A",
    ᴮ: "B",
    ᶜ: "C",
    ᴰ: "D",
    ᴱ: "E",
    ᶠ: "F",
    ᴳ: "G",
    ᴴ: "H",
    ᴵ: "I",
    ᴶ: "J",
    ᴷ: "K",
    ᴸ: "L",
    ᴹ: "M",
    ᴺ: "N",
    ᴼ: "O",
    ᴾ: "P",
    ᵠ: "Q",
    ᴿ: "R",
    ˢ: "S",
    ᵀ: "T",
    ᵁ: "U",
    ⱽ: "V",
    ᵂ: "W",
    ˣ: "X",
    ʸ: "Y",
    ᶻ: "Z",
  };

  // Convert Unicode subscript characters to normal characters
  const subscriptMap = {
    // Numbers
    "₀": "0",
    "₁": "1",
    "₂": "2",
    "₃": "3",
    "₄": "4",
    "₅": "5",
    "₆": "6",
    "₇": "7",
    "₈": "8",
    "₉": "9",

    // Operators and symbols
    "₊": "+",
    "₋": "-",
    "₌": "=",
    "₍": "(",
    "₎": ")",
    "₣": "f",
    "₤": "L",
    "₧": "Pts",
    "₨": "Rs",
    "₩": "W",
    "₪": "NS",
    "₫": "d",
    "€": "E",
    "₭": "K",
    "₮": "T",
    "₯": "Dr",
    "₰": "Pf",
    "₱": "P",
    "₲": "G",
    "₳": "A",
    "₴": "UAH",
    "₵": "C",
    "₸": "T",
    "₹": "Rs",
    "₺": "TL",
    "₼": "man",
    "₽": "P",
    "₾": "GEL",
    "₿": "B",

    // Lowercase letters
    ₐ: "a",
    ₑ: "e",
    ₕ: "h",
    ᵢ: "i",
    ⱼ: "j",
    ₖ: "k",
    ₗ: "l",
    ₘ: "m",
    ₙ: "n",
    ₒ: "o",
    ₚ: "p",
    ᵣ: "r",
    ₛ: "s",
    ₜ: "t",
    ᵤ: "u",
    ᵥ: "v",
    ₓ: "x",
    ᵦ: "b",
    ᵧ: "y",
    ᵨ: "p",
    ᵩ: "φ",
    ᵪ: "x",
    ₔ: "q",
    ₕ: "h",
    ₖ: "k",
    ₙ: "n",
    ₚ: "p",
    ₛ: "s",
    ₜ: "t",
    ₓ: "x",
    ₐ: "a",
    ₑ: "e",
    ᵦ: "β",
    ᵧ: "γ",
    ᵨ: "ρ",
    ᵩ: "φ",
  };

  // Preserve ASCII characters and convert Unicode superscript/subscript
  let result = "";
  for (let i = 0; i < cleanedText.length; i++) {
    const char = cleanedText[i];

    // Check if the character is in the superscript map
    if (superscriptMap[char]) {
      result += superscriptMap[char];
    }
    // Check if the character is in the subscript map
    else if (subscriptMap[char]) {
      result += subscriptMap[char];
    }
    // If it's an ASCII character or space, keep it
    else if (/[\x00-\x7F\s]/.test(char)) {
      result += char;
    }
    // Otherwise, it's a non-ASCII character we want to exclude
  }

  // Update cleanedText with our converted result
  cleanedText = result;

  // Normalize quotes and dashes
  cleanedText = sanitizeQuotesAndDashes(cleanedText);

  // Convert non-breaking spaces to regular spaces
  // cleanedText = cleanedText.replace(/\u00A0/g, ' ');

  // Step 2: Insert the cleaned text into the target element
  targetElement.focus();
  const selection = window.getSelection();

  if (selection.rangeCount > 0) {
    // Delete any currently selected text
    selection.deleteFromDocument();

    // Insert the cleaned text as a plain text node
    const textNode = document.createTextNode(cleanedText);
    selection.getRangeAt(0).insertNode(textNode);

    // Move cursor to the end of inserted text
    const range = document.createRange();
    range.setStartAfter(textNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    // If no selection range, just set the content directly
    targetElement.innerText = cleanedText;
  }

  // Step 3: Update UI and trigger events
  if (targetElement.id === "custom-text") {
    updateWordCount();
  }

  // Trigger input event after paste so that UI updates appropriately
  targetElement.dispatchEvent(new Event("input", { bubbles: true }));
}

// Update the paste event handler for #custom-text to use the new function:
customText.addEventListener("paste", function (e) {
  e.preventDefault();
  let pastedData = (e.clipboardData || window.clipboardData).getData("text");
  cleanAndPasteText(pastedData, customText);
});

customText.addEventListener("input", function () {
  if (this.innerText) {
    this.classList.remove("input-error");
  }
  updateWordCount();
});

function sanitizeQuotesAndDashes(str) {
  // Convert fancy quotes (single and double) and em dashes to their standard forms
  return str.replace(/['']/g, "'").replace(/[""]/g, '"').replace(/[—–]/g, "--"); // Added en dash to the replacements
}

timerSelect.addEventListener("change", () => {
  if (timerSelect.value === "custom") {
    customTimerInput.style.display = "block";
    customTimerInput.required = true;
  } else {
    customTimerInput.style.display = "none";
    customTimerInput.required = false;
  }
});

setupForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  // Get the selected word limit
  let wordLimit = parseInt(wordLimitSelect.value);
  if (wordLimitSelect.value === "custom") {
    wordLimit = parseInt(customWordLimitInput.value) || 50;
  }

  // Check which radio is selected
  if (predefinedTextRadio.checked) {
    // Generate random text
    const predefinedText = await getPredefinedWords(wordLimit);
    startTypingTest(predefinedText, resolveSelectedTime());
  } else {
    // Handle custom text with preserved whitespace
    const customTextContent = customText.innerText.replace(/\u00A0/g, " ");

    if (!customTextContent.trim()) {
      // Still check if it's empty after trimming
      customText.classList.add("input-error");
      return;
    } else {
      customText.classList.remove("input-error");
    }

    // Truncate custom text to word limit
    const truncatedText = truncateTextToWordLimit(customTextContent, wordLimit);
    startTypingTest(truncatedText, resolveSelectedTime());
  }
});

// Function to truncate text to a specified word limit
function truncateTextToWordLimit(text, limit) {
  // Split by whitespace but keep the whitespace in the result
  const words = text.match(/\S+/g) || [];

  if (words.length <= limit) {
    return text; // No truncation needed
  }

  // Find the position of the end of the limit-th word
  let pos = -1;
  let count = 0;
  const regex = /\S+/g;
  let match;

  while ((match = regex.exec(text)) !== null && count < limit) {
    count++;
    if (count === limit) {
      pos = match.index + match[0].length;
    }
  }

  return pos !== -1 ? text.substring(0, pos) : text;
}

customText.addEventListener("keydown", function (e) {
  if (e.key === "Tab") {
    e.preventDefault(); // Stop the default tab behavior (moving focus)
    insertTabAtCursor(this); // Insert a tab character at cursor position

    // Update word count (optional)
    updateWordCount();

    // Show save button if needed
    if (this.innerText.length > 0) {
      saveTextBtn.style.display = "inline-block";
    }
  }
});

// Generate random words
async function generateText() {
  let wordLimit = parseInt(wordLimitSelect.value);
  if (wordLimitSelect.value === "custom") {
    wordLimit = parseInt(customWordLimitInput.value) || 50;
  }

  const generationType = generationOptions.value;
  const userPrompt = userPromptInput.value.trim();

  try {
    const apiUrl = new URL(
      "https://goldfish-app-yq66j.ondigitalocean.app/api/generate-text"
    );
    // const apiUrl = new URL("http://localhost:3000/api/generate-text");
    apiUrl.searchParams.append("wordLimit", wordLimit);
    apiUrl.searchParams.append("type", generationType);

    if (generationType === "custom" && userPrompt) {
      apiUrl.searchParams.append("prompt", userPrompt);
    }

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      return getPredefinedWords(wordLimit);
    }
    return data.text;
  } catch (error) {
    // console.error('Error fetching random text:', error);
    return getPredefinedWords(wordLimit);
  }
}

// Keep original function as fallback
async function getPredefinedWords(wordLimit) {
  const response = await fetch("predefined.txt");
  const text = await response.text();
  const words = text.split(/\s+/);
  let result = [];
  for (let i = 0; i < wordLimit; i++) {
    result.push(words[Math.floor(Math.random() * words.length)]);
  }
  return result.join(" ");
}

// Show Save Text button if custom-text has non-empty text
customText.addEventListener("input", function () {
  updateWordCount();
  if (this.innerText.length > 0) {
    saveTextBtn.style.display = "inline-block";
  } else {
    saveTextBtn.style.display = "none";
  }
});

// NEW: Define a custom modal for saving text (replacing prompt for heading)
function openSaveTextModal(callback) {
  const modalOverlay = document.createElement("div");
  modalOverlay.style.position = "fixed";
  modalOverlay.style.top = "0";
  modalOverlay.style.left = "0";
  modalOverlay.style.width = "100%";
  modalOverlay.style.height = "100%";
  modalOverlay.style.backgroundColor = "rgba(0,0,0,0.5)";
  modalOverlay.style.display = "flex";
  modalOverlay.style.justifyContent = "center";
  modalOverlay.style.alignItems = "center";
  modalOverlay.style.zIndex = "1000";

  const modalContent = document.createElement("div");
  modalContent.style.backgroundColor = "#fff";
  modalContent.style.padding = "20px";
  modalContent.style.borderRadius = "8px";
  modalContent.style.width = "80%";
  modalContent.style.maxWidth = "600px";
  modalContent.innerHTML = `
        <h2>Save Your Text</h2>
        <label>Heading: <span style="color: red;">*</span></label><br>
        <input type="text" id="save-heading" style="width: 100%;" required>
        <p id="heading-error" style="color: red; display: none;">Heading is required</p><br>
        <button id="save-text-submit">Save</button>
        <button id="save-text-cancel">Cancel</button>
    `;
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  document.getElementById("save-text-submit").addEventListener("click", () => {
    const heading = document.getElementById("save-heading").value;
    const errorElement = document.getElementById("heading-error");

    // Validate the heading field
    if (!heading) {
      errorElement.style.display = "block";
      return; // Stop execution if heading is empty
    }

    // If heading is valid, continue with saving
    errorElement.style.display = "none";
    modalContent.innerHTML = `<h2>Text saved successfully</h2>`;
    setTimeout(() => {
      if (document.body.contains(modalOverlay)) {
        document.body.removeChild(modalOverlay);
      }
      callback(heading);
    }, 1000); // wait 1 second before closing
  });

  document.getElementById("save-text-cancel").addEventListener("click", () => {
    document.body.removeChild(modalOverlay);
  });
}

// Replace existing saveTextBtn event listener:
saveTextBtn.addEventListener("click", function () {
  const textValue = customText.innerText.replace(/\u00A0/g, " ");

  if (!textValue.trim()) return; // Still check if it's empty after trimming

  openSaveTextModal(function (heading) {
    if (!heading) return;
    let saved = JSON.parse(localStorage.getItem("savedTexts") || "[]");
    saved.push({ heading, text: textValue });
    localStorage.setItem("savedTexts", JSON.stringify(saved));
    // Immediately show the View Saved Texts button
    if (viewSavedBtn) {
      viewSavedBtn.style.display = "inline-block";
    }
  });
});

// NEW: When View Saved Texts button is clicked, navigate to the saved texts page
viewSavedBtn.addEventListener("click", () => {
  window.location.href = "saved-texts.html";
});

// PRESERVE LEADING SPACES: Use TextNode approach for exact character preservation
function preservedText(text) {
  // Create a div element which preserves whitespace exactly
  const divElement = document.createElement("div");
  divElement.style.margin = "0";
  divElement.style.fontFamily = "inherit";
  divElement.style.fontSize = "inherit";
  divElement.style.whiteSpace = "pre-wrap"; // This preserves whitespace
  divElement.style.wordBreak = "break-word";

  // Create text node with exact characters
  const textNode = document.createTextNode(text);
  divElement.appendChild(textNode);
  return divElement;
}

// At the start of your script, add this to check for a saved text to use:
document.addEventListener("DOMContentLoaded", function () {
  const useTextValue = localStorage.getItem("useSavedText");
  // console.log("useTextValue: ", useTextValue);
  // for (let i = 0; i < useTextValue.length; i++) {
  //     console.log(`Character: ${useTextValue[i]}, ASCII: ${useTextValue.charCodeAt(i)}`);
  // }
  if (useTextValue) {
    // Select and check the custom-text radio button
    customTextRadio.checked = true;
    // Dispatch change event to update UI accordingly
    customTextRadio.dispatchEvent(new Event("change", { bubbles: true }));
    // Paste the saved text into the custom-text field

    customText.innerHTML = ""; // Clear any existing content
    customText.appendChild(preservedText(useTextValue));

    // Update the word count
    updateWordCount();
    // Also show the save button since there's text
    saveTextBtn.style.display = "inline-block";
    // Remove the temporary key
    localStorage.removeItem("useSavedText");
  }
  if (!customText.innerText) {
    wordCountDiv.style.display = "none";
  }

  if (generationOptions.value === "no") {
    generateTextButton.style.display = "none";
    userPromptInput.style.display = "none";
  } else if (generationOptions.value === "custom") {
    userPromptInput.style.display = "inline-block";
  }
  if (predefinedTextRadio.checked) {
    aiContainer.style.display = "none";
  } else if (customTextRadio.checked) {
    aiContainer.style.display = "block";
  }
});

// Utility to resolve selected time
function resolveSelectedTime() {
  let selectedTime =
    timerSelect.value === "custom"
      ? parseInt(customTimerInput.value)
      : parseInt(timerSelect.value);
  return selectedTime * 60;
}

function startTypingTest(text, time) {
  document.querySelector(".container").style.width = "60%";
  window.typedText = "";

  // Reset UI from any previous test
  testResults.style.display = "none";
  bottomSection.style.display = "flex";
  endTestContainer.style.display = "block";
  timerDisplay.style.display = "block";
  typingInput.style.display = "block";
  setupForm.style.display = "none";

  typingInput.setAttribute("contenteditable", "true");

  // Reset test state
  window.hasTestEnded = false;
  window.lastTestElapsedTime = null; // Reset the stored elapsed time

  // Clear any existing interval
  if (interval) {
    clearInterval(interval);
    interval = null;
  }

  // Reset timerStarted flag and clear any existing timer data
  timerStarted = false;
  // excessCharacters = '';

  // Sanitize original text but preserve whitespace
  text = sanitizeQuotesAndDashes(text);
  window.originalText = text;

  const homeBtn = document.getElementById("home-button");
  const newHomeBtn = homeBtn.cloneNode(true);
  newHomeBtn.removeAttribute("onclick"); // Remove the onclick attribute to prevent double triggering
  homeBtn.parentNode.replaceChild(newHomeBtn, homeBtn);
  newHomeBtn.addEventListener("click", navigateHome);

  const reloadBtn = document.getElementById("reload-button");
  const newReloadBtn = reloadBtn.cloneNode(true);
  reloadBtn.parentNode.replaceChild(newReloadBtn, reloadBtn);

  startTime = Date.now();

  // In your reload button event, replace the typingInput element
  newReloadBtn.addEventListener("click", function () {
    if (
      confirm(
        "Are you sure you want to restart the test? Your current progress will be lost."
      )
    ) {
      window.typedText = "";
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      // Create a completely new typing input element to replace the old one
      const newTypingInput = document.createElement("div");
      newTypingInput.id = "typing-input";
      newTypingInput.className = typingInput.className;
      newTypingInput.setAttribute("contenteditable", "true");
      newTypingInput.style.cssText = typingInput.style.cssText;
      typingInput.parentNode.replaceChild(newTypingInput, typingInput);

      testAnalysis.innerHTML = "";

      // Update the global reference to typingInput
      typingInput = newTypingInput;

      // excessCharacters = '';
      startTime = Date.now();
      startTypingTest(text, time);
    }
    newReloadBtn.innerHTML = '<i class="fas fa-redo-alt"></i> Restart Test';
  });

  typingTextLive.innerHTML = "";
  const divElement = document.createElement("div");
  divElement.style.whiteSpace = "pre-wrap";
  divElement.style.fontFamily = "inherit";
  divElement.style.fontSize = "inherit";
  divElement.style.margin = "0";
  divElement.style.wordBreak = "break-word";

  // Create spans for each character to enable styling
  for (let i = 0; i < text.length; i++) {
    const charSpan = document.createElement("span");

    // Preserve whitespace characters including tab
    if (text[i] === " ") {
      charSpan.innerHTML = "&nbsp;";
    } else if (text[i] === "\n") {
      charSpan.innerHTML = "<br>";
    } else if (text[i] === "\t") {
      charSpan.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;"; // Render tab as 4 spaces
    } else {
      charSpan.textContent = text[i];
    }

    // Highlight the first character to start
    if (i === 0) {
      charSpan.style.backgroundColor = "yellow";
    }

    divElement.appendChild(charSpan);
  }

  typingTextLive.appendChild(divElement);

  typingTest.classList.add("active");
  typingInput.innerHTML = "";
  typingInput.focus();
  updateTimerDisplay(time);

  // Remove any existing event listeners from End Test button
  const endTestBtn = document.getElementById("end-test");
  const newEndTestBtn = endTestBtn.cloneNode(true);
  endTestBtn.parentNode.replaceChild(newEndTestBtn, endTestBtn);
  // End Test button event
  newEndTestBtn.addEventListener("click", function () {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    // If there's still time remaining on the clock, confirm submission
    if (remainingTime > 0 || isNaN(remainingTime)) {
      showConfirmSubmitModal(function (confirmed) {
        if (confirmed) {
          updateTimerDisplay(time);
          calculateSpeed(typingInput.innerText.length, elapsedTime);
        }
      });
    } else {
      updateTimerDisplay(time);
      calculateSpeed(typingInput.innerText.length, elapsedTime);
    }
  });

  // Update paste event listener to use cleanAndPasteText function for proper handling of formatted text
  typingInput.addEventListener("paste", function (e) {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData(
      "text"
    );
    cleanAndPasteText(pastedText, typingInput);
  });

  // Add keydown event to handle backspace properly
  typingInput.addEventListener("keydown", function (e) {
    // Start timer on first key press
    if (!timerStarted) {
      timerStarted = true;
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      interval = setInterval(() => {
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        remainingTime = time - elapsedTime;
        if (remainingTime <= 0) {
          updateTimerDisplay(0);
          clearInterval(interval);
          // Pass the actual elapsed time instead of planned time
          calculateSpeed(typingInput.innerText.length, elapsedTime);
        } else {
          updateTimerDisplay(remainingTime);
        }
      }, 1000);
    }

    if (e.key === "Backspace") {
      // Get current typed text before backspace takes effect
      let typedText = typingInput.innerText.replace(/\u00A0/g, " ");
      typedText = sanitizeQuotesAndDashes(typedText);

      // After a brief delay to let the backspace take effect
      setTimeout(() => {
        const charSpans = typingTextLive.querySelectorAll("span");
        const newTypedLength = typingInput.innerText.length;

        // If backspace was pressed at position > 0, reset styling for the character at the position
        if (typedText.length > 0 && newTypedLength < typedText.length) {
          // Clear color of the character that was deleted
          if (newTypedLength < charSpans.length) {
            charSpans[newTypedLength].style.color = "";
            // And highlight it yellow
            charSpans[newTypedLength].style.backgroundColor = "yellow";
          }

          // Remove highlight from next character
          if (newTypedLength + 1 < charSpans.length) {
            charSpans[newTypedLength + 1].style.backgroundColor = "";
          }
        }
      }, 10);
    } else if (e.key === "Tab") {
      e.preventDefault();
      insertTabAtCursor(this);
      // Highlight the character after the tab space
      setTimeout(() => {
        let typedText = typingInput.innerText
          .replace(/\n\n/g, "\n")
          .replace(/\u00A0/g, " ");
        typedText = sanitizeQuotesAndDashes(typedText);
        window.typedText = typedText;
        const charSpans = typingTextLive.querySelectorAll("span");
        for (let i = 0; i < charSpans.length; i++) {
          charSpans[i].style.backgroundColor = "";
          charSpans[i].style.color = "";
        }
        if (typedText.length < window.originalText.length) {
          charSpans[typedText.length].style.backgroundColor = "yellow";
        }
      }, 10);
    }
  });

  // Add input event listener to track typing progress and update highlighting
  typingInput.addEventListener("input", function () {
    let typedText = typingInput.innerText
      .replace(/\n\n/g, "\n")
      .replace(/\u00A0/g, " ");
    typedText = sanitizeQuotesAndDashes(typedText);
    window.typedText = typedText;

    // Force empty string if only whitespace
    if (!typingInput.textContent) {
      typingInput.innerHTML = "";
    }

    const charSpans = typingTextLive.querySelectorAll("span");

    // Reset all spans for re-evaluation
    for (let i = 0; i < charSpans.length; i++) {
      charSpans[i].style.backgroundColor = "";
      charSpans[i].style.color = "";
    }

    // excessCharacters = '';
    for (let i = 0; i < typedText.length; i++) {
      if (i < text.length) {
        const isCorrect = typedText[i] === text[i];
        // Special handling for spaces (32) and newlines (10)
        if (
          text.charCodeAt(i) == 32 ||
          text.charCodeAt(i) == 10 ||
          text.charCodeAt(i) == 13 ||
          text.charCodeAt(i) == 9
        ) {
          if (!isCorrect) {
            charSpans[i].style.backgroundColor = "red";
          } else {
            charSpans[i].style.backgroundColor = "";
          }
        } else {
          // Regular styling for non-whitespace characters
          charSpans[i].style.color = isCorrect ? "green" : "red";
        }
      }
      // else {
      //     // Handle excess characters
      //     if (typedText[i] === ' ') {
      //         // Space with red background
      //         excessCharacters += '<span style="background-color: red;">&nbsp;</span>';
      //     } else if (typedText[i] === '\n') {
      //         // Newline with red background
      //         excessCharacters += '<span style="background-color: red;"><br></span>';
      //     } else if (typedText[i] === '\t') {
      //         // Tab with red background
      //         excessCharacters += '<span style="background-color: red;">&nbsp;&nbsp;&nbsp;&nbsp;</span>';
      //     } else {
      //         // Regular character with red text
      //         excessCharacters += '<span style="color: red;">' + typedText[i] + '</span>';
      //     }
      // }
    }

    // Highlight current position if within text bounds
    if (typedText.length < text.length) {
      charSpans[typedText.length].style.backgroundColor = "yellow";
    }
  });

  typingInput.style.overflowY = "hidden";
}

function showConfirmSubmitModal(callback) {
  const modalOverlay = document.createElement("div");
  modalOverlay.style.position = "fixed";
  modalOverlay.style.top = "0";
  modalOverlay.style.left = "0";
  modalOverlay.style.width = "100%";
  modalOverlay.style.height = "100%";
  modalOverlay.style.backgroundColor = "rgba(0,0,0,0.5)";
  modalOverlay.style.display = "flex";
  modalOverlay.style.justifyContent = "center";
  modalOverlay.style.alignItems = "center";
  modalOverlay.style.zIndex = "1000";

  const modal = document.createElement("div");
  modal.style.backgroundColor = "#fff";
  modal.style.padding = "20px";
  modal.style.borderRadius = "8px";
  modal.style.maxWidth = "400px";
  modal.style.textAlign = "center";

  const heading = document.createElement("h3");
  heading.textContent = "Submit Test Early?";
  heading.style.marginTop = "0";

  const msgPara = document.createElement("p");
  msgPara.innerText =
    "Time hasn't run out yet. Are you sure you want to submit?";

  const btnContainer = document.createElement("div");
  btnContainer.style.marginTop = "20px";

  const submitBtn = document.createElement("button");
  submitBtn.innerText = "Yes";
  submitBtn.style.marginRight = "10px";
  submitBtn.style.padding = "8px 16px";
  submitBtn.style.backgroundColor = "#333";
  submitBtn.style.color = "#fff";
  submitBtn.style.border = "none";
  submitBtn.style.borderRadius = "4px";
  submitBtn.style.cursor = "pointer";

  submitBtn.addEventListener("click", () => {
    document.body.removeChild(modalOverlay);
    callback(true);
  });

  const cancelBtn = document.createElement("button");
  cancelBtn.innerText = "No";
  cancelBtn.style.padding = "8px 16px";
  cancelBtn.style.border = "1px solid #ccc";
  cancelBtn.style.borderRadius = "4px";
  cancelBtn.style.cursor = "pointer";

  cancelBtn.addEventListener("click", () => {
    document.body.removeChild(modalOverlay);
    callback(false);
  });

  btnContainer.appendChild(submitBtn);
  btnContainer.appendChild(cancelBtn);
  modal.appendChild(heading);
  modal.appendChild(msgPara);
  modal.appendChild(btnContainer);
  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);
}

function showModalAutoDismiss(message) {
  const modalOverlay = document.createElement("div");
  modalOverlay.style.position = "fixed";
  modalOverlay.style.top = "0";
  modalOverlay.style.left = "0";
  modalOverlay.style.width = "100%";
  modalOverlay.style.height = "100%";
  modalOverlay.style.backgroundColor = "rgba(0,0,0,0.5)";
  modalOverlay.style.display = "flex";
  modalOverlay.style.justifyContent = "center";
  modalOverlay.style.alignItems = "center";
  modalOverlay.style.zIndex = "1000";

  const modal = document.createElement("div");
  modal.style.backgroundColor = "#fff";
  modal.style.padding = "20px";
  modal.style.borderRadius = "8px";
  modal.style.maxWidth = "80%";
  modal.style.maxHeight = "80%";
  modal.style.overflowY = "auto";
  modal.innerText = message;

  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  setTimeout(() => {
    if (document.body.contains(modalOverlay)) {
      document.body.removeChild(modalOverlay);
    }
  }, 2000);
}

function updateTimerDisplay(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  document.getElementById("timer-display").innerText = `Time: ${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

function findPunctuationMistakes(originalText, typedText) {
  // Define punctuation characters. Note that hyphen is moved to the end.
  const punctuationChars = ",.!?;:'\"_()\\[\\]{}\\/\\\\&@#$%^*+=<>~`|-";
  const punctuationErrors = [];

  // Split both texts into words and filter out empty strings
  const originalWords = originalText
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const typedWords = typedText.split(/\s+/).filter((word) => word.length > 0);

  // Compare words up to the shorter array's length
  const minLength = Math.min(originalWords.length, typedWords.length);

  // Helper function: remove punctuation
  const stripPunctuation = (word) =>
    word.replace(new RegExp(`[${punctuationChars}]`, "g"), "");

  for (let i = 0; i < minLength; i++) {
    const originalWord = originalWords[i];
    const typedWord = typedWords[i];

    // Skip if words are identical
    if (originalWord === typedWord) continue;

    const originalWordStripped = stripPunctuation(originalWord);
    const typedWordStripped = stripPunctuation(typedWord);

    // If words are the same after removing punctuation and are non-empty, a punctuation error occurred.
    if (
      originalWordStripped === typedWordStripped &&
      originalWordStripped.length > 0
    ) {
      // Only flag if at least one word contains punctuation
      const originalPunctuation = originalWord.match(
        new RegExp(`[${punctuationChars}]`, "g")
      );
      const typedPunctuation = typedWord.match(
        new RegExp(`[${punctuationChars}]`, "g")
      );
      if (originalPunctuation || typedPunctuation) {
        // Push error as [typedWord, originalWord] so mapping displays: original => typed
        punctuationErrors.push([typedWord, originalWord]);
      }
    }
  }

  // For missing words (present in original but not in typed)
  for (let i = minLength; i < originalWords.length; i++) {
    const word = originalWords[i];
    if (new RegExp(`[${punctuationChars}]`, "g").test(word)) {
      punctuationErrors.push(["[missing]", word]);
    }
  }

  // For extra words (present in typed but not in original)
  for (let i = minLength; i < typedWords.length; i++) {
    const word = typedWords[i];
    if (new RegExp(`[${punctuationChars}]`, "g").test(word)) {
      punctuationErrors.push([word, "[extra]"]);
    }
  }

  return punctuationErrors;
}

function findTranspositionMistakes(originalText, typedText) {
  const transpositionErrors = [];
  // Split texts into words and filter out any empty strings
  const originalWords = originalText
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const typedWords = typedText.split(/\s+/).filter((word) => word.length > 0);

  // Iterate over words in the overlapping portion (minus one to allow a pair check)
  const limit = Math.min(originalWords.length, typedWords.length) - 1;
  for (let i = 0; i < limit; i++) {
    if (originalWords[i] === originalWords[i + 1]) {
      continue;
    }
    // Check for an adjacent swapped pair:
    // expected: [originalWords[i], originalWords[i+1]]
    // typed: [typedWords[i], typedWords[i+1]] where they are transposed
    if (
      originalWords[i] === typedWords[i + 1] &&
      originalWords[i + 1] === typedWords[i]
    ) {
      transpositionErrors.push([
        originalWords[i] + " " + originalWords[i + 1],
        typedWords[i] + " " + typedWords[i + 1],
      ]);
      i++; // Skip the next index since this pair has been processed.
    }
  }
  return transpositionErrors;
}

function findParagraphicMistakes(originalText, typedText) {
  const paragraphicErrors = [];

  const origParas = originalText.split(/\n/);
  const typedParas = typedText.split(/\n/);
  const count = Math.min(origParas.length, typedParas.length);

  for (let i = 0; i < count; i++) {
    // Get leading whitespace from each paragraph
    const origMatch = origParas[i].match(/^(\s+)/);
    const typedMatch = typedParas[i].match(/^(\s+)/);
    const origIndent = origMatch ? origMatch[1] : "";
    const typedIndent = typedMatch ? typedMatch[1] : "";

    // Extract the first word after the indent
    const origFirstWordMatch = origParas[i]
      .substring(origIndent.length)
      .match(/^(\S+)/);
    const typedFirstWordMatch = typedParas[i]
      .substring(typedIndent.length)
      .match(/^(\S+)/);

    const origFirstWord = origFirstWordMatch ? origFirstWordMatch[1] : "";
    const typedFirstWord = typedFirstWordMatch ? typedFirstWordMatch[1] : "";

    // Check for tab vs spaces difference
    if (
      (origIndent.includes("\t") && !typedIndent.includes("\t")) ||
      (!origIndent.includes("\t") && typedIndent.includes("\t"))
    ) {
      // Store the indentation along with the first word
      paragraphicErrors.push([
        origIndent + origFirstWord,
        typedIndent + typedFirstWord,
      ]);
    }
  }

  return paragraphicErrors;
}

function findCapitalisationMistakes(originalText, typedText) {
  const capitalisationErrors = [];
  // Split both texts into words (filter empty strings)
  const originalWords = originalText
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const typedWords = typedText.split(/\s+/).filter((word) => word.length > 0);
  const minLength = Math.min(originalWords.length, typedWords.length);

  for (let i = 0; i < minLength; i++) {
    // If words are not identical but match when lowercased, it's a capitalisation error.
    if (
      originalWords[i] !== typedWords[i] &&
      originalWords[i].toLowerCase() === typedWords[i].toLowerCase()
    ) {
      capitalisationErrors.push([originalWords[i], typedWords[i]]);
    }
  }
  return capitalisationErrors;
}

function findSpacingMistakes(originalText, typedText) {
  const spacingErrors = [];

  // Remove all whitespace to compare letter sequences
  const origNoSpaces = originalText.replace(/\s/g, "");
  const typedNoSpaces = typedText.replace(/\s/g, "");

  // If the letter sequences don't match, differences aren't just spacing issues
  if (origNoSpaces !== typedNoSpaces) {
    return spacingErrors; // Return empty array - not spacing errors
  }

  // If texts are identical, no spacing issues
  if (originalText === typedText) {
    return spacingErrors;
  }

  // Split both texts into words
  const origWords = originalText.split(/\s+/).filter((w) => w.length > 0);
  const typedWords = typedText.split(/\s+/).filter((w) => w.length > 0);

  // Compare words using a sliding window approach to match letter sequences
  let origIndex = 0;
  let typedIndex = 0;

  while (origIndex < origWords.length && typedIndex < typedWords.length) {
    // Get current words from each text
    const origWord = origWords[origIndex];
    const typedWord = typedWords[typedIndex];

    // Check if the current words have the same letters
    if (origWord.replace(/\s/g, "") === typedWord.replace(/\s/g, "")) {
      // Simple case: spacing within the same word matches
      origIndex++;
      typedIndex++;
      continue;
    }

    // Try combining current word with next word(s) in original text
    let origCombined = origWord;
    let nextOrigIndex = origIndex + 1;
    let origFound = false;

    while (nextOrigIndex < origWords.length) {
      origCombined += origWords[nextOrigIndex];

      // If combined original words match current typed word (missing space error)
      if (origCombined.replace(/\s/g, "") === typedWord.replace(/\s/g, "")) {
        const originalPart = origWords
          .slice(origIndex, nextOrigIndex + 1)
          .join(" ");
        spacingErrors.push([originalPart, typedWord]);
        origIndex = nextOrigIndex + 1;
        typedIndex++;
        origFound = true;
        break;
      }

      nextOrigIndex++;
    }

    if (origFound) continue;

    // Try combining current word with next word(s) in typed text
    let typedCombined = typedWord;
    let nextTypedIndex = typedIndex + 1;
    let typedFound = false;

    while (nextTypedIndex < typedWords.length) {
      typedCombined += typedWords[nextTypedIndex];

      // If combined typed words match current original word (extra space error)
      if (origWord.replace(/\s/g, "") === typedCombined.replace(/\s/g, "")) {
        const typedPart = typedWords
          .slice(typedIndex, nextTypedIndex + 1)
          .join(" ");
        spacingErrors.push([origWord, typedPart]);
        origIndex++;
        typedIndex = nextTypedIndex + 1;
        typedFound = true;
        break;
      }

      nextTypedIndex++;
    }

    if (typedFound) continue;

    // If no pattern found, just advance both indices
    origIndex++;
    typedIndex++;
  }

  return spacingErrors;
}

function findOmissionMistakes(originalText, typedText) {
  const omissionErrors = [];
  function normalize(word) {
    return word.replace(/[.,!?;:'"()\[\]{}\\\/]/g, "");
  }

  const originalWords = originalText.split(/\s+/).filter((w) => w.length > 0);
  const typedWords = typedText.split(/\s+/).filter((w) => w.length > 0);

  // If the number of words is the same, assume that any mismatch is not an omission error.
  if (originalWords.length === typedWords.length) {
    return omissionErrors;
  }

  let i = 0,
    j = 0;
  while (i < originalWords.length && j < typedWords.length) {
    if (normalize(originalWords[i]) === normalize(typedWords[j])) {
      i++;
      j++;
    } else {
      // Record omission block
      let start = i;
      while (
        i < originalWords.length &&
        (j >= typedWords.length ||
          normalize(originalWords[i]) !== normalize(typedWords[j]))
      ) {
        i++;
      }
      const count = i - start;
      if (count === 1) {
        omissionErrors.push([originalWords[start], 1]);
      } else if (count === 2) {
        omissionErrors.push([
          `${originalWords[start]} ${originalWords[start + 1]}`,
          2,
        ]);
      } else if (count > 2) {
        omissionErrors.push([
          `${originalWords[start]} … ${originalWords[i - 1]}`,
          count,
        ]);
      }
    }
  }

  // If any words remain in the original, then those are omissions.
  while (i < originalWords.length) {
    let start = i;
    while (i < originalWords.length) {
      i++;
    }
    const count = i - start;
    if (count === 1) {
      omissionErrors.push([originalWords[start], 1]);
    } else if (count === 2) {
      omissionErrors.push([
        `${originalWords[start]} ${originalWords[start + 1]}`,
        2,
      ]);
    } else if (count > 2) {
      omissionErrors.push([
        `${originalWords[start]} … ${originalWords[i - 1]}`,
        count,
      ]);
    }
  }

  return omissionErrors;
}

function findSubstitutionMistakes(originalText, typedText) {
  const substitutionErrors = [];
  // Split texts into words (ignoring empty strings)
  const origWords = originalText.split(/\s+/).filter((w) => w.length > 0);
  const typedWords = typedText.split(/\s+/).filter((w) => w.length > 0);
  const minLength = Math.min(origWords.length, typedWords.length);

  // Normalize by lowercasing. (You can extend this normalization if desired)
  const normalize = (word) => word.toLowerCase();

  let i = 0;
  while (i < minLength) {
    // Skip transposition errors (already handled elsewhere)
    if (
      i < minLength - 1 &&
      normalize(origWords[i]) === normalize(typedWords[i + 1]) &&
      normalize(origWords[i + 1]) === normalize(typedWords[i])
    ) {
      i += 2;
      continue;
    }

    if (normalize(origWords[i]) !== normalize(typedWords[i])) {
      // Start grouping consecutive substitution errors
      let groupOrig = [origWords[i]];
      let groupTyped = [typedWords[i]];
      let j = i + 1;
      while (j < minLength) {
        // Do not group if a transposition is detected next
        if (
          j < minLength - 1 &&
          normalize(origWords[j]) === normalize(typedWords[j + 1]) &&
          normalize(origWords[j + 1]) === normalize(typedWords[j])
        ) {
          break;
        }
        if (normalize(origWords[j]) === normalize(typedWords[j])) {
          break;
        }
        groupOrig.push(origWords[j]);
        groupTyped.push(typedWords[j]);
        j++;
      }
      let originalStr, typedStr;
      if (groupOrig.length > 2) {
        // Use ellipsis format and append the number of words substituted
        originalStr = `${groupOrig[0]} … ${groupOrig[groupOrig.length - 1]} (${
          groupOrig.length
        } words substituted)`;
        typedStr = `${groupTyped[0]} … ${groupTyped[groupTyped.length - 1]} (${
          groupTyped.length
        } words substituted)`;
      } else {
        originalStr = groupOrig.join(" ");
        typedStr = groupTyped.join(" ");
      }
      substitutionErrors.push([originalStr, typedStr]);
      i = j;
    } else {
      i++;
    }
  }
  return substitutionErrors;
}

function findAdditionMistakes(originalText, typedText) {
  const additionErrors = [];
  const normalize = (word) => word.toLowerCase();
  const origWords = originalText.split(/\s+/).filter((w) => w.length > 0);
  const typedWords = typedText.split(/\s+/).filter((w) => w.length > 0);

  let i = 0,
    j = 0;
  while (i < origWords.length && j < typedWords.length) {
    if (normalize(origWords[i]) === normalize(typedWords[j])) {
      i++;
      j++;
    } else {
      // Group consecutive extra words from typedText
      let start = j;
      while (
        j < typedWords.length &&
        (i >= origWords.length ||
          normalize(typedWords[j]) !== normalize(origWords[i]))
      ) {
        j++;
      }
      let count = j - start;
      let block = typedWords.slice(start, j).join(" ");
      if (count > 2) {
        let displayBlock = `${typedWords[start]} … ${typedWords[j - 1]}`;
        additionErrors.push([displayBlock, `${count} words added extra`]);
      } else {
        additionErrors.push([
          block,
          count === 1 ? "1 extra word typed" : `${count} words added extra`,
        ]);
      }
    }
  }
  // Any remaining typed words at the end are extra.
  if (j < typedWords.length) {
    let count = typedWords.length - j;
    let block = typedWords.slice(j).join(" ");
    if (count > 2) {
      let displayBlock = `${typedWords[j]} … ${
        typedWords[typedWords.length - 1]
      }`;
      additionErrors.push([displayBlock, `${count} words added extra`]);
    } else {
      additionErrors.push([
        block,
        count === 1 ? "1 word added extra" : `${count} words added extra`,
      ]);
    }
  }

  return additionErrors;
}

function findSpellingMistakes(originalText, typedText) {
  const spellingErrors = [];
  const origWords = originalText.split(/\s+/).filter((w) => w.length > 0);
  const typedWords = typedText.split(/\s+/).filter((w) => w.length > 0);
  const minLength = Math.min(origWords.length, typedWords.length);

  // Helper function: Compute Levenshtein distance between two strings
  function levenshtein(a, b) {
    const matrix = [];
    const aLen = a.length,
      bLen = b.length;
    // If one string is empty, the distance is the length of the other.
    if (aLen === 0) return bLen;
    if (bLen === 0) return aLen;

    // Initialize first row and column.
    for (let i = 0; i <= aLen; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= bLen; j++) {
      matrix[0][j] = j;
    }

    // Fill in the rest of the matrix.
    for (let i = 1; i <= aLen; i++) {
      for (let j = 1; j <= bLen; j++) {
        const substitutionCost =
          a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + substitutionCost // substitution
        );
      }
    }
    return matrix[aLen][bLen];
  }

  // For each overlapping word, if they are not identical,
  // and the relative edit distance is small (≤ 30%), mark as a spelling error.
  for (let i = 0; i < minLength; i++) {
    const origWord = origWords[i];
    const typedWord = typedWords[i];
    if (origWord === typedWord) continue;

    const dist = levenshtein(origWord, typedWord);
    // Avoid flagging large differences. You can adjust the ratio (0.3) as needed.
    if (dist > 0 && dist / origWord.length <= 0.3) {
      spellingErrors.push([origWord, typedWord]);
    }
  }

  return spellingErrors;
}

function findRepetitionMistakes(originalText, typedText) {
  const repetitionErrors = [];
  const origWords = originalText.split(/\s+/).filter((w) => w.length > 0);
  const typedWords = typedText.split(/\s+/).filter((w) => w.length > 0);

  let i = 0,
    j = 0;
  while (i < origWords.length && j < typedWords.length) {
    // Compare words ignoring case
    if (origWords[i].toLowerCase() === typedWords[j].toLowerCase()) {
      // Count repetitions in typedText
      let repCount = 1;
      const startJ = j;
      while (
        j + 1 < typedWords.length &&
        typedWords[j + 1].toLowerCase() === typedWords[j].toLowerCase()
      ) {
        repCount++;
        j++;
      }
      // Count any repetition in the original text at this point
      let origRepCount = 1;
      let k = i;
      while (
        k + 1 < origWords.length &&
        origWords[k + 1].toLowerCase() === origWords[k].toLowerCase()
      ) {
        origRepCount++;
        k++;
      }
      // If typedText has more repetitions than original, record error
      if (repCount > origRepCount) {
        repetitionErrors.push([
          origWords[i],
          typedWords.slice(startJ, startJ + repCount).join(" "),
        ]);
      }
      i++;
      j++;
    } else {
      // If words don't match (could be due to other error types), advance both pointers.
      i++;
      j++;
    }
  }
  return repetitionErrors;
}

function findIncompletionMistakes(originalText, typedText) {
  const incompletionErrors = [];
  const origWords = originalText.split(/\s+/).filter((w) => w.length > 0);
  const typedWords = typedText.split(/\s+/).filter((w) => w.length > 0);
  const minLength = Math.min(origWords.length, typedWords.length);

  for (let i = 0; i < minLength; i++) {
    const origWord = origWords[i];
    const typedWord = typedWords[i];
    // If the typed word is shorter than the original,
    // is at least half as long, and is a prefix of the original,
    // flag it as an incompletion error.
    if (
      typedWord.length < origWord.length &&
      typedWord.length >= Math.floor(origWord.length / 2) &&
      origWord.startsWith(typedWord)
    ) {
      incompletionErrors.push([origWord, typedWord]);
    }
  }
  return incompletionErrors;
}

function findMistakes(originalText, typedText) {
  // console.log("originalText:", originalText.length);
  // console.log("typedText:", typedText.length);
  // for (let i = 0; i < originalText.length; i++) {
  //     console.log(`originalText: ${originalText.charCodeAt(i)}`);
  // }
  // for (let i = 0; i < typedText.length; i++) {
  //     console.log(`typedText: ${typedText.charCodeAt(i)}`);
  // }

  const punctuationErrors = findPunctuationMistakes(originalText, typedText);
  const punctuationErrorsList = punctuationErrors
    .map(
      (error) =>
        `<li><span style="color:green;">${error[1]}</span> => <span style="color:red;">${error[0]}</span></li>`
    )
    .join("");

  const transpositionErrors = findTranspositionMistakes(
    originalText,
    typedText
  );
  const transpositionErrorsList = transpositionErrors
    .map(
      (error) =>
        `<li><span style="color:green;">${error[1]}</span> => <span style="color:red;">${error[0]}</span></li>`
    )
    .join("");

  const paragraphicErrors = findParagraphicMistakes(originalText, typedText);
  // In findMistakes function, update this part:
  const paragraphicErrorsList = paragraphicErrors
    .map((error) => {
      const [origIndentWithWord, typedIndentWithWord] = error;

      // Find where the indent ends and the word begins
      const origMatch = origIndentWithWord.match(/^(\s+)(.*)$/);
      const typedMatch = typedIndentWithWord.match(/^(\s+)(.*)$/);

      // If there's an indent, separate it from the word
      let origIndent = origMatch ? origMatch[1] : "";
      let origWord = origMatch ? origMatch[2] : origIndentWithWord;

      let typedIndent = typedMatch ? typedMatch[1] : "";
      let typedWord = typedMatch ? typedMatch[2] : typedIndentWithWord;

      // Format the expected and actual HTML with colored indentation
      const expectedHtml = `<span style="background-color:green;">${origIndent.replace(
        /\t/g,
        "&nbsp;&nbsp;&nbsp;&nbsp;"
      )}</span>${origWord}`;
      const actualHtml = `<span style="background-color:red;">${typedIndent.replace(
        / /g,
        "&nbsp;"
      )}</span>${typedWord}`;

      return `<li>${expectedHtml} => ${actualHtml}</li>`;
    })
    .join("");

  const capitalisationErrors = findCapitalisationMistakes(
    originalText,
    typedText
  );
  const capitalisationErrorsList = capitalisationErrors
    .map(
      (error) =>
        `<li><span style="color:green;">${error[0]}</span> => <span style="color:red;">${error[1]}</span></li>`
    )
    .join("");

  const spacingErrors = findSpacingMistakes(originalText, typedText);
  const spacingErrorsList = spacingErrors
    .map((error) => {
      // Visualize spaces in both original and typed text, preserving multiple consecutive spaces
      const originalWithVisibleSpaces = error[0].replace(
        / /g,
        "<span>&nbsp;</span>"
      );

      // For typed text with multiple spaces, replace EACH space with a visible red-background space
      let typedWithVisibleSpaces = "";
      for (let i = 0; i < error[1].length; i++) {
        if (error[1][i] === " ") {
          // Every space gets its own span with red background
          typedWithVisibleSpaces +=
            '<span style="background-color:red;">&nbsp;</span>';
        } else {
          typedWithVisibleSpaces += error[1][i];
        }
      }

      return `<li><span style="color:green;">${originalWithVisibleSpaces}</span> => <span style="color:red;">${typedWithVisibleSpaces}</span></li>`;
    })
    .join("");

  const omissionErrors = findOmissionMistakes(originalText, typedText);
  const omissionErrorsList = omissionErrors
    .map((error) => {
      if (error[1] === 1) {
        return `<li><span style="color:green;">${error[0]}</span> => <span style="color:red;">${error[1]} word missed</span></li>`;
      } else {
        return `<li><span style="color:green;">${error[0]}</span> => <span style="color:red;">${error[1]} words missed</span></li>`;
      }
    })
    .join("");

  const substitutionErrors = findSubstitutionMistakes(originalText, typedText);
  const substitutionErrorsList = substitutionErrors
    .map(
      (error) =>
        `<li><span style="color:green;">${error[0]}</span> => <span style="color:red;">${error[1]}</span></li>`
    )
    .join("");

  const additionErrors = findAdditionMistakes(originalText, typedText);
  const additionErrorsList = additionErrors
    .map(
      (error) =>
        `<li><span style="color:green;">${error[0]}</span> => <span style="color:red;">${error[1]}</span></li>`
    )
    .join("");

  const spellingErrors = findSpellingMistakes(originalText, typedText);
  const spellingErrorsList = spellingErrors
    .map(
      (error) =>
        `<li><span style="color:green;">${error[0]}</span> => <span style="color:red;">${error[1]}</span></li>`
    )
    .join("");

  const repetitionErrors = findRepetitionMistakes(originalText, typedText);
  const repetitionErrorsList = repetitionErrors
    .map(
      (error) =>
        `<li><span style="color:green;">${error[0]}</span> => <span style="color:red;">${error[1]}</span></li>`
    )
    .join("");

  const incompletionErrors = findIncompletionMistakes(originalText, typedText);
  const incompletionErrorsList = incompletionErrors
    .map(
      (error) =>
        `<li><span style="color:green;">${error[0]}</span> => <span style="color:red;">${error[1]}</span></li>`
    )
    .join("");

  const mistakesHTML = `
        <h2 style="text-align:center;">Full Mistakes</h2>
        <table>
                <tr>
                    <th>Type</th>
                    <th>Mistakes</th>
                </tr>
                <tr>
                    <td><h4>Omission Errors</h4></td>
                    <td><ul style="list-style-type: none;">${omissionErrorsList}</ul></td>
                </tr>
                <tr>
                    <td><h4>Substitution Errors</h4></td>
                    <td><ul style="list-style-type: none;">${substitutionErrorsList}</ul></td>
                </tr>
                <tr>
                    <td><h4>Addition Errors</h4></td>
                    <td><ul style="list-style-type: none;">${additionErrorsList}</ul></td>
                </tr>
                <tr>
                    <td><h4>Spelling Errors</h4></td>
                    <td><ul style="list-style-type: none;">${spellingErrorsList}</ul></td>
                </tr>
                <tr>
                    <td><h4>Repetition Errors</h4></td>
                    <td><ul style="list-style-type: none;">${repetitionErrorsList}</ul></td>
                </tr>
                <tr>
                    <td><h4>Incompletition Errors</h4></td>
                    <td><ul style="list-style-type: none;">${incompletionErrorsList}</ul></td>
                </tr>
        </table>

        <h2 style="text-align:center;">Half Mistakes</h2>
        <table>
            <tr>
                <th>Type</th>
                <th>Mistakes</th>
            </tr>
            <tr>
                <td><h4>Spacing Errors</h4></td>
                <td><ul style="list-style-type: none;">${spacingErrorsList}</ul></td>
            </tr>
            <tr>
                <td><h4>Capitalisation Errors</h4></td>
                <td><ul style="list-style-type: none;">${capitalisationErrorsList}</ul></td>
            </tr>
            <tr>
                <td><h4>Punctuation Errors</h4></td>
                <td><ul style="list-style-type: none;">${punctuationErrorsList}</ul></td>
            </tr>
            <tr>
                <td><h4>Transposition Errors</h4></td>
                <td><ul style="list-style-type: none;">${transpositionErrorsList}</ul></td>
            </tr>
            <tr>
                <td><h4>Paragraphic Errors</h4></td>
                <td><ul style="list-style-type: none;">${paragraphicErrorsList}</ul></td>
            </tr>
        </table>
    `;

  testAnalysis.innerHTML = mistakesHTML;
  testAnalysis.style.display = "block";
}

function calculateSpeed(charsTyped, elapsedTime) {
  // Set flag that test is completed
  window.hasTestEnded = true;
  reloadButton.innerHTML = '<i class="fas fa-redo-alt"></i> Retake Test';

  // if (excessCharacters) {
  //     const excessDiv = document.createElement('div');
  //     excessDiv.innerHTML = excessCharacters;
  //     excessDiv.style.display = 'inline-block';
  //     typingTextLive.appendChild(excessDiv);
  // }

  // Get the typed text (with non-breaking spaces converted to regular spaces)
  const typedText = typingInput.innerText.replace(/\u00A0/g, " ");
  const originalText = window.originalText;

  // Make sure we have a valid elapsed time (store for potential restart)
  elapsedTime = Math.max(1, elapsedTime); // Prevent division by zero
  window.lastTestElapsedTime = elapsedTime; // Store for reference

  // Calculate time in minutes for rate calculations
  const timeInMinutes = elapsedTime / 60;

  // Basic metrics
  const keysPerMinute = timeInMinutes > 0 ? charsTyped / timeInMinutes : 0;
  const wordsPerMinute = timeInMinutes > 0 ? charsTyped / 5 / timeInMinutes : 0;

  // Character accuracy metrics
  const totalTypedLetters = typedText.length;
  const totalOriginalLetters = originalText.length;

  // IMPROVED ERROR CALCULATION LOGIC
  // Count correct characters and errors within the compared range
  let correctLetters = 0;
  let errorsInComparison = 0;

  // Calculate errors within overlapping section (min of both texts)
  for (let i = 0; i < Math.min(totalTypedLetters, totalOriginalLetters); i++) {
    if (typedText[i] === originalText[i]) {
      correctLetters++;
    } else {
      errorsInComparison++;
    }
  }

  // Extra characters typed beyond original text length are considered errors
  const extraCharacters = Math.max(0, totalTypedLetters - totalOriginalLetters);

  // Missing characters (if user typed less than original) are counted as errors
  const missingCharacters = Math.max(
    0,
    totalOriginalLetters - totalTypedLetters
  );

  // Total errors = errors in overlapping comparison + extra characters + missing characters
  const totalErrors = errorsInComparison + extraCharacters;

  // Calculate more accurate error rates and percentages
  // Use the total original length as the base for accuracy calculation
  const accuracy =
    totalOriginalLetters > 0
      ? (correctLetters / totalOriginalLetters) * 100
      : 0;

  // Error rate based on original text length
  const errorRate =
    totalOriginalLetters > 0 ? (totalErrors / totalOriginalLetters) * 100 : 0;

  // Calculate percentages for display
  const completionPercent =
    totalOriginalLetters > 0
      ? (Math.min(totalTypedLetters, totalOriginalLetters) /
          totalOriginalLetters) *
        100
      : 0;

  // Word accuracy metrics - keeping this part of the original code
  const typedWords = typedText.split(/\s+/);
  const originalWords = originalText.split(/\s+/);
  const totalTypedWords = typedWords.filter(
    (word) => word.trim().length > 0
  ).length;
  const totalOriginalWords = originalWords.length;

  // Count correct and wrong words
  let correctWords = 0;
  for (let i = 0; i < Math.min(typedWords.length, originalWords.length); i++) {
    if (typedWords[i] === originalWords[i]) {
      correctWords++;
    }
  }
  const wrongWords = Math.max(0, totalTypedWords - correctWords);

  // Calculate word percentages
  const correctWordsPercent =
    totalOriginalWords > 0 ? (correctWords / totalOriginalWords) * 100 : 0;
  const wrongWordsPercent =
    totalOriginalWords > 0 ? (wrongWords / totalOriginalWords) * 100 : 0;

  // Build results table with improved metrics
  const resultHTML = `
      <h2 style="text-align:center;">Test Results</h2>
      <table>
          <tr>
              <th>Metric</th>
              <th>Result</th>
          </tr>
          <tr>
              <td>Words per Minute</td>
              <td><h4>${wordsPerMinute.toFixed(2)} WPM</h4></td>
          </tr>
          <tr>
              <td>Keys per Minute</td>
              <td><h4>${keysPerMinute.toFixed(2)} KPM</h4></td>
          </tr>
          <tr>
              <td>Accuracy</td>
              <td>${accuracy.toFixed(2)}%</</td>
          </tr>
          <tr>
              <td>Error Rate</td>
              <td>${errorRate.toFixed(2)}%</</td>
          </tr>
          <tr>
              <td>Correct Characters (Original Text)</td>
              <td>${correctLetters} / ${totalOriginalLetters} (${(
    (correctLetters / totalOriginalLetters) *
    100
  ).toFixed(2)}%)</td>
          </tr>
          <tr>
              <td>Wrong Characters (Original Text)</td>
              <td>${errorsInComparison} (${
    Math.min(totalTypedLetters, totalOriginalLetters) > 0
      ? (
          (errorsInComparison /
            Math.min(totalTypedLetters, totalOriginalLetters)) *
          100
        ).toFixed(2)
      : "0.00"
  }%)</td>
          </tr>
          <tr>
              <td>Extra Characters</td>
              <td>${extraCharacters}</td>
          </tr>
          <tr>
              <td>Missing Characters</td>
              <td>${missingCharacters} (${(
    (missingCharacters / totalOriginalLetters) *
    100
  ).toFixed(2)}%)</td>
          </tr>
          <tr>
              <td>Total Errors</td>
              <td>${totalErrors} (${errorRate.toFixed(2)}%)</td>
          </tr>
          <tr>
              <td>Completion</td>
              <td>${completionPercent.toFixed(2)}%</td>
          </tr>
          <tr>
              <td>Correct Words</td>
              <td>${correctWords} / ${totalOriginalWords} (${correctWordsPercent.toFixed(
    2
  )}%)</td>
          </tr>
          <tr>
              <td>Wrong Words</td>
              <td>${wrongWords} / ${totalOriginalWords} (${wrongWordsPercent.toFixed(
    2
  )}%)</td>
          </tr>
      </table>
    `;

  // Display results and hide test elements
  testResults.style.display = "block";
  testResults.innerHTML = resultHTML;

  // Hide elements instead of removing them
  timerDisplay.style.display = "none";
  typingInput.style.display = "none";
  endTest.style.display = "none";

  // Keep bottom-section but hide it, don't remove it
  bottomSection.style.display = "none";
  endTestContainer.style.display = "none";

  // Disable further editing of the typing input
  typingInput.setAttribute("contenteditable", "false");

  findMistakes(window.originalText, window.typedText);
}

function updateWordCount() {
  const text = customText.innerText.replace(/\u00A0/g, " ");
  // Match non-space sequences for word counting
  const wordMatches = text.match(/\S+/g);
  const words = wordMatches ? wordMatches.length : 0;
  const limit = parseInt(wordLimitSelect.value) || 100;

  // Only show word count if there is text
  if (!text.trim()) {
    wordCountDiv.style.display = "none";
    return;
  } else {
    wordCountDiv.style.display = "block";
  }

  // Show word count against limit for custom text
  if (customTextRadio.checked) {
    // Warn if over limit
    if (words > limit) {
      wordCountDiv.innerHTML = `Word Count: <span style="${
        words > limit ? "color:red;" : ""
      }">${words} > ${limit}</span>`;
      wordCountDiv.innerHTML += `<span style="color:red; font-size:0.8em;"> (So, text will be truncated to ${limit} words.)</span>`;
    } else {
      wordCountDiv.innerHTML = `Word Count: <span style="${
        words > limit ? "color:red;" : ""
      }">${words}</span>`;
    }
  } else {
    wordCountDiv.innerText = `Word Count: ${words}`;
  }
}

// NEW: Apply blur if Blind Test mode is selected
modeSelect.addEventListener("change", function () {
  if (this.value === "blind") {
    typingInput.style.filter = "blur(8px)";
  } else {
    typingInput.style.filter = "";
  }
});

// Add this function to index.js
function navigateHome() {
  if (!window.hasTestEnded && timerStarted) {
    if (
      confirm(
        "Are you sure you want to leave the test? Your current progress will be lost."
      )
    ) {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      if (websiteHeading) {
        websiteHeading.textContent = "Typing Exam Practice";
      }
      window.location.href = "index.html";
    }
  } else {
    window.location.href = "index.html";
  }
}

// Add word limit change listener
wordLimitSelect.addEventListener("change", updateWordCount);
customWordLimitInput.addEventListener("input", updateWordCount);
customWordLimitInput.setAttribute("min", "1");
customWordLimitInput.addEventListener("input", function () {
  if (parseInt(this.value) < 1 || isNaN(parseInt(this.value))) {
    this.value = "";
  }
});
customTimerInput.setAttribute("min", "1");
customTimerInput.addEventListener("input", function () {
  if (parseInt(this.value) < 1 || isNaN(parseInt(this.value))) {
    this.value = "";
  }
});
customText.addEventListener("input", updateWordCount);

// Add event listener for generate button
generateTextButton.addEventListener("click", async function () {
  // Show loading indicator on button
  this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
  this.disabled = true;

  try {
    // Call the generateText function to get random text
    const generatedText = await generateText(wordLimit);

    // Put the generated text into the custom-text element
    customText.innerText = generatedText;

    // Update the word count display and ensure visibility
    updateWordCount();

    // Show the save button since we now have text
    saveTextBtn.style.display = "inline-block";
  } catch (error) {
    // console.error('Error generating text:', error);
    // Optionally show error message to user
  } finally {
    // Restore the button text and enable it
    this.innerHTML = "Generate";
    this.disabled = false;
  }
});

// Get references to new elements
const generationOptions = document.getElementById("generation-options");
const userPromptInput = document.getElementById("user-prompt");

// Add event listener to show/hide generate button based on selection
generationOptions.addEventListener("change", function () {
  const label = document.querySelector('label[for="generation-options"]');
  if (this.value === "no") {
    generateTextButton.style.display = "none";
    userPromptInput.style.display = "none";
    label.style.fontWeight = "normal";
  } else if (this.value === "custom") {
    if (label) {
      label.style.fontWeight = "bold";
    }
    generateTextButton.style.display = "inline-block";
    userPromptInput.style.display = "inline-block";
  } else {
    generateTextButton.style.display = "inline-block";
    userPromptInput.style.display = "none";
    label.style.fontWeight = "normal";
  }
});

// Update generate button click handler to ensure custom text radio is selected
generateTextButton.addEventListener("click", async function () {
  // Select custom text radio if it's not already selected
  if (!customTextRadio.checked) {
    customTextRadio.checked = true;
    customTextRadio.dispatchEvent(new Event("change", { bubbles: true }));
  }

  // Show loading indicator on button
  this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
  this.disabled = true;

  try {
    // Call the generateText function to get text based on selected type
    const generatedText = await generateText();

    // Put the generated text into the custom-text element, preserving whitespace
    customText.innerHTML = "";
    // customText.appendChild(preservedText(generatedText));
    cleanAndPasteText(generatedText, customText);

    // Update the word count display and ensure visibility
    updateWordCount();

    // Show the save button since we now have text
    saveTextBtn.style.display = "inline-block";
  } catch (error) {
    // console.error('Error generating text:', error);
    // Optionally show error message to user
    showModalAutoDismiss("Failed to generate text. Please try again.");
  } finally {
    // Restore the button text and enable it
    this.innerHTML = "Generate";
    this.disabled = false;
  }
});

// NEW: Function to insert a tab at the cursor position
function insertTabAtCursor(el) {
  // Get current selection and range
  const sel = window.getSelection();
  if (sel.rangeCount) {
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const tabNode = document.createTextNode("\t");
    range.insertNode(tabNode);
    range.setStartAfter(tabNode);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  } else {
    el.innerText += "\t";
  }
}

// Add a new button for saving typing-text-live text on the result page
document.addEventListener("DOMContentLoaded", function () {
  // Create Save Result Text button
  const saveResultTextBtn = document.createElement("button");
  saveResultTextBtn.id = "save-result-text-btn";
  saveResultTextBtn.textContent = "Save Result Text";
  saveResultTextBtn.className = "reload-button"; // Use the same class as the restart test button
  saveResultTextBtn.style.display = "none"; // Initially hidden
  saveResultTextBtn.style.marginRight = "10px"; // Add margin to separate buttons

  // Create View Saved Texts button
  const viewSavedTextsBtn = document.createElement("button");
  viewSavedTextsBtn.id = "view-result-saved-texts-btn";
  viewSavedTextsBtn.textContent = "View Saved Texts";
  viewSavedTextsBtn.className = "reload-button";
  viewSavedTextsBtn.style.display = "none"; // Initially hidden

  // Create a container for both buttons to place them side by side
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "center";
  buttonContainer.style.gap = "10px";
  buttonContainer.appendChild(saveResultTextBtn);
  buttonContainer.appendChild(viewSavedTextsBtn);

  const typingTextLiveContainer = document.getElementById("typing-text-live");
  document
    .getElementById("test-results")
    .parentNode.insertBefore(
      buttonContainer,
      document.getElementById("test-analysis")
    );

  // Add event listener to the save button
  saveResultTextBtn.addEventListener("click", function () {
    const textValue = typingTextLiveContainer.innerText.replace(/\u00A0/g, " ");
    if (!textValue.trim()) return; // Check if it's empty after trimming

    openSaveTextModal(function (heading) {
      if (!heading) return;
      let saved = JSON.parse(localStorage.getItem("savedTexts") || "[]");
      saved.push({ heading, text: textValue });
      localStorage.setItem("savedTexts", JSON.stringify(saved));
      // Show the view button after saving
      viewSavedTextsBtn.style.display = "inline-block";
    });
  });

  // Add event listener to the view button
  viewSavedTextsBtn.addEventListener("click", function () {
    window.location.href = "saved-texts.html";
  });

  // Show both buttons when the test results are displayed
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "style"
      ) {
        if (testResults.style.display === "block") {
          saveResultTextBtn.style.display = "inline-block";
          // Only show view button if there are saved texts
          const savedTexts = JSON.parse(
            localStorage.getItem("savedTexts") || "[]"
          );
          if (savedTexts.length > 0) {
            viewSavedTextsBtn.style.display = "inline-block";
          }
        } else {
          saveResultTextBtn.style.display = "none";
          viewSavedTextsBtn.style.display = "none";
        }
      }
    });
  });
  observer.observe(testResults, { attributes: true });
});
