import { ReactNode } from 'react';

interface TableProps {
    titles: string[];
    children: ReactNode;
    className?: string;
}

/**
 *
 * @param titles array of column titles
 * @param children the table children, note that these need to be tr components
 * @param className the className to add to the wrapper
 * @returns Table Component
 */
export default function Table({ titles, className, children }: TableProps) {
    return (
        <table className={`border-collapse text-left table-auto w-full relative ${className}`}>
            <thead className="sticky top-0 bg-white">
                <tr>
                    {titles.map((title, index) => (
                        <th key={`${title}-${index}`}>{title}</th>
                    ))}
                </tr>
            </thead>
            <tbody>{children}</tbody>
        </table>
    );
}
