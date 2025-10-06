import { CONTENTID } from './data_table.js';
import { OODAlert, OODAlertSuccess } from '../alert';

export function initSendToApp() {
  const configElement = document.getElementById('files_page_load_config');
  if (!configElement) {
    return;
  }

  const dataset = configElement.dataset;
  if (dataset.filesActionEnabled !== 'true') {
    return;
  }

  const button = document.getElementById('send-files-btn');
  if (!button) {
    return;
  }

  const sendConfig = {
    endpoint: dataset.filesActionEndpoint,
    label: dataset.filesActionLabel,
    actionId: dataset.filesActionId || null
  };

  if (!sendConfig.endpoint) {
    return;
  }

  button.addEventListener('click', () => handleSend(button, sendConfig));
}

function handleSend(button, config) {
  const table = $(CONTENTID).DataTable();
  const selection = table.rows({ selected: true }).data().toArray();

  if (selection.length === 0) {
    OODAlert('Select at least one file or directory to send.');
    return;
  }

  button.setAttribute('disabled', 'disabled');

  const payload = buildPayload(selection, config);

  fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify(payload)
  })
    .then(async (response) => {
      const text = await response.text();
      let parsed = null;

      if (text) {
        try {
          parsed = JSON.parse(text);
        } catch (_e) {
          parsed = { message: text };
        }
      }

      if (!response.ok) {
        const message = (parsed && (parsed.error || parsed.message)) || response.statusText || 'Request failed.';
        throw new Error(message);
      }

      const successMessage = (parsed && parsed.message) || `Sent ${selection.length} item(s) to ${config.label}.`;
      OODAlertSuccess(successMessage);
    })
    .catch((error) => {
      OODAlert(`Error sending selection to ${config.label}: ${error.message}`);
    })
    .finally(() => {
      button.removeAttribute('disabled');
    });
}

function buildPayload(selection, config) {
  const baseDirectory = history.state.currentDirectory;
  const directoryUrl = history.state.currentDirectoryUrl;
  const filesystem = history.state.currentFilesystem;

  const files = selection.map((row) => {
    const name = row.name;
    const filePath = joinPath(baseDirectory, name);

    return {
      file_path: filePath,
      id: row.id,
      name: name,
      type: row.type,
      directory: row.type === 'd',
      size: row.size,
      human_size: row.human_size,
      modified_at: row.modified_at,
      owner: row.owner,
      mode: row.mode,
      url: row.url,
      download_url: row.download_url,
      edit_url: row.edit_url
    };
  });

  return {
    action_id: config.actionId,
    filesystem: filesystem,
    directory: baseDirectory,
    directory_url: directoryUrl,
    files: files
  };
}

function joinPath(base, name) {
  if (!base || base === '/') {
    return `/${name}`;
  }

  const sanitizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${sanitizedBase}/${name}`;
}
