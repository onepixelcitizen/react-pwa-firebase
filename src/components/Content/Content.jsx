import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import SubmitItemForm from '../SubmitItemForm';
import DisplayDatabaseRecords from '../DisplayDatabaseRecords';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class ContentLayout extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div style={{ padding: 30 }} className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12} md={7} lg={6}>
            <Paper className={classes.paper}>
              <DisplayDatabaseRecords />
            </Paper>
          </Grid>

          <Grid item xs={12} md={5} lg={6}>
            <Paper className={classes.paper}>
              <SubmitItemForm />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(ContentLayout);
