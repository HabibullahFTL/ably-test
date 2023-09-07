import Ably from "ably/promises";

export default async function handler(req, res) {
    const userId = req?.cookies?.['test-user-id']
    const client = new Ably.Realtime(process.env.ABLY_API_KEY);
    const tokenRequestData = await client.auth.createTokenRequest({
        clientId: userId || "userId"
    });
    res.status(200).json(tokenRequestData);
};