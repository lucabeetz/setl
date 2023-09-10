import React, { useRef, useState } from "react";

function FileDropZone(props: any) {
    const [isDragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState([]); // New state

    // The rest of the drag-and-drop handlers remain the same...

    const handleFileInput = (e) => {
        let files = Array.from(e.target.files);
        setSelectedFiles(prevFiles => [...prevFiles, ...files]); // Set the state
        if (props.onFilesAdded) {
            props.onFilesAdded(files);
        }
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        let files = e.dataTransfer.files;
        console.log("files", files)
        setSelectedFiles(prevFiles => [...prevFiles, ...files]); // Set the state
        if (props.onFilesAdded) {
            props.onFilesAdded(files);
        }

        setDragOver(false);
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="flex flex-col text-center">
            <div
                className={`border-2 border-dashed border-gray-400 rounded w-72 h-48 flex items-center justify-center cursor-pointer transition-colors duration-300 ${isDragOver ? "bg-blue-100" : "hover:bg-gray-200"}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                Drop your files here
                <input
                    className="hidden"
                    type="file"
                    ref={fileInputRef}
                    multiple
                    style={{ display: "none" }}
                    onChange={handleFileInput}
                />
            </div>
            <ul className="mt-4">
                {selectedFiles.map(file => (
                    <li key={file.name} className="text-sm mt-2">{file.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default FileDropZone;
