import type { NextApiRequest, NextApiResponse } from 'next';
import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER, // e.g. us1
});

type Data = {
  email: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_LIST_ID as string,
      {
        email_address: email,
        // @ts-ignore
        status: 'subscribed',
      },
    );

    return res.status(201).json({ error: '' });
  } catch (error) {
    // @ts-ignore
    return res.status(500).json({ error: error.message || error.toString() });
  }
}
