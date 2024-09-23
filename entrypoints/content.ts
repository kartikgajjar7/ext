import React from "react";
import { createRoot } from "react-dom/client";
import AutoReplyPopup from "./popup/AutoReplyPopup";

export default defineContentScript({
  matches: ["*://*.linkedin.com/*"],
  main() {
    console.log("Hello LinkedIn content.");

    const observer = new MutationObserver(() => {
      insertIconButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function insertIconButton() {
      const messageInputContainer = document.querySelector(
        ".msg-form__contenteditable"
      );
      if (
        messageInputContainer &&
        !document.querySelector("#my-extension-icon")
      ) {
        const iconButton = document.createElement("button");
        iconButton.id = "my-extension-icon";
        iconButton.innerText = "🖊️";
        iconButton.style.position = "absolute";
        iconButton.style.right = "10px";
        iconButton.style.top = "50%";
        iconButton.style.transform = "translateY(-50%)";
        iconButton.style.background = "none";
        iconButton.style.border = "none";
        iconButton.style.cursor = "pointer";
        messageInputContainer.parentElement?.appendChild(iconButton);
        iconButton.addEventListener("click", () => {
          togglePopup();
        });
      }
    }

    function togglePopup() {
      let popupContainer = document.getElementById("react-popup-container");
      if (!popupContainer) {
        popupContainer = document.createElement("div");
        popupContainer.id = "react-popup-container";
        // Add any necessary styling here
        const messageInputContainer = document.querySelector(
          ".scaffold-layout__main"
        );
        if (messageInputContainer && messageInputContainer.parentElement) {
          messageInputContainer.parentElement.style.position = "relative";
          messageInputContainer.parentElement.appendChild(popupContainer);
        } else {
          document.body.appendChild(popupContainer);
        }
        const root = createRoot(popupContainer);
        root.render(React.createElement(AutoReplyPopup));
      } else {
        popupContainer.remove();
      }
    }

    // Listen for messages from the popup
    window.addEventListener("message", (event) => {
      if (
        event.data.type === "FROM_POPUP" &&
        event.data.action === "insertReply"
      ) {
        console.log("Inserting reply");
        const messageInput = document.querySelector(
          ".msg-form__contenteditable"
        ) as HTMLDivElement;

        if (messageInput) {
          // Create a new paragraph element
          const newParagraph = document.createElement("p");
          newParagraph.textContent = event.data.reply;

          // Clear existing content and append the new paragraph
          messageInput.innerHTML = "";
          messageInput.appendChild(newParagraph);

          // Dispatch input event to trigger any listeners
          const inputEvent = new Event("input", { bubbles: true });
          messageInput.dispatchEvent(inputEvent);

          console.log("Reply inserted successfully");
        } else {
          console.error("LinkedIn message input not found!");
        }
      }
    });
  },
});
