// Fetch a list of domains from the storage, if we can.

chrome.storage.local.get().then((listington) => {
    // Create the base table.
    tbl = document.createElement("table")
    tbl.id = "createdTable"
    // The table header
    tblHead = document.createElement("thead")
    hdrrow = document.createElement("tr");
    // For each header item, fill in the correct header
    ['Destination', 'CNAME'].forEach(hdr => {
        cell = document.createElement("th")
        cell.textContent = hdr
        hdrrow.appendChild(cell)
    })
    // Add table header to table
    tblHead.appendChild(hdrrow)
    tbl.appendChild(tblHead)

    // Now the table body
    tblBody = document.createElement("tbody")
    // For each entry in the list...
    Object.entries(listington).forEach(([key, lineitem]) => {
        // Create and populate a row
        row = document.createElement("tr");
        ['dest', 'cname'].forEach(hdr => {
            cell = document.createElement("td")
            cell.textContent = lineitem[hdr]
            row.appendChild(cell)
        })
        tblBody.appendChild(row)
    })
    tbl.appendChild(tblBody)

    // Find and remove the old version of the table, if it exists.
    oldtbl = listfield.querySelector(`#${tbl.id}`)
    if (oldtbl) { listfield.removeChild(oldtbl) }
    // Make table pretty
    tbl.setAttribute('border', '2')
    // Add table to page
    listfield.appendChild(tbl)
}).catch((err) => {
    // If we have errors, put them in the listfield as some kind of clue for debugging.
    listfield.textContent = err
})

// "Clear" button calls this function.
function clearStorage() {
    // Which clears the storage
    chrome.storage.local.clear()
    // And then removes the table.
    oldtbl = listfield.querySelector(`#createdTable`)
    if (oldtbl) { listfield.removeChild(oldtbl) }
}

// Listen for clear button to be pressed.
clearbutton.addEventListener("click", clearStorage)