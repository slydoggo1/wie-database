import DeleteIcon from '@mui/icons-material/Delete';

interface UserTableRowProps {
    id: string;
    name: string;
    role: string;
    email: string;
    onDelete?: (id: string) => void;
}

export default function UserTableRow({ id, name, role, email, onDelete }: UserTableRowProps) {
    return (
        <tr className="hover:bg-[#F5F1F5] rounded-md">
            <td>
                <div className="pl-4 py-3 font-semibold">{name}</div>
            </td>
            <td>
                <div>{role}</div>
            </td>
            <td>
                <div>{email}</div>
            </td>
            <td className="">
                <div className="justify-end flex pr-3">
                    {onDelete && <DeleteIcon className="hover:cursor-pointer" onClick={() => onDelete(id)} />}
                </div>
            </td>
        </tr>
    );
}
