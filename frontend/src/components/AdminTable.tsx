import React, { useEffect, useState } from 'react';
import globalStore from '../store/global';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { withStyles, makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { getTable } from '../core/admin'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {
    tabIndex: number
}

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

// FC (function component)
const AdminTable: React.FC<CustomPropsLol> = ({history, tabIndex}: CustomPropsLol) => {
    const globalState = globalStore();
    const classes = useStyles();

    const [tableHeader, setTableHeader] = useState([]);
    const [tableData, setTableData] = useState([]);

    async function getTableData() {
        const data = await getTable(globalState.adminTabIndex);
        var tmp = data.data;
        if (tmp.length > 0) {
            var tableHeaderTmp : any = [];

            tableHeaderTmp = Object.keys(tmp[0]);

            setTableHeader(tableHeaderTmp);
            setTableData(tmp);
        }
        else {
            setTableHeader([]);
            setTableData([]);
        }
    }
    useEffect(() => {
        async function scopedPull() {
            await getTableData();
        }
        scopedPull();
    }, [globalState.adminTabIndex])


    function getAdminTableContent(tableHeader : any) {
        if (tableHeader.length > 0) {
            return (
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                            {
                                tableHeader.map((item : any, index : any) => {
                                    return (<StyledTableCell key={index}>{item}</StyledTableCell>)
                                })
                            }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {
                            tableData.map((row : any) => {
                            return (
                                <TableRow>
                                {
                                    tableHeader.map((item : any) => {
                                        if(row[item] === true){
                                            return (<StyledTableCell> true </StyledTableCell>)
                                        }
                                        else if(row[item] === false){
                                            return (<StyledTableCell> false </StyledTableCell>)
                                        }
                                        else if(row[item] == null){
                                            return (<StyledTableCell> null </StyledTableCell>)
                                        }
                                        else{
                                            return (<StyledTableCell> {row[item]} </StyledTableCell>)
                                        }
                                    })
                                }
                                </TableRow>)
                            })
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
            )
        }
        else {
            return (
                <div> DB table empty </div>
            )
        }
    }
    return (
        <div className={classes.root}>
            {getAdminTableContent(tableHeader)}
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            flexDirection: 'column'
        },

        input: {
            position: 'fixed',
            bottom: 0,
            textAlign: 'center',
            flexGrow: 1,
            paddingLeft: 10,
            paddingBottom: 35
        },

        table: {
          minWidth: 650,
        },
    }),
);

export default withRouter(AdminTable) // withRouter enables us to use the router even though this component is not a "Route"
