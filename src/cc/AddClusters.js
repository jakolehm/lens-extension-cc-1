//
// Add Clusters Panel
//

import React, { useState } from 'react';
import os from 'os';
import propTypes from 'prop-types';
import styled from '@emotion/styled';
import { remote } from 'electron';
import { Component } from '@k8slens/extensions';
import { Cluster } from './store/Cluster';
import { useAddClusters } from './store/AddClustersProvider';
import { useExtState } from './store/ExtStateProvider';
import { layout } from './theme';
import * as strings from '../strings';

const Section = styled.section(function ({ offline }) {
  return {
    '--flex-gap': `${layout.gap}px`,

    small: {
      marginTop: -(layout.gap - layout.grid),
    },

    '.lecc-AddClusters--folder-icon': {
      marginLeft: -layout.pad,
    },

    '.lecc-AddClusters--offline-hint': {
      opacity: offline ? 1.0 : 0.5,
    },
  };
});

export const AddClusters = function ({ onAdd, clusters }) {
  //
  // STATE
  //

  const [offline, setOffline] = useState(false);

  const {
    state: { savePath },
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

  // DEBUG TODO: when switch to Component.Input, callback signature change to (value: any, event: ChangeEvent) => void
  const handleSavePathChange = function (event) {
    extActions.setSavePath(event.target.value);
  };

  const handleSavePathBlur = function () {
    extActions.setSavePath(savePath.replace('~', os.homedir()));
  };

  const handleOfflineChange = function (checked) {
    setOffline(checked);
  };

  const handleAddClick = function () {
    if (typeof onAdd === 'function') {
      onAdd({ savePath, offline });
    }
  };

  //
  // RENDER
  //

  console.log(
    '[AddClusters] rendering: addingClusters=%s, clusters.length=%s',
    addingClusters,
    clusters.length
  ); // DEBUG

  return (
    <Section className="lecc-AddClusters flex column gaps" offline={offline}>
      <h3>{strings.addClusters.title()}</h3>
      <div className="flex gaps align-center">
        <input // DEBUG TODO: Component.Input causes crash, doesn't seem to be provided
          className="box grow"
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
      </div>
      <small className="hint">{strings.addClusters.location.tip()}</small>
      <Component.Checkbox
        label={strings.addClusters.offline.label()}
        disabled={addingClusters}
        checked={offline}
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
  onAdd: propTypes.func, // ({ savePath: string, offline: boolean }) => void
};