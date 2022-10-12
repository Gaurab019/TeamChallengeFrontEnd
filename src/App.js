// import logo from "./logo.svg";
require("dotenv").config();
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import "./App.css";
import { uploadImage, OCROperation } from "./Modules/cloudOperations";
import dropicon from "./images/dragdropfolder.svg";

function App() {
  const [files, setfiles] = useState([]);
  const [enableupload, setenableupload] = useState(true);
  const [uploadedfiles, setuploadedfiles] = useState([]);

  const dropAction = (droppedfiles) => {
    setfiles((currentarr) => [...currentarr, ...droppedfiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "PDF",
    onDrop: dropAction,
  });

  // const clickbutton = async () => {
  //   const res = await uploadImage(
  //     "http://localhost:3001/uploadImage",
  //     files[0]
  //   );
  //   const uploadedack = res.data;
  //   setdata(uploadedack);
  // };
  const clickbutton = () => {
    files.forEach((file) => {
      (async () => {
        let response = await uploadImage(process.env.SERVERURI_UPLOAD, file);
        setuploadedfiles((current) => [...current, response.data]);

        if (response.data.uploadstatus === "File Upload Complete") {
          response = await OCROperation(process.env.SERVERURI_READIMAGE, file);
          setuploadedfiles((current) => {
            return current.map((element) => {
              element.ocrstatus = response.data.ocrstatus;
              element.dbuploadstatus = response.data.dbuploadstatus;
              return element;
            });
          });
          console.log(response.data);
        }
        // setuploadedfiles((current) => {
        //   return current.map((element) => {
        //     element.dbuploadstatus = "DBUpload Completed";
        //     return element;
        //   });
        // });
      })();
    });
  };

  return (
    <div className="App">
      <div className="workablediv dropdiv" {...getRootProps()}>
        <input className="inputsection" {...getInputProps()} />
        <img src={dropicon} alt="dropicon" />
        {isDragActive ? (
          <p>
            <em>Drop the files here ...</em>
          </p>
        ) : (
          <p>
            <em>Drag 'n' drop some files here, or click to select files</em>
          </p>
        )}
      </div>{" "}
      {files && files.length > 0 && enableupload ? (
        <button onClick={clickbutton} enabled>
          Upload Files
        </button>
      ) : (
        <button onClick={clickbutton} disabled>
          Upload Files
        </button>
      )}
      <div>
        {files &&
          files.map((element, idx) => {
            return (
              <h4 className="droppedelement" key={idx}>
                {element.name}
              </h4>
            );
          })}
      </div>
      {uploadedfiles.length > 0 ? (
        <div className="workablediv droppedfilesdiv">
          {uploadedfiles.map((element, idx) => {
            return (
              <div className="statusdiv">
                <h3 className="droppedelement" key={idx}>
                  {element.filename}
                </h3>
                <h3
                  className={
                    element.uploadstatus === "File Upload Complete"
                      ? "success"
                      : "failure"
                  }
                  key={idx + 1}
                >
                  {element.uploadstatus}
                </h3>
                {element.ocrstatus.length > 0 && (
                  <h3
                    className={
                      element.ocrstatus === "OCR Upload Complete"
                        ? "success"
                        : "failure"
                    }
                    key={idx + 2}
                  >
                    {element.ocrstatus}
                  </h3>
                )}
                {element.dbuploadstatus.length > 0 && (
                  <h3
                    className={
                      element.dbuploadstatus === "DB Upload Complete"
                        ? "success"
                        : "failure"
                    }
                    key={idx + 3}
                  >
                    {element.dbuploadstatus}
                  </h3>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        void 1
      )}
    </div>
  );
}

export default App;
