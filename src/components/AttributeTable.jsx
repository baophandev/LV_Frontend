import { Table, TableCell, TableRow } from "@mui/material";


const AttributeTable = () => {
    return (
      <div>
        <Table>
          <TableRow>
            <TableCell className="text-sky-500 ">Hệ điều hành:</TableCell>
            <TableCell>Android 11</TableCell>
          </TableRow>
          <TableRow className="bg-gray-100">
            <TableCell className="text-sky-500">CPU:</TableCell>
            <TableCell>Snapgragon 8 gen 2</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-sky-500">Ram:</TableCell>
            <TableCell>4GB</TableCell>
          </TableRow>
          <TableRow className="bg-gray-100">
            <TableCell className="text-sky-500">Rom:</TableCell>
            <TableCell>64GB</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-sky-500">Camera:</TableCell>
            <TableCell>50MP</TableCell>
          </TableRow>
          <TableRow className="bg-gray-100">
            <TableCell className="text-sky-500">Pin:</TableCell>
            <TableCell>10.000MAH</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-sky-500">Sim:</TableCell>
            <TableCell>2</TableCell>
          </TableRow>
          <TableRow className="bg-gray-100">
            <TableCell className="text-sky-500">Others:</TableCell>
            <TableCell>Dynamic island</TableCell>
          </TableRow>
        </Table>
      </div>
    );
}
 
export default AttributeTable;