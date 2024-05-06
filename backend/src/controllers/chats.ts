import User from "@models/User";
import { configureOpenAI } from "config/openai-config";
import { Request, Response, NextFunction } from "express";
import { ChatCompletionMessageParam } from "openai/resources/chat/index";

export const generateChatCompletion = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { message } = req.body;
        const user = await User.findById(res.locals.jwtData.id);

        if (!user) {
            return res
                .status(401)
                .json({
                    message: "User not registered OR Token malfunctioned",
                });
        }
        // grab chats of user
        const chats: ChatCompletionMessageParam[] = user.chats.map(
            ({ role, content }) => ({
                role: role as "user" | "assistant", // Ensure valid roles
                content: content ?? "", // Ensure content is never undefined
            })
        );

        // Push new user message in the correct format
        const userMessage: ChatCompletionMessageParam = {
            role: "user",
            content: message,
        };
        chats.push(userMessage);
        user.chats.push(userMessage);

        // Save user chat history before calling OpenAI
        await user.save();

        // send all chats with new one to OpenAI API
        const openai = configureOpenAI();
        const chatResponse = await openai.chat.completions
            .create({ model: "gpt-3.5-turbo", messages: chats })
            .catch((error) => {
                console.error(error);
                return res
                    .status(500)
                    .json({ message: "Error generating chat completion" });
            });
        // get response from OpenAI API
        if (
            !chatResponse ||
            !chatResponse["choices"] ||
            chatResponse["choices"].length === 0
        ) {
            return res
                .status(500)
                .json({ message: "OpenAI API did not return a response" });
        }

        const botReply = chatResponse["choices"][0].message.content;
        const assistantMessage: ChatCompletionMessageParam = {
            role: "assistant",
            content: botReply,
        };
        user.chats.push(assistantMessage);
        await user.save();

        // Return response to the client
        return res.status(200).json({ chats: user.chats });
    } catch (error) {
        console.error("Error generating chat completion:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const sendChatsToUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //user token check
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res
                .status(401)
                .send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        return res.status(200).json({ message: "OK", chats: user.chats });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

export const deleteChats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //user token check
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res
                .status(401)
                .send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({ message: "OK" });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
