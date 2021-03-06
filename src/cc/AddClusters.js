//
// Add Clusters Panel
//

import React from 'react';
import os from 'os';
import propTypes from 'prop-types';
import styled from '@emotion/styled';
import { remote } from 'electron';
import { Component, Store } from '@k8slens/extensions';
import { Cluster } from './store/Cluster';
import { useAddClusters } from './store/AddClustersProvider';
import { useExtState } from './store/ExtStateProvider';
import { Section as BaseSection } from './Section';
import { layout } from './styles';
import * as strings from '../strings';

const Section = styled(BaseSection)(function ({ offline }) {
  return {
    small: {
      marginTop: -(layout.gap - layout.grid),
    },

    '.lecc-AddClusters--offline-hint': {
      opacity: offline ? 1.0 : 0.5,
    },
  };
});

const SavePath = styled.div(function () {
  return {
    display: 'flex',
    alignItems: 'center',

    'div.Input': {
      flex: 1,
      marginRight: layout.pad,
    },

    '.lecc-AddClusters--folder-icon': {
      flex: 'none',
    },
  };
});

export const AddClusters = function ({ onAdd, clusters }) {
  //
  // STATE
  //

  const {
    state: { savePath, offline, addToNew },
    actions: extActions,
  } = useExtState();

  const {
    state: { loading: addingClusters },
  } = useAddClusters();

  //
  // EVENTS
  //

  const handleBrowseClick = async function () {
    const { dialog, BrowserWindow } = remote;
    const { canceled, filePaths } = await dialog.showOpenDialog(
      BrowserWindow.getFocusedWindow(),
      {
        defaultPath: savePath,
        properties: ['openDirectory', 'createDirectory', 'showHiddenFiles'],
        message: strings.addClusters.location.message(),
        buttonLabel: strings.addClusters.location.action(),
      }
    );

    if (!canceled && filePaths.length > 0) {
      extActions.setSavePath(filePaths[0]);
    }
  };

  const handleSavePathChange = function (value) {
    extActions.setSavePath(value);
  };

  const handleSavePathBlur = function () {
    extActions.setSavePath(savePath.replace('~', os.homedir()));
  };

  const handleAddToNewChange = function (checked) {
    extActions.setAddToNew(checked);
  };

  const handleOfflineChange = function (checked) {
    extActions.setOffline(checked);
  };

  const handleAddClick = function () {
    if (typeof onAdd === 'function') {
      onAdd({ savePath, offline, addToNew });
    }
  };

  //
  // RENDER
  //

  const activeWorkspaceName = Store.workspaceStore.currentWorkspace
    ? Store.workspaceStore.currentWorkspace.name
    : Store.workspaceStore.currentWorkspaceId;

  return (
    <Section className="lecc-AddClusters" offline={offline}>
      <h3>{strings.addClusters.title()}</h3>
      <SavePath>
        <Component.Input
          type="text"
          theme="round-black" // borders on all sides, rounded corners
          value={savePath}
          disabled={addingClusters}
          onChange={handleSavePathChange}
          onBlur={handleSavePathBlur}
        />
        <Component.Icon
          className="lecc-AddClusters--folder-icon"
          material="folder"
          disabled={addingClusters}
          onClick={handleBrowseClick}
          tooltip={strings.addClusters.location.icon()}
        />
      </SavePath>
      <small className="hint">{strings.addClusters.location.tip()}</small>
      <Component.Checkbox
        label={strings.addClusters.addToNew.label()}
        disabled={addingClusters}
        value={addToNew}
        onChange={handleAddToNewChange}
      />
      <small className="lecc-AddClusters--addToNew-hint hint">
        {addToNew
          ? strings.addClusters.addToNew.tipOn()
          : strings.addClusters.addToNew.tipOff(activeWorkspaceName)}
      </small>
      <Component.Checkbox
        label={strings.addClusters.offline.label()}
        disabled={addingClusters}
        value={offline}
        onChange={handleOfflineChange}
      />
      <small className="lecc-AddClusters--offline-hint hint">
        {strings.addClusters.offline.tip()}
      </small>
      <div>
        <Component.Button
          primary
          disabled={clusters.length <= 0 || addingClusters}
          label={strings.addClusters.action.label()}
          waiting={addingClusters}
          tooltip={
            clusters.length <= 0
              ? strings.addClusters.action.disabledTip()
              : undefined
          }
          onClick={handleAddClick}
        />
      </div>
    </Section>
  );
};

AddClusters.propTypes = {
  clusters: propTypes.arrayOf(propTypes.instanceOf(Cluster)),
  onAdd: propTypes.func, // ({ savePath: string, offline: boolean, addToNew: boolean }) => void
};

AddClusters.defaultProps = {
  clusters: [],
};
