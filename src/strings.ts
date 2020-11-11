//
// User-facing strings, to (at least) keep them all in one place in case we
//  might want to localize this extension in the future.
//
// NOTE: Every property should be a function that returns a string. The function
//  can optionally accept tokens as arguments to use in the generated string.
//

export type Prop = (...tokens: string[]) => string;

export interface Dict {
  [index: string]: Dict | Prop;
}

// strings for main, renderer, and page modules
export const extension: Dict = {
  menu: {
    label: () => 'Add Cloud Clusters',
  },
  statusBar: {
    label: () => 'Add Cloud Clusters',
  },
};

export const view: Dict = {
  main: {
    title: () => 'Add Mirantis Container Cloud Clusters',
  },
  help: {
    html: () =>
      `
<h2>Adding Clusters</h2>
<p>
  This extension make it easy to add some or all clusters from a Mirantis Container
  Cloud instance.
</p>
<p>
  When clusters are added, <code>kubeconfig</code> files are automatically generated
  for each cluster, and stored in the configured directory. Do not remove the generated
  files (unless you remove the pertaining cluster from Lens) because Lens references
  them whenever a related cluster is activated.
</p>
`,
  },
};

export const login: Dict = {
  title: () => '1. Sign in to MCC',
  url: { label: () => 'MCC URL:' },
  username: { label: () => 'Username:' },
  password: { label: () => 'Password:' },
  action: {
    label: () => 'Get clusters',
  },
};

export const clusterList: Dict = {
  title: () => '2. Select clusters',
  action: {
    selectAll: {
      label: () => 'Select all',
    },
    selectNone: {
      label: () => 'Select none',
    },
  },
};

export const addClusters: Dict = {
  title: () => '3. Add to Lens',
  location: {
    label: () => 'Location',
    tip: () =>
      'Directory where generated kubeconfig files will be stored and read by Lens',
    icon: () => 'Browse',
    message: () => 'Choose kubeconfig file location',
    action: () => 'Use location',
  },
  offline: {
    label: () => 'Offline use',
    tip: () =>
      'WARNING: Generating tokens for offline use is less secure because they will never expire',
  },
  action: {
    label: () => 'Add selected clusters',
    disabledTip: () => 'Select at least one cluster to add',
  },
};

export const clustersProvider: Dict = {
  errors: {
    invalidNamespacePayload: () =>
      'Failed to parse namespace payload: Unexpected data format.',
    invalidNamespace: () =>
      'Encountered at least one namespace with unexpected or missing metadata.',
    invalidClusterPayload: () =>
      'Failed to parse cluster payload: Unexpected data format.',
    invalidCluster: () =>
      'Encountered at least one cluster with unexpected or missing metadata.',
  },
};

export const addClustersProvider: Dict = {
  errors: {
    kubeconfigCreate: (clusterId = 'unknown') =>
      `Failed to create kubeconfig file for cluster ${clusterId}`,
  },
};

export const authUtil: Dict = {
  errors: {
    sessionExpired: () => 'Session expired',
    invalidCredentials: () => 'Invalid credentials',
  },
};

export const netUtil: Dict = {
  errors: {
    requestFailed: (url = 'unknown') => `Network request to ${url} failed`,
    invalidResponseData: (url = 'unknown') =>
      `Extracting response data for ${url} failed: Invalid response format.`,
    reason: (message = '') => `Reason: "${message}"`,
    serverResponse: (statusText = '') => `Server response: "${statusText}".`,
    responseCode: (status = '-1') => `Server response code: ${status}`,
  },
};

export const apiClient: Dict = {
  errors: {
    failedToGetToken: () => 'Failed to get token',
    failedToRefreshToken: () => 'Failed to refresh token',
    failedToLogout: () => 'Failed to log out',
    failedUserPerms: (entity = 'unknown') =>
      `Failed to get user permissions for "${entity}"`,
    failedProjectPerms: () => 'Failed to get user permissions for projects',
    failedToGet: (entity = 'unknown') => `Failed to get ${entity}`,
    failedToGetList: (entity = 'unknown') => `Failed to get ${entity} list`,
    failedToCreate: (entity = 'unknown') => `Failed to create ${entity}`,
    failedToUpdate: (entity = 'unknown') => `Failed to update ${entity}`,
    failedToDelete: (entity = 'unknown') => `Failed to delete ${entity}`,
  },
};
