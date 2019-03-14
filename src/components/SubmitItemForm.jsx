import React, { Component } from 'react';
import PropTypes from 'prop-types';
import db from '../api/Firebase';
import idb from 'idb';

import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import { withStyles } from '@material-ui/core/styles';

if (!('indexedDB' in window)) {
  alert(
    "This browser doesn't support IndexedDB - and this Application won't work Offline!"
  );
}

var dbPromise = idb.open('test-db', 1, function(upgradeDb) {
  console.log('making a new object store'); /* eslint-disable-line no-console */
  if (!upgradeDb.objectStoreNames.contains('Entries')) {
    upgradeDb.createObjectStore('Entries', { autoIncrement: true });
  }
});

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const styles1 = theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
});

function MySnackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  );
}

MySnackbarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

const styles = theme => ({
  onlineStatus: {
    color: '#afafaf',
    textTransform: 'capitalize',
    position: 'fixed',
    bottom: '30px',
    right: '30px'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  }
});

class SubmitItemForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      open: false,
      vertical: 'top',
      horizontal: 'right',
      onLineStatus: true,
      onLineStatusNotification: false,
      handleCloseOnline: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  componentWillMount() {
    const self = this;

    window.addEventListener('load', function() {
      self.setState({ onLineStatus: navigator.onLine ? true : false });
      self.setState({
        onLineStatusNotification: navigator.onLine ? false : true
      });

      function updateOnlineStatus(event) {
        self.setState({ onLineStatus: navigator.onLine ? true : false });
        self.setState({
          onLineStatusNotification: navigator.onLine ? false : true
        });

        if (navigator.onLine) {
          self.setState({ handleCloseOnline: true });
        }

        /**
         * Check if anything exists in IndexedDb
         * if yes then push values to Firebase
         */

        dbPromise
          .then(db => {
            return db
              .transaction('Entries')
              .objectStore('Entries')
              .getAll();
          })
          .then(allObjs => {
            allObjs.forEach(item => {
              console.log(item.name);

              db.ref('items').push({ name: item.name });
            });
          })
          .then(() => {
            dbPromise.then(db => {
              const tx = db.transaction('Entries', 'readwrite');
              tx.objectStore('Entries').clear();
              return tx.complete;
            });
          });
      }

      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    console.log(this.state.value.trim().length);

    if (this.state.value.trim() === '' || this.state.value.trim().length < 3) {
      /**
       * Show Error
       */
      this.setState({ open: true });
    } else {
      /**
       * Detect if Online or Offline
       */

      console.log(this.state.onLineStatus);

      if (this.state.onLineStatus) {
        // if (false) {

        db.ref('items').push({ name: this.state.value });
      } else {
        var item_value = this.state.value;

        dbPromise
          .then(function(db) {
            var tx = db.transaction('Entries', 'readwrite');
            var store = tx.objectStore('Entries');
            var item = {
              name: item_value
            };
            store.add(item);
            console.log('added item to the store os!');
            return tx.complete;
          })
          .catch(function(error) {
            // console.log(error);
          });
      }

      this.setState({ value: '', open: false });
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  /**
   * TODO! doesn't work...
   */

  handleCloseOffline = () => {
    console.log(this.state.onLineStatusNotification);

    this.setState({ onLineStatusNotification: false });
  };

  handleCloseOnline = () => {
    this.setState({ handleCloseOnline: false });
  };

  render() {
    const { classes } = this.props;

    const {
      vertical,
      horizontal,
      open,
      onLineStatus,
      onLineStatusNotification,
      handleCloseOnline
    } = this.state;

    return (
      <div>
        {onLineStatus ? (
          <span className={classes.onlineStatus}>Online</span>
        ) : (
          <span className={classes.onlineStatus}>Offline</span>
        )}

        <span className={classes.onlineStatus}>{onLineStatus}</span>

        <form onSubmit={this.handleSubmit}>
          <TextField
            id="with-placeholder"
            label="Add New Value"
            placeholder=""
            margin="normal"
            className={classes.textField}
            value={this.state.value}
            onChange={this.handleChange}
          />

          <Button
            onClick={this.handleSubmit}
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        </form>

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={this.handleClose}
        >
          <MySnackbarContentWrapper
            onClose={this.handleClose}
            variant="error"
            message="Value can't be empty and/or should be more that 3 characters!"
          />
        </Snackbar>

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={onLineStatusNotification}
          onClose={this.handleCloseOffline}
        >
          <MySnackbarContentWrapper
            onClose={this.handleCloseOffline}
            variant="warning"
            message="You are Offline!"
          />
        </Snackbar>

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={handleCloseOnline}
          autoHideDuration={6000}
          onClose={this.handleCloseOnline}
        >
          <MySnackbarContentWrapper
            onClose={this.handleCloseOnline}
            variant="success"
            message="You are back Online!"
          />
        </Snackbar>
      </div>
    );
  }
}

export default withStyles(styles)(SubmitItemForm);
