import React, { useState } from "react";

const AutoReplyPopup: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");

  const generateReply = async () => {
    // TODO: Implement logic to generate reply based on prompt
    const fakeGeneratedReply = `This is a generated reply based on: "${prompt}"`;
    setGeneratedReply(fakeGeneratedReply);
  };

  const insertReply = () => {
    if (generatedReply) {
      window.postMessage(
        { type: "FROM_POPUP", action: "insertReply", reply: generatedReply },
        "*"
      );
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 p-5 bg-[#0077B5] rounded-lg shadow-lg text-white font-sans">
      <h2 className="text-2xl font-bold mb-5 text-center text-white">
        Generate Auto Reply
      </h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here..."
        className="w-full  h-24 p-2.5 mb-4 rounded border-none resize-y text-sm text-gray-700"
      />
      <button
        onClick={generateReply}
        className="bg-white text-[#0077B5] border-none py-2.5 px-4 rounded cursor-pointer text-base font-bold"
      >
        Generate Reply
      </button>
      {generatedReply && (
        <>
          <h3 className="text-white mt-5 mb-2">Generated Reply:</h3>
          <p className="bg-white bg-opacity-10 p-2.5 rounded mb-4 text-white">
            {generatedReply}
          </p>
          <button
            onClick={insertReply}
            className="bg-[#00A0DC] text-white border-none py-2.5 px-4 rounded cursor-pointer text-base font-bold"
          >
            Insert Reply
          </button>
        </>
      )}
    </div>
  );
};

export default AutoReplyPopup;
