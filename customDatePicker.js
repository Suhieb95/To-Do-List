class CustomDatePicker extends HTMLElement {
  constructor() {
    super();

    // Attach a Shadow DOM
    const shadow = this.attachShadow({ mode: "open" });

    // Add styles and markup
    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", "date-picker");

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Select a date");
    input.setAttribute("readonly", true);

    const calendar = document.createElement("div");
    calendar.setAttribute("class", "calendar-popup");

    // Hide calendar initially
    calendar.style.display = "none";

    wrapper.appendChild(input);
    wrapper.appendChild(calendar);

    shadow.appendChild(wrapper);

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
      .date-picker {
        position: relative;
        display: inline-block;
        font-family: Arial, sans-serif;
      }

      input {
        width: 200px;
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      .calendar-popup {
        position: absolute;
        top: 40px;
        left: 0;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        z-index: 10;
        padding: 10px;
      }

      .calendar-popup button {
        padding: 5px;
        margin: 2px;
        background: #0077ff;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
      }

      .calendar-popup button:hover {
        background: #0056d2;
      }
    `;
    shadow.appendChild(style);

    // Add interactivity
    input.addEventListener("click", () => {
      calendar.style.display =
        calendar.style.display === "none" ? "block" : "none";
    });

    // Example: Add buttons for days (basic functionality)
    for (let i = 1; i <= 31; i++) {
      const day = document.createElement("button");
      day.textContent = i;
      day.addEventListener("click", () => {
        input.value = `2025-01-${i.toString().padStart(2, "0")}`;
        calendar.style.display = "none";
      });
      calendar.appendChild(day);
    }
  }
}

// Define the custom element
customElements.define("custom-date-picker", CustomDatePicker);
