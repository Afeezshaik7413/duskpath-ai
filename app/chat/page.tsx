"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {useEffect,useRef} from "react";
type Message = { role: "user" | "ai"; text: string };

const isLowQuality = (text: string) => {
  const low = ["hi", "hello", "hey", "ok", "hii"];
  return low.includes(text.toLowerCase().trim());
};

const getSmartTitle = (text: string) => {
  const lowQuality = ["hi", "hello", "hey", "ok", "hii"];

  const clean = text.toLowerCase().trim();

  if (lowQuality.includes(clean) || clean.length < 4) {
    return "New Chat";
  }

  return text.split(" ").slice(0, 4).join(" ");
};
export default function Chat() {
  const [chats, setChats] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("General Chat");
  const [message,setMessage]=useState("");
  const [showMenu, setShowMenu] = useState(false);
  const chatEndRef =useRef<HTMLDivElement| null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const remainingTextRef = useRef("");
  const fullTextRef = useRef("");
  const typedTextRef = useRef("");
  const[loading,setloading]=useState(false);
  const [menu, setMenu] = useState<{
  x: number;
  y: number;
  chatId: string;
} | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingIntervalRef = useRef<number | null>(null);
  const fetchControllerRef = useRef<AbortController | null>(null);
  const currentChat = chats.find((c) => c.id === currentChatId);

  const typeMessage = (
  text: string,
  callback: (val: string) => void,
  onComplete?: () => void
) => {
  if (typingIntervalRef.current) {
    clearInterval(typingIntervalRef.current);
  }

  fullTextRef.current = text;
  remainingTextRef.current = text;
  typedTextRef.current = "";

  let index = 0;

  typingIntervalRef.current = window.setInterval(() => {
    const next = text.slice(0, index);

    typedTextRef.current = next;
    remainingTextRef.current = text.slice(index);

    callback(next);
    index++;

    if (index > text.length) {
      clearInterval(typingIntervalRef.current!);
      typingIntervalRef.current = null;
      remainingTextRef.current = "";
      onComplete?.();
    }
  }, 8);
};

const [goal, setGoal] = useState("");

const generatePath = async (goal: string) => {
  const res = await fetch("/api/learning-path", {
    method: "POST",
    body: JSON.stringify({ goal }),
  });

  const data = await res.json();
  console.log(data.path);
};

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  // 🔁 Load chat memory from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const serialized = window.localStorage.getItem("duskpath-chats");
      if (!serialized) return;
      const parsed = JSON.parse(serialized);
      if (parsed?.chats) {
        setChats(parsed.chats);
        setCurrentChatId(parsed.currentChatId ?? parsed.chats[0]?.id ?? null);
      }
    } catch (e) {
      console.error("Failed to load chats from localStorage", e);
    }
  }, []);


  // 🔒 Save chat memory to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        "duskpath-chats",
        JSON.stringify({ chats, currentChatId })
      );
    } catch (e) {
      console.error("Failed to save chats to localStorage", e);
    }
  }, [chats, currentChatId]);

  // ✅ CREATE NEW CHAT
  const createNewChat = (selectedMode = mode) => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      mode: selectedMode,
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setMode(selectedMode);
  };

  // ✅ SEND MESSAGE
  const handleSend = async () => {
    if (!input.trim()) return;

    let chatId = currentChatId;

    if (!chatId) {
      const newChat = {
        id: Date.now().toString(),
        title: input.slice(0, 25),
        mode,
        messages: [],
      };
      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      chatId = newChat.id;
    }

    const userMessage = { role: "user", text: input };

    setChats((prev) =>
     prev.map((chat) =>
       chat.id === chatId
       ? {
          ...chat,
          messages: [...(chat.messages || []), userMessage],
         }
       : chat
  )
);
setChats((prev) =>
  prev.map((chat) =>
    chat.id === currentChatId && chat.title === "New Chat"
      ? { ...chat, title: input }
      : chat
  )
);

    const userInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const conversationHistory = [
        ...(currentChat?.messages || []),
        { role: "user", text: userInput },
      ];

       setloading(true);
      fetchControllerRef.current = new AbortController();

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
          history: conversationHistory,
        }),
        signal: fetchControllerRef.current.signal,
      });

      const data = await res.json();
        setloading(false);
      const aiMessage = {
        role: "ai",
        text: "",
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, aiMessage] }
            : chat
        )
      );

      typeMessage(
        data.reply,
        (typedText) => {
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === currentChatId
                ? {
                    ...chat,
                    messages: chat.messages.map((msg: Message, index: number) =>
                      index === chat.messages.length - 1
                        ? { ...msg, text: typedText }
                        : msg
                    ),
                  }
                : chat
            )
          );
        },
        () => {
          setIsTyping(false);
          fetchControllerRef.current = null;
        }
      );
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("AI request aborted");
      } else {
        console.error(err);
      }

      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }

      fetchControllerRef.current = null;
      setIsTyping(false);
    }
  };

  const stopConversation = () => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
      fetchControllerRef.current = null;
    }

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    setIsTyping(false);
  };
  const continueConversation = () => {
  const remaining = remainingTextRef.current;

  if (!remaining) return;
  setIsTyping(true);
  let index = 0;

  typingIntervalRef.current = window.setInterval(() => {
    const next =
      typedTextRef.current + remaining.slice(0, index);

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: chat.messages.map((msg: Message, i: number) =>
                i === chat.messages.length - 1
                  ? { ...msg, text: next }
                  : msg
              ),
            }
          : chat
      )
    );

    index++;

    if (index > remaining.length) {
      clearInterval(typingIntervalRef.current!);
      typingIntervalRef.current = null;
      remainingTextRef.current = "";
      setIsTyping(false);
    }
  }, 8);
};
  return (
    <div className="flex h-screen bg-black text-white">
  
   

      {/* 🔥 SIDEBAR */}
{sidebarOpen && (
  <div className="w-64 bg-[#0b0f19] p-4 flex flex-col justify-between border-r border-gray-800">

    <div>
      {/* TOP */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-semibold">DUSK PATH AI</h1>
        <button onClick={() => setSidebarOpen(false)}>✕</button>
      </div>

      {/* NEW CHAT */}
      <button
        onClick={() => createNewChat()}
        className="w-full bg-[#1e293b] py-2 rounded-xl mb-6 hover:bg-[#334155]"
      >
        New Chat
      </button>

      {/* MODES */}
      <div className="space-y-2 mb-4">
        {["General Chat", "Model Papers", "Learning Path"].map((m) => (
          <div
            key={m}
            onClick={() => createNewChat(m)} // ✅ NEW CHAT ON CLICK
            className="p-2 hover:bg-[#1e293b] rounded cursor-pointer"
          >
            {m}
          </div>
        ))}
      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-700 my-4"></div>

      {/* RECENT CHATS */}
      <p className="text-xs text-gray-500 mb-2">Recent Chats</p>

      <div className="space-y-1">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setCurrentChatId(chat.id)}
            onContextMenu={(e) => {
              e.preventDefault();

              setMenu({
                x: e.clientX,
                y: e.clientY,
                chatId: chat.id,
              });
            }}
            className="p-2 text-xs bg-[#1e293b] rounded cursor-pointer hover:bg-[#334155]"
          >
            {chat.title}
          </div>
        ))}
      </div>
    </div>

    {/* BOTTOM */}
    <div className="space-y-2">
      <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#1e293b]">
        👤 Profile
      </button>
      <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#1e293b]">
        ⚙️ Settings
      </button>
    </div>
  </div>
)}

      {/* 🔥 MAIN */}
      <div className="flex-1 flex flex-col">
        
        {/* 🔐 LOGIN SECTION */}

       <div className="p-4 flex justify-end gap-3">
       <div className="text-sm">
           Welcome to DuskPath AI
       </div>
       </div>

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4"
          >
            ☰
          </button>
        )}

        {/* 🔥 WELCOME */}
        {!currentChat && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl font-bold">Welcome to</h1>
            <h1 className="text-6xl font-extrabold mt-2">
              DUSK PATH AI
            </h1>
            <p className="text-gray-400 mt-4">
              Your Personal AI Study assistant
            </p>
          </div>
        )}

        {/* 🔥 CHAT */}
        {currentChat && (
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="w-full max-w-2xl mx-auto space-y-6">

              {currentChat.messages.map((msg: Message, i: number) => (

                <div key={i}>

                  {/* USER */}
                  {msg.role === "user" && (
                    <div className="flex justify-end">
                      <div className="bg-blue-600 px-4 py-3 rounded-2xl rounded-br-none max-w-[70%] text-sm">
                        {msg.text}
                      </div>
                    </div>
                  )}

                  {/* AI */}
                  {msg.role === "ai" && (
                    <div className="text-gray-300 text-sm leading-relaxed max-w-[85%]">
                      <ReactMarkdown
                         components={{
                                    h1: ({ children }) => (
                                    <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>
                                    ),
                                    h2: ({ children }) => (
                                    <h2 className="text-lg font-semibold mt-3 mb-2">{children}</h2>
                                    ),
                                      h3: ({ children }) => (
                                       <h3 className="text-md font-medium mt-2 mb-1">{children}</h3>
                                       ),
                                         p: ({ children }) => (
                                        <p className="text-sm leading-relaxed mb-2">{children}</p>
                                         ),
                                         li: ({ children }) => (
                                             <li className="ml-4 list-disc text-sm mb-1">{children}</li>
                                        ),
                                             }}
                                           >
                                      {msg.text.replace(/\\/g, "")}
                                  </ReactMarkdown>
                    </div>
                  )}

                </div>

              ))}

              {isTyping && (
                <div className="flex items-start">
                  <div className="text-gray-400 text-sm leading-relaxed max-w-[85%] animate-pulse">
                    Typing...
                  </div>
                </div>
              )}

              <div ref={chatEndRef}></div>

            </div>
          </div>
        )}

        {/* 🔥 INPUT */}
        <div className="w-full max-w-2xl mx-auto p-4 relative">

          <div className="flex items-center bg-[#0f172a] border border-gray-700 rounded-xl px-3 py-2">

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-lg mr-2 text-gray-400"
            >
              +
            </button>

            <div className="relative flex-1">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask DUSK AI anything..."
                className="w-full pr-12 bg-transparent outline-none text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />

              <button
                onClick={() => {
  if (isTyping) {
    stopConversation();
  } else if (remainingTextRef.current) {
    continueConversation(); // 🔥 THIS WAS MISSING
  } else {
    handleSend();
  }
}}
                className={`absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 rounded-full text-sm ${
                  isTyping ? "bg-red-600 hover:bg-red-500" : "bg-blue-600 hover:bg-blue-500"
                }`}
                aria-label={isTyping ? "Stop response" : "Send message"}
              >
                {isTyping ? "⏹" : remainingTextRef.current ? "▶" : "↑"}
              </button>
            </div>
          </div>

          {/* MODE MENU */}
          {showMenu && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#0f172a] border border-gray-700 rounded-xl p-2 flex gap-2">
              {["General Chat", "Model Papers", "Learning Path"].map((m) => (
                <div
                  key={m}
                  onClick={() => {
                    setMode(m);
                    createNewChat(m);
                    setShowMenu(false);
                  }}
                  className="px-4 py-2 text-sm bg-[#1e293b] rounded cursor-pointer"
                >
                  {m}
                </div>
              ))}
            </div>
          )}
        </div>


          {/* 🔥 RIGHT CLICK MENU */}
         {menu && (
             <div
               className="fixed bg-black text-white p-3 rounded-lg shadow-lg z-[9999]"
                 style={{
                  top: menu.y,
                 left: menu.x,
                 }}
                >
               <div
             onClick={() => {
           const newName = prompt("Rename chat:");
                if (!newName) return;

               setChats((prev) =>
               prev.map((c) =>
               c.id === menu.chatId ? { ...c, title: newName } : c
               )
             );

              setMenu(null);
               }}
                className="px-2 py-1 hover:bg-gray-700 cursor-pointer"
             >
          Rename
         </div>

    <div
      onClick={() => {
        setChats((prev) =>
          prev.filter((c) => c.id !== menu.chatId)
        );

        setMenu(null);
      }}
      className="px-2 py-1 hover:bg-red-500 cursor-pointer"
    >
      Delete
    </div>
  </div>
)}

</div>
</div>
  )
}