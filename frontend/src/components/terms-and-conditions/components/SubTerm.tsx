export default function SubTerm({ title, term }) {
    return (
        <div className="mt-4">
            <p className="font-extrabold text-lg">{title}</p>
            <p>{term}</p>
        </div>
    );
}
