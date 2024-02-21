interface RequestChangesProps {
    changes: string;
}

export default function RequestChanges({ changes }: RequestChangesProps) {
    return (
        <div className="bg-red-100 px-4 py-2 xl:px-10 xl:py-7 rounded-md mb-3">
            <h1 className="text-lg font-bold text-red-500">Your profile has been reviewed</h1>
            <h3>They have requested the following changes:</h3>
            <p>{changes}</p>
        </div>
    );
}
