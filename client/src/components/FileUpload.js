import React, { useState } from 'react'
import Message from './Message';
import axios from 'axios';
import Progress from './Progress';
const FileUpload = () => {
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);


    const onChange = e => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    }

    const onSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: ProgressEvent => {
                    setUploadPercentage(parseInt(Math.round(ProgressEvent.loaded * 100) / ProgressEvent.total))
                    setTimeout(() => setUploadPercentage(0), 10000);
                },
            })

            const { fileName, filePath } = res.data
            setUploadedFile({ fileName, filePath })
            setMessage("file uploaded")
        } catch (error) {
            if (error.response.status === 500)
                setMessage('Erorr with the server')
            else
                setMessage(error.response.data.msg)
        };
    }
    return (
        <>
            {message ? <Message msg={message} /> : null}
            <form onSubmit={onSubmit}>
                <div className="custom-file mb-1">
                    {/* <label for="formFile" className="form-label">Default file input example</label> */}
                    <input className="form-control" type="file" id="formFile" onChange={onChange} />
                </div>

                <Progress percentage={uploadPercentage} />
                <input style={{ width: '100%' }} type="submit" value="Upload" className='btn btn-primary btn-block mt-3' />
            </form>
            {uploadedFile ? <div className='row mt-5'>
                <div className="col-md-6 m-auto">
                    <h3 className='text-center'>{uploadedFile.fileName}</h3>
                    <img style={{ width: '100%' }} src={uploadedFile.filePath} alt="" />
                </div>
            </div> : null}
        </>
    )
}

export default FileUpload