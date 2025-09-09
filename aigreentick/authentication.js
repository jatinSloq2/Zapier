const testAuth = async (z, bundle) => {
  // Test the authentication by making a request to dashboard
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

  return response.data;
};

module.exports = {
  type: 'custom',
  fields: [
    {
      computed: false,
      key: 'api_token',
      required: true,
      label: 'API Token',
      type: 'string',
      helpText: 'Your aiGreenTick API token from the dashboard. Get it from https://aigreentick.com/dashboard/api',
    },
  ],
  test: testAuth,
  // Updated connection label to match the actual response structure
  connectionLabel: '{{user.name}} - {{user.email}}',
};
