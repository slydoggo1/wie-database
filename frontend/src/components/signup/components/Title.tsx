interface TitleProps {
    children: React.ReactNode;
    className?: string;
    innerRef?: React.MutableRefObject<HTMLDivElement | null>;
}

export default function Title({ children, className, innerRef }: TitleProps) {
    return (
        <div ref={innerRef}>
            <h1 className={`text-2xl font-bold text-primary-100 ${className}`}>{children}</h1>
        </div>
    );
}
