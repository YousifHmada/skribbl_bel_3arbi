import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { CanvasBoard } from './CanvasBoard';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '1200px',
    height: '550px',
  },
  paper: {
    // padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));
function GamePage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}><div style={{ height: '50px' }}></div></Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}><div style={{ height: '500px' }}></div></Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper} style={{ backgroundColor: 'transparent' }}>
            <CanvasBoard />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}><div style={{ height: '500px' }}></div></Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default GamePage
