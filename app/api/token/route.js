import { StreamClient } from '@stream-io/node-sdk';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.NEXT_PUBLIC_STREAM_API_SECRET;

export async function POST(request) {
  try {
    const { userId } = await request.json();
    if (!apiKey || !apiSecret) {
      return Response.json(
        {
          error: 'Missing API Credentials',
        },
        { status: 500 },
      );
    }

    const serverClient = new StreamClient(apiKey, apiSecret);

    const newUser = {
      id: userId,
      role: 'admin',
      name: userId,
    };

    await serverClient.upsertUsers([newUser]);

    const now = Date.now();
    const validity = now + 24 * 60 * 60 * 1000; // 1 day
    const token = serverClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: validity,
      //   role: 'admin',
    });

    return Response.json({ token });
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to generate token',
      },
      { status: 500 },
    );
  }
}
