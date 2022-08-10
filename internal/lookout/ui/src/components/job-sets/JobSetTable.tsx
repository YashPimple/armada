import React from "react"

import { TableCellProps, Table } from "react-virtualized"
import { Column, defaultTableCellRenderer } from "react-virtualized"

import { JobSetColumnWeights } from "../../containers/JobSetsContainer"
import { JobSet } from "../../services/JobService"
import CheckboxHeaderRow from "../CheckboxHeaderRow"
import CheckboxRow from "../CheckboxRow"
import LinkCell from "../LinkCell"
import SortableHeaderCell from "../SortableHeaderCell"
import "./JobSetTable.css"

interface JobSetTableProps {
  height: number
  width: number
  jobSets: JobSet[]
  selectedJobSets: Map<string, JobSet>
  newestFirst: boolean
  onJobSetClick: (jobSet: string, state: string) => void
  onSelectJobSet: (index: number, selected: boolean) => void
  onShiftSelectJobSet: (index: number, selected: boolean) => void
  onDeselectAllClick: () => void
  onSelectAllClick: () => void
  onOrderChange: (newestFirst: boolean) => void
  columnWeights: JobSetColumnWeights
}

function cellRendererForState(
  cellProps: TableCellProps,
  onJobSetClick: (jobSet: string, state: string) => void,
  state: string,
) {
  if (cellProps.cellData) {
    return <LinkCell onClick={() => onJobSetClick((cellProps.rowData as JobSet).jobSetId, state)} {...cellProps} />
  }
  return defaultTableCellRenderer(cellProps)
}

export default function JobSetTable(props: JobSetTableProps) {
  return (
    <div
      style={{
        height: props.height,
        width: props.width,
      }}
    >
      <Table
        rowGetter={({ index }) => props.jobSets[index]}
        rowCount={props.jobSets.length}
        rowHeight={40}
        headerHeight={60}
        height={props.height}
        width={props.width}
        headerClassName="job-set-table-header"
        rowRenderer={(tableRowProps) => {
          return (
            <CheckboxRow
              isChecked={props.selectedJobSets.has(tableRowProps.rowData.jobSetId)}
              onChangeChecked={(selected) => props.onSelectJobSet(tableRowProps.index, selected)}
              onChangeCheckedShift={(selected) => props.onShiftSelectJobSet(tableRowProps.index, selected)}
              tableKey={tableRowProps.key}
              {...tableRowProps}
            />
          )
        }}
        headerRowRenderer={(tableHeaderRowProps) => {
          const jobSetsAreSelected = props.selectedJobSets.size > 0
          const noJobSetsArePresent = props.jobSets.length == 0
          return (
            <CheckboxHeaderRow
              checked={jobSetsAreSelected}
              disabled={!jobSetsAreSelected && noJobSetsArePresent}
              onClick={jobSetsAreSelected ? () => props.onDeselectAllClick() : props.onSelectAllClick}
              {...tableHeaderRowProps}
            />
          )
        }}
      >
        <Column dataKey="jobSetId" width={props.columnWeights.jobSetId * props.width} label="Job Set" />
        <Column
          dataKey="latestSubmissionTime"
          width={props.columnWeights.latestSubmissionTime * props.width}
          label="Submission Time"
          headerRenderer={(cellProps) => (
            <SortableHeaderCell
              name="Submission Time"
              descending={props.newestFirst}
              className="job-set-submission-time-header-cell"
              onOrderChange={props.onOrderChange}
              {...cellProps}
            />
          )}
        />
        <Column
          dataKey="jobsQueued"
          width={props.columnWeights.jobsQueued * props.width}
          label="Queued"
          className="job-set-table-number-cell"
          cellRenderer={(cellProps) => cellRendererForState(cellProps, props.onJobSetClick, "Queued")}
        />
        <Column
          dataKey="jobsPending"
          width={props.columnWeights.jobsPending * props.width}
          label="Pending"
          className="job-set-table-number-cell"
          cellRenderer={(cellProps) => cellRendererForState(cellProps, props.onJobSetClick, "Pending")}
        />
        <Column
          dataKey="jobsRunning"
          width={props.columnWeights.jobsRunning * props.width}
          label="Running"
          className="job-set-table-number-cell"
          cellRenderer={(cellProps) => cellRendererForState(cellProps, props.onJobSetClick, "Running")}
        />
        <Column
          dataKey="jobsSucceeded"
          width={props.columnWeights.jobsSucceeded * props.width}
          label="Succeeded"
          className="job-set-table-number-cell"
          cellRenderer={(cellProps) => cellRendererForState(cellProps, props.onJobSetClick, "Succeeded")}
        />
        <Column
          dataKey="jobsFailed"
          width={props.columnWeights.jobsFailed * props.width}
          label="Failed"
          className="job-set-table-number-cell"
          cellRenderer={(cellProps) => cellRendererForState(cellProps, props.onJobSetClick, "Failed")}
        />
      </Table>
    </div>
  )
}
