const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent mb-4"
                role="status"
            >
                <span className="sr-only">Carregando...</span>
            </div>
            <span className="text-black text-lg">Carregando...</span>
        </div>
    );
};

export default Loading;
