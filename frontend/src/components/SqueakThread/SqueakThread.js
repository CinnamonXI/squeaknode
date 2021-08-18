import React, { useState } from "react";
import {
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Grid,
  Box,
  Link,
} from "@material-ui/core";
import { MoreVert as MoreIcon } from "@material-ui/icons";
import {useHistory} from "react-router-dom";
import classnames from "classnames";

import LockIcon from '@material-ui/icons/Lock';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

// styles
import useStyles from "./styles";

import SqueakThreadItem from "../../components/SqueakThreadItem";
import SqueakUserAvatar from "../../components/SqueakUserAvatar";
import Widget from "../../components/Widget";

import moment from 'moment';

import {
  getTimelineSqueakDisplaysRequest,
  getNetworkRequest,
  getSqueakDisplayRequest,
} from "../../squeakclient/requests"


export default function SqueakThread({
  squeaks,
  network,
  setSqueaksFn,
  ...props
}) {
  var classes = useStyles();

  const history = useHistory();

  function reloadSqueakItem(itemHash) {
    // Get the new squeak.
    getSqueakDisplayRequest(itemHash, (newSqueak) => {
      const newSqueaks = squeaks.map((item) => {
        // TODO: .hash or .getHash() ?
        if (item.getSqueakHash() === itemHash) {
          return newSqueak;
        }
        return item;
      });
      setSqueaksFn(newSqueaks);
    })
  }

  const handleReloadSqueakItem = (itemHash) => {
    const innerFunc = () => {
      reloadSqueakItem(itemHash);
    }
    return innerFunc;
  }

  const unknownAncestorHash = () => {
      if (!squeaks) {
        return null;
      }
      var oldestKnownAncestor = squeaks[0];
      if (!oldestKnownAncestor) {
        return null;
      }
      return oldestKnownAncestor.getReplyTo();
  };

  function UnkownReplyToContent() {
    var squeakHash = unknownAncestorHash();
    if (!squeakHash) {
      return (
        <></>
      )
    }
    return (
      <TimelineItem>
<TimelineOppositeContent
  className={classes.oppositeContent}
  color="textSecondary"
></TimelineOppositeContent>
<TimelineSeparator>
  <SqueakUserAvatar
    squeak={null}
  />
  <TimelineConnector />
</TimelineSeparator>
<TimelineContent>
<SqueakThreadItem
  hash={squeakHash}
  key={squeakHash}
  squeak={null}>
</SqueakThreadItem>
</TimelineContent>
</TimelineItem>
    )
  }

  return (
    <>
      {UnkownReplyToContent()}
      {squeaks
        .slice(0, -1)
        //.reverse()
        .map(squeak =>
          <TimelineItem
          key={squeak.getSqueakHash()}
          >
          <TimelineOppositeContent
            className={classes.oppositeContent}
            color="textSecondary"
          ></TimelineOppositeContent>
          <TimelineSeparator>
            <SqueakUserAvatar
              squeakProfile={squeak.getAuthor()}
            />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
          <Box
            key={squeak.getSqueakHash()}
            >
          <SqueakThreadItem
            hash={squeak.getSqueakHash()}
            key={squeak.getSqueakHash()}
            squeak={squeak}
            network={network}
            reloadSqueak={handleReloadSqueakItem(squeak.getSqueakHash())}
            showActionBar={true}>
          </SqueakThreadItem>
          </Box>
          </TimelineContent>
          </TimelineItem>
      )}
    </>
  )
}