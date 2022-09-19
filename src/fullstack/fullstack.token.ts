import axios from 'axios';
import config from 'src/config/configuration';

// Type
type tokenData = {
  apiToken: string;
  apiTokenExp: string;
};

//
const padding = true;
const apiToken = '';

//
async function login() {
  // Get email and password form config
  const {
    fullstack: { email, password },
  } = config;

  //
  if (!(email && password)) {
    throw new Error('Add email and password for fullstack ');
  }

  type user_data = {
    token: string;
    user: { apiToken?: string; apiTokenExp?: string; credit: number };
  };
  const { data: userData } = await axios.post<user_data>(
    'https://auth.fullstack.cash/auth/',
    {
      email,
      password,
    },
  );

  return userData;
}

async function getNewApiToken(loginJwt: string): Promise<tokenData> {
  //
  const { data } = await axios.post<tokenData>(
    'https://auth.fullstack.cash/apitoken/new',
    {
      apiLevel: 50,
      pointsToConsume: 100,
    },
    {
      headers: {
        Authorization: `Bearer ${loginJwt}`,
      },
    },
  );

  //
  return data;
}

async function refreshApiToken() {
  // eslint-disable-next-line prefer-const
  let { user: profile, token: loginJwt } = await login();

  // Check is api token not expired
  if (
    !(
      profile.apiToken &&
      profile.apiTokenExp &&
      new Date() < new Date(profile.apiTokenExp)
    )
  ) {
    if (profile.credit <= 9.99) {
      throw new Error('Add more credit in your account');
    }
    // If api token expire get new api token
    const newApiToken = await getNewApiToken(loginJwt);

    // Update token with new api token
    profile.apiToken = newApiToken.apiToken;

    // Change api exp time
    profile.apiTokenExp = newApiToken.apiTokenExp;
  }

  // Update api token
  refreshFunctions.forEach((fn) => fn(apiToken));

  // set timer to refresh api token
  const remainingTokenExpiry = +new Date(profile.apiTokenExp) - +new Date();
  // https://stackoverflow.com/questions/60474110/why-is-my-console-logging-timeoutoverflowwarning-4294967296000-does-not-fit-i
  const maxSetTimeOutValue = 2147483647;

  setTimeout(
    async () => refreshApiToken(),
    Math.min(remainingTokenExpiry, maxSetTimeOutValue),
  );
}

// refresh
type refresh_fn_type = (token: string) => void;
const refreshFunctions: refresh_fn_type[] = [];
export function onRefresh(callback: refresh_fn_type) {
  // Add function to lisener
  refreshFunctions.push(callback);

  // Do it for first time if we have token
  if (!padding) {
    callback(apiToken);
  }
}

// Get api token for first time
refreshApiToken().catch(console.log);
