import React from "react";

export default function Message({ content, classStyle }) {
    const { text, file } = content; // Destructure content object
    function getFileTypeFromUrl(url) {
        // Extract the file extension
        const extension = url.split('.').pop().split('?')[0].toLowerCase(); // Handles query parameters and case
      
        // Define the mappings for image and video file types
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm'];
      
        // Determine the file type based on the extension
        if (imageExtensions.includes(extension)) {
          return 'Image';
        } else if (videoExtensions.includes(extension)) {
          return 'Video';
        } else {
          return 'Unknown'; // Optionally handle other types or cases
        }
      }
    return (
        <div className={`max-w-screen-md w-fit p-4 rounded-lg shadow-sm ${classStyle}`}>
            {content.content.file ? (
                <div className="flex flex-col items-center">
                    {getFileTypeFromUrl(content.content.file) === 'Image' ? <img
                        src={content.content.file} 
                        alt="Attached"
                        className="max-w-full max-h-40 object-cover rounded-lg"
                    />: 
                    <video autoPlay
                    src={content.content.file} 
                        alt="Attached"
                        className="max-w-full max-h-40 object-cover rounded-lg"/>
                    }
                </div>
            ) : (
                <h1 className="text-md break-words">{content.content.content}</h1>
            )}
        </div>
    );
}
