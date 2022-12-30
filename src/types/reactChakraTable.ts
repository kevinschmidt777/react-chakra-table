import { ButtonProps, IconButtonProps } from "@chakra-ui/react";
import {
  CellContext,
  ColumnFiltersState,
  Row,
  SortingState,
} from "@tanstack/react-table";

interface ReactChakraTableColumn {
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
  onRowClick?: (row?: Row<any>) => void;
}
