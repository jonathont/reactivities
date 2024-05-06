import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Grid, Header } from 'semantic-ui-react';
import PhotoWidgetDropzone from './PhotoWidgetDropzone';
import PhotoWidgetCropper from './PhotoWidgetCropper';

interface Props {
    loading: boolean;
    uploadPhoto: (file: Blob) => void;
}

export default observer(function PhotoUploadWidget({ loading, uploadPhoto }: Props) {

    const [files, setFiles] = useState<any[]>([]);
    const [cropper, setCropper] = useState<Cropper>();


    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
        }
    }

    useEffect(() => {
        return () => {
            files.forEach(f => {
                URL.revokeObjectURL(f.preview);
            });
        }
    }, [files]);

    return (
        <Grid>
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 1 - Add Photo' />
                <PhotoWidgetDropzone setFiles={setFiles} />
            </Grid.Column>

            <Grid.Column width={2} />

            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 2 - Resize image' />
                {files && files.length > 0 &&
                    // <Image src={files[0].preview} />
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
                }
            </Grid.Column>

            <Grid.Column width={2} />

            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 2 - Preview & Upload' />
                <>
                    <div className='image-preview' style={{ overflow: 'hidden', aspectRatio: 1 }}></div>
                    {files && files.length > 0 &&
                        <div className='ui two buttons'>
                            <Button.Group widths={2}>
                                <Button onClick={onCrop} loading={loading} positive icon='check' />
                                <Button onClick={() => setFiles([])} disabled={loading} icon='close' />
                            </Button.Group>
                        </div>
                    }
                </>
            </Grid.Column>
        </Grid>
    );
});