// import React, { useState } from "react";
// import "./style.css";
// const AutoReplyPopup: React.FC = () => {
//   const [prompt, setPrompt] = useState("");
//   const [generatedReply, setGeneratedReply] = useState("");

//   const generateReply = async () => {
//     // TODO: Implement logic to generate reply based on prompt
//     const fakeGeneratedReply = `This is a generated reply based on: "${prompt}"`;
//     setGeneratedReply(fakeGeneratedReply);
//   };

//   const insertReply = () => {
//     if (generatedReply) {
//       window.postMessage(
//         { type: "FROM_POPUP", action: "insertReply", reply: generatedReply },
//         "*"
//       );
//     }
//   };

//   return (
//     <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 p-5 bg-[#0077B5] rounded-lg shadow-lg text-white font-sans">
//       <h2 className="text-4xl font-bold mb-5 text-center text-black">
//         Generate Auto Reply
//       </h2>
//       <textarea
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)}
//         placeholder="Enter your prompt here..."
//         className="w-full  h-24 p-2.5 mb-4 rounded border-none resize-y text-sm text-gray-700"
//       />
//       <button
//         onClick={generateReply}
//         className="bg-white text-[#0077B5] border-none py-2.5 px-4 rounded cursor-pointer text-base font-bold"
//       >
//         Generate Reply
//       </button>
//       {generatedReply && (
//         <>
//           <h3 className="text-white mt-5 mb-2">Generated Reply:</h3>
//           <p className="bg-white bg-opacity-10 p-2.5 rounded mb-4 text-white">
//             {generatedReply}
//           </p>
//           <button
//             onClick={insertReply}
//             className="bg-[#00A0DC] text-white border-none py-2.5 px-4 rounded cursor-pointer text-base font-bold"
//           >
//             Insert Reply
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default AutoReplyPopup;
import React, { useState, useEffect, useRef } from "react";
import "./style.css";

const AutoReplyPopup: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<
    { userMessage: string; aiReply: string }[]
  >([]);
  const [showGenerate, setShowGenerate] = useState(true);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to generate a reply
  const generateReply = async () => {
    if (prompt.trim() === "") {
      return;
    }

    setShowGenerate(false); // Hide the generate button once reply is generated

    const fakeGeneratedReply =
      "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";

    // Add the new user message and AI reply to the messages array
    setMessages((prevMessages) => [
      ...prevMessages,
      { userMessage: prompt, aiReply: fakeGeneratedReply },
    ]);
    setPrompt(""); // Clear the input
    setShowGenerate(true); // Show generate button for the next input
  };

  // Function to insert the generated reply into the external message input
  const insertReply = () => {
    if (messages.length > 0) {
      window.postMessage(
        {
          type: "FROM_POPUP",
          action: "insertReply",
          reply: messages[messages.length - 1].aiReply,
        },
        "*"
      );
    }
  };

  return (
    <>
      <div className="fixed flex flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full md:w-2/5 p-6 bg-white rounded-lg shadow-lg font-sans z-[999] border border-3">
        {/* Display chat history */}
        <div
          ref={chatHistoryRef}
          className="my-4 overflow-y-auto flex flex-col gap-4 max-h-80"
        >
          {messages.map((messagePair, index) => (
            <div key={index} className="flex flex-col gap-2">
              {/* User message on the right */}
              <div className="bg-gray-100 p-3 text-gray-700 rounded-lg self-end max-w-2/3">
                {messagePair.userMessage}
              </div>
              {/* AI reply on the left */}
              <div className="bg-blue-100 p-3 text-gray-700 rounded-lg self-start max-w-[400px]">
                {messagePair.aiReply}
              </div>
            </div>
          ))}
        </div>

        {/* Input field for the user to type their prompt */}
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your message here..."
          className="w-full p-3 mb-4 rounded border border-gray-300 resize-y text-sm text-gray-700"
        />
        <div className="flex justify-end gap-2 items-center">
          {showGenerate && (
            <button
              onClick={generateReply}
              className="bg-blue-500 hover:bg-blue-600 text-white border-none py-2.5 px-4 rounded cursor-pointer text-base font-bold flex items-center gap-2"
            >
              <span>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24.456 11.6075L2.45599 0.607504C2.28356 0.521271 2.08988 0.486719 1.89827 0.508009C1.70665 0.529299 1.52528 0.605523 1.37599 0.727504C1.23341 0.846997 1.12699 1.00389 1.0687 1.18055C1.0104 1.35721 1.00254 1.54662 1.04599 1.7275L4.00599 12.4975L1.00599 23.2375C0.965214 23.3886 0.960455 23.5471 0.992092 23.7003C1.02373 23.8535 1.09088 23.9972 1.18815 24.1198C1.28541 24.2423 1.41008 24.3403 1.55212 24.4059C1.69416 24.4715 1.84962 24.5029 2.00599 24.4975C2.16253 24.4966 2.31667 24.4589 2.45599 24.3875L24.456 13.3875C24.6198 13.3036 24.7573 13.1761 24.8532 13.0191C24.9492 12.862 25 12.6816 25 12.4975C25 12.3135 24.9492 12.133 24.8532 11.9759C24.7573 11.8189 24.6198 11.6914 24.456 11.6075ZM3.55599 21.6075L5.76599 13.4975H15.006V11.4975H5.76599L3.55599 3.3875L21.766 12.4975L3.55599 21.6075Z"
                    fill="white"
                  />
                </svg>
              </span>
              <span>Send</span>
            </button>
          )}
          {messages.length > 0 && (
            <>
              <button
                onClick={insertReply}
                className="text-slate-700 border border-slate-700 py-2 px-3 rounded cursor-pointer flex items-center gap-2"
              >
                <span>
                  <svg
                    width="10"
                    height="12"
                    viewBox="0 0 15 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.1 12.3666V1.43331C6.1 1.05553 6.228 0.739087 6.484 0.483976C6.74 0.228865 7.05644 0.100864 7.43333 0.0999756C7.81111 0.0999756 8.128 0.227976 8.384 0.483976C8.64 0.739976 8.76756 1.05642 8.76667 1.43331V12.3666L12.6333 8.49998C12.8778 8.25553 13.1889 8.13331 13.5667 8.13331C13.9444 8.13331 14.2556 8.25553 14.5 8.49998C14.7444 8.74442 14.8667 9.05553 14.8667 9.43331C14.8667 9.81109 14.7444 10.1222 14.5 10.3666L8.36667 16.5C8.1 16.7666 7.78889 16.9 7.43333 16.9C7.07778 16.9 6.76667 16.7666 6.5 16.5L0.366666 10.3666C0.122222 10.1222 0 9.81109 0 9.43331C0 9.05553 0.122222 8.74442 0.366666 8.49998C0.611111 8.25553 0.922222 8.13331 1.3 8.13331C1.67778 8.13331 1.98889 8.25553 2.23333 8.49998L6.1 12.3666Z"
                      fill="#666D80"
                    />
                  </svg>
                </span>
                <span>Insert</span>
              </button>
            </>
          )}
        </div>

        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 cursor-pointer text-2xl"
          onClick={() => window.postMessage({ type: "CLOSE_POPUP" }, "*")}
        >
          &times;
        </button>
      </div>
    </>
  );
};

export default AutoReplyPopup;
