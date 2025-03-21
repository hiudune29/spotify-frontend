const DividerWithText = ({ text }) => {
    return (
        <div className="flex items-center justify-center w-full my-4">
            <div className="w-full h-[1px] bg-gray-600"></div>
            <span className="px-2 text-gray-200 text-sm">{text}</span>
            <div className="w-full h-[1px] bg-gray-600"></div>
        </div>
    );
};

export default DividerWithText;