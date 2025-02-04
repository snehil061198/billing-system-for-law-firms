import {useTable, useSortBy, useFilters, useGlobalFilter, useExpanded} from "react-table";
import {requestServices} from "../Redux/Action";
import {useDispatch} from "react-redux";
import {useMemo} from "react";
import {DefaultColumnFilter} from "./DefaultColumnFilter";
import {GlobalFilter} from "./GlobalFilter";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

export default function Table({ columns, data, type }) {

    const filterTypes = useMemo(
        () => ({
            text: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id];
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true;
                });
            }
        }),
        []
    );

    const defaultColumn = useMemo(
        () => ({
            Filter: DefaultColumnFilter
        }),
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        visibleColumns,
        preGlobalFilteredRows,
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            filterTypes
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        useExpanded
    );

    const dispatch = useDispatch();
    const handleDelete = (serviceID) => {
        fetch("/services="+serviceID, { method: 'DELETE' })
                .then(async response => {
                    if (type === 'services') {
                        dispatch(requestServices(''));
                    }
                    setTimeout(deleteAlert, 1000)
                    const data = await response.json();

                    if (!response.ok) {
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    }
                })
    }

    function deleteAlert() {
        alert("Delete successful");
    }

    return (
        <>
            <div
                colSpan={visibleColumns.length}
                style={{
                    textAlign: "left"
                }}>
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={state.globalFilter}
                    setGlobalFilter={setGlobalFilter} />
            </div>
            <MaUTable className={"table"} {...getTableProps()}>
                <TableHead className={"table head"}>
                {headerGroups.map(headerGroup => (
                    <TableRow className={"headers"} {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <TableCell className={"header columns"}
                                       {...column.getHeaderProps(column.getSortByToggleProps())} style={{color:"white"}}>
                                {column.render("Header")}
                                <span style={{color:'white'}}>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                                {/*<div>{column.canFilter ? column.render("Filter") : null}</div>*/}
                            </TableCell>
                        ))}
                        <TableCell/>
                    </TableRow>
                ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <TableRow className={"data"} {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <TableCell {...cell.getCellProps()} style={{color:'white'}}>{cell.render("Cell")}</TableCell>;
                            })}
                            {!row.id.includes(".") && <TableCell><button onClick={() => handleDelete(row.original.serviceid)}>X</button></TableCell>}
                        </TableRow>
                    );
                })}
                </TableBody>
            </MaUTable>
        </>
    );
}