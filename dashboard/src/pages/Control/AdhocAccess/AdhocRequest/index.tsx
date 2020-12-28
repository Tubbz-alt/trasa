import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import 'date-fns';
import MUIDataTable, { MUIDataTableColumn, MUIDataTableMeta, MUIDataTableOptions } from 'mui-datatables';
import React, { useEffect, useState } from 'react';
import Constants from '../../../../Constants';
import GrantOrDenyAccess from './GrantOrDenyAccess';


const lightColor = 'rgba(255, 255, 255, 0.7)'; //'rgba(255, 255, 255, 0.7)'; // '#030417';

const useStyles = makeStyles((theme) => ({
  mainContent: {
    flex: 1,
    padding: '48px 36px 0',
    background: '#eaeff1' //'#eaeff1',UpdateAdhocRequest
  },
  paper: {
    maxWidth: 1500,
    margin: 'auto',
    marginTop: 50,
    overflow: 'hidden',
    padding: theme.spacing(2)
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
  },
  searchInput: {
    fontSize: theme.typography.fontSize
  },
  block: {
    display: 'block'
  },
  addUser: {
    marginRight: theme.spacing(1)
  },
  contentWrapper: {
    margin: '40px 16px'
  },
  secondaryBar: {
    zIndex: 0
  },
  button: {
    borderColor: lightColor,
    color: 'blue'
  },
  svg: {
    width: 100,
    height: 100
  },
  polygon: {
    fill: theme.palette.common.white,
    stroke: theme.palette.divider,
    strokeWidth: 1
  },
  successText: {
    fontSize: 15,
    color: 'green'
  },
  errorText: {
    fontSize: 15,
    color: 'red'
  },

  headings: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: '15px',
    fontFamily: 'Open Sans, Rajdhani'
  },
  subHeadings: {
    color: 'black',
    fontSize: '10px',
    fontFamily: 'Open Sans, Rajdhani'
  }
}));



export default function AccessRequests() {
  const [users, setUsers] = useState<Array<string[]>>([]);
  const [reqDlgOpen, setReqDlgOpen] = useState(false);
  const [reqID, setReqID] = useState('');
  const [reqText, setReqtext] = useState('');
  const [haveData, setHaveData] = useState(false);
  const [serviceID, setserviceID] = useState('');

  useEffect(() => {
    axios
      .get(Constants.TRASA_HOSTNAME + '/api/v1/iam/adhoc/requests/my')
      .then((response) => {
        let data = response.data.data[0];
        if (data != null) {
          let dataArr = [];
          dataArr = data.map(function (n: any) {
            let date = new Date(n.reqTime * 1000);
            return [
              n.reqID,
              n.requesterEmail,
              n.serviceName,
              date.toDateString(),
              n.reqID + ':-:' + n.requestTxt
            ];
          });
          setUsers(dataArr);
          setHaveData(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const deleteElement = (reqID: string) => {
    let u = users;

    for (let i = 0; i <= u.length; i++) {
      if (u[i].includes(reqID)) {
        u.splice(i, 1);
        setUsers(u);
      }
    }
  };

  const handleRequestDialogueOpen = (reqID:string, tableMeta: any) => {
    let reqData = reqID.split(':-:');
    setReqDlgOpen(true);
    setReqID(reqData[0]);
    setReqtext(reqData[1]);
    //setserviceID(tableMeta.rowData[2]);
  };

  const handleRequestDialogueClose = () => {
    setReqDlgOpen(false);
  };

  const classes = useStyles();

  const columns = [
    {
      name: 'requestID',
      options: {
        filter: true,
        display: false,
        customBodyRender: (value:any) => {
          return value;
        }
      }
    },
    {
      name: 'Requested By',
      options: {
        filter: true,
        customBodyRender: (value:any) => {
          return value;
        }
      }
    },
    {
      name: 'Service Name',
      options: {
        filter: true,
        customBodyRender: (value: any) => {
          return value;
        }
      }
    },
    {
      name: 'Requested On',
      options: {
        filter: true,
        customBodyRender: (value: any) => {
          return value;
        }
      }
    },
    {
      name: 'View Detail',
      options: {
        filter: false,
        customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue:(value: string) => void) => {
          return (
            <Button
              onClick={() => handleRequestDialogueOpen(value, tableMeta)}
              variant="outlined"
              color="secondary"
            >
              View
            </Button>
          );
        }
      }
    }
  ];

  return (
    <div className={classes.contentWrapper}>
      {haveData ? (
        <MUIDataTable
          title={'Active requests'}
          data={users}
          columns={columns as MUIDataTableColumn[]}
          options={options as MUIDataTableOptions}
        />
      ) : (
        <Paper className={classes.paper} elevation={5}>
          <p>looks like you dont have any active adhoc requests to approve!</p>
        </Paper>
      )}
      <GrantOrDenyAccess
        reqID={reqID}
        reqText={reqText}
        adhocReqDlgState={reqDlgOpen}
        handleRequestDialogueClose={handleRequestDialogueClose}
        deleteElement={deleteElement}
        //serviceID={serviceID}
      />
    </div>
  );
}

const options = {
  filter: true,
  responsive: 'scrollMaxHeight',
  selectableRows: 'none',
  count: 5
};