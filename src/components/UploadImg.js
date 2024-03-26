import React, { Component } from 'react';
 
class UploadImg extends Component {
 
    fileObj = [];
    fileArray = [];
    fileArray1 = [];
 
    constructor(props) {
        super(props)
        this.state = {
            file: [null]
        }
        this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this)
        this.uploadFiles = this.uploadFiles.bind(this)
    }
 
    uploadMultipleFiles(e) {
        this.fileObj.push(e.target.files)
        for (let i = 0; i < this.fileObj[0].length; i++) {
            this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]));
            this.fileArray1.push(this.fileObj[0][i]);
        }
        this.setState({ file: this.fileArray });
        // console.log(this.fileArray1);
        this.props.files(this.fileArray1);
    }
 
    uploadFiles(e) {
        e.preventDefault()
        console.log(this.state.file)
    }
 
    render() {
        return (
            <form>
                <div className="form-group">
                    <input type="file" className="form-control" name="uploadedImages" onChange={this.uploadMultipleFiles} multiple />
                </div>

                <div className="form-group multi-preview">
                    {(this.fileArray || []).map(url => (
                        <img style={{marginRight : '20px'}} src={url} alt="..." height={100} width={100}/>
                    ))}
                </div>
            </form >
        )
    }
}

export default UploadImg