import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

import db from '../api/Firebase';

const styles = theme => ({
  button: {
    float: 'right'
  },
  text: {
    'text-align': 'right'
  }
});

class DisplayDatabaseRecords extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      loading: false
    };

    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    /**
     * Create reference to items in Firebase Database
     */

    const itemsRef = db.ref('items');

    this.setState({ loading: true }, () => {
      itemsRef.on('value', snapshot => {
        const dbItems = [];

        snapshot.forEach(snap => {
          const item = {
            id: snap.key,
            name: snap.val().name
          };

          dbItems.push(item);
        });

        this.setState({ items: dbItems, loading: false });
      });
    });
  }

  handleDelete(id) {
    db.ref('items')
      .child(id)
      .remove(error => {
        if (error) {
          console.log(error);
        }
      });
  }

  render() {
    const { classes } = this.props;

    const { items, loading } = this.state;

    return (
      <div>
        {loading ? (
          <CircularProgress className={classes.progress} />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell className={classes.text}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map(item => (
                <TableRow key={item.id}>
                  <TableCell component="th" scope="row">
                    {item.name}
                  </TableCell>

                  <TableCell component="th" scope="row">
                    <Button
                      onClick={this.handleDelete.bind(this, item.id)}
                      className={classes.button}
                      variant="contained"
                      color="secondary"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(DisplayDatabaseRecords);
