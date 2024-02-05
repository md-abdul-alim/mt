import React from "react";
// import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

function BarcodeScanner(props) {
  const { setOpen, setSearchValue, setOpenPopup2 } = props;

  const [data, setData] = React.useState("Please show barcode to scan");

  return (
    <>
      <BarcodeScannerComponent
        style={{ textAlign: "center" }}
        width={"100%"}
        height={500}
        onUpdate={(err, result) => {
          
          if (result) {
            if (data === "Please show barcode to scan") {
              if (result.text.length === 13){
                setData("Barcode Found: " +  result.text );
                setOpenPopup2(true);
                setSearchValue(result.text);
                setTimeout(function() {
                  setOpen(false)
              }, 100);
                // setOpen(false)
              }
            }
          }
        }}
      />
      <p style={{ textAlign: "center" }}>{data}</p>
    </>
  );
}

export default BarcodeScanner;
