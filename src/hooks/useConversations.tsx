import { LocalStorage, showToast, Toast } from "@raycast/api";
import { useCallback, useEffect, useState } from "react";
import { Conversation, ConversationsHook } from "../type";

export function useConversations(): ConversationsHook {
  const [data, setData] = useState<Conversation[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const storedConversations = await LocalStorage.getItem<string>("conversations");

      if (!storedConversations) {
        setData([]);
      } else {
        setData((previous) => [...previous, ...JSON.parse(storedConversations)]);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    LocalStorage.setItem("conversations", JSON.stringify(data.filter((x) => x.chats.length > 0)));
  }, [data]);

  const add = useCallback(
    async (conversation: Conversation) => {
      setData([...data, conversation]);
    },
    [setData, data]
  );

  const remove = useCallback(
    async (conversation: Conversation) => {
      const toast = await showToast({
        title: "Removing conversation...",
        style: Toast.Style.Animated,
      });
      const newConversations: Conversation[] = data.filter((item) => item.id !== conversation.id);
      setData(newConversations);
      toast.title = "Conversation removed!";
      toast.style = Toast.Style.Success;
    },
    [setData, data]
  );

  const clear = useCallback(async () => {
    const toast = await showToast({
      title: "Clearing conversations ...",
      style: Toast.Style.Animated,
    });
    setData([]);
    toast.title = "Conversations cleared!";
    toast.style = Toast.Style.Success;
  }, [setData]);

  return { data, setData, isLoading, add, remove, clear };
}
