import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import EmergencyCard from "../components/EmergencyCard";

// TypedMessage Sub-Component
const TypedMessage = ({ text, speed = 30, onTyping }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    const words = text.split(" ");
    let current = 0;

    const interval = setInterval(() => {
      current++;
      setDisplayedText(words.slice(0, current).join(" "));
      onTyping?.();

      if (current >= words.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayedText}</span>;
};

// Main Chat Component
function Chat() {
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [renameModal, setRenameModal] = useState(false);
const [deleteModal, setDeleteModal] = useState(false);

const [selectedConversation, setSelectedConversation] = useState(null);

const [newTitle, setNewTitle] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I'm Echo. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const textareaRef = useRef(null);

  // Smoothly pin window viewport scroll to the bottom anchor
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  // Scroll whenever messages are added or loading status changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Fetch available conversations from DB
  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/conversations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setConversations(res.data.conversations || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  useEffect(() => {

  const initialize = async () => {

    const token = localStorage.getItem("token");

    try {

      const res = await api.get(
        "/conversations",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const chats = res.data.conversations || [];

      setConversations(chats);

      if (chats.length > 0) {

        loadConversation(chats[0].id);

      }

    } catch (error) {

      console.error(error);

    }

  };

  initialize();

}, []);

  // Create a brand new conversation
  const newConversation = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/conversations",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const id = res.data.conversation.id;
      setConversationId(id);
      setMessages([
        {
          role: "assistant",
          content: "Hi, I'm Echo. How are you feeling today?",
        },
      ]);

      await fetchConversations();
      setSidebarOpen(false);
      setMenuOpen(null);
      return id;
    } catch (error) {
      console.error("Conversation creation failed:", error);
      return null;
    }
  };

  // Load an existing conversation
  const loadConversation = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/conversations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setConversationId(id);
      setMessages(res.data.conversation.messages || []);
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!input.trim()) return;

    let currentConversationId = conversationId;
    if (!currentConversationId) {
      currentConversationId = await newConversation();
      if (!currentConversationId) return; // Halt if conversation setup fails
    }

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/chat",
        {
          conversationId: currentConversationId,
          message: userMessage.content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.type === "chat") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.data.reply,
          },
        ]);
      } else if (res.data.type === "panic") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.data.response.message,
          },
        ]);
      } else if (res.data.type === "crisis") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            emergency: true,
            response: res.data.response,
            helplines: res.data.helplines,
          },
        ]);
      }
    } catch (error) {
      console.error("Message transmission error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Rename a conversation
  const renameConversation = async (
id,
title
) => {

    if (!title.trim()) return;

    try{

        const token =
        localStorage.getItem("token");

        await api.put(

            `/conversations/${id}`,

            { title },

            {

                headers:{
                    Authorization:`Bearer ${token}`
                }

            }

        );

        fetchConversations();

        setRenameModal(false);

    }

    catch(err){

        console.error(err);

    }

};
  // Delete a conversation
  const deleteConversation = async (id) => {

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/conversations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchConversations();

      if (conversationId === id) {
        //set to first available conversation or reset if none
        const remaining = conversations.filter(c => c.id !== id);
        if (remaining.length > 0) {
          loadConversation(remaining[0].id);
        } else {
          newConversation();
        }
      }
      setMenuOpen(null);
    } catch (err) {
      console.error("Deletion failed:", err);
    }
  };

  // Safe global click listener to close the options menu when clicking elsewhere
  useEffect(() => {
    const closeMenu = (e) => {
      if (!e.target.closest(".menu-btn") && !e.target.closest(".conversation-menu")) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  return (
  <div className="echo-chatspace-viewport">
    {sidebarOpen && (
      <div
        className="echo-chatspace-overlay"
        onClick={() => {
          setSidebarOpen(false);
          setMenuOpen(null);
        }}
      />
    )}

    {/* --- LEFT SIDEBAR: Conversational History --- */}
    <aside className={`echo-chatspace-sidebar ${sidebarOpen ? "echo-chatspace-open" : ""}`}>
      <div className="echo-chatspace-sidebar-header">
        <button
          className="echo-chatspace-close-btn"
          onClick={() => {
            setSidebarOpen(false);
            setMenuOpen(null);
          }}
        >
          ✕
        </button>

        <button
          className="echo-chatspace-new-btn"
          onClick={async () => {
            await newConversation();
            setSidebarOpen(false);
            setMenuOpen(null);
          }}
        >
          <span className="echo-chatspace-plus-icon">+</span>
          New Conversation
        </button>
      </div>

      <div className="echo-chatspace-scroll-box">
        <span className="echo-chatspace-section-title">Recent Chats</span>

        <div className="echo-chatspace-list">
          {(conversations || []).map((conversation) => (
            <div
              key={conversation.id}
              className={`echo-chatspace-item ${
                conversation.id === conversationId ? "echo-chatspace-active" : ""
              }`}
            >
              <span
                className="echo-chatspace-item-title"
                onClick={() => {
                  loadConversation(conversation.id);
                  setSidebarOpen(false);
                  setMenuOpen(null);
                }}
              >
                💬 {conversation.title}
              </span>

              <button
                className="echo-chatspace-dots-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(
                    menuOpen === conversation.id ? null : conversation.id
                  );
                }}
              >
                ⋮
              </button>

              {menuOpen === conversation.id && (
                <div
                  className="echo-chatspace-dropdown-menu"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
onClick={() => {

    setSelectedConversation(conversation);

    setNewTitle(conversation.title);

    setRenameModal(true);

    setMenuOpen(null);

}}
>
    ✏ Rename
</button>
                  <button
                    onClick={() => {
                      setSelectedConversation(conversation);
                      setDeleteModal(true);
                      setMenuOpen(null);
                    }}
                  >
                    🗑 Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="echo-chatspace-footer-hint">
        <span>Keeping your words safe.</span>
      </div>
    </aside>

    {/* --- RIGHT PANEL: Main Chat Area --- */}
    <main className="echo-chatspace-main-panel">
      <div className="echo-chatspace-top-bar">
        <button
          className="echo-chatspace-toggle-btn"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
        <Link to="/dashboard" className="echo-chatspace-back-btn">
          <span className="echo-chatspace-back-arrow">←</span> Return to Dashboard
        </Link>
        <div className="echo-chatspace-identity">
          <span className="echo-chatspace-status-dot"></span>
          <span>Echo Companion</span>
        </div>
      </div>

      {/* Scrolling Viewport Box Target */}
      <div className="echo-chatspace-messages-container" ref={scrollContainerRef}>
        {messages.length === 0 ? (
          <div className="echo-chatspace-welcome-view">
            <h2>Welcome to Echo</h2>
            <p>
              I am here to listen, mirror, and help you carry whatever weight
              is on your mind. Speak freely, without judgment.
            </p>
          </div>
        ) : (
          <div className="echo-chatspace-stream">
            {messages.map((message, index) => {
              const isAssistant = message.role !== "user";
              const isLatestMessage = index === messages.length - 1;

              return (
                <div
                  key={index}
                  className={`echo-chatspace-row ${
                    isAssistant ? "echo-chatspace-row-assistant" : "echo-chatspace-row-user"
                  }`}
                >
                  {isAssistant && <div className="echo-chatspace-avatar">E</div>}
                  {message.emergency ? (
                    <EmergencyCard
                      response={message.response}
                      helplines={message.helplines}
                    />
                  ) : (
                    <div className="echo-chatspace-bubble">
                      {isAssistant && isLatestMessage ? (
                        <TypedMessage
                          text={message.content}
                          speed={30}
                          onTyping={scrollToBottom}
                        />
                      ) : (
                        message.content
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loader Hook */}
            {loading && (
              <div className="echo-chatspace-row echo-chatspace-row-assistant echo-chatspace-processing">
                <div className="echo-chatspace-bubble echo-chatspace-loader">
                  <span className="echo-chatspace-dot"></span>
                  <span className="echo-chatspace-dot"></span>
                  <span className="echo-chatspace-dot"></span>
                </div>
              </div>
            )}

            {/* Invisible layout anchor marker point */}
            <div
              ref={messagesEndRef}
              style={{ float: "left", clear: "both" }}
            />
          </div>
        )}
      </div>

      {/* Input Interface */}
      <footer className="echo-chatspace-footer-dock">
        <div className="echo-chatspace-input-wrapper">
          <textarea
            ref={textareaRef}
            placeholder="Share what is moving through your mind right now..."
            value={input}
            rows={1}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
                setTimeout(() => {
                  if (textareaRef.current) {
                    textareaRef.current.style.height = "50px";
                  }
                }, 0);
              }
            }}
          />
          <button
            className="echo-chatspace-send-btn"
            onClick={() => {
              sendMessage();
              if (textareaRef.current) {
                textareaRef.current.style.height = "50px";
              }
            }}
            disabled={!input.trim() || loading}
          >
            Send ↗
          </button>
        </div>
        <p className="echo-chatspace-disclaimer">
          Take your time. You can type as little or as much as you need.
        </p>
      </footer>
    </main>
    {renameModal && (

<div className="echo-modal-overlay">

<div className="echo-modal">

<h3>Rename Conversation</h3>

<input

value={newTitle}

onChange={(e)=>setNewTitle(e.target.value)}

autoFocus

/>

<div className="echo-modal-actions">

<button

className="cancel"

onClick={()=>setRenameModal(false)}

>

Cancel

</button>

<button

className="save"

onClick={()=>{

renameConversation(

selectedConversation.id,

newTitle

);

}}

>

Save

</button>

</div>

</div>

</div>

)}

{deleteModal && (

<div className="echo-modal-overlay">

<div className="echo-modal delete">

<h3>Delete Conversation?</h3>

<p>

This conversation will be permanently deleted.

</p>

<div className="echo-modal-actions">

<button

className="cancel"

onClick={()=>setDeleteModal(false)}

>

Cancel

</button>

<button

className="delete"

onClick={()=>{

deleteConversation(

selectedConversation.id

);

setDeleteModal(false);

}}

>

Delete

</button>

</div>

</div>

</div>

)}
  </div>
);
}

export default Chat;