import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MultiSelect from 'react-multi-select-component';
import ProgressBar from '../../../../utils/Components/Progressbar';
import Constants from '../../../../Constants';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
    minHeight: '20px',
  },
  chip: {
    margin: `${theme.spacing(1) / 2}px ${theme.spacing(1) / 4}px`,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  },
  divider: {
    height: theme.spacing(2),
  },
  submitRight: {
    marginLeft: '35%',
  },
  dialogueRoot: {
    minHeight: 500,
    // overflow: 'auto',
  },
  selectZindex: {
    overflow: 'visible',
    // zIndex: 99999,
  },
}));

const AddService = (props: any) => {
  const classes = useStyles();

  const [selected, setSelected] = useState([]);

  const [listVals, setListVals] = useState([{ label: '', value: '', id: '' }]);

  const [loader, setLoader] = useState(false);

  const submitAddServiceRequest = () => {
    setLoader(true);

    const appArr = selected.map((service: any) => {
      return service.value;
    });

    const reqData = { groupID: props.groupID, serviceIDs: appArr, updateType: 'add' };

    axios
      .post(`${Constants.TRASA_HOSTNAME}/api/v1/groups/service/update`, reqData)
      .then((r) => {
        setLoader(false);
        if (r.data.status === 'success') {
          window.location.href = `/services/groups/group/${props.groupID}`;
        }
      })
      .catch(function (error) {
        console.log('catched: ', error);
      });
  };

  useEffect(() => {
    const vals = props.ServicesThatCanBeAdded.map((v: any) => {
      return { label: `${v.serviceName} `, value: v.ID };
    });

    setListVals(vals);
  }, [props.ServicesThatCanBeAdded]);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-title"
      classes={{
        paper: classes.dialogueRoot,
      }}
    >
      <DialogTitle disableTypography id="alert-dialog-title">
        Add Services(services) to this group{' '}
      </DialogTitle>
      <DialogContent>
        <div className={classes.selectZindex}>
          <br />
          <MultiSelect
            options={listVals}
            value={selected}
            onChange={setSelected}
            labelledBy="Select users"
          />
        </div>

        <br />
        <br />
        <br />
        <Grid container spacing={2} direction="column" alignItems="center" justify="center">
          <Grid item xs={12}>
            <Button id='addSelectedServicesBtn' variant="contained" color="secondary" onClick={submitAddServiceRequest}>
              Add Selected Services
            </Button>
            <br />
          </Grid>
        </Grid>
        {loader ? <ProgressBar /> : null}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={props.handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddService;
