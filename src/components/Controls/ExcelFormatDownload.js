import axios from "axios";
export const excelFormatDownload = async (downloadLink, fileName) => {
    try{
        await axios({
          url: `${downloadLink}`,
          method: 'GET',
          responseType: 'blob',
        }).then((response) => {
           const url = window.URL.createObjectURL(new Blob([response.data]));
           const link = document.createElement('a');
           link.href = url;
           link.setAttribute('download', `${fileName}.xlsx`);
           document.body.appendChild(link);
           link.click();
        });
      } catch(error){
        console.log(error)
      }
};


