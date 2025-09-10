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
    z.console.log('Auth failed with status:', response.status);
    z.console.log('Response body:', JSON.stringify(response.json, null, 2));
    throw new Error('Authentication failed. Please check your API token.');
  }

  const data = response.json.data;
  const user = data.user || {};
  const authResult = {
    id: user.id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role_id: user.role_id,
    balance: data.balance,
    country_id: user.country_id,
  };
  return authResult;
};

module.exports = {
  type: 'custom',
  fields: [
    {
      key: 'api_token',
      required: true,
      label: 'API Token',
      type: 'string',
      helpText: 'Your Aigreentick API token from the dashboard. Get it from your account settings.',
    },
  ],
  test: testAuth,
  connectionLabel: '{{name}} - {{email}} (Balance: {{balance}}, Country: {{country_id}})',
};
