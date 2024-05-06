import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useAuth } from "../../context/AuthContext";


function doesCodeBlockExists(message: string) {
    if(message.includes("```")) {
        return true;
    } 
    return false;
}

const ChatItem = ({content, role}: {content: string, role: "user" | "assistant"}) => {
    
    const auth = useAuth();
    const codeBlockExists = doesCodeBlockExists(content);
    const messageBlocks = content.split("```");
    return role == "assistant" ? (
        <Box
            sx={{
                display: "flex",
                p: 2,
                bgcolor: "#004d5612",
                gap: 2,
                borderRadius: 2,
                my: 1,
            }}
        >
            <Avatar sx={{ ml: "0" }}>
                <img
                    src="openai.png"
                    alt="openai"
                    width={"30px"}
                    className="image-inverted"
                />
            </Avatar>
            <Box>
                {codeBlockExists ? messageBlocks.map((block, index) => {
                    if(index % 2 == 0) {
                        return (
                            <Typography
                                sx={{
                                    fontSize: "20px",
                                }}
                            >
                                {block}
                            </Typography>
                        );
                    } else {
                        return (
                            <SyntaxHighlighter
                                language="javascript"
                                style={coldarkDark}
                                wrapLongLines={true}
                            >
                                {block}
                            </SyntaxHighlighter>
                        );
                    }
                }) : (
                    <Typography
                        sx={{
                            fontSize: "20px",
                        }}
                    >
                        {content}
                    </Typography>
                )}
            </Box>
        </Box>
    ) : (
        <Box
            sx={{
                display: "flex",
                p: 2,
                bgcolor: "#004d56",
                gap: 2,
                borderRadius: 2,
            }}
        >
            <Avatar sx={{ m1: "0", bgcolor: "black", color: "white" }}>
                {auth?.user?.name[0]}
                {auth?.user?.name.split(" ")[1][0]}
            </Avatar>
            <Box>
                {codeBlockExists ? messageBlocks.map((block, index) => {
                    if(index % 2 == 0) {
                        return (
                            <Typography
                                sx={{
                                    fontSize: "20px",
                                }}
                            >
                                {block}
                            </Typography>
                        );
                    } else {
                        return (
                            <SyntaxHighlighter
                                language="javascript"
                                style={coldarkDark}
                                wrapLongLines={true}
                            >
                                {block}
                            </SyntaxHighlighter>
                        );
                    }
                }) : (
                    <Typography
                        sx={{
                            fontSize: "20px",
                        }}
                    >
                        {content}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

export default ChatItem;