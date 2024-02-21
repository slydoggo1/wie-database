import DeleteIcon from '@mui/icons-material/Delete';

interface EngineerTableRowProps {
    profilePictureURL: string;
    name: string;
    professionalTitle: string;
    email: string;
    onDelete?: () => void;
}

export default function EngineerTableRow({
    profilePictureURL,
    professionalTitle,
    name,
    email,
    onDelete,
}: EngineerTableRowProps) {
    return (
        <tr className="hover:bg-[#F5F1F5] rounded-md">
            <td>
                <div className="pl-4 py-3 flex">
                    <div className="rounded-full h-12 w-12">
                        <img
                            src={profilePictureURL}
                            alt="Engineer Profile Picture"
                            className="rounded-full w-full h-full  object-cover object-center bg-gray-300 "
                        />
                    </div>
                    <div className="px-4">
                        <h4 className="font-semibold ">{name}</h4>
                        <h5 className="text-[#7F7194]">{professionalTitle}</h5>
                    </div>
                </div>
            </td>
            <td>
                <div>{email}</div>
            </td>
            <td className="">
                <div className="justify-end flex pr-3">
                    {onDelete && <DeleteIcon className="hover:cursor-pointer" onClick={onDelete} />}
                </div>
            </td>
        </tr>
    );
}
