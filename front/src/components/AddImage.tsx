import React from 'react';
import { Button } from 'react-bootstrap';

export interface AddImageProps {
    exportPicture: (f: File) => void,
}

export class AddImage extends React.Component<AddImageProps> {
    private fileInput: React.RefObject<HTMLInputElement>;

    constructor(props: AddImageProps) {
        super(props);
        this.fileInput = React.createRef();
        this.loadPicture = this.loadPicture.bind(this);
    }

    private loadPicture() {
        if (this.fileInput.current === null || this.fileInput.current.files === null)
            return;
        this.props.exportPicture(this.fileInput.current.files[0]);
    }

    render() {
        return (
            <div className="bg-dark text-center add-picture">
                <Button onClick={() => this.fileInput.current?.click()} variant="success">Ajouter une photo</Button>
                <p className="text-muted">Taille limitée à 1&nbsp;Mo</p>
                <form encType="multipart/form-data">
                    <input type="file" ref={this.fileInput} onChange={this.loadPicture} name="picture" />
                </form>
            </div>
        );
    }
}
