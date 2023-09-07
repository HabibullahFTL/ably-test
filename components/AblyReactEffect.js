import Ably from "ably/promises";
import { useEffect } from 'react';

const ably = new Ably.Realtime.Promise({ authUrl: '/api/createTokenRequest?clientId=abc' });

export async function getChannelHistory(channelName, callbackOnMessage) {
    const channel = ably.channels.get(channelName);
    const historyPage = await channel.history();
    const messages = (historyPage.items || []).sort((a, b) => a.timestamp - b.timestamp);
    callbackOnMessage(messages);
}


export function useChannel(channelName, callbackOnMessage) {
    const channel = ably.channels.get(channelName);


    const onMount = () => {
        channel.subscribe(msg => { callbackOnMessage(msg); });
    }

    const onUnmount = () => {
        channel.unsubscribe();
    }

    const useEffectHook = () => {
        onMount();
        return () => { onUnmount(); };
    };

    useEffect(useEffectHook);

    return [channel, ably];
}