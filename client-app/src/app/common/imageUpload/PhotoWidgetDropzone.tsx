import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Header, Icon } from 'semantic-ui-react';

interface Props {
    setFiles: (files: any) => void;
}

export default function PhotoWidgetDropzone({setFiles}: Props) {

    const dzStyles = {
        border: 'dashed 3px #eee',
        borderColor: '#eee',
        borderRadius: '5px',
        paddingTop: '30px',
        textAlign: 'center' as 'center',
        height: 200
    };

    const dzActive = {
        borderColor: 'green'
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {        
        setFiles(acceptedFiles.map((f: any) => Object.assign(f, {
            preview: URL.createObjectURL(f)
        })));
        console.log(acceptedFiles);
    }, [setFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()} style={isDragActive ? {...dzStyles, ...dzActive} : dzStyles}>
            <input {...getInputProps()} />
            <Icon name='upload' size='huge' />
            <Header content='Drop image here' />
        </div>
    );
}