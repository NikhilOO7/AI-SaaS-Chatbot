import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { red } from "@mui/material/colors";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import {
    deleteUserChats,
    getUserChats,
    sendChatRequest,
  } from "../helpers/api-communicator";
  import { useNavigate } from "react-router-dom";
  import toast from "react-hot-toast";

function Chat() {
    const navigate = useNavigate();
    const auth = useAuth();
    
    const inputRef = useRef<HTMLInputElement | null>(null);
    
    const [chats, setChats] = useState<{ role: string; content: string }[]>([]);
    
    const handleSubmit = async () => {
        const content = inputRef.current?.value as string;
        if(inputRef && inputRef.current) {
            inputRef.current.value = "";
        }
        const newMessage = { role: "user", content: content };

        setChats((prev) => [...prev, newMessage]);

        // Send message to backend
        const chatData = await sendChatRequest(content);
        setChats([...chatData.chats]);
    };

    const handleDeleteChats = async () => {
        try {
          toast.loading("Deleting Chats", { id: "deletechats" });
          await deleteUserChats();
          setChats([]);
          toast.success("Deleted Chats Successfully", { id: "deletechats" });
        } catch (error) {
          console.log(error);
          toast.error("Deleting chats failed", { id: "deletechats" });
        }
      };

      useLayoutEffect(() => {
        if (auth?.isLoggedIn && auth.user) {
          toast.loading("Loading Chats", { id: "loadchats" });
          getUserChats()
            .then((data) => {
              setChats([...data.chats]);
              toast.success("Successfully loaded chats", { id: "loadchats" });
            })
            .catch((err) => {
              console.log(err);
              toast.error("Loading Failed", { id: "loadchats" });
            });
        }
      }, [auth]);

      useEffect(() => {
        if (!auth?.user) {
          return navigate("/login");
        }
      }, [auth]);

    return (
        <Box
            sx={{
                display: "flex",
                flex: 1,
                width: "100%",
                height: "100%",
                mt: 3,
                gap: 3,
            }}
        >
            <Box
                sx={{
                    display: {
                        md: "flex",
                        xs: "none",
                        sm: "none",
                    },
                    flex: 0.2,
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        height: "60vh",
                        bgcolor: "rgb(17, 29, 39)",
                        borderRadius: 5,
                        flexDirection: "column",
                        mx: 3,
                    }}
                >
                    <Avatar
                        sx={{
                            mx: "auto",
                            my: 2,
                            bgcolor: "white",
                            color: "black",
                            fontWeight: 700,
                        }}
                    >
                        {auth?.user?.name[0]}
                        {auth?.user?.name.split(" ")[1][0]}
                    </Avatar>
                    <Typography
                        sx={{
                            mx: "auto",
                            fontFamily: "work sans",
                        }}
                    >
                        You are talking to a CHATBOT
                    </Typography>
                    <Typography
                        sx={{
                            mx: "auto",
                            fontFamily: "work sans",
                            my: 4,
                            p: 3,
                        }}
                    >
                        You can ask question related to Programming, Business,
                        Advices, Education, etc. But avoid sharing personal
                        information.
                    </Typography>
                    <Button
                        onClick={handleDeleteChats}
                        sx={{
                            width: "200px",
                            my: "auto",
                            color: "white",
                            fontWeight: 700,
                            borderRadius: 3,
                            mx: "auto",
                            bgcolor: red[300],
                            ":hover": {
                                bgcolor: red.A400,
                            },
                        }}
                    >
                        Clear Conversation
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flex: {
                        md: 0.8,
                        xs: 1,
                        sm: 1,
                    },
                    flexDirection: "column",
                    px: 3,
                }}
            >
                <Typography
                    sx={{
                        fontSize: "40px",
                        color: "white",
                        mb: 2,
                        mx: "auto",
                        fontWeight: 600,
                    }}
                >
                    Model - GPT 4o Latest
                </Typography>
                <Box
                    sx={{
                        width: "100%",
                        height: "60vh",
                        borderRadius: 3,
                        mx: "auto",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "scroll",
                        overflowX: "hidden",
                        overflowY: "auto",
                        scrollBehavior: "smooth",
                    }}
                >
                    {chats.map((chat) => (
                        <ChatItem
                            //@ts-ignore 
                            role={chat.role} 
                            content={chat.content}
                            key={Math.random()}
                        />
                    ))}
                </Box>
                <div
                    style={{
                        width: "100%",
                        borderRadius: 8,
                        display: "flex",
                        backgroundColor: "rgb(17, 29, 39)",
                        margin: "auto",
                    }}
                >
                    <input 
                        ref={inputRef}
                        type="text" 
                        placeholder="Type your message here"
                        style={{
                            width: "100%",
                            background: "transparent",
                            padding: "30px",
                            border: "none",
                            outline: "none",
                            color: "white",
                            fontSize: "20px",
                        }}
                    />
                    <IconButton
                        sx={{
                            mx: 1,
                            color: "white",
                        }}
                        onClick={handleSubmit}
                    >
                        <IoMdSend />
                    </IconButton>
                </div>
            </Box>
        </Box>
    );
}

export default Chat;
