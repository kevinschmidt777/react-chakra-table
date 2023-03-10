import {
  CellContext,
  Column,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import {
  Button,
  Center,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Input,
  Table as ChakraTable,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  ButtonProps,
  IconButtonProps,
  TableContainerProps,
  Box,
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  ArrowDownIcon,
  ArrowForwardIcon,
  ArrowUpIcon,
  DownloadIcon,
} from "@chakra-ui/icons";
import { downloadExcel } from "react-export-table-to-excel";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { numberFormatter } from "./utils/numbers";
import { getDate, isDate } from "./utils/date";

export interface ReactChakraTableColumn {
  accessorFn: (row: any) => void;
  id: string;
  cell: (info: CellContext<any, unknown>) => void;
  aggregatedCell?: (info: CellContext<any, unknown>) => void;
  header: string;
  enableColumnFilters?: boolean;
}

export interface ReactChakraTableProps {
  columns: ReactChakraTableColumn[];
  dateColumns: string[];
  data: any[];
  amountText?: string;
  exportText?: string;
  language?: string;
  sortIconColor?: string;
  sortIconUp?: any;
  sortIconDown?: any;
  exportIcon?: any;
  paginationPageButtonProps?: ButtonProps;
  paginationNextPrevButtonProps?: IconButtonProps;
  paginationNextIcon?: any;
  paginationPrevIcon?: any;
  exportButtonProps?: ButtonProps;
  filterByText?: string;
  defaultSorting?: SortingState;
  defaultFiltering?: ColumnFiltersState;
  itemsPerPage?: number;
  tableContainerProps?: TableContainerProps;
  onRowClick?: (row?: Row<any>) => void;
}

/**
 * Displays a table-grid, based on ChakraUI, with filtering and sorting options.
 * For further details visit: https://github.com/kevinschmidt777/react-chakra-table/
 * @returns
 */
const ReactChakraTable = (props: ReactChakraTableProps) => {
  const [sorting, setSorting] = useState<SortingState>(
    props.defaultSorting ? props.defaultSorting : []
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    props.defaultFiltering ? props.defaultFiltering : []
  );
  const [page, setPage] = useState<number>(1);

  // Prepaire final columns for table.
  const columns: any[] = [];
  for (const column of props.columns) {
    columns.push({
      ...column,
      filterFn: "ownFilter",
      enableColumnFilter: true,
    });
  }

  /**
   * Using a own filter function, to be able to reformat date columns before filtering.
   */
  const filterFunction: FilterFn<any> = (row, columnId, value) => {
    let string = row.getValue(columnId) as string;
    // If date, reformat!
    if (isDate(string)) string = getDate(string, true, props.language);
    return string.toLowerCase().includes(value.toLowerCase());
  };

  const table = useReactTable({
    data: props.data,
    columns: columns,
    filterFns: {
      ownFilter: filterFunction,
    },
    state: {
      sorting,
      columnFilters: columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const pagesCounter = props.itemsPerPage
    ? Math.ceil(table.getRowModel().rows.length / props.itemsPerPage)
    : 1;

  const dataItem = (row: Row<any>) => (
    <Tr
      key={row.id}
      cursor={props.onRowClick ? "pointer" : "inherit"}
      onClick={() => (props.onRowClick ? props.onRowClick(row.original) : null)}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <Td key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Td>
        );
      })}
    </Tr>
  );

  const filterInput = (column: Column<any, unknown>) => (
    <Input
      defaultValue={column.getFilterValue() as string}
      onChange={(value) => column.setFilterValue(value.target.value)}
      placeholder={props.filterByText ? props.filterByText : "Filter by..."}
      size="sm"
      mt="1"
      ml="-2"
    />
  );

  const tableRenderer = (
    <TableContainer {...props.tableContainerProps}>
      <ChakraTable>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Th key={header.id} verticalAlign="top">
                    {header.isPlaceholder ? null : (
                      <Text
                        cursor="pointer"
                        onClick={header.column.getToggleSortingHandler()}
                        display="flex"
                        alignItems="center"
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: (
                            <Icon
                              as={
                                props.sortIconUp
                                  ? props.sortIconUp
                                  : ArrowUpIcon
                              }
                              color={props.sortIconColor}
                              w="4"
                              h="4"
                              ml="1"
                            />
                          ),
                          desc: (
                            <Icon
                              as={
                                props.sortIconDown
                                  ? props.sortIconDown
                                  : ArrowDownIcon
                              }
                              color={props.sortIconColor}
                              w="4"
                              h="4"
                              ml="1"
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? null}
                      </Text>
                    )}
                    {header.column.getCanFilter()
                      ? filterInput(header.column)
                      : null}
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {props.itemsPerPage
            ? table
                .getRowModel()
                .rows.slice(
                  page === 1 ? 0 : (page - 1) * props.itemsPerPage,
                  page * props.itemsPerPage
                )
                .map((row) => dataItem(row))
            : table.getRowModel().rows.map((row) => dataItem(row))}
        </Tbody>
      </ChakraTable>
    </TableContainer>
  );

  const paginationPageButtons = () => {
    const pagesArray = [];
    for (let i = 1; i <= pagesCounter; i++) {
      // @ts-ignore
      pagesArray.push(i);
    }
    return pagesArray.map((item) => (
      <Button
        key={item}
        onClick={() => setPage(item)}
        {...props.paginationPageButtonProps}
        opacity={page === item ? 1 : 0.5}
        _hover={{
          opacity: 1,
        }}
      >
        {item}
      </Button>
    ));
  };

  const paginationRenderer = (
    <Box maxWidth="full" overflowX="auto" mt="5">
      <HStack spacing="2">
        <IconButton
          aria-label="<"
          icon={
            <Icon
              as={
                props.paginationPrevIcon
                  ? props.paginationPrevIcon
                  : ArrowBackIcon
              }
            />
          }
          isDisabled={page === 1}
          onClick={() => setPage((prevPage) => prevPage - 1)}
          {...props.paginationNextPrevButtonProps}
        />
        {paginationPageButtons()}
        <IconButton
          aria-label=">"
          icon={
            <Icon
              as={
                props.paginationNextIcon
                  ? props.paginationNextIcon
                  : ArrowForwardIcon
              }
            />
          }
          isDisabled={page === pagesCounter}
          onClick={() => setPage((prevPage) => prevPage + 1)}
          {...props.paginationNextPrevButtonProps}
        />
      </HStack>
    </Box>
  );

  /**
   * Prepairs data for excel export and downloads file.
   */
  const downloadExcelHandler = () => {
    const lang = props.language ? props.language : "en";
    dayjs.extend(LocalizedFormat);
    dayjs.locale(lang);
    let headersObject: any = {};
    const headers: string[] = [];
    for (const item of table.getHeaderGroups()[0].headers) {
      headersObject = {
        ...headersObject,
        [item.column.columnDef.id as string]: item.column.columnDef.header,
      };
      headers.push(item.column.columnDef.header as string);
    }

    const body = [];
    for (const item of table.getRowModel().rows) {
      const headerKeys = Object.keys(headersObject);
      let prepairedNewBodyItem = {};
      for (const head of headerKeys) {
        prepairedNewBodyItem = {
          ...prepairedNewBodyItem,
          [headersObject[head]]: props.dateColumns.includes(head)
            ? getDate(item.original[head], true, props.language)
            : item.original[head],
        };
      }
      // @ts-ignore
      body.push(prepairedNewBodyItem);
    }

    return downloadExcel({
      fileName: "export-" + getDate(undefined, false, props.language) + ".xls",
      sheet: "export-" + getDate(undefined, false, props.language),
      tablePayload: {
        header: headers,
        body: body,
      },
    });
  };

  return (
    <>
      <Grid templateColumns={{ base: "1fr", md: "1fr auto" }} gap="2">
        <GridItem>
          {props.amountText && (
            <Text fontSize="md" color="gray.200">
              {props.amountText}:{" "}
              {numberFormatter(table.getRowModel().rows.length)}
            </Text>
          )}
        </GridItem>
        <GridItem>
          {props.exportText && (
            <Button
              mb="2"
              mr="2"
              onClick={() => downloadExcelHandler()}
              leftIcon={
                <Icon
                  as={props.exportIcon ? props.exportIcon : DownloadIcon}
                  w="5"
                  h="5"
                />
              }
              {...props.exportButtonProps}
            >
              {props.exportText}
            </Button>
          )}
        </GridItem>
      </Grid>
      {tableRenderer}
      {props.itemsPerPage && pagesCounter > 1 && paginationRenderer}
    </>
  );
};

export default ReactChakraTable;
