// pages/index.js
import { useState, useRef, useEffect } from "react";
import "tailwindcss/tailwind.css";
import Head from "next/head";

export default function Home() {
  const [chatLog, setChatLog] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const textAreaRef = useRef(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);

  useEffect(() => {
    const textArea = textAreaRef.current;
    textArea.style.height = "auto";
    textArea.style.height = `${textArea.scrollHeight}px`;
  }, [userMessage]);

  const handleSubmit = async (e, _userMessage) => {
    const message = userMessage || _userMessage;

    if (!message) {
      return;
    }

    setUserMessage("");

    setError(false);
    setLoading(true);
    e.preventDefault();

    setChatLog([...chatLog, { role: "user", message }]);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (response.status !== 200) {
      setError(true);
      setLoading(false);
      setUserMessage(message);
      setChatLog((prevState) => {
        const updatedChatLog = [...prevState];
        updatedChatLog.splice(-1);
        return updatedChatLog;
      });
      return;
    }

    const data = await response.json();
    setChatLog([
      ...chatLog,
      { role: "user", message },
      { role: "bot", message: data.message },
    ]);
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center pt-4 max-h-screen p-2 m-auto"
      style={{ maxWidth: "768px" }}
    >
      <Head>
        <title>Jonathan Bot</title>
      </Head>
      <div
        className="backdrop-blur container flex-grow overflow-y-auto relative mb-4"
        style={{ maxHeight: "100vh" }}
      >
        <div className="fade-overlay top-0 left-0 w-full h-10 sticky" />
        <h1 className="m-auto text-center mb-8 mx-5">
          Hi, I&apos;m Jonathan Bot. I&apos;m here to tell you why you should
          hire Jonathan.
        </h1>
        {chatLog.map((entry, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 mb-4 ${
              entry.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-black`}
              style={{
                minHeight: "32px",
                maxHeight: "32px",
                minWidth: "32px",
                maxWidth: "32px",
                fontWeight: "bold",
                backgroundColor: entry.role === "user" ? "#292524" : "white",
                color: entry.role === "user" ? "white" : "black",
              }}
            >
              {entry.role === "user" ? "?" : "J"}
            </div>
            <span
              className={`break-word px-4 py-2 rounded-lg text-bubble ${
                entry.role === "user" ? "bg-user-bubble" : "bg-bot-bubble"
              }`}
            >
              {entry.message}
            </span>
          </div>
        ))}
        {loading && <div className="ellipsis-animation mt-4" />}
        <div ref={messagesEndRef} />
      </div>
      {error && (
        <div className="bottom-4 mb-4  transform  bg-red-500 text-white px-3 py-1.5 rounded-md shadow-lg w-full text-center">
          Something went wrong. Please try again. Vercel&apos;s free servers
          timeout quickly.
        </div>
      )}

      <div
        style={{ minHeight: "40px" }}
        className="flex mb-4 gap-2 item-center justify-start w-full overflow-x-auto whitespace-nowrap"
      >
        <button
          style={{ backgroundColor: "#CB785C" }}
          className="px-2 rounded-xl text-white"
          onClick={(e) => {
            handleSubmit(e, "Why should we hire him");
          }}
        >
          Why should we hire him
        </button>
        <button
          style={{ backgroundColor: "#CB785C" }}
          className="p-2 rounded-xl text-white"
          onClick={(e) => {
            handleSubmit(e, "What are his skills?");
          }}
        >
          What are his skills?
        </button>
        <button
          style={{ backgroundColor: "#CB785C" }}
          className="p-2 rounded-xl text-white"
          onClick={(e) => {
            handleSubmit(e, "Why is he a good fit for Anthropic?");
          }}
        >
          Why is he a good fit for Anthropic?
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="container flex-shrink-0 p-4 flex mb-3 bg-white border-t border-gray-200 rounded-xl gap-4 items-center"
        style={{ boxShadow: "var(--input-shadow)" }}
      >
        <textarea
          ref={textAreaRef}
          value={userMessage}
          onKeyPress={handleKeyPress}
          onChange={(e) => setUserMessage(e.target.value)}
          className="flex-grow rounded-l bg-white text-black resize-none outline-none"
          placeholder="Message Jonathan Bot..."
          rows="1"
          style={{
            maxHeight: "18em",
            overflowY: "auto",
            height: "fit-content!important",
          }}
        />
        <button
          disabled={!userMessage || loading}
          type="submit"
          className="p-2 bg-button-bg-color text-white rounded-lg self-end items-center flex"
          style={{
            backgroundColor: "var(--button-bg-color)",
            height: "32px",
            width: "32px",
          }}
        >
          {loading ? (
            <svg
              className="animate-spin h-8 w-8 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 1.042.135 2.052.385 3h1.534c-.14-.476-.219-.974-.219-1.5a6 6 0 016 6v-4z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              style={{ transform: "rotate(90deg)" }}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
