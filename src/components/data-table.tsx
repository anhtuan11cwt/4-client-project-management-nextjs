"use client";
"use no memo";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	emptyMessage?: string;
	searchKeys?: Array<keyof TData & string>;
	searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchKeys,
	searchPlaceholder = "Tìm kiếm...",
	emptyMessage = "Không tìm thấy kết quả nào.",
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState("");

	const filteredData = useMemo(() => {
		const query = globalFilter.trim().toLowerCase();
		if (!query || !searchKeys?.length) return data;
		return data.filter((row) =>
			searchKeys.some((key) => {
				const value = row[key];
				return value != null && String(value).toLowerCase().includes(query);
			}),
		);
	}, [data, globalFilter, searchKeys]);

	// eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table's API cannot be memoized safely; file is opted out of React Compiler.
	const table = useReactTable({
		columns,
		data: filteredData,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		state: { sorting },
	});

	return (
		<div className="space-y-4">
			{searchKeys?.length ? (
				<div className="relative max-w-sm">
					<Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						className="pl-8"
						onChange={(event) => setGlobalFilter(event.target.value)}
						placeholder={searchPlaceholder}
						value={globalFilter}
					/>
				</div>
			) : null}
			<div className="rounded-lg border bg-card">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									className="h-24 text-center text-muted-foreground text-sm"
									colSpan={columns.length}
								>
									{emptyMessage}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
