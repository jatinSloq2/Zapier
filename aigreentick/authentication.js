const testAuth = async (z, bundle) => {
  const response = await z.request({
    method: 'GET',
    url: 'https://aigreentick.com/api/v1/dashboard',
    headers: {
      Authorization: `Bearer ${bundle.authData.api_token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== 200) {
    throw new Error('Authentication failed. Please check your API token.');
  }

  const data = response.json.data;

  return {
    balance: data.balance,
    ...data.user,
  };
};

module.exports = {
  type: 'custom',
  fields: [
    {
      key: 'api_token', required: true, label: 'API Token', type: 'string',
      helpText: 'Your Aigreentick API token from the dashboard. Get it from your account settings.',
    },
  ],
  test: testAuth,
  connectionLabel: '{{name}} - {{email}} (Balance: {{balance}})',
};
