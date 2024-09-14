const paragraph = document.getElementById('paragraph');

// Every time you select any text it will be updated in this variable
let selectedText = null

// Unique id to identify selected item object
let uniqueIdentifier = 1

// After clicking any add button selected item will be stored in this variable as nested object
const selectedItems = {}

// Function to handle text selection
const handleTextSelection = () => {
    selection = window.getSelection();
    range = document.createRange();

    if (!selection.rangeCount) return;
    // const minusIndexs = 25;
    // const selectedStart = selection.anchorOffset - minusIndexs;
    // const selectedEnd = selection.focusOffset - minusIndexs;

    selectedText = {
        text: selection.toString(),
        // startIdx: selectedStart > selectedEnd ? selectedEnd : selectedStart,
        // endIdx: selectedStart < selectedEnd ? selectedEnd : selectedStart
    }
};


// Define the debounce function
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

// Debounced function that will only be called after selection is complete
const debouncedHandleTextSelection = debounce(handleTextSelection, 500);

// Mouse release just after selecting any item this callback function will be called
document.addEventListener('mouseup', debouncedHandleTextSelection);

// Function to generate unique identifier
const generateUniqueIdentifier = () => {
    return uniqueIdentifier++
}

// Every time new item needs to be added or removed from the selectedItems
// this function will be call to update the ui and update the store selectedItems
const replaceText = (id, type) => {
    const item = selectedItems[id]
    const startIndex = paragraph.innerHTML.indexOf(item.text);
    const endIndex = startIndex + item.text.length;
    const textBefore = paragraph.innerHTML.slice(0, startIndex);
    const textAfter = paragraph.innerHTML.slice(endIndex);
    let newElement = ""
    // To add new item replace the original text with template html element and store the origin text in oldText key
    // so that when item is removed we can replace the html element with just text
    if (type === "add") {
        newElement = `<span class="selected-item-wrapper selected-${item.type}"><span>${item.text}</span><span class="selected-item-type-icon" onclick="removeItem(${id})"><span class="selected-item-type">${item.type}</span><span class="icon">❌</span></span></span> `
        selectedItems[id].oldText = item.text
        selectedItems[id].text = newElement
    } else {
        // When remove button clicked object will be deleted from selectedItems variable and 
        newElement = selectedItems[id].oldText
        delete selectedItems.id
    }
    paragraph.innerHTML = `${textBefore} ${newElement} ${textAfter}`;
};

const handleButtonClick = (type) => {
    const tempObj = {
        type,
        text: selectedText.text
    }
    const uniqueId = generateUniqueIdentifier();
    selectedItems[uniqueId] = tempObj
    replaceText(uniqueId, "add")
}

const removeItem = (id) => {
    console.log(id)
    replaceText(id, "remove")
}